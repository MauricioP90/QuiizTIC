import { IVehiculoRepository } from '../../domain/ports/IVehiculoRepository.js';
import { IPuntosAcumuladosRepository } from '../../domain/ports/IPuntosAcumuladosRepository.js';
import { Vehiculo, RolParticipante } from '../../domain/entities/Vehiculo.js';

export class RegistrarVehiculo {
  constructor(
    private readonly vehiculoRepo: IVehiculoRepository,
    private readonly puntosRepo: IPuntosAcumuladosRepository
  ) {}

  async execute(numeroVehiculo: string, rol: RolParticipante): Promise<Vehiculo> {
    const vehicleUpper = numeroVehiculo.trim().toUpperCase();
    const vehiculo = new Vehiculo(vehicleUpper, rol);
    
    // Guardar o actualizar datos de vehiculo
    const guardado = await this.vehiculoRepo.guardarOActualizar(vehiculo);
    
    // Inicializar puntos acumulados en cero si no existe el registro de acumulados
    await this.puntosRepo.inicializarSiNoExiste(vehicleUpper, rol);

    return guardado;
  }
}
