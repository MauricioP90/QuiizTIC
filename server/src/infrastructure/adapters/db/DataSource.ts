import { DataSource } from 'typeorm';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

import { PreguntaSchema } from './entities/PreguntaSchema.js';
import { VehiculoSchema } from './entities/VehiculoSchema.js';
import { RegistroRespuestaSchema } from './entities/RegistroRespuestaSchema.js';
import { PuntosAcumuladosSchema } from './entities/PuntosAcumuladosSchema.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Cargar variables de entorno
dotenv.config({ path: path.join(__dirname, '../../../../.env') });

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306'),
  username: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'quizztic',
  synchronize: false, // No alterar las tablas creadas manualmente por el usuario
  logging: false,
  entities: [
    PreguntaSchema,
    VehiculoSchema,
    RegistroRespuestaSchema,
    PuntosAcumuladosSchema
  ],
  subscribers: [],
  migrations: [],
  // Pool de conexiones: soporta múltiples usuarios simultáneos
  extra: {
    connectionLimit: 20,      // Máximo 20 conexiones abiertas al mismo tiempo
    acquireTimeout: 10000,    // Esperar hasta 10 seg si el pool está ocupado
    waitForConnections: true  // Encolar peticiones si no hay conexión disponible
  }
});
