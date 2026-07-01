export type PracticeType = 'BUENA' | 'MALA';

export interface Scenario {
  id: string;
  contexto: string;
  tipoPractica: PracticeType;
  riesgoBeneficio: string;
  recomendacion: string;
}
