export interface Participant {
  uuid: string;
  numeroVehiculo: string;
  rol: 'PROPIETARIO' | 'OPERADOR';
  registradoEn: Date;
}
