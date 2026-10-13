// Monta a sessão diária: aquecimento (revisão espaçada) → conteúdo novo por trilha → leitura de livro.
import type { Book, Item, Rng, Skill, TrackId } from '../curriculum/types';
import { dueReviews } from './mastery';
import { TRACKS, type Profile } from './model';

export interface PlannedBlock {
  skillId: string;
  track: TrackId;
  mode: 'novo' | 'revisao' | 'livro';
  items: Item[];
}

export interface SessionPlan {
  blocks: PlannedBlock[];
  estMinutes: number;
}

/** Segundos estimados por item: tempo-padrão + instrução falada + comemoração. */
export const itemSeconds = (s: Skill) => s.stdTimeSec + 7;
const BOOK_SECONDS = 180;
const REVIEW_ITEMS = 3;

export function buildSession(
  p: Profile,
  skillsByTrack: Record<TrackId, Skill[]>,
  books: Book[],
  rng: Rng,
  date: string,
): SessionPlan {
  const budget = p.settings.sessionMinutes * 60;
  let used = 0;
  const enabled = TRACKS.filter((t) => p.settings.enabled[t] && skillsByTrack[t].length);
  const byId = new Map(enabled.flatMap((t) => skillsByTrack[t]).map((s) => [s.id, s]));
  const gen = (s: Skill, n: number) => Array.from({ length: n }, () => s.generate(rng));

  // 1) Aquecimento: revisões vencidas (no máx. 1 por 10 min de sessão)
  const reviews: PlannedBlock[] = [];
  const maxReviews = Math.max(1, Math.floor(p.settings.sessionMinutes / 10));
  for (const id of dueReviews(p, date, new Set(byId.keys())).slice(0, maxReviews)) {
    const s = byId.get(id)!;
    reviews.push({ skillId: id, track: s.track, mode: 'revisao', items: gen(s, REVIEW_ITEMS) });
    used += REVIEW_ITEMS * itemSeconds(s);
  }

  // 2) Conteúdo novo: um bloco por trilha (pela ordem de peso), depois blocos extras se houver tempo
  const ordered = [...enabled].sort((a, b) => p.settings.mix[b] - p.settings.mix[a]);
  const current = (t: TrackId) => skillsByTrack[t][Math.min(p.tracks[t].pointer, skillsByTrack[t].length - 1)];
  const blocksPerTrack: Record<TrackId, PlannedBlock[]> = { leitura: [], matematica: [], logica: [], ingles: [] };
  for (const t of ordered) {
    const s = current(t);
    const cost = s.blockSize * itemSeconds(s);
    if (used + cost > budget * 1.15 && used > 0) continue;
    blocksPerTrack[t].push({ skillId: s.id, track: t, mode: 'novo', items: gen(s, s.blockSize) });
    used += cost;
  }
  // blocos extras proporcionais ao peso (Kumon: repetição do mesmo conteúdo até o domínio)
  const totalW = ordered.reduce((a, t) => a + p.settings.mix[t], 0) || 1;
  for (const t of ordered) {
    const s = current(t);
    const cost = s.blockSize * itemSeconds(s);
    const share = (p.settings.mix[t] / totalW) * budget;
    if (blocksPerTrack[t].length === 1 && share > cost * 1.6 && used + cost <= budget) {
      blocksPerTrack[t].push({ skillId: s.id, track: t, mode: 'novo', items: gen(s, s.blockSize) });
      used += cost;
    }
  }

  // 3) Aplicação: livro decodificável do nível (se couber)
  let book: PlannedBlock | null = null;
  if (used + BOOK_SECONDS <= budget * 1.1) {
    const candidates = books.filter((b) => {
      const track: TrackId = b.lang === 'pt' ? 'leitura' : 'ingles';
      if (!enabled.includes(track)) return false;
      const idx = skillsByTrack[track].findIndex((s) => s.id === b.level);
      return idx >= 0 && idx <= p.tracks[track].pointer;
    });
    if (candidates.length) {
      const least = Math.min(...candidates.map((b) => p.booksRead[b.id] ?? 0));
      const pick = rng.pick(candidates.filter((b) => (p.booksRead[b.id] ?? 0) === least));
      const track: TrackId = pick.lang === 'pt' ? 'leitura' : 'ingles';
      book = {
        skillId: pick.level,
        track,
        mode: 'livro',
        items: [{
          kind: 'book', bookId: pick.id,
          prompt: [{ text: `Hora da história: ${pick.title}!`, lang: 'pt' }],
          hints: [
            { say: [{ text: 'Toque no alto-falante para ouvir a história.' }] },
            { say: [{ text: 'Toque em uma palavra para ouvir só ela.' }] },
            { say: [{ text: 'Leia junto comigo, devagar.' }], showAnswer: true },
          ],
        }],
      };
      used += BOOK_SECONDS;
    }
  }

  const blocks: PlannedBlock[] = [...reviews];
  for (const t of TRACKS) {
    if (blocksPerTrack[t][0]) blocks.push(blocksPerTrack[t][0]);
    if (t === 'leitura' && book?.track === 'leitura') blocks.push(book);
  }
  for (const t of TRACKS) if (blocksPerTrack[t][1]) blocks.push(blocksPerTrack[t][1]);
  if (book?.track === 'ingles') blocks.push(book);

  return { blocks, estMinutes: Math.round(used / 60) };
}

/** Bloco "mais fácil" para quando a criança se frustra: volta à habilidade anterior da trilha. */
export function easierBlock(p: Profile, skillsByTrack: Record<TrackId, Skill[]>, track: TrackId, rng: Rng, n: number): PlannedBlock | null {
  const list = skillsByTrack[track];
  const idx = Math.max(0, p.tracks[track].pointer - 1);
  const s = list[idx];
  if (!s) return null;
  return { skillId: s.id, track, mode: 'revisao', items: Array.from({ length: n }, () => s.generate(rng)) };
}
