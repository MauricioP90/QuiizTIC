import type { Scenario } from '../../domain/entities/Scenario';
import type { IScenarioRepository } from '../../domain/repositories/IScenarioRepository';

export class GetRandomScenarios {
  private scenarioRepo: IScenarioRepository;

  constructor(scenarioRepo: IScenarioRepository) {
    this.scenarioRepo = scenarioRepo;
  }

  async execute(limit: number = 5, vehicleId?: string, rol?: string): Promise<Scenario[]> {
    const all = await this.scenarioRepo.getAllScenarios(vehicleId, rol);
    const shuffled = [...all].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, limit);
  }
}
