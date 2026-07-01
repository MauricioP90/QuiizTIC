import React from 'react';
import { Timer } from 'lucide-react';

interface GameTimerProps {
  timer: number; // 0 a 180
}

export const GameTimer: React.FC<GameTimerProps> = ({ timer }) => {
  const percentage = (timer / 180) * 100;
  
  // Determinar color en base al tiempo restante
  let colorClass = 'from-emerald-500 to-teal-500';
  let borderGlow = 'rgba(16, 185, 129, 0.3)';
  let textClass = 'text-emerald-400';
  
  if (timer <= 10) {
    colorClass = 'from-rose-500 to-red-600 animate-pulse';
    borderGlow = 'rgba(239, 68, 68, 0.5)';
    textClass = 'text-rose-400 font-bold';
  } else if (timer <= 30) {
    colorClass = 'from-amber-500 to-orange-500';
    borderGlow = 'rgba(245, 158, 11, 0.3)';
    textClass = 'text-amber-400';
  }

  // Convertir segundos a formato mm:ss para mejor visualización
  const minutes = Math.floor(timer / 60);
  const seconds = timer % 60;
  const formattedTime = `${minutes}:${seconds.toString().padStart(2, '0')}`;

  return (
    <div className="w-full flex flex-col gap-2">
      <div className="flex justify-between items-center px-1">
        <div className="flex items-center gap-1.5 text-slate-400 text-sm font-semibold">
          <Timer className={`w-4 h-4 ${timer <= 10 ? 'text-rose-500' : ''}`} />
          <span>Tiempo Restante</span>
        </div>
        <span className={`text-base font-extrabold ${textClass}`}>
          {formattedTime}
        </span>
      </div>
      
      {/* Contenedor de la barra */}
      <div className="w-full bg-slate-900/60 rounded-full h-3 overflow-hidden p-0.5 border border-slate-800">
        <div
          className={`h-full rounded-full bg-gradient-to-r ${colorClass} transition-all duration-1000 ease-linear`}
          style={{ 
            width: `${percentage}%`,
            boxShadow: `0 0 8px ${borderGlow}`
          }}
        />
      </div>
    </div>
  );
};
