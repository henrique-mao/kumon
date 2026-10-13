// Trilha LÓGICA (L0–L5) — observação, classificação, padrões, espacial, dedutivo e
// pensamento computacional desplugado (robô com setas, depuração).
import { choose, hints, img, nearNumbers, pt, tok } from './helpers';
import type { ColorId, Dir, Hint, Item, Rng, Say, ShapeId, Skill, Token } from './types';

// ---------- apoio ----------

const say = (s: string): Say[] => [pt(s)];
const SHAPE_IDS: ShapeId[] = ['circulo', 'quadrado', 'triangulo', 'retangulo', 'estrela', 'coracao', 'losango'];
const COLOR_IDS: ColorId[] = ['vermelho', 'azul', 'amarelo', 'verde', 'laranja', 'roxo', 'rosa'];
const COLOR_PT: Record<ColorId, string> = {
  vermelho: 'vermelho', azul: 'azul', amarelo: 'amarelo', verde: 'verde', laranja: 'laranja', roxo: 'roxo',
  rosa: 'rosa', marrom: 'marrom', preto: 'preto', branco: 'branco',
};
const shape = (s: ShapeId, c: ColorId, size: 'p' | 'm' | 'g' = 'm'): Token => ({ kind: 'shape', shape: s, color: c, size });

/** Figuras com silhueta bem reconhecível (para o jogo das sombras). */
const SHADOW_IMGS = [
  'elefante', 'girafa', 'coelho', 'cavalo', 'tartaruga', 'borboleta', 'peixe', 'passaro', 'aviao', 'barco',
  'guarda_chuva', 'casa', 'arvore', 'chave', 'tesoura', 'violao', 'foguete', 'bicicleta', 'cacto', 'maca', 'banana', 'estrela',
];

const CATEGORIES: { name: string; imgs: string[] }[] = [
  { name: 'animais', imgs: ['cachorro', 'gato', 'vaca', 'leao', 'macaco', 'coelho', 'elefante', 'porco', 'zebra', 'cavalo'] },
  { name: 'frutas', imgs: ['maca', 'banana', 'uva', 'pera', 'abacaxi', 'morango', 'melancia', 'laranja', 'limao'] },
  { name: 'veículos', imgs: ['carro', 'onibus', 'aviao', 'barco', 'trem', 'moto', 'bicicleta', 'navio', 'jipe'] },
  { name: 'roupas', imgs: ['vestido', 'meia', 'luva', 'bone', 'chapeu', 'bota', 'sapato', 'chinelo'] },
  { name: 'instrumentos musicais', imgs: ['violao', 'tambor', 'sino'] },
  { name: 'coisas da natureza', imgs: ['arvore', 'flor', 'sol', 'lua', 'nuvem', 'montanha', 'folha', 'cacto'] },
];

/** Gera um token para padrões: figura ou forma colorida, todos distintos entre si. */
function patternTokens(rng: Rng, n: number): Token[] {
  if (rng.next() < 0.5) {
    return rng.sample(['maca', 'estrela', 'coracao', 'bola', 'flor', 'sol', 'lua', 'peixe', 'gato', 'carro', 'balao', 'folha'], n).map(
      (k): Token => ({ kind: 'img', img: k }),
    );
  }
  const shapes = rng.sample(SHAPE_IDS, n);
  const colors = rng.sample(COLOR_IDS, n);
  return shapes.map((s, i) => shape(s, colors[i]));
}

function patternItem(rng: Rng, types: string[]): Item {
  const type = rng.pick(types);
  const letters = [...new Set(type.split(''))];
  const toks = patternTokens(rng, letters.length + 1);
  const map = new Map(letters.map((l, i) => [l, toks[i]]));
  const extra = toks[letters.length];
  const period = type.length;
  const len = period <= 2 ? 6 : period * 2;
  const seq = Array.from({ length: len }, (_, i) => map.get(type[i % period])!);
  const missing = rng.int(period, len - 1);
  const ans = seq[missing];
  const wrong = [...letters.map((l) => map.get(l)!).filter((t) => t !== ans), extra];
  const spoken = type.split('').join('-');
  return choose(
    rng,
    say('O que vem no lugar vazio?'),
    tok(ans),
    wrong.map((t) => tok(t)),
    hints('Fale o padrão em voz alta, batendo palmas.', `O padrão se repete: ${spoken}, ${spoken}…`, 'Esta peça continua o padrão!'),
    { visual: { type: 'sequence', items: seq, missing } },
  );
}

// ---------- sudoku ----------

const BASE: number[][] = [
  [0, 1, 2, 3],
  [2, 3, 0, 1],
  [1, 0, 3, 2],
  [3, 2, 1, 0],
];

/** Solução 4x4 aleatória (permutações que preservam a validade). */
export function randomSudoku(rng: Rng): number[] {
  let g = BASE.map((r) => r.slice());
  const sym = rng.shuffle([0, 1, 2, 3]);
  g = g.map((r) => r.map((v) => sym[v]));
  // troca de linhas dentro das faixas e das faixas
  const bands = rng.shuffle([0, 1]);
  const rows = bands.flatMap((b) => rng.shuffle([b * 2, b * 2 + 1]));
  g = rows.map((r) => g[r]);
  const stacks = rng.shuffle([0, 1]);
  const cols = stacks.flatMap((s) => rng.shuffle([s * 2, s * 2 + 1]));
  g = g.map((r) => cols.map((c) => r[c]));
  if (rng.next() < 0.5) g = g[0].map((_, c) => g.map((r) => r[c]));
  return g.flat();
}

/** Conta soluções (até `limit`) de uma grade 4x4 parcial. */
export function countSudokuSolutions(grid: (number | null)[], limit = 2): number {
  const g = grid.slice();
  const ok = (i: number, v: number) => {
    const r = Math.floor(i / 4), c = i % 4;
    const br = r - (r % 2), bc = c - (c % 2);
    for (let k = 0; k < 4; k++) {
      if (g[r * 4 + k] === v || g[k * 4 + c] === v) return false;
    }
    for (const [dr, dc] of [[0, 0], [0, 1], [1, 0], [1, 1]]) if (g[(br + dr) * 4 + bc + dc] === v) return false;
    return true;
  };
  let count = 0;
  const solve = (): void => {
    const i = g.indexOf(null);
    if (i < 0) { count++; return; }
    for (let v = 0; v < 4 && count < limit; v++) {
      if (ok(i, v)) { g[i] = v; solve(); g[i] = null; }
    }
  };
  solve();
  return count;
}

const SUDOKU_SETS = [
  ['gato', 'cachorro', 'peixe', 'passaro'],
  ['maca', 'banana', 'uva', 'morango'],
  ['sol', 'lua', 'estrela', 'nuvem'],
  ['carro', 'aviao', 'barco', 'trem'],
  ['bola', 'pipa', 'ursinho', 'balao'],
  ['coelho', 'sapo', 'joaninha', 'borboleta'],
];

function sudokuItem(rng: Rng, minEmpty: number, maxEmpty: number): Item {
  const solution = randomSudoku(rng);
  const empties = rng.int(minEmpty, maxEmpty);
  let grid: (number | null)[] = solution.slice();
  for (let attempt = 0; attempt < 50; attempt++) {
    const cand: (number | null)[] = solution.slice();
    for (const i of rng.sample([...Array(16).keys()], empties)) cand[i] = null;
    grid = cand;
    if (countSudokuSolutions(cand) === 1) break;
  }
  if (countSudokuSolutions(grid) !== 1) {
    // fallback: esvazia uma casa por linha (sempre única)
    grid = solution.slice();
    for (let r = 0; r < 4; r++) grid[r * 4 + rng.int(0, 3)] = null;
  }
  return {
    kind: 'sudoku',
    grid,
    solution,
    symbols: rng.pick(SUDOKU_SETS),
    prompt: say('Cada figura aparece uma vez em cada linha e coluna.'),
    hints: hints(
      'Procure uma linha que só falta uma figura.',
      'Olhe a linha, a coluna e o quadradinho: qual figura ainda não apareceu?',
      'Veja a figura certa na casa destacada.',
    ),
  };
}

// ---------- robô ----------

export const DIR_DELTA: Record<Dir, [number, number]> = { cima: [0, -1], baixo: [0, 1], esquerda: [-1, 0], direita: [1, 0] };
const DIRS: Dir[] = ['cima', 'baixo', 'esquerda', 'direita'];
type P = [number, number];

/** Caminho mínimo (BFS) como lista de setas, ou null. */
export function bfsPath(size: number, start: P, goal: P, walls: P[]): Dir[] | null {
  const key = (x: number, y: number) => `${x},${y}`;
  const wall = new Set(walls.map(([x, y]) => key(x, y)));
  const prev = new Map<string, { from: string; dir: Dir }>();
  const seen = new Set([key(...start)]);
  let frontier: P[] = [start];
  while (frontier.length) {
    const next: P[] = [];
    for (const [x, y] of frontier) {
      if (x === goal[0] && y === goal[1]) {
        const path: Dir[] = [];
        let k = key(x, y);
        while (prev.has(k)) { const p = prev.get(k)!; path.unshift(p.dir); k = p.from; }
        return path;
      }
      for (const d of DIRS) {
        const nx = x + DIR_DELTA[d][0], ny = y + DIR_DELTA[d][1];
        if (nx < 0 || ny < 0 || nx >= size || ny >= size) continue;
        const nk = key(nx, ny);
        if (wall.has(nk) || seen.has(nk)) continue;
        seen.add(nk);
        prev.set(nk, { from: key(x, y), dir: d });
        next.push([nx, ny]);
      }
    }
    frontier = next;
  }
  return null;
}

/** Simula um programa; retorna true se chega exatamente ao objetivo sem bater/sair. */
export function runProgram(size: number, start: P, goal: P, walls: P[], program: Dir[]): boolean {
  let [x, y] = start;
  for (const d of program) {
    x += DIR_DELTA[d][0]; y += DIR_DELTA[d][1];
    if (x < 0 || y < 0 || x >= size || y >= size) return false;
    if (walls.some((w) => w[0] === x && w[1] === y)) return false;
  }
  return x === goal[0] && y === goal[1];
}

function robotLevel(rng: Rng, size: number, nWalls: number, minDist: number): { start: P; goal: P; walls: P[]; path: Dir[] } {
  for (let attempt = 0; attempt < 200; attempt++) {
    const start: P = [rng.int(0, size - 1), rng.int(0, size - 1)];
    const goal: P = [rng.int(0, size - 1), rng.int(0, size - 1)];
    if (Math.abs(start[0] - goal[0]) + Math.abs(start[1] - goal[1]) < minDist) continue;
    const walls: P[] = [];
    const used = new Set([`${start}`, `${goal}`]);
    while (walls.length < nWalls) {
      const w: P = [rng.int(0, size - 1), rng.int(0, size - 1)];
      if (used.has(`${w}`)) continue;
      used.add(`${w}`);
      walls.push(w);
    }
    const path = bfsPath(size, start, goal, walls);
    if (path && path.length <= size * 2 + 2) return { start, goal, walls, path };
  }
  return { start: [0, 0], goal: [size - 1, size - 1], walls: [], path: bfsPath(size, [0, 0], [size - 1, size - 1], [])! };
}

const robotHints = (path: Dir[]): [Hint, Hint, Hint] =>
  hints(
    'Leve o robô até a estrela, uma casinha por vez.',
    `Primeiro: ${path[0]}. Siga o dedo pelo caminho antes de programar.`,
    `Um caminho: ${path.join(', ')}.`,
  );

// ---------- dedução ----------

const DEDUCE_ANIMALS: { img: string; name: string; group: string }[] = [
  { img: 'passaro', name: 'o pássaro', group: 'voa' },
  { img: 'borboleta', name: 'a borboleta', group: 'voa' },
  { img: 'abelha', name: 'a abelha', group: 'voa' },
  { img: 'coruja', name: 'a coruja', group: 'voa' },
  { img: 'peixe', name: 'o peixe', group: 'vive na água' },
  { img: 'golfinho', name: 'o golfinho', group: 'vive na água' },
  { img: 'tubarao', name: 'o tubarão', group: 'vive na água' },
  { img: 'polvo', name: 'o polvo', group: 'vive na água' },
  { img: 'gato', name: 'o gato', group: 'tem quatro patas' },
  { img: 'cachorro', name: 'o cachorro', group: 'tem quatro patas' },
  { img: 'vaca', name: 'a vaca', group: 'tem quatro patas' },
  { img: 'cavalo', name: 'o cavalo', group: 'tem quatro patas' },
  { img: 'elefante', name: 'o elefante', group: 'tem quatro patas' },
];

const KIDS = ['Ana', 'Bia', 'Duda', 'Léo', 'Theo', 'Davi'];

// ---------- habilidades ----------

export const LOGICA_SKILLS: Skill[] = [
  // ===== L0 — Observação =====
  {
    id: 'log-l0-igual',
    track: 'logica',
    step: 'L0',
    title: 'Igual ou diferente',
    bncc: ['EI03ET01', 'EI03ET05'],
    objective: 'Comparar figuras observando forma, cor e tamanho para achar a idêntica.',
    techniques: ['Observação', 'Atenção a atributos'],
    stdTimeSec: 5,
    blockSize: 6,
    minAge: 4,
    offlineTip: 'Espalhe pares de meias misturadas: a criança acha os pares iguais e explica como sabe.',
    generate(rng) {
      const [s, s2] = rng.sample(SHAPE_IDS, 2);
      const [c, c2] = rng.sample(COLOR_IDS, 2);
      const target = shape(s, c);
      const wrong = [shape(s, c2), shape(s2, c)];
      if (rng.next() < 0.5) wrong.push(shape(s, c, rng.pick(['p', 'g'] as const)));
      return choose(
        rng,
        say('Toque na figura igualzinha a esta.'),
        tok(target),
        wrong.map((t) => tok(t)),
        hints('Olhe a forma, a cor e o tamanho.', `Procure: forma igual, cor ${COLOR_PT[c]}, mesmo tamanho.`, 'Esta é igualzinha!'),
        { visual: { type: 'token', token: target, big: true } },
      );
    },
  },
  {
    id: 'log-l0-sombra',
    track: 'logica',
    step: 'L0',
    title: 'Sombra correspondente',
    bncc: ['EI03ET01', 'EI03ET05'],
    objective: 'Reconhecer um objeto pelo contorno (percepção visual e figura-fundo).',
    techniques: ['Observação', 'Percepção visual'],
    stdTimeSec: 5,
    blockSize: 6,
    minAge: 4,
    offlineTip: 'Com uma lanterna, façam sombras de brinquedos na parede. Adivinhe o que é!',
    generate(rng) {
      const [t, ...others] = rng.sample(SHADOW_IMGS, rng.next() < 0.5 ? 3 : 4);
      return choose(
        rng,
        say('De quem é esta sombra?'),
        img(t),
        others.map((o) => img(o)),
        hints('Olhe o contorno: tem orelhas? rabo? pontas?', 'Compare cada figura com a sombra.', 'É esta! O contorno é igual.'),
        { visual: { type: 'shadow', img: t } },
      );
    },
  },

  // ===== L1 — Classificação =====
  {
    id: 'log-l1-nao-pertence',
    track: 'logica',
    step: 'L1',
    title: 'Qual não pertence ao grupo?',
    bncc: ['EI03ET05', 'EF01MA09'],
    objective: 'Classificar por categoria (animais, frutas, veículos, roupas…) e achar o intruso.',
    techniques: ['Classificação', 'Vocabulário'],
    stdTimeSec: 6,
    blockSize: 6,
    minAge: 4,
    offlineTip: 'Na hora de guardar as compras, separem "frutas", "limpeza" e "pão". Coloque um intruso de brincadeira!',
    generate(rng) {
      const [a, b] = rng.sample(CATEGORIES, 2);
      const same = rng.sample(a.imgs, 3);
      const odd = rng.pick(b.imgs.filter((k) => !a.imgs.includes(k)));
      return choose(
        rng,
        say('Qual não combina com os outros?'),
        img(odd),
        same.map((k) => img(k)),
        hints('Três são da mesma turma. E um?', `Três são ${a.name}.`, `Este não é do grupo dos ${a.name}.`),
      );
    },
  },
  {
    id: 'log-l1-classificar',
    track: 'logica',
    step: 'L1',
    title: 'Classificar por cor e por forma',
    bncc: ['EI03ET05', 'EF01MA09', 'EF01CO01'],
    objective: 'Escolher o atributo pedido (cor ou forma) ignorando o outro.',
    techniques: ['Classificação', 'Atenção a atributos'],
    stdTimeSec: 6,
    blockSize: 6,
    minAge: 4,
    offlineTip: 'Separem blocos ou tampinhas por cor; depois misturem e separem por forma ou tamanho.',
    generate(rng) {
      const [s1, s2, s3] = rng.sample(SHAPE_IDS, 3);
      const [c1, c2, c3] = rng.sample(COLOR_IDS, 3);
      const ref = shape(s1, c1);
      const byColor = rng.next() < 0.5;
      const correct = byColor ? shape(s2, c1) : shape(s1, c2);
      const wrong = byColor ? [shape(s1, c2), shape(s3, c3)] : [shape(s2, c1), shape(s3, c3)];
      return choose(
        rng,
        say(byColor ? 'Qual tem a mesma cor? A forma pode mudar.' : 'Qual tem a mesma forma? A cor pode mudar.'),
        tok(correct),
        wrong.map((t) => tok(t)),
        hints(
          byColor ? 'Esqueça a forma. Só olhe a cor.' : 'Esqueça a cor. Só olhe a forma.',
          byColor ? `A cor é ${COLOR_PT[c1]}. Quem mais é ${COLOR_PT[c1]}?` : 'Passe o dedo pelo contorno. Qual é igual?',
          byColor ? `Esta também é ${COLOR_PT[c1]}!` : 'Esta tem a mesma forma!',
        ),
        { visual: { type: 'token', token: ref, big: true } },
      );
    },
  },
  {
    id: 'log-l1-tamanho',
    track: 'logica',
    step: 'L1',
    title: 'Classificar por tamanho (maior, menor, médio)',
    bncc: ['EI03ET01', 'EI03ET05', 'EF01MA09'],
    objective: 'Comparar e ordenar tamanhos: grande, médio e pequeno.',
    techniques: ['Classificação', 'Seriação'],
    stdTimeSec: 4,
    blockSize: 6,
    minAge: 4,
    offlineTip: 'Enfileirem panelas, sapatos ou bichos de pelúcia do menor para o maior.',
    generate(rng) {
      const s = rng.pick(SHAPE_IDS), c = rng.pick(COLOR_IDS);
      const which = rng.pick(['g', 'p', 'm'] as const);
      const name = { g: 'maior', p: 'menor', m: 'do meio (médio)' }[which];
      const others = (['p', 'm', 'g'] as const).filter((z) => z !== which);
      return choose(
        rng,
        say(`Toque no ${name}.`),
        tok(shape(s, c, which)),
        others.map((z) => tok(shape(s, c, z))),
        hints('Compare os três lado a lado.', 'Pequeno, médio, grande: coloque em ordem com o olhar.', `Este é o ${name}!`),
      );
    },
  },

  // ===== L2 — Padrões e sequências =====
  {
    id: 'log-l2-padrao-ab',
    track: 'logica',
    step: 'L2',
    title: 'Padrões AB e AABB',
    bncc: ['EI03ET05', 'EF01MA09', 'EF01MA10', 'EF02MA11'],
    objective: 'Perceber e continuar padrões de repetição simples.',
    techniques: ['Padrões', 'Pensamento algébrico'],
    stdTimeSec: 6,
    blockSize: 6,
    minAge: 4,
    offlineTip: 'Façam colares de macarrão ou fileiras de talheres: garfo, colher, garfo, colher… Qual vem agora?',
    generate: (rng) => patternItem(rng, ['AB', 'AB', 'AABB']),
  },
  {
    id: 'log-l2-padrao-abc',
    track: 'logica',
    step: 'L2',
    title: 'Padrões AAB, ABB e ABC',
    bncc: ['EF01MA10', 'EF02MA10', 'EF02MA11'],
    objective: 'Continuar padrões de repetição com núcleo de 3 elementos.',
    techniques: ['Padrões', 'Pensamento algébrico'],
    stdTimeSec: 7,
    blockSize: 6,
    minAge: 5,
    offlineTip: 'Batam um ritmo: palma, palma, pé… palma, palma, pé. A criança continua e depois inventa um.',
    generate: (rng) => patternItem(rng, ['AAB', 'ABB', 'ABC', 'ABC']),
  },
  {
    id: 'log-l2-crescente',
    track: 'logica',
    step: 'L2',
    title: 'Padrões crescentes',
    bncc: ['EF01MA10', 'EF02MA09', 'EF02MA11'],
    objective: 'Perceber padrões que crescem (sempre um a mais, dois a mais) e prever o próximo.',
    techniques: ['Padrões', 'Subitização', 'Pensamento algébrico'],
    stdTimeSec: 7,
    blockSize: 6,
    minAge: 5,
    offlineTip: 'Montem escadinhas de blocos: 1, 2, 3… Quantos blocos terá o próximo degrau?',
    generate(rng) {
      const step = rng.next() < 0.6 ? 1 : 2;
      const len = rng.int(4, 5);
      const start = rng.int(1, Math.max(1, 10 - step * (len - 1)));
      const seq = Array.from({ length: len }, (_, i) => start + i * step);
      const missing = rng.next() < 0.7 ? len - 1 : rng.int(1, len - 2);
      const ans = seq[missing];
      return choose(
        rng,
        say('Quantos pontinhos vêm no lugar vazio?'),
        tok({ kind: 'dots', n: ans }),
        nearNumbers(rng, ans, 2, 2, 1).map((n) => tok({ kind: 'dots', n })),
        hints('Cada desenho tem quantos a mais que o anterior?', `Sempre mais ${step}: ${seq.map((v, i) => (i === missing ? '…' : v)).join(', ')}.`, `São ${ans} pontinhos.`),
        { visual: { type: 'sequence', items: seq.map((n): Token => ({ kind: 'dots', n })), missing } },
      );
    },
  },
  {
    id: 'log-l2-sequencia-numerica',
    track: 'logica',
    step: 'L2',
    title: 'Sequências numéricas (de 2 em 2, 5 em 5, 10 em 10)',
    bncc: ['EF01MA10', 'EF02MA09', 'EF02MA11'],
    objective: 'Descobrir a regra de uma sequência numérica crescente ou decrescente e completar.',
    techniques: ['Padrões', 'Contagem por saltos'],
    stdTimeSec: 8,
    blockSize: 6,
    minAge: 6,
    offlineTip: 'Contem os pés da família de 2 em 2, e os dedos das mãos de 5 em 5 e de 10 em 10.',
    generate(rng) {
      const step = rng.pick([2, 2, 3, 5, 10]);
      const down = rng.next() < 0.3;
      const start = step >= 5 ? step * rng.int(0, 6) : rng.int(0, 20);
      let seq = Array.from({ length: 5 }, (_, i) => start + i * step);
      if (down) seq = seq.reverse();
      const missing = rng.int(1, 4);
      const ans = seq[missing];
      return {
        kind: 'input',
        answer: ans,
        prompt: say('Descubra a regra. Que número falta?'),
        hints: hints(
          'Quanto muda de um número para o outro?',
          `A regra é: ${down ? 'menos' : 'mais'} ${step}.`,
          `Falta o ${ans}: ${seq.join(', ')}.`,
        ),
        visual: { type: 'sequence', items: seq.map((v): Token => ({ kind: 'text', text: String(v) })), missing },
      };
    },
  },

  // ===== L3 — Espacial =====
  {
    id: 'log-l3-simetria',
    track: 'logica',
    step: 'L3',
    title: 'Simetria (espelho)',
    bncc: ['EI03ET01', 'EF01MA11', 'EF04MA19'],
    objective: 'Imaginar o lado espelhado de um desenho na malha quadriculada.',
    techniques: ['Visualização espacial', 'Simetria de reflexão'],
    stdTimeSec: 12,
    blockSize: 5,
    minAge: 6,
    offlineTip: 'Pinte metade de uma borboleta com tinta, dobre o papel e abra: o espelho aparece!',
    generate(rng) {
      // `left`: metade esquerda da grade, `size` linhas × `size/2` colunas, em ordem de linhas.
      const size = rng.next() < 0.7 ? 4 : 6;
      const cells = size * (size / 2);
      let left: boolean[] = [];
      let painted = 0;
      while (painted < 2 || painted === cells) {
        left = Array.from({ length: cells }, () => rng.next() < 0.45);
        painted = left.filter(Boolean).length;
      }
      const total = rng.next() < 0.4;
      return {
        kind: 'input',
        answer: total ? painted * 2 : painted,
        prompt: say(total ? 'Com o espelho, quantos quadradinhos pintados ao todo?' : 'No espelho, quantos quadradinhos pintados do outro lado?'),
        hints: hints(
          'O espelho copia cada quadradinho, virado para o outro lado.',
          `Deste lado há ${painted} pintados.`,
          total ? `${painted} + ${painted} = ${painted * 2}.` : `O outro lado também terá ${painted}.`,
        ),
        visual: { type: 'symmetry', size, left },
      };
    },
  },

  // ===== L4 — Raciocínio dedutivo =====
  {
    id: 'log-l4-sudoku-facil',
    track: 'logica',
    step: 'L4',
    title: 'Sudoku 4x4 com figuras (poucas casas)',
    bncc: ['EF01MA09', 'EF02CO01'],
    objective: 'Usar a regra "uma de cada" em linhas, colunas e quadrantes para completar poucas casas.',
    techniques: ['Raciocínio dedutivo', 'Sudoku infantil'],
    stdTimeSec: 40,
    blockSize: 5,
    minAge: 5,
    offlineTip: 'Num tabuleiro 4x4 de papel, usem 4 tipos de tampinhas: nenhuma pode repetir na linha nem na coluna.',
    generate: (rng) => sudokuItem(rng, 4, 5),
  },
  {
    id: 'log-l4-deducao',
    track: 'logica',
    step: 'L4',
    title: 'Enigmas de pistas (dedução simples)',
    bncc: ['EI03ET05', 'EF01MA09', 'EF02CO01'],
    objective: 'Combinar duas pistas (uma afirmação e uma negação) para eliminar opções e chegar à resposta.',
    techniques: ['Raciocínio dedutivo', 'Eliminação'],
    stdTimeSec: 10,
    blockSize: 6,
    minAge: 5,
    offlineTip: 'Brinquem de "Adivinha quem é?": "Penso num bicho que voa, mas não é a abelha…".',
    generate(rng) {
      if (rng.next() < 0.5) {
        const groups = [...new Set(DEDUCE_ANIMALS.map((a) => a.group))];
        const g = rng.pick(groups);
        const [t, o1] = rng.sample(DEDUCE_ANIMALS.filter((a) => a.group === g), 2);
        const o2 = rng.pick(DEDUCE_ANIMALS.filter((a) => a.group !== g));
        return choose(
          rng,
          say(`Meu bicho ${g}, mas não é ${o1.name}. Quem é?`),
          img(t.img),
          [img(o1.img), img(o2.img)],
          hints(`Quais destes ${g}?`, `${o2.name} não ${g}. E ${o1.name} não pode ser.`, `É ${t.name}!`),
        );
      }
      const name = rng.pick(KIDS);
      const [ans, n1, n2] = rng.sample(COLOR_IDS, 3);
      return choose(
        rng,
        say(`${name} não está de ${COLOR_PT[n1]} nem de ${COLOR_PT[n2]}. Qual é a cor?`),
        tok({ kind: 'color', color: ans }),
        [tok({ kind: 'color', color: n1 }), tok({ kind: 'color', color: n2 })],
        hints('Tire as cores que não podem ser.', `Não é ${COLOR_PT[n1]}. Não é ${COLOR_PT[n2]}. Sobrou uma!`, `${name} está de ${COLOR_PT[ans]}.`),
      );
    },
  },
  {
    id: 'log-l4-sudoku',
    track: 'logica',
    step: 'L4',
    title: 'Sudoku 4x4 com figuras (mais casas vazias)',
    bncc: ['EF01MA09', 'EF02CO01'],
    objective: 'Resolver sudoku 4x4 com 6 a 8 casas vazias, encadeando deduções.',
    techniques: ['Raciocínio dedutivo', 'Sudoku infantil'],
    stdTimeSec: 60,
    blockSize: 5,
    minAge: 6,
    offlineTip: 'Façam juntos um sudoku 4x4 com desenhos; a criança explica em voz alta por que cada figura vai ali.',
    generate: (rng) => sudokuItem(rng, 6, 8),
  },

  // ===== L5 — Pensamento computacional desplugado =====
  {
    id: 'log-l5-robo',
    track: 'logica',
    step: 'L5',
    title: 'Robô com setas (sequência de comandos)',
    bncc: ['EF01CO02', 'EF01CO03', 'EF01MA11', 'EF02MA12'],
    objective: 'Planejar e criar uma sequência de comandos (setas) para levar o robô ao objetivo.',
    techniques: ['Pensamento computacional', 'Algoritmo', 'Lateralidade'],
    stdTimeSec: 30,
    blockSize: 5,
    minAge: 5,
    offlineTip: 'Seja o robô! A criança dá comandos ("2 passos para frente, vira à direita") para você achar um brinquedo.',
    generate(rng) {
      const { start, goal, walls, path } = robotLevel(rng, 4, 0, 3);
      return {
        kind: 'robot', size: 4, start, goal, walls, maxSteps: path.length + 2,
        prompt: say('Programe o robô para chegar à estrela.'),
        hints: robotHints(path),
      };
    },
  },
  {
    id: 'log-l5-robo-paredes',
    track: 'logica',
    step: 'L5',
    title: 'Robô com obstáculos',
    bncc: ['EF01CO03', 'EF02CO02', 'EF02MA12'],
    objective: 'Criar algoritmos mais longos desviando de obstáculos, planejando o caminho antes de executar.',
    techniques: ['Pensamento computacional', 'Algoritmo', 'Planejamento'],
    stdTimeSec: 45,
    blockSize: 5,
    minAge: 6,
    offlineTip: 'Montem um labirinto com almofadas e guiem um carrinho com setas desenhadas em papel.',
    generate(rng) {
      const size = rng.next() < 0.7 ? 5 : 6;
      const { start, goal, walls, path } = robotLevel(rng, size, rng.int(3, size + 1), 4);
      return {
        kind: 'robot', size, start, goal, walls, maxSteps: path.length + 2,
        prompt: say('Desvie dos obstáculos e leve o robô até a estrela.'),
        hints: robotHints(path),
      };
    },
  },
  {
    id: 'log-l5-depuracao',
    track: 'logica',
    step: 'L5',
    title: 'Depuração: encontre a seta errada',
    bncc: ['EF01CO03', 'EF02CO02', 'EF03CO01'],
    objective: 'Executar mentalmente um programa, achar o único comando errado e corrigi-lo (depuração).',
    techniques: ['Pensamento computacional', 'Depuração', 'Autocorreção'],
    stdTimeSec: 40,
    blockSize: 5,
    minAge: 6,
    offlineTip: 'Escreva setas para a criança chegar à cozinha, com UM erro de propósito. Ela acha e corrige!',
    generate(rng) {
      const size = 5;
      const { start, goal, walls, path } = robotLevel(rng, size, rng.int(2, 4), 3);
      const i = rng.int(0, path.length - 1);
      const program = path.slice();
      program[i] = rng.pick(DIRS.filter((d) => d !== path[i]));
      return {
        kind: 'robot', size, start, goal, walls, maxSteps: path.length, program,
        prompt: say('Uma seta está errada. Encontre e conserte!'),
        hints: hints(
          'Siga as setas com o dedo, uma por uma.',
          `Onde o robô sai do caminho? Olhe a seta número ${i + 1}.`,
          `A seta ${i + 1} deveria ser: ${path[i]}.`,
        ),
      };
    },
  },
];

