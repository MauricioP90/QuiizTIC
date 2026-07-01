import React, { useState } from 'react';
import { BaseButton } from '../../shared/components/BaseButton';
import { Trophy, ShieldAlert, ShieldCheck, KeyRound, Loader2, ArrowLeft, RefreshCw, Car } from 'lucide-react';
import { getApiUrl } from '../../infrastructure/utils/apiHelper';
import vaciosImg from '../../assets/vacios.png';

interface LeaderboardEntry {
  numeroVehiculo: string;
  rol: 'PROPIETARIO' | 'OPERADOR';
  preguntasAcertadas: number;
  preguntasErradas: number;
  totalPreguntas: number;
  totalPuntosAcumulados: number;
}

export const LeaderboardView: React.FC = () => {
  const [pinInput, setPinInput] = useState('');
  const [authorizedPin, setAuthorizedPin] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(false);

  const handleVerifyPin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await fetch(getApiUrl('/api/leaderboard'), {
        headers: {
          'x-admin-pin': pinInput
        }
      });

      if (response.status === 401) {
        setError('PIN de administrador incorrecto. Acceso denegado.');
        setPinInput('');
      } else if (!response.ok) {
        throw new Error('Error al obtener la tabla de posiciones.');
      } else {
        const data = await response.json();
        setEntries(data);
        setAuthorizedPin(pinInput);
      }
    } catch (err: any) {
      setError(err?.message || 'Error de conexión con el servidor.');
    } finally {
      setLoading(false);
    }
  };

  const fetchRanking = async () => {
    if (!authorizedPin) return;
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(getApiUrl('/api/leaderboard'), {
        headers: {
          'x-admin-pin': authorizedPin
        }
      });
      if (response.ok) {
        const data = await response.json();
        setEntries(data);
      } else {
        throw new Error('Error al actualizar el ranking.');
      }
    } catch (err: any) {
      setError(err?.message || 'Error al conectar con el servidor.');
    } finally {
      setLoading(false);
    }
  };

  // Pantalla de Ingreso de PIN
  if (!authorizedPin) {
    return (
      <div className="flex-grow flex flex-col items-center justify-center p-4 md:p-8 animate-fade-in-up">
        <div className="w-full max-w-md glass-panel p-8 rounded-3xl text-center relative overflow-hidden">
          {/* Glow effects */}
          <div className="absolute -top-24 -left-24 w-48 h-48 bg-indigo-600/10 rounded-full blur-3xl" />
          
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-indigo-500/10 rounded-2xl border border-indigo-500/20 shadow-inner">
              <KeyRound className="w-12 h-12 text-indigo-400" />
            </div>
          </div>

          <h2 className="text-2xl font-black text-slate-100 mb-2">Acceso Administrativo</h2>
          <p className="text-sm text-slate-400 mb-6">
            Ingresa el código PIN para desplegar la Tabla de Posiciones oficial.
          </p>

          {error && (
            <div className="mb-5 p-3 bg-rose-950/40 border border-rose-800/40 rounded-xl text-rose-300 text-sm font-semibold flex items-center justify-center gap-2">
              <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleVerifyPin} className="space-y-4">
            <input
              type="password"
              inputMode="numeric"
              pattern="[0-9]*"
              value={pinInput}
              onChange={(e) => setPinInput(e.target.value.replace(/\D/g, ''))}
              placeholder="PIN de Seguridad"
              className="w-full text-center tracking-widest text-lg py-3.5 bg-slate-950/60 hover:bg-slate-950/80 focus:bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl text-slate-200 focus:outline-none transition-colors"
              disabled={loading}
              maxLength={10}
            />

            <BaseButton
              type="submit"
              variant="primary"
              disabled={loading || !pinInput}
              className="w-full py-3.5 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Verificando...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-5 h-5" />
                  <span>Verificar Identidad</span>
                </>
              )}
            </BaseButton>
          </form>

          <button
            onClick={() => window.location.search = ''}
            className="mt-6 inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-slate-200 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Volver a la Trivia
          </button>
        </div>
      </div>
    );
  }

  // Pantalla de Leaderboard (Top 10)
  return (
    <div className="flex-grow max-w-4xl w-full mx-auto p-4 md:p-8 animate-fade-in">
      <div className="glass-panel p-6 md:p-10 rounded-3xl relative overflow-hidden shadow-2xl">
        {/* Glow effects */}
        <div className="absolute -top-32 -right-32 w-64 h-64 bg-cyan-600/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-indigo-600/10 rounded-full blur-3xl" />

        {/* Encabezado */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8 pb-6 border-b border-slate-800/60">
          <div className="text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-3 mb-1.5">
              <Trophy className="w-8 h-8 text-amber-400 animate-pulse" />
              <h2 className="text-3xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-indigo-200 to-cyan-300">
                Tabla de Posiciones
              </h2>
            </div>
            <p className="text-sm text-slate-400">
              Evaluación Táctica de Ciberseguridad 101 - Top 10 Histórico
            </p>
          </div>
          
          <div className="flex gap-3">
            <button
              onClick={fetchRanking}
              disabled={loading}
              className="p-3 bg-slate-900/60 hover:bg-slate-800/60 border border-slate-800 text-slate-400 hover:text-slate-200 rounded-xl transition-all disabled:opacity-50"
              title="Actualizar ranking"
            >
              <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <BaseButton
              variant="ghost"
              onClick={() => window.location.search = ''}
              className="flex items-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Volver</span>
            </BaseButton>
          </div>
        </div>

        {/* Cuerpo / Tabla */}
        <div className="overflow-x-auto rounded-2xl border border-slate-800/60 bg-slate-950/20">
          {entries.length === 0 ? (
            <div className="py-16 flex flex-col items-center justify-center text-center px-4">
              <img 
                src={vaciosImg} 
                alt="Sin registros" 
                className="w-36 h-36 object-contain animate-float shadow-character mb-4" 
              />
              <p className="text-slate-400 font-semibold text-sm">
                No hay registros de puntuaciones todavía en el día.
              </p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800/80 bg-slate-900/40 text-slate-400 text-xs font-bold uppercase tracking-wider">
                  <th className="py-4 px-5 text-center w-16">Puesto</th>
                  <th className="py-4 px-6">Vehículo</th>
                  <th className="py-4 px-6">Rol</th>
                  <th className="py-4 px-6 text-center">Efectividad</th>
                  <th className="py-4 px-6 text-right">Puntos</th>
                </tr>
              </thead>
              <tbody>
                {entries.map((entry, index) => {
                  const rank = index + 1;
                  let rankBadge = '';
                  let rowStyle = 'hover:bg-slate-900/20 transition-colors border-b border-slate-850';
                  
                  if (rank === 1) {
                    rankBadge = 'bg-amber-400 text-slate-950 font-black';
                    rowStyle = 'bg-amber-500/5 hover:bg-amber-500/10 transition-colors border-b border-slate-800/80';
                  } else if (rank === 2) {
                    rankBadge = 'bg-slate-300 text-slate-950 font-black';
                    rowStyle = 'bg-slate-300/5 hover:bg-slate-300/10 transition-colors border-b border-slate-800/80';
                  } else if (rank === 3) {
                    rankBadge = 'bg-amber-700 text-white font-black';
                    rowStyle = 'bg-amber-700/5 hover:bg-amber-700/10 transition-colors border-b border-slate-800/80';
                  } else {
                    rankBadge = 'bg-slate-800 text-slate-400 font-bold';
                  }

                  return (
                    <tr key={`${entry.numeroVehiculo}-${entry.rol}`} className={rowStyle}>
                      {/* Puesto */}
                      <td className="py-4 px-5 text-center">
                        <span className={`inline-flex items-center justify-center w-7 h-7 rounded-lg text-xs ${rankBadge}`}>
                          {rank}
                        </span>
                      </td>

                      {/* Vehículo */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2 text-slate-200 font-extrabold">
                          <Car className="w-4 h-4 text-indigo-400 shrink-0" />
                          <span>{entry.numeroVehiculo}</span>
                        </div>
                      </td>

                      {/* Rol */}
                      <td className="py-4 px-6 text-sm">
                        <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider ${
                          entry.rol === 'PROPIETARIO' 
                            ? 'bg-violet-500/10 text-violet-400 border border-violet-500/20' 
                            : 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
                        }`}>
                          {entry.rol === 'PROPIETARIO' ? 'Propietario' : 'Operador'}
                        </span>
                      </td>

                      {/* Efectividad (Aciertos / Total) */}
                      <td className="py-4 px-6 text-center text-sm font-semibold text-slate-300">
                        <span>{entry.preguntasAcertadas}</span>
                        <span className="text-slate-500 font-normal"> / {entry.totalPreguntas}</span>
                      </td>

                      {/* Puntos */}
                      <td className="py-4 px-6 text-right text-base font-black text-transparent bg-clip-text bg-gradient-to-r from-violet-300 to-indigo-300">
                        {entry.totalPuntosAcumulados} pts
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};
