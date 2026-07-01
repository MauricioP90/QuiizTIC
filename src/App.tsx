import { useState } from 'react';
import { useGameController } from './presentation/controllers/useGameController';
import { WelcomeView } from './presentation/views/WelcomeView';
import { RegistrationView } from './presentation/views/RegistrationView';
import { GameplayView } from './presentation/views/GameplayView';
import { SummaryView } from './presentation/views/SummaryView';
import { LeaderboardView } from './presentation/views/LeaderboardView';
import { Loader2 } from 'lucide-react';

function App() {
  const {
    participant,
    session,
    currentScenario,
    selectedAnswer,
    showFeedback,
    timer,
    isLoading,
    accumulatedResults,
    register,
    handleAnswer,
    handleContinue,
    restartGame,
    logout
  } = useGameController();

  const [step, setStep] = useState<'welcome' | 'register'>('welcome');

  const isLeaderboardUrl = window.location.search.includes('leaderboard=true');

  if (isLeaderboardUrl) {
    return (
      <div className="min-h-screen flex flex-col justify-center py-10 px-4 bg-[#0b0f19]">
        <LeaderboardView />
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex-grow min-h-screen flex flex-col items-center justify-center bg-[#0b0f19] text-indigo-400 gap-4">
        <Loader2 className="w-12 h-12 animate-spin text-indigo-500" />
        <span className="text-sm font-semibold tracking-wider text-slate-400 uppercase">
          Cargando QuizzTIC...
        </span>
      </div>
    );
  }

  // Si hay participante registrado, el hook useGameController autoinicializa la sesión de juego.
  if (participant) {
    if (session) {
      if (session.isGameOver) {
        return (
          <div className="min-h-screen flex flex-col justify-between py-8 px-4">
            <SummaryView session={session} accumulatedResults={accumulatedResults} onRestart={restartGame} onLogout={logout} />
          </div>
        );
      }
      return (
        <div className="min-h-screen flex flex-col justify-between py-6 px-4">
          <GameplayView
            participant={participant}
            session={session}
            currentScenario={currentScenario}
            selectedAnswer={selectedAnswer}
            showFeedback={showFeedback}
            timer={timer}
            onAnswer={handleAnswer}
            onContinue={handleContinue}
            onLogout={logout}
          />
        </div>
      );
    }
  }

  // Si no está registrado:
  return (
    <div className="min-h-screen flex flex-col justify-center py-10 px-4">
      {step === 'welcome' ? (
        <WelcomeView onStart={() => setStep('register')} />
      ) : (
        <RegistrationView
          onRegister={register}
          onBack={() => setStep('welcome')}
        />
      )}
    </div>
  );
}

export default App;
