import type { TrackId } from '../curriculum/types';

export const TRACKS: TrackId[] = ['leitura', 'matematica', 'logica', 'ingles'];

export const TRACK_INFO: Record<TrackId, { name: string; child: string; color: string; icon: string }> = {
  leitura: { name: 'Leitura e Escrita', child: 'Ler', color: 'var(--c-leitura)', icon: 'livro' },
  matematica: { name: 'Matemática', child: 'Números', color: 'var(--c-matematica)', icon: 'dado' },
  logica: { name: 'Lógica', child: 'Pensar', color: 'var(--c-logica)', icon: 'cerebro' },
  ingles: { name: 'Inglês', child: 'English', color: 'var(--c-ingles)', icon: 'balao' },
};

export interface Settings {
  /** Duração alvo da sessão diária (min). */
  sessionMinutes: number;
  /** Limite de uso diário (min). */
  dailyLimitMin: number;
  /** Peso de cada trilha na sessão. */
  mix: Record<TrackId, number>;
  enabled: Record<TrackId, boolean>;
  /** Menos animação e som. */
  calm: boolean;
  /** Fonte e espaçamento amigáveis para dislexia. */
  dyslexiaFont: boolean;
  /** Fluência medida mas não exigida para avançar. */
  untimed: boolean;
  /** Mostrar legenda do que a narração fala. */
  captions: boolean;
  voiceRate: number;
  voicePt?: string;
  voiceEn?: string;
}

export type SkillStatus = 'novo' | 'aprendendo' | 'dominado';

export interface BlockResult {
  skillId: string;
  date: string; // YYYY-MM-DD
  mode: 'novo' | 'revisao';
  total: number;
  firstTry: number;
  avgTimeSec: number;
  hintsUsed: number;
}

export interface SkillState {
  status: SkillStatus;
  /** Sessões que bateram o critério de domínio (acerto + tempo). */
  passes: number;
  /** Sessões seguidas com acerto < 60%. */
  lowStreak: number;
  /** Últimos resultados (máx. 12). */
  history: BlockResult[];
  /** Estágio da revisão espaçada (0..4 → 1,3,7,14,30 dias). */
  reviewStage: number;
  nextReview?: string;
  masteredAt?: string;
}

export interface Decision {
  date: string;
  skillId: string;
  kind: 'avanco' | 'dominio' | 'repeticao' | 'retrocesso' | 'revisao' | 'pausa' | 'nivelamento' | 'fluencia';
  text: string;
}

export interface ErrorMark {
  skillId: string;
  expected: string;
  chosen: string;
  date: string;
}

export interface SessionSummary {
  date: string;
  minutes: number;
  items: number;
  firstTry: number;
  blocks: number;
}

export interface Profile {
  id: string;
  name: string;
  age: number;
  avatar: string;
  createdAt: string;
  settings: Settings;
  tracks: Record<TrackId, { pointer: number; placed: boolean }>;
  skills: Record<string, SkillState>;
  log: Decision[];
  errors: ErrorMark[];
  sessions: SessionSummary[];
  stars: number;
  stickers: string[];
  certificates: { track: TrackId; step: string; date: string }[];
  /** Palavras corretas por minuto (leitura em voz alta). */
  pcpm: { date: string; value: number }[];
  booksRead: Record<string, number>;
}

export function defaultSettings(age: number): Settings {
  return {
    sessionMinutes: age <= 5 ? 10 : age === 6 ? 15 : 20,
    dailyLimitMin: age <= 5 ? 20 : 30,
    mix: { leitura: 40, matematica: 30, logica: 15, ingles: 15 },
    enabled: { leitura: true, matematica: true, logica: true, ingles: true },
    calm: false,
    dyslexiaFont: false,
    untimed: age <= 5,
    captions: true,
    voiceRate: 0.95,
  };
}

export function newProfile(name: string, age: number, avatar: string): Profile {
  return {
    id: Math.random().toString(36).slice(2, 10),
    name,
    age,
    avatar,
    createdAt: new Date().toISOString(),
    settings: defaultSettings(age),
    tracks: {
      leitura: { pointer: 0, placed: false },
      matematica: { pointer: 0, placed: false },
      logica: { pointer: 0, placed: false },
      ingles: { pointer: 0, placed: false },
    },
    skills: {},
    log: [],
    errors: [],
    sessions: [],
    stars: 0,
    stickers: [],
    certificates: [],
    pcpm: [],
    booksRead: {},
  };
}

export function emptySkillState(): SkillState {
  return { status: 'novo', passes: 0, lowStreak: 0, history: [], reviewStage: 0 };
}

export const REVIEW_INTERVALS = [1, 3, 7, 14, 30];

export function today(d = new Date()): string {
  const z = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${z(d.getMonth() + 1)}-${z(d.getDate())}`;
}

export function addDays(date: string, days: number): string {
  const [y, m, d] = date.split('-').map(Number);
  return today(new Date(y, m - 1, d + days));
}

export function daysBetween(a: string, b: string): number {
  const p = (s: string) => { const [y, m, d] = s.split('-').map(Number); return new Date(y, m - 1, d).getTime(); };
  return Math.round((p(b) - p(a)) / 86400000);
}
