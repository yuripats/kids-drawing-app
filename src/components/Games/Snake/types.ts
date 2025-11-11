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

export type GridSize = 'small' | 'medium' | 'large' | 'xlarge';

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
  gridSize: GridSize;
}

export interface SnakeControls {
  changeDirection: (dir: Direction) => void;
  togglePause: () => void;
  resetGame: () => void;
  setDifficulty: (diff: Difficulty) => void;
  setGridSize: (size: GridSize) => void;
}

// Speed configuration (based on difficulty)
export const SPEED_CONFIG: Record<Difficulty, number> = {
  easy: 200,    // 200ms per tick
  medium: 150,  // 150ms per tick
  hard: 100,    // 100ms per tick
};

// Grid size configuration
export const GRID_SIZE_CONFIG: Record<GridSize, { width: number; height: number }> = {
  small: { width: 15, height: 15 },
  medium: { width: 20, height: 20 },
  large: { width: 25, height: 25 },
  xlarge: { width: 30, height: 30 },
};

// Helper to build full config from difficulty and grid size
export const buildSnakeConfig = (difficulty: Difficulty, gridSize: GridSize): SnakeConfig => {
  const gridConfig = GRID_SIZE_CONFIG[gridSize];
  return {
    gridWidth: gridConfig.width,
    gridHeight: gridConfig.height,
    initialLength: 3,
    tickMs: SPEED_CONFIG[difficulty],
  };
};
