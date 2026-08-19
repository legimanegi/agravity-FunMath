import React, { useRef, useEffect } from 'react';
import { GridCellData, OperationType, GameState } from '../types/math';
import { Check, X } from 'lucide-react';

interface MathGridProps {
  grid: GridCellData[][];
  horizontalHeader: number[];
  verticalColumn: number[];
  operation: OperationType;
  gameState: GameState;
  onUpdateAnswer: (row: number, col: number, value: string) => void;
  onStopGame: () => void;
}

export const MathGrid: React.FC<MathGridProps> = ({
  grid,
  horizontalHeader,
  verticalColumn,
  operation,
  gameState,
  onUpdateAnswer,
  onStopGame,
}) => {
  const inputRefs = useRef<(HTMLInputElement | null)[][]>([]);

  // Initialize 2D ref array
  useEffect(() => {
    inputRefs.current = grid.map(() => Array(horizontalHeader.length).fill(null));
  }, [grid.length, horizontalHeader.length]);

  // Requirement 5: Autofocus first cell (0,0) when game starts running
  useEffect(() => {
    if (gameState === 'running') {
      const timer = setTimeout(() => {
        const firstInput = inputRefs.current[0]?.[0];
        if (firstInput) {
          firstInput.focus();
          firstInput.select();
        }
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [gameState]);

  // Handle Keyboard Navigation
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, row: number, col: number) => {
    const totalRows = grid.length;
    const totalCols = horizontalHeader.length;

    let targetRow = row;
    let targetCol = col;

    switch (e.key) {
      case 'ArrowUp':
        e.preventDefault();
        targetRow = Math.max(0, row - 1);
        break;
      case 'ArrowDown':
        e.preventDefault();
        targetRow = Math.min(totalRows - 1, row + 1);
        break;
      case 'ArrowLeft':
        e.preventDefault();
        targetCol = Math.max(0, col - 1);
        break;
      case 'ArrowRight':
        e.preventDefault();
        targetCol = Math.min(totalCols - 1, col + 1);
        break;
      case 'Enter':
        // Requirement 7: Enter on last cell submits the game
        if (row === totalRows - 1 && col === totalCols - 1) {
          e.preventDefault();
          onStopGame();
          return;
        }
        
        // Standard Enter moves to next cell
        e.preventDefault();
        if (col < totalCols - 1) {
          targetCol = col + 1;
        } else if (row < totalRows - 1) {
          targetRow = row + 1;
          targetCol = 0;
        }
        break;
      case 'Tab':
        // Requirement 6: Tab on last cell focuses Stop button
        if (!e.shiftKey && row === totalRows - 1 && col === totalCols - 1) {
          e.preventDefault();
          const stopBtn = document.getElementById('btn-stop-game');
          if (stopBtn) {
            stopBtn.focus();
          }
          return;
        }

        // Standard Tab navigation
        if (!e.shiftKey) {
          e.preventDefault();
          if (col < totalCols - 1) {
            targetCol = col + 1;
          } else if (row < totalRows - 1) {
            targetRow = row + 1;
            targetCol = 0;
          }
        } else {
          // Shift + Tab moves backwards
          e.preventDefault();
          if (col > 0) {
            targetCol = col - 1;
          } else if (row > 0) {
            targetRow = row - 1;
            targetCol = totalCols - 1;
          }
        }
        break;
      default:
        return;
    }

    if (targetRow !== row || targetCol !== col) {
      const el = inputRefs.current[targetRow]?.[targetCol];
      if (el) {
        el.focus();
        el.select();
      }
    }
  };

  const isFinished = gameState === 'finished';
  const isRunning = gameState === 'running';
  const opSymbol = operation === 'addition' ? '+' : '-';

  return (
    <div className="w-full overflow-x-auto glass-panel rounded-2xl p-4 sm:p-6 shadow-2xl transition-colors duration-300">
      <div className="min-w-[800px] flex flex-col gap-3">
        
        {/* Helper Banner */}
        <div className="flex items-center justify-between px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300">
          <span>
            Hitung: <b className="text-indigo-600 dark:text-emerald-400">Angka Atas (Horizontal)</b> {opSymbol} <b className="text-pink-600 dark:text-pink-400">Angka Samping (Vertikal)</b>
          </span>
          <span className="font-mono text-indigo-600 dark:text-indigo-400">{grid.length * horizontalHeader.length} Total Kotak Soal</span>
        </div>

        {/* Matrix Grid Wrapper */}
        <div className="grid grid-cols-11 gap-2.5">
          
          {/* Top-Left Corner Box (Operation Symbol Badge) */}
          <div className="h-14 rounded-xl bg-gradient-to-br from-indigo-50 to-slate-100 dark:from-indigo-950 dark:to-slate-900 border border-indigo-200 dark:border-indigo-500/30 flex items-center justify-center font-extrabold text-xl text-indigo-600 dark:text-indigo-400 shadow-inner font-mono">
            {opSymbol}
          </div>

          {/* Key Point 1: Top Horizontal Random Numbers (Disabled Textboxes) */}
          {horizontalHeader.map((hVal, cIdx) => (
            <div
              key={`h-head-${cIdx}`}
              className="relative h-14 rounded-xl bg-indigo-50/70 dark:bg-slate-900 border-2 border-indigo-300 dark:border-indigo-500/40 flex flex-col items-center justify-center shadow-md dark:shadow-indigo-500/5 group"
            >
              <span className="text-[10px] uppercase font-mono tracking-tighter text-indigo-500/80 font-bold">
                H-{cIdx + 1}
              </span>
              <input
                type="text"
                disabled
                value={hVal}
                readOnly
                className="w-full text-center font-mono font-black text-xl text-indigo-700 dark:text-indigo-200 bg-transparent cursor-not-allowed select-none"
              />
              <div className="absolute -bottom-1 w-2 h-2 rounded-full bg-indigo-500" />
            </div>
          ))}

          {/* Grid Rows: Left Vertical Random Box + 10 Answer Textboxes */}
          {grid.map((rowCells, rIdx) => {
            const vVal = verticalColumn[rIdx];

            return (
              <React.Fragment key={`row-group-${rIdx}`}>
                
                {/* Key Point 2: Left Vertical Random Number (Disabled Textbox) */}
                <div className="relative h-14 rounded-xl bg-pink-50/70 dark:bg-slate-900 border-2 border-pink-300 dark:border-pink-500/40 flex flex-col items-center justify-center shadow-md dark:shadow-pink-500/5">
                  <span className="text-[10px] uppercase font-mono tracking-tighter text-pink-500/80 font-bold">
                    V-{rIdx + 1}
                  </span>
                  <input
                    type="text"
                    disabled
                    value={vVal}
                    readOnly
                    className="w-full text-center font-mono font-black text-xl text-pink-700 dark:text-pink-200 bg-transparent cursor-not-allowed select-none"
                  />
                  <div className="absolute -right-1 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-pink-500" />
                </div>

                {/* Key Point 3: Answer Textboxes (Kotak Jawaban) */}
                {rowCells.map((cell, cIdx) => {
                  let inputStyle = 'bg-white dark:bg-slate-900/90 border-slate-300 dark:border-slate-700/80 text-slate-900 dark:text-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20';
                  
                  if (isFinished) {
                    if (cell.isCorrect) {
                      inputStyle = 'bg-emerald-50 dark:bg-emerald-950/60 border-2 border-emerald-500 text-emerald-700 dark:text-emerald-300 font-bold shadow-md shadow-emerald-500/10';
                    } else {
                      inputStyle = 'bg-rose-50 dark:bg-rose-950/60 border-2 border-rose-500 text-rose-700 dark:text-rose-300 font-bold shadow-md shadow-rose-500/10';
                    }
                  } else if (isRunning && cell.userAnswer.trim() !== '') {
                    inputStyle = 'bg-indigo-50 dark:bg-indigo-950/40 border-2 border-indigo-500 dark:border-indigo-400 text-indigo-900 dark:text-indigo-100 font-bold';
                  }

                  return (
                    <div key={`cell-${rIdx}-${cIdx}`} className="relative h-14">
                      <input
                        ref={(el) => {
                          if (!inputRefs.current[rIdx]) inputRefs.current[rIdx] = [];
                          inputRefs.current[rIdx][cIdx] = el;
                        }}
                        type="number"
                        pattern="[0-9]*"
                        inputMode="numeric"
                        disabled={!isRunning}
                        value={cell.userAnswer}
                        onChange={(e) => onUpdateAnswer(rIdx, cIdx, e.target.value)}
                        onKeyDown={(e) => handleKeyDown(e, rIdx, cIdx)}
                        placeholder="?"
                        className={`w-full h-full rounded-xl text-center font-mono font-bold text-lg sm:text-xl transition-all outline-none disabled:opacity-80 placeholder:text-slate-400 dark:placeholder:text-slate-600 ${inputStyle}`}
                      />

                      {/* Evaluation Check / Cross Badge when finished */}
                      {isFinished && (
                        <div className="absolute -top-1.5 -right-1.5">
                          {cell.isCorrect ? (
                            <span className="flex items-center justify-center w-5 h-5 rounded-full bg-emerald-500 text-slate-950 shadow-md">
                              <Check className="w-3.5 h-3.5 stroke-[3]" />
                            </span>
                          ) : (
                            <span className="flex items-center justify-center w-5 h-5 rounded-full bg-rose-500 text-white shadow-md">
                              <X className="w-3.5 h-3.5 stroke-[3]" />
                            </span>
                          )}
                        </div>
                      )}

                      {/* Correct Answer Tooltip when finished & wrong */}
                      {isFinished && !cell.isCorrect && (
                        <div className="absolute left-1/2 -bottom-2 -translate-x-1/2 px-1.5 py-0.5 rounded bg-rose-100 dark:bg-rose-900 text-rose-800 dark:text-rose-200 text-[10px] font-mono font-extrabold z-10 border border-rose-300 dark:border-rose-700 shadow-lg whitespace-nowrap">
                          Jawaban: {cell.targetAnswer}
                        </div>
                      )}
                    </div>
                  );
                })}

              </React.Fragment>
            );
          })}

        </div>

      </div>
    </div>
  );
};
