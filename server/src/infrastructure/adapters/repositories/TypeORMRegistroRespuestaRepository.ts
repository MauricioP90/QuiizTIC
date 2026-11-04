import { IRegistroRespuestaRepository } from '../../../domain/ports/IRegistroRespuestaRepository.js';
import { RegistroRespuesta, RegistroRespuestaDetallado } from '../../../domain/entities/RegistroRespuesta.js';
import { RolParticipante } from '../../../domain/entities/Vehiculo.js';
import { AppDataSource } from '../db/DataSource.js';
import { RegistroRespuestaSchema } from '../db/entities/RegistroRespuestaSchema.js';

export class TypeORMRegistroRespuestaRepository implements IRegistroRespuestaRepository {
  private get repo() {
    return AppDataSource.getRepository(RegistroRespuestaSchema);
  }

  async guardar(registro: RegistroRespuesta): Promise<RegistroRespuesta> {
    const schema = new RegistroRespuestaSchema();
    schema.numeroVehiculo = registro.numeroVehiculo;
    schema.rol = registro.rol;
    schema.idPregunta = registro.idPregunta;
    schema.resultado = registro.resultado;
    schema.puntos = registro.puntos;
    schema.idEvento = registro.idEvento || 1;
    schema.documento = registro.documento || null;
    schema.nombreParticipante = registro.nombreParticipante || null;

    const guardado = await this.repo.save(schema);

    return new RegistroRespuesta(
      guardado.id,
      guardado.numeroVehiculo,
      guardado.rol,
      guardado.idPregunta,
      guardado.resultado,
      guardado.puntos,
      guardado.idEvento,
      guardado.documento,
      guardado.nombreParticipante,
      guardado.respondidoEn
    );
  }

  async obtenerUltimasPorVehiculo(
    numeroVehiculo: string,
    rol: RolParticipante,
    limite: number,
    idEvento?: number
  ): Promise<RegistroRespuestaDetallado[]> {
    const where: any = { numeroVehiculo, rol };
    if (idEvento) {
      where.idEvento = idEvento;
    }

    const schemas = await this.repo.find({
      relations: { pregunta: true },
      where,
      order: { respondidoEn: 'DESC' },
      take: limite
    });

    return schemas.map(
      (schema) =>
        new RegistroRespuestaDetallado(
          schema.idPregunta,
          schema.resultado,
          schema.puntos,
          schema.pregunta?.contexto || '',
          schema.pregunta?.tipoPractica || 'BUENA',
          schema.pregunta?.riesgoBeneficio || '',
          schema.pregunta?.recomendacion || ''
        )
    );
  }
}
