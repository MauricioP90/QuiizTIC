import { useState } from 'react';
import { useGameController } from './presentation/controllers/useGameController';
import { WelcomeView } from './presentation/views/WelcomeView';
import { RegistrationView } from './presentation/views/RegistrationView';
import { GameplayView } from './presentation/views/GameplayView';
import { SummaryView } from './presentation/views/SummaryView';
import { LeaderboardView } from './presentation/views/LeaderboardView';
import { AdminView } from './presentation/views/AdminView';
import { EventProvider, useActiveEvent } from './shared/context/EventContext';
import { Loader2 } from 'lucide-react';

function AppContent() {
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

  const { theme } = useActiveEvent();
  const [step, setStep] = useState<'welcome' | 'register'>('welcome');

  const [showAdmin, setShowAdmin] = useState(
    window.location.pathname.endsWith('/admin') || window.location.search.includes('admin=true')
  );

  const isLeaderboardUrl =
    window.location.pathname.endsWith('/leaderboard') || window.location.search.includes('leaderboard=true');

  const handleCloseAdmin = () => {
    setShowAdmin(false);
    if (window.location.pathname.endsWith('/admin')) {
      window.location.pathname = '/';
    } else if (window.location.search.includes('admin=true')) {
      window.location.search = '';
    }
  };

  // Vista de Administración
  if (showAdmin) {
    return (
      <div className={`min-h-screen flex flex-col justify-start py-8 px-4 ${theme.bgClass}`}>
        <AdminView onBack={handleCloseAdmin} />
      </div>
    );
  }

  // Vista de Tabla de Posiciones
  if (isLeaderboardUrl) {
    return (
      <div className={`min-h-screen flex flex-col justify-start py-6 sm:py-10 px-3 sm:px-4 ${theme.bgClass}`}>
        <LeaderboardView />
      </div>
    );
  }

  // Cargando partida inicial
  if (isLoading) {
    return (
      <div className={`flex-grow min-h-screen flex flex-col items-center justify-center ${theme.bgClass} text-indigo-400 gap-4`}>
        <Loader2 className="w-12 h-12 animate-spin text-indigo-500" />
        <span className="text-sm font-semibold tracking-wider text-slate-400 uppercase">
          Cargando QuizzTIC...
        </span>
      </div>
    );
  }

  // Si hay participante registrado
  if (participant) {
    if (session) {
      if (session.isGameOver) {
        return (
          <div className={`min-h-screen flex flex-col justify-between py-8 px-4 ${theme.bgClass}`}>
            <SummaryView
              session={session}
              participant={participant}
              accumulatedResults={accumulatedResults}
              onRestart={restartGame}
              onLogout={logout}
            />
          </div>
        );
      }
      return (
        <div className={`min-h-screen flex flex-col justify-between py-6 px-4 ${theme.bgClass}`}>
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

  // Si no está registrado
  return (
    <div className={`min-h-screen flex flex-col justify-center py-10 px-4 ${theme.bgClass}`}>
      {step === 'welcome' ? (
        <WelcomeView
          onStart={() => setStep('register')}
          onOpenAdmin={() => setShowAdmin(true)}
        />
      ) : (
        <RegistrationView
          onRegister={register}
          onBack={() => setStep('welcome')}
        />
      )}
    </div>
  );
}

function App() {
  return (
    <EventProvider>
      <AppContent />
    </EventProvider>
  );
}

export default App;
