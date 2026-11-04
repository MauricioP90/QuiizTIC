import { Pregunta } from '../../domain/entities/Pregunta.js';
import { RolParticipante } from '../../domain/entities/Vehiculo.js';

export interface IPreguntaRepository {
  obtenerAleatoriaNoRespondida(
    numeroVehiculo?: string,
    rol?: RolParticipante,
    idEvento?: number,
    categorias?: string[]
  ): Promise<Pregunta | null>;
  obtenerPorId(id: string): Promise<Pregunta | null>;
}
