import { IPreguntaRepository } from '../../domain/ports/IPreguntaRepository.js';
import { Pregunta } from '../../domain/entities/Pregunta.js';
import { RolParticipante } from '../../domain/entities/Vehiculo.js';

export class ObtenerEscenarios {
  constructor(private readonly preguntaRepo: IPreguntaRepository) {}

  async execute(numeroVehiculo?: string, rol?: RolParticipante): Promise<Pregunta | null> {
    return this.preguntaRepo.obtenerAleatoriaNoRespondida(numeroVehiculo, rol);
  }
}
