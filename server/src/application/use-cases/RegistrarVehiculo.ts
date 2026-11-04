import { IVehiculoRepository } from '../../domain/ports/IVehiculoRepository.js';
import { IPuntosAcumuladosRepository } from '../../domain/ports/IPuntosAcumuladosRepository.js';
import { IEventoRepository } from '../../domain/ports/IEventoRepository.js';
import { Vehiculo, RolParticipante } from '../../domain/entities/Vehiculo.js';

export class RegistrarVehiculo {
  constructor(
    private readonly vehiculoRepo: IVehiculoRepository,
    private readonly puntosRepo: IPuntosAcumuladosRepository,
    private readonly eventoRepo: IEventoRepository
  ) {}

  async execute(
    numeroVehiculo: string,
    rol: RolParticipante,
    idEventoManual?: number,
    documento?: string | null,
    nombreParticipante?: string | null
  ): Promise<Vehiculo> {
    const vehicleUpper = numeroVehiculo.trim().toUpperCase();
    const esCedula = Boolean(documento);
    const vehiculo = new Vehiculo(vehicleUpper, rol, undefined, esCedula);

    // Guardar en tabla vehiculos solo si es un registro real de vehiculo
    let guardado = vehiculo;
    if (!esCedula) {
      guardado = await this.vehiculoRepo.guardarOActualizar(vehiculo);
    }

    // Determinar evento
    let idEvento = idEventoManual;
    if (!idEvento) {
      const activeEvent = await this.eventoRepo.obtenerActivo();
      idEvento = activeEvent?.id || 1;
    }

    // Inicializar puntos acumulados en cero para este evento
    await this.puntosRepo.inicializarSiNoExiste(
      vehicleUpper,
      rol,
      idEvento,
      documento || null,
      nombreParticipante || null
    );

    return guardado;
  }
}
