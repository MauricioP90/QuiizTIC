import { Vehiculo } from '../../domain/entities/Vehiculo.js';

export interface IVehiculoRepository {
  guardarOActualizar(vehiculo: Vehiculo): Promise<Vehiculo>;
}
