import React, { useState } from 'react';
import { BaseButton } from '../../shared/components/BaseButton';
import { Car, UserCheck, ChevronRight } from 'lucide-react';
import registroImg from '../../assets/registro.png';

interface RegistrationViewProps {
  onRegister: (numeroVehiculo: string, rol: 'PROPIETARIO' | 'OPERADOR') => Promise<void>;
  onBack: () => void;
}

export const RegistrationView: React.FC<RegistrationViewProps> = ({
  onRegister,
  onBack
}) => {
  const [numeroVehiculo, setNumeroVehiculo] = useState('');
  const [rol, setRol] = useState<'PROPIETARIO' | 'OPERADOR'>('PROPIETARIO');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const vehicleTrimmed = numeroVehiculo.trim();
    if (!vehicleTrimmed) {
      setError('Por favor, ingresa el número de vehículo.');
      return;
    }

    if (!/^\d{4}$/.test(vehicleTrimmed)) {
      setError('El número de vehículo debe constar de exactamente 4 dígitos numéricos.');
      return;
    }

    setIsSubmitting(true);
    try {
      await onRegister(vehicleTrimmed, rol);
    } catch (err: any) {
      setError(err?.message || 'Ocurrió un error al registrar al participante.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-4 md:p-8 animate-fade-in-up">
      <div className="w-full max-w-lg glass-panel p-8 rounded-3xl relative overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-violet-600/10 rounded-full blur-3xl" />

        <h2 className="text-2xl md:text-3xl font-extrabold text-slate-100 mb-2">
          Registro de Participante
        </h2>
        <p className="text-sm text-slate-400 mb-6">
          Ingresa los datos del vehículo y tu rol para iniciar la evaluación táctica de escenarios.
        </p>

        <div className="flex justify-center mb-6">
          <img 
            src={registroImg} 
            alt="Registration Hero" 
            className="w-36 h-36 object-contain animate-float shadow-character" 
          />
        </div>

        {error && (
          <div className="mb-6 p-3.5 bg-rose-950/50 border border-rose-800/40 rounded-xl text-rose-300 text-sm font-semibold">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Número de Vehículo Input */}
          <div className="space-y-1.5 text-left">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
              Número de Vehículo *
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-500">
                <Car className="w-5 h-5" />
              </span>
              <input
                type="text"
                value={numeroVehiculo}
                onChange={(e) => {
                  // Permitir solo dígitos y recortar a máximo 4 caracteres
                  const onlyNums = e.target.value.replace(/\D/g, '').slice(0, 4);
                  setNumeroVehiculo(onlyNums);
                }}
                placeholder="Ej. 7400"
                maxLength={4}
                className="w-full pl-11 pr-4 py-3.5 bg-slate-950/60 hover:bg-slate-950/80 focus:bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl text-slate-200 placeholder-slate-600 focus:outline-none transition-colors"
                disabled={isSubmitting}
              />
            </div>
          </div>

          {/* Rol / Relación Input */}
          <div className="space-y-1.5 text-left">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
              Rol del Participante *
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-500">
                <UserCheck className="w-5 h-5" />
              </span>
              <select
                value={rol}
                onChange={(e) => setRol(e.target.value as 'PROPIETARIO' | 'OPERADOR')}
                className="w-full pl-11 pr-4 py-3.5 bg-slate-950/60 hover:bg-slate-950/80 focus:bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl text-slate-200 placeholder-slate-600 focus:outline-none transition-colors appearance-none cursor-pointer"
                disabled={isSubmitting}
              >
                <option value="PROPIETARIO" className="bg-slate-950 text-slate-200">Propietario</option>
                <option value="OPERADOR" className="bg-slate-950 text-slate-200">Operador</option>
              </select>
            </div>
          </div>

          {/* Botones de Envío */}
          <div className="pt-4 flex flex-col sm:flex-row gap-3">
            <BaseButton
              type="button"
              variant="ghost"
              onClick={onBack}
              disabled={isSubmitting}
              className="sm:w-1/3"
            >
              Atrás
            </BaseButton>
            <BaseButton
              type="submit"
              variant="primary"
              disabled={isSubmitting}
              className="flex-1 flex items-center justify-center gap-1"
            >
              <span>{isSubmitting ? 'Registrando...' : '¡Jugar Ahora!'}</span>
              <ChevronRight className="w-5 h-5" />
            </BaseButton>
          </div>
        </form>
      </div>
    </div>
  );
};
