import { AttemptResult, UserBestRecord } from '../types/math';

const STORAGE_KEY = 'fun_math_apps_user_records_v1';

export const formatTime = (ms: number): string => {
  const minutes = Math.floor(ms / 60000);
  const seconds = Math.floor((ms % 60000) / 1000);
  const centiseconds = Math.floor((ms % 1000) / 10);

  if (minutes > 0) {
    return `${minutes}m ${seconds.toString().padStart(2, '0')}.${centiseconds.toString().padStart(2, '0')}s`;
  }
  return `${seconds}.${centiseconds.toString().padStart(2, '0')}s`;
};

export const getUserRecords = (): Record<string, UserBestRecord> => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw);
  } catch (error) {
    console.error('Failed to parse user records from storage', error);
    return {};
  }
};

export const saveAttemptResult = (attempt: AttemptResult): UserBestRecord => {
  const records = getUserRecords();
  const name = attempt.userName.trim();
  const userKey = name.toLowerCase();

  const existingRecord: UserBestRecord = records[userKey] || {
    userName: name,
    bestTime: null,
    bestScore: null,
    history: [],
    lastPlayed: new Date().toISOString(),
  };

  // Add attempt to history (limit to last 50 attempts)
  const updatedHistory = [attempt, ...existingRecord.history].slice(0, 50);

  // Evaluate Best Score (Highest percentage, then lowest time as tie-breaker)
  let newBestScore = existingRecord.bestScore;
  if (
    !newBestScore ||
    attempt.percentage > newBestScore.percentage ||
    (attempt.percentage === newBestScore.percentage && attempt.timeInMs < newBestScore.timeInMs)
  ) {
    newBestScore = attempt;
  }

  // Evaluate Best Time (Fastest time achieved for high accuracy >= 80% or overall lowest time)
  let newBestTime = existingRecord.bestTime;
  if (!newBestTime) {
    newBestTime = attempt;
  } else {
    // Prefer higher accuracy first, then lower time
    const isHigherAccuracy = attempt.percentage > newBestTime.percentage;
    const isEqualAccuracyBetterTime = attempt.percentage === newBestTime.percentage && attempt.timeInMs < newBestTime.timeInMs;
    
    if (isHigherAccuracy || isEqualAccuracyBetterTime) {
      newBestTime = attempt;
    }
  }

  const updatedRecord: UserBestRecord = {
    userName: name,
    bestTime: newBestTime,
    bestScore: newBestScore,
    history: updatedHistory,
    lastPlayed: new Date().toISOString(),
  };

  records[userKey] = updatedRecord;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(records));

  return updatedRecord;
};

export const downloadLogTextFile = (selectedUserName?: string): void => {
  const records = getUserRecords();
  const timestampStr = new Date().toLocaleString('id-ID', { dateStyle: 'full', timeStyle: 'medium' });

  let text = `=====================================================\n`;
  text += `              FUN MATH APPS - LOG PENCAPAIAN         \n`;
  text += `=====================================================\n`;
  text += `Tanggal Unduh : ${timestampStr}\n`;
  text += `Keterangan    : Log Rekor Terbaik User (Waktu & Skor)\n`;
  text += `=====================================================\n\n`;

  const userKeys = Object.keys(records);

  if (userKeys.length === 0) {
    text += `Belum ada data latihan yang tercatat.\n`;
  } else {
    const listToExport = selectedUserName
      ? [records[selectedUserName.toLowerCase()]].filter(Boolean)
      : Object.values(records);

    listToExport.forEach((userRecord, index) => {
      text += `-----------------------------------------------------\n`;
      text += `USER #${index + 1}: ${userRecord.userName.toUpperCase()}\n`;
      text += `-----------------------------------------------------\n`;

      if (userRecord.bestScore) {
        const bs = userRecord.bestScore;
        const modeLabel = bs.operation === 'addition' ? 'Penambahan (+)' : 'Pengurangan (-)';
        text += `[BEST SKOR]  : ${bs.score}/${bs.total} (${bs.percentage}%) | Waktu: ${bs.formattedTime} | Mode: ${modeLabel} (${bs.boxCount} Box)\n`;
      } else {
        text += `[BEST SKOR]  : Belum ada data\n`;
      }

      if (userRecord.bestTime) {
        const bt = userRecord.bestTime;
        const modeLabel = bt.operation === 'addition' ? 'Penambahan (+)' : 'Pengurangan (-)';
        text += `[BEST WAKTU] : ${bt.formattedTime} | Skor: ${bt.score}/${bt.total} (${bt.percentage}%) | Mode: ${modeLabel} (${bt.boxCount} Box)\n`;
      } else {
        text += `[BEST WAKTU] : Belum ada data\n`;
      }

      text += `\nRIWAYAT LATIHAN TERAKHIR:\n`;
      userRecord.history.slice(0, 10).forEach((h, hIdx) => {
        const modeLabel = h.operation === 'addition' ? 'Penambahan' : 'Pengurangan';
        text += `  ${hIdx + 1}. [${new Date(h.timestamp).toLocaleDateString('id-ID')}] ${modeLabel} (${h.boxCount} Box) -> Skor: ${h.score}/${h.total} (${h.percentage}%), Waktu: ${h.formattedTime}\n`;
      });

      text += `\n`;
    });
  }

  text += `=====================================================\n`;
  text += `          Generated automatically by Fun Math Apps   \n`;
  text += `=====================================================\n`;

  // Trigger download blob
  const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  const fileName = selectedUserName
    ? `fun_math_log_${selectedUserName.toLowerCase().replace(/\s+/g, '_')}.txt`
    : `fun_math_apps_all_logs.txt`;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
