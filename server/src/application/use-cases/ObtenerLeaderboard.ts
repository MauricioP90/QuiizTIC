import { IPuntosAcumuladosRepository } from '../../domain/ports/IPuntosAcumuladosRepository.js';
import { IEventoRepository } from '../../domain/ports/IEventoRepository.js';
import { PuntosAcumulados } from '../../domain/entities/PuntosAcumulados.js';

export class ObtenerLeaderboard {
  constructor(
    private readonly puntosRepo: IPuntosAcumuladosRepository,
    private readonly eventoRepo: IEventoRepository
  ) {}

  async execute(idEventoManual?: number): Promise<PuntosAcumulados[]> {
    let idEvento = idEventoManual;
    if (!idEvento) {
      const activeEvent = await this.eventoRepo.obtenerActivo();
      idEvento = activeEvent?.id || 1;
    }
    return this.puntosRepo.obtenerTop10(idEvento);
  }
}
