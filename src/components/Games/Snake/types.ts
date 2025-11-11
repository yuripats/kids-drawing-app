/**
 * Snake Game Type Definitions
 */

export interface Position {
  x: number;
  y: number;
}

export type Direction = 'up' | 'down' | 'left' | 'right';

export type GameStatus = 'ready' | 'playing' | 'paused' | 'gameOver';

export type Difficulty = 'easy' | 'medium' | 'hard';

export interface SnakeConfig {
  gridWidth: number;
  gridHeight: number;
  initialLength: number;
  tickMs: number;
}

export interface GameState {
  snake: Position[];
  food: Position;
  direction: Direction;
  nextDirection: Direction;
  score: number;
  highScore: number;
  gameStatus: GameStatus;
  difficulty: Difficulty;
}

export interface SnakeControls {
  changeDirection: (dir: Direction) => void;
  togglePause: () => void;
  resetGame: () => void;
  setDifficulty: (diff: Difficulty) => void;
}

export const DIFFICULTY_CONFIG: Record<Difficulty, SnakeConfig> = {
  easy: {
    gridWidth: 20,
    gridHeight: 20,
    initialLength: 3,
    tickMs: 200,
  },
  medium: {
    gridWidth: 20,
    gridHeight: 20,
    initialLength: 3,
    tickMs: 150,
  },
  hard: {
    gridWidth: 25,
    gridHeight: 25,
    initialLength: 3,
    tickMs: 100,
  },
};
