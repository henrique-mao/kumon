// Trilha LEITURA E ESCRITA (Português Brasileiro) — degraus D0 a D8.
// A ordem do array LEITURA_SKILLS é a progressão (do mais fácil para o mais difícil).
// Princípios: passos pequenos (Kumon), fônico sistemático com a sílaba como unidade natural do PT-BR,
// letra bastão (maiúscula) de D1 a D5, minúscula/mista a partir de D6, dicas em 3 níveis.
import { BOOKS } from './books';
import { NUM_WORDS_PT, choose, hints, img, pt, txt } from './helpers';
import type { Hint, Item, MouthShape, Option, Rng, Say, Skill, Visual } from './types';

// ---------------------------------------------------------------------------
// Léxico com figura: PALAVRA chave-da-imagem SÍ-LA-BAS
// ---------------------------------------------------------------------------
const LEX_RAW = `
MACACO macaco MA-CA-CO
MALA mala MA-LA
MAPA mapa MA-PA
MOTO moto MO-TO
MEL mel MEL
MEIA meia MEI-A
MENINA menina ME-NI-NA
MENINO menino ME-NI-NO
MILHO milho MI-LHO
MINHOCA minhoca MI-NHO-CA
MOEDA moeda MO-E-DA
MORANGO morango MO-RAN-GO
MORCEGO morcego MOR-CE-GO
MAÇÃ maca MA-ÇÃ
MÃO mao MÃO
LUA lua LU-A
LULA lula LU-LA
LATA lata LA-TA
LUVA luva LU-VA
LIMÃO limao LI-MÃO
LEÃO leao LE-ÃO
LEITE leite LEI-TE
LEQUE leque LE-QUE
LOBO lobo LO-BO
LIVRO livro LI-VRO
LÁPIS lapis LÁ-PIS
LARANJA laranja LA-RAN-JA
NAVIO navio NA-VI-O
NARIZ nariz NA-RIZ
NUVEM nuvem NU-VEM
NINHO ninho NI-NHO
NEVE neve NE-VE
FADA fada FA-DA
FAMÍLIA familia FA-MÍ-LIA
FOCA foca FO-CA
FOGO fogo FO-GO
FITA fita FI-TA
FOLHA folha FO-LHA
FOGUETE foguete FO-GUE-TE
FORMIGA formiga FOR-MI-GA
FLOR flor FLOR
VACA vaca VA-CA
VELA vela VE-LA
VOVÓ vovo_f VO-VÓ
VESTIDO vestido VES-TI-DO
VIOLÃO violao VI-O-LÃO
VULCÃO vulcao VUL-CÃO
SAPO sapo SA-PO
SAPATO sapato SA-PA-TO
SACOLA sacola SA-CO-LA
SINO sino SI-NO
SOFÁ sofa SO-FÁ
SUCO suco SU-CO
SOPA sopa SO-PA
SOL sol SOL
SORVETE sorvete SOR-VE-TE
SEMENTE semente SE-MEN-TE
JANELA janela JA-NE-LA
JACARÉ jacare JA-CA-RÉ
JIPE jipe JI-PE
JOANINHA joaninha JO-A-NI-NHA
ZEBRA zebra ZE-BRA
PATO pato PA-TO
PANELA panela PA-NE-LA
PIPA pipa PI-PA
PIPOCA pipoca PI-PO-CA
PERA pera PE-RA
PEIXE peixe PEI-XE
PENA pena PE-NA
PÉ pe PÉ
PORCO porco POR-CO
POLVO polvo POL-VO
PONTE ponte PON-TE
PÃO pao PÃO
BOLA bola BO-LA
BOCA boca BO-CA
BOLO bolo BO-LO
BOTA bota BO-TA
BONÉ bone BO-NÉ
BONECA boneca BO-NE-CA
BEBÊ bebe BE-BÊ
BALA bala BA-LA
BANANA banana BA-NA-NA
BATATA batata BA-TA-TA
BALEIA baleia BA-LEI-A
BALÃO balao BA-LÃO
BARCO barco BAR-CO
BORBOLETA borboleta BOR-BO-LE-TA
BICICLETA bicicleta BI-CI-CLE-TA
BISCOITO biscoito BIS-COI-TO
TOMATE tomate TO-MA-TE
TIGRE tigre TI-GRE
TIJOLO tijolo TI-JO-LO
TELEFONE telefone TE-LE-FO-NE
TESOURA tesoura TE-SOU-RA
TAMBOR tambor TAM-BOR
TARTARUGA tartaruga TAR-TA-RU-GA
TUBARÃO tubarao TU-BA-RÃO
TREM trem TREM
TENDA tenda TEN-DA
DADO dado DA-DO
DEDO dedo DE-DO
DENTE dente DEN-TE
DOCE doce DO-CE
DINOSSAURO dinossauro DI-NOS-SAU-RO
CAMA cama CA-MA
CASA casa CA-SA
COPO copo CO-PO
COCO coco CO-CO
CUBO cubo CU-BO
CAIXA caixa CAI-XA
CAVALO cavalo CA-VA-LO
CANETA caneta CA-NE-TA
CAMELO camelo CA-ME-LO
COELHO coelho CO-E-LHO
COBRA cobra CO-BRA
COROA coroa CO-RO-A
CORUJA coruja CO-RU-JA
CORAÇÃO coracao CO-RA-ÇÃO
CACHORRO cachorro CA-CHOR-RO
CANGURU canguru CAN-GU-RU
CACTO cacto CAC-TO
QUEIJO queijo QUEI-JO
GATO gato GA-TO
GALO galo GA-LO
GALINHA galinha GA-LI-NHA
GOLFINHO golfinho GOL-FI-NHO
GIRAFA girafa GI-RA-FA
GIRASSOL girassol GI-RAS-SOL
RATO rato RA-TO
RODA roda RO-DA
ROSA rosa RO-SA
REI rei REI
REDE rede RE-DE
RAPOSA raposa RA-PO-SA
ROBÔ robo RO-BÔ
RELÓGIO relogio RE-LÓ-GIO
CHAVE chave CHA-VE
CHUVA chuva CHU-VA
CHINELO chinelo CHI-NE-LO
CHAPÉU chapeu CHA-PÉU
OVELHA ovelha O-VE-LHA
ABELHA abelha A-BE-LHA
ARANHA aranha A-RA-NHA
CARRO carro CAR-RO
PÁSSARO passaro PÁS-SA-RO
PRATO prato PRA-TO
XÍCARA xicara XÍ-CA-RA
ABACAXI abacaxi A-BA-CA-XI
HIPOPÓTAMO hipopotamo HI-PO-PÓ-TA-MO
ILHA ilha I-LHA
IGREJA igreja I-GRE-JA
ÍMÃ ima Í-MÃ
UVA uva U-VA
URSO urso UR-SO
OVO ovo O-VO
OLHO olho O-LHO
ORELHA orelha O-RE-LHA
ÓCULOS oculos Ó-CU-LOS
ÔNIBUS onibus Ô-NI-BUS
ANEL anel A-NEL
AVIÃO aviao A-VI-ÃO
ÁRVORE arvore ÁR-VO-RE
ELEFANTE elefante E-LE-FAN-TE
ESTRELA estrela ES-TRE-LA
ESCOVA escova ES-CO-VA
ESCOLA escola ES-CO-LA
UNICÓRNIO unicornio U-NI-CÓR-NIO
MAR mar MAR
SAL sal SAL
PALHAÇO palhaco PA-LHA-ÇO
LÂMPADA lampada LÂM-PA-DA
CENOURA cenoura CE-NOU-RA
CESTA cesta CES-TA
PRESENTE presente PRE-SEN-TE
PINGUIM pinguim PIN-GUIM
PINTINHO pintinho PIN-TI-NHO
MONTANHA montanha MON-TA-NHA
HOSPITAL hospital HOS-PI-TAL
HAMBÚRGUER hamburguer HAM-BÚR-GUER
GIRAFA girafa GI-RA-FA
`;

export interface LexWord {
  /** Palavra em letra bastão (maiúscula), com acentos. */
  w: string;
  /** Chave da figura em IMAGES. */
  img: string;
  /** Sílabas em maiúscula. */
  syl: string[];
}

export const LEXICON: LexWord[] = (() => {
  const seen = new Set<string>();
  const out: LexWord[] = [];
  for (const line of LEX_RAW.trim().split('\n')) {
    const [w, key, s] = line.trim().split(/\s+/);
    if (seen.has(key)) continue;
    seen.add(key);
    out.push({ w, img: key, syl: s.split('-') });
  }
  return out;
})();
const LEX_BY_IMG = new Map(LEXICON.map((x) => [x.img, x]));

function W(key: string): LexWord {
  const x = LEX_BY_IMG.get(key);
  if (!x) throw new Error(`palavra fora do léxico: ${key}`);
  return x;
}
const Ws = (keys: string) => keys.trim().split(/\s+/).map(W);

// ---------------------------------------------------------------------------
// Utilidades de texto e fala
// ---------------------------------------------------------------------------
const low = (s: string) => s.toLocaleLowerCase('pt-BR');
const strip = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '');
/** Fala natural da palavra. */
const sayW = (x: LexWord): Say => pt(low(x.w));
/** Sílabas faladas devagar: "ma... ca... co". */
const saySyl = (x: LexWord): Say => pt(x.syl.map(spokenSyl).join('... '), true);

/** Sílaba como deve ser falada pelo TTS ("MA" → "má", "QUE" → "quê"). */
function spokenSyl(s: string): string {
  const l = low(s);
  if (/[áéíóúâêôãõ]/.test(l)) return l;
  if (l === 'que' || l === 'gue') return `${l.slice(0, -1)}ê`;
  return l.replace(/[aeo]$/, (v) => ({ a: 'á', e: 'é', o: 'ó' })[v as 'a' | 'e' | 'o']);
}

/** Começo consoante+vogal da palavra ("MACACO" → "MA", "QUEIJO" → "QUE", "ABELHA" → "A"). */
function cvStart(w: string): string | null {
  const m = strip(w).toUpperCase().match(/^(QU|GU|CH|LH|NH|[BCDFGHJKLMNPRSTVXZ])?[AEIOU]/);
  return m ? m[0] : null;
}
/** Forma fonética de uma sílaba CV inicial (CE→SE, GI→JI, QUE→KE, CA→KA, HI→I, X→CH). */
function phonSyl(cv: string): string {
  return cv
    .replace(/^QU(?=[EI])/, 'K')
    .replace(/^GU(?=[EI])/, 'G')
    .replace(/^C(?=[AOU])/, 'K')
    .replace(/^C(?=[EI])/, 'S')
    .replace(/^G(?=[EI])/, 'J')
    .replace(/^H/, '')
    .replace(/^X/, 'CH');
}
/** Primeiro som da palavra (consoante, ou a vogal se começar com vogal). */
function firstSound(w: string): string {
  const p = phonSyl(cvStart(w) ?? strip(w).toUpperCase().slice(0, 2));
  return p.length > 1 ? p.slice(0, -1) : p;
}
/** A sílaba inicial é "limpa" (sem nasal nem til), boa para atividades de sílaba inicial. */
const cleanStart = (x: LexWord) => cvStart(x.w) !== null && !/[ÃÕ]/.test(x.syl[0]) && !/[MN]$/.test(x.syl[0]);

/** Sons contínuos que podem ser "esticados" (Boquinhas / fônico). */
const CONT: Record<string, string> = {
  m: 'mmmm', n: 'nnnn', l: 'llll', f: 'ffff', v: 'vvvv', s: 'ssss', z: 'zzzz', j: 'jjjj', x: 'xxxx', ch: 'xxxx', r: 'rrrr',
};

/** Formato de boca de cada som (inspirado no Método das Boquinhas). */
const MOUTH: Record<string, MouthShape> = {
  a: 'aberta', e: 'sorriso', i: 'sorriso', o: 'redonda', u: 'bico',
  m: 'fechada', p: 'fechada', b: 'fechada', f: 'dentes-labio', v: 'dentes-labio',
  t: 'lingua', d: 'lingua', n: 'lingua', l: 'lingua', s: 'sorriso', z: 'sorriso',
  j: 'chiado', x: 'chiado', ch: 'chiado', c: 'aberta', qu: 'aberta', g: 'aberta', gu: 'aberta', r: 'aberta',
};
const mouthOf = (c: string): MouthShape => MOUTH[low(c)] ?? 'aberta';
const mouthV = (m: MouthShape): Visual => ({ type: 'token', token: { kind: 'mouth', mouth: m } });
const textV = (text: string, big = true): Visual => ({ type: 'token', token: { kind: 'text', text, lang: 'pt' }, big });
const imgV = (key: string): Visual => ({ type: 'token', token: { kind: 'img', img: key }, big: true });
const rowText = (parts: string[]): Visual => ({ type: 'row', tokens: parts.map((t) => ({ kind: 'text', text: t, lang: 'pt' })) });
const extra = (a?: Visual, b?: Visual, c?: Visual): Partial<Hint>[] => [{ visual: a }, { visual: b }, { visual: c }];

const LETTER_NAME: Record<string, string> = {
  A: 'á', E: 'é', I: 'i', O: 'ó', U: 'u', B: 'bê', C: 'cê', D: 'dê', F: 'éfe', G: 'gê', H: 'agá', J: 'jota', L: 'éle',
  M: 'ême', N: 'êne', P: 'pê', Q: 'quê', R: 'érre', S: 'ésse', T: 'tê', V: 'vê', X: 'xis', Z: 'zê',
};

/** Peças distratoras: letras que não estão na palavra (preferindo as confundíveis). */
const CONFUSE: Record<string, string> = {
  P: 'B', B: 'PD', T: 'D', D: 'TB', F: 'V', V: 'F', S: 'Z', Z: 'S', C: 'GQ', G: 'CJ', M: 'N', N: 'M', R: 'L', L: 'R', J: 'G', X: 'S', H: 'A',
};
function distractorLetters(rng: Rng, letters: string[], n: number, upper = true): string[] {
  const inWord = new Set(letters.map((l) => l.toUpperCase()));
  const preferred = rng.shuffle([...new Set(letters.flatMap((l) => (CONFUSE[l.toUpperCase()] ?? '').split('')))]).filter((l) => l && !inWord.has(l));
  const others = rng.shuffle('ABDEFGIJLMNOPRSTUVZ'.split('')).filter((l) => !inWord.has(l));
  const out = [...new Set([...preferred, ...others])].slice(0, n);
  return upper ? out : out.map(low);
}

/** Item de alfabeto móvel (letras). */
function buildLetters(rng: Rng, word: string, prompt: Say[], h: [Hint, Hint, Hint], opts: { img?: string; upper?: boolean; extra?: number } = {}): Item {
  const upper = opts.upper ?? true;
  const letters = [...(upper ? word.toUpperCase() : low(word))];
  const tiles = rng.shuffle([...letters, ...distractorLetters(rng, letters, opts.extra ?? 2, upper)]);
  return { kind: 'build', prompt, hints: h, solution: letters, tiles, lang: 'pt', ...(opts.img ? { img: opts.img } : {}) };
}

/** Item de alfabeto móvel (sílabas). */
function buildSyllables(rng: Rng, x: LexWord, prompt: Say[]): Item {
  const pool = ['MA', 'ME', 'MI', 'MO', 'LA', 'LE', 'LO', 'NA', 'NE', 'FA', 'FO', 'VA', 'VE', 'SA', 'SO', 'JA', 'PA', 'PO', 'BA', 'BO', 'TA', 'TO', 'DA', 'DO', 'CA', 'CO', 'RA', 'RO', 'GA', 'LU', 'VI', 'SU', 'NI'];
  const distract = rng.sample(pool.filter((s) => !x.syl.includes(s)), 2);
  return {
    kind: 'build',
    prompt,
    solution: [...x.syl],
    tiles: rng.shuffle([...x.syl, ...distract]),
    img: x.img,
    lang: 'pt',
    hints: hints(
      [pt('Fale a palavra bem devagar.'), sayW(x)],
      [pt('Escute os pedacinhos:'), saySyl(x)],
      [pt('Assim:'), saySyl(x), sayW(x)],
      extra(undefined, rowText(x.syl.map(() => '?')), rowText(x.syl)),
    ),
  };
}

// ---------------------------------------------------------------------------
// D0 — consciência fonológica (oral)
// ---------------------------------------------------------------------------
const VOCAB = Ws(`gato cachorro vaca girafa elefante macaco leao pato peixe abelha borboleta coelho banana maca uva bolo pao
  bola carro casa cama sol lua flor arvore chave sapato livro copo aviao trem barco mao pe nariz boca orelha tartaruga
  cavalo porco ovelha tigre zebra jacare sorvete pipoca relogio escova oculos estrela chuva`);

const RHYMES: string[][] = [
  ['gato', 'pato', 'rato', 'sapato'],
  ['mao', 'pao', 'leao', 'balao', 'limao', 'aviao', 'violao', 'tubarao', 'vulcao', 'coracao'],
  ['janela', 'panela', 'vela'],
  ['foca', 'boca', 'pipoca', 'minhoca'],
  ['sino', 'menino'],
  ['dente', 'semente', 'presente'],
  ['galinha', 'joaninha'],
  ['ninho', 'pintinho', 'golfinho'],
  ['mala', 'bala'],
  ['uva', 'luva', 'chuva'],
  ['bola', 'sacola', 'escola'],
  ['caneta', 'borboleta', 'bicicleta'],
];

function genVocab(rng: Rng): Item {
  const [t, ...wrong] = rng.sample(VOCAB, rng.int(3, 4));
  return choose(
    rng,
    [pt('Toque na figura:'), sayW(t)],
    img(t.img),
    wrong.map((x) => img(x.img)),
    hints(
      'Olhe todas as figuras com calma.',
      [pt('Escute de novo:'), sayW(t), pt('Qual é?')],
      [pt('É esta aqui:'), sayW(t)],
    ),
    { columns: wrong.length + 1 === 4 ? 2 : 3 },
  );
}

function genRhyme(rng: Rng): Item {
  const gi = rng.int(0, RHYMES.length - 1);
  const [a, b, c] = rng.sample(RHYMES[gi], Math.min(3, RHYMES[gi].length)).map(W);
  const otherGroups = rng.sample(RHYMES.filter((_, i) => i !== gi), 2);
  const wrong = otherGroups.map((g) => W(rng.pick(g)));
  const example: [LexWord, LexWord] = c ? [a, c] : gi === 0 ? [W('mao'), W('pao')] : [W('gato'), W('pato')];
  return choose(
    rng,
    [pt('Qual figura rima com'), pt(`${low(a.w)}?`)],
    img(b.img, sayW(b)),
    wrong.map((x) => img(x.img, sayW(x))),
    hints(
      [pt('Escute o finalzinho:'), pt(low(a.w), true)],
      [pt('Rimar é terminar igual, como'), sayW(example[0]), pt('e'), sayW(example[1])],
      [sayW(a), pt('rima com'), sayW(b)],
    ),
    { visual: imgV(a.img) },
  );
}

const START_WORDS = LEXICON.filter(cleanStart);
function genSameStart(rng: Rng): Item {
  const groups = new Map<string, LexWord[]>();
  for (const x of START_WORDS) {
    const k = phonSyl(cvStart(x.w)!);
    groups.set(k, [...(groups.get(k) ?? []), x]);
  }
  const keys = [...groups.keys()].filter((k) => groups.get(k)!.length >= 2 && k.length >= 2);
  const k = rng.pick(keys);
  const [t, m] = rng.sample(groups.get(k)!, 2);
  const wrong = rng.sample(START_WORDS.filter((x) => firstSound(x.w) !== firstSound(t.w)), 2);
  return choose(
    rng,
    [pt('Qual começa com o mesmo som de'), pt(`${low(t.w)}?`)],
    img(m.img, sayW(m)),
    wrong.map((x) => img(x.img, sayW(x))),
    hints(
      [pt('Escute o comecinho:'), pt(spokenSyl(k), true)],
      [pt('Fale cada figura devagar. Qual começa com'), pt(spokenSyl(k), true)],
      [sayW(t), pt('e'), sayW(m), pt('começam com'), pt(spokenSyl(k), true)],
      extra(mouthV(mouthOf(k.length > 1 ? k.slice(0, -1) : k))),
    ),
    { visual: imgV(t.img) },
  );
}

function genClap(rng: Rng): Item {
  const n = rng.int(1, 4);
  const x = rng.pick(LEXICON.filter((w) => w.syl.length === n));
  const options: Option[] = [1, 2, 3, 4].map((k) => ({ token: { kind: 'dots', n: k }, say: pt(NUM_WORDS_PT[k]) }));
  return {
    kind: 'choose',
    prompt: [pt('Bata uma palma para cada pedaço:'), sayW(x)],
    options,
    answer: n - 1,
    columns: 4,
    visual: imgV(x.img),
    hints: hints(
      [pt('Fale devagar, batendo palmas:'), sayW(x)],
      [pt('Escute os pedaços:'), saySyl(x)],
      [saySyl(x), pt(n === 1 ? 'Só um pedaço!' : `São ${NUM_WORDS_PT[n]} pedaços!`)],
    ),
  };
}

// ---------------------------------------------------------------------------
// D1 — traçado e vogais
// ---------------------------------------------------------------------------
const PATHS: { path: 'reta' | 'curva' | 'zigue' | 'onda' | 'laco'; name: string }[] = [
  { path: 'reta', name: 'reta' },
  { path: 'curva', name: 'curva' },
  { path: 'zigue', name: 'de zigue-zague' },
  { path: 'onda', name: 'de ondinha' },
  { path: 'laco', name: 'de laço' },
];

function genTracePath(rng: Rng): Item {
  const p = rng.pick(PATHS);
  return {
    kind: 'trace',
    path: p.path,
    prompt: [pt(`Passe o dedo na linha ${p.name}!`)],
    hints: hints('Comece na bolinha do começo.', 'Vá devagar, sem tirar o dedo da tela.', 'Siga a linha até o fim, assim!'),
  };
}

const VOWEL_WORDS: Record<string, LexWord[]> = {
  A: Ws('abelha aranha abacaxi anel aviao arvore'),
  E: Ws('elefante estrela escova escola'),
  I: Ws('igreja ilha ima'),
  O: Ws('ovo ovelha olho orelha oculos onibus'),
  U: Ws('uva urso unicornio'),
};
const VOWELS = ['A', 'E', 'I', 'O', 'U'];

function genVowels(rng: Rng): Item {
  const v = rng.pick(VOWELS);
  const word = rng.pick(VOWEL_WORDS[v]);
  const others = rng.sample(VOWELS.filter((x) => x !== v), 2);
  const m = mouthV(MOUTH[low(v)]);
  const variant = rng.int(0, 2);
  if (variant === 0) {
    return choose(
      rng,
      [pt('Toque na letra'), pt(LETTER_NAME[v], true)],
      txt(v, 'pt', pt(LETTER_NAME[v])),
      others.map((o) => txt(o, 'pt', pt(LETTER_NAME[o]))),
      hints(
        [pt('Escute:'), pt(LETTER_NAME[v], true), pt('Olhe a boquinha.')],
        [pt(LETTER_NAME[v], true), pt('de'), sayW(word)],
        [pt('Esta é a letra'), pt(LETTER_NAME[v], true)],
        extra(m, imgV(word.img), m),
      ),
    );
  }
  if (variant === 1) {
    return choose(
      rng,
      [pt('Com que letra começa'), pt(`${low(word.w)}?`)],
      txt(v, 'pt', pt(LETTER_NAME[v])),
      others.map((o) => txt(o, 'pt', pt(LETTER_NAME[o]))),
      hints(
        [pt('Escute o primeiro som:'), sayW(word)],
        [pt(LETTER_NAME[v].repeat(3), true), pt('...'), sayW(word)],
        [sayW(word), pt('começa com'), pt(LETTER_NAME[v], true)],
        extra(m, m),
      ),
      { visual: imgV(word.img) },
    );
  }
  const wrong = others.map((o) => rng.pick(VOWEL_WORDS[o]));
  return choose(
    rng,
    [pt('Qual figura começa com esta letra?')],
    img(word.img, sayW(word)),
    wrong.map((x) => img(x.img, sayW(x))),
    hints(
      [pt('Esta letra é'), pt(LETTER_NAME[v], true)],
      [pt('Fale o nome das figuras. Qual começa com'), pt(LETTER_NAME[v], true)],
      [sayW(word), pt('começa com'), pt(LETTER_NAME[v], true)],
      extra(m),
    ),
    { visual: textV(v) },
  );
}

function genTraceVowel(rng: Rng): Item {
  const v = rng.pick(VOWELS);
  const word = rng.pick(VOWEL_WORDS[v]);
  return {
    kind: 'trace',
    glyph: v,
    prompt: [pt('Trace a letra'), pt(LETTER_NAME[v], true)],
    visual: imgV(word.img),
    hints: hints(
      [pt('Comece pelo número 1.')],
      [pt('Siga as setinhas, devagar.')],
      [pt(LETTER_NAME[v], true), pt('de'), sayW(word), pt('Assim!')],
    ),
  };
}

// ---------------------------------------------------------------------------
// D2/D3 — sílabas por família de consoantes
// ---------------------------------------------------------------------------
function sylSet(cons: string[]): string[] {
  const out: string[] = [];
  for (const c of cons) {
    if (c === 'c') out.push('CA', 'CO', 'QUE', 'QUI');
    else if (c === 'g') out.push('GA', 'GO', 'GU', 'GUE', 'GUI');
    else for (const v of VOWELS) out.push(c.toUpperCase() + v);
  }
  return out;
}
const consOf = (syl: string) => low(syl.slice(0, -1));
const family = (syl: string) => (syl.startsWith('QU') ? 'C' : syl.startsWith('GU') ? 'G' : syl[0]);

function genSyllables(rng: Rng, cons: string[]): Item {
  const set = sylSet(cons);
  const words = START_WORDS.filter((x) => set.includes(cvStart(x.w)!));
  const t = rng.pick(words);
  const syl = cvStart(t.w)!;
  const c = consOf(syl);
  const m = mouthV(mouthOf(c));
  const sound = CONT[c] ?? spokenSyl(syl);
  const variant = rng.int(0, CONT[c] ? 2 : 1);

  if (variant === 0) {
    const others = START_WORDS.filter((x) => phonSyl(cvStart(x.w)!) !== phonSyl(syl));
    const near = others.filter((x) => set.includes(cvStart(x.w)!));
    const wrong = rng.sample(near.length >= 2 && rng.next() < 0.7 ? near : others, 2);
    return choose(
      rng,
      [pt('Toque na figura que começa com'), pt(spokenSyl(syl), true)],
      img(t.img, sayW(t)),
      wrong.map((x) => img(x.img, sayW(x))),
      hints(
        [pt('Escute o som:'), pt(sound, true)],
        [pt('Fale cada figura devagar. Qual começa com'), pt(spokenSyl(syl), true)],
        [sayW(t), pt('começa com'), pt(spokenSyl(syl), true)],
        extra(m, textV(syl)),
      ),
      { visual: textV(syl) },
    );
  }
  if (variant === 1) {
    const same = set.filter((s) => s !== syl && family(s) === family(syl));
    const rest = set.filter((s) => s !== syl && family(s) !== family(syl));
    const wrong = [...rng.shuffle(same), ...rng.shuffle(rest)].slice(0, 2);
    return choose(
      rng,
      [pt('Com que sílaba começa'), pt(`${low(t.w)}?`)],
      txt(syl, 'pt', pt(spokenSyl(syl), true)),
      wrong.map((s) => txt(s, 'pt', pt(spokenSyl(s), true))),
      hints(
        [pt('Escute o comecinho:'), saySyl(t)],
        [pt('Primeiro o som'), pt(sound, true), pt('depois a vogal.')],
        [sayW(t), pt('começa com'), pt(spokenSyl(syl), true)],
        extra(m, rowText(t.syl)),
      ),
      { visual: imgV(t.img) },
    );
  }
  // variante 2: som contínuo isolado → letra
  const C = syl.slice(0, -1);
  const pool = cons.map((x) => x.toUpperCase()).filter((x) => x !== C);
  const wrong = [...rng.shuffle(pool), ...rng.shuffle(['M', 'L', 'F', 'S', 'V', 'N', 'J', 'Z'].filter((x) => x !== C && !pool.includes(x)))].slice(0, 2);
  return choose(
    rng,
    [pt('Que letra faz este som?'), pt(sound, true)],
    txt(C, 'pt', pt(sound, true)),
    wrong.map((x) => txt(x, 'pt', pt(CONT[low(x)] ?? LETTER_NAME[x], true))),
    hints(
      [pt('Escute de novo:'), pt(sound, true), pt('Olhe a boquinha.')],
      [pt(sound, true), pt('como em'), sayW(t)],
      [pt('Este som é da letra'), pt(LETTER_NAME[C] ?? C, true)],
      extra(m, imgV(t.img), m),
    ),
  );
}

/** Palavras CV para montar com sílabas (D2). */
const BUILD_SYL_WORDS = Ws('mala lula luva lua neve vovo_f sofa vela janela meia sino sapo suco vaca foca fada fita moto mapa macaco navio');
/** Palavras de leitura D2: só vogais + M L N F V S J Z. */
const READ_D2_WORDS = Ws('mala lua lula luva neve vovo_f sofa vela meia janela sino uva ovo mel');

function genReadWord(rng: Rng): Item {
  const [t, ...wrong] = rng.sample(READ_D2_WORDS, 3);
  return choose(
    rng,
    [pt('Leia a palavra e toque na figura!')],
    img(t.img),
    wrong.map((x) => img(x.img)),
    hints(
      [pt('Leia um pedacinho de cada vez.')],
      [pt('Escute os pedaços:'), saySyl(t), pt('Junte tudo!')],
      [pt('Está escrito'), sayW(t)],
      extra(rowText(t.syl), rowText(t.syl)),
    ),
    { visual: textV(t.w) },
  );
}

const R_WORDS = Ws('rato roda rosa raposa pera coroa coruja girafa');

/** Pares surda/sonora: troca P↔B, T↔D, F↔V, C↔G na primeira letra. */
const SWAP: Record<string, string> = { P: 'B', B: 'P', T: 'D', D: 'T', F: 'V', V: 'F', C: 'G', G: 'C' };
const VOICE_WORDS = Ws('pato pipa pera pena bola boca bolo bota bala tomate dado dedo doce fada foca fogo fita vaca vela gato galo copo cama');
const VOICE_TIP: Record<string, string> = {
  P: 'P é sopradinho, sem vibrar a garganta.', B: 'B vibra a garganta. Ponha a mão no pescoço!',
  T: 'T é sopradinho, sem vibrar.', D: 'D vibra a garganta.',
  F: 'F é sopro, sem vibrar.', V: 'V vibra os lábios e a garganta.',
  C: 'C de casa é sopradinho.', G: 'G de gato vibra a garganta.',
};

function genVoicing(rng: Rng): Item {
  const t = rng.pick(VOICE_WORDS);
  const first = strip(t.w)[0];
  const wrongWord = SWAP[first] + t.w.slice(1);
  return choose(
    rng,
    [pt('Escute:'), sayW(t), pt('Qual está escrito certo?')],
    txt(t.w),
    [txt(wrongWord)],
    hints(
      [pt(VOICE_TIP[first])],
      [pt(spokenSyl(t.syl[0]), true), pt('...'), sayW(t), pt(`Começa com ${LETTER_NAME[first]}.`)],
      [sayW(t), pt('começa com'), pt(LETTER_NAME[first], true)],
      extra(mouthV(mouthOf(first)), textV(t.syl[0])),
    ),
    { visual: imgV(t.img), columns: 2 },
  );
}

// ---------------------------------------------------------------------------
// D4 — sílabas complexas e dígrafos
// ---------------------------------------------------------------------------
const CVC_CCV_WORDS = Ws('mar sol sal mel urso porco barco polvo flor prato tigre cobra zebra livro anel cacto');

function genCvcCcv(rng: Rng): Item {
  const x = rng.pick(CVC_CCV_WORDS);
  return buildLetters(
    rng,
    x.w,
    [pt('Monte a palavra com as letras:'), sayW(x)],
    hints(
      [pt('Fale bem devagar:'), saySyl(x)],
      [pt('Escute cada som e procure a letra.'), saySyl(x)],
      [pt('Assim:'), pt([...x.w].map((l) => LETTER_NAME[l] ?? l).join(', '), true)],
      extra(undefined, rowText(x.syl), textV(x.w)),
    ),
    { img: x.img },
  );
}

interface Blank { x: LexWord; blank: string; options: string[]; tip: string }
const DIGRAPH_TIP: Record<string, string> = {
  CH: 'CH faz o som chiado: xxxx.',
  LH: 'LH faz o som de lha, lhe, lho.',
  NH: 'NH faz o som de nha, nhe, nho.',
};
const DIGRAPH_WORDS: [string, string][] = [
  ['chave', 'CH'], ['chuva', 'CH'], ['chinelo', 'CH'], ['chapeu', 'CH'], ['cachorro', 'CH'],
  ['ovelha', 'LH'], ['abelha', 'LH'], ['folha', 'LH'], ['milho', 'LH'], ['olho', 'LH'], ['orelha', 'LH'], ['ilha', 'LH'], ['coelho', 'LH'],
  ['galinha', 'NH'], ['aranha', 'NH'], ['ninho', 'NH'], ['joaninha', 'NH'], ['minhoca', 'NH'], ['golfinho', 'NH'], ['montanha', 'NH'],
];
const BUILD_DIGRAPH = new Set(['chave', 'chuva', 'ovelha', 'abelha', 'folha', 'milho', 'olho', 'ilha', 'aranha', 'ninho']);

function genBlank(rng: Rng, b: Blank): Item {
  const shown = b.x.w.replace(b.blank, '_'.repeat(b.blank.length));
  const ws = b.options.filter((o) => o !== b.blank);
  return choose(
    rng,
    [pt('Complete a palavra:'), sayW(b.x)],
    txt(b.blank),
    ws.map((o) => txt(o)),
    hints(
      [pt('Escute bem:'), saySyl(b.x)],
      [pt(b.tip)],
      [pt('Assim:'), sayW(b.x), pt(`com ${b.blank.split('').map((l) => LETTER_NAME[l]).join(' ')}`)],
      extra(undefined, undefined, textV(b.x.w)),
    ),
    { visual: { type: 'row', tokens: [{ kind: 'img', img: b.x.img }, { kind: 'text', text: shown, lang: 'pt' }] }, columns: b.options.length },
  );
}

function genDigraph(rng: Rng): Item {
  const [key, dig] = rng.pick(DIGRAPH_WORDS);
  const x = W(key);
  if (BUILD_DIGRAPH.has(key) && rng.next() < 0.4) {
    return buildLetters(
      rng,
      x.w,
      [pt('Monte a palavra:'), sayW(x)],
      hints(
        [pt('Fale devagar:'), saySyl(x)],
        [pt(DIGRAPH_TIP[dig]), pt('São duas letras juntas!')],
        [pt('Assim:'), sayW(x)],
        extra(undefined, textV(dig), textV(x.w)),
      ),
      { img: x.img },
    );
  }
  return genBlank(rng, { x, blank: dig, options: ['CH', 'LH', 'NH'], tip: DIGRAPH_TIP[dig] });
}

const RR_SS: [string, string][] = [
  ['carro', 'RR'], ['cachorro', 'RR'], ['pera', 'R'], ['girafa', 'R'], ['coroa', 'R'], ['coruja', 'R'], ['aranha', 'R'],
  ['passaro', 'SS'], ['dinossauro', 'SS'], ['girassol', 'SS'], ['casa', 'S'], ['rosa', 'S'], ['raposa', 'S'], ['tesoura', 'S'],
];
const RS_TIP: Record<string, string> = {
  RR: 'Som forte de R no meio da palavra? Use RR!',
  R: 'Som fraquinho de R entre vogais: um R só.',
  SS: 'Som de S entre vogais? Use SS!',
  S: 'Um S sozinho entre vogais tem som de Z.',
};

function genRrSs(rng: Rng): Item {
  const [key, blank] = rng.pick(RR_SS);
  const x = W(key);
  const pair = blank.startsWith('R') ? ['R', 'RR'] : ['S', 'SS'];
  // posição do espaço: primeira ocorrência entre vogais
  const w = x.w;
  const re = blank === 'R' ? /(?<=[AEIOUÁÉÍÓÚ])R(?=[AEIOUÁÉÍÓÚ])/ : blank === 'S' ? /(?<=[AEIOUÁÉÍÓÚ])S(?=[AEIOUÁÉÍÓÚ])/ : new RegExp(blank);
  const shownWord = w.replace(re, '_'.repeat(blank.length));
  const fake: LexWord = { ...x, w: shownWord };
  const item = genBlank(rng, { x: fake, blank, options: pair, tip: RS_TIP[blank] });
  // a fala deve usar a palavra verdadeira, e a dica final mostra a palavra inteira
  item.prompt = [pt('Complete a palavra:'), sayW(x)];
  item.hints[0].say = [pt('Escute bem:'), saySyl(x)];
  item.hints[2].say = [pt('Assim:'), sayW(x)];
  item.hints[2].visual = textV(x.w);
  item.visual = { type: 'row', tokens: [{ kind: 'img', img: x.img }, { kind: 'text', text: shownWord, lang: 'pt' }] };
  return item;
}

// ---------------------------------------------------------------------------
// D5 / D8 — ortografia (escolher a escrita certa) e leitura de palavras
// ---------------------------------------------------------------------------
interface Spell { key: string; w: string; wrong: string[]; tip: string }
const S = (key: string, w: string, wrong: string, tip: string): Spell => ({ key, w, wrong: wrong.split(','), tip });

const TIP_TIL = 'O som pelo nariz no fim se escreve com til: ~';
const TIP_MPB = 'Antes de P e B, usamos M.';
const TIP_N = 'Antes das outras consoantes, usamos N.';
const TIP_M_END = 'No fim da palavra, o som nasal se escreve com M.';
const NASAL: Spell[] = [
  S('pao', 'PÃO', 'PAO,PAM', TIP_TIL), S('mao', 'MÃO', 'MAO,MAM', TIP_TIL), S('leao', 'LEÃO', 'LEAO,LEOM', TIP_TIL),
  S('balao', 'BALÃO', 'BALAO,BALAM', TIP_TIL), S('limao', 'LIMÃO', 'LIMAO,LIMOM', TIP_TIL), S('aviao', 'AVIÃO', 'AVIAO,AVIAM', TIP_TIL),
  S('violao', 'VIOLÃO', 'VIOLAO,VIOLAM', TIP_TIL), S('maca', 'MAÇÃ', 'MAÇA,MAÇAN', TIP_TIL), S('ima', 'ÍMÃ', 'ÍMA,ÍMAN', TIP_TIL),
  S('tambor', 'TAMBOR', 'TANBOR,TABOR', TIP_MPB), S('lampada', 'LÂMPADA', 'LÂNPADA,LÁPADA', TIP_MPB),
  S('dente', 'DENTE', 'DETE,DEMTE', TIP_N), S('elefante', 'ELEFANTE', 'ELEFATE,ELEFAMTE', TIP_N), S('canguru', 'CANGURU', 'CAGURU,CAMGURU', TIP_N),
  S('semente', 'SEMENTE', 'SEMETE,SEMEMTE', TIP_N), S('montanha', 'MONTANHA', 'MOTANHA,MOMTANHA', TIP_N), S('tenda', 'TENDA', 'TEDA,TEMDA', TIP_N),
  S('pinguim', 'PINGUIM', 'PIGUIM,PINGUIN', TIP_N), S('nuvem', 'NUVEM', 'NUVE,NUVEN', TIP_M_END), S('trem', 'TREM', 'TRE,TREN', TIP_M_END),
];
const TIP_CED = 'Ç tem som de S antes de A, O e U.';
const TIP_CE = 'C antes de E e I tem som de S.';
const TIP_GE = 'G antes de E e I tem som de J.';
const TIP_SZ = 'Entre vogais, um S só tem som de Z.';
const CEDILHA: Spell[] = [
  S('maca', 'MAÇÃ', 'MASSÃ,MACÃ', TIP_CED), S('palhaco', 'PALHAÇO', 'PALHASSO,PALHACO', TIP_CED), S('coracao', 'CORAÇÃO', 'CORASSÃO,CORACÃO', TIP_CED),
  S('cenoura', 'CENOURA', 'SENOURA,ÇENOURA', TIP_CE), S('doce', 'DOCE', 'DOSSE,DOÇE', TIP_CE), S('cesta', 'CESTA', 'SESTA,ÇESTA', TIP_CE),
  S('girafa', 'GIRAFA', 'JIRAFA,GUIRAFA', TIP_GE), S('girassol', 'GIRASSOL', 'JIRASSOL,GIRASOL', TIP_GE),
  S('casa', 'CASA', 'CAZA,CASSA', TIP_SZ), S('rosa', 'ROSA', 'ROZA,ROSSA', TIP_SZ), S('raposa', 'RAPOSA', 'RAPOZA,RAPOSSA', TIP_SZ),
  S('tesoura', 'TESOURA', 'TEZOURA,TESSOURA', TIP_SZ), S('presente', 'PRESENTE', 'PREZENTE,PRESSENTE', TIP_SZ),
];
const TIP_X = 'Aqui o som chiado se escreve com X.';
const TIP_H = 'O H do começo não tem som, mas precisa aparecer!';
const TIP_CH = 'Aqui o som chiado se escreve com CH.';
const XH: Spell[] = [
  S('xicara', 'XÍCARA', 'CHÍCARA,SÍCARA', TIP_X), S('peixe', 'PEIXE', 'PEICHE,PEXE', TIP_X), S('caixa', 'CAIXA', 'CAICHA,CAXA', TIP_X),
  S('abacaxi', 'ABACAXI', 'ABACACHI,ABACASI', TIP_X), S('hipopotamo', 'HIPOPÓTAMO', 'IPOPÓTAMO,RIPOPÓTAMO', TIP_H),
  S('hospital', 'HOSPITAL', 'OSPITAL,ROSPITAL', TIP_H), S('hamburguer', 'HAMBÚRGUER', 'AMBÚRGUER,RAMBÚRGUER', TIP_H),
  S('chapeu', 'CHAPÉU', 'XAPÉU,CAPÉU', TIP_CH), S('chave', 'CHAVE', 'XAVE,CAVE', TIP_CH), S('chinelo', 'CHINELO', 'XINELO,CINELO', TIP_CH),
];

function genSpelling(rng: Rng, list: Spell[], lower = false): Item {
  const e = rng.pick(list);
  const show = (s: string) => (lower ? low(s) : s);
  const spoken = pt(low(e.w));
  return choose(
    rng,
    [spoken, pt('Qual é o jeito certo de escrever?')],
    txt(show(e.w)),
    e.wrong.map((w) => txt(show(w))),
    hints(
      [pt('Escute devagar:'), pt(low(e.w), true)],
      [pt(e.tip)],
      [pt('Assim:'), spoken],
    ),
    { visual: imgV(e.key) },
  );
}

/** Ler uma palavra (com o caso especial) e tocar na figura. */
function genReadSpecial(rng: Rng, list: Spell[], lower = false): Item {
  const [t, ...wrong] = rng.sample(list.filter((e, i, a) => a.findIndex((o) => o.key === e.key) === i), 3);
  const x = W(t.key);
  return choose(
    rng,
    [pt('Leia a palavra e toque na figura!')],
    img(t.key),
    wrong.map((o) => img(o.key)),
    hints(
      [pt('Leia um pedacinho de cada vez.')],
      [pt(t.tip), saySyl(x)],
      [pt('Está escrito'), sayW(x)],
      extra(rowText(x.syl)),
    ),
    { visual: textV(lower ? low(t.w) : t.w) },
  );
}

// ---------------------------------------------------------------------------
// D6 — fluência
// ---------------------------------------------------------------------------
const SENTENCES: { s: string; img: string }[] = [
  { s: 'O sapo pula.', img: 'sapo' },
  { s: 'A vaca faz muuu.', img: 'vaca' },
  { s: 'O bebê dorme.', img: 'bebe' },
  { s: 'O sol brilha.', img: 'sol' },
  { s: 'A lua brilha no céu.', img: 'lua' },
  { s: 'O peixe nada.', img: 'peixe' },
  { s: 'A chuva cai.', img: 'chuva' },
  { s: 'O galo canta.', img: 'galo' },
  { s: 'O avião voa alto.', img: 'aviao' },
  { s: 'A bola rola.', img: 'bola' },
  { s: 'O trem apita.', img: 'trem' },
  { s: 'A abelha faz mel.', img: 'abelha' },
  { s: 'O cachorro late.', img: 'cachorro' },
  { s: 'O macaco come banana.', img: 'macaco' },
  { s: 'A menina lê um livro.', img: 'menina' },
  { s: 'O barco está no mar.', img: 'barco' },
  { s: 'A girafa é alta.', img: 'girafa' },
  { s: 'O pato nada no lago.', img: 'pato' },
];

function genSentencePicture(rng: Rng): Item {
  const [t, ...wrong] = rng.sample(SENTENCES, 3);
  return choose(
    rng,
    [pt('Leia a frase e toque na figura!')],
    img(t.img),
    wrong.map((x) => img(x.img)),
    hints(
      'Leia palavra por palavra, com o dedo embaixo.',
      [pt('Escute a frase:'), pt(t.s, true)],
      [pt(t.s), pt('É esta figura!')],
    ),
    { visual: textV(t.s) },
  );
}

function genSpeakSentence(rng: Rng): Item {
  const t = rng.pick(SENTENCES);
  return {
    kind: 'speak',
    expect: t.s,
    lang: 'pt',
    prompt: [pt('Leia a frase em voz alta!')],
    visual: { type: 'scene', parts: [imgV(t.img), textV(t.s)] },
    hints: hints('Aponte cada palavra enquanto lê.', [pt('Escute:'), pt(t.s, true)], [pt('Agora você, junto comigo:'), pt(t.s)]),
  };
}

const PT_BOOKS = BOOKS.filter((b) => b.lang === 'pt');
function genBook(rng: Rng): Item {
  const b = rng.pick(PT_BOOKS);
  return {
    kind: 'book',
    bookId: b.id,
    prompt: [pt('Vamos ler um livrinho:'), pt(b.title)],
    visual: imgV(b.pages[0].img),
    hints: hints(
      'Leia devagar, apontando as palavras.',
      'Toque numa palavra difícil para ouvir.',
      'Escute a página e leia de novo, junto.',
    ),
  };
}

// ---------------------------------------------------------------------------
// D7 — compreensão
// ---------------------------------------------------------------------------
type Ans = [string, string?]; // [texto, figura?]
interface CompQ { q: string; a: Ans; w: Ans[] }
interface CompText { text: string; qs: CompQ[] }

const TEXTS: CompText[] = [
  {
    text: 'Lia foi à praia. Ela nadou no mar e viu um peixe.',
    qs: [
      { q: 'Onde Lia foi?', a: ['À praia'], w: [['À escola'], ['Ao hospital']] },
      { q: 'Que bicho Lia viu?', a: ['Um peixe', 'peixe'], w: [['Um gato', 'gato'], ['Uma vaca', 'vaca']] },
      { q: 'Como estava o dia, provavelmente?', a: ['Com sol', 'sol'], w: [['Com neve', 'neve'], ['Com chuva', 'chuva']] },
    ],
  },
  {
    text: 'Começou a chover. Davi pegou o guarda-chuva e a bota.',
    qs: [
      { q: 'O que Davi pegou?', a: ['O guarda-chuva', 'guarda_chuva'], w: [['A bola', 'bola'], ['O chapéu', 'chapeu']] },
      { q: 'Por que Davi pegou o guarda-chuva?', a: ['Porque estava chovendo.'], w: [['Porque estava calor.'], ['Porque era noite.']] },
    ],
  },
  {
    text: 'O bolo saiu do forno. Toda a família cantou parabéns para a Bia.',
    qs: [
      { q: 'De onde saiu o bolo?', a: ['Do forno'], w: [['Da geladeira'], ['Da mala']] },
      { q: 'O que a família estava festejando?', a: ['O aniversário da Bia'], w: [['O Natal'], ['Uma viagem']] },
    ],
  },
  {
    text: 'O gato viu o rato. O rato correu para o buraco.',
    qs: [
      { q: 'Quem correu para o buraco?', a: ['O rato', 'rato'], w: [['O gato', 'gato'], ['O pato', 'pato']] },
      { q: 'Por que o rato correu?', a: ['Ficou com medo do gato.'], w: [['Queria brincar.'], ['Estava com sono.']] },
    ],
  },
  {
    text: 'Tom plantou uma semente. Ele regou todo dia. Um dia, nasceu uma flor!',
    qs: [
      { q: 'O que Tom plantou?', a: ['Uma semente', 'semente'], w: [['Um ovo', 'ovo'], ['Uma bala', 'bala']] },
      { q: 'O que ajudou a flor a nascer?', a: ['A água de todo dia'], w: [['O vento forte'], ['O barulho']] },
    ],
  },
  {
    text: 'Ana bocejou e esfregou os olhos. A mamãe apagou a luz.',
    qs: [
      { q: 'Quem apagou a luz?', a: ['A mamãe', 'mamae'], w: [['O papai', 'papai'], ['O vovô', 'vovo_m']] },
      { q: 'O que Ana vai fazer agora?', a: ['Dormir', 'dormir'], w: [['Correr', 'correr'], ['Comer', 'comer']] },
    ],
  },
  {
    text: 'O pintinho estava sozinho e piava alto. A galinha chegou correndo.',
    qs: [
      { q: 'Quem chegou correndo?', a: ['A galinha', 'galinha'], w: [['O cachorro', 'cachorro'], ['A vaca', 'vaca']] },
      { q: 'Como o pintinho se sentia sozinho?', a: ['Triste', 'triste'], w: [['Feliz', 'feliz'], ['Bravo', 'bravo']] },
    ],
  },
];

const ansOpt = (a: Ans): Option => (a[1] ? img(a[1], pt(a[0])) : txt(a[0], 'pt', pt(a[0])));

function genComprehension(rng: Rng): Item {
  const t = rng.pick(TEXTS);
  const q = rng.pick(t.qs);
  return choose(
    rng,
    [pt(q.q)],
    ansOpt(q.a),
    q.w.map(ansOpt),
    hints(
      'Leia o texto de novo, com calma.',
      [pt('Escute o texto:'), pt(t.text)],
      [pt('A resposta é:'), pt(q.a[0])],
    ),
    { visual: textV(t.text, false) },
  );
}

const PICTURE_SEQS: string[][] = [
  ['ovo', 'pintinho', 'galinha'],
  ['semente', 'folha', 'arvore'],
  ['bebe', 'menino', 'vovo_m'],
  ['nuvem', 'chuva', 'arco_iris'],
];
const STORIES: { who: string; s: string[] }[] = [
  { who: 'Lia', s: ['Lia acordou.', 'Lia tomou café.', 'Lia foi para a escola.'] },
  { who: 'o menino', s: ['O menino plantou a semente.', 'A chuva molhou a terra.', 'Nasceu uma flor.'] },
  { who: 'Davi', s: ['Davi pegou a bola.', 'Davi chutou a bola.', 'A bola entrou no gol!'] },
  { who: 'a mamãe', s: ['A mamãe fez o bolo.', 'O bolo assou no forno.', 'Todos comeram o bolo.'] },
  { who: 'o pintinho', s: ['O pintinho bicou o ovo.', 'O ovo quebrou.', 'O pintinho saiu e piou.'] },
];
const POS = ['primeiro', 'depois', 'por último'];

function genSequence(rng: Rng): Item {
  if (rng.next() < 0.5) {
    const seq = rng.pick(PICTURE_SEQS);
    const missing = rng.int(0, seq.length - 1);
    const wrong = rng.sample([...new Set(PICTURE_SEQS.flat())].filter((k) => !seq.includes(k)), 2);
    return choose(
      rng,
      [pt('Qual figura completa a história?')],
      img(seq[missing]),
      wrong.map((k) => img(k)),
      hints(
        'O que vem antes? O que vem depois?',
        [pt('Pense no que acontece primeiro, depois e por último.')],
        [pt('Esta figura completa a história!')],
      ),
      { visual: { type: 'sequence', items: seq.map((k) => ({ kind: 'img', img: k })), missing } },
    );
  }
  const st = rng.pick(STORIES);
  const pos = rng.int(0, 2);
  return choose(
    rng,
    [pt(`O que aconteceu ${POS[pos]}?`)],
    txt(st.s[pos], 'pt', pt(st.s[pos])),
    st.s.filter((_, i) => i !== pos).map((s) => txt(s, 'pt', pt(s))),
    hints(
      'Leia a história de novo, do começo.',
      [pt('Escute na ordem:'), ...st.s.map((s) => pt(s))],
      [pt(`${POS[pos][0].toUpperCase()}${POS[pos].slice(1)}:`), pt(st.s[pos])],
    ),
    { visual: textV(st.s.join(' '), false), columns: 1 },
  );
}

// ---------------------------------------------------------------------------
// D8 — escrita
// ---------------------------------------------------------------------------
const DICTATION = Ws('casa rosa sapo bola gato pato dado vela chave chuva carro rato galo ninho abelha galinha janela macaco cavalo tomate girafa coelho peixe folha prato zebra tigre cobra panela boneca dente ponte tambor');

function genDictation(rng: Rng): Item {
  const x = rng.pick(DICTATION);
  const word = low(x.w);
  const showImg = word.length <= 5;
  return buildLetters(
    rng,
    word,
    [pt('Escute e escreva:'), sayW(x)],
    hints(
      [pt('Fale devagar:'), saySyl(x)],
      [pt('Um pedacinho de cada vez:'), saySyl(x)],
      [pt('Assim:'), sayW(x)],
      extra(showImg ? undefined : imgV(x.img), rowText(x.syl.map(low)), textV(word)),
    ),
    { img: showImg ? x.img : undefined, upper: false, extra: 3 },
  );
}

const SEGMENT: [string, string, string][] = [
  ['A menina pulou de repente.', 'A menina pulou derepente.', 'A me nina pulou de repente.'],
  ['Agora eu vou brincar.', 'Agoraeu vou brincar.', 'A gora eu vou brincar.'],
  ['O gato subiu na árvore.', 'O gato subiu naárvore.', 'O ga to subiu na árvore.'],
  ['Eu gosto de sorvete.', 'Eu gostode sorvete.', 'Eu gos to de sorvete.'],
  ['A casa é amarela.', 'Acasa é amarela.', 'A casa é a marela.'],
  ['Vamos jogar bola?', 'Vamosjogar bola?', 'Vamos jo gar bola?'],
  ['O sapo pulou no lago.', 'O sapo pulou nolago.', 'O sa po pulou no lago.'],
  ['Embaixo da mesa tem um gato.', 'Embaixo damesa tem um gato.', 'Em baixo da mesa tem um gato.'],
  ['A borboleta voou alto.', 'Aborboleta voou alto.', 'A borbo leta voou alto.'],
  ['Meu irmão comeu pão.', 'Meuirmão comeu pão.', 'Meu ir mão comeu pão.'],
];

function genSegmentation(rng: Rng): Item {
  const [ok, hipo, hiper] = rng.pick(SEGMENT);
  return choose(
    rng,
    [pt('Qual frase tem os espaços certinhos?')],
    txt(ok),
    [txt(hipo), txt(hiper)],
    hints(
      'Cada palavra fica separada por um espaço.',
      [pt('Escute e conte as palavras:'), pt(ok, true)],
      [pt('Assim, com cada palavra separada:'), pt(ok)],
    ),
    { columns: 1 },
  );
}

const TIP_RR = 'Som forte de R entre vogais: RR.';
const TIP_R1 = 'Som fraquinho de R entre vogais: um R só.';
const TIP_R0 = 'No começo da palavra, um R só já é forte.';
const TIP_SS = 'Som de S entre vogais: SS.';
const TIP_S0 = 'No começo da palavra, usamos S.';
const ORTHO: Spell[] = [
  S('carro', 'carro', 'caro', TIP_RR), S('cachorro', 'cachorro', 'cachoro', TIP_RR), S('girafa', 'girafa', 'girrafa,jirafa', TIP_R1),
  S('coruja', 'coruja', 'corruja', TIP_R1), S('rato', 'rato', 'rrato', TIP_R0), S('tartaruga', 'tartaruga', 'tartarruga', TIP_R1),
  S('passaro', 'pássaro', 'pásaro,páçaro', TIP_SS), S('palhaco', 'palhaço', 'palhasso,palhaso', TIP_CED), S('maca', 'maçã', 'massã,masã', TIP_CED),
  S('dinossauro', 'dinossauro', 'dinosauro,dinoçauro', TIP_SS), S('girassol', 'girassol', 'girasol,giraçol', TIP_SS), S('sapato', 'sapato', 'çapato,ssapato', TIP_S0),
  S('tambor', 'tambor', 'tanbor,tabor', TIP_MPB), S('lampada', 'lâmpada', 'lânpada,lápada', TIP_MPB), S('dente', 'dente', 'demte', TIP_N),
  S('elefante', 'elefante', 'elefamte', TIP_N), S('ponte', 'ponte', 'pomte', TIP_N), S('pinguim', 'pinguim', 'pimguim', TIP_N),
];

// ---------------------------------------------------------------------------
// Habilidades
// ---------------------------------------------------------------------------
const base = { track: 'leitura' as const };

export const LEITURA_SKILLS: Skill[] = [
  // ----- D0 -----
  {
    ...base, id: 'lei-d0-vocabulario', step: 'D0', title: 'Vocabulário: escutar e apontar',
    bncc: ['EI03EF01', 'EI03EF07'], objective: 'Ampliar o vocabulário associando palavra falada e figura.',
    techniques: ['Vocabulário oral', 'Leitura dialógica'], stdTimeSec: 8, blockSize: 6, minAge: 4,
    generate: genVocab,
    offlineTip: 'Brinque de "Eu vejo...": diga o nome de um objeto da casa e a criança corre para tocá-lo. Depois troquem de papel.',
  },
  {
    ...base, id: 'lei-d0-rimas', step: 'D0', title: 'Rimas',
    bncc: ['EI03EF02', 'EI03EF01'], objective: 'Perceber palavras que terminam com o mesmo som (rima).',
    techniques: ['Consciência fonológica', 'Cantigas e parlendas'], stdTimeSec: 10, blockSize: 6, minAge: 4,
    generate: genRhyme,
    offlineTip: 'Cante "Batatinha quando nasce" ou "Pirulito que bate bate" e pare antes da rima para a criança completar.',
  },
  {
    ...base, id: 'lei-d0-som-inicial', step: 'D0', title: 'Som inicial igual',
    bncc: ['EI03EF02', 'EI03EF09'], objective: 'Identificar palavras que começam com o mesmo som (aliteração).',
    techniques: ['Consciência fonológica', 'Boquinhas'], stdTimeSec: 10, blockSize: 6, minAge: 4,
    generate: genSameStart,
    offlineTip: 'Jogo "Fui à feira e comprei...": só vale comprar coisas que começam com o mesmo som (MA: macarrão, maçã, mamão...).',
  },
  {
    ...base, id: 'lei-d0-silabas-palmas', step: 'D0', title: 'Contar sílabas com palmas',
    bncc: ['EI03EF02', 'EF01LP06'], objective: 'Segmentar oralmente palavras em sílabas.',
    techniques: ['Consciência fonológica', 'Silábico'], stdTimeSec: 10, blockSize: 6, minAge: 4,
    generate: genClap,
    offlineTip: 'Batam palmas para o nome de cada pessoa da família: "Ma-ri-a" (3 palmas). Quem tem o nome mais comprido?',
  },
  // ----- D1 -----
  {
    ...base, id: 'lei-d1-tracado', step: 'D1', title: 'Pré-escrita: traçar linhas',
    bncc: ['EI03CG05', 'EI03EF09'], objective: 'Desenvolver coordenação motora fina para a escrita.',
    techniques: ['Pré-escrita', 'Montessori (letras de lixa)'], stdTimeSec: 15, blockSize: 5, minAge: 4,
    generate: genTracePath,
    offlineTip: 'Espalhe sal ou farinha numa bandeja e desenhe ondas, zigue-zagues e retas com o dedo. Depois apague e repita.',
  },
  {
    ...base, id: 'lei-d1-vogais', step: 'D1', title: 'Vogais A E I O U',
    bncc: ['EF01LP10', 'EF01LP07', 'EI03EF09'], objective: 'Reconhecer as vogais, seu som e palavras que começam com elas.',
    techniques: ['Fônico', 'Boquinhas', 'Letra bastão'], stdTimeSec: 10, blockSize: 6, minAge: 4,
    graphemes: ['a', 'e', 'i', 'o', 'u'],
    generate: genVowels,
    offlineTip: 'Recorte de revistas figuras que começam com A, E, I, O, U e cole em 5 folhas, uma para cada vogal.',
  },
  {
    ...base, id: 'lei-d1-tracar-vogais', step: 'D1', title: 'Traçar as vogais',
    bncc: ['EF01LP11', 'EI03EF09'], objective: 'Traçar as vogais em letra bastão na direção correta.',
    techniques: ['Montessori (letras de lixa)', 'Letra bastão', 'Multissensorial'], stdTimeSec: 15, blockSize: 5, minAge: 4,
    generate: genTraceVowel,
    offlineTip: 'Escreva as vogais grandes num papel e peça para a criança passar o dedo por cima, falando o som de cada uma.',
  },
  // ----- D2 -----
  {
    ...base, id: 'lei-d2-m-l-n', step: 'D2', title: 'Sílabas com M, L e N',
    bncc: ['EF01LP07', 'EF01LP08'], objective: 'Relacionar os sons M, L e N às letras e formar sílabas (MA, LA, NA...).',
    techniques: ['Fônico', 'Silábico', 'Boquinhas'], stdTimeSec: 10, blockSize: 6, minAge: 5,
    graphemes: ['m', 'l', 'n'],
    generate: (rng) => genSyllables(rng, ['m', 'l', 'n']),
    offlineTip: 'Escreva MA, ME, MI, MO, MU em papeizinhos. Sorteie um e procurem na casa algo que comece com essa sílaba.',
  },
  {
    ...base, id: 'lei-d2-f-v-s-j-z', step: 'D2', title: 'Sílabas com F, V, S, J e Z',
    bncc: ['EF01LP07', 'EF01LP08'], objective: 'Relacionar sons contínuos (F, V, S, J, Z) às letras e formar sílabas.',
    techniques: ['Fônico', 'Silábico', 'Boquinhas'], stdTimeSec: 10, blockSize: 6, minAge: 5,
    graphemes: ['f', 'v', 's', 'j', 'z'],
    generate: (rng) => genSyllables(rng, ['f', 'v', 's', 'j', 'z']),
    offlineTip: 'Façam "sons de bichos": ssss da cobra, zzzz da abelha, ffff do gato bravo. Mostre a letra de cada som.',
  },
  {
    ...base, id: 'lei-d2-montar-silabas', step: 'D2', title: 'Montar palavras com sílabas',
    bncc: ['EF01LP08', 'EF01LP02'], objective: 'Juntar sílabas para formar palavras simples (síntese silábica).',
    techniques: ['Montessori (alfabeto móvel)', 'Silábico'], stdTimeSec: 20, blockSize: 5, minAge: 5,
    generate: (rng) => {
      const x = rng.pick(BUILD_SYL_WORDS);
      return buildSyllables(rng, x, [pt('Monte a palavra:'), sayW(x)]);
    },
    offlineTip: 'Escreva sílabas em tampinhas de garrafa (MA, LA, VE, LA...) e montem juntos MALA, VELA, LUVA.',
  },
  {
    ...base, id: 'lei-d2-ler-palavras', step: 'D2', title: 'Ler as primeiras palavras',
    bncc: ['EF12LP01', 'EF01LP08'], objective: 'Decodificar palavras CV-CV com vogais e consoantes contínuas.',
    techniques: ['Fônico', 'Silábico', 'Leitura repetida'], stdTimeSec: 12, blockSize: 6, minAge: 5,
    generate: genReadWord,
    offlineTip: 'Cole etiquetas com o nome em letra bastão em objetos da casa (SOFÁ, MESA, JANELA) e leiam juntos ao passar.',
  },
  // ----- D3 -----
  {
    ...base, id: 'lei-d3-p-b-t-d', step: 'D3', title: 'Sílabas com P, B, T e D',
    bncc: ['EF01LP07', 'EF02LP03'], objective: 'Relacionar os sons P, B, T e D às letras e às sílabas.',
    techniques: ['Fônico', 'Silábico', 'Boquinhas'], stdTimeSec: 10, blockSize: 6, minAge: 5,
    graphemes: ['p', 'b', 't', 'd'],
    generate: (rng) => genSyllables(rng, ['p', 'b', 't', 'd']),
    offlineTip: 'Segure um papelzinho na frente da boca: com P e T ele balança (sopro); com B e D, não. Testem com PATO e BOTA.',
  },
  {
    ...base, id: 'lei-d3-c-qu-g-gu', step: 'D3', title: 'C/QU e G/GU',
    bncc: ['EF02LP03', 'EF03LP01'], objective: 'Ler sílabas CA, CO, QUE, QUI, GA, GO, GU, GUE, GUI.',
    techniques: ['Fônico', 'Silábico'], stdTimeSec: 10, blockSize: 6, minAge: 5,
    graphemes: ['c', 'qu', 'g', 'gu'],
    generate: (rng) => genSyllables(rng, ['c', 'g']),
    offlineTip: 'Escreva CASA, QUEIJO, GATO e FOGUETE. Pinte de uma cor o QU e o GU e conversem: "o U aqui fica quietinho!".',
  },
  {
    ...base, id: 'lei-d3-r', step: 'D3', title: 'R forte e R fraco',
    bncc: ['EF01LP07', 'EF03LP01'], objective: 'Ler o R no início (forte) e entre vogais (fraco).',
    techniques: ['Fônico', 'Silábico', 'Montessori (alfabeto móvel)'], stdTimeSec: 14, blockSize: 6, minAge: 5,
    graphemes: ['R', 'r'],
    generate: (rng) => {
      if (rng.next() < 0.5) return genSyllables(rng, ['r']);
      const x = rng.pick(R_WORDS);
      return buildSyllables(rng, x, [pt('Monte a palavra:'), sayW(x)]);
    },
    offlineTip: 'Façam o "motor do carro" com RRRR e depois falem PERA bem levinho. Qual R é forte? Qual é fraquinho?',
  },
  {
    ...base, id: 'lei-d3-surda-sonora', step: 'D3', title: 'P/B, T/D, F/V: ouvir a diferença',
    bncc: ['EF02LP03', 'EF01LP07'], objective: 'Discriminar sons surdos e sonoros (P/B, T/D, F/V, C/G) e escrevê-los corretamente.',
    techniques: ['Consciência fonológica', 'Boquinhas', 'Fônico'], stdTimeSec: 10, blockSize: 6, minAge: 6,
    generate: genVoicing,
    offlineTip: 'Mão no pescoço! Falem "vvvv" (vibra) e "ffff" (não vibra); "bbb" e "ppp". Depois digam PATO e BATO.',
  },
  // ----- D4 -----
  {
    ...base, id: 'lei-d4-cvc-ccv', step: 'D4', title: 'Sílabas complexas: MAR, SOL, FLOR, PRATO',
    bncc: ['EF02LP04', 'EF03LP02'], objective: 'Ler e escrever palavras com sílabas CVC e CCV.',
    techniques: ['Montessori (alfabeto móvel)', 'Fônico'], stdTimeSec: 25, blockSize: 5, minAge: 6,
    graphemes: ['r_', 's_', 'l_', 'r2', 'l2'],
    generate: genCvcCcv,
    offlineTip: 'Com letras de ímã ou papel, montem MAR. Troque uma letra: MEL, SOL, SAL. Quantas palavras vocês criam?',
  },
  {
    ...base, id: 'lei-d4-ch-lh-nh', step: 'D4', title: 'Dígrafos CH, LH e NH',
    bncc: ['EF03LP03', 'EF02LP04'], objective: 'Reconhecer que CH, LH e NH são duas letras para um som.',
    techniques: ['Fônico', 'Montessori (alfabeto móvel)'], stdTimeSec: 14, blockSize: 6, minAge: 6,
    graphemes: ['ch', 'lh', 'nh'],
    generate: genDigraph,
    offlineTip: 'Caça aos "casais de letras": procurem CH, LH e NH em embalagens e livros. Cada achado vale um ponto!',
  },
  {
    ...base, id: 'lei-d4-rr-ss', step: 'D4', title: 'R ou RR? S ou SS?',
    bncc: ['EF03LP01', 'EF02LP03'], objective: 'Usar RR e SS entre vogais para os sons fortes de R e S.',
    techniques: ['Fônico', 'Ortografia reflexiva'], stdTimeSec: 12, blockSize: 6, minAge: 6,
    graphemes: ['rr', 'ss'],
    generate: genRrSs,
    offlineTip: 'Leiam juntos CARO e CARRO, CASA e CASSA... O que muda no som? Desenhem as duas palavras.',
  },
  // ----- D5 -----
  {
    ...base, id: 'lei-d5-nasais', step: 'D5', title: 'Nasais: ã, õ, AM, EN, IM, OM, UM',
    bncc: ['EF02LP05', 'EF03LP01'], objective: 'Ler e escrever palavras com til e com M/N nasalizando a vogal.',
    techniques: ['Fônico', 'Ortografia reflexiva'], stdTimeSec: 12, blockSize: 6, minAge: 6,
    graphemes: ['ã', 'õ', 'am', 'an', 'em', 'en', 'im', 'in', 'om', 'on', 'um', 'un'],
    generate: (rng) => (rng.next() < 0.5 ? genSpelling(rng, NASAL) : genReadSpecial(rng, NASAL)),
    offlineTip: 'Tampe o nariz e diga PÃO, MÃO, LEÃO: o som "some"! Isso é o som nasal. Procurem palavras com til nos rótulos.',
  },
  {
    ...base, id: 'lei-d5-c-cedilha-s-z', step: 'D5', title: 'Ç, CE/CI, GE/GI e S com som de Z',
    bncc: ['EF03LP01', 'EF02LP03'], objective: 'Ler corretamente C e G antes de E/I, Ç e S entre vogais.',
    techniques: ['Fônico', 'Ortografia reflexiva'], stdTimeSec: 12, blockSize: 6, minAge: 6,
    graphemes: ['ç', 'ce', 'ge', 's_z'],
    generate: (rng) => (rng.next() < 0.5 ? genSpelling(rng, CEDILHA) : genReadSpecial(rng, CEDILHA)),
    offlineTip: 'Façam dois montes: palavras com som de S (CEBOLA, MAÇÃ, SAPO) e com som de Z (CASA, ROSA, ZEBRA).',
  },
  {
    ...base, id: 'lei-d5-x-h', step: 'D5', title: 'X e H mudo',
    bncc: ['EF03LP01', 'EF02LP03'], objective: 'Ler palavras com X (som chiado) e com H inicial mudo.',
    techniques: ['Fônico', 'Ortografia reflexiva'], stdTimeSec: 12, blockSize: 6, minAge: 6,
    graphemes: ['x', 'h'],
    generate: (rng) => (rng.next() < 0.5 ? genSpelling(rng, XH) : genReadSpecial(rng, XH)),
    offlineTip: 'Brinquem de "H silencioso": falem HOJE, HORA, HIPOPÓTAMO. O H aparece na escrita, mas fica calado!',
  },
  // ----- D6 -----
  {
    ...base, id: 'lei-d6-frase-figura', step: 'D6', title: 'Ler frases',
    bncc: ['EF12LP01', 'EF01LP12'], objective: 'Ler frases curtas com fluência e compreender seu sentido.',
    techniques: ['Fônico', 'Leitura repetida'], stdTimeSec: 15, blockSize: 6, minAge: 6,
    generate: genSentencePicture,
    offlineTip: 'Escreva uma frase curta por dia num papel na geladeira ("O gato dorme."). A criança lê e faz um desenho.',
  },
  {
    ...base, id: 'lei-d6-ler-em-voz-alta', step: 'D6', title: 'Ler em voz alta',
    bncc: ['EF12LP01', 'EF15LP09'], objective: 'Ler frases em voz alta com precisão, ritmo e entonação.',
    techniques: ['Leitura repetida', 'Leitura em eco'], stdTimeSec: 20, blockSize: 5, minAge: 6,
    generate: genSpeakSentence,
    offlineTip: 'Leitura em eco: você lê uma frase de um livro e a criança repete, imitando a sua voz e a sua emoção.',
  },
  {
    ...base, id: 'lei-d6-livros', step: 'D6', title: 'Livrinhos decodificáveis',
    bncc: ['EF12LP01', 'EF15LP15', 'EF01LP16'], objective: 'Ler livros curtos com os sons já aprendidos e responder perguntas.',
    techniques: ['Leitura repetida', 'Leitura dialógica', 'Livros decodificáveis'], stdTimeSec: 180, blockSize: 5, minAge: 6,
    generate: genBook,
    offlineTip: 'Releiam o mesmo livrinho 3 dias seguidos: a criança percebe como a leitura fica mais fácil a cada vez.',
  },
  // ----- D7 -----
  {
    ...base, id: 'lei-d7-compreensao', step: 'D7', title: 'Compreensão: quem, onde, por quê?',
    bncc: ['EF15LP03', 'EF35LP04', 'EF12LP02'], objective: 'Localizar informações explícitas e fazer inferências simples.',
    techniques: ['Leitura dialógica', 'Compreensão literal e inferencial'], stdTimeSec: 30, blockSize: 5, minAge: 6,
    generate: genComprehension,
    offlineTip: 'Depois de ler uma história, faça perguntas: Quem? Onde? Por que você acha que ele fez isso?',
  },
  {
    ...base, id: 'lei-d7-sequencia', step: 'D7', title: 'Sequência de fatos',
    bncc: ['EF15LP03', 'EI03EF04'], objective: 'Ordenar os acontecimentos de uma história (começo, meio e fim).',
    techniques: ['Leitura dialógica', 'Reconto'], stdTimeSec: 25, blockSize: 5, minAge: 6,
    generate: genSequence,
    offlineTip: 'Tire 3 fotos da rotina (acordar, comer, escovar os dentes), embaralhe e peça para a criança pôr em ordem.',
  },
  // ----- D8 -----
  {
    ...base, id: 'lei-d8-ditado', step: 'D8', title: 'Ditado de palavras',
    bncc: ['EF01LP02', 'EF02LP01'], objective: 'Escrever palavras ditadas com as correspondências já aprendidas.',
    techniques: ['Montessori (alfabeto móvel)', 'Psicogênese', 'Fônico'], stdTimeSec: 30, blockSize: 5, minAge: 7,
    generate: genDictation,
    offlineTip: 'Lista de compras ditada: a criança escreve 3 itens que você falar. Não corrija na hora; leiam juntos depois.',
  },
  {
    ...base, id: 'lei-d8-segmentacao', step: 'D8', title: 'Separar as palavras',
    bncc: ['EF01LP12', 'EF02LP01'], objective: 'Perceber a separação das palavras por espaços (evitar hipo e hipersegmentação).',
    techniques: ['Psicogênese', 'Ortografia reflexiva'], stdTimeSec: 20, blockSize: 6, minAge: 7,
    generate: genSegmentation,
    offlineTip: 'Fale uma frase e, para cada palavra, a criança coloca um feijão na mesa. Quantas palavras tinha?',
  },
  {
    ...base, id: 'lei-d8-ortografia', step: 'D8', title: 'Ortografia: R/RR, S/SS/Ç, M antes de P e B',
    bncc: ['EF03LP01', 'EF02LP05', 'EF02LP01'], objective: 'Escolher a grafia correta aplicando regras ortográficas.',
    techniques: ['Ortografia reflexiva', 'Fônico'], stdTimeSec: 15, blockSize: 6, minAge: 7,
    generate: (rng) => genSpelling(rng, ORTHO, true),
    offlineTip: 'Montem um cartaz de "regrinhas": antes de P e B, só M (TAMBOR, BOMBOM). Acrescentem exemplos a cada semana.',
  },
];

/** Grafemas conhecidos até a habilidade `skillId` (inclusive), seguindo a ordem da trilha. */
export function graphemesUpTo(skillId: string): Set<string> {
  const idx = LEITURA_SKILLS.findIndex((s) => s.id === skillId);
  if (idx < 0) throw new Error(`habilidade desconhecida: ${skillId}`);
  return new Set(LEITURA_SKILLS.slice(0, idx + 1).flatMap((s) => s.graphemes ?? []));
}
