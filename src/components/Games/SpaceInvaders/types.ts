export type GameStatus = 'ready' | 'playing' | 'paused' | 'gameOver' | 'levelComplete';

export interface Position {
  x: number;
  y: number;
}

export interface Player {
  x: number;
  y: number;
  width: number;
  height: number;
  speed: number;
  color: string;
}

export interface Alien {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  type: 'basic' | 'medium' | 'advanced';
  points: number;
  alive: boolean;
  color: string;
}

export interface Bullet {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  speed: number;
  source: 'player' | 'alien';
  color: string;
}

export interface Barrier {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  blocks: boolean[][];
  blockSize: number;
}

export interface SpaceInvadersState {
  player: Player;
  aliens: Alien[];
  bullets: Bullet[];
  barriers: Barrier[];
  score: number;
  highScore: number;
  lives: number;
  level: number;
  gameStatus: GameStatus;
  alienDirection: 1 | -1;
  alienMoveDownNext: boolean;
  lastAlienShot: number;
}

export interface GameControls {
  startGame: () => void;
  pauseGame: () => void;
  resetGame: () => void;
  nextLevel: () => void;
  movePlayer: (x: number) => void;
  movePlayerLeft: () => void;
  movePlayerRight: () => void;
  stopPlayer: () => void;
  shoot: () => void;
}
