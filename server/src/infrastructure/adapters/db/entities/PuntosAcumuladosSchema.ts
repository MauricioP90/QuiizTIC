import { Entity, PrimaryColumn, Column, OneToOne, JoinColumn } from 'typeorm';
import { VehiculoSchema } from './VehiculoSchema.js';

@Entity({ name: 'puntos_acumulados' })
export class PuntosAcumuladosSchema {
  @PrimaryColumn({ name: 'numero_vehiculo', type: 'varchar', length: 50 })
  numeroVehiculo!: string;

  @PrimaryColumn({ type: 'enum', enum: ['PROPIETARIO', 'OPERADOR'] })
  rol!: 'PROPIETARIO' | 'OPERADOR';

  @Column({ name: 'preguntas_acertadas', type: 'int', default: 0 })
  preguntasAcertadas!: number;

  @Column({ name: 'preguntas_erradas', type: 'int', default: 0 })
  preguntasErradas!: number;

  @Column({ name: 'total_preguntas', type: 'int', default: 0 })
  totalPreguntas!: number;

  @Column({ name: 'total_puntos_acumulados', type: 'int', default: 0 })
  totalPuntosAcumulados!: number;

  @OneToOne(() => VehiculoSchema, { onDelete: 'CASCADE' })
  @JoinColumn([
    { name: 'numero_vehiculo', referencedColumnName: 'numeroVehiculo' },
    { name: 'rol', referencedColumnName: 'rol' }
  ])
  vehiculo!: VehiculoSchema;
}
