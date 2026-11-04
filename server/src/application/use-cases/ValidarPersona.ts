import { IPersonaRepository, PersonaValidada } from '../../domain/ports/IPersonaRepository.js';

export class ValidarPersona {
  constructor(private readonly personaRepo: IPersonaRepository) {}

  async execute(documento: string): Promise<PersonaValidada | null> {
    if (!documento || !documento.trim()) {
      return null;
    }
    return this.personaRepo.buscarPorDocumento(documento.trim());
  }
}

