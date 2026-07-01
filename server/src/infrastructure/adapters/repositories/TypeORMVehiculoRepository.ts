import { IVehiculoRepository } from '../../../domain/ports/IVehiculoRepository.js';
import { Vehiculo } from '../../../domain/entities/Vehiculo.js';
import { AppDataSource } from '../db/DataSource.js';
import { VehiculoSchema } from '../db/entities/VehiculoSchema.js';

export class TypeORMVehiculoRepository implements IVehiculoRepository {
  private get repo() {
    return AppDataSource.getRepository(VehiculoSchema);
  }

  async guardarOActualizar(vehiculo: Vehiculo): Promise<Vehiculo> {
    const schema = new VehiculoSchema();
    schema.numeroVehiculo = vehiculo.numeroVehiculo;
    schema.rol = vehiculo.rol;

    // save() de TypeORM inserta o actualiza automáticamente según la clave primaria
    const guardado = await this.repo.save(schema);

    return new Vehiculo(guardado.numeroVehiculo, guardado.rol, guardado.registradoEn);
  }
}
