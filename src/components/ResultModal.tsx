import React, { useEffect } from 'react';
import { AttemptResult, UserBestRecord } from '../types/math';
import { Trophy, Clock, CheckCircle2, Percent, Download, RotateCcw, Award, Sparkles, X } from 'lucide-react';
import confetti from 'canvas-confetti';
import { downloadLogTextFile } from '../utils/storage';

interface ResultModalProps {
  result: AttemptResult;
  userRecord: UserBestRecord | null;
  onRestart: () => void;
  onClose: () => void;
}

export const ResultModal: React.FC<ResultModalProps> = ({
  result,
  userRecord,
  onRestart,
  onClose,
}) => {
  const isPerfect = result.percentage === 100;
  const isHighPerformance = result.percentage >= 80;

  // Trigger celebration confetti for high performance
  useEffect(() => {
    if (isHighPerformance) {
      confetti({
        particleCount: isPerfect ? 120 : 60,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#10B981', '#6366F1', '#EC4899', '#F59E0B'],
      });
    }
  }, [isHighPerformance, isPerfect]);

  const isNewBestScore = userRecord?.bestScore?.id === result.id;
  const isNewBestTime = userRecord?.bestTime?.id === result.id;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg glass-panel rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-6 overflow-hidden transition-colors duration-300">
        
        {/* Glow backdrop decorative gradient */}
        <div className="absolute -top-24 -left-24 w-60 h-60 rounded-full bg-indigo-600/20 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-60 h-60 rounded-full bg-emerald-600/20 blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header Badge & Title */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 p-0.5 shadow-xl shadow-indigo-500/25">
            <div className="w-full h-full rounded-[14px] bg-slate-950 flex items-center justify-center">
              {isPerfect ? (
                <Trophy className="w-8 h-8 text-amber-400 animate-bounce" />
              ) : isHighPerformance ? (
                <Sparkles className="w-8 h-8 text-emerald-400" />
              ) : (
                <Award className="w-8 h-8 text-indigo-400" />
              )}
            </div>
          </div>

          <h2 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight">
            {isPerfect ? 'LUAR BIASA! SEMPURNA!' : isHighPerformance ? 'HASIL SANGAT BAGUS!' : 'LATIHAN SELESAI'}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            Hasil Latihan Hitung Cepat oleh <span className="font-bold text-slate-700 dark:text-slate-200">{result.userName}</span>
          </p>
        </div>

        {/* Record Breaking Indicators */}
        {(isNewBestScore || isNewBestTime) && (
          <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center gap-2 text-amber-600 dark:text-amber-300 text-xs font-bold animate-pulse">
            <Sparkles className="w-4 h-4" />
            <span>
              REKOR BARU DICAPAI! {isNewBestScore && isNewBestTime ? 'SKOR & WAKTU TERBAIK' : isNewBestScore ? 'SKOR TERBAIK' : 'WAKTU TERBAIK'}
            </span>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-3">
          
          {/* Skor */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 text-center space-y-1">
            <div className="flex items-center justify-center gap-1 text-slate-500 dark:text-slate-400 text-xs font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>Skor Benar</span>
            </div>
            <div className="text-xl sm:text-2xl font-black font-mono text-emerald-600 dark:text-emerald-400">
              {result.score} <span className="text-slate-400 dark:text-slate-500 text-xs">/ {result.total}</span>
            </div>
          </div>

          {/* Persentase */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 text-center space-y-1">
            <div className="flex items-center justify-center gap-1 text-slate-500 dark:text-slate-400 text-xs font-semibold">
              <Percent className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
              <span>Persentase</span>
            </div>
            <div className="text-xl sm:text-2xl font-black font-mono text-purple-600 dark:text-purple-400">
              {result.percentage}%
            </div>
          </div>

          {/* Waktu */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 text-center space-y-1">
            <div className="flex items-center justify-center gap-1 text-slate-500 dark:text-slate-400 text-xs font-semibold">
              <Clock className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
              <span>Waktu</span>
            </div>
            <div className="text-base sm:text-xl font-black font-mono text-cyan-600 dark:text-cyan-300">
              {result.formattedTime}
            </div>
          </div>

        </div>

        {/* User Personal Bests Summary */}
        {userRecord && (
          <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-2 text-xs">
            <div className="font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between">
              <span>Pencapaian Rekor User:</span>
              <span className="text-slate-500 dark:text-slate-400 font-mono text-[11px]">{result.boxCount} Box ({result.operation === 'addition' ? 'Penambahan' : 'Pengurangan'})</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div className="p-2 rounded-lg bg-white dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800/80">
                <span className="text-slate-500 dark:text-slate-500 block">Waktu Terbaik:</span>
                <span className="font-mono font-bold text-cyan-600 dark:text-cyan-400">
                  {userRecord.bestTime ? userRecord.bestTime.formattedTime : '-'}
                </span>
              </div>
              <div className="p-2 rounded-lg bg-white dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800/80">
                <span className="text-slate-500 dark:text-slate-500 block">Skor Terbaik:</span>
                <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                  {userRecord.bestScore ? `${userRecord.bestScore.score}/${userRecord.bestScore.total} (${userRecord.bestScore.percentage}%)` : '-'}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
          <button
            onClick={onRestart}
            className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/25 transition-all cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Latihan Lagi</span>
          </button>

          <button
            onClick={() => downloadLogTextFile(result.userName)}
            className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold text-xs transition-all cursor-pointer"
          >
            <Download className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
            <span>Unduh Log (.txt)</span>
          </button>
        </div>

      </div>
    </div>
  );
};
