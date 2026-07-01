import { RegistroRespuesta, RegistroRespuestaDetallado } from '../../domain/entities/RegistroRespuesta.js';
import { RolParticipante } from '../../domain/entities/Vehiculo.js';

export interface IRegistroRespuestaRepository {
  guardar(registro: RegistroRespuesta): Promise<RegistroRespuesta>;
  obtenerUltimasPorVehiculo(numeroVehiculo: string, rol: RolParticipante, limite: number): Promise<RegistroRespuestaDetallado[]>;
}
