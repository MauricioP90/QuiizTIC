import React, { useState, useEffect } from 'react';
import { BaseButton } from '../../shared/components/BaseButton';
import { Trophy, ShieldAlert, Loader2, ArrowLeft, RefreshCw, Car } from 'lucide-react';
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

const FRONTEND_PIN = '14789'; // PIN esperado por el backend para autorizar la petición

export const LeaderboardView: React.FC = () => {
  const [error, setError] = useState<string | null>(null);
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const handleGoBack = () => {
    if (window.location.search.includes('leaderboard')) {
      window.location.search = '';
    } else {
      window.location.pathname = '/';
    }
  };

  const fetchRanking = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(getApiUrl('/api/leaderboard'), {
        headers: {
          'x-admin-pin': FRONTEND_PIN
        }
      });
      if (response.ok) {
        const data = await response.json();
        setEntries(data);
      } else {
        throw new Error('Error al obtener la tabla de posiciones desde el servidor.');
      }
    } catch (err: any) {
      setError(err?.message || 'Error al conectar con el servidor.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRanking();
  }, []);

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
              onClick={handleGoBack}
              className="flex items-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Volver</span>
            </BaseButton>
          </div>
        </div>

        {/* Cuerpo / Tabla */}
        <div className="overflow-x-auto rounded-2xl border border-slate-800/60 bg-slate-950/20">
          {loading ? (
            <div className="py-24 flex flex-col items-center justify-center text-center gap-4">
              <Loader2 className="w-12 h-12 animate-spin text-indigo-500" />
              <span className="text-sm font-semibold tracking-wider text-slate-400 uppercase">
                Cargando posiciones...
              </span>
            </div>
          ) : error ? (
            <div className="py-16 flex flex-col items-center justify-center text-center px-4">
              <ShieldAlert className="w-12 h-12 text-rose-500 mb-4 animate-bounce" />
              <p className="text-rose-400 font-semibold text-sm mb-2">
                {error}
              </p>
              <button
                onClick={fetchRanking}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold transition-colors"
              >
                Reintentar
              </button>
            </div>
          ) : entries.length === 0 ? (
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
