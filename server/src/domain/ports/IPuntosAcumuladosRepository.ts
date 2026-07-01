import { PuntosAcumulados } from '../../domain/entities/PuntosAcumulados.js';
import { RolParticipante } from '../../domain/entities/Vehiculo.js';

export interface IPuntosAcumuladosRepository {
  inicializarSiNoExiste(numeroVehiculo: string, rol: RolParticipante): Promise<void>;
  obtenerPorVehiculo(numeroVehiculo: string, rol: RolParticipante): Promise<PuntosAcumulados | null>;
  actualizarPuntaje(
    numeroVehiculo: string,
    rol: RolParticipante,
    resultado: 'ACERTO' | 'FALLO' | 'EXPIRADO',
    puntos: number
  ): Promise<void>;
  obtenerTop10(): Promise<PuntosAcumulados[]>;
}
