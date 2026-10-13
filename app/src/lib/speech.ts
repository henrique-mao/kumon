// Narração (Text-to-Speech) e reconhecimento de voz do navegador.
// MVP: vozes do sistema (pt-BR / en-US). Produção: substituir por áudios gravados por locutores (ver MRD).
import type { Lang, Say } from '../curriculum/types';
import { hasNarration, narrationKey, narrationUrl } from './audioStore';

export interface VoiceOptions {
  rate: number;
  voicePt?: string;
  voiceEn?: string;
}

let opts: VoiceOptions = { rate: 0.95 };
export function configureVoice(o: VoiceOptions) {
  opts = o;
}

type CaptionListener = (text: string | null, speaking: boolean) => void;
const listeners = new Set<CaptionListener>();
export function onCaption(fn: CaptionListener) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}
const emit = (t: string | null, s: boolean) => listeners.forEach((l) => l(t, s));

const synth = typeof window !== 'undefined' ? window.speechSynthesis : undefined;

export function listVoices(lang: Lang): SpeechSynthesisVoice[] {
  if (!synth) return [];
  const prefix = lang === 'pt' ? 'pt' : 'en';
  return synth.getVoices().filter((v) => v.lang.toLowerCase().startsWith(prefix));
}

function pickVoice(lang: Lang): SpeechSynthesisVoice | undefined {
  const all = listVoices(lang);
  const wanted = lang === 'pt' ? opts.voicePt : opts.voiceEn;
  const exact = wanted && all.find((v) => v.name === wanted);
  if (exact) return exact;
  const region = lang === 'pt' ? 'pt-br' : 'en-us';
  return all.find((v) => v.lang.toLowerCase().replace('_', '-') === region) ?? all[0];
}

let token = 0;
let currentAudio: HTMLAudioElement | null = null;

export function stopSpeaking() {
  token++;
  synth?.cancel();
  currentAudio?.pause();
  currentAudio = null;
  emit(null, false);
}

/**
 * Fala uma sequência de trechos (pode misturar PT e EN).
 * `onWord` recebe o índice de caractere de cada palavra (para destacar no livro).
 */
export function speak(says: Say[], onWord?: (segment: number, charIndex: number) => void): Promise<void> {
  stopSpeaking();
  const my = ++token;
  const caption = says.map((s) => (s.hideCaption ? '🔊 …' : s.text)).join(' ');
  emit(caption, true);
  const noTts = !synth || typeof SpeechSynthesisUtterance === 'undefined';
  if (noTts && !says.some((x) => hasNarration(narrationKey(x.text, x.lang ?? 'pt')))) {
    // sem TTS: mantém a legenda visível por um tempo proporcional ao texto
    return new Promise((res) => setTimeout(() => { if (my === token) emit(caption, false); res(); }, 400 + caption.length * 45));
  }
  return new Promise((resolve) => {
    let i = 0;
    const next = () => {
      if (my !== token) return resolve();
      if (i >= says.length) {
        emit(caption, false);
        return resolve();
      }
      const s = says[i];
      const seg = i++;
      const lang = s.lang ?? 'pt';
      // Voz gravada pela família tem prioridade sobre a voz sintética
      const key = narrationKey(s.text, lang);
      if (hasNarration(key)) {
        narrationUrl(key).then((url) => {
          if (my !== token) return resolve();
          if (!url) return next();
          const a = new Audio(url);
          a.playbackRate = Math.max(0.7, Math.min(1.2, opts.rate));
          currentAudio = a;
          a.onended = next;
          a.onerror = next;
          a.play().catch(next);
        });
        return;
      }
      if (noTts) return next();
      const u = new SpeechSynthesisUtterance(s.text);
      u.lang = lang === 'pt' ? 'pt-BR' : 'en-US';
      const v = pickVoice(lang);
      if (v) u.voice = v;
      u.rate = opts.rate * (s.slow ? 0.7 : 1);
      u.pitch = 1.1;
      u.onboundary = (e) => { if (e.name === 'word' || e.name === undefined) onWord?.(seg, e.charIndex); };
      u.onend = next;
      u.onerror = next;
      synth!.speak(u);
    };
    next();
  });
}

// ---------- Reconhecimento de voz ----------
type Recognition = {
  lang: string; interimResults: boolean; maxAlternatives: number; continuous: boolean;
  start(): void; stop(): void; abort(): void;
  onresult: ((e: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void) | null;
  onerror: ((e: unknown) => void) | null;
  onend: (() => void) | null;
};

function recognitionCtor(): (new () => Recognition) | undefined {
  const w = window as unknown as Record<string, unknown>;
  return (w.SpeechRecognition ?? w.webkitSpeechRecognition) as (new () => Recognition) | undefined;
}

export const canListen = () => typeof window !== 'undefined' && !!recognitionCtor();

/** Escuta uma fala (até ~6 s). Resolve com as alternativas reconhecidas, ou null se falhar. */
export function listen(lang: Lang, maxMs = 7000): { result: Promise<string[] | null>; stop: () => void } {
  const Ctor = recognitionCtor();
  if (!Ctor) return { result: Promise.resolve(null), stop: () => {} };
  stopSpeaking();
  const rec = new Ctor();
  rec.lang = lang === 'pt' ? 'pt-BR' : 'en-US';
  rec.interimResults = false;
  rec.maxAlternatives = 5;
  rec.continuous = false;
  let done = false;
  const result = new Promise<string[] | null>((resolve) => {
    const finish = (v: string[] | null) => { if (!done) { done = true; resolve(v); } };
    rec.onresult = (e) => {
      const alts: string[] = [];
      for (let i = 0; i < e.results.length; i++) for (let j = 0; j < e.results[i].length; j++) alts.push(e.results[i][j].transcript);
      finish(alts);
    };
    rec.onerror = () => finish(null);
    rec.onend = () => finish(null);
    setTimeout(() => { try { rec.stop(); } catch { /* */ } }, maxMs);
    try { rec.start(); } catch { finish(null); }
  });
  return { result, stop: () => { try { rec.stop(); } catch { /* */ } } };
}

const norm = (s: string) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9 ]/g, ' ').split(/\s+/).filter(Boolean);

/** Fração das palavras esperadas que aparecem na fala reconhecida (tolerante a sotaques). */
export function matchScore(expected: string, heard: string[]): { score: number; matched: number; total: number } {
  const exp = norm(expected);
  let best = 0;
  for (const h of heard) {
    const words = new Set(norm(h));
    const matched = exp.filter((w) => words.has(w)).length;
    best = Math.max(best, matched);
  }
  return { score: exp.length ? best / exp.length : 0, matched: best, total: exp.length };
}
