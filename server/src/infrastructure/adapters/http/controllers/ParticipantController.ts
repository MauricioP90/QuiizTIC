import { Request, Response } from 'express';
import { RegistrarVehiculo } from '../../../../application/use-cases/RegistrarVehiculo.js';
import { ProcesarRespuesta } from '../../../../application/use-cases/ProcesarRespuesta.js';
import { ValidarPersona } from '../../../../application/use-cases/ValidarPersona.js';

export class ParticipantController {
  constructor(
    private readonly registrarVehiculoUseCase: RegistrarVehiculo,
    private readonly procesarRespuestaUseCase: ProcesarRespuesta,
    private readonly validarPersonaUseCase: ValidarPersona
  ) {}

  async validatePersona(req: Request, res: Response): Promise<void> {
    const { documento } = req.params;
    if (!documento || !documento.trim()) {
      res.status(400).json({ valid: false, error: 'El número de documento es obligatorio.' });
      return;
    }

    try {
      const persona = await this.validarPersonaUseCase.execute(documento.trim());
      if (!persona) {
        res.status(404).json({
          valid: false,
          error: 'Documento no encontrado o usuario no se encuentra en estado ACTIVO.'
        });
        return;
      }

      res.json({
        valid: true,
        persona
      });
    } catch (error: any) {
      console.error('Error al validar persona:', error);
      res.status(500).json({ valid: false, error: 'Error al consultar la base de datos de personas.' });
    }
  }

  async register(req: Request, res: Response): Promise<void> {
    const { numeroVehiculo, rol, idEvento, documento, nombreParticipante } = req.body;

    // Si viene registro por cédula
    const docLimpio = documento ? String(documento).trim() : null;
    const vehiculoFinal = numeroVehiculo ? String(numeroVehiculo).trim() : docLimpio;
    const rolFinal = rol || 'OPERADOR';

    if (!vehiculoFinal) {
      res.status(400).json({ error: 'Número de vehículo o documento de identidad es obligatorio.' });
      return;
    }

    try {
      const vehiculo = await this.registrarVehiculoUseCase.execute(
        vehiculoFinal,
        rolFinal,
        idEvento ? parseInt(idEvento) : undefined,
        docLimpio,
        nombreParticipante ? String(nombreParticipante).trim() : null
      );

      res.json({
        uuid: Math.random().toString(36).substring(2, 15),
        numeroVehiculo: vehiculo.numeroVehiculo,
        rol: vehiculo.rol,
        documento: docLimpio,
        nombreParticipante: nombreParticipante || null,
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
    const { numeroVehiculo, rol, idPregunta, respuesta, idEvento, documento, nombreParticipante } = req.body;

    const docLimpio = documento ? String(documento).trim() : null;
    const vehiculoFinal = numeroVehiculo ? String(numeroVehiculo).trim() : docLimpio;
    const rolFinal = rol || 'OPERADOR';

    if (!vehiculoFinal || !idPregunta || !respuesta) {
      res.status(400).json({ error: 'Faltan parámetros requeridos para la respuesta.' });
      return;
    }

    try {
      const resultado = await this.procesarRespuestaUseCase.execute(
        vehiculoFinal,
        rolFinal,
        idPregunta,
        respuesta,
        idEvento ? parseInt(idEvento) : undefined,
        docLimpio,
        nombreParticipante ? String(nombreParticipante).trim() : null
      );
      res.json(resultado);
    } catch (error: any) {
      console.error('Error al guardar respuesta:', error);
      res.status(500).json({ error: error.message || 'Error al procesar la respuesta en el servidor.' });
    }
  }
}
