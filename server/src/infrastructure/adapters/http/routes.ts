import { Router } from 'express';
import { ScenarioController } from './controllers/ScenarioController.js';
import { ParticipantController } from './controllers/ParticipantController.js';
import { ResultsController } from './controllers/ResultsController.js';
import { LeaderboardController } from './controllers/LeaderboardController.js';
import { EventController } from './controllers/EventController.js';

export function createRouter(
  scenarioCtrl: ScenarioController,
  participantCtrl: ParticipantController,
  resultsCtrl: ResultsController,
  leaderboardCtrl: LeaderboardController,
  eventCtrl: EventController
): Router {
  const router = Router();

  // Escenarios y Trivia
  router.get('/scenarios', (req, res) => scenarioCtrl.getScenario(req, res));
  router.post('/register', (req, res) => participantCtrl.register(req, res));
  router.post('/answers', (req, res) => participantCtrl.answer(req, res));
  router.get('/results/:vehiculo', (req, res) => resultsCtrl.getResults(req, res));
  router.get('/leaderboard', (req, res) => leaderboardCtrl.getLeaderboard(req, res));

  // Validación de Personas / Cédula
  router.get('/participants/validate/:documento', (req, res) => participantCtrl.validatePersona(req, res));

  // Gestión de Eventos y Configuración
  router.get('/events/active', (req, res) => eventCtrl.getActiveEvent(req, res));
  router.get('/events/categories', (req, res) => eventCtrl.getCategories(req, res));
  router.get('/events', (req, res) => eventCtrl.listEvents(req, res));
  router.post('/events', (req, res) => eventCtrl.createEvent(req, res));
  router.put('/events/:id', (req, res) => eventCtrl.updateEvent(req, res));
  router.post('/events/:id/activate', (req, res) => eventCtrl.activateEvent(req, res));

  return router;
}
