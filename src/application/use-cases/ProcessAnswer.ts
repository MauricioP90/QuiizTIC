import type { GameSession } from '../../domain/entities/GameSession';
import { GameLogicService } from '../../domain/services/GameLogicService';

export class ProcessAnswer {
  execute(
    session: GameSession,
    answer: 'BUENA' | 'MALA' | 'EXPIRED' | null
  ): GameSession {
    const currentScenario = session.scenarios[session.currentIndex];
    if (!currentScenario) return session;

    const answers = { ...session.answers, [currentScenario.id]: answer };
    let score = session.score;

    if (answer !== null && GameLogicService.validateAnswer(answer, currentScenario.tipoPractica)) {
      score += 1;
    }

    const nextIndex = session.currentIndex + 1;
    const isGameOver = nextIndex >= session.scenarios.length;

    return {
      scenarios: session.scenarios,
      currentIndex: nextIndex,
      score,
      answers,
      isGameOver
    };
  }
}
