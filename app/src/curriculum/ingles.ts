// Trilha INGLÊS (E0–E4) — som + imagem sem tradução (Kumon EFL), TPR, frases-padrão,
// shadowing, phonics (só a partir de ~6 anos) e pronúncia para falantes de PT-BR.
// Complementar: a BNCC de Língua Inglesa começa oficialmente no 6º ano (EF06LI..).
import { choose, en, hints, img, NUM_WORDS_EN, pt, tok, txt } from './helpers';
import type { ColorId, Item, Option, Rng, Say, Skill, Token } from './types';

// ---------- vocabulário (imagem → palavra em inglês) ----------

interface W { img: string; en: string; pl?: string }

const ANIMALS: W[] = [
  { img: 'cachorro', en: 'dog', pl: 'dogs' }, { img: 'gato', en: 'cat', pl: 'cats' }, { img: 'peixe', en: 'fish', pl: 'fish' },
  { img: 'passaro', en: 'bird', pl: 'birds' }, { img: 'vaca', en: 'cow', pl: 'cows' }, { img: 'porco', en: 'pig', pl: 'pigs' },
  { img: 'cavalo', en: 'horse', pl: 'horses' }, { img: 'pato', en: 'duck', pl: 'ducks' }, { img: 'leao', en: 'lion', pl: 'lions' },
  { img: 'elefante', en: 'elephant', pl: 'elephants' }, { img: 'macaco', en: 'monkey', pl: 'monkeys' }, { img: 'coelho', en: 'rabbit', pl: 'rabbits' },
  { img: 'urso', en: 'bear', pl: 'bears' }, { img: 'sapo', en: 'frog', pl: 'frogs' }, { img: 'ovelha', en: 'sheep', pl: 'sheep' },
  { img: 'galinha', en: 'chicken', pl: 'chickens' }, { img: 'tigre', en: 'tiger', pl: 'tigers' }, { img: 'zebra', en: 'zebra', pl: 'zebras' },
  { img: 'girafa', en: 'giraffe', pl: 'giraffes' }, { img: 'cobra', en: 'snake', pl: 'snakes' }, { img: 'tartaruga', en: 'turtle', pl: 'turtles' },
  { img: 'abelha', en: 'bee', pl: 'bees' }, { img: 'borboleta', en: 'butterfly', pl: 'butterflies' }, { img: 'pinguim', en: 'penguin', pl: 'penguins' },
  { img: 'coruja', en: 'owl', pl: 'owls' },
];

const FAMILY: W[] = [
  { img: 'mamae', en: 'mom' }, { img: 'papai', en: 'dad' }, { img: 'bebe', en: 'baby' }, { img: 'vovo_f', en: 'grandma' },
  { img: 'vovo_m', en: 'grandpa' }, { img: 'menino', en: 'boy' }, { img: 'menina', en: 'girl' }, { img: 'familia', en: 'family' },
];

const BODY: W[] = [
  { img: 'boca', en: 'mouth' }, { img: 'dente', en: 'tooth' }, { img: 'nariz', en: 'nose' }, { img: 'olho', en: 'eye' },
  { img: 'orelha', en: 'ear' }, { img: 'mao', en: 'hand' }, { img: 'pe', en: 'foot' }, { img: 'dedo', en: 'finger' },
];

const FOOD: W[] = [
  { img: 'maca', en: 'apple', pl: 'apples' }, { img: 'banana', en: 'banana', pl: 'bananas' }, { img: 'pao', en: 'bread', pl: 'bread' },
  { img: 'leite', en: 'milk', pl: 'milk' }, { img: 'queijo', en: 'cheese', pl: 'cheese' }, { img: 'ovo', en: 'egg', pl: 'eggs' },
  { img: 'bolo', en: 'cake', pl: 'cake' }, { img: 'sorvete', en: 'ice cream', pl: 'ice cream' }, { img: 'pizza', en: 'pizza', pl: 'pizza' },
  { img: 'uva', en: 'grapes', pl: 'grapes' }, { img: 'morango', en: 'strawberry', pl: 'strawberries' }, { img: 'laranja', en: 'orange', pl: 'oranges' },
  { img: 'cenoura', en: 'carrot', pl: 'carrots' }, { img: 'milho', en: 'corn', pl: 'corn' }, { img: 'biscoito', en: 'cookie', pl: 'cookies' },
  { img: 'pipoca', en: 'popcorn', pl: 'popcorn' }, { img: 'melancia', en: 'watermelon', pl: 'watermelon' }, { img: 'tomate', en: 'tomato', pl: 'tomatoes' },
  { img: 'chocolate', en: 'chocolate', pl: 'chocolate' }, { img: 'hamburguer', en: 'hamburger', pl: 'hamburgers' }, { img: 'suco', en: 'juice', pl: 'juice' },
];

const TOYS: W[] = [
  { img: 'bola', en: 'ball', pl: 'balls' }, { img: 'boneca', en: 'doll', pl: 'dolls' }, { img: 'ursinho', en: 'teddy bear', pl: 'teddy bears' },
  { img: 'pipa', en: 'kite', pl: 'kites' }, { img: 'robo', en: 'robot', pl: 'robots' }, { img: 'carro', en: 'car', pl: 'cars' },
  { img: 'balao', en: 'balloon', pl: 'balloons' }, { img: 'tambor', en: 'drum', pl: 'drums' }, { img: 'violao', en: 'guitar', pl: 'guitars' },
  { img: 'bicicleta', en: 'bike', pl: 'bikes' }, { img: 'trem', en: 'train', pl: 'trains' }, { img: 'barco', en: 'boat', pl: 'boats' },
  { img: 'foguete', en: 'rocket', pl: 'rockets' },
];

const ACTIONS: W[] = [
  { img: 'pular', en: 'jump' }, { img: 'bater_palmas', en: 'clap' }, { img: 'correr', en: 'run' }, { img: 'dormir', en: 'sleep' },
  { img: 'acenar', en: 'wave' }, { img: 'dancar', en: 'dance' }, { img: 'nadar', en: 'swim' }, { img: 'sentar', en: 'sit down' },
  { img: 'comer', en: 'eat' }, { img: 'rir', en: 'laugh' }, { img: 'chorar', en: 'cry' }, { img: 'cantar', en: 'sing' },
  { img: 'escrever', en: 'write' },
];

const COLORS_EN: Record<ColorId, string> = {
  vermelho: 'red', azul: 'blue', amarelo: 'yellow', verde: 'green', laranja: 'orange', roxo: 'purple',
  rosa: 'pink', marrom: 'brown', preto: 'black', branco: 'white',
};
const COLOR_IDS = Object.keys(COLORS_EN) as ColorId[];

/** Cognatos verdadeiros (parecem português). */
const COGNATES: W[] = [
  { img: 'banana', en: 'banana' }, { img: 'hospital', en: 'hospital' }, { img: 'chocolate', en: 'chocolate' }, { img: 'pizza', en: 'pizza' },
  { img: 'elefante', en: 'elephant' }, { img: 'girafa', en: 'giraffe' }, { img: 'zebra', en: 'zebra' }, { img: 'hamburguer', en: 'hamburger' },
  { img: 'robo', en: 'robot' }, { img: 'telefone', en: 'telephone' }, { img: 'tomate', en: 'tomato' }, { img: 'canguru', en: 'kangaroo' },
  { img: 'dinossauro', en: 'dinosaur' }, { img: 'hipopotamo', en: 'hippopotamus' }, { img: 'unicornio', en: 'unicorn' }, { img: 'tigre', en: 'tiger' },
  { img: 'camelo', en: 'camel' }, { img: 'pinguim', en: 'penguin' }, { img: 'rosa', en: 'rose' }, { img: 'vulcao', en: 'volcano' },
  { img: 'bicicleta', en: 'bicycle' }, { img: 'familia', en: 'family' }, { img: 'mapa', en: 'map' }, { img: 'sofa', en: 'sofa' },
  { img: 'cacto', en: 'cactus' }, { img: 'castelo', en: 'castle' },
];

/** Palavras CVC com figura que realmente mostra a palavra. */
const CVC: W[] = [
  { img: 'gato', en: 'cat' }, { img: 'cachorro', en: 'dog' }, { img: 'sol', en: 'sun' }, { img: 'onibus', en: 'bus' },
  { img: 'porco', en: 'pig' }, { img: 'chapeu', en: 'hat' }, { img: 'cama', en: 'bed' }, { img: 'raposa', en: 'fox' },
  { img: 'caixa', en: 'box' }, { img: 'galinha', en: 'hen' }, { img: 'morcego', en: 'bat' }, { img: 'mapa', en: 'map' },
  { img: 'caneta', en: 'pen' }, { img: 'van', en: 'van' }, { img: 'joaninha', en: 'bug' }, { img: 'leque', en: 'fan' },
  { img: 'teia', en: 'web' }, { img: 'rede', en: 'net' }, { img: 'xicara', en: 'cup' }, { img: 'lata', en: 'can' },
  { img: 'bone', en: 'cap' },
];

/** Palavras por letra inicial (para sons iniciais). */
const INITIALS: Record<string, W[]> = {
  b: [{ img: 'bola', en: 'ball' }, { img: 'onibus', en: 'bus' }, { img: 'cama', en: 'bed' }, { img: 'abelha', en: 'bee' }, { img: 'urso', en: 'bear' }, { img: 'passaro', en: 'bird' }, { img: 'banana', en: 'banana' }],
  c: [{ img: 'gato', en: 'cat' }, { img: 'xicara', en: 'cup' }, { img: 'carro', en: 'car' }, { img: 'bolo', en: 'cake' }, { img: 'vaca', en: 'cow' }],
  d: [{ img: 'cachorro', en: 'dog' }, { img: 'pato', en: 'duck' }, { img: 'boneca', en: 'doll' }, { img: 'tambor', en: 'drum' }],
  f: [{ img: 'peixe', en: 'fish' }, { img: 'raposa', en: 'fox' }, { img: 'leque', en: 'fan' }, { img: 'sapo', en: 'frog' }],
  h: [{ img: 'chapeu', en: 'hat' }, { img: 'galinha', en: 'hen' }, { img: 'cavalo', en: 'horse' }, { img: 'casa', en: 'house' }],
  m: [{ img: 'mapa', en: 'map' }, { img: 'macaco', en: 'monkey' }, { img: 'leite', en: 'milk' }, { img: 'lua', en: 'moon' }],
  p: [{ img: 'porco', en: 'pig' }, { img: 'caneta', en: 'pen' }, { img: 'pizza', en: 'pizza' }, { img: 'pinguim', en: 'penguin' }],
  s: [{ img: 'sol', en: 'sun' }, { img: 'meia', en: 'sock' }, { img: 'cobra', en: 'snake' }, { img: 'estrela', en: 'star' }],
  t: [{ img: 'tigre', en: 'tiger' }, { img: 'tomate', en: 'tomato' }, { img: 'trem', en: 'train' }, { img: 'arvore', en: 'tree' }, { img: 'tartaruga', en: 'turtle' }],
};

const SIGHT_WORDS = ['the', 'is', 'you', 'and', 'I', 'see', 'a', 'to', 'it', 'in', 'my', 'we', 'can', 'like', 'look', 'go', 'said', 'he', 'she', 'up', 'no', 'yes'];

/** Pares mínimos difíceis para brasileiros. */
const PAIRS: { a: { token: Token; en: string }; b: { token: Token; en: string }; tip: string }[] = [
  { a: { token: { kind: 'img', img: 'navio' }, en: 'ship' }, b: { token: { kind: 'img', img: 'ovelha' }, en: 'sheep' }, tip: 'ship é curtinho; sheep é comprido: shiiip.' },
  { a: { token: { kind: 'img', img: 'bone' }, en: 'cap' }, b: { token: { kind: 'img', img: 'xicara' }, en: 'cup' }, tip: 'cap tem boca bem aberta, quase "é"; cup soa como "â".' },
  { a: { token: { kind: 'dots', n: 3 }, en: 'three' }, b: { token: { kind: 'img', img: 'arvore' }, en: 'tree' }, tip: 'three começa com a língua entre os dentes, soprando.' },
  { a: { token: { kind: 'img', img: 'boca' }, en: 'mouth' }, b: { token: { kind: 'img', img: 'rato' }, en: 'mouse' }, tip: 'mouth termina com a língua entre os dentes; mouse termina com "s".' },
  { a: { token: { kind: 'img', img: 'chapeu' }, en: 'hat' }, b: { token: { kind: 'img', img: 'gato' }, en: 'cat' }, tip: 'O H inglês é só um sopro, como embaçar o espelho: hat.' },
  { a: { token: { kind: 'img', img: 'galinha' }, en: 'hen' }, b: { token: { kind: 'img', img: 'caneta' }, en: 'pen' }, tip: 'hen começa com um sopro; pen começa com os lábios fechados.' },
  { a: { token: { kind: 'img', img: 'leque' }, en: 'fan' }, b: { token: { kind: 'img', img: 'van' }, en: 'van' }, tip: 'fan sopra sem voz; van faz os dentes vibrarem no lábio.' },
  { a: { token: { kind: 'img', img: 'casa' }, en: 'house' }, b: { token: { kind: 'img', img: 'rato' }, en: 'mouse' }, tip: 'house começa com um sopro: h; mouse começa com os lábios fechados.' },
];

const TH_SPEAK: { text: string; token?: Token }[] = [
  { text: 'three', token: { kind: 'dots', n: 3 } },
  { text: 'mouth', token: { kind: 'img', img: 'boca' } },
  { text: 'thank you' },
  { text: 'this is my dad', token: { kind: 'img', img: 'papai' } },
  { text: 'hello', token: { kind: 'img', img: 'acenar' } },
  { text: 'house', token: { kind: 'img', img: 'casa' } },
  { text: 'happy', token: { kind: 'img', img: 'feliz' } },
];

// ---------- apoio ----------

const art = (w: string) => (/^[aeiou]/.test(w) ? 'an' : 'a');
const wOpt = (w: W): Option => img(w.img, en(w.en));

/** "Toque na figura: dog" — escolha 1 figura entre 3 (ou 4), mesmo tema. */
function vocabItem(rng: Rng, pool: W[], prompt: (w: W) => Say[], n = 3, visual?: Item['visual']): Item {
  const [t, ...others] = rng.sample(pool, n);
  return choose(
    rng,
    prompt(t),
    wOpt(t),
    others.map(wOpt),
    hints([pt('Escute de novo:'), en(t.en)], [en(t.en, true), pt('Toque em cada figura e escute.')], [en(t.en), pt('É esta!')]),
    visual ? { visual } : {},
  );
}

const touchPrompt = (w: W): Say[] => [pt('Toque na figura:'), en(w.en)];

// ---------- mini-histórias (E4) ----------

interface Story {
  text: string;
  questions: { q: string; answer: Option; wrong: Option[] }[];
}

const c = (color: ColorId): Option => tok({ kind: 'color', color }, en(COLORS_EN[color]));
const im = (key: string, word: string): Option => img(key, en(word));

const STORIES: Story[] = [
  {
    text: 'Sam has a cat. The cat is black. The cat can run.',
    questions: [
      { q: 'What does Sam have?', answer: im('gato', 'a cat'), wrong: [im('cachorro', 'a dog'), im('peixe', 'a fish')] },
      { q: 'What color is the cat?', answer: c('preto'), wrong: [c('branco'), c('laranja')] },
    ],
  },
  {
    text: 'I see a red bus. The bus is big. I like the bus!',
    questions: [
      { q: 'What do I see?', answer: im('onibus', 'a bus'), wrong: [im('carro', 'a car'), im('trem', 'a train')] },
      { q: 'What color is the bus?', answer: c('vermelho'), wrong: [c('azul'), c('amarelo')] },
    ],
  },
  {
    text: 'Pam has a pet. It is a fish. It can swim.',
    questions: [
      { q: 'What is the pet?', answer: im('peixe', 'a fish'), wrong: [im('pato', 'a duck'), im('gato', 'a cat')] },
      { q: 'What can it do?', answer: im('nadar', 'swim'), wrong: [im('correr', 'run'), im('pular', 'jump')] },
    ],
  },
  {
    text: 'Ben is a boy. He has a dog. The dog can jump.',
    questions: [
      { q: 'Who is Ben?', answer: im('menino', 'a boy'), wrong: [im('menina', 'a girl'), im('bebe', 'a baby')] },
      { q: 'What can the dog do?', answer: im('pular', 'jump'), wrong: [im('dormir', 'sleep'), im('nadar', 'swim')] },
    ],
  },
  {
    text: 'It is hot. The sun is up. We eat ice cream.',
    questions: [
      { q: 'What is up?', answer: im('sol', 'the sun'), wrong: [im('lua', 'the moon'), im('nuvem', 'a cloud')] },
      { q: 'What do we eat?', answer: im('sorvete', 'ice cream'), wrong: [im('bolo', 'cake'), im('pizza', 'pizza')] },
    ],
  },
  {
    text: 'Mom and Dad dance. The baby is in bed. The baby can sleep.',
    questions: [
      { q: 'What can the baby do?', answer: im('dormir', 'sleep'), wrong: [im('dancar', 'dance'), im('correr', 'run')] },
      { q: 'Where is the baby?', answer: im('cama', 'in bed'), wrong: [im('sofa', 'on the sofa'), im('carro', 'in the car')] },
    ],
  },
  {
    text: 'Tom has a red ball and a blue kite. He can run.',
    questions: [
      { q: 'What color is the kite?', answer: c('azul'), wrong: [c('vermelho'), c('verde')] },
      { q: 'What does Tom have?', answer: im('pipa', 'a kite'), wrong: [im('carro', 'a car'), im('trem', 'a train')] },
    ],
  },
  {
    text: 'Look! A big green frog. The frog is in the pond. It can jump.',
    questions: [
      { q: 'What is it?', answer: im('sapo', 'a frog'), wrong: [im('tartaruga', 'a turtle'), im('peixe', 'a fish')] },
      { q: 'What color is the frog?', answer: c('verde'), wrong: [c('marrom'), c('rosa')] },
    ],
  },
];

// ---------- habilidades ----------

const OBJ_E0 = 'Complementar (BNCC Inglês a partir do 6º ano).';

export const INGLES_SKILLS: Skill[] = [
  // ===== E0 — Som e imagem =====
  {
    id: 'ing-e0-animais',
    track: 'ingles',
    step: 'E0',
    title: 'Animals — animais (som + imagem)',
    bncc: ['EI03EF01', 'EF06LI17'],
    objective: `Reconhecer nomes de animais em inglês só pelo som, associando à figura, sem tradução. ${OBJ_E0}`,
    techniques: ['Som + imagem', 'Imersão auditiva'],
    stdTimeSec: 5,
    blockSize: 6,
    minAge: 4,
    offlineTip: 'Brinquem de "What animal?": imite um bicho e a criança diz o nome em inglês (dog, cat, cow…).',
    generate: (rng) => vocabItem(rng, ANIMALS, touchPrompt),
  },
  {
    id: 'ing-e0-cores',
    track: 'ingles',
    step: 'E0',
    title: 'Colors — cores',
    bncc: ['EI03EF01', 'EF06LI17'],
    objective: `Reconhecer as cores em inglês pelo som. ${OBJ_E0}`,
    techniques: ['Som + imagem', 'CLIL'],
    stdTimeSec: 4,
    blockSize: 6,
    minAge: 4,
    offlineTip: 'Jogo "I spy something red!": procurem pela casa objetos da cor falada em inglês.',
    generate(rng) {
      const [t, ...others] = rng.sample(COLOR_IDS, rng.next() < 0.5 ? 3 : 4);
      return choose(
        rng,
        [pt('Toque na cor:'), en(COLORS_EN[t])],
        tok({ kind: 'color', color: t }, en(COLORS_EN[t])),
        others.map((o) => tok({ kind: 'color', color: o }, en(COLORS_EN[o]))),
        hints([pt('Escute de novo:'), en(COLORS_EN[t])], [en(COLORS_EN[t], true), pt('Toque nas cores e escute cada uma.')], [en(COLORS_EN[t]), pt('É esta cor!')]),
      );
    },
  },
  {
    id: 'ing-e0-numeros',
    track: 'ingles',
    step: 'E0',
    title: 'Numbers 1–10 — números',
    bncc: ['EI03ET07', 'EF06LI17'],
    objective: `Reconhecer os números de 1 a 10 falados em inglês, associando à quantidade. ${OBJ_E0}`,
    techniques: ['Som + imagem', 'Subitização', 'CLIL'],
    stdTimeSec: 5,
    blockSize: 6,
    minAge: 4,
    offlineTip: 'Contem os degraus da escada ou os dedos em inglês: one, two, three…',
    generate(rng) {
      const [t, ...others] = rng.sample([1, 2, 3, 4, 5, 6, 7, 8, 9, 10], 3);
      const w = NUM_WORDS_EN[t];
      return choose(
        rng,
        [pt('Toque nos pontinhos:'), en(w)],
        tok({ kind: 'dots', n: t }, en(w)),
        others.map((n) => tok({ kind: 'dots', n }, en(NUM_WORDS_EN[n]))),
        hints([pt('Escute de novo:'), en(w)], [pt('Vamos contar:'), en(NUM_WORDS_EN.slice(1, t + 1).join(', '))], [en(w), pt(`É o ${t}!`)]),
      );
    },
  },
  {
    id: 'ing-e0-familia',
    track: 'ingles',
    step: 'E0',
    title: 'Family — família',
    bncc: ['EI03EF01', 'EF06LI17'],
    objective: `Reconhecer membros da família em inglês (mom, dad, baby, grandma…). ${OBJ_E0}`,
    techniques: ['Som + imagem'],
    stdTimeSec: 5,
    blockSize: 6,
    minAge: 4,
    offlineTip: 'Olhem fotos da família e digam: "This is mom! This is grandpa!"',
    generate: (rng) => vocabItem(rng, FAMILY, touchPrompt),
  },
  {
    id: 'ing-e0-corpo',
    track: 'ingles',
    step: 'E0',
    title: 'My body — partes do corpo',
    bncc: ['EI03CG01', 'EF06LI17'],
    objective: `Reconhecer partes do corpo em inglês (nose, eye, hand…). ${OBJ_E0}`,
    techniques: ['Som + imagem'],
    stdTimeSec: 5,
    blockSize: 6,
    minAge: 4,
    offlineTip: 'Cantem "Head, shoulders, knees and toes" tocando cada parte do corpo.',
    generate: (rng) => vocabItem(rng, BODY, touchPrompt),
  },
  {
    id: 'ing-e0-comida',
    track: 'ingles',
    step: 'E0',
    title: 'Food — comidas',
    bncc: ['EI03EF01', 'EF06LI17'],
    objective: `Reconhecer nomes de comidas e frutas em inglês. ${OBJ_E0}`,
    techniques: ['Som + imagem'],
    stdTimeSec: 5,
    blockSize: 6,
    minAge: 4,
    offlineTip: 'Na hora do lanche, nomeiem em inglês: "apple", "bread", "milk". A criança pede "milk, please!"',
    generate: (rng) => vocabItem(rng, FOOD, touchPrompt, rng.next() < 0.5 ? 3 : 4),
  },
  {
    id: 'ing-e0-brinquedos',
    track: 'ingles',
    step: 'E0',
    title: 'Toys — brinquedos',
    bncc: ['EI03EF01', 'EF06LI17'],
    objective: `Reconhecer nomes de brinquedos em inglês. ${OBJ_E0}`,
    techniques: ['Som + imagem'],
    stdTimeSec: 5,
    blockSize: 6,
    minAge: 4,
    offlineTip: 'Na hora de guardar: "Where is the ball? Where is the doll?" A criança acha e guarda.',
    generate: (rng) => vocabItem(rng, TOYS, touchPrompt, rng.next() < 0.5 ? 3 : 4),
  },
  {
    id: 'ing-e0-repetir',
    track: 'ingles',
    step: 'E0',
    title: 'Listen and repeat — ouvir e repetir (shadowing)',
    bncc: ['EI03EF01', 'EF06LI01'],
    objective: `Repetir em voz alta, logo após o áudio, palavras e expressões curtas (shadowing). ${OBJ_E0}`,
    techniques: ['Shadowing', 'Som + imagem'],
    stdTimeSec: 6,
    blockSize: 6,
    minAge: 4,
    offlineTip: 'Brinquem de "papagaio": um fala uma palavra em inglês e o outro repete igualzinho, depois trocam.',
    generate(rng) {
      if (rng.next() < 0.3) {
        const p = rng.pick([
          { text: 'Hello!', img: 'acenar' }, { text: 'Good night!', img: 'lua' }, { text: 'Thank you!', img: 'coracao' },
          { text: 'I am happy!', img: 'feliz' }, { text: 'Good morning!', img: 'sol' }, { text: 'Bye bye!', img: 'acenar' },
        ]);
        return {
          kind: 'speak', expect: p.text, lang: 'en',
          prompt: [pt('Escute e repita:'), en(p.text)],
          visual: { type: 'token', token: { kind: 'img', img: p.img }, big: true },
          hints: hints([pt('Escute de novo:'), en(p.text)], [pt('Devagar:'), en(p.text, true)], [pt('Agora junto comigo:'), en(p.text)]),
        };
      }
      const w = rng.pick([...ANIMALS, ...FOOD, ...TOYS, ...BODY]);
      return {
        kind: 'speak', expect: w.en, lang: 'en',
        prompt: [pt('Escute e repita:'), en(w.en)],
        visual: { type: 'token', token: { kind: 'img', img: w.img }, big: true },
        hints: hints([pt('Escute de novo:'), en(w.en)], [pt('Devagar:'), en(w.en, true)], [pt('Agora junto comigo:'), en(w.en)]),
      };
    },
  },

  // ===== E1 — TPR =====
  {
    id: 'ing-e1-acoes',
    track: 'ingles',
    step: 'E1',
    title: 'Actions — comandos de ação (TPR)',
    bncc: ['EI03CG01', 'EI03CG02', 'EF06LI17'],
    objective: `Compreender comandos de ação (jump, clap, run, sit down…) respondendo com o corpo e tocando na figura. ${OBJ_E0}`,
    techniques: ['TPR', 'Som + imagem'],
    stdTimeSec: 5,
    blockSize: 6,
    minAge: 4,
    offlineTip: 'Brinquem de "Simon says": "Simon says jump! Simon says clap!" Todos fazem a ação.',
    generate: (rng) =>
      vocabItem(rng, ACTIONS, (w) => [en(`${w.en[0].toUpperCase()}${w.en.slice(1)}!`), pt('Faça junto e toque na figura.')], rng.next() < 0.5 ? 3 : 4),
  },
  {
    id: 'ing-e1-toque-corpo',
    track: 'ingles',
    step: 'E1',
    title: 'Touch your nose! — comandos com o corpo (TPR)',
    bncc: ['EI03CG01', 'EI03CG02', 'EF06LI17'],
    objective: `Compreender "Touch your…" e localizar a parte do corpo. ${OBJ_E0}`,
    techniques: ['TPR', 'Som + imagem'],
    stdTimeSec: 5,
    blockSize: 6,
    minAge: 4,
    offlineTip: 'Façam "Touch your…" em frente ao espelho, cada vez mais rápido. Depois a criança comanda!',
    generate: (rng) => vocabItem(rng, BODY.filter((b) => b.en !== 'tooth'), (w) => [en(`Touch your ${w.en}!`), pt('Toque no seu e na figura.')]),
  },

  // ===== E2 — Frases-padrão =====
  {
    id: 'ing-e2-frases',
    track: 'ingles',
    step: 'E2',
    title: 'This is a… / I like… / I have…',
    bncc: ['EI03EF01', 'EF06LI05', 'EF06LI17'],
    objective: `Compreender frases-padrão curtas e identificar a figura correspondente. ${OBJ_E0}`,
    techniques: ['Frases-padrão', 'Som + imagem', 'Histórias repetitivas'],
    stdTimeSec: 6,
    blockSize: 6,
    minAge: 5,
    offlineTip: 'Mostrem objetos e digam "This is a ball. I like the ball!" A criança repete com outro objeto.',
    generate(rng) {
      const kind = rng.int(0, 2);
      if (kind === 0) {
        const pool = rng.pick([ANIMALS, TOYS]);
        return vocabItem(rng, pool, (w) => [en(`This is ${art(w.en)} ${w.en}.`), pt('Qual é a figura?')]);
      }
      if (kind === 1) {
        return vocabItem(rng, FOOD, (w) => [en(`I like ${w.pl}!`), pt('Do que eu gosto?')]);
      }
      return vocabItem(rng, TOYS, (w) => [en(`I have ${art(w.en)} ${w.en}.`), pt('O que eu tenho?')]);
    },
  },
  {
    id: 'ing-e2-what-color',
    track: 'ingles',
    step: 'E2',
    title: 'What color is it?',
    bncc: ['EF06LI01', 'EF06LI17'],
    objective: `Responder à pergunta "What color is it?" escolhendo a cor certa. ${OBJ_E0}`,
    techniques: ['Frases-padrão', 'CLIL'],
    stdTimeSec: 5,
    blockSize: 6,
    minAge: 5,
    offlineTip: 'Apontem objetos e perguntem "What color is it?". Quem acertar faz a próxima pergunta.',
    generate(rng) {
      const [t, ...others] = rng.sample(COLOR_IDS, 3);
      const sh = rng.pick(['circulo', 'quadrado', 'estrela', 'coracao', 'triangulo'] as const);
      return choose(
        rng,
        [en('What color is it?')],
        tok({ kind: 'color', color: t }, en(COLORS_EN[t])),
        others.map((o) => tok({ kind: 'color', color: o }, en(COLORS_EN[o]))),
        hints([pt('Olhe a figura. Que cor ela tem?')], [en('Is it'), en(`${COLORS_EN[t]}?`)], [en(`It is ${COLORS_EN[t]}.`)]),
        { visual: { type: 'token', token: { kind: 'shape', shape: sh, color: t }, big: true } },
      );
    },
  },
  {
    id: 'ing-e2-how-many',
    track: 'ingles',
    step: 'E2',
    title: 'How many…?',
    bncc: ['EI03ET07', 'EF06LI01', 'EF06LI17'],
    objective: `Compreender "How many…?" e responder com a quantidade, contando em inglês. ${OBJ_E0}`,
    techniques: ['Frases-padrão', 'CLIL', 'Subitização'],
    stdTimeSec: 7,
    blockSize: 6,
    minAge: 5,
    offlineTip: 'Na rua: "How many cars? How many dogs?" Contem juntos em inglês.',
    generate(rng) {
      const w = rng.pick([...ANIMALS.filter((a) => a.pl !== a.en), ...FOOD.filter((f) => ['apples', 'bananas', 'eggs', 'cookies', 'carrots'].includes(f.pl!)), ...TOYS.slice(0, 7)]);
      const n = rng.int(1, 10);
      const others = rng.sample([1, 2, 3, 4, 5, 6, 7, 8, 9, 10].filter((x) => x !== n && Math.abs(x - n) <= 3), 2);
      const pl = w.pl!;
      return choose(
        rng,
        [en(`How many ${pl}?`)],
        tok({ kind: 'dots', n }, en(NUM_WORDS_EN[n])),
        others.map((x) => tok({ kind: 'dots', n: x }, en(NUM_WORDS_EN[x]))),
        hints([pt('Conte em inglês, tocando em cada um.')], [en(NUM_WORDS_EN.slice(1, n + 1).join(', '))], [en(`${NUM_WORDS_EN[n]}!`)]),
        { visual: { type: 'objects', img: w.img, n } },
      );
    },
  },
  {
    id: 'ing-e2-cognatos',
    track: 'ingles',
    step: 'E2',
    title: 'Cognatos — palavras parecidas com o português',
    bncc: ['EF06LI04', 'EF06LI17'],
    objective: `Usar cognatos (banana, hospital, elephant…) como ponte entre português e inglês. ${OBJ_E0}`,
    techniques: ['Cognatos', 'Som + imagem'],
    stdTimeSec: 5,
    blockSize: 6,
    minAge: 5,
    offlineTip: 'Façam uma lista de "palavras gêmeas" (chocolate, pizza, hospital) e falem com sotaque inglês!',
    generate: (rng) => vocabItem(rng, COGNATES, (w) => [pt('Parece português! Toque:'), en(w.en)]),
  },

  // ===== E3 — Phonics (6+) =====
  {
    id: 'ing-e3-letra-inicial',
    track: 'ingles',
    step: 'E3',
    title: 'Phonics: letra inicial',
    bncc: ['EF06LI18'],
    objective: `Relacionar a letra inicial ao começo da palavra falada em inglês (após decodificar em PT-BR). ${OBJ_E0}`,
    techniques: ['Phonics', 'Som + imagem'],
    stdTimeSec: 7,
    blockSize: 6,
    minAge: 6,
    offlineTip: 'Escolham uma letra (B) e caço objetos em inglês: ball, book, bed… Quem acha mais?',
    generate(rng) {
      const [l, l2, l3] = rng.sample(Object.keys(INITIALS), 3);
      const t = rng.pick(INITIALS[l]);
      const w1 = rng.pick(INITIALS[l2]);
      const w2 = rng.pick(INITIALS[l3].filter((w) => w.img !== w1.img && w.img !== t.img));
      return choose(
        rng,
        [pt('Qual palavra começa com a letra'), en(l.toUpperCase())],
        wOpt(t),
        [wOpt(w1), wOpt(w2)],
        hints('Toque em cada figura e escute o primeiro som.', [en(`${l.toUpperCase()}… ${t.en}`, true)], [en(t.en), pt(`começa com ${l.toUpperCase()}!`)]),
        { visual: { type: 'token', token: { kind: 'text', text: `${l.toUpperCase()} ${l}`, lang: 'en' }, big: true } },
      );
    },
  },
  {
    id: 'ing-e3-cvc',
    track: 'ingles',
    step: 'E3',
    title: 'Phonics: montar palavras CVC (cat, dog, sun)',
    bncc: ['EF06LI18'],
    objective: `Segmentar e montar palavras consoante-vogal-consoante em inglês (blending). ${OBJ_E0}`,
    techniques: ['Phonics', 'Alfabeto móvel'],
    stdTimeSec: 15,
    blockSize: 5,
    minAge: 6,
    offlineTip: 'Com letras de papel, montem cat → hat → bat → bed. Troque uma letra e leiam juntos.',
    generate(rng) {
      const w = rng.pick(CVC);
      const letters = w.en.split('');
      const extras = rng.sample('abcdefghilmnoprstuw'.split('').filter((x) => !letters.includes(x)), rng.int(2, 3));
      const item: Item = {
        kind: 'build',
        solution: letters,
        tiles: rng.shuffle([...letters, ...extras]),
        img: w.img,
        lang: 'en',
        prompt: [pt('Monte a palavra:'), en(w.en)],
        hints: hints(
          [pt('Escute os sons:'), en(letters.join('… '), true)],
          [pt('Primeiro som:'), en(letters[0], true), pt('depois'), en(letters.slice(1).join(' '), true)],
          [en(w.en), pt(`: ${letters.join(' - ')}`)],
        ),
      };
      return item;
    },
  },
  {
    id: 'ing-e3-sight-words',
    track: 'ingles',
    step: 'E3',
    title: 'Sight words (Dolch pré-primer/primer)',
    bncc: ['EF06LI18'],
    objective: `Reconhecer de relance palavras muito frequentes (the, is, you, and…). ${OBJ_E0}`,
    techniques: ['Sight words', 'Fluência (tempo-padrão)'],
    stdTimeSec: 5,
    blockSize: 7,
    minAge: 6,
    offlineTip: 'Escreva 5 sight words em cartões e esconda pela casa. Ao achar, a criança lê em voz alta.',
    generate(rng) {
      const [t, ...others] = rng.sample(SIGHT_WORDS, rng.next() < 0.5 ? 3 : 4);
      return choose(
        rng,
        [pt('Toque na palavra:'), en(t)],
        txt(t, 'en', en(t)),
        others.map((o) => txt(o, 'en', en(o))),
        hints([pt('Escute de novo:'), en(t)], [pt('Ela começa com a letra'), en(t[0].toUpperCase())], [en(t), pt('é esta palavra.')]),
      );
    },
  },
  {
    id: 'ing-e3-pronuncia',
    track: 'ingles',
    step: 'E3',
    title: 'Pronúncia para brasileiros (TH, H, vogais curtas e longas)',
    bncc: ['EF06LI18'],
    objective: `Discriminar e produzir sons difíceis para falantes de PT-BR (ship/sheep, three/tree, hat/rat). ${OBJ_E0}`,
    techniques: ['Pares mínimos', 'Shadowing', 'Som + imagem'],
    stdTimeSec: 6,
    blockSize: 6,
    minAge: 6,
    offlineTip: 'Brinquem de soprar uma vela com o H de "hat" e de pôr a língua entre os dentes no TH de "three".',
    generate(rng) {
      if (rng.next() < 0.25) {
        const s = rng.pick(TH_SPEAK);
        const isTh = s.text.includes('th');
        const item: Item = {
          kind: 'speak', expect: s.text, lang: 'en',
          prompt: [pt('Escute e repita:'), en(s.text)],
          ...(s.token ? { visual: { type: 'token', token: s.token, big: true } } : {}),
          hints: hints(
            [pt('Escute de novo:'), en(s.text, true)],
            isTh ? 'No TH, ponha a pontinha da língua entre os dentes e sopre.' : 'O H inglês é só um sopro, como embaçar um espelho.',
            [pt('Agora junto comigo:'), en(s.text)],
          ),
        };
        return item;
      }
      const p = rng.pick(PAIRS);
      const target = rng.next() < 0.5 ? p.a : p.b;
      const other = target === p.a ? p.b : p.a;
      return choose(
        rng,
        [pt('Qual você ouviu?'), en(target.en)],
        tok(target.token, en(target.en)),
        [tok(other.token, en(other.en))],
        hints([pt('Escute com atenção:'), en(target.en, true)], [pt(p.tip)], [en(target.en), pt('é esta figura.')]),
      );
    },
  },

  // ===== E4 — Leitura =====
  {
    id: 'ing-e4-frases',
    track: 'ingles',
    step: 'E4',
    title: 'Ler frases curtas e achar a figura',
    bncc: ['EF06LI08', 'EF06LI09'],
    objective: `Ler sozinho frases curtas com palavras conhecidas e mostrar a compreensão com figuras. ${OBJ_E0}`,
    techniques: ['Leitura', 'Frases-padrão', 'Som + imagem'],
    stdTimeSec: 10,
    blockSize: 6,
    minAge: 6,
    offlineTip: 'Escrevam bilhetinhos em inglês ("I see a cat") e a criança desenha o que leu.',
    generate(rng) {
      const pool = rng.pick([ANIMALS, TOYS, FOOD.filter((f) => ['apple', 'banana', 'egg', 'cake', 'pizza', 'orange', 'carrot', 'cookie', 'tomato', 'hamburger', 'watermelon', 'strawberry'].includes(f.en))]);
      const [t, ...others] = rng.sample(pool, 3);
      const tpl = rng.pick([
        (w: string) => `I see ${art(w)} ${w}.`,
        (w: string) => `The ${w} is big.`,
        (w: string) => `This is my ${w}.`,
        (w: string) => `Look at the ${w}!`,
        (w: string) => `I like the ${w}.`,
      ]);
      const sentence = tpl(t.en);
      return choose(
        rng,
        [pt('Leia a frase e toque na figura.')],
        wOpt(t),
        others.map(wOpt),
        hints('Procure na frase a palavra que é uma coisa ou um bicho.', [pt('Escute a frase:'), en(sentence)], [en(t.en), pt('— é esta figura.')]),
        { visual: { type: 'token', token: { kind: 'text', text: sentence, lang: 'en' }, big: true } },
      );
    },
  },
  {
    id: 'ing-e4-leitura',
    track: 'ingles',
    step: 'E4',
    title: 'Mini-histórias: ler e compreender',
    bncc: ['EF06LI08', 'EF06LI09', 'EF06LI12'],
    objective: `Ler mini-histórias de 2–3 frases e responder a perguntas de compreensão com figuras. ${OBJ_E0}`,
    techniques: ['Leitura', 'Compreensão', 'Histórias repetitivas'],
    stdTimeSec: 20,
    blockSize: 5,
    minAge: 7,
    offlineTip: 'Leiam juntos um livrinho bem simples em inglês e perguntem "Who? What? What color?" apontando as figuras.',
    generate(rng) {
      const s = rng.pick(STORIES);
      const q = rng.pick(s.questions);
      return choose(
        rng,
        [pt('Leia a historinha.'), en(q.q)],
        q.answer,
        q.wrong,
        hints([pt('Leia de novo, devagar. A pergunta é:'), en(q.q)], [pt('Escute a história:'), en(s.text)], [pt('A resposta está aqui!')]),
        { visual: { type: 'token', token: { kind: 'text', text: s.text, lang: 'en' }, big: true } },
      );
    },
  },
];
