export interface PersonaValidada {
  documento: string;
  nombres: string;
  apellidos: string;
  nombreCompleto: string;
  estado: string;
}

export interface IPersonaRepository {
  buscarPorDocumento(documento: string): Promise<PersonaValidada | null>;
}

