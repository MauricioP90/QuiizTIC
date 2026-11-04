import 'reflect-metadata';
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { AppDataSource } from './infrastructure/adapters/db/DataSource.js';
import { initializeDatabaseSchema } from './infrastructure/adapters/db/initDb.js';

// Repositorios (Adaptadores secundarios)
import { TypeORMPreguntaRepository } from './infrastructure/adapters/repositories/TypeORMPreguntaRepository.js';
import { TypeORMVehiculoRepository } from './infrastructure/adapters/repositories/TypeORMVehiculoRepository.js';
import { TypeORMRegistroRespuestaRepository } from './infrastructure/adapters/repositories/TypeORMRegistroRespuestaRepository.js';
import { TypeORMPuntosAcumuladosRepository } from './infrastructure/adapters/repositories/TypeORMPuntosAcumuladosRepository.js';
import { TypeORMEventoRepository } from './infrastructure/adapters/repositories/TypeORMEventoRepository.js';
import { TypeORMPersonaRepository } from './infrastructure/adapters/repositories/TypeORMPersonaRepository.js';

// Casos de Uso (Aplicación)
import { ObtenerEscenarios } from './application/use-cases/ObtenerEscenarios.js';
import { RegistrarVehiculo } from './application/use-cases/RegistrarVehiculo.js';
import { ProcesarRespuesta } from './application/use-cases/ProcesarRespuesta.js';
import { ObtenerResultados } from './application/use-cases/ObtenerResultados.js';
import { ObtenerLeaderboard } from './application/use-cases/ObtenerLeaderboard.js';
import { GestionarEventos } from './application/use-cases/GestionarEventos.js';
import { ValidarPersona } from './application/use-cases/ValidarPersona.js';

// Controladores (Adaptadores primarios)
import { ScenarioController } from './infrastructure/adapters/http/controllers/ScenarioController.js';
import { ParticipantController } from './infrastructure/adapters/http/controllers/ParticipantController.js';
import { ResultsController } from './infrastructure/adapters/http/controllers/ResultsController.js';
import { LeaderboardController } from './infrastructure/adapters/http/controllers/LeaderboardController.js';
import { EventController } from './infrastructure/adapters/http/controllers/EventController.js';

// Rutas
import { createRouter } from './infrastructure/adapters/http/routes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Instanciar adaptadores secundarios (persistencia)
const preguntaRepo = new TypeORMPreguntaRepository();
const vehiculoRepo = new TypeORMVehiculoRepository();
const registroRepo = new TypeORMRegistroRespuestaRepository();
const puntosRepo = new TypeORMPuntosAcumuladosRepository();
const eventoRepo = new TypeORMEventoRepository();
const personaRepo = new TypeORMPersonaRepository();

// Instanciar casos de uso (aplicación)
const obtenerEscenarios = new ObtenerEscenarios(preguntaRepo, eventoRepo);
const registrarVehiculo = new RegistrarVehiculo(vehiculoRepo, puntosRepo, eventoRepo);
const procesarRespuesta = new ProcesarRespuesta(preguntaRepo, registroRepo, puntosRepo, eventoRepo);
const obtenerResultados = new ObtenerResultados(puntosRepo, registroRepo, eventoRepo);
const obtenerLeaderboard = new ObtenerLeaderboard(puntosRepo, eventoRepo);
const gestionarEventos = new GestionarEventos(eventoRepo);
const validarPersona = new ValidarPersona(personaRepo);

// Instanciar adaptadores primarios (controladores HTTP)
const scenarioController = new ScenarioController(obtenerEscenarios);
const participantController = new ParticipantController(registrarVehiculo, procesarRespuesta, validarPersona);
const resultsController = new ResultsController(obtenerResultados);
const leaderboardController = new LeaderboardController(obtenerLeaderboard);
const eventController = new EventController(gestionarEventos);

// Montar el enrutador
const router = createRouter(
  scenarioController,
  participantController,
  resultsController,
  leaderboardController,
  eventController
);
app.use('/api', router);

// Servir archivos estáticos del frontend en producción
app.use(express.static(path.join(__dirname, '../../dist')));

// Fallback de SPA
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api')) {
    return next();
  }
  res.sendFile(path.join(__dirname, '../../dist/index.html'));
});

// Inicializar TypeORM y levantar el servidor Express
AppDataSource.initialize()
  .then(async () => {
    console.log('Conexión a la base de datos inicializada con éxito mediante TypeORM.');
    await initializeDatabaseSchema(AppDataSource);
    app.listen(Number(PORT), '0.0.0.0', () => {
      console.log(`Servidor QuizzTIC backend corriendo en http://0.0.0.0:${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Error durante la inicialización del DataSource de TypeORM:', error);
    process.exit(1);
  });
