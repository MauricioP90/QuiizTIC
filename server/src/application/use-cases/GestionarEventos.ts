import { IEventoRepository } from '../../domain/ports/IEventoRepository.js';
import { Evento, TipoRegistro } from '../../domain/entities/Evento.js';

export class GestionarEventos {
  constructor(private readonly eventoRepo: IEventoRepository) {}

  async obtenerActivo(): Promise<Evento | null> {
    return this.eventoRepo.obtenerActivo();
  }

  async listarTodos(): Promise<Evento[]> {
    return this.eventoRepo.listarTodos();
  }

  async obtenerPorId(id: number): Promise<Evento | null> {
    return this.eventoRepo.obtenerPorId(id);
  }

  async crear(data: {
    nombre: string;
    descripcion?: string | null;
    fechaInicio?: Date | null;
    fechaFin?: Date | null;
    categorias: string[];
    tema: string;
    tipoRegistro?: TipoRegistro;
    activo: boolean;
  }): Promise<Evento> {
    return this.eventoRepo.crear({
      nombre: data.nombre.trim(),
      descripcion: data.descripcion ? data.descripcion.trim() : null,
      fechaInicio: data.fechaInicio || null,
      fechaFin: data.fechaFin || null,
      categorias: data.categorias || [],
      tema: data.tema || 'macarena',
      tipoRegistro: data.tipoRegistro || 'VEHICULO',
      activo: Boolean(data.activo)
    });
  }

  async actualizar(data: {
    id: number;
    nombre: string;
    descripcion?: string | null;
    fechaInicio?: Date | null;
    fechaFin?: Date | null;
    categorias: string[];
    tema: string;
    tipoRegistro?: TipoRegistro;
    activo: boolean;
  }): Promise<Evento> {
    const evento = new Evento(
      data.id,
      data.nombre.trim(),
      data.descripcion ? data.descripcion.trim() : null,
      data.fechaInicio || null,
      data.fechaFin || null,
      data.categorias || [],
      data.tema || 'macarena',
      data.tipoRegistro || 'VEHICULO',
      Boolean(data.activo)
    );
    return this.eventoRepo.actualizar(evento);
  }

  async activar(id: number): Promise<void> {
    return this.eventoRepo.activarEvento(id);
  }

  async obtenerCategoriasDisponibles(): Promise<string[]> {
    return this.eventoRepo.obtenerCategoriasDisponibles();
  }
}
