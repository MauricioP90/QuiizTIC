import { IEventoRepository } from '../../../domain/ports/IEventoRepository.js';
import { Evento, TipoRegistro } from '../../../domain/entities/Evento.js';
import { AppDataSource } from '../db/DataSource.js';
import { EventoSchema } from '../db/entities/EventoSchema.js';
import { PreguntaSchema } from '../db/entities/PreguntaSchema.js';

export class TypeORMEventoRepository implements IEventoRepository {
  private get repo() {
    return AppDataSource.getRepository(EventoSchema);
  }

  private get preguntaRepo() {
    return AppDataSource.getRepository(PreguntaSchema);
  }

  async obtenerActivo(): Promise<Evento | null> {
    const schema = await this.repo.findOne({ where: { activo: true } });
    if (!schema) return null;
    return this.mapToDomain(schema);
  }

  async listarTodos(): Promise<Evento[]> {
    const schemas = await this.repo.find({ order: { id: 'DESC' } });
    return schemas.map((s) => this.mapToDomain(s));
  }

  async obtenerPorId(id: number): Promise<Evento | null> {
    const schema = await this.repo.findOne({ where: { id } });
    if (!schema) return null;
    return this.mapToDomain(schema);
  }

  async crear(data: Omit<Evento, 'id' | 'creadoEn'>): Promise<Evento> {
    const schema = new EventoSchema();
    schema.nombre = data.nombre;
    schema.descripcion = data.descripcion || null;
    schema.fechaInicio = data.fechaInicio || null;
    schema.fechaFin = data.fechaFin || null;
    schema.categorias = Array.isArray(data.categorias) ? data.categorias.join(',') : '';
    schema.tema = data.tema || 'macarena';
    schema.tipoRegistro = data.tipoRegistro || 'VEHICULO';
    schema.mostrarRanking = data.mostrarRanking !== undefined ? Boolean(data.mostrarRanking) : true;
    schema.activo = Boolean(data.activo);

    if (schema.activo) {
      await AppDataSource.query(`UPDATE eventos SET activo = 0 WHERE activo = 1`);
    }

    const guardado = await this.repo.save(schema);
    return this.mapToDomain(guardado);
  }

  async actualizar(evento: Evento): Promise<Evento> {
    const schema = await this.repo.findOne({ where: { id: evento.id } });
    if (!schema) {
      throw new Error(`Evento con ID ${evento.id} no encontrado.`);
    }

    schema.nombre = evento.nombre;
    schema.descripcion = evento.descripcion || null;
    schema.fechaInicio = evento.fechaInicio || null;
    schema.fechaFin = evento.fechaFin || null;
    schema.categorias = Array.isArray(evento.categorias) ? evento.categorias.join(',') : '';
    schema.tema = evento.tema || 'macarena';
    schema.tipoRegistro = evento.tipoRegistro || 'VEHICULO';
    schema.mostrarRanking = evento.mostrarRanking !== undefined ? Boolean(evento.mostrarRanking) : true;

    if (evento.activo) {
      await AppDataSource.query(`UPDATE eventos SET activo = 0 WHERE activo = 1`);
    }
    schema.activo = Boolean(evento.activo);

    const guardado = await this.repo.save(schema);
    return this.mapToDomain(guardado);
  }

  async activarEvento(id: number): Promise<void> {
    await AppDataSource.query(`UPDATE eventos SET activo = 0 WHERE activo = 1`);
    await AppDataSource.query(`UPDATE eventos SET activo = 1 WHERE id = ?`, [id]);
  }

  async obtenerCategoriasDisponibles(): Promise<string[]> {
    try {
      const rows = await AppDataSource.query(`
        SELECT DISTINCT categoria 
        FROM preguntas 
        WHERE categoria IS NOT NULL AND TRIM(categoria) <> ''
        ORDER BY categoria ASC
      `);

      const categories = rows
        .map((r: any) => {
          const val = r.categoria ?? r.CATEGORIA ?? Object.values(r)[0];
          return val ? String(val).trim() : '';
        })
        .filter((cat: string) => cat.length > 0);

      if (categories.length > 0) {
        return categories;
      }
    } catch (sqlError) {
      console.warn('Advertencia en query SQL directo de categorías:', sqlError);
    }

    try {
      const items = await this.preguntaRepo.find({
        select: { categoria: true }
      });
      const unique = Array.from(
        new Set(
          items
            .map((i) => (i.categoria ? i.categoria.trim() : ''))
            .filter((c) => c.length > 0)
        )
      );
      if (unique.length > 0) {
        return unique.sort();
      }
    } catch (repoError) {
      console.warn('Advertencia en repo.find de categorías:', repoError);
    }

    return [];
  }

  private mapToDomain(schema: EventoSchema): Evento {
    const categorias = schema.categorias
      ? schema.categorias.split(',').map((c) => c.trim()).filter(Boolean)
      : [];

    return new Evento(
      schema.id,
      schema.nombre,
      schema.descripcion,
      schema.fechaInicio,
      schema.fechaFin,
      categorias,
      schema.tema || 'macarena',
      (schema.tipoRegistro as TipoRegistro) || 'VEHICULO',
      Boolean(schema.activo),
      schema.mostrarRanking !== undefined ? Boolean(schema.mostrarRanking) : true,
      schema.creadoEn
    );
  }
}
