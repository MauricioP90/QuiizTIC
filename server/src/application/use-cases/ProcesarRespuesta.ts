import { IPreguntaRepository } from '../../domain/ports/IPreguntaRepository.js';
import { IRegistroRespuestaRepository } from '../../domain/ports/IRegistroRespuestaRepository.js';
import { IPuntosAcumuladosRepository } from '../../domain/ports/IPuntosAcumuladosRepository.js';
import { IEventoRepository } from '../../domain/ports/IEventoRepository.js';
import { RegistroRespuesta, ResultadoRespuesta } from '../../domain/entities/RegistroRespuesta.js';
import { RolParticipante } from '../../domain/entities/Vehiculo.js';

export class ProcesarRespuesta {
  constructor(
    private readonly preguntaRepo: IPreguntaRepository,
    private readonly registroRepo: IRegistroRespuestaRepository,
    private readonly puntosRepo: IPuntosAcumuladosRepository,
    private readonly eventoRepo: IEventoRepository
  ) {}

  async execute(
    numeroVehiculo: string,
    rol: RolParticipante,
    idPregunta: string,
    respuesta: 'BUENA' | 'MALA' | 'EXPIRED',
    idEventoManual?: number,
    documento?: string | null,
    nombreParticipante?: string | null
  ): Promise<{ resultado: ResultadoRespuesta; puntos: number; isCorrect: boolean }> {
    const vehicleUpper = numeroVehiculo.trim().toUpperCase();

    let idEvento = idEventoManual;
    if (!idEvento) {
      const activeEvent = await this.eventoRepo.obtenerActivo();
      idEvento = activeEvent?.id || 1;
    }

    // 1. Obtener la pregunta original
    const pregunta = await this.preguntaRepo.obtenerPorId(idPregunta);
    if (!pregunta) {
      throw new Error('Pregunta no encontrada.');
    }

    // 2. Determinar resultado y puntaje (+1 si acertó, 0 si falló o expiró)
    let resultado: ResultadoRespuesta = 'FALLO';
    let puntos = 0;

    if (respuesta === 'EXPIRED') {
      resultado = 'EXPIRADO';
      puntos = 0;
    } else if (respuesta === pregunta.tipoPractica) {
      resultado = 'ACERTO';
      puntos = 1;
    }

    // 3. Registrar respuesta asociada al evento
    const registro = new RegistroRespuesta(
      null,
      vehicleUpper,
      rol,
      idPregunta,
      resultado,
      puntos,
      idEvento,
      documento || null,
      nombreParticipante || null
    );
    await this.registroRepo.guardar(registro);

    // 4. Actualizar acumulado del evento
    await this.puntosRepo.actualizarPuntaje(
      vehicleUpper,
      rol,
      resultado,
      puntos,
      idEvento,
      documento || null,
      nombreParticipante || null
    );

    return {
      resultado,
      puntos,
      isCorrect: resultado === 'ACERTO'
    };
  }
}
