import { RolParticipante } from './Vehiculo.js';

export type ResultadoRespuesta = 'ACERTO' | 'FALLO' | 'EXPIRADO';

export class RegistroRespuesta {
  constructor(
    public readonly id: number | null,
    public readonly numeroVehiculo: string,
    public readonly rol: RolParticipante,
    public readonly idPregunta: string,
    public readonly resultado: ResultadoRespuesta,
    public readonly puntos: number,
    public readonly respondidoEn?: Date
  ) {}
}

export class RegistroRespuestaDetallado {
  constructor(
    public readonly idPregunta: string,
    public readonly resultado: ResultadoRespuesta,
    public readonly puntos: number,
    public readonly contexto: string,
    public readonly tipoPractica: 'BUENA' | 'MALA',
    public readonly riesgoBeneficio: string,
    public readonly recomendacion: string
  ) {}
}
