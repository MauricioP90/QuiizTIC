import type { Scenario } from '../entities/Scenario';

export interface IScenarioRepository {
  getAllScenarios(vehicleId?: string, rol?: string): Promise<Scenario[]>;
  getScenariosByCampaign(campaignId: string): Promise<Scenario[]>;
}
