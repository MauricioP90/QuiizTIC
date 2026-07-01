import React from 'react';

interface ProgressBarProps {
  progress: number; // 0 a 100
  color?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  color = 'bg-gradient-to-r from-violet-500 to-indigo-500'
}) => {
  return (
    <div className="w-full bg-slate-800/80 rounded-full h-2.5 overflow-hidden border border-slate-700/30">
      <div
        className={`h-full ${color} transition-all duration-300 ease-out`}
        style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
      />
    </div>
  );
};
