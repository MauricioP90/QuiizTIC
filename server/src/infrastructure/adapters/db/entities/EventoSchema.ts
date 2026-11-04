import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity({ name: 'eventos' })
export class EventoSchema {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar', length: 150 })
  nombre!: string;

  @Column({ type: 'text', nullable: true })
  descripcion!: string | null;

  @Column({ name: 'fecha_inicio', type: 'datetime', nullable: true })
  fechaInicio!: Date | null;

  @Column({ name: 'fecha_fin', type: 'datetime', nullable: true })
  fechaFin!: Date | null;

  @Column({ type: 'text' })
  categorias!: string;

  @Column({ type: 'varchar', length: 50, default: 'cyber' })
  tema!: string;

  @Column({ name: 'tipo_registro', type: 'varchar', length: 20, default: 'VEHICULO' })
  tipoRegistro!: 'VEHICULO' | 'CEDULA';

  @Column({ type: 'boolean', default: false })
  activo!: boolean;

  @CreateDateColumn({ name: 'creado_en', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  creadoEn!: Date;
}
