import type { Hint, Item, Lang, Option, Rng, Say, Token } from './types';

export const pt = (text: string, slow = false): Say => ({ text, lang: 'pt', slow });
export const en = (text: string, slow = false): Say => ({ text, lang: 'en', slow });

export const img = (key: string, say?: Say): Option => ({ token: { kind: 'img', img: key }, say });
export const txt = (text: string, lang: Lang = 'pt', say?: Say): Option => ({ token: { kind: 'text', text, lang }, say });
export const tok = (token: Token, say?: Say): Option => ({ token, say });

/** Dicas padrão em 3 níveis: pista leve → demonstração → resposta modelada. */
export function hints(light: Say[] | string, demo: Say[] | string, model: Say[] | string, extra?: Partial<Hint>[]): [Hint, Hint, Hint] {
  const n = (s: Say[] | string) => (typeof s === 'string' ? [pt(s)] : s);
  return [
    { say: n(light), ...(extra?.[0] ?? {}) },
    { say: n(demo), ...(extra?.[1] ?? {}) },
    { say: n(model), showAnswer: true, ...(extra?.[2] ?? {}) },
  ];
}

/**
 * Monta um item de múltipla escolha embaralhando as opções.
 * `correct` é a opção certa; `wrong` são os distratores.
 */
export function choose(
  rng: Rng,
  prompt: Say[],
  correct: Option,
  wrong: Option[],
  h: [Hint, Hint, Hint],
  extra: Partial<Extract<Item, { kind: 'choose' }>> = {},
): Item {
  const options = rng.shuffle([correct, ...wrong]);
  return { kind: 'choose', prompt, options, answer: options.indexOf(correct), hints: h, ...extra };
}

/** Números distintos próximos de `n` para distratores (sem negativos). */
export function nearNumbers(rng: Rng, n: number, count: number, spread = 3, min = 0): number[] {
  const set = new Set<number>();
  let guard = 0;
  while (set.size < count && guard++ < 200) {
    const d = rng.int(-spread, spread);
    const v = n + d;
    if (v !== n && v >= min) set.add(v);
  }
  let k = 1;
  while (set.size < count) {
    if (!set.has(n + spread + k)) set.add(n + spread + k);
    k++;
  }
  return [...set];
}

export const NUM_WORDS_PT = [
  'zero', 'um', 'dois', 'três', 'quatro', 'cinco', 'seis', 'sete', 'oito', 'nove', 'dez',
  'onze', 'doze', 'treze', 'catorze', 'quinze', 'dezesseis', 'dezessete', 'dezoito', 'dezenove', 'vinte',
];
export const NUM_WORDS_EN = [
  'zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten',
  'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen', 'twenty',
];
