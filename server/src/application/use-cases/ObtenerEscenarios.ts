import { IPreguntaRepository } from '../../domain/ports/IPreguntaRepository.js';
import { IEventoRepository } from '../../domain/ports/IEventoRepository.js';
import { Pregunta } from '../../domain/entities/Pregunta.js';
import { RolParticipante } from '../../domain/entities/Vehiculo.js';

export class ObtenerEscenarios {
  constructor(
    private readonly preguntaRepo: IPreguntaRepository,
    private readonly eventoRepo: IEventoRepository
  ) {}

  async execute(numeroVehiculo?: string, rol?: RolParticipante, idEventoManual?: number): Promise<Pregunta | null> {
    const eventoActivo = await this.eventoRepo.obtenerActivo();
    const idEvento = idEventoManual || eventoActivo?.id || 1;
    const categorias = eventoActivo?.categorias && eventoActivo.categorias.length > 0
      ? eventoActivo.categorias
      : undefined;

    return this.preguntaRepo.obtenerAleatoriaNoRespondida(numeroVehiculo, rol, idEvento, categorias);
  }
}
