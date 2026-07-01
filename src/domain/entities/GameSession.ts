import type { Scenario } from './Scenario';

export interface GameSession {
  scenarios: Scenario[];
  currentIndex: number;
  score: number;
  answers: { [scenarioId: string]: 'BUENA' | 'MALA' | 'EXPIRED' | null };
  isGameOver: boolean;
}
