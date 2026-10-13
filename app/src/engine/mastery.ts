// "Orientador virtual": decide avançar, repetir, voltar um passo ou revisar —
// sempre gerando uma explicação legível para os adultos (explicabilidade).
import type { Skill } from '../curriculum/types';
import { BKT_MASTERY, bktRun, DEFAULT_BKT } from './bkt';
import {
  addDays, emptySkillState, REVIEW_INTERVALS,
  type BlockResult, type Decision, type Profile, type SkillState,
} from './model';

/** Critério de domínio: ≥ 90% de acerto de primeira, dentro do tempo-padrão, em 2 sessões. */
export const MASTERY_ACC = 0.9;
export const PASSES_TO_MASTER = 2;
export const REPEAT_ACC = 0.8;
export const STEP_BACK_ACC = 0.6;
export const STEP_BACK_STREAK = 2;

export function skillState(p: Profile, id: string): SkillState {
  if (!p.skills[id]) p.skills[id] = emptySkillState();
  return p.skills[id];
}

const pct = (x: number) => `${Math.round(x * 100)}%`;
const secs = (x: number) => `${x.toFixed(1).replace('.', ',')}s`;

/**
 * Aplica o resultado de um bloco ao perfil (mutável) e devolve as decisões tomadas.
 * `trackSkills` é a lista ordenada da trilha da habilidade.
 */
export function applyBlockResult(p: Profile, skill: Skill, trackSkills: Skill[], r: BlockResult): Decision[] {
  const st = skillState(p, skill.id);
  st.history = [...st.history, r].slice(-12);
  const acc = r.total ? r.firstTry / r.total : 0;
  const fluent = p.settings.untimed || r.avgTimeSec <= skill.stdTimeSec;
  const name = p.name;
  const out: Decision[] = [];
  const d = (kind: Decision['kind'], text: string) => out.push({ date: r.date, skillId: skill.id, kind, text });
  if (r.outcomes?.length) st.pKnown = bktRun(st.pKnown ?? DEFAULT_BKT.init, r.outcomes);
  const bktOk = p.settings.advanceModel !== 'regras+bkt' || (st.pKnown ?? 0) >= BKT_MASTERY;

  if (r.mode === 'revisao') {
    if (acc >= REPEAT_ACC) {
      st.reviewStage = Math.min(st.reviewStage + 1, REVIEW_INTERVALS.length - 1);
      const days = REVIEW_INTERVALS[st.reviewStage];
      st.nextReview = addDays(r.date, days);
      d('revisao', `${name} revisou "${skill.title}" e acertou ${pct(acc)}. Próxima revisão em ${days} dias.`);
    } else {
      st.reviewStage = 0;
      st.nextReview = addDays(r.date, 1);
      d('revisao', `${name} esqueceu um pouco de "${skill.title}" (${pct(acc)}). Vamos revisar de novo amanhã.`);
    }
    p.log = [...p.log, ...out].slice(-300);
    return out;
  }

  if (st.status === 'novo') st.status = 'aprendendo';
  const idx = trackSkills.findIndex((s) => s.id === skill.id);
  const track = skill.track;

  if (acc >= MASTERY_ACC && fluent) {
    st.passes += 1;
    st.lowStreak = 0;
    if (st.passes >= PASSES_TO_MASTER && !bktOk) {
      st.passes = PASSES_TO_MASTER;
      d('repeticao', `${name} acertou ${pct(acc)} em "${skill.title}", mas o modelo estatístico ainda estima ${pct(st.pKnown ?? 0)} de domínio (meta ${pct(BKT_MASTERY)}). Mais uma sessão para confirmar.`);
    } else if (st.passes >= PASSES_TO_MASTER) {
      st.status = 'dominado';
      st.masteredAt = r.date;
      st.reviewStage = 0;
      st.nextReview = addDays(r.date, REVIEW_INTERVALS[0]);
      d('dominio', `${name} dominou "${skill.title}": ${pct(acc)} de acerto, média de ${secs(r.avgTimeSec)} por item (meta ${secs(skill.stdTimeSec)}).`);
      if (p.tracks[track].pointer === idx && idx < trackSkills.length - 1) {
        p.tracks[track].pointer = idx + 1;
        const next = trackSkills[idx + 1];
        d('avanco', `Próximo passo: "${next.title}". Revisão de "${skill.title}" amanhã.`);
        if (next.step !== skill.step) {
          p.certificates = [...p.certificates, { track, step: skill.step, date: r.date }];
        }
      } else if (idx === trackSkills.length - 1 && !p.certificates.some((c) => c.track === track && c.step === skill.step)) {
        p.certificates = [...p.certificates, { track, step: skill.step, date: r.date }];
      }
    } else {
      d('repeticao', `${name} acertou ${pct(acc)} em "${skill.title}" no tempo certo. Mais uma sessão assim para confirmar o domínio.`);
    }
  } else if (acc >= MASTERY_ACC && !fluent) {
    st.lowStreak = 0;
    d('fluencia', `${name} acertou ${pct(acc)} em "${skill.title}", mas ainda com calma (média ${secs(r.avgTimeSec)}, meta ${secs(skill.stdTimeSec)}). Vai praticar mais para ganhar fluência.`);
  } else if (acc >= STEP_BACK_ACC) {
    st.lowStreak = 0;
    st.passes = Math.max(0, st.passes - (acc < REPEAT_ACC ? 1 : 0));
    d('repeticao', acc < REPEAT_ACC
      ? `${name} acertou ${pct(acc)} em "${skill.title}". Vai repetir o bloco com mais dicas.`
      : `${name} acertou ${pct(acc)} em "${skill.title}". Está quase lá — vai praticar mais um pouco.`);
  } else {
    st.lowStreak += 1;
    st.passes = 0;
    if (st.lowStreak >= STEP_BACK_STREAK && idx > 0 && p.tracks[track].pointer === idx) {
      st.lowStreak = 0;
      const prev = trackSkills[idx - 1];
      p.tracks[track].pointer = idx - 1;
      const ps = skillState(p, prev.id);
      ps.status = 'aprendendo';
      ps.passes = Math.min(ps.passes, PASSES_TO_MASTER - 1);
      d('retrocesso', `${name} teve dificuldade em "${skill.title}" duas vezes (${pct(acc)}). Voltamos um degrau para "${prev.title}" para firmar a base — isso é normal no método de pequenos passos.`);
    } else {
      d('repeticao', `${name} acertou ${pct(acc)} em "${skill.title}". Vamos repetir com calma e dicas.`);
    }
  }
  p.log = [...p.log, ...out].slice(-300);
  return out;
}

/** Marca como dominadas (com revisão espaçada) as habilidades abaixo do ponto de partida do nivelamento. */
export function applyPlacement(p: Profile, trackSkills: Skill[], pointer: number, date: string): Decision {
  const track = trackSkills[0].track;
  p.tracks[track] = { pointer, placed: true };
  trackSkills.slice(0, pointer).forEach((s, i) => {
    const st = skillState(p, s.id);
    st.status = 'dominado';
    st.passes = PASSES_TO_MASTER;
    st.masteredAt = date;
    st.reviewStage = 1;
    st.pKnown = 0.95;
    // espalha as revisões para não sobrecarregar os primeiros dias
    st.nextReview = addDays(date, 1 + (i % 7));
  });
  const dec: Decision = {
    date,
    skillId: trackSkills[pointer].id,
    kind: 'nivelamento',
    text: `Nivelamento: ${p.name} começa em "${trackSkills[pointer].title}" — um passo confortável, abaixo do limite detectado, para ganhar confiança.`,
  };
  p.log = [...p.log, dec].slice(-300);
  return dec;
}

/** Revisões vencidas (mais atrasadas primeiro). */
export function dueReviews(p: Profile, date: string, enabledSkillIds: Set<string>): string[] {
  return Object.entries(p.skills)
    .filter(([id, s]) => s.status === 'dominado' && s.nextReview && s.nextReview <= date && enabledSkillIds.has(id))
    .sort((a, b) => (a[1].nextReview! < b[1].nextReview! ? -1 : 1))
    .map(([id]) => id);
}

/** Padrões de erro recorrentes (ex.: troca P/B), para alertar os adultos. */
export function errorPatterns(p: Profile, min = 3): { skillId: string; expected: string; chosen: string; count: number }[] {
  const counts = new Map<string, { skillId: string; expected: string; chosen: string; count: number }>();
  for (const e of p.errors) {
    const k = `${e.skillId}|${e.expected}|${e.chosen}`;
    const c = counts.get(k) ?? { skillId: e.skillId, expected: e.expected, chosen: e.chosen, count: 0 };
    c.count++;
    counts.set(k, c);
  }
  return [...counts.values()].filter((c) => c.count >= min).sort((a, b) => b.count - a.count);
}
