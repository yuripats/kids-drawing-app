export type GameStatus = 'ready' | 'playing' | 'paused' | 'gameOver';

export interface Player {
  x: number;
  y: number;
  width: number;
  height: number;
  velocityY: number;
  isJumping: boolean;
  isDucking: boolean;
  color: string;
}

export interface Obstacle {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  type: 'cactus' | 'rock' | 'bird';
  color: string;
}

export interface Cloud {
  id: string;
  x: number;
  y: number;
  width: number;
}

export interface EndlessRunnerState {
  player: Player;
  obstacles: Obstacle[];
  clouds: Cloud[];
  score: number;
  highScore: number;
  distance: number;
  gameStatus: GameStatus;
  speed: number;
  groundY: number;
}

export interface GameControls {
  startGame: () => void;
  pauseGame: () => void;
  resetGame: () => void;
  jump: () => void;
  duck: () => void;
  stopDuck: () => void;
}
