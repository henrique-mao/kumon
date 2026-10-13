// Persistência local (tudo fica no dispositivo — privacidade por padrão, LGPD art. 14).
import { defaultSettings, type Profile } from '../engine/model';

const KEY = 'degrau:v1';

export interface AppData {
  version: 1;
  profiles: Profile[];
}

/** Normaliza dados de versões anteriores (ou importados) para o formato atual. */
export function migrate(raw: AppData): AppData {
  if (!raw || !Array.isArray(raw.profiles)) throw new Error('dados inválidos');
  return {
    version: 1,
    profiles: raw.profiles.map((p) => ({
      ...p,
      settings: { ...defaultSettings(p.age), ...p.settings },
      errors: p.errors ?? [],
      booksRead: p.booksRead ?? {},
      pcpm: p.pcpm ?? [],
      customWords: p.customWords ?? [],
      sondagens: p.sondagens ?? [],
    })),
  };
}

export function load(): AppData {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return migrate(JSON.parse(raw) as AppData);
  } catch {
    /* armazenamento indisponível ou corrompido */
  }
  return { version: 1, profiles: [] };
}

export function save(data: AppData): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(data));
  } catch {
    /* modo privado / sem espaço: o app continua funcionando em memória */
  }
}

/** Exporta os dados (portabilidade — direito do titular). */
export function exportJson(data: AppData): string {
  return JSON.stringify(data, null, 2);
}
