export type TipoPractica = 'BUENA' | 'MALA';

export class Pregunta {
  constructor(
    public readonly id: string,
    public readonly categoria: string | null,
    public readonly subcategoria: string | null,
    public readonly tipoPractica: TipoPractica,
    public readonly contexto: string,
    public readonly riesgoBeneficio: string,
    public readonly recomendacion: string
  ) {}
}
