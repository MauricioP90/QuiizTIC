import { Request, Response } from 'express';
import { GestionarEventos } from '../../../../application/use-cases/GestionarEventos.js';

export class EventController {
  constructor(private readonly gestionarEventosUseCase: GestionarEventos) {}

  private isAuthorized(req: Request): boolean {
    const adminPin = req.headers['x-admin-pin'];
    const expectedPin = process.env.ADMIN_PIN || '14789';
    return adminPin === expectedPin;
  }

  private parseSafeDate(val: any): Date | null {
    if (!val) return null;
    const d = new Date(val);
    return isNaN(d.getTime()) ? null : d;
  }

  async getActiveEvent(req: Request, res: Response): Promise<void> {
    try {
      const active = await this.gestionarEventosUseCase.obtenerActivo();
      if (!active) {
        res.json({
          id: 1,
          nombre: 'CiberTrivia Macarena',
          descripcion: 'Campaña general de concientización',
          fechaInicio: null,
          fechaFin: null,
          categorias: [],
          tema: 'macarena',
          tipoRegistro: 'VEHICULO',
          activo: true
        });
        return;
      }
      res.json(active);
    } catch (error: any) {
      console.error('Error al obtener evento activo:', error);
      res.status(500).json({ error: error?.message || 'Error interno al obtener evento activo.' });
    }
  }

  async listEvents(req: Request, res: Response): Promise<void> {
    if (!this.isAuthorized(req)) {
      res.status(401).json({ error: 'No autorizado. PIN de administrador inválido.' });
      return;
    }

    try {
      const events = await this.gestionarEventosUseCase.listarTodos();
      res.json(events);
    } catch (error: any) {
      console.error('Error al listar eventos:', error);
      res.status(500).json({ error: error?.message || 'Error interno al listar eventos.' });
    }
  }

  async getCategories(req: Request, res: Response): Promise<void> {
    try {
      const categories = await this.gestionarEventosUseCase.obtenerCategoriasDisponibles();
      res.json(categories);
    } catch (error: any) {
      console.error('Error al obtener categorías disponibles:', error);
      res.status(500).json({ error: error?.message || 'Error interno al obtener categorías.' });
    }
  }

  async createEvent(req: Request, res: Response): Promise<void> {
    if (!this.isAuthorized(req)) {
      res.status(401).json({ error: 'No autorizado. PIN de administrador inválido.' });
      return;
    }

    const { nombre, descripcion, fechaInicio, fechaFin, categorias, tema, tipoRegistro, activo } = req.body;
    if (!nombre || !nombre.trim()) {
      res.status(400).json({ error: 'El nombre del evento es obligatorio.' });
      return;
    }

    try {
      const created = await this.gestionarEventosUseCase.crear({
        nombre,
        descripcion,
        fechaInicio: this.parseSafeDate(fechaInicio),
        fechaFin: this.parseSafeDate(fechaFin),
        categorias: Array.isArray(categorias) ? categorias : [],
        tema: tema || 'macarena',
        tipoRegistro: tipoRegistro || 'VEHICULO',
        activo: Boolean(activo)
      });
      res.status(201).json(created);
    } catch (error: any) {
      console.error('Error al crear evento:', error);
      res.status(500).json({ error: error?.message || 'Error interno al crear evento.' });
    }
  }

  async updateEvent(req: Request, res: Response): Promise<void> {
    if (!this.isAuthorized(req)) {
      res.status(401).json({ error: 'No autorizado. PIN de administrador inválido.' });
      return;
    }

    const id = parseInt(req.params.id);
    const { nombre, descripcion, fechaInicio, fechaFin, categorias, tema, tipoRegistro, activo } = req.body;

    if (isNaN(id) || !nombre || !nombre.trim()) {
      res.status(400).json({ error: 'Parámetros inválidos para actualizar el evento.' });
      return;
    }

    try {
      const updated = await this.gestionarEventosUseCase.actualizar({
        id,
        nombre,
        descripcion,
        fechaInicio: this.parseSafeDate(fechaInicio),
        fechaFin: this.parseSafeDate(fechaFin),
        categorias: Array.isArray(categorias) ? categorias : [],
        tema: tema || 'macarena',
        tipoRegistro: tipoRegistro || 'VEHICULO',
        activo: Boolean(activo)
      });
      res.json(updated);
    } catch (error: any) {
      console.error('Error al actualizar evento:', error);
      res.status(500).json({ error: error?.message || 'Error interno al actualizar evento.' });
    }
  }

  async activateEvent(req: Request, res: Response): Promise<void> {
    if (!this.isAuthorized(req)) {
      res.status(401).json({ error: 'No autorizado. PIN de administrador inválido.' });
      return;
    }

    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      res.status(400).json({ error: 'ID de evento inválido.' });
      return;
    }

    try {
      await this.gestionarEventosUseCase.activar(id);
      res.json({ message: `Evento ${id} activado exitosamente.` });
    } catch (error: any) {
      console.error('Error al activar evento:', error);
      res.status(500).json({ error: error?.message || 'Error interno al activar evento.' });
    }
  }
}
