import { RolParticipante } from './Vehiculo.js';

export class PuntosAcumulados {
  constructor(
    public readonly numeroVehiculo: string,
    public readonly rol: RolParticipante,
    public readonly preguntasAcertadas: number,
    public readonly preguntasErradas: number,
    public readonly totalPreguntas: number,
    public readonly totalPuntosAcumulados: number,
    public readonly idEvento: number = 1,
    public readonly documento?: string | null,
    public readonly nombreParticipante?: string | null
  ) {}
}
