import { useState, useEffect, useRef } from 'react';
import type { Participant } from '../../domain/entities/Participant';
import type { GameSession } from '../../domain/entities/GameSession';
import { MockScenarioRepository } from '../../infrastructure/repositories/MockScenarioRepository';
import { ApiParticipantRepository } from '../../infrastructure/repositories/ApiParticipantRepository';
import { GetRandomScenarios } from '../../application/use-cases/GetRandomScenarios';
import { RegisterNewParticipant } from '../../application/use-cases/RegisterNewParticipant';
import { ProcessAnswer } from '../../application/use-cases/ProcessAnswer';
import { getApiUrl } from '../../infrastructure/utils/apiHelper';

// Instanciar repositorios y casos de uso
const scenarioRepo = new MockScenarioRepository();
const participantRepo = new ApiParticipantRepository();

const getRandomScenariosUseCase = new GetRandomScenarios(scenarioRepo);
const registerNewParticipantUseCase = new RegisterNewParticipant(participantRepo);
const processAnswerUseCase = new ProcessAnswer();

export interface AccumulatedScore {
  numeroVehiculo: string;
  preguntasAcertadas: number;
  preguntasErradas: number;
  totalPreguntas: number;
  totalPuntosAcumulados: number;
}

export function useGameController() {
  const [participant, setParticipant] = useState<Participant | null>(null);
  const [session, setSession] = useState<GameSession | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<'BUENA' | 'MALA' | 'EXPIRED' | null>(null);
  const [showFeedback, setShowFeedback] = useState<boolean>(false);
  const [timer, setTimer] = useState<number>(180);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [accumulatedResults, setAccumulatedResults] = useState<AccumulatedScore | null>(null);

  const timerIntervalRef = useRef<number | null>(null);

  // Al montar, cargar el participante si ya tiene sesión
  useEffect(() => {
    async function loadSession() {
      try {
        const existingParticipant = await participantRepo.getParticipant();
        if (existingParticipant) {
          setParticipant(existingParticipant);
          const scenarios = await getRandomScenariosUseCase.execute(1, existingParticipant.numeroVehiculo);
          setSession({
            scenarios,
            currentIndex: 0,
            score: 0,
            answers: {},
            isGameOver: false,
          });
        }
      } catch (error) {
        console.error('Error cargando participante', error);
      } finally {
        setIsLoading(false);
      }
    }
    loadSession();

    return () => {
      clearAllTimers();
    };
  }, []);

  const clearAllTimers = () => {
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
  };

  // Manejar el temporizador de cuenta regresiva
  useEffect(() => {
    // Solo corre si hay una sesión activa, el juego no ha terminado y no estamos mostrando retroalimentación
    if (session && !session.isGameOver && !showFeedback && participant) {
      setTimer(180);
      
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }

      timerIntervalRef.current = window.setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            clearAllTimers();
            handleAnswer('EXPIRED');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    };
  }, [session?.currentIndex, showFeedback, session?.isGameOver, participant]);

  const register = async (numeroVehiculo: string, rol: 'PROPIETARIO' | 'OPERADOR') => {
    setIsLoading(true);
    try {
      const newParticipant = await registerNewParticipantUseCase.execute(numeroVehiculo, rol);
      setParticipant(newParticipant);
      setAccumulatedResults(null);
      const scenarios = await getRandomScenariosUseCase.execute(1, newParticipant.numeroVehiculo, newParticipant.rol);
      setSession({
        scenarios,
        currentIndex: 0,
        score: 0,
        answers: {},
        isGameOver: false,
      });
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnswer = async (answer: 'BUENA' | 'MALA' | 'EXPIRED') => {
    if (showFeedback || !session || !participant) return;
    
    clearAllTimers();
    setSelectedAnswer(answer);
    setShowFeedback(true);

    // Enviar respuesta al backend para persistencia en MySQL
    try {
      await fetch(getApiUrl('/api/answers'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          numeroVehiculo: participant.numeroVehiculo,
          rol: participant.rol,
          idPregunta: session.scenarios[session.currentIndex].id,
          respuesta: answer
        })
      });
    } catch (error) {
      console.error('API Error al guardar la respuesta en el backend:', error);
    }
  };

  const fetchAccumulatedResults = async (vehiculo: string, rol?: string) => {
    try {
      const url = getApiUrl(
        `/api/results/${vehiculo}${rol ? `?rol=${encodeURIComponent(rol)}` : ''}`
      );
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        setAccumulatedResults(data.acumulado);
      }
    } catch (error) {
      console.error('API Error al obtener acumulados:', error);
    }
  };

  const handleContinue = async () => {
    if (selectedAnswer === null || !session || !participant) return;
    
    const nextSession = processAnswerUseCase.execute(session, selectedAnswer);
    setSession(nextSession);
    setSelectedAnswer(null);
    setShowFeedback(false);
    setTimer(180);

    if (nextSession.isGameOver) {
      await fetchAccumulatedResults(participant.numeroVehiculo, participant.rol);
    }
  };

  const restartGame = async () => {
    clearAllTimers();
    setIsLoading(true);
    try {
      setAccumulatedResults(null);
      const scenarios = await getRandomScenariosUseCase.execute(1, participant?.numeroVehiculo, participant?.rol);
      setSession({
        scenarios,
        currentIndex: 0,
        score: 0,
        answers: {},
        isGameOver: false,
      });
      setSelectedAnswer(null);
      setShowFeedback(false);
      setTimer(180);
    } catch (error) {
      console.error('Error al reiniciar', error);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    clearAllTimers();
    await participantRepo.clearParticipant();
    setParticipant(null);
    setSession(null);
    setSelectedAnswer(null);
    setShowFeedback(false);
    setAccumulatedResults(null);
  };

  const currentScenario = session && session.scenarios[session.currentIndex] 
    ? session.scenarios[session.currentIndex] 
    : null;

  return {
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
  };
}
