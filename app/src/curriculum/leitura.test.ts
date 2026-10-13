import { describe, expect, it } from 'vitest';
import { hasImage } from '../data/images';
import { createRng } from '../lib/rng';
import { BOOKS, getBook } from './books';
import { HIGH_FREQ_WORDS, isDecodable, toGraphemes, wordsOf } from './graphemes';
import { LEITURA_SKILLS, LEXICON, graphemesUpTo } from './leitura';
import { validateSkill } from './validate';

describe('tokenizador de grafemas PT-BR', () => {
  const cases: [string, string[]][] = [
    ['chuva', ['ch', 'u', 'v', 'a']],
    ['carro', ['c', 'a', 'rr', 'o']],
    ['casa', ['c', 'a', 's_z', 'a']],
    ['mão', ['m', 'ã', 'o']],
    ['campo', ['c', 'am', 'p', 'o']],
    ['queijo', ['qu', 'e', 'i', 'j', 'o']],
    ['gelo', ['ge', 'e', 'l', 'o']],
    ['rato', ['R', 'a', 't', 'o']],
    ['pera', ['p', 'e', 'r', 'a']],
    ['mar', ['m', 'a', 'r_']],
    ['prato', ['p', 'r2', 'a', 't', 'o']],
    ['flor', ['f', 'l2', 'o', 'r_']],
    ['sol', ['s', 'o', 'l_']],
    ['pasta', ['p', 'a', 's_', 't', 'a']],
    ['ninho', ['n', 'i', 'nh', 'o']],
    ['galinha', ['g', 'a', 'l', 'i', 'nh', 'a']],
    ['ovelha', ['o', 'v', 'e', 'lh', 'a']],
    ['pássaro', ['p', 'a', 'ss', 'a', 'r', 'o']],
    ['maçã', ['m', 'a', 'ç', 'ã']],
    ['foguete', ['f', 'o', 'gu', 'e', 't', 'e']],
    ['cinema', ['ce', 'i', 'n', 'e', 'm', 'a']],
    ['trem', ['t', 'r2', 'em']],
    ['honra', ['h', 'on', 'R', 'a']],
    ['xícara', ['x', 'i', 'c', 'a', 'r', 'a']],
    ['põe', ['p', 'õ', 'e']],
    ['Sofá', ['s', 'o', 'f', 'a']],
  ];
  for (const [w, g] of cases) it(`${w} → ${g.join(' ')}`, () => expect(toGraphemes(w)).toEqual(g));

  it('isDecodable', () => {
    const known = new Set(['a', 'e', 'i', 'o', 'u', 'm', 'l']);
    expect(isDecodable('mala', known)).toBe(true);
    expect(isDecodable('mel', known)).toBe(false); // l_ ainda não
    expect(isDecodable('pato', known)).toBe(false);
  });
});

describe('habilidades de leitura', () => {
  it('tem entre 22 e 30 habilidades', () => {
    expect(LEITURA_SKILLS.length).toBeGreaterThanOrEqual(22);
    expect(LEITURA_SKILLS.length).toBeLessThanOrEqual(30);
  });

  it('ids únicos, prefixo lei-, trilha leitura', () => {
    const ids = LEITURA_SKILLS.map((s) => s.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const s of LEITURA_SKILLS) {
      expect(s.id.startsWith('lei-')).toBe(true);
      expect(s.track).toBe('leitura');
      expect(s.blockSize).toBeGreaterThanOrEqual(5);
      expect(s.blockSize).toBeLessThanOrEqual(8);
    }
  });

  it('degraus não decrescem e cobrem D0..D8', () => {
    const steps = LEITURA_SKILLS.map((s) => Number(s.step.slice(1)));
    for (let i = 1; i < steps.length; i++) expect(steps[i]).toBeGreaterThanOrEqual(steps[i - 1]);
    expect(new Set(steps)).toEqual(new Set([0, 1, 2, 3, 4, 5, 6, 7, 8]));
  });

  for (const skill of LEITURA_SKILLS) {
    it(`${skill.id} gera itens válidos`, () => {
      expect(validateSkill(skill, 40, createRng)).toEqual([]);
    });
  }

  it('prompts curtos (≤ 12 palavras por fala)', () => {
    for (const skill of LEITURA_SKILLS)
      for (let s = 1; s <= 30; s++) {
        const item = skill.generate(createRng(s * 101));
        const words = item.prompt.map((p) => p.text).join(' ').split(/\s+/).filter(Boolean).length;
        expect(words, `${skill.id}: ${item.prompt.map((p) => p.text).join(' ')}`).toBeLessThanOrEqual(12);
      }
  });

  it('itens de livro referenciam livros existentes', () => {
    for (const skill of LEITURA_SKILLS)
      for (let s = 1; s <= 40; s++) {
        const item = skill.generate(createRng(s * 13));
        if (item.kind === 'book') expect(getBook(item.bookId), item.bookId).toBeDefined();
      }
  });

  it('léxico só usa figuras existentes', () => {
    for (const w of LEXICON) expect(hasImage(w.img), w.img).toBe(true);
  });
});

describe('livros', () => {
  it('ids únicos e pelo menos 8 livros em português', () => {
    expect(new Set(BOOKS.map((b) => b.id)).size).toBe(BOOKS.length);
    expect(BOOKS.filter((b) => b.lang === 'pt').length).toBeGreaterThanOrEqual(8);
    expect(BOOKS.filter((b) => b.lang === 'en').length).toBeGreaterThanOrEqual(3);
  });

  for (const book of BOOKS) {
    it(`${book.id}: figuras, perguntas e páginas`, () => {
      expect(book.pages.length).toBeGreaterThanOrEqual(3);
      expect(book.pages.length).toBeLessThanOrEqual(5);
      for (const p of book.pages) expect(hasImage(p.img), p.img).toBe(true);
      expect(book.questions.length).toBeGreaterThanOrEqual(2);
      for (const q of book.questions) {
        expect(q.answer).toBeGreaterThanOrEqual(0);
        expect(q.answer).toBeLessThan(q.options.length);
        for (const o of q.options) if (o.img) expect(hasImage(o.img), o.img).toBe(true);
      }
      expect(book.dialogic.length).toBeGreaterThanOrEqual(2);
    });
  }

  for (const book of BOOKS.filter((b) => b.lang === 'pt')) {
    it(`${book.id} é decodificável no nível ${book.level}`, () => {
      const known = graphemesUpTo(book.level);
      const bad = [book.title, ...book.pages.map((p) => p.text)]
        .flatMap(wordsOf)
        .filter((w) => !HIGH_FREQ_WORDS.has(w) && !isDecodable(w, known));
      expect(bad).toEqual([]);
    });
  }

  it('livros em português em ordem de nível não decrescente', () => {
    const idx = (id: string) => LEITURA_SKILLS.findIndex((s) => s.id === id);
    const levels = BOOKS.filter((b) => b.lang === 'pt').map((b) => idx(b.level));
    for (const l of levels) expect(l).toBeGreaterThanOrEqual(0);
    for (let i = 1; i < levels.length; i++) expect(levels[i]).toBeGreaterThanOrEqual(levels[i - 1]);
  });
});
