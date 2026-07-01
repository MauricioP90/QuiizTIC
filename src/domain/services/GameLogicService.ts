export class GameLogicService {
  public static validateAnswer(
    selected: 'BUENA' | 'MALA' | 'EXPIRED' | null,
    correct: 'BUENA' | 'MALA'
  ): boolean {
    return selected === correct;
  }
}
