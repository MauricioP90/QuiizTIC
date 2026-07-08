import React, { useState } from 'react';
import { BaseButton } from '../../shared/components/BaseButton';
import { Sparkles, Zap, Award, QrCode } from 'lucide-react';
import cibersecurityImg from '../../assets/cibersecurity.png';

interface WelcomeViewProps {
  onStart: () => void;
}

export const WelcomeView: React.FC<WelcomeViewProps> = ({ onStart }) => {
  const [showQR, setShowQR] = useState(false);

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-4 md:p-8 animate-fade-in-up">
      <div className="w-full max-w-2xl glass-panel p-8 md:p-12 rounded-3xl relative overflow-hidden text-center">
        {/* Glow Effects */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-indigo-600/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-cyan-600/20 rounded-full blur-3xl" />

        <div className="flex justify-center mb-6">
          <img
            src={cibersecurityImg}
            alt="Cybersecurity Hero"
            className="w-40 h-40 object-contain animate-float shadow-character"
          />
        </div>

        <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4 text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-indigo-200 to-cyan-400">
          CiberTrivia
        </h1>

        <p className="text-slate-400 text-lg md:text-xl font-medium max-w-lg mx-auto mb-10 leading-relaxed">
          Pon a prueba tus conocimientos sobre ciberseguridad en tu hogar, empresa y vida diaria.
        </p>

        {/* Características breves */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10 text-left">
          <div className="p-4 bg-slate-900/40 rounded-xl border border-slate-800/40 flex items-start gap-3">
            <Zap className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-semibold text-slate-200">Tiempo Límite</h4>
              <p className="text-xs text-slate-400">3 minuto por decisión.</p>
            </div>
          </div>
          <div className="p-4 bg-slate-900/40 rounded-xl border border-slate-800/40 flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-semibold text-slate-200">Retroalimentación</h4>
              <p className="text-xs text-slate-400">Conviértete en todo un experto en ciberseguridad.</p>
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
          <BaseButton
            variant="primary"
            onClick={onStart}
            className="px-10 py-4 text-lg shadow-xl w-full sm:w-auto"
          >
            Comenzar Desafío
          </BaseButton>

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
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(window.location.origin)}`}
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
