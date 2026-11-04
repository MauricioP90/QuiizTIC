import { IPersonaRepository, PersonaValidada } from '../../../domain/ports/IPersonaRepository.js';
import { AppDataSource } from '../db/DataSource.js';
import mysql from 'mysql2/promise';

export class TypeORMPersonaRepository implements IPersonaRepository {
  private permisosDbName = process.env.DB_PERMISOS_NAME || 'permisos';

  async buscarPorDocumento(documento: string): Promise<PersonaValidada | null> {
    const docLimpio = documento.trim();
    if (!docLimpio) return null;

    // Intento 1: Consulta directa a través del DataSource existente (cross-database)
    try {
      const sql = `
        SELECT nombres, apellidos, documento, estado 
        FROM ${this.permisosDbName}.personas 
        WHERE TRIM(documento) = ? AND UPPER(TRIM(estado)) = 'ACTIVO'
        LIMIT 1
      `;
      const rows = await AppDataSource.query(sql, [docLimpio]);
      if (rows && rows.length > 0) {
        return this.mapToPersona(rows[0]);
      }
    } catch (err) {
      console.warn(`Advertencia al consultar ${this.permisosDbName}.personas vía DataSource, intentando conexión directa:`, err);
    }

    // Intento 2: Conexión dedicada a la base de datos permisos si el pool actual no tiene permisos cruzados
    try {
      const connection = await mysql.createConnection({
        host: process.env.DB_HOST || '10.10.20.115',
        port: parseInt(process.env.DB_PORT || '6446'),
        user: process.env.DB_USER || 'user',
        password: process.env.DB_PASSWORD,
        database: this.permisosDbName
      });

      const [rows]: any = await connection.execute(
        `SELECT nombres, apellidos, documento, estado 
         FROM personas 
         WHERE TRIM(documento) = ? AND UPPER(TRIM(estado)) = 'ACTIVO' 
         LIMIT 1`,
        [docLimpio]
      );

      await connection.end();

      if (rows && rows.length > 0) {
        return this.mapToPersona(rows[0]);
      }
    } catch (directErr) {
      console.error('Error al consultar tabla personas en base de datos permisos:', directErr);
    }

    return null;
  }

  private mapToPersona(row: any): PersonaValidada {
    const nombres = String(row.nombres || '').trim();
    const apellidos = String(row.apellidos || '').trim();
    const nombreCompleto = `${nombres} ${apellidos}`.trim();
    const documento = String(row.documento || '').trim();
    const estado = String(row.estado || '').trim();

    return {
      documento,
      nombres,
      apellidos,
      nombreCompleto,
      estado
    };
  }
}

