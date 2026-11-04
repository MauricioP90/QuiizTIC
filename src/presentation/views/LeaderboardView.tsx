import React, { useState, useEffect } from 'react';
import { BaseButton } from '../../shared/components/BaseButton';
import { Trophy, ShieldAlert, Loader2, ArrowLeft, RefreshCw, Car, UserCheck } from 'lucide-react';
import { getApiUrl } from '../../infrastructure/utils/apiHelper';
import { useActiveEvent } from '../../shared/context/EventContext';
import vaciosImg from '../../assets/vacios.png';

interface LeaderboardEntry {
  numeroVehiculo: string;
  rol: 'PROPIETARIO' | 'OPERADOR';
  documento?: string | null;
  nombreParticipante?: string | null;
  preguntasAcertadas: number;
  preguntasErradas: number;
  totalPreguntas: number;
  totalPuntosAcumulados: number;
}

const FRONTEND_PIN = '14789'; // PIN esperado por el backend para autorizar la petición

export const LeaderboardView: React.FC = () => {
  const { activeEvent, theme } = useActiveEvent();
  const [error, setError] = useState<string | null>(null);
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const isCedulaMode = activeEvent?.tipoRegistro === 'CEDULA';

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
      const url = activeEvent?.id
        ? getApiUrl(`/api/leaderboard?evento=${activeEvent.id}`)
        : getApiUrl('/api/leaderboard');

      const response = await fetch(url, {
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
  }, [activeEvent?.id]);

  return (
    <div className="flex-grow max-w-4xl w-full mx-auto p-3 sm:p-6 md:p-8 animate-fade-in">
      <div className="glass-panel p-5 sm:p-8 md:p-10 rounded-3xl relative overflow-hidden shadow-2xl border border-slate-800">
        {/* Glow effects dinámicos del tema */}
        <div className={`absolute -top-32 -right-32 w-64 h-64 ${theme.glowTopLeft} rounded-full blur-3xl`} />
        <div className={`absolute -bottom-32 -left-32 w-64 h-64 ${theme.glowBottomRight} rounded-full blur-3xl`} />

        {/* Encabezado Principal */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6 pb-6 border-b border-slate-800/80">
          <div className="text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold mb-2 bg-slate-900/70 border border-slate-800 text-slate-300">
              <span className={theme.accentText}>{activeEvent?.nombre || 'QuizzTIC'}</span>
              <span>•</span>
              <span className="text-slate-400">
                {isCedulaMode ? '👤 Registro por Cédula' : '🚗 Registro por Vehículo'}
              </span>
            </div>

            <div className="flex items-center justify-center md:justify-start gap-3">
              <Trophy className="w-8 h-8 text-amber-400 animate-pulse shrink-0" />
              <h2 className={`text-2xl sm:text-3xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r ${theme.titleGradient}`}>
                Tabla de Posiciones
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Top 10 Oficial de Puntos Acumulados en este evento
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={fetchRanking}
              disabled={loading}
              className="p-3 bg-slate-900/60 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-slate-200 rounded-xl transition-all disabled:opacity-50 shadow-sm"
              title="Actualizar ranking"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <BaseButton
              variant="secondary"
              onClick={handleGoBack}
              className="flex items-center gap-1.5 text-xs font-semibold py-2.5 px-4"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Volver</span>
            </BaseButton>
          </div>
        </div>

        {/* Cuerpo / Tabla */}
        <div className="overflow-x-auto rounded-2xl border border-slate-800/80 bg-slate-950/40 shadow-inner">
          {loading ? (
            <div className="py-24 flex flex-col items-center justify-center text-center gap-4">
              <Loader2 className="w-12 h-12 animate-spin text-amber-400" />
              <span className="text-sm font-semibold tracking-wider text-slate-400 uppercase">
                Cargando posiciones...
              </span>
            </div>
          ) : error ? (
            <div className="py-16 flex flex-col items-center justify-center text-center px-4">
              <ShieldAlert className="w-12 h-12 text-rose-500 mb-4 animate-bounce" />
              <p className="text-rose-400 font-semibold text-sm mb-3">{error}</p>
              <button
                onClick={fetchRanking}
                className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-md ${theme.primaryButton}`}
              >
                Reintentar
              </button>
            </div>
          ) : entries.length === 0 ? (
            <div className="py-16 flex flex-col items-center justify-center text-center px-4">
              <img
                src={vaciosImg}
                alt="Sin registros"
                className="w-44 h-44 object-contain mx-auto mb-4 opacity-80 animate-float"
              />
              <h3 className="text-lg font-bold text-slate-200 mb-1">¡Sé el primero en el podio!</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto mb-4">
                Aún no hay puntuaciones registradas para este evento. ¡Empieza a responder los escenarios y lidera el ranking!
              </p>
              <button
                onClick={handleGoBack}
                className={`px-6 py-2.5 rounded-xl text-xs font-bold transition-all shadow-md ${theme.primaryButton}`}
              >
                Comenzar a Jugar
              </button>
            </div>
          ) : (
            <table className="w-full text-left border-collapse min-w-[580px]">
              <thead>
                <tr className="border-b border-slate-800/80 bg-slate-900/70 text-slate-400 text-xs font-bold uppercase tracking-wider">
                  <th className="py-4 px-5 text-center w-20">Puesto</th>
                  <th className="py-4 px-5">{isCedulaMode ? 'Colaborador' : 'Vehículo'}</th>
                  <th className="py-4 px-5 text-center">{isCedulaMode ? 'Documento' : 'Rol'}</th>
                  <th className="py-4 px-4 text-center">Aciertos</th>
                  <th className="py-4 px-4 text-center hidden sm:table-cell">Fallos</th>
                  <th className="py-4 px-5 text-right">Puntos Totales</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/40 text-sm">
                {entries.map((entry, index) => {
                  let rankBadge = `${index + 1}º`;
                  let rankStyle = 'text-slate-400 font-bold';
                  let rowBg = 'hover:bg-slate-900/30 transition-colors';

                  if (index === 0) {
                    rankBadge = '🥇 1º';
                    rankStyle = 'text-amber-300 font-black text-base';
                    rowBg = 'bg-amber-500/10 hover:bg-amber-500/15 border-l-4 border-amber-400 transition-colors';
                  } else if (index === 1) {
                    rankBadge = '🥈 2º';
                    rankStyle = 'text-slate-200 font-bold';
                    rowBg = 'bg-slate-300/5 hover:bg-slate-300/10 border-l-4 border-slate-400 transition-colors';
                  } else if (index === 2) {
                    rankBadge = '🥉 3º';
                    rankStyle = 'text-amber-600 font-bold';
                    rowBg = 'bg-amber-700/5 hover:bg-amber-700/10 border-l-4 border-amber-600 transition-colors';
                  }

                  return (
                    <tr key={`${entry.numeroVehiculo}-${entry.rol}-${index}`} className={rowBg}>
                      <td className={`py-4 px-5 text-center ${rankStyle}`}>{rankBadge}</td>
                      <td className="py-4 px-5 font-bold text-slate-100">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-slate-900/80 border border-slate-700 flex items-center justify-center shrink-0">
                            {entry.nombreParticipante ? (
                              <UserCheck className="w-4 h-4 text-emerald-400" />
                            ) : (
                              <Car className="w-4 h-4 text-amber-400" />
                            )}
                          </div>
                          <div>
                            <span className="block font-bold text-slate-100 text-sm">
                              {entry.nombreParticipante || `Vehículo ${entry.numeroVehiculo}`}
                            </span>
                            {entry.documento && (
                              <span className="block text-[11px] font-mono text-slate-400 font-normal">
                                C.C. {entry.documento}
                              </span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-5 text-center">
                        <span
                          className={`inline-block px-2.5 py-1 rounded-full text-[11px] font-bold tracking-wide uppercase ${
                            entry.nombreParticipante
                              ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-500/30'
                              : entry.rol === 'PROPIETARIO'
                              ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                              : 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30'
                          }`}
                        >
                          {entry.nombreParticipante ? 'Colaborador' : entry.rol}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-center font-bold text-emerald-400">
                        {entry.preguntasAcertadas}
                      </td>
                      <td className="py-4 px-4 text-center font-medium text-rose-400 hidden sm:table-cell">
                        {entry.preguntasErradas}
                      </td>
                      <td className="py-4 px-5 text-right font-black">
                        <span className={`inline-block font-mono px-3.5 py-1.5 rounded-xl text-sm ${theme.pointsBadgeClass}`}>
                          {entry.totalPuntosAcumulados} pts
                        </span>
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
