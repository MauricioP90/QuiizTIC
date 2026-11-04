import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { VehiculoSchema } from './VehiculoSchema.js';
import { PreguntaSchema } from './PreguntaSchema.js';

@Entity({ name: 'registro_respuestas' })
export class RegistroRespuestaSchema {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: 'id_evento', type: 'int', default: 1 })
  idEvento!: number;

  @Column({ name: 'numero_vehiculo', type: 'varchar', length: 50 })
  numeroVehiculo!: string;

  @Column({ type: 'enum', enum: ['PROPIETARIO', 'OPERADOR'] })
  rol!: 'PROPIETARIO' | 'OPERADOR';

  @Column({ name: 'documento', type: 'varchar', length: 50, nullable: true })
  documento!: string | null;

  @Column({ name: 'nombre_participante', type: 'varchar', length: 150, nullable: true })
  nombreParticipante!: string | null;

  @Column({ name: 'id_pregunta', type: 'varchar', length: 50 })
  idPregunta!: string;

  @Column({ type: 'enum', enum: ['ACERTO', 'FALLO', 'EXPIRADO'] })
  resultado!: 'ACERTO' | 'FALLO' | 'EXPIRADO';

  @Column({ type: 'int' })
  puntos!: number;

  @CreateDateColumn({ name: 'respondido_en', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  respondidoEn!: Date;

  // Relaciones
  @ManyToOne(() => VehiculoSchema, { onDelete: 'CASCADE', nullable: true, createForeignKeyConstraints: false })
  @JoinColumn([
    { name: 'numero_vehiculo', referencedColumnName: 'numeroVehiculo' },
    { name: 'rol', referencedColumnName: 'rol' }
  ])
  vehiculo?: VehiculoSchema;

  @ManyToOne(() => PreguntaSchema, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'id_pregunta' })
  pregunta!: PreguntaSchema;
}
