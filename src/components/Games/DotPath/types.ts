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
  isStart: boolean;
  isEnd: boolean;
  number?: number; // for numbered mode (easy)
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
  showNumbers: boolean; // true for easy mode
  startPoint: DotPosition;
  endPoint: DotPosition;
}

export interface DifficultySettings {
  name: string;
  gridSize: number;
  showNumbers: boolean;
  defineEnd: boolean; // whether end point is predefined
}
