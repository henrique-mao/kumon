// Palavras geradoras (Paulo Freire): a criança aprende a ler e escrever palavras que têm
// significado para ela — o próprio nome, nomes da família, do pet, da escola.
import type { CustomWord } from '../engine/model';
import { hints, pt, txt } from './helpers';
import type { Item, Rng } from './types';

const low = (s: string) => s.toLocaleLowerCase('pt-BR');
const COMMON_SYL = ['MA', 'PA', 'BO', 'LA', 'TE', 'VI', 'SO', 'DU', 'NE', 'RI'];
const LETTERS = 'ABCDEFGHIJLMNOPRSTUVZ'.split('');

/** Gera um item com as palavras da família. `letters` = montar letra a letra (crianças mais avançadas). */
export function familyItem(words: CustomWord[], rng: Rng, letters: boolean): Item {
  const x = rng.pick(words);
  const others = words.filter((o) => o.w !== x.w);
  if (others.length >= 1 && rng.next() < 0.35) {
    const opts = rng.sample(others, Math.min(2, others.length));
    const correct = txt(x.w);
    const options = rng.shuffle([correct, ...opts.map((o) => txt(o.w))]);
    return {
      kind: 'choose',
      prompt: [pt('Toque na palavra'), pt(low(x.w))],
      options,
      answer: options.indexOf(correct),
      visual: x.img ? { type: 'token', token: { kind: 'img', img: x.img } } : undefined,
      hints: hints(
        [pt('Escute o comecinho:'), pt(low(x.syl[0]), true)],
        [pt(low(x.w)), pt('começa com a letra'), pt(x.w[0], true)],
        [pt('É esta:'), pt(low(x.w))],
      ),
    };
  }
  const solution = letters ? [...x.w.normalize('NFC')] : x.syl;
  const pool = letters ? LETTERS : [...new Set([...others.flatMap((o) => o.syl), ...COMMON_SYL])];
  const distractors = rng.sample(pool.filter((p) => !solution.includes(p)), 2);
  return {
    kind: 'build',
    prompt: [pt('Monte a palavra'), pt(low(x.w))],
    solution,
    tiles: rng.shuffle([...solution, ...distractors]),
    img: x.img,
    visual: x.img ? { type: 'token', token: { kind: 'img', img: x.img } } : undefined,
    hints: hints(
      [pt('Fale devagar:'), pt(x.syl.map(low).join('... '), true)],
      [pt('Comece com'), pt(low(x.syl[0]), true)],
      [pt('Assim:'), pt(x.syl.map(low).join('... '), true)],
    ),
  };
}
