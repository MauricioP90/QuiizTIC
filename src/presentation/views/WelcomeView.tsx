import React, { useState } from 'react';
import { Sparkles, Zap, Award, QrCode, Shield, Settings, Trophy } from 'lucide-react';
import cibersecurityImg from '../../assets/cibersecurity.png';
import { useActiveEvent } from '../../shared/context/EventContext';

interface WelcomeViewProps {
  onStart: () => void;
  onOpenAdmin?: () => void;
  onOpenLeaderboard?: () => void;
}

export const WelcomeView: React.FC<WelcomeViewProps> = ({ onStart, onOpenAdmin, onOpenLeaderboard }) => {
  const [showQR, setShowQR] = useState(false);
  const { activeEvent, theme } = useActiveEvent();

  const title = activeEvent?.nombre || 'CiberTrivia';
  const description =
    activeEvent?.descripcion ||
    'Pon a prueba tus conocimientos en situaciones cotidianas y laborales.';

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-4 md:p-8 animate-fade-in-up">
      {/* Barra superior con accesos a Ranking y Admin */}
      <div className="w-full max-w-2xl flex justify-between items-center mb-2 px-1">
        {activeEvent?.mostrarRanking !== false ? (
          <button
            onClick={onOpenLeaderboard || (() => { window.location.search = '?leaderboard=true'; })}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/60 hover:bg-slate-800 text-amber-300 hover:text-amber-200 border border-slate-800 transition-colors text-xs font-semibold backdrop-blur-sm shadow-sm"
            title="Ver Tabla de Posiciones"
          >
            <Trophy className="w-3.5 h-3.5 text-amber-400" />
            <span>Ranking / Posiciones</span>
          </button>
        ) : (
          <div />
        )}

        {onOpenAdmin && (
          <button
            onClick={onOpenAdmin}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/60 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800 transition-colors text-xs font-semibold backdrop-blur-sm shadow-sm"
            title="Administración de Eventos y Temas"
          >
            <Settings className="w-3.5 h-3.5" />
            <span>Admin</span>
          </button>
        )}
      </div>

      <div className="w-full max-w-2xl glass-panel p-8 md:p-12 rounded-3xl relative overflow-hidden text-center">
        {/* Glow Effects dinámicos del Tema */}
        <div className={`absolute -top-24 -left-24 w-48 h-48 ${theme.glowTopLeft} rounded-full blur-3xl`} />
        <div className={`absolute -bottom-24 -right-24 w-48 h-48 ${theme.glowBottomRight} rounded-full blur-3xl`} />

        {/* Badge del evento si tiene categorías filtradas */}
        {activeEvent && activeEvent.categorias && activeEvent.categorias.length > 0 && (
          <div className="mb-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-800/80 border border-slate-700 text-slate-300">
            <Shield className="w-3.5 h-3.5 text-indigo-400" />
            <span>{activeEvent.categorias.join(' • ')}</span>
          </div>
        )}

        <div className="flex justify-center mb-6">
          <img
            src={cibersecurityImg}
            alt="Hero Icon"
            className="w-40 h-40 object-contain animate-float shadow-character"
          />
        </div>

        <h1
          className={`text-4xl md:text-5xl font-black tracking-tight mb-4 text-transparent bg-clip-text bg-gradient-to-r ${theme.titleGradient}`}
        >
          {title}
        </h1>

        <p className="text-slate-400 text-lg md:text-xl font-medium max-w-lg mx-auto mb-10 leading-relaxed">
          {description}
        </p>

        {/* Características breves */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10 text-left">
          <div className="p-4 bg-slate-900/40 rounded-xl border border-slate-800/40 flex items-start gap-3">
            <Zap className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-semibold text-slate-200">Tiempo Límite</h4>
              <p className="text-xs text-slate-400">3 minutos por decisión.</p>
            </div>
          </div>
          <div className="p-4 bg-slate-900/40 rounded-xl border border-slate-800/40 flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-semibold text-slate-200">Retroalimentación</h4>
              <p className="text-xs text-slate-400">Aprende al instante con justificaciones tácticas.</p>
            </div>
          </div>
          <div className="p-4 bg-slate-900/40 rounded-xl border border-slate-800/40 flex items-start gap-3">
            <Award className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-semibold text-slate-200">Recompensas</h4>
              <p className="text-xs text-slate-400">Participa por fabulosos premios</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button
            onClick={onStart}
            className={`px-10 py-4 text-lg font-bold rounded-xl transition-all transform active:scale-95 w-full sm:w-auto shadow-xl ${theme.primaryButton}`}
          >
            Comenzar Desafío
          </button>

          <button
            onClick={() => setShowQR(true)}
            className="flex items-center gap-2 px-6 py-4 text-sm font-semibold rounded-xl border border-slate-700 bg-slate-800/40 text-slate-300 hover:text-white hover:bg-slate-800 transition-colors w-full sm:w-auto justify-center"
          >
            <QrCode className="w-4 h-4 text-indigo-400" />
            Código QR de Acceso
          </button>
        </div>

        {/* Modal de Código QR */}
        {showQR && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
            <div className="bg-slate-900/90 border border-slate-800 p-6 rounded-2xl max-w-sm w-full text-center shadow-2xl relative">
              <button
                onClick={() => setShowQR(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-white text-lg font-bold"
              >
                ✕
              </button>
              <h3 className="text-xl font-bold text-slate-100 mb-2">Escanea el QR</h3>
              <p className="text-xs text-slate-400 mb-6">
                Escanea este código con tu celular para ingresar al juego desde cualquier dispositivo.
              </p>
              <div className="bg-white p-4 rounded-xl inline-block mb-6 shadow-md">
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
                    window.location.origin
                  )}`}
                  alt="QR de Acceso"
                  className="w-48 h-48 mx-auto"
                />
              </div>
              <div className="text-xs font-mono text-slate-400 bg-slate-950/60 p-2.5 rounded-lg break-all">
                {window.location.origin}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
