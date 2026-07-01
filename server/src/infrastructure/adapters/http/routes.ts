import { Router } from 'express';
import { ScenarioController } from './controllers/ScenarioController.js';
import { ParticipantController } from './controllers/ParticipantController.js';
import { ResultsController } from './controllers/ResultsController.js';
import { LeaderboardController } from './controllers/LeaderboardController.js';

export function createRouter(
  scenarioCtrl: ScenarioController,
  participantCtrl: ParticipantController,
  resultsCtrl: ResultsController,
  leaderboardCtrl: LeaderboardController
): Router {
  const router = Router();

  router.get('/scenarios', (req, res) => scenarioCtrl.getScenario(req, res));
  router.post('/register', (req, res) => participantCtrl.register(req, res));
  router.post('/answers', (req, res) => participantCtrl.answer(req, res));
  router.get('/results/:vehiculo', (req, res) => resultsCtrl.getResults(req, res));
  router.get('/leaderboard', (req, res) => leaderboardCtrl.getLeaderboard(req, res));

  return router;
}
