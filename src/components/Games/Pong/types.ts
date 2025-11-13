export type GameStatus = 'ready' | 'playing' | 'paused' | 'gameOver';

export interface Paddle {
  x: number;
  y: number;
  width: number;
  height: number;
  speed: number;
  color: string;
}

export interface Ball {
  x: number;
  y: number;
  radius: number;
  vx: number;
  vy: number;
  speed: number;
  color: string;
}

export interface PongState {
  playerPaddle: Paddle;
  aiPaddle: Paddle;
  ball: Ball;
  playerScore: number;
  aiScore: number;
  gameStatus: GameStatus;
  winScore: number;
  difficulty: 'easy' | 'medium' | 'hard';
  rallyCount: number;
}

export interface GameControls {
  startGame: () => void;
  pauseGame: () => void;
  resetGame: () => void;
  movePaddle: (y: number) => void;
  movePlayerUp: () => void;
  movePlayerDown: () => void;
  stopPlayer: () => void;
  setDifficulty: (difficulty: 'easy' | 'medium' | 'hard') => void;
}
