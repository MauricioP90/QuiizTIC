export type RolParticipante = 'PROPIETARIO' | 'OPERADOR';

export class Vehiculo {
  constructor(
    public readonly numeroVehiculo: string,
    public readonly rol: RolParticipante,
    public readonly registradoEn?: Date
  ) {
    this.validar();
  }

  private validar(): void {
    const esNumeroDeCuatroDigitos = /^\d{4}$/;
    if (!esNumeroDeCuatroDigitos.test(this.numeroVehiculo)) {
      throw new Error('El número de vehículo debe constar de exactamente 4 dígitos numéricos.');
    }
  }
}
