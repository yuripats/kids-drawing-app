export interface GameConfig {
  gridWidth?: number;
  gridHeight?: number;
  initialColors?: number;
}

export interface Position {
  x: number;
  y: number;
}

export type GameStatus = 'ready' | 'playing' | 'won' | 'gameOver';

export interface GameState {
  grid: string[][];
  score: number;
  highScore: number;
  colorCount: number;
  gridSize: [number, number];
  gameStatus: GameStatus;
  moves: number;
  selectedBlocks: Position[];
  message: string;
}

export interface ColorBlocksControls {
  handleBlockClick: (x: number, y: number) => void;
  handleBlockHover: (x: number, y: number) => void;
  resetGame: () => void;
  clearSelection: () => void;
}