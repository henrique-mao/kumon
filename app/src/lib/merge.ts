// Mescla dados exportados de outro aparelho (sincronização sem servidor).
import type { Profile, SkillState } from '../engine/model';
import type { AppData } from './storage';

const lastActivity = (p: Profile) => p.sessions.reduce((m, s) => (s.date > m ? s.date : m), p.createdAt.slice(0, 10));
const uniq = <T,>(arr: T[], key: (x: T) => string) => {
  const seen = new Set<string>();
  return arr.filter((x) => { const k = key(x); if (seen.has(k)) return false; seen.add(k); return true; });
};
const rank = (s?: SkillState) => (s ? ({ novo: 0, aprendendo: 1, dominado: 2 })[s.status] : -1);
const lastDate = (s: SkillState) => s.history[s.history.length - 1]?.date ?? s.masteredAt ?? '';

/** Junta dois registros da mesma criança: a base é o mais recente; históricos são unidos. */
export function mergeProfile(a: Profile, b: Profile): Profile {
  const [base, other] = lastActivity(b) > lastActivity(a) ? [b, a] : [a, b];
  const out: Profile = structuredClone(base);
  for (const [id, s] of Object.entries(other.skills)) {
    const mine = out.skills[id];
    if (!mine || lastDate(s) > lastDate(mine) || (lastDate(s) === lastDate(mine) && rank(s) > rank(mine))) out.skills[id] = structuredClone(s);
  }
  for (const t of Object.keys(out.tracks) as (keyof Profile['tracks'])[]) {
    out.tracks[t] = {
      pointer: Math.max(out.tracks[t].pointer, other.tracks[t]?.pointer ?? 0),
      placed: out.tracks[t].placed || !!other.tracks[t]?.placed,
    };
  }
  out.sessions = uniq([...other.sessions, ...out.sessions], (s) => `${s.date}|${s.minutes}|${s.items}|${s.blocks}`).sort((x, y) => (x.date < y.date ? -1 : 1));
  out.log = uniq([...other.log, ...out.log], (d) => `${d.date}|${d.skillId}|${d.text}`).sort((x, y) => (x.date < y.date ? -1 : 1)).slice(-300);
  out.errors = [...other.errors, ...out.errors].slice(-300);
  out.pcpm = uniq([...other.pcpm, ...out.pcpm], (x) => `${x.date}|${x.value}`).slice(-100);
  out.stickers = [...new Set([...out.stickers, ...other.stickers])];
  out.certificates = uniq([...other.certificates, ...out.certificates], (c) => `${c.track}|${c.step}`);
  out.customWords = uniq([...(out.customWords ?? []), ...(other.customWords ?? [])], (w) => w.w);
  out.sondagens = uniq([...(other.sondagens ?? []), ...(out.sondagens ?? [])], (x) => `${x.date}|${JSON.stringify(x.words)}`);
  for (const [k, v] of Object.entries(other.booksRead)) out.booksRead[k] = Math.max(out.booksRead[k] ?? 0, v);
  out.stars = Math.max(out.stars, other.stars);
  return out;
}

/** Importa um arquivo exportado: crianças novas são adicionadas; as que já existem são mescladas. */
export function mergeData(current: AppData, incoming: AppData): { data: AppData; added: number; merged: number } {
  if (!incoming || !Array.isArray(incoming.profiles)) throw new Error('Arquivo inválido');
  let added = 0, merged = 0;
  const profiles = current.profiles.slice();
  for (const p of incoming.profiles) {
    const i = profiles.findIndex((x) => x.id === p.id);
    if (i < 0) { profiles.push(p); added++; } else { profiles[i] = mergeProfile(profiles[i], p); merged++; }
  }
  return { data: { ...current, profiles }, added, merged };
}
