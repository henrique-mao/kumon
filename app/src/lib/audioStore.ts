// Áudios gravados no próprio aparelho (IndexedDB): narração da família e leituras da criança.
// Nada sai do dispositivo.

const DB = 'degrau-audio';
const NARR = 'narracao';
const READ = 'leituras';

export interface ReadingMeta {
  id?: number;
  profileId: string;
  date: string;
  bookId: string;
  bookTitle: string;
  page: number;
  text: string;
  seconds: number;
}
export interface ReadingClip extends ReadingMeta { blob: Blob }

let dbp: Promise<IDBDatabase> | null = null;
function db(): Promise<IDBDatabase> {
  if (typeof indexedDB === 'undefined') return Promise.reject(new Error('sem IndexedDB'));
  dbp ??= new Promise((res, rej) => {
    const r = indexedDB.open(DB, 1);
    r.onupgradeneeded = () => {
      const d = r.result;
      d.createObjectStore(NARR);
      const s = d.createObjectStore(READ, { keyPath: 'id', autoIncrement: true });
      s.createIndex('profileId', 'profileId');
    };
    r.onsuccess = () => res(r.result);
    r.onerror = () => rej(r.error);
  });
  return dbp;
}

function req<T>(r: IDBRequest<T>): Promise<T> {
  return new Promise((res, rej) => { r.onsuccess = () => res(r.result); r.onerror = () => rej(r.error); });
}

async function store(name: string, mode: IDBTransactionMode) {
  return (await db()).transaction(name, mode).objectStore(name);
}

/** Chave da narração: idioma + texto normalizado (minúsculas, sem espaços extras). */
export const narrationKey = (text: string, lang: string) => `${lang}:${text.trim().toLocaleLowerCase('pt-BR').replace(/\s+/g, ' ')}`;

// ---- Narração da família ----
const narrKeys = new Set<string>();
const urlCache = new Map<string, string>();
let loaded: Promise<void> | null = null;
const listeners = new Set<() => void>();
export const onNarrationChange = (fn: () => void) => { listeners.add(fn); return () => { listeners.delete(fn); }; };
const changed = () => listeners.forEach((l) => l());

export function loadNarrationIndex(): Promise<void> {
  loaded ??= (async () => {
    try {
      const keys = await req((await store(NARR, 'readonly')).getAllKeys());
      keys.forEach((k) => narrKeys.add(String(k)));
    } catch { /* sem IndexedDB: segue só com a voz sintética */ }
  })();
  return loaded;
}

export const hasNarration = (key: string) => narrKeys.has(key);
export const narrationCount = () => narrKeys.size;

export async function narrationUrl(key: string): Promise<string | null> {
  if (!narrKeys.has(key)) return null;
  const hit = urlCache.get(key);
  if (hit) return hit;
  const blob = (await req((await store(NARR, 'readonly')).get(key))) as Blob | undefined;
  if (!blob) return null;
  const url = URL.createObjectURL(blob);
  urlCache.set(key, url);
  return url;
}

export async function saveNarration(key: string, blob: Blob) {
  await req((await store(NARR, 'readwrite')).put(blob, key));
  narrKeys.add(key);
  const old = urlCache.get(key);
  if (old) URL.revokeObjectURL(old);
  urlCache.delete(key);
  changed();
}

export async function deleteNarration(key: string) {
  await req((await store(NARR, 'readwrite')).delete(key));
  narrKeys.delete(key);
  urlCache.delete(key);
  changed();
}

// ---- Leituras gravadas da criança ----
let activeProfile: string | null = null;
/** Criança ativa (para associar as gravações de leitura). */
export const setActiveProfile = (id: string | null) => { activeProfile = id; };
export const getActiveProfile = () => activeProfile;

export async function saveReading(meta: ReadingMeta, blob: Blob) {
  await req((await store(READ, 'readwrite')).add({ ...meta, blob }));
}

export async function listReadings(profileId: string): Promise<ReadingClip[]> {
  try {
    const s = await store(READ, 'readonly');
    const all = (await req(s.index('profileId').getAll(profileId))) as ReadingClip[];
    return all.sort((a, b) => (a.id ?? 0) - (b.id ?? 0));
  } catch {
    return [];
  }
}

export async function deleteReading(id: number) {
  await req((await store(READ, 'readwrite')).delete(id));
}

export async function deleteReadingsOf(profileId: string) {
  for (const r of await listReadings(profileId)) if (r.id !== undefined) await deleteReading(r.id);
}
