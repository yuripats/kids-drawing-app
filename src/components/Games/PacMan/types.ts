export interface PacManState {
  pacman: PacMan;
  ghosts: Ghost[];
  maze: number[][];
  dots: Set<string>;  // Use Set for faster lookups: "row,col"
  powerPellets: Set<string>;
  score: number;
  highScore: number;
  lives: number;
  level: number;
  gameStatus: 'ready' | 'playing' | 'paused' | 'gameOver' | 'levelComplete';
  powerUpActive: boolean;
  powerUpTimer: number;
  frightenedTimer: number;
}

export interface PacMan {
  row: number;
  col: number;
  direction: Direction;
  nextDirection: Direction | null;
  mouthAngle: number;
  speed: number;
}

export interface Ghost {
  id: string;
  name: GhostName;
  row: number;
  col: number;
  direction: Direction;
  color: string;
  personality: GhostPersonality;
  mode: GhostMode;
  spawnRow: number;
  spawnCol: number;
}

export type GhostName = 'blinky' | 'pinky' | 'inky' | 'clyde';

export type GhostPersonality = 'aggressive' | 'ambush' | 'flanker' | 'random';

export type GhostMode = 'chase' | 'scatter' | 'frightened' | 'eaten';

export type Direction = 'up' | 'down' | 'left' | 'right' | 'none';

export interface GameControls {
  startGame: () => void;
  setDirection: (direction: Direction) => void;
  pauseGame: () => void;
  resetGame: () => void;
  nextLevel: () => void;
}

// Maze tile types
export enum MazeTile {
  EMPTY = 0,
  WALL = 1,
  DOT = 2,
  POWER_PELLET = 3,
  GHOST_SPAWN = 4,
  PACMAN_SPAWN = 5,
}

export interface Position {
  row: number;
  col: number;
}
