import { Request, Response } from 'express';
import { ObtenerEscenarios } from '../../../../application/use-cases/ObtenerEscenarios.js';

export class ScenarioController {
  constructor(private readonly obtenerEscenariosUseCase: ObtenerEscenarios) {}

  async getScenario(req: Request, res: Response): Promise<void> {
    const { vehiculo, rol, evento } = req.query;
    try {
      const scenario = await this.obtenerEscenariosUseCase.execute(
        vehiculo ? String(vehiculo) : undefined,
        rol ? (String(rol) as any) : undefined,
        evento ? parseInt(String(evento)) : undefined
      );

      // El frontend espera un array de escenarios (incluso si es 1 solo)
      const scenarios = scenario ? [scenario] : [];
      res.json(scenarios);
    } catch (error) {
      console.error('Error al obtener escenarios:', error);
      res.status(500).json({ error: 'Error interno del servidor al obtener escenarios.' });
    }
  }
}
