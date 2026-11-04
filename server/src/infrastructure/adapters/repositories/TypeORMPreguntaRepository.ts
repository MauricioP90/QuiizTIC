import { IPreguntaRepository } from '../../../domain/ports/IPreguntaRepository.js';
import { Pregunta } from '../../../domain/entities/Pregunta.js';
import { RolParticipante } from '../../../domain/entities/Vehiculo.js';
import { AppDataSource } from '../db/DataSource.js';
import { PreguntaSchema } from '../db/entities/PreguntaSchema.js';
import { RegistroRespuestaSchema } from '../db/entities/RegistroRespuestaSchema.js';

export class TypeORMPreguntaRepository implements IPreguntaRepository {
  private get repo() {
    return AppDataSource.getRepository(PreguntaSchema);
  }

  async obtenerAleatoriaNoRespondida(
    numeroVehiculo?: string,
    rol?: RolParticipante,
    idEvento: number = 1,
    categorias?: string[]
  ): Promise<Pregunta | null> {
    const query = this.repo.createQueryBuilder('pregunta').orderBy('RAND()');

    // 1. Filtrar por categorías permitidas si se especifican
    if (categorias && categorias.length > 0) {
      query.andWhere('pregunta.categoria IN (:...categorias)', { categorias });
    }

    // 2. Filtrar preguntas no respondidas para este vehículo, rol y evento
    if (numeroVehiculo && rol) {
      query.andWhere((qb) => {
        const subQuery = qb
          .subQuery()
          .select('r.id_pregunta')
          .from(RegistroRespuestaSchema, 'r')
          .where('r.numero_vehiculo = :vehiculo AND r.rol = :rol AND r.id_evento = :idEvento')
          .getQuery();
        return 'pregunta.id NOT IN ' + subQuery;
      });
      query.setParameters({ vehiculo: numeroVehiculo, rol, idEvento });
    }

    let schema = await query.getOne();

    // Fallback: si ya las respondió todas en este evento, devolver cualquier pregunta aleatoria del set permitido
    if (!schema && numeroVehiculo) {
      const fallbackQuery = this.repo.createQueryBuilder('pregunta').orderBy('RAND()');
      if (categorias && categorias.length > 0) {
        fallbackQuery.andWhere('pregunta.categoria IN (:...categorias)', { categorias });
      }
      schema = await fallbackQuery.getOne();
    }

    if (!schema) return null;

    return this.mapToDomain(schema);
  }

  async obtenerPorId(id: string): Promise<Pregunta | null> {
    const schema = await this.repo.findOne({ where: { id } });
    if (!schema) return null;
    return this.mapToDomain(schema);
  }

  private mapToDomain(schema: PreguntaSchema): Pregunta {
    return new Pregunta(
      schema.id,
      schema.categoria,
      schema.subcategoria,
      schema.tipoPractica,
      schema.contexto,
      schema.riesgoBeneficio,
      schema.recomendacion
    );
  }
}
