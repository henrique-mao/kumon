import { describe, expect, it } from 'vitest';
import { classifySondagem, classifyWord, syllabify } from '../curriculum/escrita';
import { familyItem } from '../curriculum/familia';
import { LEITURA_SKILLS } from '../curriculum/leitura';
import { validateItem } from '../curriculum/validate';
import { createRng } from '../lib/rng';
import { mergeData, mergeProfile } from '../lib/merge';
import { BKT_MASTERY, bktRun, bktUpdate, DEFAULT_BKT } from './bkt';
import { applyBlockResult } from './mastery';
import { newProfile, type BlockResult } from './model';
import { buildSession } from './session';
import { SKILLS_BY_TRACK } from '../curriculum';

describe('BKT', () => {
  it('sobe com acertos e cai com erros', () => {
    const up = bktUpdate(0.3, true);
    const down = bktUpdate(0.3, false);
    expect(up).toBeGreaterThan(0.3);
    expect(down).toBeLessThan(up);
  });
  it('10 acertos seguidos passam do limiar; 50% não', () => {
    expect(bktRun(DEFAULT_BKT.init, Array(10).fill(true))).toBeGreaterThan(BKT_MASTERY);
    expect(bktRun(DEFAULT_BKT.init, Array.from({ length: 10 }, (_, i) => i % 2 === 0))).toBeLessThan(BKT_MASTERY);
  });
  it('modo regras+bkt segura o avanço até o modelo confirmar', () => {
    const p = newProfile('Ana', 7, 'gato');
    p.settings.advanceModel = 'regras+bkt';
    p.settings.untimed = true;
    const L = LEITURA_SKILLS;
    const r = (outcomes: boolean[]): BlockResult => ({ skillId: L[0].id, date: '2026-10-13', mode: 'novo', total: outcomes.length, firstTry: outcomes.filter(Boolean).length, avgTimeSec: 2, hintsUsed: 0, outcomes });
    // Regras aprovariam (100% duas vezes), mas a estimativa do modelo está abaixo da meta
    const seq = Array(10).fill(true);
    applyBlockResult(p, L[0], L, r(seq));
    p.skills[L[0].id].pKnown = 0.5;
    const d = applyBlockResult(p, L[0], L, { ...r(seq), outcomes: [] });
    expect(p.tracks.leitura.pointer).toBe(0);
    expect(d[0].text).toContain('modelo estatístico');
    // na próxima sessão boa, o modelo confirma e avança
    applyBlockResult(p, L[0], L, r(seq));
    expect(p.skills[L[0].id].pKnown!).toBeGreaterThanOrEqual(BKT_MASTERY);
    expect(p.tracks.leitura.pointer).toBe(1);
  });
});

describe('separação silábica', () => {
  const cases: [string, string][] = [
    ['BORBOLETA', 'BOR-BO-LE-TA'], ['CAVALO', 'CA-VA-LO'], ['GATO', 'GA-TO'], ['BOI', 'BOI'],
    ['MAMÃE', 'MA-MÃE'], ['THEO', 'THE-O'], ['GALINHA', 'GA-LI-NHA'], ['QUEIJO', 'QUEI-JO'],
    ['BICICLETA', 'BI-CI-CLE-TA'], ['CARRO', 'CAR-RO'], ['MELANCIA', 'ME-LAN-CI-A'], ['PIÃO', 'PI-ÃO'],
    ['CHOCOLATE', 'CHO-CO-LA-TE'], ['BRIGADEIRO', 'BRI-GA-DEI-RO'], ['PASSARINHO', 'PAS-SA-RI-NHO'], ['LUCAS', 'LU-CAS'],
  ];
  for (const [w, s] of cases) it(w, () => expect(syllabify(w).join('-')).toBe(s));
});

describe('psicogênese (sugestão de hipótese)', () => {
  it('classifica exemplos clássicos', () => {
    expect(classifyWord('BORBOLETA', 'AMTIOPRS')).toBe('pre-silabica');
    expect(classifyWord('BORBOLETA', 'XKWZ')).toBe('silabica-sem-valor');
    expect(classifyWord('BORBOLETA', 'OOEA')).toBe('silabica-com-valor');
    expect(classifyWord('GATO', 'AO')).toBe('silabica-com-valor');
    expect(classifyWord('GATO', 'GAO')).toBe('silabico-alfabetica');
    expect(classifyWord('BORBOLETA', 'BOBOLTA')).toBe('silabico-alfabetica');
    expect(classifyWord('BORBOLETA', 'BORBULETA')).toBe('alfabetica');
    expect(classifyWord('CAVALO', 'CAVALO')).toBe('alfabetica');
  });
  it('usa a mediana das palavras', () => {
    expect(classifySondagem([
      { target: 'BORBOLETA', written: 'OOEA' }, { target: 'CAVALO', written: 'AAO' },
      { target: 'GATO', written: 'GAO' }, { target: 'BOI', written: 'O' },
    ])).toBe('silabica-com-valor');
  });
});

describe('palavras da família', () => {
  const words = [{ w: 'THEO', syl: ['THE', 'O'], img: 'menino' }, { w: 'MAMÃE', syl: ['MA', 'MÃE'], img: 'mamae' }, { w: 'REX', syl: ['REX'] }];
  it('gera itens válidos (sílabas e letras)', () => {
    for (let s = 1; s < 40; s++) {
      expect(validateItem(familyItem(words, createRng(s), s % 2 === 0))).toEqual([]);
    }
  });
  it('entram na sessão diária', () => {
    const p = newProfile('Theo', 6, 'gato');
    p.customWords = words;
    const plan = buildSession(p, SKILLS_BY_TRACK, [], createRng(3), '2026-10-13');
    expect(plan.blocks.some((b) => b.mode === 'familia')).toBe(true);
  });
});

describe('importar/mesclar dados de outro aparelho', () => {
  it('une históricos e mantém o progresso mais avançado', () => {
    const a = newProfile('Theo', 6, 'gato');
    const b = structuredClone(a);
    a.sessions.push({ date: '2026-10-10', minutes: 15, items: 30, firstTry: 0, blocks: 4 });
    b.sessions.push({ date: '2026-10-12', minutes: 12, items: 25, firstTry: 0, blocks: 4 });
    b.tracks.matematica.pointer = 5;
    a.stickers = ['leao'];
    b.stickers = ['girafa'];
    const m = mergeProfile(a, b);
    expect(m.sessions).toHaveLength(2);
    expect(m.tracks.matematica.pointer).toBe(5);
    expect(m.stickers.sort()).toEqual(['girafa', 'leao']);
  });
  it('adiciona crianças novas e mescla as existentes', () => {
    const a = newProfile('Theo', 6, 'gato');
    const c = newProfile('Lia', 4, 'coelho');
    const { data, added, merged } = mergeData({ version: 1, profiles: [a] }, { version: 1, profiles: [structuredClone(a), c] });
    expect(added).toBe(1);
    expect(merged).toBe(1);
    expect(data.profiles).toHaveLength(2);
  });
  it('rejeita arquivo inválido', () => {
    expect(() => mergeData({ version: 1, profiles: [] }, {} as never)).toThrow();
  });
});
