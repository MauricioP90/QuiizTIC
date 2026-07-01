import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity({ name: 'preguntas' })
export class PreguntaSchema {
  @PrimaryColumn({ type: 'varchar', length: 50 })
  id!: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  categoria!: string | null;

  @Column({ type: 'varchar', length: 100, nullable: true })
  subcategoria!: string | null;

  @Column({ type: 'enum', enum: ['BUENA', 'MALA'], name: 'tipo_practica' })
  tipoPractica!: 'BUENA' | 'MALA';

  @Column({ type: 'text' })
  contexto!: string;

  @Column({ type: 'text', name: 'riesgo_beneficio' })
  riesgoBeneficio!: string;

  @Column({ type: 'text' })
  recomendacion!: string;
}
