import type { Participant } from '../../domain/entities/Participant';
import type { IParticipantRepository } from '../../domain/repositories/IParticipantRepository';

export class RegisterNewParticipant {
  private participantRepo: IParticipantRepository;

  constructor(participantRepo: IParticipantRepository) {
    this.participantRepo = participantRepo;
  }

  async execute(
    numeroVehiculo: string,
    rol: 'PROPIETARIO' | 'OPERADOR',
    documento?: string | null,
    nombreParticipante?: string | null
  ): Promise<Participant> {
    if (!numeroVehiculo.trim()) throw new Error('El número de identificación o vehículo es requerido.');

    const uuid = typeof crypto !== 'undefined' && crypto.randomUUID 
      ? crypto.randomUUID() 
      : Math.random().toString(36).substring(2, 15);
      
    const participant: Participant = {
      uuid,
      numeroVehiculo: numeroVehiculo.trim(),
      rol,
      documento: documento || null,
      nombreParticipante: nombreParticipante || null,
      registradoEn: new Date()
    };

    await this.participantRepo.saveParticipant(participant);
    return participant;
  }
}
