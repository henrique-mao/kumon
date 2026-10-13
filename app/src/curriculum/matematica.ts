// Trilha MATEMÁTICA (M0–M8) — Kumon (passos pequenos, fluência, contar a partir do maior)
// + CPA de Singapura (concreto → pictórico → abstrato), quadro de dez e Material Dourado.
import { choose, hints, img, nearNumbers, pt, tok, txt } from './helpers';
import type { ColorId, Hint, Item, Option, Rng, Say, ShapeId, Skill, Visual } from './types';

// ---------- apoio ----------

interface Obj { img: string; sing: string; plur: string; f: boolean }

/** Objetos contáveis (chave de imagem + nome em PT-BR). */
const OBJS: Obj[] = [
  { img: 'maca', sing: 'maçã', plur: 'maçãs', f: true },
  { img: 'bola', sing: 'bola', plur: 'bolas', f: true },
  { img: 'balao', sing: 'balão', plur: 'balões', f: false },
  { img: 'flor', sing: 'flor', plur: 'flores', f: true },
  { img: 'carro', sing: 'carrinho', plur: 'carrinhos', f: false },
  { img: 'biscoito', sing: 'biscoito', plur: 'biscoitos', f: false },
  { img: 'peixe', sing: 'peixe', plur: 'peixes', f: false },
  { img: 'pato', sing: 'pato', plur: 'patos', f: false },
  { img: 'estrela', sing: 'estrela', plur: 'estrelas', f: true },
  { img: 'morango', sing: 'morango', plur: 'morangos', f: false },
  { img: 'lapis', sing: 'lápis', plur: 'lápis', f: false },
  { img: 'pirulito', sing: 'pirulito', plur: 'pirulitos', f: false },
  { img: 'gato', sing: 'gato', plur: 'gatos', f: false },
  { img: 'ovo', sing: 'ovo', plur: 'ovos', f: false },
  { img: 'borboleta', sing: 'borboleta', plur: 'borboletas', f: true },
  { img: 'abelha', sing: 'abelha', plur: 'abelhas', f: true },
];

const quantos = (o: Obj) => `${o.f ? 'Quantas' : 'Quantos'} ${o.plur}`;
const num = (n: number): Option => txt(String(n));
const say = (s: string): Say[] => [pt(s)];

function input(prompt: Say[], answer: number, h: [Hint, Hint, Hint], visual?: Visual): Item {
  return { kind: 'input', prompt, answer, hints: h, ...(visual ? { visual } : {}) };
}

function numChoice(rng: Rng, prompt: Say[], answer: number, wrong: number[], h: [Hint, Hint, Hint], visual?: Visual): Item {
  return choose(rng, prompt, num(answer), wrong.map(num), h, visual ? { visual } : {});
}

/** Lista "1, 2, 3, ..., n" (para dicas de contagem). */
const countUp = (from: number, to: number) => {
  const out: number[] = [];
  for (let i = from; i <= to; i++) out.push(i);
  return out.join(', ');
};

const baseTen = (n: number): Visual =>
  n >= 100
    ? { type: 'baseten', hundreds: Math.floor(n / 100), tens: Math.floor(n / 10) % 10, ones: n % 10 }
    : { type: 'baseten', tens: Math.floor(n / 10), ones: n % 10 };

const SHAPES: { id: ShapeId; name: string; art: 'o' | 'a'; tip: string }[] = [
  { id: 'circulo', name: 'círculo', art: 'o', tip: 'O círculo é redondinho, sem pontas.' },
  { id: 'quadrado', name: 'quadrado', art: 'o', tip: 'O quadrado tem 4 lados iguais.' },
  { id: 'triangulo', name: 'triângulo', art: 'o', tip: 'O triângulo tem 3 lados e 3 pontas.' },
  { id: 'retangulo', name: 'retângulo', art: 'o', tip: 'O retângulo tem 4 lados: 2 compridos e 2 curtos.' },
  { id: 'estrela', name: 'estrela', art: 'a', tip: 'A estrela tem 5 pontas.' },
  { id: 'coracao', name: 'coração', art: 'o', tip: 'O coração tem uma ponta embaixo.' },
  { id: 'losango', name: 'losango', art: 'o', tip: 'O losango parece uma pipa: 4 lados inclinados.' },
];
const COLORS: ColorId[] = ['vermelho', 'azul', 'amarelo', 'verde', 'laranja', 'roxo', 'rosa'];

const hourLabel = (h: number, m: number) => (m === 30 ? `${h} e meia` : h === 1 ? '1 hora' : `${h} horas`);

const NOTE_NAMES: Record<number, string> = { 50: '50 centavos', 100: '1 real', 200: '2 reais', 500: '5 reais', 1000: '10 reais', 2000: '20 reais' };

// ---------- habilidades ----------

export const MATEMATICA_SKILLS: Skill[] = [
  // ===== M0 — Quantidades =====
  {
    id: 'mat-m0-subitizar',
    track: 'matematica',
    step: 'M0',
    title: 'Subitização até 5',
    bncc: ['EI03ET07'],
    objective: 'Reconhecer quantidades até 5 de relance, sem contar um a um.',
    techniques: ['Subitização', 'CPA', 'Fluência (tempo-padrão)'],
    stdTimeSec: 3,
    blockSize: 6,
    minAge: 4,
    offlineTip: 'Mostre dedos ou peças de dominó por 2 segundos e esconda: a criança diz quantos viu. Revezem!',
    generate(rng) {
      const n = rng.int(1, 5);
      return numChoice(
        rng,
        say('Quantos pontinhos? Olhe rapidinho!'),
        n,
        nearNumbers(rng, n, 2, 2, 1),
        hints(
          'Não precisa contar: olhe o desenho que os pontinhos fazem.',
          `Vamos contar juntos: ${countUp(1, n)}.`,
          `São ${n} pontinhos.`,
        ),
        { type: 'token', token: { kind: 'dots', n }, big: true },
      );
    },
  },
  {
    id: 'mat-m0-contar-10',
    track: 'matematica',
    step: 'M0',
    title: 'Contar objetos até 10',
    bncc: ['EI03ET07', 'EF01MA02'],
    objective: 'Contar coleções de até 10 objetos com correspondência um a um e associar ao numeral.',
    techniques: ['CPA', 'Correspondência um a um'],
    stdTimeSec: 6,
    blockSize: 6,
    minAge: 4,
    offlineTip: 'Contem juntos os talheres da mesa, tocando em cada um. Depois a criança separa "5 colheres".',
    generate(rng) {
      const o = rng.pick(OBJS);
      const n = rng.int(1, 10);
      return numChoice(
        rng,
        say(`${quantos(o)}? Conte com o dedinho.`),
        n,
        nearNumbers(rng, n, 2, 2, 1),
        hints(
          'Toque em cada um e diga um número.',
          [pt('Veja no quadro de dez: cada bolinha é um.')],
          `${countUp(1, n)}. São ${n}!`,
          [{}, { visual: { type: 'tenframe', filled: n, total: 10 } }, {}],
        ),
        { type: 'objects', img: o.img, n },
      );
    },
  },
  {
    id: 'mat-m0-mais-menos',
    track: 'matematica',
    step: 'M0',
    title: 'Mais, menos (correspondência um a um)',
    bncc: ['EI03ET07', 'EF01MA03'],
    objective: 'Comparar duas coleções e dizer onde há mais ou menos elementos.',
    techniques: ['CPA', 'Correspondência um a um'],
    stdTimeSec: 6,
    blockSize: 6,
    minAge: 4,
    offlineTip: 'Coloque copos e colheres lado a lado, um com um. Onde sobrou? Lá tem mais!',
    generate(rng) {
      const [a, b] = rng.sample(OBJS, 2);
      const na = rng.int(1, 8);
      let nb = rng.int(1, 8);
      while (nb === na) nb = rng.int(1, 8);
      const more = rng.next() < 0.6;
      const correct = (more ? na > nb : na < nb) ? a : b;
      const other = correct === a ? b : a;
      return choose(
        rng,
        say(more ? 'Onde tem mais?' : 'Onde tem menos?'),
        img(correct.img),
        [img(other.img)],
        hints(
          'Ligue um de cá com um de lá.',
          `${quantos(a)}? ${na}. ${quantos(b)}? ${nb}.`,
          `${more ? 'Mais' : 'Menos'}: ${correct.plur}!`,
          [{}, { visual: { type: 'row', tokens: [{ kind: 'dots', n: na }, { kind: 'dots', n: nb }] } }, {}],
        ),
        { visual: { type: 'scene', parts: [{ type: 'objects', img: a.img, n: na }, { type: 'objects', img: b.img, n: nb }] } },
      );
    },
  },
  {
    id: 'mat-m0-tracar-numeros',
    track: 'matematica',
    step: 'M0',
    title: 'Traçar os números de 0 a 9',
    bncc: ['EI03ET07', 'EF01MA04'],
    objective: 'Traçar os algarismos com a direção correta, associando cada um à sua quantidade.',
    techniques: ['Traçado', 'CPA'],
    stdTimeSec: 10,
    blockSize: 5,
    minAge: 4,
    offlineTip: 'Escrevam números grandes com o dedo na areia, na farinha ou nas costas um do outro.',
    generate(rng) {
      const d = rng.int(0, 9);
      const o = rng.pick(OBJS);
      return {
        kind: 'trace',
        glyph: String(d),
        prompt: say(`Trace o número ${d} com o dedo.`),
        hints: hints('Comece no pontinho verde.', 'Siga a setinha, devagar, sem pressa.', `Assim se escreve o ${d}.`),
        ...(d > 0 ? { visual: { type: 'objects', img: o.img, n: d } as Visual } : {}),
      };
    },
  },
  {
    id: 'mat-m0-contar-30',
    track: 'matematica',
    step: 'M0',
    title: 'Contar até 20 → 30',
    bncc: ['EF01MA02', 'EF01MA04'],
    objective: 'Contar coleções de 11 a 30 objetos, agrupando de 10 em 10, e escrever o número.',
    techniques: ['CPA', 'Quadro de dez'],
    stdTimeSec: 12,
    blockSize: 5,
    minAge: 5,
    offlineTip: 'Separem feijões em montinhos de 10. Quantos montinhos? Quantos sobraram? Contem tudo.',
    generate(rng) {
      const o = rng.pick(OBJS);
      const n = rng.int(11, rng.next() < 0.5 ? 20 : 30);
      const tens = Math.floor(n / 10);
      return input(
        say(`${quantos(o)}? Escreva o número.`),
        n,
        hints(
          'Conte primeiro 10, depois continue.',
          `Faça grupos de 10: ${tens} grupos de 10 e mais ${n % 10}.`,
          `${countUp(1, n)}. São ${n}!`,
          [{}, { visual: n <= 20 ? { type: 'tenframe', filled: n, total: 20 } : baseTen(n) }, {}],
        ),
        { type: 'objects', img: o.img, n },
      );
    },
  },

  // ===== M1 — Números =====
  {
    id: 'mat-m1-ler-numeros',
    track: 'matematica',
    step: 'M1',
    title: 'Ler números até 50 → 120',
    bncc: ['EF01MA01', 'EF01MA04'],
    objective: 'Reconhecer e ler numerais até 120, sem confundir 37 com 73.',
    techniques: ['Quadro numérico', 'Material Dourado'],
    stdTimeSec: 4,
    blockSize: 7,
    minAge: 5,
    offlineTip: 'Procurem números pela casa e pela rua (portas, placas, calendário) e leiam juntos.',
    generate(rng) {
      const n = rng.next() < 0.5 ? rng.int(10, 50) : rng.int(10, 120);
      const cand = new Set<number>();
      const rev = Number(String(n).split('').reverse().join(''));
      if (n < 100 && rev !== n && n % 10 !== 0) cand.add(rev);
      for (const d of rng.shuffle([1, -1, 10, -10, 2])) if (n + d > 0) cand.add(n + d);
      cand.delete(n);
      const wrong = [...cand].slice(0, 3);
      const digits = String(n).split('').join(', depois o ');
      return numChoice(
        rng,
        say(`Toque no número ${n}.`),
        n,
        wrong,
        hints(`Primeiro o ${digits}.`, `Veja ${n} no Material Dourado.`, `Este é o ${n}.`, [{}, { visual: baseTen(n) }, {}]),
      );
    },
  },
  {
    id: 'mat-m1-sequencia',
    track: 'matematica',
    step: 'M1',
    title: 'Sequência numérica até 120 (antecessor e sucessor)',
    bncc: ['EI03ET07', 'EF01MA04', 'EF01MA10'],
    objective: 'Completar sequências numéricas, identificando o antes, o depois e o entre.',
    techniques: ['Quadro numérico', 'Fluência (tempo-padrão)'],
    stdTimeSec: 5,
    blockSize: 7,
    minAge: 5,
    offlineTip: 'Brinquem de "eu falo um número, você fala o próximo" — e depois o de antes!',
    generate(rng) {
      const down = rng.next() < 0.25;
      const start = rng.int(1, 115);
      const seq = [0, 1, 2, 3, 4].map((i) => (down ? start + 4 - i : start + i));
      const missing = rng.int(0, 4);
      const ans = seq[missing];
      return input(
        say(down ? 'Contando para trás. Que número falta?' : 'Que número está faltando?'),
        ans,
        hints(
          'Leia os números em voz alta e escute o buraco.',
          `${seq.map((v, i) => (i === missing ? '...' : String(v))).join(', ')}.`,
          `Falta o ${ans}: ${seq.join(', ')}.`,
        ),
        { type: 'sequence', items: seq.map((v) => ({ kind: 'text', text: String(v) })), missing },
      );
    },
  },
  {
    id: 'mat-m1-comparar',
    track: 'matematica',
    step: 'M1',
    title: 'Comparar números (maior e menor)',
    bncc: ['EF01MA05', 'EF02MA01'],
    objective: 'Comparar números de até três ordens observando primeiro as dezenas (e centenas).',
    techniques: ['Material Dourado', 'Valor posicional'],
    stdTimeSec: 5,
    blockSize: 6,
    minAge: 5,
    offlineTip: 'Joguem "batalha" com cartas de baralho: quem tirar o maior número fica com as cartas.',
    generate(rng) {
      const base = rng.int(1, 11) * 10;
      const set = new Set<number>();
      while (set.size < 3) set.add(rng.next() < 0.6 ? base + rng.int(0, 9) : rng.int(1, 120));
      const nums = [...set];
      const big = rng.next() < 0.6;
      const ans = big ? Math.max(...nums) : Math.min(...nums);
      return numChoice(
        rng,
        say(big ? 'Toque no maior número.' : 'Toque no menor número.'),
        ans,
        nums.filter((v) => v !== ans),
        hints('Olhe primeiro as dezenas: quem tem mais barrinhas?', `Veja o ${ans} no Material Dourado.`, `O ${big ? 'maior' : 'menor'} é ${ans}.`, [{}, { visual: baseTen(ans) }, {}]),
      );
    },
  },

  // ===== M2 — Somar pequeno =====
  {
    id: 'mat-m2-mais-1-2-3',
    track: 'matematica',
    step: 'M2',
    title: '+1, +2, +3 (contar a partir do maior)',
    bncc: ['EF01MA06', 'EF01MA08'],
    objective: 'Somar 1, 2 ou 3 contando a partir do maior número (counting on), sem recontar tudo.',
    techniques: ['Contar a partir do maior', 'Fluência (tempo-padrão)', 'CPA'],
    stdTimeSec: 5,
    blockSize: 8,
    minAge: 5,
    offlineTip: 'Na escada: "estamos no degrau 6, subindo mais 2… 7, 8!" Contem a partir de onde estão.',
    generate(rng) {
      const k = rng.int(1, 3);
      const a = rng.int(2, 17);
      const [x, y] = rng.next() < 0.6 ? [a, k] : [k, a];
      const sum = a + k;
      const o = rng.pick(OBJS);
      return input(
        say(`Quanto é ${x} mais ${y}?`),
        sum,
        hints(
          `Comece pelo maior: ${a}. Guarde na cabeça!`,
          `${a}… e mais ${k}: ${countUp(a + 1, sum)}.`,
          `${x} + ${y} = ${sum}.`,
          [{}, { visual: { type: 'scene', parts: [{ type: 'token', token: { kind: 'text', text: String(a) } }, { type: 'objects', img: o.img, n: k }] } }, {}],
        ),
        { type: 'equation', text: `${x} + ${y} = ?` },
      );
    },
  },
  {
    id: 'mat-m2-quadro-de-dez',
    track: 'matematica',
    step: 'M2',
    title: 'Quadro de dez: representar quantidades',
    bncc: ['EI03ET07', 'EF01MA07'],
    objective: 'Representar quantidades até 10 (e 20) no quadro de dez, percebendo o 5 e o 10 como referências.',
    techniques: ['Quadro de dez', 'CPA', 'Subitização'],
    stdTimeSec: 8,
    blockSize: 6,
    minAge: 4,
    offlineTip: 'Desenhe um quadro de dez numa caixa de ovos (corte 2 casinhas) e preencha com tampinhas.',
    generate(rng) {
      const twenty = rng.next() < 0.25;
      const t = twenty ? rng.int(11, 20) : rng.int(1, 10);
      const total = twenty ? 20 : 10;
      return {
        kind: 'tenframe',
        target: t,
        total,
        prompt: say(`Coloque ${t} bolinhas no quadro.`),
        hints: hints(
          t > 5 ? 'Encha a primeira linha: são 5. Depois continue.' : 'Comece pela primeira casinha da esquerda.',
          `Assim: ${countUp(1, t)}.`,
          `${t} bolinhas!`,
          [{}, { visual: { type: 'tenframe', filled: t, total } }, { visual: { type: 'tenframe', filled: t, total } }],
        ),
      };
    },
  },
  {
    id: 'mat-m2-compor-10',
    track: 'matematica',
    step: 'M2',
    title: 'Composição do 10 (quantos faltam para 10?)',
    bncc: ['EF01MA07', 'EF01MA06'],
    objective: 'Conhecer os "amigos do 10" (pares que somam 10), primeiro no quadro de dez, depois só com números.',
    techniques: ['Quadro de dez', 'CPA', 'Fluência (tempo-padrão)'],
    stdTimeSec: 5,
    blockSize: 8,
    minAge: 5,
    offlineTip: 'Mostre alguns dedos (ex.: 7). A criança mostra quantos faltam para 10 com os dedos dela.',
    generate(rng) {
      const n = rng.int(1, 9);
      const ans = 10 - n;
      const frame: Visual = { type: 'tenframe', filled: n, total: 10 };
      const abstract = rng.next() < 0.4;
      return input(
        say(abstract ? 'Que número completa o 10?' : 'Quantos faltam para completar 10?'),
        ans,
        hints(
          abstract ? 'Pense no quadro de dez.' : 'Conte as casinhas vazias.',
          `Temos ${n}. ${countUp(n + 1, 10)}: faltam ${ans}.`,
          `${n} + ${ans} = 10.`,
          [{}, { visual: abstract ? frame : { type: 'equation', text: `${n} + ? = 10` } }, {}],
        ),
        abstract ? { type: 'equation', text: `${n} + ? = 10` } : frame,
      );
    },
  },
  {
    id: 'mat-m2-dobros',
    track: 'matematica',
    step: 'M2',
    title: 'Dobros (1+1 até 10+10)',
    bncc: ['EF01MA06', 'EF02MA08'],
    objective: 'Memorizar os dobros como fatos-âncora para outras somas.',
    techniques: ['CPA', 'Fluência (tempo-padrão)'],
    stdTimeSec: 5,
    blockSize: 8,
    minAge: 5,
    offlineTip: 'Brinquem de espelho com as mãos: 3 dedos numa mão, 3 na outra… quanto dá?',
    generate(rng) {
      const n = rng.int(1, 10);
      const o = rng.pick(OBJS);
      const groups: Visual = { type: 'groups', groups: 2, each: n, img: o.img };
      const pictorial = rng.next() < 0.5;
      return input(
        say(`Quanto é ${n} mais ${n}? É o dobro!`),
        2 * n,
        hints('Dobro é a mesma quantidade duas vezes.', `${n} de um lado, ${n} do outro. Conte tudo.`, `${n} + ${n} = ${2 * n}.`, [{}, { visual: pictorial ? { type: 'row', tokens: [{ kind: 'dots', n: Math.min(n, 10) }, { kind: 'dots', n: Math.min(n, 10) }] } : groups }, {}]),
        pictorial ? groups : { type: 'equation', text: `${n} + ${n} = ?` },
      );
    },
  },

  // ===== M3 — Fatos básicos =====
  {
    id: 'mat-m3-adicao-10',
    track: 'matematica',
    step: 'M3',
    title: 'Fatos de adição até 10',
    bncc: ['EF01MA06'],
    objective: 'Automatizar as somas com resultado até 10 (fluência, como nas folhas Kumon 2A).',
    techniques: ['Fluência (tempo-padrão)', 'Contar a partir do maior', 'Revisão espaçada'],
    stdTimeSec: 4,
    blockSize: 8,
    minAge: 5,
    offlineTip: 'No carro ou na fila, falem contas rápidas: "4 mais 3?". Vale responder com os dedos.',
    generate(rng) {
      const a = rng.int(0, 9);
      const b = rng.int(a === 0 ? 1 : 0, 10 - a);
      const big = Math.max(a, b);
      return input(
        say(`Quanto é ${a} mais ${b}?`),
        a + b,
        hints('Comece pelo maior e conte para frente.', `${big}… ${b + a > big ? countUp(big + 1, a + b) : 'mais zero fica igual'}.`, `${a} + ${b} = ${a + b}.`, [{}, { visual: { type: 'tenframe', filled: a + b, total: 10 } }, {}]),
        { type: 'equation', text: `${a} + ${b} = ?` },
      );
    },
  },
  {
    id: 'mat-m3-adicao-20',
    track: 'matematica',
    step: 'M3',
    title: 'Fatos de adição até 20 (passando o 10)',
    bncc: ['EF01MA06', 'EF02MA05'],
    objective: 'Somar com resultado até 20 usando a estratégia "completar o 10".',
    techniques: ['Fluência (tempo-padrão)', 'Quadro de dez', 'Revisão espaçada'],
    stdTimeSec: 5,
    blockSize: 8,
    minAge: 6,
    offlineTip: 'Com 20 tampinhas e dois quadros de dez desenhados, mostrem 8 + 5: complete o 10 e veja o que sobra.',
    generate(rng) {
      let a = rng.int(2, 10);
      let b = rng.int(2, 10);
      while (a + b <= 10) { a = rng.int(2, 10); b = rng.int(2, 10); }
      const big = Math.max(a, b);
      const small = Math.min(a, b);
      const fill = 10 - big;
      return input(
        say(`Quanto é ${a} mais ${b}?`),
        a + b,
        hints(
          `Complete o 10 primeiro: ${big} + ${fill} = 10.`,
          `${small} = ${fill} + ${small - fill}. Então 10 + ${small - fill}.`,
          `${a} + ${b} = ${a + b}.`,
          [{}, { visual: { type: 'tenframe', filled: a + b, total: 20 } }, {}],
        ),
        { type: 'equation', text: `${a} + ${b} = ?` },
      );
    },
  },
  {
    id: 'mat-m3-subtracao-20',
    track: 'matematica',
    step: 'M3',
    title: 'Fatos de subtração até 20',
    bncc: ['EF01MA06', 'EF02MA05'],
    objective: 'Subtrair com números até 20, pensando "quanto falta" a partir da adição.',
    techniques: ['Fluência (tempo-padrão)', 'Quadro de dez', 'Revisão espaçada'],
    stdTimeSec: 6,
    blockSize: 8,
    minAge: 6,
    offlineTip: 'Coloque 12 biscoitos, "coma" 4 de mentirinha: quantos sobraram? Troquem os papéis.',
    generate(rng) {
      const small = rng.next() < 0.4;
      const a = small ? rng.int(2, 10) : rng.int(11, 20);
      const b = rng.int(1, Math.min(a, 10));
      const o = rng.pick(OBJS);
      return input(
        say(`Quanto é ${a} menos ${b}?`),
        a - b,
        hints(
          `Pense: ${b} mais quanto dá ${a}?`,
          `Tire ${b} de ${a}: conte para trás ${countUp(1, b).split(', ').map((_, i) => a - i - 1).join(', ')}.`,
          `${a} − ${b} = ${a - b}.`,
          [{}, { visual: { type: 'objects', img: o.img, n: a } }, {}],
        ),
        { type: 'equation', text: `${a} − ${b} = ?` },
      );
    },
  },
  {
    id: 'mat-m3-problemas',
    track: 'matematica',
    step: 'M3',
    title: 'Problemas narrados (juntar, tirar, comparar)',
    bncc: ['EF01MA08', 'EF02MA06'],
    objective: 'Resolver problemas de adição e subtração ouvidos em áudio, escolhendo a operação.',
    techniques: ['Problemas narrados', 'CPA'],
    stdTimeSec: 12,
    blockSize: 5,
    minAge: 6,
    offlineTip: 'Inventem historinhas de conta na hora do lanche: "Tinha 6 uvas, comi 2…". A criança inventa a próxima!',
    generate(rng) {
      const o = rng.pick(OBJS);
      const kind = rng.int(0, 2);
      const Q = o.f ? 'Quantas' : 'Quantos';
      if (kind === 0) {
        const a = rng.int(2, 9), b = rng.int(1, 9);
        return input(
          say(`Você tem ${a} ${o.plur}. Ganhou mais ${b}. ${Q} tem agora?`),
          a + b,
          hints('Ganhou: ficou com mais ou com menos?', 'Junte tudo e conte.', `${a} + ${b} = ${a + b}.`, [{}, { visual: { type: 'scene', parts: [{ type: 'objects', img: o.img, n: a }, { type: 'objects', img: o.img, n: b }] } }, {}]),
        );
      }
      if (kind === 1) {
        const a = rng.int(4, 15), b = rng.int(1, Math.min(a - 1, 9));
        return input(
          say(`Você tinha ${a} ${o.plur}. Deu ${b} para a vovó. ${Q} sobraram?`),
          a - b,
          hints('Deu: ficou com mais ou com menos?', `Comece com ${a} e tire ${b}.`, `${a} − ${b} = ${a - b}.`, [{}, { visual: { type: 'objects', img: o.img, n: a } }, {}]),
        );
      }
      const a = rng.int(4, 12), b = rng.int(1, a - 1);
      return input(
        say(`Ana tem ${a} ${o.plur}. Léo tem ${b}. ${Q} Ana tem a mais?`),
        a - b,
        hints('Ligue um da Ana com um do Léo. Quantos sobram?', `Do ${b} até o ${a}, quanto falta?`, `${a} − ${b} = ${a - b}.`, [{}, { visual: { type: 'scene', parts: [{ type: 'objects', img: o.img, n: a }, { type: 'objects', img: o.img, n: b }] } }, {}]),
      );
    },
  },

  // ===== M4 — Valor posicional =====
  {
    id: 'mat-m4-dourado-montar',
    track: 'matematica',
    step: 'M4',
    title: 'Montar números com Material Dourado',
    bncc: ['EF01MA07', 'EF02MA04'],
    objective: 'Compor números de dois algarismos com dezenas (barras) e unidades (cubinhos).',
    techniques: ['Material Dourado', 'CPA', 'Valor posicional'],
    stdTimeSec: 15,
    blockSize: 5,
    minAge: 6,
    offlineTip: 'Façam "barras" de 10 palitos com elástico. Montem a idade do papai ou o número da casa.',
    generate(rng) {
      const t = rng.int(11, 99);
      const d = Math.floor(t / 10), u = t % 10;
      return {
        kind: 'baseten',
        target: t,
        prompt: say(`Monte o número ${t} com barras e cubinhos.`),
        hints: hints(
          `${t} tem ${d} dezenas e ${u} unidades.`,
          `${d} barras de 10 e ${u} cubinhos.`,
          `${d} barras e ${u} cubinhos formam ${t}.`,
          [{}, { visual: baseTen(t) }, { visual: baseTen(t) }],
        ),
      };
    },
  },
  {
    id: 'mat-m4-dourado-ler',
    track: 'matematica',
    step: 'M4',
    title: 'Ler o Material Dourado (dezenas e unidades)',
    bncc: ['EF01MA07', 'EF02MA04'],
    objective: 'Escrever o número representado por barras e cubinhos; dizer quantas dezenas e unidades há.',
    techniques: ['Material Dourado', 'CPA', 'Valor posicional'],
    stdTimeSec: 7,
    blockSize: 6,
    minAge: 6,
    offlineTip: 'Com moedas de 10 centavos e de 1 centavo (ou palitos), montem valores e escrevam o número.',
    generate(rng) {
      const n = rng.int(11, 99);
      const d = Math.floor(n / 10), u = n % 10;
      const variant = rng.int(0, 3);
      if (variant === 0) {
        return input(
          say(`Quantas dezenas tem o número ${n}?`),
          d,
          hints('Dezena é a barra de 10.', `${n} = ${d * 10} + ${u}.`, `${n} tem ${d} dezenas.`, [{}, { visual: baseTen(n) }, {}]),
          { type: 'equation', text: String(n) },
        );
      }
      return input(
        say('Que número está aqui?'),
        n,
        hints('Conte as barras de 10 em 10, depois os cubinhos.', `${countUp(1, d).split(', ').map((x) => Number(x) * 10).join(', ')}… e mais ${u}.`, `${d} dezenas e ${u} unidades: ${n}.`),
        baseTen(n),
      );
    },
  },
  {
    id: 'mat-m4-centenas',
    track: 'matematica',
    step: 'M4',
    title: 'Centenas: números até 1000',
    bncc: ['EF02MA01', 'EF02MA04', 'EF03MA01', 'EF03MA02'],
    objective: 'Ler números de três algarismos representados com placas (100), barras (10) e cubinhos (1).',
    techniques: ['Material Dourado', 'CPA', 'Valor posicional'],
    stdTimeSec: 10,
    blockSize: 6,
    minAge: 7,
    offlineTip: 'Use notas de brinquedo de 100, 10 e 1: a criança "paga" valores como 245.',
    generate(rng) {
      const n = rng.int(100, 999);
      const c = Math.floor(n / 100), d = Math.floor(n / 10) % 10, u = n % 10;
      return input(
        say('Que número está aqui? Placas valem 100.'),
        n,
        hints('Comece pelas placas: cada uma vale 100.', `${c * 100} + ${d * 10} + ${u}.`, `${c} centenas, ${d} dezenas e ${u} unidades: ${n}.`),
        baseTen(n),
      );
    },
  },

  // ===== M5 — Algoritmos =====
  {
    id: 'mat-m5-vertical-simples',
    track: 'matematica',
    step: 'M5',
    title: 'Conta armada sem reserva',
    bncc: ['EF01MA08', 'EF02MA05', 'EF02MA06'],
    objective: 'Somar e subtrair na vertical (2 algarismos) começando pelas unidades, sem trocas.',
    techniques: ['Material Dourado', 'Algoritmo', 'Fluência (tempo-padrão)'],
    stdTimeSec: 15,
    blockSize: 5,
    minAge: 6,
    offlineTip: 'Armem contas em papel quadriculado: um algarismo por quadradinho, unidades embaixo de unidades.',
    generate(rng) {
      const plus = rng.next() < 0.55;
      let a: number, b: number;
      if (plus) {
        const ad = rng.int(1, 8), bd = rng.int(1, 9 - ad);
        const au = rng.int(0, 9), bu = rng.int(0, 9 - au);
        a = ad * 10 + au; b = bd * 10 + bu;
      } else {
        const ad = rng.int(2, 9), bd = rng.int(1, ad);
        const au = rng.int(0, 9), bu = rng.int(0, au);
        a = ad * 10 + au; b = bd * 10 + bu;
      }
      const ans = plus ? a + b : a - b;
      const uu = plus ? (a % 10) + (b % 10) : (a % 10) - (b % 10);
      const dd = plus ? Math.floor(a / 10) + Math.floor(b / 10) : Math.floor(a / 10) - Math.floor(b / 10);
      const op = plus ? 'mais' : 'menos';
      return input(
        say('Resolva a conta. Comece pelas unidades!'),
        ans,
        hints(
          'Unidades primeiro: a coluna da direita.',
          `Unidades: ${a % 10} ${op} ${b % 10} = ${uu}. Dezenas: ${Math.floor(a / 10)} ${op} ${Math.floor(b / 10)} = ${dd}.`,
          `${a} ${plus ? '+' : '−'} ${b} = ${ans}.`,
          [{}, { visual: baseTen(a) }, {}],
        ),
        { type: 'vertical', a, b, op: plus ? '+' : '-' },
      );
    },
  },
  {
    id: 'mat-m5-vertical-reserva',
    track: 'matematica',
    step: 'M5',
    title: 'Conta armada com reserva ("vai um") e recurso ("empresta")',
    bncc: ['EF02MA05', 'EF02MA06', 'EF03MA05', 'EF03MA06'],
    objective: 'Somar com "vai um" e subtrair trocando uma dezena por 10 unidades, visualizando a troca no Material Dourado.',
    techniques: ['Material Dourado', 'Algoritmo', 'CPA'],
    stdTimeSec: 20,
    blockSize: 5,
    minAge: 7,
    offlineTip: 'Com palitos: 10 soltos viram 1 amarrado ("vai um"); desamarre 1 para emprestar. Façam juntos.',
    generate(rng) {
      const plus = rng.next() < 0.5;
      let a: number, b: number;
      if (plus) {
        const au = rng.int(2, 9), bu = rng.int(10 - au, 9);
        const ad = rng.int(1, 8), bd = rng.int(1, 9 - ad);
        a = ad * 10 + au; b = bd * 10 + bu;
      } else {
        const au = rng.int(0, 8), bu = rng.int(au + 1, 9);
        const ad = rng.int(2, 9), bd = rng.int(0, ad - 1);
        a = ad * 10 + au; b = bd * 10 + bu;
      }
      const ans = plus ? a + b : a - b;
      const au = a % 10, bu = b % 10;
      return input(
        say(plus ? 'Resolva a conta. Atenção ao "vai um"!' : 'Resolva a conta. Vai precisar emprestar!'),
        ans,
        hints(
          plus ? `Unidades: ${au} + ${bu} = ${au + bu}. Passou de 9!` : `Unidades: ${au} é menor que ${bu}.`,
          plus
            ? `Escreva ${(au + bu) % 10} e leve 1 dezena para cima.`
            : `Troque 1 barra por 10 cubinhos: ${au + 10} − ${bu} = ${au + 10 - bu}.`,
          `${a} ${plus ? '+' : '−'} ${b} = ${ans}.`,
          [{}, { visual: baseTen(a) }, {}],
        ),
        { type: 'vertical', a, b, op: plus ? '+' : '-' },
      );
    },
  },

  // ===== M6 — Multiplicação e divisão =====
  {
    id: 'mat-m6-grupos-iguais',
    track: 'matematica',
    step: 'M6',
    title: 'Multiplicação como grupos iguais',
    bncc: ['EF02MA07', 'EF03MA07'],
    objective: 'Contar grupos iguais por saltos (2, 4, 6…) e relacionar com a multiplicação.',
    techniques: ['CPA', 'Contagem por saltos'],
    stdTimeSec: 10,
    blockSize: 6,
    minAge: 6,
    offlineTip: 'Arrumem pares de meias: quantos pares? Quantas meias? Contem de 2 em 2.',
    generate(rng) {
      const g = rng.int(2, 5), e = rng.int(2, 5);
      const o = rng.pick(OBJS);
      const skips = Array.from({ length: g }, (_, i) => (i + 1) * e).join(', ');
      return input(
        say(`${g} grupos com ${e} em cada. ${quantos(o)} ao todo?`),
        g * e,
        hints(`Conte de ${e} em ${e}.`, `${skips}.`, `${g} vezes ${e} = ${g * e}.`),
        { type: 'groups', groups: g, each: e, img: o.img },
      );
    },
  },
  {
    id: 'mat-m6-tabuadas-2-5-10',
    track: 'matematica',
    step: 'M6',
    title: 'Tabuadas do 2, 5 e 10',
    bncc: ['EF02MA07', 'EF03MA03', 'EF03MA07'],
    objective: 'Automatizar as tabuadas do 2, do 5 e do 10 com apoio da contagem por saltos.',
    techniques: ['Fluência (tempo-padrão)', 'Contagem por saltos', 'Revisão espaçada'],
    stdTimeSec: 5,
    blockSize: 8,
    minAge: 7,
    offlineTip: 'Cantem a tabuada do 5 batendo palmas, e contem de 10 em 10 com notas de brinquedo.',
    generate(rng) {
      const t = rng.pick([2, 5, 10]);
      const n = rng.int(1, 10);
      const [x, y] = rng.next() < 0.7 ? [n, t] : [t, n];
      const o = rng.pick(OBJS);
      return input(
        say(`Quanto é ${x} vezes ${y}?`),
        x * y,
        hints(
          `Conte de ${t} em ${t}, ${n} vezes.`,
          `${Array.from({ length: n }, (_, i) => (i + 1) * t).join(', ')}.`,
          `${x} × ${y} = ${x * y}.`,
          [{}, n * t <= 30 ? { visual: { type: 'groups', groups: n, each: t, img: o.img } } : {}, {}],
        ),
        { type: 'equation', text: `${x} × ${y} = ?` },
      );
    },
  },
  {
    id: 'mat-m6-tabuadas',
    track: 'matematica',
    step: 'M6',
    title: 'Todas as tabuadas (2 a 9)',
    bncc: ['EF03MA03', 'EF03MA07'],
    objective: 'Memorizar as tabuadas do 2 ao 9 com fluência (Kumon estágio C).',
    techniques: ['Fluência (tempo-padrão)', 'Revisão espaçada'],
    stdTimeSec: 5,
    blockSize: 8,
    minAge: 7,
    offlineTip: 'Faça cartões de tabuada (frente: 6 × 7; verso: 42). Separem os "já sei" e treinem os outros.',
    generate(rng) {
      const a = rng.int(2, 9), b = rng.int(2, 9);
      const easier = Math.min(a, b) === a ? `${a} × ${b}` : `${b} × ${a}`;
      return input(
        say(`Quanto é ${a} vezes ${b}?`),
        a * b,
        hints(
          `Pense ao contrário: ${easier} dá o mesmo.`,
          `Conte de ${b} em ${b}: ${Array.from({ length: a }, (_, i) => (i + 1) * b).join(', ')}.`,
          `${a} × ${b} = ${a * b}.`,
          [{}, { visual: { type: 'groups', groups: a, each: b, img: 'estrela' } }, {}],
        ),
        { type: 'equation', text: `${a} × ${b} = ?` },
      );
    },
  },
  {
    id: 'mat-m6-dividir',
    track: 'matematica',
    step: 'M6',
    title: 'Divisão como repartir igualmente',
    bncc: ['EF02MA08', 'EF03MA08'],
    objective: 'Repartir uma quantidade igualmente entre grupos e dizer quanto fica para cada um.',
    techniques: ['CPA', 'Problemas narrados'],
    stdTimeSec: 12,
    blockSize: 6,
    minAge: 7,
    offlineTip: 'Repartam uvas entre os bonecos: "um para você, um para você…" até acabar. Quantas cada um ganhou?',
    generate(rng) {
      const g = rng.int(2, 5), e = rng.int(1, 5);
      const total = g * e;
      const o = rng.pick(OBJS);
      return input(
        say(`Reparta ${total} ${o.plur} entre ${g} amigos. ${o.f ? 'Quantas' : 'Quantos'} para cada?`),
        e,
        hints(
          'Dê um para cada amigo, de novo e de novo.',
          `${g} grupos iguais até acabar os ${total}.`,
          `${total} ÷ ${g} = ${e}. Cada amigo ganha ${e}.`,
          [{}, { visual: { type: 'groups', groups: g, each: e, img: o.img } }, {}],
        ),
        { type: 'objects', img: o.img, n: total },
      );
    },
  },

  // ===== M7 — Grandezas e medidas =====
  {
    id: 'mat-m7-dinheiro',
    track: 'matematica',
    step: 'M7',
    title: 'Dinheiro: moedas e cédulas de real',
    bncc: ['EF01MA19', 'EF02MA20', 'EF03MA24'],
    objective: 'Reconhecer moedas e cédulas do real e somar valores inteiros em reais.',
    techniques: ['CPA', 'Situações do cotidiano'],
    stdTimeSec: 12,
    blockSize: 5,
    minAge: 6,
    offlineTip: 'Montem uma "vendinha" com objetos da casa e dinheiro de brinquedo; a criança paga e confere o troco.',
    generate(rng) {
      const older = rng.next() < 0.4;
      const pool = older ? [100, 200, 500, 1000, 2000] : [100, 200, 500];
      const values: number[] = [];
      const count = rng.int(2, older ? 4 : 3);
      for (let i = 0; i < count; i++) values.push(rng.pick(pool));
      if (rng.next() < 0.3) values.push(50, 50);
      values.sort((x, y) => y - x);
      const reais = values.reduce((s, v) => s + v, 0) / 100;
      return input(
        say('Quantos reais tem aqui?'),
        reais,
        hints(
          'Comece pela nota ou moeda que vale mais.',
          `${values.map((v) => NOTE_NAMES[v]).join(', mais ')}.`,
          `Ao todo: ${reais} reais.`,
        ),
        { type: 'money', values },
      );
    },
  },
  {
    id: 'mat-m7-horas',
    track: 'matematica',
    step: 'M7',
    title: 'Horas: hora certa e meia hora',
    bncc: ['EF01MA16', 'EF02MA19', 'EF03MA23'],
    objective: 'Ler hora certa e meia hora em relógio de ponteiros.',
    techniques: ['CPA', 'Situações do cotidiano'],
    stdTimeSec: 8,
    blockSize: 6,
    minAge: 6,
    offlineTip: 'Ao longo do dia, olhem o relógio juntos: "São 7 horas, hora do jantar!" Desenhem um relógio de papel.',
    generate(rng) {
      const h = rng.int(1, 12);
      const m = rng.next() < 0.4 ? 30 : 0;
      const other = (k: number) => ((h - 1 + k + 12) % 12) + 1;
      const wrongLabels = new Set<string>([hourLabel(h, m === 0 ? 30 : 0), hourLabel(other(rng.pick([1, -1, 2])), m), hourLabel(other(6), m)]);
      wrongLabels.delete(hourLabel(h, m));
      return choose(
        rng,
        say('Que horas são?'),
        txt(hourLabel(h, m)),
        [...wrongLabels].slice(0, 3).map((l) => txt(l)),
        hints(
          'O ponteiro pequeno mostra a hora.',
          m === 0 ? 'O ponteiro grande no 12: é hora certa.' : 'O ponteiro grande no 6: é meia hora.',
          `São ${hourLabel(h, m)}.`,
        ),
        { visual: { type: 'token', token: { kind: 'clock', h, m }, big: true } },
      );
    },
  },

  // ===== M8 — Geometria e dados =====
  {
    id: 'mat-m8-formas',
    track: 'matematica',
    step: 'M8',
    title: 'Formas geométricas planas',
    bncc: ['EI03ET05', 'EF01MA14', 'EF02MA15'],
    objective: 'Reconhecer e nomear figuras planas (círculo, quadrado, triângulo, retângulo e outras) em qualquer cor.',
    techniques: ['Visualização', 'Classificação'],
    stdTimeSec: 4,
    blockSize: 6,
    minAge: 4,
    offlineTip: 'Caça às formas: achem círculos, quadrados e retângulos pela casa (prato, janela, porta).',
    generate(rng) {
      const pool = rng.next() < 0.5 ? SHAPES.slice(0, 4) : SHAPES;
      const [target, ...others] = rng.sample(pool, rng.int(3, 4));
      const color = () => rng.pick(COLORS);
      return choose(
        rng,
        say(`Toque ${target.art === 'a' ? 'na' : 'no'} ${target.name}.`),
        tok({ kind: 'shape', shape: target.id, color: color() }),
        others.map((s) => tok({ kind: 'shape', shape: s.id, color: color() })),
        hints(target.tip, `Olhe: ${target.art === 'a' ? 'esta é a' : 'este é o'} ${target.name}.`, `Aqui ${target.art === 'a' ? 'está a' : 'está o'} ${target.name}!`, [
          {},
          { visual: { type: 'token', token: { kind: 'shape', shape: target.id, color: 'azul' }, big: true } },
          {},
        ]),
      );
    },
  },
  {
    id: 'mat-m8-graficos',
    track: 'matematica',
    step: 'M8',
    title: 'Gráfico de barras simples',
    bncc: ['EI03ET08', 'EF01MA21', 'EF02MA22'],
    objective: 'Ler gráficos de barras/colunas: qual tem mais, qual tem menos e quantos há.',
    techniques: ['CPA', 'Leitura de dados'],
    stdTimeSec: 8,
    blockSize: 6,
    minAge: 5,
    offlineTip: 'Façam um gráfico com brinquedos em fileiras (carrinhos, bonecas, bolas). Qual fileira é mais alta?',
    generate(rng) {
      const objs = rng.sample(OBJS, 3);
      const vals = rng.sample([1, 2, 3, 4, 5, 6, 7, 8], 3);
      const visual: Visual = { type: 'bars', data: objs.map((o, i) => ({ img: o.img, value: vals[i] })) };
      const variant = rng.int(0, 2);
      if (variant === 2) {
        const i = rng.int(0, 2);
        return input(
          say(`${quantos(objs[i])} tem no gráfico?`),
          vals[i],
          hints('Siga o topo da barra até o número.', `Conte os quadradinhos da barra: ${countUp(1, vals[i])}.`, `São ${vals[i]} ${objs[i].plur}.`),
          visual,
        );
      }
      const more = variant === 0;
      const idx = vals.indexOf(more ? Math.max(...vals) : Math.min(...vals));
      return choose(
        rng,
        say(more ? 'Qual tem mais no gráfico?' : 'Qual tem menos no gráfico?'),
        img(objs[idx].img),
        objs.filter((_, i) => i !== idx).map((o) => img(o.img)),
        hints(more ? 'Procure a barra mais alta.' : 'Procure a barra mais baixa.', `Compare as barras: ${objs.map((o, i) => `${o.plur} ${vals[i]}`).join(', ')}.`, `${objs[idx].plur}: ${vals[idx]}!`),
        { visual },
      );
    },
  },
  {
    id: 'mat-m8-problemas-cena',
    track: 'matematica',
    step: 'M8',
    title: 'Problemas com cena (juntar, repartir, multiplicar, comprar)',
    bncc: ['EF02MA06', 'EF02MA07', 'EF03MA06', 'EF03MA24'],
    objective: 'Resolver problemas narrados de uma ou duas etapas a partir de uma cena ilustrada (base para o modelo de barras).',
    techniques: ['Problemas narrados', 'Modelo de barras', 'CPA'],
    stdTimeSec: 20,
    blockSize: 5,
    minAge: 7,
    offlineTip: 'Desenhem a historinha da conta com barras de papel: uma barra para cada parte. Depois resolvam.',
    generate(rng) {
      const o = rng.pick(OBJS);
      const Q = o.f ? 'Quantas' : 'Quantos';
      const kind = rng.int(0, 3);
      if (kind === 0) {
        const g = rng.int(2, 5), e = rng.int(2, 6);
        return input(
          say(`Cada cesta tem ${e} ${o.plur}. ${Q} há nas ${g} cestas?`),
          g * e,
          hints('Todas as cestas têm o mesmo tanto.', `Conte de ${e} em ${e}.`, `${g} × ${e} = ${g * e}.`),
          { type: 'scene', parts: [{ type: 'groups', groups: g, each: e, img: o.img }, { type: 'token', token: { kind: 'img', img: 'cesta' } }] },
        );
      }
      if (kind === 1) {
        const a = rng.int(8, 25), b = rng.int(5, 25);
        return input(
          say(`Ana tem ${a} ${o.plur} e Léo tem ${b}. ${Q} juntos?`),
          a + b,
          hints('Juntar é somar as duas partes.', `Uma barra de ${a} e outra de ${b}, lado a lado.`, `${a} + ${b} = ${a + b}.`),
          { type: 'scene', parts: [{ type: 'token', token: { kind: 'img', img: 'menina' } }, { type: 'equation', text: String(a) }, { type: 'token', token: { kind: 'img', img: 'menino' } }, { type: 'equation', text: String(b) }, { type: 'token', token: { kind: 'img', img: o.img } }] },
        );
      }
      if (kind === 2) {
        const notes = rng.pick([[500], [1000], [500, 500], [1000, 500]]);
        const have = notes.reduce((s, v) => s + v, 0) / 100;
        const price = rng.int(1, have - 1);
        return input(
          say(`Você tem este dinheiro. Comprou um brinquedo de ${price} reais. Quanto sobra?`),
          have - price,
          hints(`Primeiro: quanto dinheiro você tem? ${have} reais.`, `Tire ${price} de ${have}.`, `${have} − ${price} = ${have - price} reais.`),
          { type: 'scene', parts: [{ type: 'money', values: notes }, { type: 'token', token: { kind: 'img', img: 'ursinho' } }] },
        );
      }
      const g = rng.int(2, 4), e = rng.int(2, 5);
      return input(
        say(`${g * e} ${o.plur} em ${g} pratos iguais. ${Q} em cada prato?`),
        e,
        hints('Reparta um em cada prato, até acabar.', `${g} grupos iguais de quanto dá ${g * e}?`, `${g * e} ÷ ${g} = ${e}.`, [{}, { visual: { type: 'groups', groups: g, each: e, img: o.img } }, {}]),
        { type: 'scene', parts: [{ type: 'objects', img: o.img, n: g * e }, { type: 'objects', img: 'prato', n: g }] },
      );
    },
  },
];
