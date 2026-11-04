import React, { useState } from 'react';
import { BaseButton } from '../../shared/components/BaseButton';
import { Car, ChevronRight, UserCheck, IdCard, Search, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import registroImg from '../../assets/registro.png';
import { useActiveEvent } from '../../shared/context/EventContext';
import { getApiUrl } from '../../infrastructure/utils/apiHelper';

interface ValidatedPersona {
  documento: string;
  nombres: string;
  apellidos: string;
  nombreCompleto: string;
  estado: string;
}

interface RegistrationViewProps {
  onRegister: (
    numeroVehiculo: string,
    rol: 'PROPIETARIO' | 'OPERADOR',
    documento?: string | null,
    nombreParticipante?: string | null
  ) => Promise<void>;
  onBack: () => void;
}

export const RegistrationView: React.FC<RegistrationViewProps> = ({ onRegister, onBack }) => {
  const { activeEvent, theme } = useActiveEvent();
  const isCedulaMode = activeEvent?.tipoRegistro === 'CEDULA';

  // Modo Vehículo
  const [numeroVehiculo, setNumeroVehiculo] = useState('');
  const [rol, setRol] = useState<'PROPIETARIO' | 'OPERADOR'>('PROPIETARIO');

  // Modo Cédula / Persona
  const [documento, setDocumento] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  const [validatedPersona, setValidatedPersona] = useState<ValidatedPersona | null>(null);

  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Validación de Cédula contra el backend (permisos.personas)
  const handleValidateDocumento = async () => {
    const docLimpio = documento.trim();
    if (!docLimpio) {
      setError('Por favor ingresa tu número de cédula.');
      return;
    }

    setError(null);
    setIsValidating(true);
    setValidatedPersona(null);

    try {
      const res = await fetch(getApiUrl(`/api/participants/validate/${encodeURIComponent(docLimpio)}`));
      const data = await res.json();

      if (res.ok && data.valid && data.persona) {
        setValidatedPersona(data.persona);
      } else {
        setError(data.error || 'El número de cédula no se encuentra registrado o no está en estado ACTIVO.');
      }
    } catch (err: any) {
      console.error('Error al validar documento:', err);
      setError('Error al conectar con la base de datos de personas. Intenta nuevamente.');
    } finally {
      setIsValidating(false);
    }
  };

  // Envío del Formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (isCedulaMode) {
      if (!validatedPersona) {
        setError('Debes validar tu cédula antes de ingresar.');
        return;
      }

      setIsSubmitting(true);
      try {
        await onRegister(
          validatedPersona.documento,
          'OPERADOR',
          validatedPersona.documento,
          validatedPersona.nombreCompleto
        );
      } catch (err: any) {
        setError(err?.message || 'Error al registrar al participante.');
        setIsSubmitting(false);
      }
    } else {
      // Modo Vehículo
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
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-4 md:p-8 animate-fade-in-up">
      <div className="w-full max-w-lg glass-panel p-8 md:p-10 rounded-3xl relative overflow-hidden shadow-2xl border border-slate-800">
        {/* Glow Effects dinámicos */}
        <div className={`absolute -top-24 -right-24 w-48 h-48 ${theme.glowTopLeft} rounded-full blur-3xl`} />
        <div className={`absolute -bottom-24 -left-24 w-48 h-48 ${theme.glowBottomRight} rounded-full blur-3xl`} />

        {/* Badge superior */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold mb-4 bg-slate-900/60 border border-slate-700 text-slate-300">
          <span>{activeEvent?.nombre || 'QuizzTIC'}</span>
          <span>•</span>
          <span className="text-amber-400">
            {isCedulaMode ? 'Identificación por Cédula' : 'Identificación por Vehículo'}
          </span>
        </div>

        <h2 className={`text-2xl md:text-3xl font-black mb-2 text-transparent bg-clip-text bg-gradient-to-r ${theme.titleGradient}`}>
          {isCedulaMode ? 'Ingreso de Colaborador' : 'Registro de Participante'}
        </h2>
        <p className="text-xs md:text-sm text-slate-400 mb-6">
          {isCedulaMode
            ? 'Ingresa tu número de documento para validar tus datos en el sistema institucional.'
            : 'Ingresa los datos del vehículo y tu rol para iniciar la evaluación táctica de escenarios.'}
        </p>

        <div className="flex justify-center mb-6">
          <img
            src={registroImg}
            alt="Hero Registration"
            className="w-32 h-32 md:w-36 md:h-36 object-contain animate-float shadow-character"
          />
        </div>

        {error && (
          <div className="mb-6 p-3.5 bg-rose-950/60 border border-rose-800/60 rounded-xl text-rose-300 text-xs md:text-sm font-semibold flex items-center gap-2.5 animate-shake">
            <AlertCircle className="w-5 h-5 shrink-0 text-rose-400" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5 text-left">
          {/* ======================= MODO CÉDULA ======================= */}
          {isCedulaMode ? (
            <>
              {/* Campo 1: Cédula */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                  Número de Cédula / Documento *
                </label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-500">
                      <IdCard className="w-5 h-5" />
                    </span>
                    <input
                      type="text"
                      value={documento}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, '');
                        setDocumento(val);
                        if (validatedPersona && val !== validatedPersona.documento) {
                          setValidatedPersona(null);
                        }
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleValidateDocumento();
                        }
                      }}
                      placeholder="Ej. 1014234567"
                      className="w-full pl-11 pr-4 py-3.5 bg-slate-950/70 border border-slate-700 focus:border-amber-500 rounded-xl text-white text-base font-mono placeholder-slate-600 focus:outline-none transition-colors"
                      disabled={isSubmitting || isValidating}
                      autoFocus
                    />
                  </div>

                  <button
                    type="button"
                    onClick={handleValidateDocumento}
                    disabled={isValidating || !documento.trim()}
                    className="px-4 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-bold flex items-center gap-1.5 transition-all disabled:opacity-50"
                  >
                    {isValidating ? (
                      <Loader2 className="w-4 h-4 animate-spin text-amber-400" />
                    ) : (
                      <Search className="w-4 h-4 text-amber-400" />
                    )}
                    <span>Validar</span>
                  </button>
                </div>
              </div>

              {/* Campo 2: Nombre Completo (Autocompletado con Validación) */}
              {validatedPersona && (
                <div className="p-4 rounded-2xl bg-emerald-950/30 border border-emerald-500/40 text-emerald-200 animate-fade-in shadow-inner">
                  <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 mb-1">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Colaborador Identificado</span>
                  </div>
                  <h4 className="text-base font-extrabold text-white">
                    {validatedPersona.nombreCompleto}
                  </h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Documento: <span className="font-mono text-slate-300 font-semibold">{validatedPersona.documento}</span> • Estado: <span className="text-emerald-400 font-bold">{validatedPersona.estado}</span>
                  </p>
                </div>
              )}
            </>
          ) : (
            /* ======================= MODO VEHÍCULO ======================= */
            <>
              {/* Número de Vehículo */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
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
                      const onlyNums = e.target.value.replace(/\D/g, '').slice(0, 4);
                      setNumeroVehiculo(onlyNums);
                    }}
                    placeholder="Ej. 7400"
                    maxLength={4}
                    className="w-full pl-11 pr-4 py-3.5 bg-slate-950/70 border border-slate-700 focus:border-amber-500 rounded-xl text-white font-mono text-base placeholder-slate-600 focus:outline-none transition-colors"
                    disabled={isSubmitting}
                    autoFocus
                  />
                </div>
              </div>

              {/* Rol / Relación */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                  Rol del Participante *
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setRol('PROPIETARIO')}
                    className={`py-3 px-4 rounded-xl border text-sm font-bold flex items-center justify-center gap-2 transition-all ${
                      rol === 'PROPIETARIO'
                        ? 'bg-amber-500/20 border-amber-500 text-amber-300 shadow-md ring-1 ring-amber-500/30'
                        : 'bg-slate-950/50 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <UserCheck className="w-4 h-4" />
                    <span>Propietario</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setRol('OPERADOR')}
                    className={`py-3 px-4 rounded-xl border text-sm font-bold flex items-center justify-center gap-2 transition-all ${
                      rol === 'OPERADOR'
                        ? 'bg-amber-500/20 border-amber-500 text-amber-300 shadow-md ring-1 ring-amber-500/30'
                        : 'bg-slate-950/50 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <Car className="w-4 h-4" />
                    <span>Operador</span>
                  </button>
                </div>
              </div>
            </>
          )}

          {/* Botones de acción */}
          <div className="pt-2 space-y-3">
            <button
              type="submit"
              disabled={isSubmitting || (isCedulaMode && !validatedPersona)}
              className={`w-full py-4 text-base font-extrabold rounded-xl transition-all transform active:scale-95 flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed shadow-xl ${theme.primaryButton}`}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Iniciando Trivia...</span>
                </>
              ) : (
                <>
                  <span>Comenzar Desafío</span>
                  <ChevronRight className="w-5 h-5" />
                </>
              )}
            </button>

            <BaseButton
              variant="ghost"
              type="button"
              fullWidth
              onClick={onBack}
              disabled={isSubmitting}
              className="text-xs text-slate-400 hover:text-slate-200"
            >
              Volver al Inicio
            </BaseButton>
          </div>
        </form>
      </div>
    </div>
  );
};
