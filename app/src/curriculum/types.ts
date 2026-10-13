// Tipos centrais do currículo do Degrau.
// Toda atividade é descrita como dados (Item); a interface só sabe desenhar esses tipos.

export type TrackId = 'leitura' | 'matematica' | 'logica' | 'ingles';
export type Lang = 'pt' | 'en';

/** Um trecho falado pela narração (e mostrado como legenda). */
export interface Say {
  text: string;
  /** padrão: 'pt' */
  lang?: Lang;
  /** Fala mais devagar (ex.: sons isolados, sílabas). */
  slow?: boolean;
  /** Não mostrar na legenda (ex.: ditado — a legenda entregaria a grafia). */
  hideCaption?: boolean;
}

export type ShapeId = 'circulo' | 'quadrado' | 'triangulo' | 'retangulo' | 'estrela' | 'coracao' | 'losango';
export type ColorId = 'vermelho' | 'azul' | 'amarelo' | 'verde' | 'laranja' | 'roxo' | 'rosa' | 'marrom' | 'preto' | 'branco';

/** Uma "peça" visual: figura (chave de imagem), forma geométrica, texto ou cor. */
export type Token =
  | { kind: 'img'; img: string }
  | { kind: 'shape'; shape: ShapeId; color: ColorId; size?: 'p' | 'm' | 'g' }
  | { kind: 'text'; text: string; lang?: Lang }
  | { kind: 'color'; color: ColorId }
  | { kind: 'dots'; n: number }
  | { kind: 'clock'; h: number; m: number }
  | { kind: 'mouth'; mouth: MouthShape };

/** Formatos de boca (inspirado no Método das Boquinhas). */
export type MouthShape = 'aberta' | 'sorriso' | 'redonda' | 'bico' | 'fechada' | 'dentes-labio' | 'lingua' | 'chiado';

export interface Option {
  token: Token;
  /** O que a narração fala ao tocar na opção (opcional). */
  say?: Say;
}

/** Elemento visual principal mostrado acima das respostas. */
export type Visual =
  | { type: 'token'; token: Token; big?: boolean }
  | { type: 'objects'; img: string; n: number }
  | { type: 'sequence'; items: Token[]; missing: number }
  | { type: 'money'; values: number[] } // em centavos: 5,10,25,50,100,200,500,1000,2000
  | { type: 'vertical'; a: number; b: number; op: '+' | '-' | '×' }
  | { type: 'equation'; text: string }
  | { type: 'groups'; groups: number; each: number; img: string }
  | { type: 'baseten'; tens: number; ones: number; hundreds?: number }
  | { type: 'tenframe'; filled: number; total: 10 | 20 }
  | { type: 'bars'; data: { img: string; value: number }[] }
  | { type: 'shadow'; img: string }
  | { type: 'row'; tokens: Token[] }
  | { type: 'symmetry'; size: number; left: boolean[] } // grade size x size, metade esquerda pintada
  | { type: 'scene'; parts: Visual[] };

export interface Hint {
  say: Say[];
  /** Destaca a resposta correta (nível 3 = resposta modelada). */
  showAnswer?: boolean;
  /** Visual extra de apoio (ex.: boca, pontinhos, quadro de dez). */
  visual?: Visual;
}

interface ItemBase {
  /** Instrução falada (sempre em áudio — a criança pode não ler). */
  prompt: Say[];
  /** Exatamente 3 dicas: pista leve → demonstração → resposta modelada. */
  hints: [Hint, Hint, Hint];
  visual?: Visual;
}

export type Dir = 'cima' | 'baixo' | 'esquerda' | 'direita';

export type Item =
  | (ItemBase & { kind: 'choose'; options: Option[]; answer: number; columns?: number })
  /** Resposta numérica escrita com teclado numérico (estilo folha Kumon). */
  | (ItemBase & { kind: 'input'; answer: number })
  /** Alfabeto móvel: montar `solution` com as peças em `tiles` (solução + distratores). */
  | (ItemBase & { kind: 'build'; solution: string[]; tiles: string[]; img?: string; lang?: Lang })
  /** Traçado com o dedo. `glyph` = letra/número; ou `path` para linhas de pré-escrita. */
  | (ItemBase & { kind: 'trace'; glyph?: string; path?: 'reta' | 'curva' | 'zigue' | 'onda' | 'laco' })
  /** Falar em voz alta (reconhecimento de voz quando disponível; nunca penaliza). */
  | (ItemBase & { kind: 'speak'; expect: string; lang: Lang })
  /** Quadro de dez interativo: tocar até ter `target` bolinhas. */
  | (ItemBase & { kind: 'tenframe'; target: number; total: 10 | 20 })
  /** Material Dourado: montar `target` com barras (10) e cubinhos (1). */
  | (ItemBase & { kind: 'baseten'; target: number })
  /** Sudoku 4x4 com figuras. grid: 16 células, null = vazia. Valores = índice em symbols. */
  | (ItemBase & { kind: 'sudoku'; grid: (number | null)[]; solution: number[]; symbols: string[] })
  /** Robô na grade: programar com setas. Se `program` vier, é depuração (achar/consertar). */
  | (ItemBase & {
      kind: 'robot';
      size: number;
      start: [number, number];
      goal: [number, number];
      walls: [number, number][];
      maxSteps: number;
      program?: Dir[];
    })
  /** Livro decodificável com perguntas de compreensão. */
  | (ItemBase & { kind: 'book'; bookId: string });

export interface Rng {
  next(): number;
  int(min: number, max: number): number;
  pick<T>(arr: readonly T[]): T;
  shuffle<T>(arr: readonly T[]): T[];
  /** n elementos distintos */
  sample<T>(arr: readonly T[], n: number): T[];
}

export interface Skill {
  /** Ex.: 'lei-d2-m' */
  id: string;
  track: TrackId;
  /** Degrau (nível), ex.: 'D2', 'M3', 'L1', 'E0' */
  step: string;
  /** Nome para os adultos. */
  title: string;
  /** Códigos BNCC relacionados (EI03.., EF01..). */
  bncc: string[];
  /** Objetivo pedagógico para os adultos. */
  objective: string;
  /** Técnicas aplicadas (ex.: 'Fônico', 'CPA', 'TPR', 'Montessori'). */
  techniques: string[];
  /** Tempo-padrão por item (segundos) — critério de fluência. */
  stdTimeSec: number;
  /** Itens por bloco. */
  blockSize: number;
  /** Idade mínima recomendada (o nivelamento pode adiantar). */
  minAge: number;
  /** Grafemas que esta habilidade introduz (só trilha de leitura) — usado na validação dos livros. */
  graphemes?: string[];
  /** Gera um item novo (procedural, sem repetir sempre o mesmo). */
  generate: (rng: Rng) => Item;
  /** Sugestão de atividade offline de 5 minutos para a família. */
  offlineTip: string;
}

export interface BookPage {
  text: string;
  img: string;
}

export interface Book {
  id: string;
  title: string;
  /** Habilidade de leitura a partir da qual o livro é decodificável. */
  level: string;
  lang: Lang;
  pages: BookPage[];
  questions: { q: string; options: { text: string; img?: string }[]; answer: number; kind: 'literal' | 'inferencial' | 'sequencia' }[];
  /** Perguntas de leitura dialógica para o adulto (PEER/CROWD). */
  dialogic: string[];
}
