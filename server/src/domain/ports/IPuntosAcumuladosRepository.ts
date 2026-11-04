import { PuntosAcumulados } from '../entities/PuntosAcumulados.js';
import { RolParticipante } from '../entities/Vehiculo.js';

export interface IPuntosAcumuladosRepository {
  inicializarSiNoExiste(
    numeroVehiculo: string,
    rol: RolParticipante,
    idEvento?: number,
    documento?: string | null,
    nombreParticipante?: string | null
  ): Promise<void>;

  obtenerPorVehiculo(numeroVehiculo: string, rol: RolParticipante, idEvento?: number): Promise<PuntosAcumulados | null>;

  actualizarPuntaje(
    numeroVehiculo: string,
    rol: RolParticipante,
    resultado: 'ACERTO' | 'FALLO' | 'EXPIRADO',
    puntos: number,
    idEvento?: number,
    documento?: string | null,
    nombreParticipante?: string | null
  ): Promise<void>;

  obtenerTop10(idEvento?: number): Promise<PuntosAcumulados[]>;
}
