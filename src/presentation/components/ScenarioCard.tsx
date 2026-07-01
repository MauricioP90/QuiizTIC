import React from 'react';
import type { Scenario } from '../../domain/entities/Scenario';
import { BaseButton } from '../../shared/components/BaseButton';
import { CheckCircle2, XCircle, ShieldAlert, Award } from 'lucide-react';
import preguntaImg from '../../assets/pregunta.png';

interface ScenarioCardProps {
  scenario: Scenario;
  currentIndex: number;
  totalScenarios: number;
  selectedAnswer: 'BUENA' | 'MALA' | 'EXPIRED' | null;
  showFeedback: boolean;
  onAnswer: (answer: 'BUENA' | 'MALA') => void;
}

export const ScenarioCard: React.FC<ScenarioCardProps> = ({
  scenario,
  currentIndex,
  totalScenarios,
  selectedAnswer,
  showFeedback,
  onAnswer
}) => {
  const isCorrect = selectedAnswer !== null && selectedAnswer === scenario.tipoPractica;

  return (
    <div className="w-full flex flex-col md:flex-row gap-6 md:gap-8 items-stretch animate-scale-in">
      {/* Bloque Izquierdo / Superior: Pregunta e Información (60% en MD) */}
      <div className="w-full md:w-3/5 glass-panel-neon-cyan p-6 md:p-8 rounded-2xl flex flex-col justify-between relative overflow-hidden">
        {/* Adorno decorativo de fondo */}
        <div className="absolute -top-12 -right-12 w-24 h-24 bg-cyan-500/10 rounded-full blur-xl" />
        
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <img 
            src={preguntaImg} 
            alt="Pregunta Hero" 
            className="w-24 h-24 sm:w-28 sm:h-28 object-contain animate-float shrink-0 shadow-character" 
          />
          <div className="flex-1 text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-2 mb-3">
              <span className="px-3 py-1 bg-cyan-950 text-cyan-400 border border-cyan-800/40 rounded-full text-xs font-semibold uppercase tracking-wider">
                Escenario {currentIndex + 1} de {totalScenarios}
              </span>
            </div>

            <h2 className="text-lg md:text-xl font-bold text-slate-100 leading-relaxed">
              {scenario.contexto}
            </h2>
          </div>
        </div>

        {/* Indicador de estado si ya se respondió en este ciclo de feedback */}
        {showFeedback && (
          <div className={`mt-6 p-4 rounded-xl flex items-center gap-3 border ${
            selectedAnswer === 'EXPIRED' 
              ? 'bg-amber-950/40 border-amber-500/30 text-amber-300'
              : isCorrect
                ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-300'
                : 'bg-rose-950/40 border-rose-500/30 text-rose-300'
          }`}>
            {selectedAnswer === 'EXPIRED' ? (
              <>
                <ShieldAlert className="w-6 h-6 shrink-0 text-amber-400" />
                <div>
                  <p className="font-bold">¡Tiempo Agotado!</p>
                  <p className="text-xs text-amber-400/80">Debes responder antes de que se acabe el tiempo.</p>
                </div>
              </>
            ) : isCorrect ? (
              <>
                <CheckCircle2 className="w-6 h-6 shrink-0 text-emerald-400" />
                <div>
                  <p className="font-bold">¡Excelente respuesta!</p>
                  <p className="text-xs text-emerald-400/80">Has clasificado correctamente este escenario.</p>
                </div>
              </>
            ) : (
              <>
                <XCircle className="w-6 h-6 shrink-0 text-rose-400" />
                <div>
                  <p className="font-bold">Respuesta incorrecta</p>
                  <p className="text-xs text-rose-400/80">Esta práctica representaba lo contrario.</p>
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* Bloque Derecho / Inferior: Botones de Acción (40% en MD) */}
      <div className="w-full md:w-2/5 flex flex-col justify-center gap-4 p-4 md:p-6 bg-slate-900/40 rounded-2xl border border-slate-800/40">
        <p className="text-center text-xs font-semibold text-slate-500 uppercase tracking-widest mb-2">
          ¿Cómo catalogas esta acción?
        </p>

        {/* Botón Buena Práctica */}
        <BaseButton
          variant={
            showFeedback
              ? scenario.tipoPractica === 'BUENA'
                ? 'success'
                : selectedAnswer === 'BUENA'
                  ? 'danger'
                  : 'secondary'
              : 'secondary'
          }
          className={`h-24 md:h-28 text-lg md:text-xl flex flex-col items-center justify-center gap-2 border-2 transition-all duration-300 ${
            !showFeedback 
              ? 'border-emerald-600/30 hover:border-emerald-400 hover:bg-emerald-950/20 hover:shadow-[0_0_25px_rgba(16,185,129,0.35)] hover:scale-[1.02] active:scale-[0.98] active:border-emerald-400 active:shadow-[0_0_20px_rgba(16,185,129,0.3)] text-emerald-300'
              : scenario.tipoPractica === 'BUENA'
                ? 'border-emerald-500 text-white shadow-emerald-500/10'
                : 'border-transparent text-slate-500'
          }`}
          onClick={() => onAnswer('BUENA')}
          disabled={showFeedback}
        >
          <Award className="w-6 h-6 md:w-8 md:h-8" />
          <span>Buena Práctica</span>
        </BaseButton>

        {/* Botón Mala Práctica */}
        <BaseButton
          variant={
            showFeedback
              ? scenario.tipoPractica === 'MALA'
                ? 'success'
                : selectedAnswer === 'MALA'
                  ? 'danger'
                  : 'secondary'
              : 'secondary'
          }
          className={`h-24 md:h-28 text-lg md:text-xl flex flex-col items-center justify-center gap-2 border-2 transition-all duration-300 ${
            !showFeedback
              ? 'border-rose-600/30 hover:border-rose-400 hover:bg-rose-950/20 hover:shadow-[0_0_25px_rgba(239,68,68,0.35)] hover:scale-[1.02] active:scale-[0.98] active:border-rose-400 active:shadow-[0_0_20px_rgba(239,68,68,0.3)] text-rose-300'
              : scenario.tipoPractica === 'MALA'
                ? 'border-emerald-500 text-white shadow-emerald-500/10'
                : 'border-transparent text-slate-500'
          }`}
          onClick={() => onAnswer('MALA')}
          disabled={showFeedback}
        >
          <ShieldAlert className="w-6 h-6 md:w-8 md:h-8" />
          <span>Mala Práctica</span>
        </BaseButton>
      </div>
    </div>
  );
};
