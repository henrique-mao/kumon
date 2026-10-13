import type { Item, Token } from '../../curriculum/types';

export interface CorrectMeta {
  /** false = não conta para a acurácia (ex.: voz não reconhecida). */
  scored?: boolean;
  /** palavras corretas por minuto (leitura em voz alta) */
  pcpm?: number;
}

export interface ActivityProps<K extends Item['kind']> {
  item: Extract<Item, { kind: K }>;
  /** 0 = sem dica; 1..3 = nível de dica; 3 = resposta modelada (mostrar a resposta). */
  hintLevel: number;
  disabled: boolean;
  /** Cor da trilha. */
  color: string;
  onCorrect: (meta?: CorrectMeta) => void;
  onWrong: (detail?: { expected: string; chosen: string }) => void;
}

export function tokenLabel(t: Token): string {
  switch (t.kind) {
    case 'img': return t.img.replace(/_/g, ' ');
    case 'text': return t.text;
    case 'shape': return `${t.shape} ${t.color}`;
    case 'color': return t.color;
    case 'dots': return String(t.n);
    case 'clock': return `${t.h}:${String(t.m).padStart(2, '0')}`;
    case 'mouth': return `boca ${t.mouth}`;
  }
}
