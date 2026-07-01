import { IPuntosAcumuladosRepository } from '../../domain/ports/IPuntosAcumuladosRepository.js';
import { PuntosAcumulados } from '../../domain/entities/PuntosAcumulados.js';

export class ObtenerLeaderboard {
  constructor(private readonly puntosRepo: IPuntosAcumuladosRepository) {}

  async execute(): Promise<PuntosAcumulados[]> {
    return this.puntosRepo.obtenerTop10();
  }
}
