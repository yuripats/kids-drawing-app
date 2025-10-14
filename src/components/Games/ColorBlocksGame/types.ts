export interface GameConfig {
  gridWidth?: number;
  gridHeight?: number;
  initialColors?: number;
}

export interface GameState {
  grid: string[][];
  score: number;
  colorCount: number;
  gridSize: [number, number];
}