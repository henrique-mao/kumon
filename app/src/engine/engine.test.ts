import { describe, expect, it } from 'vitest';
import type { Item, Skill, TrackId } from '../curriculum/types';
import { createRng } from '../lib/rng';
import { applyBlockResult, applyPlacement, dueReviews, errorPatterns } from './mastery';
import { addDays, newProfile, type BlockResult } from './model';
import { placementPointer, recordPlacement, startPlacement } from './placement';
import { buildSession } from './session';

const item: Item = {
  kind: 'input', answer: 1, prompt: [{ text: 'x' }],
  hints: [{ say: [{ text: 'a' }] }, { say: [{ text: 'b' }] }, { say: [{ text: 'c' }], showAnswer: true }],
};
const mk = (track: TrackId, i: number, step: string): Skill => ({
  id: `${track}-${i}`, track, step, title: `H${i}`, bncc: ['X'], objective: '', techniques: [],
  stdTimeSec: 5, blockSize: 5, minAge: 4, offlineTip: 'dica', generate: () => item,
});
const track = (t: TrackId) => [mk(t, 0, 'A'), mk(t, 1, 'A'), mk(t, 2, 'B'), mk(t, 3, 'B'), mk(t, 4, 'C')];
const SKILLS: Record<TrackId, Skill[]> = {
  leitura: track('leitura'), matematica: track('matematica'), logica: track('logica'), ingles: track('ingles'),
};
const D = '2026-10-13';
const res = (skillId: string, firstTry: number, avg = 3, mode: BlockResult['mode'] = 'novo', date = D): BlockResult =>
  ({ skillId, date, mode, total: 10, firstTry, avgTimeSec: avg, hintsUsed: 0 });

describe('orientador virtual (domínio)', () => {
  it('avança só após 2 sessões com ≥90% dentro do tempo-padrão', () => {
    const p = newProfile('Theo', 6, 'gato');
    const L = SKILLS.leitura;
    applyBlockResult(p, L[0], L, res(L[0].id, 10));
    expect(p.tracks.leitura.pointer).toBe(0);
    const d = applyBlockResult(p, L[0], L, res(L[0].id, 9));
    expect(p.tracks.leitura.pointer).toBe(1);
    expect(p.skills[L[0].id].status).toBe('dominado');
    expect(p.skills[L[0].id].nextReview).toBe(addDays(D, 1));
    expect(d.map((x) => x.kind)).toEqual(['dominio', 'avanco']);
  });

  it('não avança se acertou mas está acima do tempo-padrão (fluência)', () => {
    const p = newProfile('Ana', 7, 'gato');
    p.settings.untimed = false;
    const L = SKILLS.matematica;
    applyBlockResult(p, L[0], L, res(L[0].id, 10, 9));
    const d = applyBlockResult(p, L[0], L, res(L[0].id, 10, 9));
    expect(p.tracks.matematica.pointer).toBe(0);
    expect(d[0].kind).toBe('fluencia');
  });

  it('modo sem cronômetro ignora o tempo', () => {
    const p = newProfile('Lia', 4, 'gato');
    expect(p.settings.untimed).toBe(true);
    const L = SKILLS.logica;
    applyBlockResult(p, L[0], L, res(L[0].id, 10, 30));
    applyBlockResult(p, L[0], L, res(L[0].id, 10, 30));
    expect(p.tracks.logica.pointer).toBe(1);
  });

  it('volta um degrau após 2 sessões seguidas com < 60%', () => {
    const p = newProfile('Davi', 6, 'gato');
    const L = SKILLS.leitura;
    p.tracks.leitura.pointer = 2;
    applyBlockResult(p, L[2], L, res(L[2].id, 4));
    expect(p.tracks.leitura.pointer).toBe(2);
    const d = applyBlockResult(p, L[2], L, res(L[2].id, 5));
    expect(p.tracks.leitura.pointer).toBe(1);
    expect(d[0].kind).toBe('retrocesso');
  });

  it('emite certificado ao concluir um degrau', () => {
    const p = newProfile('Theo', 6, 'gato');
    const L = SKILLS.leitura;
    p.tracks.leitura.pointer = 1;
    applyBlockResult(p, L[1], L, res(L[1].id, 10));
    applyBlockResult(p, L[1], L, res(L[1].id, 10));
    expect(p.certificates).toEqual([{ track: 'leitura', step: 'A', date: D }]);
  });

  it('revisão espaçada: intervalos crescem com acerto e reiniciam com erro', () => {
    const p = newProfile('Theo', 6, 'gato');
    const L = SKILLS.leitura;
    applyBlockResult(p, L[0], L, res(L[0].id, 10));
    applyBlockResult(p, L[0], L, res(L[0].id, 10));
    applyBlockResult(p, L[0], L, res(L[0].id, 10, 3, 'revisao'));
    expect(p.skills[L[0].id].nextReview).toBe(addDays(D, 3));
    applyBlockResult(p, L[0], L, res(L[0].id, 3, 3, 'revisao'));
    expect(p.skills[L[0].id].nextReview).toBe(addDays(D, 1));
    expect(dueReviews(p, addDays(D, 1), new Set([L[0].id]))).toEqual([L[0].id]);
  });

  it('detecta padrões de erro recorrentes', () => {
    const p = newProfile('Theo', 6, 'gato');
    for (let i = 0; i < 3; i++) p.errors.push({ skillId: 'x', expected: 'PATO', chosen: 'BATO', date: D });
    expect(errorPatterns(p)[0]).toMatchObject({ expected: 'PATO', chosen: 'BATO', count: 3 });
  });
});

describe('nivelamento', () => {
  const cps = [0, 2, 4];
  it('começa um degrau abaixo do limite detectado', () => {
    let st = startPlacement(cps, 5); // começa no degrau 1
    st = recordPlacement(st, true);
    st = recordPlacement(st, true); // passou degrau 1 → testa degrau 2
    expect(st.cp).toBe(2);
    st = recordPlacement(st, false); // falhou degrau 2
    expect(st.done).toBe(true);
    expect(placementPointer(st)).toBe(2);
  });
  it('desce quando erra e termina no início', () => {
    let st = startPlacement(cps, 6);
    st = recordPlacement(st, false);
    st = recordPlacement(st, false);
    st = recordPlacement(st, false);
    expect(st.done).toBe(true);
    expect(placementPointer(st)).toBe(0);
  });
  it('applyPlacement marca habilidades anteriores como dominadas com revisão', () => {
    const p = newProfile('Ana', 7, 'gato');
    applyPlacement(p, SKILLS.matematica, 2, D);
    expect(p.tracks.matematica).toEqual({ pointer: 2, placed: true });
    expect(p.skills['matematica-0'].status).toBe('dominado');
    expect(p.skills['matematica-0'].nextReview).toBe(addDays(D, 1));
  });
});

describe('sessão diária', () => {
  it('respeita o tempo e inclui todas as trilhas ativas', () => {
    const p = newProfile('Theo', 6, 'gato');
    const plan = buildSession(p, SKILLS, [], createRng(1), D);
    expect(new Set(plan.blocks.map((b) => b.track))).toEqual(new Set(['leitura', 'matematica', 'logica', 'ingles']));
    expect(plan.estMinutes).toBeLessThanOrEqual(p.settings.sessionMinutes + 2);
  });
  it('começa com revisões vencidas (aquecimento) e respeita trilhas desativadas', () => {
    const p = newProfile('Theo', 6, 'gato');
    applyPlacement(p, SKILLS.matematica, 2, D);
    p.settings.enabled.ingles = false;
    const plan = buildSession(p, SKILLS, [], createRng(1), addDays(D, 7));
    expect(plan.blocks[0].mode).toBe('revisao');
    expect(plan.blocks.some((b) => b.track === 'ingles')).toBe(false);
  });
  it('inclui livro decodificável quando o nível permite', () => {
    const p = newProfile('Ana', 8, 'gato');
    p.settings.sessionMinutes = 30;
    p.tracks.leitura.pointer = 3;
    const book = { id: 'b1', title: 'Livro', level: 'leitura-2', lang: 'pt' as const, pages: [], questions: [], dialogic: [] };
    const plan = buildSession(p, SKILLS, [book], createRng(2), D);
    expect(plan.blocks.some((b) => b.mode === 'livro')).toBe(true);
  });
});
