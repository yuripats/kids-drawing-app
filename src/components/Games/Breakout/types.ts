export interface BreakoutState {
  paddle: Paddle;
  balls: Ball[];  // Support multi-ball power-up
  bricks: Brick[][];
  powerUps: PowerUp[];
  score: number;
  highScore: number;
  lives: number;
  level: number;
  gameStatus: 'ready' | 'playing' | 'paused' | 'gameOver' | 'levelComplete';
  combo: number;
  activePowerUps: ActivePowerUp[];
}

export interface Paddle {
  x: number;
  y: number;
  width: number;
  height: number;
  speed: number;
  color: string;
  originalWidth: number; // For power-up resets
}

export interface Ball {
  id: string;
  x: number;
  y: number;
  vx: number;           // Horizontal velocity
  vy: number;           // Vertical velocity
  radius: number;
  speed: number;
  stuck: boolean;       // Stuck to paddle at start
  color: string;
}

export interface Brick {
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  hits: number;         // Current hits taken
  maxHits: number;      // Hits needed to destroy
  type: BrickType;
  destroyed: boolean;
  points: number;
}

export type BrickType =
  | 'normal'            // 1 hit, 10 points
  | 'strong'            // 2 hits, 20 points
  | 'veryStrong'        // 3 hits, 30 points
  | 'unbreakable'       // Cannot be destroyed
  | 'powerup';          // Contains power-up, 30 points

export interface PowerUp {
  id: string;
  x: number;
  y: number;
  type: PowerUpType;
  width: number;
  height: number;
  vy: number;           // Fall speed
  collected: boolean;
}

export type PowerUpType =
  | 'widerPaddle'       // Paddle width increases
  | 'multiball'         // Spawn 2 additional balls
  | 'slowBall'          // Ball slows down
  | 'extraLife';        // Gain an extra life

export interface ActivePowerUp {
  type: PowerUpType;
  duration?: number;    // ms remaining (undefined for permanent ones like extraLife)
  startTime: number;
}

export interface GameControls {
  startGame: () => void;
  launchBall: () => void;
  movePaddle: (x: number) => void;
  pauseGame: () => void;
  resetGame: () => void;
  nextLevel: () => void;
}

export interface BrickPattern {
  rows: number;
  cols: number;
  pattern: (BrickType | null)[][];
}
