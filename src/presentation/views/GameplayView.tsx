import React from 'react';
import type { Participant } from '../../domain/entities/Participant';
import type { GameSession } from '../../domain/entities/GameSession';
import type { Scenario } from '../../domain/entities/Scenario';
import { GameTimer } from '../components/GameTimer';
import { ScenarioCard } from '../components/ScenarioCard';
import { FeedbackModal } from '../components/FeedbackModal';
import { LogOut, Car } from 'lucide-react';

interface GameplayViewProps {
  participant: Participant;
  session: GameSession;
  currentScenario: Scenario | null;
  selectedAnswer: 'BUENA' | 'MALA' | 'EXPIRED' | null;
  showFeedback: boolean;
  timer: number;
  onAnswer: (answer: 'BUENA' | 'MALA') => void;
  onContinue: () => void;
  onLogout: () => void;
}

export const GameplayView: React.FC<GameplayViewProps> = ({
  participant,
  session,
  currentScenario,
  selectedAnswer,
  showFeedback,
  timer,
  onAnswer,
  onContinue,
  onLogout
}) => {
  if (!currentScenario) return null;

  return (
    <div className="flex-1 w-full max-w-4xl mx-auto flex flex-col p-4 md:p-6 animate-fade-in">
      {/* Cabecera del Juego */}
      <header className="flex justify-between items-center mb-8 pb-4 border-b border-slate-800/80">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/25 flex items-center justify-center text-indigo-400">
            <Car className="w-5 h-5" />
          </div>
          <div className="text-left">
            <p className="text-sm font-bold text-slate-200">Vehículo: {participant.numeroVehiculo}</p>
            <p className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">
              Rol: {participant.rol}
            </p>
          </div>
        </div>
        
        <button
          onClick={onLogout}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-slate-400 hover:text-rose-400 bg-slate-900/40 hover:bg-rose-950/20 border border-slate-800/60 hover:border-rose-900/30 transition-all text-xs font-semibold"
          title="Cerrar sesión"
        >
          <LogOut className="w-4 h-4" />
          <span className="hidden sm:inline">Cerrar Sesión</span>
        </button>
      </header>

      {/* Contenido Principal */}
      <main className="flex-1 flex flex-col gap-6 md:gap-8 justify-center">
        {/* Temporizador */}
        <div className="w-full">
          <GameTimer timer={timer} />
        </div>

        {/* Tarjeta de Escenario */}
        <ScenarioCard
          scenario={currentScenario}
          currentIndex={session.currentIndex}
          totalScenarios={session.scenarios.length}
          selectedAnswer={selectedAnswer}
          showFeedback={showFeedback}
          onAnswer={onAnswer}
        />
      </main>

      {/* Modal de Pausa Pedagógica */}
      <FeedbackModal
        scenario={currentScenario}
        selectedAnswer={selectedAnswer}
        isOpen={showFeedback}
        onContinue={onContinue}
      />
    </div>
  );
};
