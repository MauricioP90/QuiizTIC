import { Request, Response } from 'express';
import { ObtenerLeaderboard } from '../../../../application/use-cases/ObtenerLeaderboard.js';

export class LeaderboardController {
  constructor(private readonly obtenerLeaderboardUseCase: ObtenerLeaderboard) {}

  async getLeaderboard(req: Request, res: Response): Promise<void> {
    const adminPinHeader = req.headers['x-admin-pin'];
    const expectedPin = process.env.ADMIN_PIN || '14789';

    if (adminPinHeader !== expectedPin) {
      res.status(401).json({ error: 'No autorizado. PIN de administrador inválido.' });
      return;
    }

    try {
      const top10 = await this.obtenerLeaderboardUseCase.execute();
      res.json(top10);
    } catch (error) {
      console.error('Error al obtener la tabla de posiciones:', error);
      res.status(500).json({ error: 'Error interno del servidor al obtener la tabla de posiciones.' });
    }
  }
}
