export type TetrominoType = 'I' | 'O' | 'T' | 'S' | 'Z' | 'J' | 'L';

export interface Piece {
  type: TetrominoType;
  rotation: number; // 0..3
  x: number; // column
  y: number; // row
}

export interface TetrisConfig {
  width: number;
  height: number;
  tickMs?: number; // gravity interval
}

export type Cell = null | {
  type: TetrominoType;
  locked: boolean;
};

export interface TetrisState {
  board: Cell[][]; // [row][col]
  active: Piece | null;
  nextQueue: TetrominoType[];
  score: number;
  lines: number;
  level: number;
  gameOver: boolean;
  tickMs: number;
}