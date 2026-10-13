import { describe, expect, it } from 'vitest';
import { createRng } from '../lib/rng';
import { INGLES_SKILLS } from './ingles';
import { bfsPath, countSudokuSolutions, DIR_DELTA, LOGICA_SKILLS, runProgram } from './logica';
import { MATEMATICA_SKILLS } from './matematica';
import type { Item, Skill } from './types';
import { shortestPath, validateSkill } from './validate';

const TRACKS: [string, Skill[], string, string][] = [
  ['matematica', MATEMATICA_SKILLS, 'mat-', 'M'],
  ['logica', LOGICA_SKILLS, 'log-', 'L'],
  ['ingles', INGLES_SKILLS, 'ing-', 'E'],
];

const SEEDS = Array.from({ length: 60 }, (_, i) => (i + 1) * 104729);
const itemsOf = (skill: Skill) => SEEDS.map((s) => skill.generate(createRng(s)));

describe.each(TRACKS)('trilha %s', (track, skills, prefix, stepLetter) => {
  it('tem habilidades com metadados completos', () => {
    expect(skills.length).toBeGreaterThan(10);
    for (const s of skills) {
      expect(s.track).toBe(track);
      expect(s.id.startsWith(prefix)).toBe(true);
      expect(s.step).toMatch(new RegExp(`^${stepLetter}\\d$`));
      expect(s.title).toBeTruthy();
      expect(s.objective).toBeTruthy();
      expect(s.techniques.length).toBeGreaterThan(0);
      expect(s.bncc.length).toBeGreaterThan(0);
      expect(s.stdTimeSec).toBeGreaterThan(0);
      expect(s.blockSize).toBeGreaterThanOrEqual(5);
      expect(s.blockSize).toBeLessThanOrEqual(8);
      expect(s.minAge).toBeGreaterThanOrEqual(4);
      expect(s.minAge).toBeLessThanOrEqual(8);
    }
  });

  it.each(skills.map((s) => [s.id, s] as const))('%s gera itens válidos', (_id, skill) => {
    expect(validateSkill(skill, 40, createRng)).toEqual([]);
  });

  it('ids únicos e degraus em ordem não decrescente', () => {
    const ids = skills.map((s) => s.id);
    expect(new Set(ids).size).toBe(ids.length);
    const nums = skills.map((s) => Number(s.step.slice(1)));
    for (let i = 1; i < nums.length; i++) expect(nums[i]).toBeGreaterThanOrEqual(nums[i - 1]);
  });

  it('gera itens variados', () => {
    for (const s of skills) {
      const keys = new Set(itemsOf(s).map((it) => JSON.stringify(it)));
      expect(keys.size, s.id).toBeGreaterThan(3);
    }
  });
});

describe('ids globais', () => {
  it('são únicos entre as três trilhas e incluem ing-e4-leitura', () => {
    const ids = TRACKS.flatMap(([, s]) => s.map((x) => x.id));
    expect(new Set(ids).size).toBe(ids.length);
    expect(ids).toContain('ing-e4-leitura');
  });
});

/** Recalcula a resposta a partir do visual, quando possível. */
function expectedFromVisual(item: Extract<Item, { kind: 'input' }>): number | null {
  const v = item.visual;
  if (!v) return null;
  switch (v.type) {
    case 'equation': {
      const t = v.text.replace(/−/g, '-').replace(/×/g, '*');
      let m = t.match(/^(\d+) ([-+*]) (\d+) = \?$/);
      if (m) {
        const a = Number(m[1]), b = Number(m[3]);
        return m[2] === '+' ? a + b : m[2] === '-' ? a - b : a * b;
      }
      m = t.match(/^(\d+) \+ \? = (\d+)$/);
      if (m) return Number(m[2]) - Number(m[1]);
      return null;
    }
    case 'vertical':
      return v.op === '+' ? v.a + v.b : v.op === '-' ? v.a - v.b : v.a * v.b;
    case 'baseten':
      return (v.hundreds ?? 0) * 100 + v.tens * 10 + v.ones;
    case 'money':
      return v.values.reduce((s, x) => s + x, 0) / 100;
    case 'tenframe':
      return v.total - v.filled;
    case 'groups':
      return v.groups * v.each;
    case 'objects':
      return v.n;
    case 'sequence': {
      const t = v.items[v.missing];
      return t.kind === 'text' ? Number(t.text) : t.kind === 'dots' ? t.n : null;
    }
    default:
      return null;
  }
}

describe('matemática: respostas corretas', () => {
  const checked = [
    'mat-m0-contar-30', 'mat-m1-sequencia', 'mat-m2-mais-1-2-3', 'mat-m2-compor-10', 'mat-m2-dobros', 'mat-m3-adicao-10',
    'mat-m3-adicao-20', 'mat-m3-subtracao-20', 'mat-m4-dourado-ler', 'mat-m4-centenas', 'mat-m5-vertical-simples',
    'mat-m5-vertical-reserva', 'mat-m6-grupos-iguais', 'mat-m6-tabuadas-2-5-10', 'mat-m6-tabuadas', 'mat-m7-dinheiro',
  ];
  it.each(checked)('%s', (id) => {
    const skill = MATEMATICA_SKILLS.find((s) => s.id === id)!;
    expect(skill).toBeDefined();
    let n = 0;
    for (const item of itemsOf(skill)) {
      if (item.kind !== 'input') continue;
      const exp = expectedFromVisual(item);
      if (exp === null) continue;
      expect(item.answer, JSON.stringify(item.visual)).toBe(exp);
      n++;
    }
    expect(n).toBeGreaterThan(10);
  });

  it('conta armada: com reserva tem troca, sem reserva não tem', () => {
    const get = (id: string) => itemsOf(MATEMATICA_SKILLS.find((s) => s.id === id)!);
    for (const it of get('mat-m5-vertical-simples')) {
      if (it.visual?.type !== 'vertical') throw new Error('sem visual');
      const { a, b, op } = it.visual;
      if (op === '+') expect((a % 10) + (b % 10)).toBeLessThan(10);
      else expect(a % 10).toBeGreaterThanOrEqual(b % 10);
    }
    for (const it of get('mat-m5-vertical-reserva')) {
      if (it.visual?.type !== 'vertical') throw new Error('sem visual');
      const { a, b, op } = it.visual;
      if (op === '+') expect((a % 10) + (b % 10)).toBeGreaterThanOrEqual(10);
      else {
        expect(a % 10).toBeLessThan(b % 10);
        expect(a).toBeGreaterThan(b);
      }
    }
  });

  it('dinheiro sempre em reais inteiros', () => {
    for (const it of itemsOf(MATEMATICA_SKILLS.find((s) => s.id === 'mat-m7-dinheiro')!)) {
      if (it.visual?.type !== 'money') throw new Error('sem visual');
      expect(it.visual.values.reduce((s, v) => s + v, 0) % 100).toBe(0);
    }
  });
});

describe('lógica', () => {
  it('sudokus têm solução válida e única', () => {
    for (const id of ['log-l4-sudoku-facil', 'log-l4-sudoku']) {
      for (const it of itemsOf(LOGICA_SKILLS.find((s) => s.id === id)!)) {
        if (it.kind !== 'sudoku') throw new Error('não é sudoku');
        expect(countSudokuSolutions(it.grid)).toBe(1);
        const empty = it.grid.filter((g) => g === null).length;
        expect(empty).toBeGreaterThanOrEqual(4);
        expect(empty).toBeLessThanOrEqual(8);
        expect(new Set(it.symbols).size).toBe(4);
      }
    }
  });

  it('robôs: maxSteps ≥ caminho mínimo e sem programa (exceto depuração)', () => {
    for (const id of ['log-l5-robo', 'log-l5-robo-paredes']) {
      for (const it of itemsOf(LOGICA_SKILLS.find((s) => s.id === id)!)) {
        if (it.kind !== 'robot') throw new Error('não é robô');
        expect(it.program).toBeUndefined();
        expect(it.maxSteps).toBeGreaterThanOrEqual(shortestPath(it)!);
      }
    }
  });

  it('depuração: o programa está errado e fica certo trocando exatamente uma seta', () => {
    const dirs = Object.keys(DIR_DELTA) as (keyof typeof DIR_DELTA)[];
    for (const it of itemsOf(LOGICA_SKILLS.find((s) => s.id === 'log-l5-depuracao')!)) {
      if (it.kind !== 'robot' || !it.program) throw new Error('sem programa');
      const { size, start, goal, walls, program } = it;
      expect(program.length).toBe(shortestPath(it));
      expect(runProgram(size, start, goal, walls, program)).toBe(false);
      let fixes = 0;
      program.forEach((d, i) => {
        for (const nd of dirs) {
          if (nd === d) continue;
          const p = program.slice();
          p[i] = nd;
          if (runProgram(size, start, goal, walls, p)) fixes++;
        }
      });
      expect(fixes).toBeGreaterThanOrEqual(1);
      // existe uma solução ótima que difere em exatamente uma seta
      const best = bfsPath(size, start, goal, walls)!;
      expect(best.length).toBe(program.length);
    }
  });

  it('simetria: metade esquerda tem size × size/2 células', () => {
    for (const it of itemsOf(LOGICA_SKILLS.find((s) => s.id === 'log-l3-simetria')!)) {
      if (it.visual?.type !== 'symmetry' || it.kind !== 'input') throw new Error('sem simetria');
      expect(it.visual.left.length).toBe((it.visual.size * it.visual.size) / 2);
      const painted = it.visual.left.filter(Boolean).length;
      expect([painted, painted * 2]).toContain(it.answer);
    }
  });
});

describe('inglês', () => {
  it('fônico e leitura só a partir de 6 anos', () => {
    for (const s of INGLES_SKILLS) if (s.step === 'E3' || s.step === 'E4') expect(s.minAge, s.id).toBeGreaterThanOrEqual(6);
  });

  it('build de CVC usa lang en e 3 letras', () => {
    for (const it of itemsOf(INGLES_SKILLS.find((s) => s.id === 'ing-e3-cvc')!)) {
      if (it.kind !== 'build') throw new Error('não é build');
      expect(it.lang).toBe('en');
      expect(it.solution.length).toBe(3);
      expect(it.img).toBeTruthy();
    }
  });

  it('palavras-alvo faladas em inglês estão marcadas com lang en', () => {
    for (const s of INGLES_SKILLS) {
      for (const it of itemsOf(s)) expect(it.prompt.some((p) => p.lang === 'en') || s.id === 'ing-e4-frases', s.id).toBe(true);
    }
  });
});
