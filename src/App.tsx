import { useState, useEffect, useRef } from 'react';
import { GameConfig, GameState, GridCellData, AttemptResult, UserBestRecord } from './types/math';
import { getUserRecords, saveAttemptResult, formatTime } from './utils/storage';
import { Header } from './components/Header';
import { ConfigPanel } from './components/ConfigPanel';
import { MathGrid } from './components/MathGrid';
import { TimerDisplay } from './components/TimerDisplay';
import { ResultModal } from './components/ResultModal';
import { LeaderboardModal } from './components/LeaderboardModal';
import { MiniLeaderboard } from './components/MiniLeaderboard';

// Web Audio API helper for sound effects without external MP3 dependencies
const playBeepSound = (freq = 600, duration = 0.1, type: OscillatorType = 'sine') => {
  try {
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + duration);
  } catch (e) {
    console.error('Audio playback error', e);
  }
};

// Requirement 4: Helper to generate unique random integers in a range
const generateUniqueRandomsInRange = (count: number, min: number, max: number): number[] => {
  const pool: number[] = [];
  const limit = Math.max(max, min + count - 1);
  for (let i = min; i <= limit; i++) {
    pool.push(i);
  }
  
  // Fisher-Yates Shuffle
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  
  return pool.slice(0, count);
};

export function App() {
  // Theme state: dark / light
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  // Game Configuration State
  const [config, setConfig] = useState<GameConfig>({
    userName: 'User 1',
    operation: 'addition',
    boxCount: 10,
    maxHorizontal: 10,
    maxVertical: 10,
  });

  // Game Engine State
  const [gameState, setGameState] = useState<GameState>('idle');
  const [horizontalHeader, setHorizontalHeader] = useState<number[]>([]);
  const [verticalColumn, setVerticalColumn] = useState<number[]>([]);
  const [grid, setGrid] = useState<GridCellData[][]>([]);
  
  // Timer State
  const [timeInMs, setTimeInMs] = useState<number>(0);
  const timerRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(0);

  // Sound & Modals State
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [lastResult, setLastResult] = useState<AttemptResult | null>(null);
  const [userRecord, setUserRecord] = useState<UserBestRecord | null>(null);
  const [showResultModal, setShowResultModal] = useState<boolean>(false);
  const [showLeaderboard, setShowLeaderboard] = useState<boolean>(false);
  const [userRecordsMap, setUserRecordsMap] = useState<Record<string, UserBestRecord>>({});

  // Load user records on mount
  useEffect(() => {
    const records = getUserRecords();
    setUserRecordsMap(records);
  }, []);

  // Sync theme with Document Class
  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  // Update Game Configuration
  const handleConfigChange = (newConfig: Partial<GameConfig>) => {
    setConfig((prev) => ({ ...prev, ...newConfig }));
  };

  // Generate Matrix Problem Grid
  const generateMatrix = (cfg: GameConfig) => {
    const colsCount = 10; // Always 10 horizontal boxes
    const rowsCount = cfg.boxCount / 10; // e.g. 10 box = 1 row, 20 box = 2 rows, ... 100 box = 10 rows

    let hValues: number[] = [];
    let vValues: number[] = [];

    // Requirement 4: Generate unique random numbers for headers
    if (cfg.operation === 'addition') {
      hValues = generateUniqueRandomsInRange(colsCount, 1, cfg.maxHorizontal);
      vValues = generateUniqueRandomsInRange(rowsCount, 1, cfg.maxVertical);
    } else {
      // Subtraction: Ensure hVal >= vVal by setting vertical range then shifting horizontal start
      vValues = generateUniqueRandomsInRange(rowsCount, 1, cfg.maxVertical);
      const maxV = Math.max(...vValues);
      hValues = generateUniqueRandomsInRange(colsCount, maxV, maxV + cfg.maxHorizontal - 1);
    }

    // Build 2D Grid Cells
    const newGrid: GridCellData[][] = [];
    for (let r = 0; r < rowsCount; r++) {
      const rowCells: GridCellData[] = [];
      const vVal = vValues[r];

      for (let c = 0; c < colsCount; c++) {
        const hVal = hValues[c];
        const target = cfg.operation === 'addition' ? hVal + vVal : hVal - vVal;

        rowCells.push({
          row: r,
          col: c,
          hVal,
          vVal,
          targetAnswer: target,
          userAnswer: '',
          isCorrect: null,
        });
      }
      newGrid.push(rowCells);
    }

    setHorizontalHeader(hValues);
    setVerticalColumn(vValues);
    setGrid(newGrid);
  };

  // Generate matrix initially on config change when idle
  useEffect(() => {
    if (gameState === 'idle') {
      generateMatrix(config);
    }
  }, [config.boxCount, config.operation, config.maxHorizontal, config.maxVertical, gameState]);

  // Start Speed Math Session
  const handleStartGame = () => {
    if (!config.userName.trim()) {
      alert('Silakan masukkan Nama User sebelum memulai!');
      return;
    }

    if (soundEnabled) {
      playBeepSound(800, 0.15, 'sine');
    }

    generateMatrix(config);
    setGameState('running');
    setTimeInMs(0);
    setLastResult(null);
    setShowResultModal(false);

    startTimeRef.current = Date.now();
    if (timerRef.current) clearInterval(timerRef.current);

    timerRef.current = window.setInterval(() => {
      setTimeInMs(Date.now() - startTimeRef.current);
    }, 10);
  };

  // Stop / Submit Answers for Evaluation
  const handleStopGame = () => {
    if (gameState !== 'running') return;

    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    const finalTimeInMs = Date.now() - startTimeRef.current;
    setTimeInMs(finalTimeInMs);

    // Evaluate answers
    let correctCount = 0;
    const totalCells = grid.length * horizontalHeader.length;

    const evaluatedGrid = grid.map((row) =>
      row.map((cell) => {
        const userNum = parseInt(cell.userAnswer.trim(), 10);
        const isCorrect = !isNaN(userNum) && userNum === cell.targetAnswer;

        if (isCorrect) correctCount++;

        return {
          ...cell,
          isCorrect,
        };
      })
    );

    setGrid(evaluatedGrid);
    setGameState('finished');

    const percentage = Math.round((correctCount / totalCells) * 100);
    const formattedTime = formatTime(finalTimeInMs);

    const attempt: AttemptResult = {
      id: `attempt-${Date.now()}`,
      userName: config.userName.trim(),
      operation: config.operation,
      boxCount: config.boxCount,
      maxHorizontal: config.maxHorizontal,
      maxVertical: config.maxVertical,
      score: correctCount,
      total: totalCells,
      percentage,
      timeInMs: finalTimeInMs,
      formattedTime,
      timestamp: new Date().toISOString(),
    };

    // Save attempt and update best records
    const updatedUserRecord = saveAttemptResult(attempt);
    setUserRecord(updatedUserRecord);
    setLastResult(attempt);
    setUserRecordsMap(getUserRecords());

    if (soundEnabled) {
      if (percentage === 100) {
        playBeepSound(1000, 0.3, 'triangle');
      } else {
        playBeepSound(650, 0.2, 'sine');
      }
    }

    setShowResultModal(true);
  };

  // Input Answer Handler
  const handleUpdateAnswer = (row: number, col: number, value: string) => {
    if (gameState !== 'running') return;

    setGrid((prev) => {
      const nextGrid = [...prev.map((r) => [...r])];
      nextGrid[row][col].userAnswer = value;
      return nextGrid;
    });
  };

  // Count filled answers
  const filledCount = grid.reduce(
    (acc, row) => acc + row.filter((c) => c.userAnswer.trim() !== '').length,
    0
  );
  const totalBoxes = grid.length * horizontalHeader.length;

  return (
    <div className="min-h-screen transition-colors duration-300 bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 flex flex-col selection:bg-indigo-500 selection:text-white">
      
      {/* Top Header Bar */}
      <Header
        userName={config.userName}
        soundEnabled={soundEnabled}
        onToggleSound={() => setSoundEnabled(!soundEnabled)}
        onOpenLeaderboard={() => setShowLeaderboard(true)}
        theme={theme}
        onToggleTheme={() => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        
        {/* Top 3 Global Highlight */}
        <MiniLeaderboard records={userRecordsMap} />

        {/* Practice Config Panel */}
        <ConfigPanel
          config={config}
          onChangeConfig={handleConfigChange}
          gameState={gameState}
          onStart={handleStartGame}
          onStop={handleStopGame}
        />

        {/* Stopwatch & Live Progress Bar */}
        {(gameState === 'running' || gameState === 'finished') && (
          <TimerDisplay
            timeInMs={timeInMs}
            isRunning={gameState === 'running'}
            totalBoxes={totalBoxes}
            filledBoxes={filledCount}
          />
        )}

        {/* Core Matrix Grid View */}
        <MathGrid
          grid={grid}
          horizontalHeader={horizontalHeader}
          verticalColumn={verticalColumn}
          operation={config.operation}
          gameState={gameState}
          onUpdateAnswer={handleUpdateAnswer}
          onStopGame={handleStopGame}
        />

      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800/85 py-4 text-center text-xs text-slate-500 font-medium transition-colors duration-300">
        Fun Math Apps &copy; {new Date().getFullYear()} - Speed Math Practice Matrix (React + Tailwind CSS)
      </footer>

      {/* Result Modal Popup */}
      {showResultModal && lastResult && (
        <ResultModal
          result={lastResult}
          userRecord={userRecord}
          // Requirement 2: Reset to idle state when clicking Play Again
          onRestart={() => {
            setGameState('idle');
            setShowResultModal(false);
          }}
          onClose={() => setShowResultModal(false)}
        />
      )}

      {/* Leaderboard & Log History Modal */}
      {showLeaderboard && (
        <LeaderboardModal
          records={userRecordsMap}
          onClose={() => setShowLeaderboard(false)}
        />
      )}

    </div>
  );
}

export default App;
