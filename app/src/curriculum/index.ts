import type { Skill, TrackId } from './types';
import { LEITURA_SKILLS } from './leitura';
import { MATEMATICA_SKILLS } from './matematica';
import { LOGICA_SKILLS } from './logica';
import { INGLES_SKILLS } from './ingles';

export const SKILLS_BY_TRACK: Record<TrackId, Skill[]> = {
  leitura: LEITURA_SKILLS,
  matematica: MATEMATICA_SKILLS,
  logica: LOGICA_SKILLS,
  ingles: INGLES_SKILLS,
};

export const ALL_SKILLS: Skill[] = Object.values(SKILLS_BY_TRACK).flat();

const byId = new Map(ALL_SKILLS.map((s) => [s.id, s]));

export function getSkill(id: string): Skill | undefined {
  return byId.get(id);
}

/** Degraus (níveis) de uma trilha, na ordem, com as habilidades de cada um. */
export function stepsOf(track: TrackId): { step: string; skills: Skill[] }[] {
  const out: { step: string; skills: Skill[] }[] = [];
  for (const s of SKILLS_BY_TRACK[track]) {
    const last = out[out.length - 1];
    if (last && last.step === s.step) last.skills.push(s);
    else out.push({ step: s.step, skills: [s] });
  }
  return out;
}

/** Índice da primeira habilidade de cada degrau (pontos de checagem do nivelamento). */
export function checkpoints(track: TrackId): number[] {
  const list = SKILLS_BY_TRACK[track];
  return list.map((s, i) => (i === 0 || list[i - 1].step !== s.step ? i : -1)).filter((i) => i >= 0);
}
