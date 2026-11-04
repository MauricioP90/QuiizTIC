export interface Participant {
  uuid: string;
  numeroVehiculo: string;
  rol: 'PROPIETARIO' | 'OPERADOR';
  documento?: string | null;
  nombreParticipante?: string | null;
  registradoEn: Date;
}
