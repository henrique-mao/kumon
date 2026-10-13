import type { Skill, TrackId } from '../curriculum/types';
import { addDays, daysBetween, today, type Profile } from './model';

export function minutesOn(p: Profile, date = today()): number {
  return p.sessions.filter((s) => s.date === date).reduce((a, s) => a + s.minutes, 0);
}

/** Dias seguidos de prática (termina hoje ou ontem — perder um dia não apaga conquistas). */
export function streak(p: Profile, date = today()): number {
  const days = new Set(p.sessions.map((s) => s.date));
  let d = days.has(date) ? date : addDays(date, -1);
  let n = 0;
  while (days.has(d)) { n++; d = addDays(d, -1); }
  return n;
}

export function daysActiveLast(p: Profile, n = 7, date = today()): number {
  return new Set(p.sessions.filter((s) => daysBetween(s.date, date) < n && daysBetween(s.date, date) >= 0).map((s) => s.date)).size;
}

export function minutesLast(p: Profile, n = 7, date = today()): number {
  return p.sessions.filter((s) => daysBetween(s.date, date) < n && daysBetween(s.date, date) >= 0).reduce((a, s) => a + s.minutes, 0);
}

export function masteredCount(p: Profile, skills?: Skill[]): number {
  const ids = skills ? new Set(skills.map((s) => s.id)) : null;
  return Object.entries(p.skills).filter(([id, s]) => s.status === 'dominado' && (!ids || ids.has(id))).length;
}

export function masteredSince(p: Profile, since: string): number {
  return Object.values(p.skills).filter((s) => s.masteredAt && s.masteredAt >= since).length;
}

/** Acurácia (de primeira) nos últimos blocos de uma trilha. */
export function recentAccuracy(p: Profile, skills: Skill[], last = 6): number | null {
  const ids = new Set(skills.map((s) => s.id));
  const hist = Object.entries(p.skills).filter(([id]) => ids.has(id)).flatMap(([, s]) => s.history)
    .sort((a, b) => (a.date < b.date ? -1 : 1)).slice(-last);
  const total = hist.reduce((a, h) => a + h.total, 0);
  return total ? hist.reduce((a, h) => a + h.firstTry, 0) / total : null;
}

/** Habilidades com dificuldade: aprendendo e com ≥ 3 blocos abaixo de 80%. */
export function struggling(p: Profile, skills: Skill[]): Skill[] {
  return skills.filter((s) => {
    const st = p.skills[s.id];
    if (!st || st.status !== 'aprendendo') return false;
    return st.history.filter((h) => h.mode === 'novo' && h.total && h.firstTry / h.total < 0.8).length >= 3;
  });
}

export const STICKERS = [
  'leao', 'girafa', 'elefante', 'tigre', 'zebra', 'macaco', 'urso', 'coelho', 'raposa', 'pinguim', 'coruja', 'golfinho',
  'baleia', 'polvo', 'tartaruga', 'unicornio', 'dinossauro', 'borboleta', 'joaninha', 'abelha', 'canguru', 'camelo',
  'hipopotamo', 'jacare', 'foguete', 'arco_iris', 'girassol', 'vulcao', 'castelo', 'coroa', 'trofeu', 'balao',
];

export function nextSticker(p: Profile): string | null {
  return STICKERS.find((s) => !p.stickers.includes(s)) ?? null;
}

export function trackOf(id: string): TrackId | null {
  if (id.startsWith('lei-')) return 'leitura';
  if (id.startsWith('mat-')) return 'matematica';
  if (id.startsWith('log-')) return 'logica';
  if (id.startsWith('ing-')) return 'ingles';
  return null;
}
