import React, { useState } from 'react';
import { UserBestRecord } from '../types/math';
import { Trophy, Download, Search, X, Award, Clock, History } from 'lucide-react';
import { downloadLogTextFile } from '../utils/storage';

interface LeaderboardModalProps {
  records: Record<string, UserBestRecord>;
  onClose: () => void;
}

export const LeaderboardModal: React.FC<LeaderboardModalProps> = ({ records, onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<UserBestRecord | null>(null);

  const userList = Object.values(records).filter((u) =>
    u.userName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-3xl glass-panel rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-6 max-h-[90vh] flex flex-col transition-colors duration-300">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400">
              <Trophy className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-slate-800 dark:text-white tracking-tight font-sans">
                Papan Rekor & Log Peserta
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">Data rekor Waktu Terbaik & Skor Terbaik per User</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search & Export Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 dark:text-slate-550 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari Nama User..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-xl text-xs text-slate-800 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-550 focus:border-indigo-500 focus:outline-none"
            />
          </div>

          <button
            onClick={() => downloadLogTextFile()}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-indigo-650 hover:bg-indigo-600 dark:bg-indigo-600 dark:hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-650/20 dark:shadow-indigo-600/20 transition-all cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Download Semua Log (.txt)</span>
          </button>
        </div>

        {/* User Table & Details */}
        <div className="flex-1 overflow-y-auto pr-1 space-y-4">
          {userList.length === 0 ? (
            <div className="text-center py-12 text-slate-400 dark:text-slate-500 text-sm">
              Belum ada data rekor user yang tersimpan.
            </div>
          ) : (
            <div className="space-y-3">
              {userList.map((user, idx) => {
                const isSelected = selectedUser?.userName === user.userName;

                return (
                  <div
                    key={user.userName}
                    className={`p-4 rounded-2xl border transition-all ${
                      isSelected
                        ? 'bg-indigo-50/50 dark:bg-slate-900/90 border-indigo-500/50 shadow-md dark:shadow-indigo-500/5'
                        : 'bg-white dark:bg-slate-900/50 border-slate-200 dark:border-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-900/80'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      
                      {/* User Info */}
                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 font-mono font-bold text-xs border border-slate-200 dark:border-slate-700">
                          #{idx + 1}
                        </div>
                        <div>
                          <h3 className="font-bold text-slate-800 dark:text-white text-sm">{user.userName}</h3>
                          <span className="text-[11px] text-slate-400 dark:text-slate-550 font-mono font-medium">
                            Total Latihan: {user.history.length}x
                          </span>
                        </div>
                      </div>

                      {/* Best Stats Badges */}
                      <div className="flex items-center gap-2">
                        {/* Best Time */}
                        <div className="px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 text-[11px]">
                          <span className="text-slate-450 dark:text-slate-500 block text-[10px] font-medium">Waktu Terbaik</span>
                          <span className="font-mono font-bold text-cyan-600 dark:text-cyan-400 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {user.bestTime ? user.bestTime.formattedTime : '-'}
                          </span>
                        </div>

                        {/* Best Score */}
                        <div className="px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 text-[11px]">
                          <span className="text-slate-450 dark:text-slate-500 block text-[10px] font-medium">Skor Terbaik</span>
                          <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                            <Award className="w-3 h-3" />
                            {user.bestScore ? `${user.bestScore.score}/${user.bestScore.total} (${user.bestScore.percentage}%)` : '-'}
                          </span>
                        </div>

                        <button
                          onClick={() => setSelectedUser(isSelected ? null : user)}
                          className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-650 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
                          title="Lihat Riwayat Latihan"
                        >
                          <History className="w-4 h-4" />
                        </button>
                      </div>

                    </div>

                    {/* Expandable History Details */}
                    {isSelected && (
                      <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-800/80 space-y-2">
                        <div className="flex items-center justify-between text-xs font-bold text-slate-500 dark:text-slate-400">
                          <span>Riwayat Pengerjaan (Max 10 Terakhir):</span>
                          <button
                            onClick={() => downloadLogTextFile(user.userName)}
                            className="text-indigo-600 dark:text-indigo-400 hover:underline text-[11px] flex items-center gap-1 cursor-pointer"
                          >
                            <Download className="w-3 h-3" /> Unduh Log User ini (.txt)
                          </button>
                        </div>
                        <div className="grid grid-cols-1 gap-1.5 max-h-40 overflow-y-auto">
                          {user.history.slice(0, 10).map((h, hIdx) => (
                            <div
                              key={h.id || hIdx}
                              className="px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800/60 flex items-center justify-between text-[11px] font-mono"
                            >
                              <span className="text-slate-500 dark:text-slate-400">
                                {new Date(h.timestamp).toLocaleDateString('id-ID')} | {h.operation === 'addition' ? 'Penambahan' : 'Pengurangan'} ({h.boxCount} Box)
                              </span>
                              <div className="flex items-center gap-3 font-bold">
                                <span className="text-emerald-600 dark:text-emerald-400">Skor: {h.score}/{h.total} ({h.percentage}%)</span>
                                <span className="text-cyan-600 dark:text-cyan-400">Waktu: {h.formattedTime}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
