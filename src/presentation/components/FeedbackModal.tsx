import React from 'react';
import type { Scenario } from '../../domain/entities/Scenario';
import { BaseButton } from '../../shared/components/BaseButton';
import { AlertTriangle, CheckCircle, Info, BookOpen } from 'lucide-react';

interface FeedbackModalProps {
  scenario: Scenario;
  selectedAnswer: 'BUENA' | 'MALA' | 'EXPIRED' | null;
  isOpen: boolean;
  onContinue: () => void;
}

export const FeedbackModal: React.FC<FeedbackModalProps> = ({
  scenario,
  selectedAnswer,
  isOpen,
  onContinue
}) => {
  if (!isOpen) return null;

  const isCorrect = selectedAnswer !== null && selectedAnswer === scenario.tipoPractica;
  const isExpired = selectedAnswer === 'EXPIRED';

  let headerColor = 'text-emerald-400 border-emerald-500/20 bg-emerald-500/5';
  let Icon = CheckCircle;
  let title = '¡Buen Trabajo!';
  let highlightClass = 'glass-panel-neon-purple';

  if (isExpired) {
    headerColor = 'text-amber-400 border-amber-500/20 bg-amber-500/5';
    Icon = AlertTriangle;
    title = '¡Tiempo Agotado!';
    highlightClass = 'glass-panel-neon-purple';
  } else if (!isCorrect) {
    headerColor = 'text-rose-400 border-rose-500/20 bg-rose-500/5';
    Icon = AlertTriangle;
    title = '¡Atención!';
    highlightClass = 'glass-panel-neon-purple';
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className={`w-full max-w-2xl rounded-2xl overflow-hidden p-6 md:p-8 animate-scale-in ${highlightClass}`}>
        
        {/* Encabezado Pedagógico */}
        <div className={`flex items-center gap-3 p-4 rounded-xl border ${headerColor} mb-6`}>
          <Icon className="w-8 h-8 shrink-0" />
          <div>
            <h3 className="text-xl font-bold tracking-tight">{title}</h3>
            <p className="text-xs opacity-80">Reflexión pedagógica rápida antes del siguiente escenario</p>
          </div>
        </div>

        {/* Contenido Educativo */}
        <div className="space-y-6">
          {/* Contexto Breve */}
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-widest block mb-1">
              Situación Evaluada
            </span>
            <p className="text-slate-300 italic text-sm border-l-2 border-slate-700 pl-3">
              "{scenario.contexto}"
            </p>
          </div>

          {/* Riesgo o Beneficio */}
          <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800/40">
            <div className="flex items-center gap-2 mb-2 text-indigo-400">
              <Info className="w-4 h-4" />
              <h4 className="text-sm font-semibold uppercase tracking-wider">
                Impacto Inmediato (Riesgo / Beneficio)
              </h4>
            </div>
            <p className="text-slate-300 text-sm leading-relaxed">
              {scenario.riesgoBeneficio}
            </p>
          </div>

          {/* Recomendación */}
          <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800/40">
            <div className="flex items-center gap-2 mb-2 text-cyan-400">
              <BookOpen className="w-4 h-4" />
              <h4 className="text-sm font-semibold uppercase tracking-wider">
                Recomendación Técnica
              </h4>
            </div>
            <p className="text-slate-300 text-sm leading-relaxed">
              {scenario.recomendacion}
            </p>
          </div>
        </div>

        {/* Footer con Botón de Continuar */}
        <div className="mt-8 pt-4 border-t border-slate-800/60 flex justify-end">
          <BaseButton
            variant="primary"
            onClick={onContinue}
            className="w-full sm:w-auto px-8"
          >
            Continuar
          </BaseButton>
        </div>

      </div>
    </div>
  );
};
