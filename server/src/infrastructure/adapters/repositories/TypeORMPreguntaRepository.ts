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

  async obtenerAleatoriaNoRespondida(numeroVehiculo?: string, rol?: RolParticipante): Promise<Pregunta | null> {
    const query = this.repo.createQueryBuilder('pregunta').orderBy('RAND()');

    if (numeroVehiculo && rol) {
      query.where((qb) => {
        const subQuery = qb
          .subQuery()
          .select('r.id_pregunta')
          .from(RegistroRespuestaSchema, 'r')
          .where('r.numero_vehiculo = :vehiculo AND r.rol = :rol')
          .getQuery();
        return 'pregunta.id NOT IN ' + subQuery;
      });
      query.setParameters({ vehiculo: numeroVehiculo, rol });
    }

    let schema = await query.getOne();

    // Fallback: si ya las respondió todas, devolver cualquier pregunta aleatoria
    if (!schema && numeroVehiculo) {
      schema = await this.repo
        .createQueryBuilder('pregunta')
        .orderBy('RAND()')
        .getOne();
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
