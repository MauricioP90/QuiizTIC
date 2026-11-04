import { Request, Response } from 'express';
import { ObtenerLeaderboard } from '../../../../application/use-cases/ObtenerLeaderboard.js';

export class LeaderboardController {
  constructor(private readonly obtenerLeaderboardUseCase: ObtenerLeaderboard) {}

  async getLeaderboard(req: Request, res: Response): Promise<void> {
    const { evento } = req.query;

    try {
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
