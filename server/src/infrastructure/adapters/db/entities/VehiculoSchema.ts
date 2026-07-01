import { Entity, PrimaryColumn, Column, CreateDateColumn } from 'typeorm';

@Entity({ name: 'vehiculos' })
export class VehiculoSchema {
  @PrimaryColumn({ type: 'varchar', length: 50, name: 'numero_vehiculo' })
  numeroVehiculo!: string;

  @PrimaryColumn({ type: 'enum', enum: ['PROPIETARIO', 'OPERADOR'] })
  rol!: 'PROPIETARIO' | 'OPERADOR';

  @CreateDateColumn({ name: 'registrado_en', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  registradoEn!: Date;
}
