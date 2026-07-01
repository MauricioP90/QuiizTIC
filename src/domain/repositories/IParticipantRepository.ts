import type { Participant } from '../entities/Participant';

export interface IParticipantRepository {
  getParticipant(): Promise<Participant | null>;
  saveParticipant(participant: Participant): Promise<void>;
  clearParticipant(): Promise<void>;
}
