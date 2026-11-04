import { Evento } from '../entities/Evento.js';

export interface IEventoRepository {
  obtenerActivo(): Promise<Evento | null>;
  listarTodos(): Promise<Evento[]>;
  obtenerPorId(id: number): Promise<Evento | null>;
  crear(evento: Omit<Evento, 'id' | 'creadoEn'>): Promise<Evento>;
  actualizar(evento: Evento): Promise<Evento>;
  activarEvento(id: number): Promise<void>;
  obtenerCategoriasDisponibles(): Promise<string[]>;
}

