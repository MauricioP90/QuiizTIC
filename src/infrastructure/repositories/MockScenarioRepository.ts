import type { Scenario } from '../../domain/entities/Scenario';
import type { IScenarioRepository } from '../../domain/repositories/IScenarioRepository';
import { getApiUrl } from '../utils/apiHelper';

export class MockScenarioRepository implements IScenarioRepository {
  async getAllScenarios(vehicleId?: string, rol?: string): Promise<Scenario[]> {
    try {
      const baseUrl = getApiUrl('/api/scenarios');
      let url = baseUrl;
      const params: string[] = [];
      if (vehicleId) params.push(`vehiculo=${encodeURIComponent(vehicleId)}`);
      if (rol) params.push(`rol=${encodeURIComponent(rol)}`);
      if (params.length > 0) {
        url = `${baseUrl}?${params.join('&')}`;
      }
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Error al obtener escenarios desde la API');
      }
      return await response.json() as Scenario[];
    } catch (error) {
      console.error('API Error, falling back to local JSON scenarios:', error);
      // Importación dinámica como fallback si el backend no responde
      const scenariosData = await import('../data/scenarios.json');
      return scenariosData.default as Scenario[];
    }
  }

  async getScenariosByCampaign(_campaignId: string): Promise<Scenario[]> {
    return this.getAllScenarios();
  }
}
