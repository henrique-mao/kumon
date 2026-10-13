import { useState } from 'react';
import type { Ctx } from '../App';
import { getSkill, SKILLS_BY_TRACK, stepsOf } from '../curriculum';
import type { TrackId } from '../curriculum/types';
import { Certificate } from '../components/Certificate';
import { ItemRunner } from '../components/ItemRunner';
import { Img } from '../components/Tokens';
import { createRng } from '../lib/rng';
import { errorPatterns } from '../engine/mastery';
import { addDays, today, TRACK_INFO, TRACKS, type Decision, type Profile } from '../engine/model';
import { daysActiveLast, masteredCount, minutesLast, recentAccuracy, streak, struggling } from '../engine/stats';
import { listVoices, speak } from '../lib/speech';
import { exportJson } from '../lib/storage';

const TABS = [
  ['progresso', 'Progresso'], ['orientador', 'Decisões do orientador'], ['relatorio', 'Relatório semanal'],
  ['certificados', 'Certificados'], ['previa', 'Prévia das atividades'], ['config', 'Configurações'], ['escola', 'Turma / Escola'], ['sobre', 'Método e privacidade'],
] as const;

const pct = (x: number | null) => (x === null ? '—' : `${Math.round(x * 100)}%`);
const fmt = (d: string) => d.split('-').reverse().slice(0, 2).join('/');

export function Parents({ ctx, tab: tab0 }: { ctx: Ctx; tab?: string }) {
  const [tab, setTab] = useState(tab0 ?? 'progresso');
  const profiles = ctx.data.profiles;
  const p = ctx.profile ?? profiles[0] ?? null;

  return (
    <div className="app adult">
      <div className="screen">
        <div className="row no-print">
          <button className="btn small" onClick={() => ctx.go(ctx.profile ? { name: 'inicio' } : { name: 'perfis' })}>◀ Sair da área dos adultos</button>
          <span className="spacer" />
          {profiles.length > 0 && (
            <select className="btn small" value={p?.id} onChange={(e) => ctx.selectProfile(e.target.value)} aria-label="criança">
              {profiles.map((x) => <option key={x.id} value={x.id}>{x.name} ({x.age} anos)</option>)}
            </select>
          )}
          <button className="btn small" onClick={() => ctx.go({ name: 'novo' })}>+ Criança</button>
        </div>
        <div className="tabs no-print" role="tablist">
          {TABS.map(([k, label]) => <button key={k} role="tab" aria-selected={tab === k} className={tab === k ? 'on' : ''} onClick={() => setTab(k)}>{label}</button>)}
        </div>
        {!p && tab !== 'sobre' ? <p>Nenhuma criança cadastrada ainda.</p> : (
          <>
            {tab === 'progresso' && p && <Progress p={p} />}
            {tab === 'orientador' && p && <DecisionLog p={p} />}
            {tab === 'relatorio' && p && <WeeklyReport p={p} />}
            {tab === 'certificados' && p && (
              p.certificates.length ? p.certificates.slice().reverse().map((c, i) => <Certificate key={i} name={p.name} cert={c} printable />)
                : <p className="muted">Os certificados aparecem quando a criança conclui um degrau inteiro.</p>
            )}
            {tab === 'config' && p && <Settings ctx={ctx} p={p} />}
            {tab === 'escola' && <School profiles={profiles} />}
            {tab === 'previa' && <Preview />}
            {tab === 'sobre' && <About />}
          </>
        )}
      </div>
    </div>
  );
}

function Progress({ p }: { p: Profile }) {
  const [open, setOpen] = useState<string | null>(null);
  const patterns = errorPatterns(p);
  const due = Object.values(p.skills).filter((s) => s.nextReview && s.nextReview <= today()).length;
  const lastPcpm = p.pcpm[p.pcpm.length - 1];
  return (
    <>
      <div className="kpis">
        <Kpi v={streak(p)} l="dias seguidos" />
        <Kpi v={`${daysActiveLast(p)}/7`} l="dias com prática na semana" />
        <Kpi v={minutesLast(p)} l="minutos na semana" />
        <Kpi v={masteredCount(p)} l="habilidades dominadas" />
        <Kpi v={due} l="revisões pendentes" />
        <Kpi v={lastPcpm ? lastPcpm.value : '—'} l="palavras por minuto (leitura oral)" />
      </div>
      {TRACKS.flatMap((t) => struggling(p, SKILLS_BY_TRACK[t])).map((s) => (
        <div key={s.id} className="alert">
          <strong>Atenção:</strong> {p.name} está com dificuldade em <em>{s.title}</em> (3+ blocos abaixo de 80%).
          <br />Sugestão para casa: {s.offlineTip}
        </div>
      ))}
      {patterns.slice(0, 4).map((e, i) => (
        <div key={i} className="alert">
          <strong>Padrão de erro:</strong> em <em>{getSkill(e.skillId)?.title}</em>, {p.name} escolheu “{e.chosen}” no lugar de “{e.expected}” {e.count} vezes.
          {' '}Trocas recorrentes (ex.: P/B, T/D, F/V, números espelhados) são comuns; se persistirem por meses, converse com a escola ou um fonoaudiólogo/psicopedagogo. Isto não é um diagnóstico.
        </div>
      ))}
      {TRACKS.filter((t) => p.settings.enabled[t]).map((t) => {
        const info = TRACK_INFO[t];
        const cur = SKILLS_BY_TRACK[t][p.tracks[t].pointer];
        return (
          <div key={t} className="card">
            <div className="row">
              <span className="track-tag" style={{ background: info.color }}><Img k={info.icon} /> {info.name}</span>
              <span>Agora: <strong>{cur?.step} · {cur?.title}</strong></span>
              <span className="spacer" />
              <span className="muted small">acerto recente {pct(recentAccuracy(p, SKILLS_BY_TRACK[t]))} · {masteredCount(p, SKILLS_BY_TRACK[t])}/{SKILLS_BY_TRACK[t].length} dominadas</span>
            </div>
            {stepsOf(t).map((s) => (
              <div key={s.step} style={{ marginTop: 10 }}>
                <div className="small muted" style={{ fontWeight: 800 }}>Degrau {s.step}</div>
                <div className="chips">
                  {s.skills.map((k) => {
                    const st = p.skills[k.id];
                    const status = st?.status ?? 'novo';
                    const rev = st?.nextReview && st.nextReview <= today();
                    return (
                      <button key={k.id} className={`chip ${status} ${rev ? 'revisao' : ''}`} onClick={() => setOpen(open === k.id ? null : k.id)}
                        title={`${k.objective}\nBNCC: ${k.bncc.join(', ')}`}>
                        {status === 'dominado' ? '✓ ' : status === 'aprendendo' ? '◐ ' : ''}{k.title}
                      </button>
                    );
                  })}
                </div>
                {s.skills.filter((k) => k.id === open).map((k) => {
                  const st = p.skills[k.id];
                  return (
                    <div key={k.id} className="card" style={{ marginTop: 8, background: '#fffaf2' }}>
                      <strong>{k.title}</strong>
                      <p style={{ margin: '4px 0' }}>{k.objective}</p>
                      <p className="small muted" style={{ margin: '4px 0' }}>BNCC: {k.bncc.join(', ')} · Técnicas: {k.techniques.join(', ')} · Tempo-padrão: {k.stdTimeSec}s por item</p>
                      {st?.history.length ? (
                        <p className="small" style={{ margin: '4px 0' }}>Histórico: {st.history.map((h) => `${fmt(h.date)} ${Math.round((h.firstTry / h.total) * 100)}%${h.mode === 'revisao' ? ' (rev.)' : ''}`).join(' · ')}</p>
                      ) : <p className="small muted">Ainda não praticada.</p>}
                      {st?.nextReview && <p className="small">Próxima revisão: {fmt(st.nextReview)}</p>}
                      <p className="small"><strong>Atividade offline:</strong> {k.offlineTip}</p>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        );
      })}
    </>
  );
}

const Kpi = ({ v, l }: { v: string | number; l: string }) => <div className="kpi"><div className="v">{v}</div><div className="l">{l}</div></div>;

const KIND_ICON: Record<Decision['kind'], string> = {
  avanco: '⬆️', dominio: '🏅', repeticao: '🔁', retrocesso: '↩️', revisao: '🗓️', pausa: '🌬️', nivelamento: '🧭', fluencia: '⏱️',
};

function DecisionLog({ p }: { p: Profile }) {
  if (!p.log.length) return <p className="muted">As decisões do orientador aparecem aqui depois das primeiras lições.</p>;
  return (
    <div className="card">
      <p className="muted small">Cada decisão de avançar, repetir, voltar ou revisar é explicada — critério: ≥ 90% de acerto de primeira, dentro do tempo-padrão, em 2 sessões.</p>
      <ul className="log" style={{ listStyle: 'none', padding: 0 }}>
        {p.log.slice().reverse().slice(0, 80).map((d, i) => (
          <li key={i}><span aria-hidden>{KIND_ICON[d.kind]}</span> <span className="muted small">{fmt(d.date)}</span> — {d.text}</li>
        ))}
      </ul>
    </div>
  );
}

export function weeklyReportText(p: Profile): string {
  const end = today();
  const start = addDays(end, -6);
  const mastered = Object.entries(p.skills).filter(([, s]) => s.masteredAt && s.masteredAt >= start).map(([id]) => getSkill(id)?.title).filter(Boolean);
  const hard = TRACKS.flatMap((t) => struggling(p, SKILLS_BY_TRACK[t]));
  const tipSkill = hard[0] ?? SKILLS_BY_TRACK[TRACKS.find((t) => p.settings.enabled[t]) ?? 'leitura'][p.tracks.leitura.pointer];
  const lines = [
    `📚 Relatório semanal do Degrau — ${p.name} (${fmt(start)} a ${fmt(end)})`,
    '',
    `• Praticou em ${daysActiveLast(p)} de 7 dias, ${minutesLast(p)} minutos no total. Sequência atual: ${streak(p)} dia(s).`,
    mastered.length ? `• 🏅 Dominou ${mastered.length} habilidade(s): ${mastered.join('; ')}.` : '• Esta semana foi de prática e consolidação (nenhuma habilidade nova dominada — e tudo bem!).',
    ...TRACKS.filter((t) => p.settings.enabled[t]).map((t) => `• ${TRACK_INFO[t].name}: degrau ${SKILLS_BY_TRACK[t][p.tracks[t].pointer]?.step} — ${SKILLS_BY_TRACK[t][p.tracks[t].pointer]?.title} (acerto recente ${pct(recentAccuracy(p, SKILLS_BY_TRACK[t]))}).`),
    ...hard.map((s) => `• ⚠️ Pede atenção: ${s.title}.`),
    '',
    `💡 Dica da semana (5 min, sem tela): ${tipSkill?.offlineTip ?? 'Leiam juntos um livro antes de dormir.'}`,
  ];
  return lines.join('\n');
}

function WeeklyReport({ p }: { p: Profile }) {
  const text = weeklyReportText(p);
  const [copied, setCopied] = useState(false);
  return (
    <div className="card">
      <pre style={{ whiteSpace: 'pre-wrap', fontFamily: 'inherit', fontSize: '1rem', margin: 0 }}>{text}</pre>
      <div className="row no-print" style={{ marginTop: 12 }}>
        <button className="btn small" onClick={() => navigator.clipboard?.writeText(text).then(() => setCopied(true))}>{copied ? 'Copiado!' : '📋 Copiar'}</button>
        {'share' in navigator && <button className="btn small" onClick={() => navigator.share({ title: 'Relatório Degrau', text }).catch(() => undefined)}>📤 Compartilhar</button>}
        <button className="btn small" onClick={() => window.print()}>🖨️ Imprimir</button>
      </div>
    </div>
  );
}

function Settings({ ctx, p }: { ctx: Ctx; p: Profile }) {
  const s = p.settings;
  const set = (fn: (pp: Profile) => void) => ctx.update(fn, p.id);
  const vPt = listVoices('pt');
  const vEn = listVoices('en');
  return (
    <div style={{ display: 'grid', gap: 14 }}>
      <div className="card" style={{ display: 'grid', gap: 12 }}>
        <h2>Criança</h2>
        <label className="field">Nome<input type="text" value={p.name} maxLength={20} onChange={(e) => set((x) => { x.name = e.target.value; })} /></label>
        <label className="field">Idade
          <select value={p.age} onChange={(e) => set((x) => { x.age = Number(e.target.value); })}>{[4, 5, 6, 7, 8].map((a) => <option key={a} value={a}>{a} anos</option>)}</select>
        </label>
      </div>
      <div className="card" style={{ display: 'grid', gap: 12 }}>
        <h2>Tempo de tela</h2>
        <label className="field">Duração da lição diária: <strong>{s.sessionMinutes} min</strong>
          <input type="range" min={5} max={30} step={5} value={s.sessionMinutes} onChange={(e) => set((x) => { x.settings.sessionMinutes = Number(e.target.value); })} />
        </label>
        <label className="field">Limite de uso por dia: <strong>{s.dailyLimitMin} min</strong>
          <input type="range" min={10} max={60} step={5} value={s.dailyLimitMin} onChange={(e) => set((x) => { x.settings.dailyLimitMin = Number(e.target.value); })} />
        </label>
      </div>
      <div className="card" style={{ display: 'grid', gap: 12 }}>
        <h2>Trilhas e equilíbrio da lição</h2>
        {TRACKS.map((t) => (
          <div key={t} className="row">
            <label className="switch" style={{ minWidth: 200 }}>
              <input type="checkbox" checked={s.enabled[t]} onChange={(e) => set((x) => { x.settings.enabled[t] = e.target.checked; })} /> {TRACK_INFO[t].name}
            </label>
            <input type="range" min={5} max={60} step={5} value={s.mix[t]} disabled={!s.enabled[t]} style={{ flex: 1 }}
              onChange={(e) => set((x) => { x.settings.mix[t] = Number(e.target.value); })} aria-label={`peso ${TRACK_INFO[t].name}`} />
            <span className="small muted" style={{ width: 40 }}>{s.mix[t]}</span>
            <button className="btn small ghost" onClick={() => { if (confirm(`Refazer o nivelamento de ${TRACK_INFO[t].name}?`)) set((x) => { x.tracks[t] = { pointer: 0, placed: false }; }); }}>Refazer nivelamento</button>
          </div>
        ))}
        <p className="small muted">Inglês: recomendamos começar a fônica do inglês só depois que a criança já decodifica em português (cerca de 6 anos).</p>
      </div>
      <div className="card" style={{ display: 'grid', gap: 8 }}>
        <h2>Acessibilidade e conforto</h2>
        <Toggle label="Modo calmo (menos animação e som)" v={s.calm} on={(v) => set((x) => { x.settings.calm = v; })} />
        <Toggle label="Fonte e espaçamento amigáveis para dislexia" v={s.dyslexiaFont} on={(v) => set((x) => { x.settings.dyslexiaFont = v; })} />
        <Toggle label="Sem cronômetro (fluência medida, mas não exigida para avançar)" v={s.untimed} on={(v) => set((x) => { x.settings.untimed = v; })} />
        <Toggle label="Legendas da narração" v={s.captions} on={(v) => set((x) => { x.settings.captions = v; })} />
        <label className="field">Velocidade da narração: {s.voiceRate.toFixed(2)}
          <input type="range" min={0.6} max={1.2} step={0.05} value={s.voiceRate} onChange={(e) => set((x) => { x.settings.voiceRate = Number(e.target.value); })} />
        </label>
        <label className="field">Voz em português (sotaque)
          <select value={s.voicePt ?? ''} onChange={(e) => set((x) => { x.settings.voicePt = e.target.value || undefined; })}>
            <option value="">Automática (pt-BR)</option>
            {vPt.map((v) => <option key={v.name} value={v.name}>{v.name} ({v.lang})</option>)}
          </select>
        </label>
        <label className="field">Voz em inglês
          <select value={s.voiceEn ?? ''} onChange={(e) => set((x) => { x.settings.voiceEn = e.target.value || undefined; })}>
            <option value="">Automática (en-US)</option>
            {vEn.map((v) => <option key={v.name} value={v.name}>{v.name} ({v.lang})</option>)}
          </select>
        </label>
        <button className="btn small" style={{ justifySelf: 'start' }} onClick={() => speak([{ text: 'Olá! Eu sou a Juju.' }, { text: 'Hello, friend!', lang: 'en' }])}>🔊 Testar vozes</button>
      </div>
      <div className="card" style={{ display: 'grid', gap: 8 }}>
        <h2>Dados (LGPD)</h2>
        <p className="small muted">Os dados ficam apenas neste navegador. Você pode exportá-los (portabilidade) ou apagá-los.</p>
        <div className="row">
          <button className="btn small" onClick={() => {
            const blob = new Blob([exportJson(ctx.data)], { type: 'application/json' });
            const a = document.createElement('a');
            a.href = URL.createObjectURL(blob);
            a.download = `degrau-dados-${today()}.json`;
            a.click();
          }}>⬇️ Exportar dados</button>
          <button className="btn small" style={{ color: 'var(--bad)' }} onClick={() => {
            if (!confirm(`Apagar todos os dados de ${p.name}? Isto não pode ser desfeito.`)) return;
            ctx.setData((d) => ({ ...d, profiles: d.profiles.filter((x) => x.id !== p.id) }));
            ctx.selectProfile(null);
            ctx.go({ name: 'perfis' });
          }}>🗑️ Apagar dados desta criança</button>
        </div>
      </div>
    </div>
  );
}

const Toggle = ({ label, v, on }: { label: string; v: boolean; on: (v: boolean) => void }) => (
  <label className="switch"><input type="checkbox" checked={v} onChange={(e) => on(e.target.checked)} /> {label}</label>
);

function School({ profiles }: { profiles: Profile[] }) {
  const [track, setTrack] = useState<TrackId>('leitura');
  if (!profiles.length) return <p className="muted">Cadastre crianças para ver o painel da turma.</p>;
  const skills = SKILLS_BY_TRACK[track];
  const color = (p: Profile, id: string) => {
    const s = p.skills[id];
    if (!s) return '#f1eff4';
    if (s.status === 'dominado') return '#2fb36d';
    const last = s.history[s.history.length - 1];
    if (last && last.firstTry / last.total < 0.6) return '#e5484d';
    return '#f2a516';
  };
  const groups = new Map<string, string[]>();
  for (const p of profiles) {
    const step = SKILLS_BY_TRACK[track][p.tracks[track].pointer]?.step ?? '-';
    groups.set(step, [...(groups.get(step) ?? []), p.name]);
  }
  const csv = () => {
    const rows = [['crianca', 'idade', 'trilha', 'degrau', 'habilidade', 'titulo', 'bncc', 'status', 'ultimo_acerto', 'proxima_revisao']];
    for (const p of profiles) for (const t of TRACKS) for (const s of SKILLS_BY_TRACK[t]) {
      const st = p.skills[s.id];
      const last = st?.history[st.history.length - 1];
      rows.push([p.name, String(p.age), t, s.step, s.id, s.title, s.bncc.join(' '), st?.status ?? 'novo', last ? String(Math.round((last.firstTry / last.total) * 100)) : '', st?.nextReview ?? '']);
    }
    const text = rows.map((r) => r.map((c) => `"${c.replace(/"/g, '""')}"`).join(';')).join('\n');
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob(['﻿' + text], { type: 'text/csv' }));
    a.download = `degrau-turma-${today()}.csv`;
    a.click();
  };
  return (
    <>
      <div className="card" style={{ overflowX: 'auto' }}>
        <h2>Visão geral</h2>
        <table>
          <thead><tr><th>Criança</th>{TRACKS.map((t) => <th key={t}>{TRACK_INFO[t].name}</th>)}<th>Dias (7d)</th></tr></thead>
          <tbody>
            {profiles.map((p) => (
              <tr key={p.id}>
                <td><strong>{p.name}</strong> <span className="muted small">{p.age}a</span></td>
                {TRACKS.map((t) => <td key={t}>{SKILLS_BY_TRACK[t][p.tracks[t].pointer]?.step} · {masteredCount(p, SKILLS_BY_TRACK[t])} ✓ · {pct(recentAccuracy(p, SKILLS_BY_TRACK[t]))}</td>)}
                <td>{daysActiveLast(p)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <button className="btn small" style={{ marginTop: 10 }} onClick={csv}>⬇️ Exportar CSV (com BNCC)</button>
      </div>
      <div className="tabs">{TRACKS.map((t) => <button key={t} className={track === t ? 'on' : ''} onClick={() => setTrack(t)}>{TRACK_INFO[t].name}</button>)}</div>
      <div className="card">
        <h2>Grupos por necessidade — {TRACK_INFO[track].name}</h2>
        {[...groups.entries()].map(([step, names]) => <p key={step} style={{ margin: '4px 0' }}><strong>Degrau {step}:</strong> {names.join(', ')}</p>)}
      </div>
      <div className="card" style={{ overflowX: 'auto' }}>
        <h2>Mapa de calor por habilidade</h2>
        <p className="small muted">Verde = dominada · amarelo = em progresso · vermelho = último bloco abaixo de 60% · cinza = não iniciada</p>
        <table className="heat">
          <thead><tr><th>Habilidade (BNCC)</th>{profiles.map((p) => <th key={p.id} style={{ writingMode: 'vertical-rl' }}>{p.name}</th>)}</tr></thead>
          <tbody>
            {skills.map((s) => (
              <tr key={s.id}>
                <td className="small"><strong>{s.step}</strong> {s.title} <span className="muted">({s.bncc.join(', ')})</span></td>
                {profiles.map((p) => <td key={p.id} className="cell" style={{ background: color(p, s.id) }} title={`${p.name}: ${p.skills[s.id]?.status ?? 'novo'}`} />)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

function About() {
  return (
    <div className="card">
      <h2>Como o Degrau ensina</h2>
      <ul>
        <li><strong>Ponto de partida confortável:</strong> o nivelamento começa um degrau abaixo do limite da criança, para gerar confiança.</li>
        <li><strong>Pequenos passos:</strong> cada habilidade traz uma única novidade.</li>
        <li><strong>Domínio antes de avançar:</strong> ≥ 90% de acerto de primeira, dentro do tempo-padrão, em 2 sessões.</li>
        <li><strong>Autocorreção:</strong> errou? Dica em 3 níveis e o item volta no fim do bloco. Sem “game over”.</li>
        <li><strong>Prática diária curta</strong> e <strong>revisão espaçada</strong> (1, 3, 7, 14 e 30 dias).</li>
        <li><strong>Leitura:</strong> consciência fonológica, método fônico com síntese silábica, alfabeto móvel (Montessori), boquinhas (articulação), livros decodificáveis, leitura dialógica.</li>
        <li><strong>Matemática:</strong> Concreto → Pictórico → Abstrato, subitização, quadro de dez, Material Dourado, fluência de fatos básicos.</li>
        <li><strong>Lógica:</strong> padrões, classificação, sudoku 4x4, robô programável (pensamento computacional).</li>
        <li><strong>Inglês:</strong> som + imagem sem tradução, TPR, shadowing, fônica do inglês após a alfabetização em português.</li>
      </ul>
      <h2>Privacidade</h2>
      <p>Sem anúncios, sem rastreadores, sem compras, sem chat. Os dados ficam só neste aparelho; exporte ou apague quando quiser (LGPD art. 14, ECA).</p>
      <p className="small muted">Inspirado em princípios pedagógicos públicos do ensino individualizado; não é afiliado ao Kumon Institute of Education. Figuras: Twemoji (CC-BY 4.0).</p>
    </div>
  );
}

/** Prévia: o adulto/professor experimenta qualquer habilidade (não altera o progresso). */
function Preview() {
  const [track, setTrack] = useState<TrackId>('leitura');
  const [idx, setIdx] = useState(0);
  const [seed, setSeed] = useState(1);
  const skill = SKILLS_BY_TRACK[track][idx] ?? SKILLS_BY_TRACK[track][0];
  const item = skill.generate(createRng(seed * 7919 + idx));
  return (
    <>
      <div className="card" style={{ display: 'grid', gap: 10 }}>
        <div className="tabs">{TRACKS.map((t) => <button key={t} className={track === t ? 'on' : ''} onClick={() => { setTrack(t); setIdx(0); }}>{TRACK_INFO[t].name}</button>)}</div>
        <div className="row">
          <select className="btn small" value={idx} onChange={(e) => setIdx(Number(e.target.value))} aria-label="habilidade">
            {SKILLS_BY_TRACK[track].map((s, i) => <option key={s.id} value={i}>{s.step} · {s.title}</option>)}
          </select>
          <button className="btn small" onClick={() => setSeed(seed + 1)}>🔀 Outro exemplo</button>
        </div>
        <p className="small muted" style={{ margin: 0 }}>{skill.objective} · BNCC: {skill.bncc.join(', ')} · Técnicas: {skill.techniques.join(', ')}</p>
      </div>
      <div className="card" style={{ background: 'var(--bg)' }}>
        <ItemRunner key={`${skill.id}-${seed}`} item={item} color={TRACK_INFO[track].color} calm={false} onDone={() => setSeed(seed + 1)} />
      </div>
    </>
  );
}
