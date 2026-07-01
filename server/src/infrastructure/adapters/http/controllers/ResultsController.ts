import { Request, Response } from 'express';
import { ObtenerResultados } from '../../../../application/use-cases/ObtenerResultados.js';

export class ResultsController {
  constructor(private readonly obtenerResultadosUseCase: ObtenerResultados) {}

  async getResults(req: Request, res: Response): Promise<void> {
    const { vehiculo } = req.params;
    const { rol } = req.query;

    if (!vehiculo || !rol) {
      res.status(400).json({ error: 'Número de vehículo y rol son requeridos.' });
      return;
    }

    try {
      const results = await this.obtenerResultadosUseCase.execute(vehiculo, rol as any);
      res.json(results);
    } catch (error: any) {
      console.error('Error al obtener resultados:', error);
      if (error.message === 'Vehículo no registrado o sin puntuaciones.') {
        res.status(404).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Error interno del servidor al recuperar los resultados.' });
      }
    }
  }
}
