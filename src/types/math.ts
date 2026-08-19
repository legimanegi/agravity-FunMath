export type OperationType = 'addition' | 'subtraction';

export type BoxOption = 10 | 20 | 30 | 40 | 50 | 60 | 70 | 80 | 90 | 100;

export interface GameConfig {
  userName: string;
  operation: OperationType;
  boxCount: BoxOption;
  maxHorizontal: number;
  maxVertical: number;
}

export interface GridCellData {
  row: number;
  col: number;
  hVal: number; // Horizontal top random number
  vVal: number; // Vertical left random number
  targetAnswer: number; // Correct calculated answer
  userAnswer: string; // User input
  isCorrect: boolean | null; // null = not checked yet
}

export interface AttemptResult {
  id: string;
  userName: string;
  operation: OperationType;
  boxCount: number;
  maxHorizontal: number;
  maxVertical: number;
  score: number;
  total: number;
  percentage: number;
  timeInMs: number;
  formattedTime: string;
  timestamp: string;
}

export interface UserBestRecord {
  userName: string;
  bestTime: AttemptResult | null;
  bestScore: AttemptResult | null;
  history: AttemptResult[];
  lastPlayed: string;
}

export type GameState = 'idle' | 'running' | 'finished';
