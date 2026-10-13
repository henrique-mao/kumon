// Bayesian Knowledge Tracing (Corbett & Anderson, 1995): estima a probabilidade de a criança
// já dominar a habilidade a partir da sequência de acertos/erros de primeira.
// Roda ao lado das regras do Kumon; os adultos podem escolher usá-lo como critério extra de avanço.

export interface BktParams {
  /** P(L0): conhecimento prévio. */
  init: number;
  /** P(T): chance de aprender a cada oportunidade. */
  learn: number;
  /** P(S): errar mesmo sabendo (descuido). */
  slip: number;
  /** P(G): acertar sem saber (chute). */
  guess: number;
}

export const DEFAULT_BKT: BktParams = { init: 0.2, learn: 0.15, slip: 0.1, guess: 0.2 };
/** Limiar para considerar "dominado" pelo modelo. */
export const BKT_MASTERY = 0.9;

export function bktUpdate(pKnown: number, correct: boolean, p: BktParams = DEFAULT_BKT): number {
  const posterior = correct
    ? (pKnown * (1 - p.slip)) / (pKnown * (1 - p.slip) + (1 - pKnown) * p.guess)
    : (pKnown * p.slip) / (pKnown * p.slip + (1 - pKnown) * (1 - p.guess));
  return posterior + (1 - posterior) * p.learn;
}

export function bktRun(pKnown: number, outcomes: boolean[], p: BktParams = DEFAULT_BKT): number {
  return outcomes.reduce((k, o) => bktUpdate(k, o, p), pKnown);
}
