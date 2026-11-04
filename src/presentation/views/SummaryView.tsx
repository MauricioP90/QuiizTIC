import React, { useState } from 'react';
import type { GameSession } from '../../domain/entities/GameSession';
import type { Participant } from '../../domain/entities/Participant';
import type { AccumulatedScore } from '../controllers/useGameController';
import { BaseButton } from '../../shared/components/BaseButton';
import { RotateCcw, Eye, EyeOff, CheckCircle, XCircle, Clock, BookOpen, LogOut, TrendingUp, UserCheck, Car, Trophy } from 'lucide-react';
import { useActiveEvent } from '../../shared/context/EventContext';

import desempeñoImpecableImg from '../../assets/desempeñoImpecable.png';
import resultadoImg from '../../assets/resultado.png';
import refuerzoNecesarioImg from '../../assets/refuerzoNecesario.png';

interface SummaryViewProps {
  session: GameSession;
  participant?: Participant | null;
  accumulatedResults: AccumulatedScore | null;
  onRestart: () => void;
  onLogout: () => void;
}

export const SummaryView: React.FC<SummaryViewProps> = ({ session, participant, accumulatedResults, onRestart, onLogout }) => {
  const { activeEvent } = useActiveEvent();
  const [showHistory, setShowHistory] = useState(false);
  const total = session.scenarios.length;
  const score = session.score;
  const percentage = (score / total) * 100;

  // Mensaje y colores dinámicos basados en la nota de esta ronda
  let feedbackTitle = '¡Necesitas Refuerzo!';
  let feedbackMessage = 'Te recomendamos revisar detenidamente las explicaciones y volver a intentarlo para afianzar tus conocimientos.';
  let scoreColorClass = 'text-rose-500';
  let feedbackImage = refuerzoNecesarioImg;

  if (percentage === 100) {
    feedbackTitle = '¡Desempeño Impecable!';
    feedbackMessage = '¡Felicidades! Tienes un gran dominio sobre las buenas prácticas de seguridad informatica en tu vida diaria';
    scoreColorClass = 'text-emerald-500';
    feedbackImage = desempeñoImpecableImg;
  } else if (percentage >= 60) {
    feedbackTitle = '¡Buen Trabajo!';
    feedbackMessage = 'Demuestras un buen entendimiento. Solo afina los detalles en los escenarios que fallaste.';
    scoreColorClass = 'text-indigo-400';
    feedbackImage = resultadoImg;
  }

  return (
    <div className="flex-1 w-full max-w-3xl mx-auto flex flex-col p-4 md:p-8 animate-fade-in-up">
      <div className="glass-panel p-6 md:p-10 rounded-3xl text-center relative overflow-hidden mb-6">
        {/* Glow Effects */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-indigo-600/10 rounded-full blur-3xl" />

        {/* Imagen/Personaje de Calificación */}
        <div className="flex justify-center mb-6">
          <img 
            src={feedbackImage} 
            alt={feedbackTitle} 
            className="w-40 h-40 md:w-44 md:h-44 object-contain animate-float shadow-character" 
          />
        </div>

        {participant && (
          <div className="inline-flex items-center gap-2 px-3 py-1.5 mb-4 rounded-full bg-slate-900/70 border border-slate-800 text-xs text-slate-300">
            {participant.nombreParticipante ? (
              <>
                <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span className="font-semibold text-slate-200">{participant.nombreParticipante}</span>
                <span className="text-[10px] text-slate-500 font-mono">(C.C. {participant.documento || participant.numeroVehiculo})</span>
              </>
            ) : (
              <>
                <Car className="w-3.5 h-3.5 text-amber-400" />
                <span className="font-semibold text-slate-200">Vehículo {participant.numeroVehiculo}</span>
                <span className="text-[10px] text-slate-500 font-semibold">({participant.rol})</span>
              </>
            )}
          </div>
        )}

        <span className="text-xs font-semibold text-slate-500 uppercase tracking-widest block mb-1">
          Resultados de Ronda
        </span>
        <h2 className="text-2xl md:text-3xl font-extrabold text-slate-100 mb-2">
          {feedbackTitle}
        </h2>
        <p className="text-slate-400 text-xs md:text-sm max-w-lg mx-auto mb-6">
          {feedbackMessage}
        </p>

        {/* Panel Comparativo de Puntuaciones (Esta Ronda vs Acumulado MySQL) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">

          {/* Tarjeta Ronda Actual */}
          <div className="bg-slate-950/40 p-6 rounded-2xl border border-slate-800/60 flex flex-col items-center justify-center">
            <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest block mb-3">
              Ronda Actual
            </span>
            <div className="inline-flex flex-col items-center justify-center p-6 bg-slate-900/60 rounded-full border border-slate-800 shadow-inner min-w-[120px] h-[120px]">
              <span className={`text-4xl font-black ${scoreColorClass}`}>
                {score}
              </span>
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-0.5">
                de {total} aciertos
              </span>
            </div>
            <span className="text-xs text-slate-400 mt-3 italic">
              Puntos en este juego: {score}
            </span>
          </div>

          {/* Tarjeta Acumulado Histórico del Día */}
          <div className="bg-slate-950/40 p-6 rounded-2xl border border-slate-800/60 flex flex-col items-center justify-center relative">
            <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest block mb-3">
              Historial del Día
            </span>

            {accumulatedResults ? (
              <div className="w-full space-y-3">
                {/* Gran Total Puntos */}
                <div className="bg-slate-900/60 px-4 py-2 rounded-xl border border-slate-800/60 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs text-slate-400">
                    <TrendingUp className="w-4 h-4 text-cyan-400" />
                    <span>Puntos Totales:</span>
                  </div>
                  <span className="text-xl font-black text-cyan-400">
                    {accumulatedResults.totalPuntosAcumulados} pts
                  </span>
                </div>

                {/* Desglose Estadístico */}
                <div className="grid grid-cols-3 gap-2 text-[10px] font-bold text-center">
                  <div className="bg-slate-900/40 p-2 rounded-lg border border-slate-800/40 text-slate-400">
                    <span className="text-emerald-400 text-sm block">{accumulatedResults.preguntasAcertadas}</span>
                    Aciertos
                  </div>
                  <div className="bg-slate-900/40 p-2 rounded-lg border border-slate-800/40 text-slate-400">
                    <span className="text-rose-400 text-sm block">{accumulatedResults.preguntasErradas}</span>
                    Fallos
                  </div>
                  <div className="bg-slate-900/40 p-2 rounded-lg border border-slate-800/40 text-slate-400">
                    <span className="text-slate-200 text-sm block">{accumulatedResults.totalPreguntas}</span>
                    Resueltas
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-xs text-slate-500 italic py-6">
                Cargando acumulados de base de datos...
              </div>
            )}
          </div>

        </div>

        {/* Acciones del Resumen */}
        <div className="flex flex-col md:flex-row justify-center gap-4">
          <BaseButton
            variant="secondary"
            onClick={() => setShowHistory(!showHistory)}
            className="flex-1 flex items-center justify-center gap-2"
          >
            {showHistory ? (
              <>
                <EyeOff className="w-5 h-5" />
                <span>Ocultar Respuestas</span>
              </>
            ) : (
              <>
                <Eye className="w-5 h-5" />
                <span>Revisar Respuestas</span>
              </>
            )}
          </BaseButton>

          <BaseButton
            variant="primary"
            onClick={onRestart}
            className="flex-1 flex items-center justify-center gap-2 shadow-lg"
          >
            <RotateCcw className="w-5 h-5" />
            <span>Volver a Jugar</span>
          </BaseButton>

          {activeEvent?.mostrarRanking !== false && (
            <BaseButton
              variant="secondary"
              onClick={() => {
                window.location.search = '?leaderboard=true';
              }}
              className="flex-1 flex items-center justify-center gap-2 text-amber-300 hover:text-amber-200 border-amber-500/30 hover:bg-amber-500/10"
            >
              <Trophy className="w-5 h-5 text-amber-400" />
              <span>Ver Ranking</span>
            </BaseButton>
          )}

          <BaseButton
            variant="secondary"
            onClick={onLogout}
            className="flex-1 flex items-center justify-center gap-2 text-rose-400 hover:text-rose-300 border-rose-950/40 hover:border-rose-900/40 hover:bg-rose-950/20"
          >
            <LogOut className="w-5 h-5" />
            <span>Cerrar Sesión</span>
          </BaseButton>
        </div>
      </div>

      {/* Historial Desglosado de Preguntas */}
      {showHistory && (
        <div className="space-y-4 animate-scale-in text-left">
          <h3 className="text-lg font-bold text-slate-300 px-1 mb-2">
            Desglose de Escenarios (Ronda Actual)
          </h3>

          {session.scenarios.map((sc, index) => {
            const userAnswer = session.answers[sc.id];
            const isScCorrect = userAnswer === sc.tipoPractica;
            const isScExpired = userAnswer === 'EXPIRED';

            let itemBorder = 'border-rose-950/60 bg-rose-950/10';
            let StatusIcon = XCircle;
            let statusText = 'Incorrecto';
            let statusColor = 'text-rose-400';

            if (isScExpired) {
              itemBorder = 'border-amber-950/60 bg-amber-950/10';
              StatusIcon = Clock;
              statusText = 'Tiempo Agotado';
              statusColor = 'text-amber-400';
            } else if (isScCorrect) {
              itemBorder = 'border-emerald-950/60 bg-emerald-950/10';
              StatusIcon = CheckCircle;
              statusText = 'Correcto';
              statusColor = 'text-emerald-400';
            }

            return (
              <div
                key={sc.id}
                className={`p-5 rounded-2xl border flex flex-col gap-4 ${itemBorder}`}
              >
                {/* Cabecera del Item */}
                <div className="flex justify-between items-start gap-4">
                  <div className="space-y-0.5">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                      Escenario {index + 1}
                    </span>
                    <p className="text-slate-200 text-sm font-semibold leading-relaxed">
                      {sc.contexto}
                    </p>
                  </div>
                  <div className={`flex items-center gap-1 shrink-0 px-2.5 py-1 bg-slate-950/40 rounded-lg border border-slate-800 text-xs font-bold ${statusColor}`}>
                    <StatusIcon className="w-4 h-4" />
                    <span>{statusText}</span>
                  </div>
                </div>

                {/* Respuestas comparativas */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-slate-950/30 p-3 rounded-xl border border-slate-900">
                  <div>
                    <span className="text-slate-500 block mb-0.5">Tu respuesta:</span>
                    <span className={`font-bold ${isScCorrect ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {userAnswer === 'BUENA' ? '✓ Buena Práctica' : userAnswer === 'MALA' ? '✗ Mala Práctica' : '⏱️ Sin Respuesta'}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 block mb-0.5">Clasificación real:</span>
                    <span className="text-emerald-400 font-bold">
                      {sc.tipoPractica === 'BUENA' ? '✓ Buena Práctica' : '✗ Mala Práctica'}
                    </span>
                  </div>
                </div>

                {/* Justificación pedagógica */}
                <div className="space-y-3 text-xs pt-1 border-t border-slate-900">
                  <div>
                    <span className="text-slate-500 font-semibold uppercase tracking-wider block mb-1">
                      Impacto Inmediato
                    </span>
                    <p className="text-slate-400 leading-relaxed">
                      {sc.riesgoBeneficio}
                    </p>
                  </div>
                  <div>
                    <div className="flex items-center gap-1 mb-1 text-cyan-400/80">
                      <BookOpen className="w-3.5 h-3.5" />
                      <span className="font-semibold uppercase tracking-wider">
                        Recomendación
                      </span>
                    </div>
                    <p className="text-slate-400 leading-relaxed">
                      {sc.recomendacion}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
