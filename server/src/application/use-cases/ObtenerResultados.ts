import { IPuntosAcumuladosRepository } from '../../domain/ports/IPuntosAcumuladosRepository.js';
import { IRegistroRespuestaRepository } from '../../domain/ports/IRegistroRespuestaRepository.js';
import { PuntosAcumulados } from '../../domain/entities/PuntosAcumulados.js';
import { RegistroRespuestaDetallado } from '../../domain/entities/RegistroRespuesta.js';
import { RolParticipante } from '../../domain/entities/Vehiculo.js';

export class ObtenerResultados {
  constructor(
    private readonly puntosRepo: IPuntosAcumuladosRepository,
    private readonly registroRepo: IRegistroRespuestaRepository
  ) {}

  async execute(numeroVehiculo: string, rol: RolParticipante): Promise<{ acumulado: PuntosAcumulados; historial: RegistroRespuestaDetallado[] }> {
    const vehicleUpper = numeroVehiculo.trim().toUpperCase();

    const acumulado = await this.puntosRepo.obtenerPorVehiculo(vehicleUpper, rol);
    if (!acumulado) {
      throw new Error('Vehículo no registrado o sin puntuaciones.');
    }

    const historial = await this.registroRepo.obtenerUltimasPorVehiculo(vehicleUpper, rol, 5);
    
    // El frontend espera el historial en orden cronológico (más antiguos a más recientes).
    // La consulta a la BD suele devolverlos ordenados por fecha DESC. Revertimos el orden.
    const cronologico = [...historial].reverse();

    return {
      acumulado,
      historial: cronologico
    };
  }
}
