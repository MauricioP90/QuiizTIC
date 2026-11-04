import type { Participant } from '../../domain/entities/Participant';
import type { IParticipantRepository } from '../../domain/repositories/IParticipantRepository';
import { CookieManager } from '../database/CookieManager';
import { LocalStorageDb } from '../database/LocalStorageDb';
import { getApiUrl } from '../utils/apiHelper';

export class ApiParticipantRepository implements IParticipantRepository {
  private readonly COOKIE_NAME = 'quizz_participant';

  async getParticipant(): Promise<Participant | null> {
    const cookieVal = CookieManager.getCookie(this.COOKIE_NAME);
    if (cookieVal) {
      try {
        return JSON.parse(cookieVal) as Participant;
      } catch {
        // Ignorar y seguir al localStorage
      }
    }

    const lsVal = LocalStorageDb.getItem(this.COOKIE_NAME);
    if (lsVal) {
      try {
        const participant = JSON.parse(lsVal) as Participant;
        CookieManager.setCookie(this.COOKIE_NAME, lsVal, 7);
        return participant;
      } catch {
        // Ignorar
      }
    }

    return null;
  }

  async saveParticipant(participant: Participant): Promise<void> {
    // 1. Guardar localmente
    const serialized = JSON.stringify(participant);
    CookieManager.setCookie(this.COOKIE_NAME, serialized, 7);
    LocalStorageDb.setItem(this.COOKIE_NAME, serialized);

    // 2. Sincronizar con el backend
    try {
      const response = await fetch(getApiUrl('/api/register'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          numeroVehiculo: participant.numeroVehiculo,
          rol: participant.rol,
          documento: participant.documento || null,
          nombreParticipante: participant.nombreParticipante || null
        })
      });
      if (!response.ok) {
        throw new Error('Error al registrar participante en el backend');
      }
    } catch (error) {
      console.error('API Error al registrar participante, se usará el respaldo local:', error);
    }
  }

  async clearParticipant(): Promise<void> {
    CookieManager.eraseCookie(this.COOKIE_NAME);
    LocalStorageDb.removeItem(this.COOKIE_NAME);
  }
}
