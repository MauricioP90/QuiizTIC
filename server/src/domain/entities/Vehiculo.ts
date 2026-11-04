export type RolParticipante = 'PROPIETARIO' | 'OPERADOR';

export class Vehiculo {
  constructor(
    public readonly numeroVehiculo: string,
    public readonly rol: RolParticipante,
    public readonly registradoEn?: Date,
    public readonly esDocumento: boolean = false
  ) {
    this.validar();
  }

  private validar(): void {
    if (this.esDocumento) {
      if (!/^\d+$/.test(this.numeroVehiculo)) {
        throw new Error('El número de documento debe contener solo dígitos.');
      }
      return;
    }
    const esNumeroDeCuatroDigitos = /^\d{4}$/;
    if (!esNumeroDeCuatroDigitos.test(this.numeroVehiculo)) {
      throw new Error('El número de vehículo debe constar de exactamente 4 dígitos numéricos.');
    }
  }
}
