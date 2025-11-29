/**
 * Dot Path Game Types
 * Type definitions for the dot connection puzzle game
 */

export type Difficulty = 'easy' | 'medium' | 'hard';
export type GameStatus = 'ready' | 'playing' | 'completed';

export interface DotPosition {
  row: number;
  col: number;
}

export interface DotState {
  position: DotPosition;
  visited: boolean;
  number: number; // 1, 2, 3, etc. - the sequence number
  isEmpty?: boolean; // true if this cell is just empty space (no dot)
}

export interface GameState {
  grid: DotState[][];
  path: DotPosition[]; // ordered list of visited dots
  currentDot: DotPosition | null;
  gridSize: number;
  difficulty: Difficulty;
  moves: number;
  timer: number;
  bestTimes: Record<Difficulty, number>;
  gameStatus: GameStatus;
  totalDots: number; // total numbered dots to connect
  nextNumber: number; // next number in sequence to connect
}

export interface DifficultySettings {
  name: string;
  gridSize: number;
  dotCount: number; // how many numbered dots to place
}
