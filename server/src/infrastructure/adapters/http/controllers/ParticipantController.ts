import { Request, Response } from 'express';
import { RegistrarVehiculo } from '../../../../application/use-cases/RegistrarVehiculo.js';
import { ProcesarRespuesta } from '../../../../application/use-cases/ProcesarRespuesta.js';

export class ParticipantController {
  constructor(
    private readonly registrarVehiculoUseCase: RegistrarVehiculo,
    private readonly procesarRespuestaUseCase: ProcesarRespuesta
  ) { }

  async register(req: Request, res: Response): Promise<void> {
    const { numeroVehiculo, rol } = req.body;

    if (!numeroVehiculo || !rol) {
      res.status(400).json({ error: 'Número de vehículo y rol son obligatorios.' });
      return;
    }

    try {
      const vehiculo = await this.registrarVehiculoUseCase.execute(numeroVehiculo, rol);

      res.json({
        uuid: Math.random().toString(36).substring(2, 15),
        numeroVehiculo: vehiculo.numeroVehiculo,
        rol: vehiculo.rol,
        registradoEn: vehiculo.registradoEn
      });
    } catch (error) {
      console.error('Error al registrar participante:', error);
      if (error instanceof Error && error.message.includes('4 dígitos')) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Error al registrar participante en el servidor.' });
      }
    }
  }

  async answer(req: Request, res: Response): Promise<void> {
    const { numeroVehiculo, rol, idPregunta, respuesta } = req.body;

    if (!numeroVehiculo || !rol || !idPregunta || !respuesta) {
      res.status(400).json({ error: 'Faltan parámetros requeridos.' });
      return;
    }

    try {
      const resultado = await this.procesarRespuestaUseCase.execute(numeroVehiculo, rol, idPregunta, respuesta);
      res.json(resultado);
    } catch (error: any) {
      console.error('Error al guardar respuesta:', error);
      if (error.message === 'Pregunta no encontrada.') {
        res.status(404).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Error interno del servidor al registrar la respuesta.' });
      }
    }
  }
}
