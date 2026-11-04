import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { VehiculoSchema } from './VehiculoSchema.js';

@Entity({ name: 'puntos_acumulados' })
export class PuntosAcumuladosSchema {
  @PrimaryColumn({ name: 'numero_vehiculo', type: 'varchar', length: 50 })
  numeroVehiculo!: string;

  @PrimaryColumn({ type: 'enum', enum: ['PROPIETARIO', 'OPERADOR'] })
  rol!: 'PROPIETARIO' | 'OPERADOR';

  @PrimaryColumn({ name: 'id_evento', type: 'int', default: 1 })
  idEvento!: number;

  @Column({ name: 'documento', type: 'varchar', length: 50, nullable: true })
  documento!: string | null;

  @Column({ name: 'nombre_participante', type: 'varchar', length: 150, nullable: true })
  nombreParticipante!: string | null;

  @Column({ name: 'preguntas_acertadas', type: 'int', default: 0 })
  preguntasAcertadas!: number;

  @Column({ name: 'preguntas_erradas', type: 'int', default: 0 })
  preguntasErradas!: number;

  @Column({ name: 'total_preguntas', type: 'int', default: 0 })
  totalPreguntas!: number;

  @Column({ name: 'total_puntos_acumulados', type: 'int', default: 0 })
  totalPuntosAcumulados!: number;

  @ManyToOne(() => VehiculoSchema, { onDelete: 'CASCADE', nullable: true, createForeignKeyConstraints: false })
  @JoinColumn([
    { name: 'numero_vehiculo', referencedColumnName: 'numeroVehiculo' },
    { name: 'rol', referencedColumnName: 'rol' }
  ])
  vehiculo?: VehiculoSchema;
}
