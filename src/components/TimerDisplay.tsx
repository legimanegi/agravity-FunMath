import React from 'react';
import { Timer as TimerIcon, Award } from 'lucide-react';
import { formatTime } from '../utils/storage';

interface TimerDisplayProps {
  timeInMs: number;
  isRunning: boolean;
  totalBoxes: number;
  filledBoxes: number;
}

export const TimerDisplay: React.FC<TimerDisplayProps> = ({
  timeInMs,
  isRunning,
  totalBoxes,
  filledBoxes,
}) => {
  const percentageFilled = totalBoxes > 0 ? Math.round((filledBoxes / totalBoxes) * 100) : 0;

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-gradient-to-r from-slate-100 via-indigo-50 to-slate-100 dark:from-slate-900 dark:via-indigo-950/40 dark:to-slate-900 border border-indigo-200 dark:border-indigo-500/20 shadow-xl transition-colors duration-300">
      
      {/* Stopwatch Counter */}
      <div className="flex items-center gap-3">
        <div className={`p-3 rounded-xl transition-all ${
          isRunning 
            ? 'bg-emerald-100 border border-emerald-300 text-emerald-700 dark:bg-emerald-500/20 dark:border-emerald-500/30 dark:text-emerald-400 animate-pulse' 
            : 'bg-slate-200 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
        }`}>
          <TimerIcon className="w-6 h-6" />
        </div>
        <div>
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">Waktu Pengerjaan</span>
          <span className="text-2xl sm:text-3xl font-black font-mono tracking-tight text-slate-800 dark:text-white">
            {formatTime(timeInMs)}
          </span>
        </div>
      </div>

      {/* Progress Bar & Status */}
      <div className="w-full sm:w-64 space-y-1.5">
        <div className="flex justify-between items-center text-xs font-bold">
          <span className="text-slate-550 dark:text-slate-400">Progres Pengisian:</span>
          <span className="text-indigo-600 dark:text-indigo-400 font-mono">{filledBoxes} / {totalBoxes} ({percentageFilled}%)</span>
        </div>
        <div className="w-full h-2.5 bg-slate-200 dark:bg-slate-950 rounded-full overflow-hidden border border-slate-300 dark:border-slate-800">
          <div
            className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-400 transition-all duration-300 rounded-full"
            style={{ width: `${percentageFilled}%` }}
          />
        </div>
      </div>

      {/* Quick Keyboard Nav Hint */}
      <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-200 dark:bg-slate-950/60 border border-slate-300 dark:border-slate-800/80 text-[11px] text-slate-500 dark:text-slate-400">
        <Award className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
        <span>Gunakan Tombol Panah (<b>↑ ↓ ← →</b>) atau <b>Enter/Tab</b> untuk berpindah cepat</span>
      </div>

    </div>
  );
};
