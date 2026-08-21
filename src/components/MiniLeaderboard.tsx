import React from 'react';
import { Trophy, Medal, Timer, Target } from 'lucide-react';
import { UserBestRecord, AttemptResult } from '../types/math';

interface MiniLeaderboardProps {
  records: Record<string, UserBestRecord>;
}

export const MiniLeaderboard: React.FC<MiniLeaderboardProps> = ({ records }) => {
  const allBestScores = Object.values(records)
    .map(r => r.bestScore)
    .filter((r): r is AttemptResult => r !== null)
    .sort((a, b) => {
      if (b.percentage !== a.percentage) return b.percentage - a.percentage;
      return a.timeInMs - b.timeInMs;
    })
    .slice(0, 3);

  if (allBestScores.length === 0) return null;

  const getMedalColor = (index: number) => {
    switch (index) {
      case 0: return 'text-amber-500 bg-amber-500/10 border-amber-500/20';
      case 1: return 'text-slate-400 bg-slate-400/10 border-slate-400/20';
      case 2: return 'text-orange-600 bg-orange-600/10 border-orange-600/20';
      default: return 'text-indigo-500 bg-indigo-500/10 border-indigo-500/20';
    }
  };

  return (
    <div className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 shadow-sm">
      <div className="flex items-center gap-2 mb-3 px-1">
        <Trophy className="w-4 h-4 text-amber-500" />
        <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">Top 3 Global</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {allBestScores.map((score, index) => (
          <div 
            key={score.id}
            className={`flex items-center justify-between p-2.5 rounded-lg border transition-all hover:scale-[1.02] ${getMedalColor(index)}`}
          >
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-white dark:bg-slate-800 border border-current/20 flex items-center justify-center font-bold">
                {index + 1}
              </div>
              <div className="truncate">
                <p className="text-xs font-bold text-slate-900 dark:text-white truncate">{score.userName}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-[10px] opacity-80 flex items-center gap-0.5">
                    <Target className="w-2.5 h-2.5" /> {score.percentage}%
                  </span>
                  <span className="text-[10px] opacity-80 flex items-center gap-0.5">
                    <Timer className="w-2.5 h-2.5" /> {score.formattedTime}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex-shrink-0 ml-2">
              <Medal className={`w-5 h-5 ${index === 0 ? 'animate-bounce' : ''}`} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
