export type TipoRegistro = 'VEHICULO' | 'CEDULA';

export class Evento {
  constructor(
    public readonly id: number,
    public readonly nombre: string,
    public readonly descripcion: string | null,
    public readonly fechaInicio: Date | null,
    public readonly fechaFin: Date | null,
    public readonly categorias: string[],
    public readonly tema: string,
    public readonly tipoRegistro: TipoRegistro,
    public readonly activo: boolean,
    public readonly creadoEn?: Date
  ) {}
}
