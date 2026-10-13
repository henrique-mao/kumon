// Biblioteca graduada de livros decodificáveis.
// Livros em português: cada palavra é decodificável com os grafemas ensinados até a habilidade
// `level` (inclusive) — ou está na lista de palavras de alta frequência (HIGH_FREQ_WORDS em
// graphemes.ts: é, e, o, a, os, as, do, da, no, na, um, uma, de, em, com, que, ele, ela...).
// Isso é verificado em leitura.test.ts.
import type { Book } from './types';

export const BOOKS: Book[] = [
  {
    id: 'livro-mala-vovo',
    title: 'A mala da vovó',
    level: 'lei-d2-ler-palavras',
    lang: 'pt',
    pages: [
      { text: 'Olá! É a vovó.', img: 'vovo_f' },
      { text: 'A vovó ama a mala.', img: 'mala' },
      { text: 'Na mala, uma luva.', img: 'luva' },
      { text: 'E uma meia!', img: 'meia' },
      { text: 'A vovó ama a luva e a meia.', img: 'vovo_f' },
    ],
    questions: [
      { q: 'O que a vovó ama?', options: [{ text: 'A mala', img: 'mala' }, { text: 'A bola', img: 'bola' }, { text: 'O bolo', img: 'bolo' }], answer: 0, kind: 'literal' },
      { q: 'O que tinha na mala?', options: [{ text: 'Um sapo', img: 'sapo' }, { text: 'Uma luva', img: 'luva' }, { text: 'Uma pipa', img: 'pipa' }], answer: 1, kind: 'literal' },
      { q: 'Para que a vovó vai usar a mala?', options: [{ text: 'Para viajar' }, { text: 'Para nadar' }, { text: 'Para dormir' }], answer: 0, kind: 'inferencial' },
    ],
    dialogic: [
      'O que mais você colocaria na mala da vovó?',
      'Aponte a luva e a meia. Para que servem?',
      'Para onde você acha que a vovó vai viajar?',
    ],
  },
  {
    id: 'livro-sapo-sino',
    title: 'O sapo e o sino',
    level: 'lei-d3-p-b-t-d',
    lang: 'pt',
    pages: [
      { text: 'O sapo pula.', img: 'sapo' },
      { text: 'O sapo viu o sino.', img: 'sino' },
      { text: 'O sino bate, bate.', img: 'sino' },
      { text: 'O sapo pula de medo.', img: 'sapo' },
      { text: 'Pula, sapo, pula!', img: 'sapo' },
    ],
    questions: [
      { q: 'Quem pula?', options: [{ text: 'O pato', img: 'pato' }, { text: 'O sapo', img: 'sapo' }, { text: 'O gato', img: 'gato' }], answer: 1, kind: 'literal' },
      { q: 'Por que o sapo pulou?', options: [{ text: 'Ficou com medo do sino.' }, { text: 'Estava com fome.' }, { text: 'Queria dormir.' }], answer: 0, kind: 'inferencial' },
      { q: 'O que aconteceu depois que o sino bateu?', options: [{ text: 'O sapo dormiu.' }, { text: 'O sapo pulou de medo.' }, { text: 'O sino caiu.' }], answer: 1, kind: 'sequencia' },
    ],
    dialogic: [
      'Que barulho o sino faz? Vamos imitar!',
      'Você já levou um susto com um barulho alto?',
      'Pule como o sapo!',
    ],
  },
  {
    id: 'livro-vaca-uva',
    title: 'A vaca e a uva',
    level: 'lei-d3-c-qu-g-gu',
    lang: 'pt',
    pages: [
      { text: 'A vaca é Mimi.', img: 'vaca' },
      { text: 'Mimi viu uma uva.', img: 'uva' },
      { text: 'A uva é da Mimi?', img: 'uva' },
      { text: 'Mimi come a uva toda.', img: 'vaca' },
      { text: 'Que gula, Mimi!', img: 'vaca' },
    ],
    questions: [
      { q: 'Qual é o nome da vaca?', options: [{ text: 'Lili' }, { text: 'Mimi' }, { text: 'Dudu' }], answer: 1, kind: 'literal' },
      { q: 'O que Mimi comeu?', options: [{ text: 'Banana', img: 'banana' }, { text: 'Uva', img: 'uva' }, { text: 'Bolo', img: 'bolo' }], answer: 1, kind: 'literal' },
      { q: 'Como Mimi ficou depois de comer?', options: [{ text: 'Com a barriga cheia' }, { text: 'Com muita fome' }, { text: 'Com frio' }], answer: 0, kind: 'inferencial' },
    ],
    dialogic: [
      'Que fruta você mais gosta de comer?',
      'O que quer dizer "gula"?',
      'Que barulho a vaca faz?',
    ],
  },
  {
    id: 'livro-rato-roda',
    title: 'O rato e a roda',
    level: 'lei-d3-r',
    lang: 'pt',
    pages: [
      { text: 'O rato Rui viu uma roda.', img: 'rato' },
      { text: 'A roda é bonita.', img: 'roda' },
      { text: 'Rui rola a roda.', img: 'roda' },
      { text: 'A roda rola, rola...', img: 'roda' },
      { text: 'E o rato Rui ri muito!', img: 'rato' },
    ],
    questions: [
      { q: 'Quem viu a roda?', options: [{ text: 'O rato', img: 'rato' }, { text: 'O gato', img: 'gato' }, { text: 'O galo', img: 'galo' }], answer: 0, kind: 'literal' },
      { q: 'Como Rui ficou no final?', options: [{ text: 'Triste', img: 'triste' }, { text: 'Feliz', img: 'feliz' }, { text: 'Bravo', img: 'bravo' }], answer: 1, kind: 'inferencial' },
      { q: 'O que Rui fez com a roda?', options: [{ text: 'Rolou a roda.' }, { text: 'Comeu a roda.' }, { text: 'Escondeu a roda.' }], answer: 0, kind: 'sequencia' },
    ],
    dialogic: [
      'Que outras coisas têm rodas?',
      'Por que Rui riu tanto?',
      'Do que você gosta de brincar?',
    ],
  },
  {
    id: 'livro-galo-galinha',
    title: 'O galo e a galinha',
    level: 'lei-d4-ch-lh-nh',
    lang: 'pt',
    pages: [
      { text: 'O galo diz: cocoricó!', img: 'galo' },
      { text: 'A galinha bota um ovo.', img: 'ovo' },
      { text: 'O ovo fica no ninho.', img: 'ninho' },
      { text: 'Piu, piu! Olha o filhote!', img: 'pintinho' },
      { text: 'O galo, a galinha e o filhote.', img: 'galinha' },
    ],
    questions: [
      { q: 'Onde ficou o ovo?', options: [{ text: 'No ninho', img: 'ninho' }, { text: 'Na cama', img: 'cama' }, { text: 'Na caixa', img: 'caixa' }], answer: 0, kind: 'literal' },
      { q: 'Quem saiu do ovo?', options: [{ text: 'Um gato', img: 'gato' }, { text: 'Um pintinho', img: 'pintinho' }, { text: 'Um peixe', img: 'peixe' }], answer: 1, kind: 'inferencial' },
      { q: 'O que veio primeiro na história?', options: [{ text: 'O filhote piou.' }, { text: 'A galinha botou um ovo.' }, { text: 'O ovo ficou no ninho.' }], answer: 1, kind: 'sequencia' },
    ],
    dialogic: [
      'Como o galo canta? E o pintinho?',
      'O que você acha que tem dentro de um ovo?',
      'Quem cuida do filhote?',
    ],
  },
  {
    id: 'livro-chuva-chinelo',
    title: 'A chuva e o chinelo',
    level: 'lei-d4-rr-ss',
    lang: 'pt',
    pages: [
      { text: 'Chove muito.', img: 'chuva' },
      { text: 'Lia pega o chinelo.', img: 'chinelo' },
      { text: 'O chinelo molha na chuva.', img: 'chuva' },
      { text: 'Lia corre para o carro.', img: 'carro' },
      { text: 'No carro, o chinelo seca.', img: 'chinelo' },
    ],
    questions: [
      { q: 'O que Lia pegou?', options: [{ text: 'A bota', img: 'bota' }, { text: 'O chinelo', img: 'chinelo' }, { text: 'O boné', img: 'bone' }], answer: 1, kind: 'literal' },
      { q: 'Por que o chinelo molhou?', options: [{ text: 'Por causa da chuva.' }, { text: 'Caiu no mar.' }, { text: 'Caiu no suco.' }], answer: 0, kind: 'inferencial' },
      { q: 'Para onde Lia correu?', options: [{ text: 'Para a escola', img: 'escola' }, { text: 'Para o carro', img: 'carro' }, { text: 'Para o barco', img: 'barco' }], answer: 1, kind: 'sequencia' },
    ],
    dialogic: [
      'O que você usa quando chove?',
      'Por que Lia correu?',
      'Como o chinelo secou dentro do carro?',
    ],
  },
  {
    id: 'livro-pao-vovo',
    title: 'O pão da vovó',
    level: 'lei-d5-nasais',
    lang: 'pt',
    pages: [
      { text: 'A vovó faz pão.', img: 'vovo_f' },
      { text: 'Ela põe leite e ovo.', img: 'leite' },
      { text: 'O pão vai no forno.', img: 'pao' },
      { text: 'Que cheiro bom!', img: 'pao' },
      { text: 'O menino come o pão com a mão.', img: 'menino' },
    ],
    questions: [
      { q: 'O que a vovó fez?', options: [{ text: 'Pão', img: 'pao' }, { text: 'Bolo', img: 'bolo' }, { text: 'Pizza', img: 'pizza' }], answer: 0, kind: 'literal' },
      { q: 'O que a vovó pôs no pão?', options: [{ text: 'Leite e ovo', img: 'leite' }, { text: 'Uva e mel', img: 'uva' }, { text: 'Sal e milho', img: 'milho' }], answer: 0, kind: 'literal' },
      { q: 'Por que o pão foi para o forno?', options: [{ text: 'Para assar.' }, { text: 'Para gelar.' }, { text: 'Para lavar.' }], answer: 0, kind: 'inferencial' },
    ],
    dialogic: [
      'Você já ajudou alguém a cozinhar?',
      'Como é o cheiro de pão quentinho?',
      'O que você gosta de comer com pão?',
    ],
  },
  {
    id: 'livro-maca-macaco',
    title: 'A maçã do macaco',
    level: 'lei-d5-c-cedilha-s-z',
    lang: 'pt',
    pages: [
      { text: 'O macaco acha uma maçã.', img: 'macaco' },
      { text: 'A maçã é gostosa e vermelha.', img: 'maca' },
      { text: 'Ele dá um pedaço à girafa.', img: 'girafa' },
      { text: 'A girafa diz: obrigada, macaco!', img: 'girafa' },
      { text: 'Os dois são amigos.', img: 'macaco' },
    ],
    questions: [
      { q: 'O que o macaco achou?', options: [{ text: 'Uma banana', img: 'banana' }, { text: 'Uma maçã', img: 'maca' }, { text: 'Uma pera', img: 'pera' }], answer: 1, kind: 'literal' },
      { q: 'Com quem o macaco dividiu?', options: [{ text: 'Com a zebra', img: 'zebra' }, { text: 'Com o leão', img: 'leao' }, { text: 'Com a girafa', img: 'girafa' }], answer: 2, kind: 'literal' },
      { q: 'Por que a girafa disse obrigada?', options: [{ text: 'Ganhou um pedaço de maçã.' }, { text: 'Ganhou um chapéu.' }, { text: 'Estava com sono.' }], answer: 0, kind: 'inferencial' },
    ],
    dialogic: [
      'O que é dividir? Você já dividiu algo com um amigo?',
      'Como a girafa se sentiu?',
      'Que outras frutas são vermelhas?',
    ],
  },
  {
    id: 'livro-hugo-hipopotamo',
    title: 'Hugo, o hipopótamo',
    level: 'lei-d5-x-h',
    lang: 'pt',
    pages: [
      { text: 'Hugo é um hipopótamo.', img: 'hipopotamo' },
      { text: 'Hugo toma chá na xícara.', img: 'xicara' },
      { text: 'A xícara é pequena.', img: 'xicara' },
      { text: 'Hugo é enorme!', img: 'hipopotamo' },
      { text: 'Ops! A xícara caiu.', img: 'xicara' },
    ],
    questions: [
      { q: 'Quem é Hugo?', options: [{ text: 'Um elefante', img: 'elefante' }, { text: 'Um hipopótamo', img: 'hipopotamo' }, { text: 'Um urso', img: 'urso' }], answer: 1, kind: 'literal' },
      { q: 'Por que a xícara caiu?', options: [{ text: 'Hugo é grande e a xícara é pequena.' }, { text: 'Estava ventando.' }, { text: 'O gato empurrou.' }], answer: 0, kind: 'inferencial' },
      { q: 'O que aconteceu no final?', options: [{ text: 'Hugo dormiu.' }, { text: 'A xícara caiu.' }, { text: 'Hugo foi nadar.' }], answer: 1, kind: 'sequencia' },
    ],
    dialogic: [
      'O que é grande e o que é pequeno nesta história?',
      'O que Hugo pode fazer agora?',
      'Você já deixou alguma coisa cair sem querer?',
    ],
  },
  // --- Inglês (nível ligado depois pela trilha de inglês) ---
  {
    id: 'book-the-cat',
    title: 'The cat',
    level: 'ing-e4-leitura',
    lang: 'en',
    pages: [
      { text: 'I see a cat.', img: 'gato' },
      { text: 'The cat is fat.', img: 'gato' },
      { text: 'The cat can nap.', img: 'dormir' },
      { text: 'Nap, cat, nap!', img: 'gato' },
    ],
    questions: [
      { q: 'What can nap?', options: [{ text: 'A dog', img: 'cachorro' }, { text: 'A cat', img: 'gato' }, { text: 'A fish', img: 'peixe' }], answer: 1, kind: 'literal' },
      { q: 'Is the cat big or small?', options: [{ text: 'Big and fat' }, { text: 'Small and thin' }], answer: 0, kind: 'inferencial' },
    ],
    dialogic: ['Onde o gato gosta de dormir?', 'Como se diz "gato" em inglês?', 'Você conhece outro bicho que dorme muito?'],
  },
  {
    id: 'book-big-red-bus',
    title: 'A big red bus',
    level: 'ing-e4-leitura',
    lang: 'en',
    pages: [
      { text: 'A bus.', img: 'onibus' },
      { text: 'A big red bus.', img: 'onibus' },
      { text: 'Get on the bus!', img: 'onibus' },
      { text: 'The bus can go.', img: 'onibus' },
    ],
    questions: [
      { q: 'What is big and red?', options: [{ text: 'A bus', img: 'onibus' }, { text: 'A car', img: 'carro' }, { text: 'A boat', img: 'barco' }], answer: 0, kind: 'literal' },
      { q: 'What color is the bus?', options: [{ text: 'Red' }, { text: 'Blue' }, { text: 'Green' }], answer: 0, kind: 'literal' },
    ],
    dialogic: ['Você já andou de ônibus?', 'Como se diz "vermelho" em inglês?', 'Para onde o ônibus vai?'],
  },
  {
    id: 'book-the-sun',
    title: 'The sun',
    level: 'ing-e4-leitura',
    lang: 'en',
    pages: [
      { text: 'The sun is up.', img: 'sol' },
      { text: 'It is hot.', img: 'sol' },
      { text: 'I can run in the sun.', img: 'correr' },
      { text: 'Fun in the sun!', img: 'feliz' },
    ],
    questions: [
      { q: 'What is hot?', options: [{ text: 'The sun', img: 'sol' }, { text: 'The moon', img: 'lua' }, { text: 'The snow', img: 'neve' }], answer: 0, kind: 'literal' },
      { q: 'What can I do in the sun?', options: [{ text: 'Run', img: 'correr' }, { text: 'Sleep', img: 'dormir' }, { text: 'Cry', img: 'chorar' }], answer: 0, kind: 'literal' },
    ],
    dialogic: ['O que você gosta de fazer num dia de sol?', 'Como se diz "sol" em inglês?', 'O que usamos para nos proteger do sol?'],
  },
];

const byId = new Map(BOOKS.map((b) => [b.id, b]));

export function getBook(id: string): Book | undefined {
  return byId.get(id);
}
