import { IPuntosAcumuladosRepository } from '../../domain/ports/IPuntosAcumuladosRepository.js';
import { IRegistroRespuestaRepository } from '../../domain/ports/IRegistroRespuestaRepository.js';
import { IEventoRepository } from '../../domain/ports/IEventoRepository.js';
import { PuntosAcumulados } from '../../domain/entities/PuntosAcumulados.js';
import { RegistroRespuestaDetallado } from '../../domain/entities/RegistroRespuesta.js';
import { RolParticipante } from '../../domain/entities/Vehiculo.js';

export class ObtenerResultados {
  constructor(
    private readonly puntosRepo: IPuntosAcumuladosRepository,
    private readonly registroRepo: IRegistroRespuestaRepository,
    private readonly eventoRepo: IEventoRepository
  ) {}

  async execute(
    numeroVehiculo: string,
    rol: RolParticipante,
    idEventoManual?: number
  ): Promise<{ acumulado: PuntosAcumulados; historial: RegistroRespuestaDetallado[] }> {
    const vehicleUpper = numeroVehiculo.trim().toUpperCase();

    let idEvento = idEventoManual;
    if (!idEvento) {
      const activeEvent = await this.eventoRepo.obtenerActivo();
      idEvento = activeEvent?.id || 1;
    }

    const acumulado = await this.puntosRepo.obtenerPorVehiculo(vehicleUpper, rol, idEvento);
    if (!acumulado) {
      throw new Error('Vehículo no registrado o sin puntuaciones.');
    }

    const historial = await this.registroRepo.obtenerUltimasPorVehiculo(vehicleUpper, rol, 5, idEvento);
    const cronologico = [...historial].reverse();

    return {
      acumulado,
      historial: cronologico
    };
  }
}
