// Ferramentas de escrita em PT-BR: separação silábica (heurística) e sugestão de hipótese
// de escrita segundo a Psicogênese da Língua Escrita (Ferreiro & Teberosky).
import type { Hipotese } from '../engine/model';

const VOWELS = 'AEIOUÁÉÍÓÚÂÊÔÃÕÀ';
const isV = (c: string) => VOWELS.includes(c);
/** Encontros consonantais que ficam na mesma sílaba (PR, BL...). */
const CLUSTERS = new Set(['PR', 'BR', 'TR', 'DR', 'CR', 'GR', 'FR', 'VR', 'PL', 'BL', 'CL', 'GL', 'FL', 'TL']);
const DIGRAPHS = new Set(['CH', 'LH', 'NH', 'QU', 'GU']);
/** Ditongos decrescentes comuns (a 2ª vogal fica na mesma sílaba). */
const DIPHTHONG = /^(AI|EI|OI|UI|AU|EU|IU|OU|ÃO|ÃE|ÕE|ÉI|ÓI|ÉU)$/;

/** Separa uma palavra em sílabas (heurística para palavras comuns: nomes, objetos). */
export function syllabify(word: string): string[] {
  const w = word.toLocaleUpperCase('pt-BR').replace(/[^A-ZÁÉÍÓÚÂÊÔÃÕÀÇ]/g, '');
  if (!w) return [];
  // 1) agrupa em unidades: dígrafos/QU/GU contam como uma consoante
  const units: string[] = [];
  for (let i = 0; i < w.length; i++) {
    const two = w.slice(i, i + 2);
    const after = w[i + 2] ?? '';
    const ok = two === 'GU' ? /[EIÉÍÊ]/.test(after) : two === 'QU' ? isV(after) : true;
    if (DIGRAPHS.has(two) && ok) {
      units.push(two); i++;
    } else units.push(w[i]);
  }
  const vowel = (u: string) => u.length === 1 && isV(u);
  const syl: string[] = [];
  let cur = '';
  let i = 0;
  while (i < units.length) {
    // consoantes iniciais
    while (i < units.length && !vowel(units[i])) cur += units[i++];
    // núcleo vocálico (+ ditongo decrescente)
    if (i < units.length) cur += units[i++];
    if (i < units.length && vowel(units[i]) && DIPHTHONG.test(cur.slice(-1) + units[i]) && !(i + 1 < units.length && vowel(units[i + 1]))) {
      // ditongo só se a próxima não for vogal e não for final "IA"/"UA" (hiato tratado como 2 sílabas)
      cur += units[i++];
    }
    // consoantes até a próxima vogal
    let j = i;
    while (j < units.length && !vowel(units[j])) j++;
    const cons = units.slice(i, j);
    if (j >= units.length) {
      cur += cons.join('');
      i = j;
    } else if (cons.length === 1) {
      // V-CV
    } else if (cons.length >= 2) {
      const lastTwo = cons.slice(-2).join('');
      const keep = CLUSTERS.has(lastTwo) && cons[cons.length - 2].length === 1 ? 2 : 1;
      cur += cons.slice(0, cons.length - keep).join('');
      i = j - keep;
    }
    syl.push(cur);
    cur = '';
  }
  if (cur) syl.push(cur);
  return syl;
}

const norm = (s: string) => s.toLocaleUpperCase('pt-BR').normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^A-Z]/g, '');

function lcs(a: string, b: string): number {
  const dp = Array.from({ length: a.length + 1 }, () => new Array(b.length + 1).fill(0));
  for (let i = 1; i <= a.length; i++)
    for (let j = 1; j <= b.length; j++)
      dp[i][j] = a[i - 1] === b[j - 1] ? dp[i - 1][j - 1] + 1 : Math.max(dp[i - 1][j], dp[i][j - 1]);
  return dp[a.length][b.length];
}

/** Quantas sílabas do alvo têm uma letra correspondente na escrita, na ordem. */
function syllableMatches(written: string, sylls: string[]): number {
  let pos = 0, n = 0;
  for (const s of sylls.map(norm)) {
    for (let k = pos; k < written.length; k++) {
      if (s.includes(written[k])) { n++; pos = k + 1; break; }
    }
  }
  return n;
}

export const HIPOTESES: { id: Hipotese; label: string; desc: string }[] = [
  { id: 'pre-silabica', label: 'Pré-silábica', desc: 'Escreve com letras/sinais sem relação com os sons da fala.' },
  { id: 'silabica-sem-valor', label: 'Silábica sem valor sonoro', desc: 'Uma letra por sílaba, mas sem relação com o som.' },
  { id: 'silabica-com-valor', label: 'Silábica com valor sonoro', desc: 'Uma letra por sílaba, já ligada ao som (ex.: OOEA para BORBOLETA).' },
  { id: 'silabico-alfabetica', label: 'Silábico-alfabética', desc: 'Às vezes uma letra por sílaba, às vezes a sílaba completa (ex.: GAO para GATO).' },
  { id: 'alfabetica', label: 'Alfabética', desc: 'Representa todos os sons; pode ainda ter erros de ortografia.' },
];
const ORDER = HIPOTESES.map((h) => h.id);

/** Sugere a hipótese de escrita para uma palavra. É uma sugestão — a decisão é do educador. */
export function classifyWord(target: string, writtenRaw: string): Hipotese {
  const t = norm(target);
  const w = norm(writtenRaw);
  const sylls = syllabify(target);
  const S = Math.max(1, sylls.length);
  if (!w) return 'pre-silabica';
  const r = lcs(w, t) / t.length;
  if (r >= 0.8 && w.length >= t.length - 1) return 'alfabetica';
  if (w.length > S && r >= 0.45) return 'silabico-alfabetica';
  const close = Math.abs(w.length - S) <= 1;
  if (close && syllableMatches(w, sylls) >= Math.ceil(S / 2) && r > 0) return 'silabica-com-valor';
  if (close && S >= 2) return 'silabica-sem-valor';
  return 'pre-silabica';
}

/** Hipótese predominante na sondagem (mediana das palavras). */
export function classifySondagem(words: { target: string; written: string }[]): Hipotese {
  const filled = words.filter((x) => x.written.trim());
  if (!filled.length) return 'pre-silabica';
  const idx = filled.map((x) => ORDER.indexOf(classifyWord(x.target, x.written))).sort((a, b) => a - b);
  return ORDER[idx[Math.floor((idx.length - 1) / 2)]];
}

/** Listas clássicas de sondagem: mesmo campo semântico, de polissílaba a monossílaba + frase. */
export const SONDAGEM_LISTAS: { tema: string; words: string[]; sentence: string }[] = [
  { tema: 'Animais', words: ['BORBOLETA', 'CAVALO', 'GATO', 'BOI'], sentence: 'O GATO BEBE LEITE' },
  { tema: 'Frutas', words: ['MELANCIA', 'BANANA', 'UVA', 'PÃO'], sentence: 'A MENINA COMEU BANANA' },
  { tema: 'Festa', words: ['BRIGADEIRO', 'PIPOCA', 'BOLO', 'SAL'], sentence: 'O BOLO É DE CHOCOLATE' },
  { tema: 'Brinquedos', words: ['BICICLETA', 'BONECA', 'BOLA', 'PIÃO'], sentence: 'A BOLA CAIU NO RIO' },
];
