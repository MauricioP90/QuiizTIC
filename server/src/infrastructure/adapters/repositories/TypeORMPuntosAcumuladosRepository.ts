import { IPuntosAcumuladosRepository } from '../../../domain/ports/IPuntosAcumuladosRepository.js';
import { PuntosAcumulados } from '../../../domain/entities/PuntosAcumulados.js';
import { RolParticipante } from '../../../domain/entities/Vehiculo.js';
import { AppDataSource } from '../db/DataSource.js';
import { PuntosAcumuladosSchema } from '../db/entities/PuntosAcumuladosSchema.js';

export class TypeORMPuntosAcumuladosRepository implements IPuntosAcumuladosRepository {
  private get repo() {
    return AppDataSource.getRepository(PuntosAcumuladosSchema);
  }

  async inicializarSiNoExiste(numeroVehiculo: string, rol: RolParticipante): Promise<void> {
    const existing = await this.repo.findOne({ where: { numeroVehiculo, rol } });
    if (!existing) {
      const schema = new PuntosAcumuladosSchema();
      schema.numeroVehiculo = numeroVehiculo;
      schema.rol = rol;
      schema.preguntasAcertadas = 0;
      schema.preguntasErradas = 0;
      schema.totalPreguntas = 0;
      schema.totalPuntosAcumulados = 0;
      await this.repo.save(schema);
    }
  }

  async obtenerPorVehiculo(numeroVehiculo: string, rol: RolParticipante): Promise<PuntosAcumulados | null> {
    const schema = await this.repo.findOne({ where: { numeroVehiculo, rol } });
    if (!schema) return null;

    return new PuntosAcumulados(
      schema.numeroVehiculo,
      schema.rol,
      schema.preguntasAcertadas,
      schema.preguntasErradas,
      schema.totalPreguntas,
      schema.totalPuntosAcumulados
    );
  }

  async actualizarPuntaje(numeroVehiculo: string, rol: RolParticipante, resultado: 'ACERTO' | 'FALLO' | 'EXPIRADO', puntos: number): Promise<void> {
    const entry = await this.repo.findOne({ where: { numeroVehiculo, rol } });
    if (entry) {
      entry.totalPreguntas += 1;
      if (resultado === 'ACERTO') {
        entry.preguntasAcertadas += 1;
      } else {
        entry.preguntasErradas += 1;
      }
      entry.totalPuntosAcumulados += puntos;
      await this.repo.save(entry);
    }
  }

  async obtenerTop10(): Promise<PuntosAcumulados[]> {
    const schemas = await this.repo.find({
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
          schema.totalPuntosAcumulados
        )
    );
  }
}
