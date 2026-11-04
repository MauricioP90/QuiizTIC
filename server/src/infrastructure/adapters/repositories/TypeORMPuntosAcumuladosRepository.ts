import { IPuntosAcumuladosRepository } from '../../../domain/ports/IPuntosAcumuladosRepository.js';
import { PuntosAcumulados } from '../../../domain/entities/PuntosAcumulados.js';
import { RolParticipante } from '../../../domain/entities/Vehiculo.js';
import { AppDataSource } from '../db/DataSource.js';
import { PuntosAcumuladosSchema } from '../db/entities/PuntosAcumuladosSchema.js';

export class TypeORMPuntosAcumuladosRepository implements IPuntosAcumuladosRepository {
  private get repo() {
    return AppDataSource.getRepository(PuntosAcumuladosSchema);
  }

  async inicializarSiNoExiste(
    numeroVehiculo: string,
    rol: RolParticipante,
    idEvento: number = 1,
    documento?: string | null,
    nombreParticipante?: string | null
  ): Promise<void> {
    const existing = await this.repo.findOne({ where: { numeroVehiculo, rol, idEvento } });
    if (!existing) {
      const schema = new PuntosAcumuladosSchema();
      schema.numeroVehiculo = numeroVehiculo;
      schema.rol = rol;
      schema.idEvento = idEvento;
      schema.documento = documento || null;
      schema.nombreParticipante = nombreParticipante || null;
      schema.preguntasAcertadas = 0;
      schema.preguntasErradas = 0;
      schema.totalPreguntas = 0;
      schema.totalPuntosAcumulados = 0;
      await this.repo.save(schema);
    }
  }

  async obtenerPorVehiculo(numeroVehiculo: string, rol: RolParticipante, idEvento: number = 1): Promise<PuntosAcumulados | null> {
    const schema = await this.repo.findOne({ where: { numeroVehiculo, rol, idEvento } });
    if (!schema) return null;

    return new PuntosAcumulados(
      schema.numeroVehiculo,
      schema.rol,
      schema.preguntasAcertadas,
      schema.preguntasErradas,
      schema.totalPreguntas,
      schema.totalPuntosAcumulados,
      schema.idEvento,
      schema.documento,
      schema.nombreParticipante
    );
  }

  async actualizarPuntaje(
    numeroVehiculo: string,
    rol: RolParticipante,
    resultado: 'ACERTO' | 'FALLO' | 'EXPIRADO',
    puntos: number,
    idEvento: number = 1,
    documento?: string | null,
    nombreParticipante?: string | null
  ): Promise<void> {
    let entry = await this.repo.findOne({ where: { numeroVehiculo, rol, idEvento } });
    if (!entry) {
      entry = new PuntosAcumuladosSchema();
      entry.numeroVehiculo = numeroVehiculo;
      entry.rol = rol;
      entry.idEvento = idEvento;
      entry.documento = documento || null;
      entry.nombreParticipante = nombreParticipante || null;
      entry.preguntasAcertadas = 0;
      entry.preguntasErradas = 0;
      entry.totalPreguntas = 0;
      entry.totalPuntosAcumulados = 0;
    } else {
      if (documento && !entry.documento) entry.documento = documento;
      if (nombreParticipante && !entry.nombreParticipante) entry.nombreParticipante = nombreParticipante;
    }

    entry.totalPreguntas += 1;
    if (resultado === 'ACERTO') {
      entry.preguntasAcertadas += 1;
    } else {
      entry.preguntasErradas += 1;
    }
    entry.totalPuntosAcumulados += puntos;
    await this.repo.save(entry);
  }

  async obtenerTop10(idEvento: number = 1): Promise<PuntosAcumulados[]> {
    const schemas = await this.repo.find({
      where: { idEvento },
      order: {
        totalPuntosAcumulados: 'DESC',
        preguntasAcertadas: 'DESC'
      },
      take: 10
    });

    return schemas.map(
      (schema) =>
        new PuntosAcumulados(
          schema.numeroVehiculo,
          schema.rol,
          schema.preguntasAcertadas,
          schema.preguntasErradas,
          schema.totalPreguntas,
          schema.totalPuntosAcumulados,
          schema.idEvento,
          schema.documento,
          schema.nombreParticipante
        )
    );
  }
}
