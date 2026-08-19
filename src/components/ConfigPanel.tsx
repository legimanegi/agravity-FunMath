import React from 'react';
import { GameConfig, BoxOption, OperationType, GameState } from '../types/math';
import { Play, Square, Settings2, Plus, Minus, User, Hash, Grid3X3 } from 'lucide-react';

interface ConfigPanelProps {
  config: GameConfig;
  onChangeConfig: (newConfig: Partial<GameConfig>) => void;
  gameState: GameState;
  onStart: () => void;
  onStop: () => void;
}

const BOX_OPTIONS: BoxOption[] = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100];
const RANGE_OPTIONS = [10, 20, 30, 50, 100];

export const ConfigPanel: React.FC<ConfigPanelProps> = ({
  config,
  onChangeConfig,
  gameState,
  onStart,
  onStop,
}) => {
  const isRunning = gameState === 'running';

  return (
    <div className="glass-panel rounded-2xl p-4 sm:p-6 shadow-2xl space-y-6 transition-colors duration-300">
      
      {/* Top Header & User Name */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
        
        {/* User Name Input */}
        <div className="w-full md:w-auto flex-1 max-w-md">
          <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
            <User className="w-3.5 h-3.5 text-indigo-500 dark:text-indigo-400" /> Nama Peserta / User
          </label>
          <div className="relative">
            <input
              type="text"
              value={config.userName}
              onChange={(e) => onChangeConfig({ userName: e.target.value })}
              disabled={isRunning}
              placeholder="Masukkan Nama Anda..."
              className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700/80 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 disabled:opacity-60 transition-all"
            />
          </div>
        </div>

        {/* Operation Selection */}
        <div className="w-full md:w-auto">
          <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
            <Settings2 className="w-3.5 h-3.5 text-indigo-500 dark:text-indigo-400" /> Operasi Hitung
          </label>
          <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
            <button
              type="button"
              disabled={isRunning}
              onClick={() => onChangeConfig({ operation: 'addition' })}
              className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                config.operation === 'addition'
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-600/25'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800/60'
              } disabled:opacity-60`}
            >
              <Plus className="w-4 h-4" />
              <span>Penambahan (+)</span>
            </button>
            <button
              type="button"
              disabled={isRunning}
              onClick={() => onChangeConfig({ operation: 'subtraction' })}
              className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                config.operation === 'subtraction'
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-600/25'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800/60'
              } disabled:opacity-60`}
            >
              <Minus className="w-4 h-4" />
              <span>Pengurangan (-)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Grid Settings: Box Count & Range Settings */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Box Count Options (10 to 100) */}
        <div className="space-y-2 md:col-span-1">
          <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <Grid3X3 className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" /> Jumlah Box Matrix Soal
          </label>
          <div className="flex flex-wrap gap-1.5">
            {BOX_OPTIONS.map((num) => (
              <button
                key={num}
                type="button"
                disabled={isRunning}
                onClick={() => onChangeConfig({ boxCount: num })}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                  config.boxCount === num
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30 ring-2 ring-indigo-400/50'
                    : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                } disabled:opacity-60`}
              >
                {num} Box
              </button>
            ))}
          </div>
          <p className="text-[11px] text-slate-400 dark:text-slate-500 font-medium">
            Matrix: 10 Angka Horizontal × {config.boxCount / 10} Angka Vertikal ({config.boxCount} total kotak jawaban)
          </p>
        </div>

        {/* Max Range Configurator Horizontal */}
        <div className="space-y-2">
          <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <Hash className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" /> Range Maks Horizontal (Atas)
          </label>
          <div className="flex flex-wrap gap-1.5">
            {RANGE_OPTIONS.map((val) => (
              <button
                key={val}
                type="button"
                disabled={isRunning}
                onClick={() => onChangeConfig({ maxHorizontal: val })}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                  config.maxHorizontal === val
                    ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30 ring-2 ring-purple-400/50'
                    : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                } disabled:opacity-60`}
              >
                Max {val}
              </button>
            ))}
          </div>
          <p className="text-[11px] text-slate-400 dark:text-slate-500 font-medium">
            Angka acak atas di-generate dari 1 s/d {config.maxHorizontal}
          </p>
        </div>

        {/* Max Range Configurator Vertical */}
        <div className="space-y-2">
          <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <Hash className="w-3.5 h-3.5 text-pink-600 dark:text-pink-400" /> Range Maks Vertikal (Samping)
          </label>
          <div className="flex flex-wrap gap-1.5">
            {RANGE_OPTIONS.map((val) => (
              <button
                key={val}
                type="button"
                disabled={isRunning}
                onClick={() => onChangeConfig({ maxVertical: val })}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                  config.maxVertical === val
                    ? 'bg-pink-600 text-white shadow-md shadow-pink-600/30 ring-2 ring-pink-400/50'
                    : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                } disabled:opacity-60`}
              >
                Max {val}
              </button>
            ))}
          </div>
          <p className="text-[11px] text-slate-400 dark:text-slate-500 font-medium">
            Angka acak kiri di-generate dari 1 s/d {config.maxVertical}
          </p>
        </div>

      </div>

      {/* Action Buttons: Mulai & Stop */}
      <div className="pt-2 flex flex-col sm:flex-row items-center justify-end gap-3 border-t border-slate-200 dark:border-slate-800">
        {!isRunning ? (
          <button
            type="button"
            onClick={onStart}
            className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 text-slate-950 font-extrabold text-sm shadow-xl shadow-emerald-500/20 hover:brightness-110 active:scale-[0.98] transition-all cursor-pointer"
          >
            <Play className="w-5 h-5 fill-slate-950" />
            <span>MULAI HITUNG CEPAT</span>
          </button>
        ) : (
          <button
            id="btn-stop-game"
            type="button"
            onClick={onStop}
            className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-xl bg-gradient-to-r from-rose-600 to-red-600 text-white font-extrabold text-sm shadow-xl shadow-rose-600/30 hover:brightness-110 active:scale-[0.98] transition-all cursor-pointer focus:ring-4 focus:ring-red-500/50 outline-none animate-pulse-subtle"
          >
            <Square className="w-5 h-5 fill-white" />
            <span>SELESAI / PERIKSA JAWABAN</span>
          </button>
        )}
      </div>

    </div>
  );
};;
