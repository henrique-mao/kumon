// Nivelamento lúdico (teste diagnóstico): procura o degrau em que a criança está
// e começa UM degrau abaixo — o "ponto de partida confortável" do Kumon.
import type { Item, Rng, Skill } from '../curriculum/types';

export interface PlacementState {
  checkpoints: number[]; // índices (na trilha) da 1ª habilidade de cada degrau
  cp: number; // degrau sendo testado (índice em checkpoints)
  askedAtCp: number;
  correctAtCp: number;
  highestPassed: number;
  lowestFailed: number;
  probes: number;
  done: boolean;
}

export const ITEMS_PER_CHECKPOINT = 2;
export const MAX_PROBES = 6;

export function startPlacement(checkpoints: number[], age: number): PlacementState {
  const start = Math.max(0, Math.min(checkpoints.length - 1, age - 4));
  return { checkpoints, cp: start, askedAtCp: 0, correctAtCp: 0, highestPassed: -1, lowestFailed: checkpoints.length, probes: 0, done: checkpoints.length === 0 };
}

/** 1º item: primeira habilidade do degrau; 2º item: última habilidade do degrau. */
export function placementItem(st: PlacementState, skills: Skill[], rng: Rng): { skill: Skill; item: Item } {
  const first = st.checkpoints[st.cp];
  const last = (st.checkpoints[st.cp + 1] ?? skills.length) - 1;
  const skill = skills[st.askedAtCp === 0 ? first : last];
  return { skill, item: skill.generate(rng) };
}

export function recordPlacement(st: PlacementState, correct: boolean): PlacementState {
  const s = { ...st, askedAtCp: st.askedAtCp + 1, correctAtCp: st.correctAtCp + (correct ? 1 : 0) };
  // errou o 1º item do degrau: não precisa do 2º
  const finished = s.askedAtCp >= ITEMS_PER_CHECKPOINT || !correct;
  if (!finished) return s;
  s.probes++;
  const passed = s.correctAtCp === ITEMS_PER_CHECKPOINT;
  if (passed) s.highestPassed = Math.max(s.highestPassed, s.cp);
  else s.lowestFailed = Math.min(s.lowestFailed, s.cp);
  const next = passed ? s.cp + 1 : s.cp - 1;
  s.askedAtCp = 0;
  s.correctAtCp = 0;
  if (s.probes >= MAX_PROBES || next < 0 || next >= s.checkpoints.length || next <= s.highestPassed || next >= s.lowestFailed) {
    s.done = true;
  } else {
    s.cp = next;
  }
  return s;
}

/** Índice da habilidade inicial: começo do último degrau dominado (um degrau abaixo do limite). */
export function placementPointer(st: PlacementState): number {
  if (st.highestPassed < 0) return 0;
  return st.checkpoints[st.highestPassed];
}
