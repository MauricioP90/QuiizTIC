import { Request, Response } from 'express';
import { ObtenerLeaderboard } from '../../../../application/use-cases/ObtenerLeaderboard.js';
import { IEventoRepository } from '../../../../domain/ports/IEventoRepository.js';

export class LeaderboardController {
  constructor(
    private readonly obtenerLeaderboardUseCase: ObtenerLeaderboard,
    private readonly eventoRepo: IEventoRepository
  ) {}

  private isAuthorized(req: Request): boolean {
    const adminPin = req.headers['x-admin-pin'];
    const expectedPin = process.env.ADMIN_PIN || '14789';
    return adminPin === expectedPin;
  }

  async getLeaderboard(req: Request, res: Response): Promise<void> {
    const { evento } = req.query;

    try {
      const adminAuth = this.isAuthorized(req);

      let targetEvent = null;
      if (evento) {
        targetEvent = await this.eventoRepo.obtenerPorId(parseInt(String(evento)));
      } else {
        targetEvent = await this.eventoRepo.obtenerActivo();
      }

      // Si no es un administrador autorizado y el evento tiene el ranking oculto
      if (!adminAuth && targetEvent && targetEvent.mostrarRanking === false) {
        res.status(403).json({
          error: 'La tabla de posiciones se encuentra en modo suspenso por el equipo organizador.',
          rankingOculto: true
        });
        return;
      }

      const top10 = await this.obtenerLeaderboardUseCase.execute(
        evento ? parseInt(String(evento)) : undefined
      );
      res.json(top10);
    } catch (error) {
      console.error('Error al obtener la tabla de posiciones:', error);
      res.status(500).json({ error: 'Error interno del servidor al obtener la tabla de posiciones.' });
    }
  }
}
