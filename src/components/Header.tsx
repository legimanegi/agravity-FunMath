import React from 'react';
import { Zap, Trophy, Download, Volume2, VolumeX, Sparkles, Sun, Moon } from 'lucide-react';
import { downloadLogTextFile } from '../utils/storage';

interface HeaderProps {
  userName: string;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onOpenLeaderboard: () => void;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  userName,
  soundEnabled,
  onToggleSound,
  onOpenLeaderboard,
  theme,
  onToggleTheme,
}) => {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* App Logo & Title */}
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 shadow-lg shadow-indigo-500/25">
            <Zap className="w-6 h-6 text-white animate-pulse-subtle" />
            <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-emerald-400 border-2 border-white dark:border-slate-950" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-slate-900 via-slate-800 to-slate-600 dark:from-white dark:via-slate-100 dark:to-slate-400 bg-clip-text text-transparent font-mono">
                FUN MATH APPS
              </h1>
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
                PRO SPEED
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Latihan Hitung Cepat Matrix Horizontal & Vertikal</p>
          </div>
        </div>

        {/* User Badge & Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {userName && (
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs">
              <Sparkles className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400" />
              <span className="text-slate-500 dark:text-slate-400">Pemain:</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">{userName}</span>
            </div>
          )}

          {/* Theme Toggle Button */}
          <button
            onClick={onToggleTheme}
            className="p-2 rounded-lg bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:border-slate-300 dark:hover:border-slate-700 transition-colors cursor-pointer"
            title={theme === 'dark' ? 'Mode Terang' : 'Mode Gelap'}
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-600" />}
          </button>

          <button
            onClick={onToggleSound}
            className="p-2 rounded-lg bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:border-slate-300 dark:hover:border-slate-700 transition-colors cursor-pointer"
            title={soundEnabled ? 'Matikan Suara' : 'Aktifkan Suara'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> : <VolumeX className="w-4 h-4 text-slate-400 dark:text-slate-500" />}
          </button>

          <button
            onClick={onOpenLeaderboard}
            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 hover:bg-amber-500/20 transition-all text-xs font-semibold cursor-pointer"
            title="Lihat Log & Papan Rekor Terbaik"
          >
            <Trophy className="w-4 h-4 text-amber-500 dark:text-amber-400" />
            <span className="hidden md:inline">Papan Rekor</span>
          </button>

          <button
            onClick={() => downloadLogTextFile()}
            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-850 hover:border-slate-300 dark:hover:border-slate-700 transition-all text-xs font-semibold cursor-pointer"
            title="Download Log Hasil Latihan (.txt)"
          >
            <Download className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
            <span className="hidden sm:inline">Export Log (.txt)</span>
          </button>
        </div>

      </div>
    </header>
  );
};
