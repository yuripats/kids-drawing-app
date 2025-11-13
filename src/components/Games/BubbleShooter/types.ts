export type GameStatus = 'ready' | 'playing' | 'paused' | 'gameOver' | 'levelComplete';
export type BubbleColor = 'red' | 'blue' | 'green' | 'yellow' | 'purple' | 'orange';

export interface Bubble {
  id: string;
  row: number;
  col: number;
  x: number;
  y: number;
  radius: number;
  color: BubbleColor;
  marked?: boolean;
}

export interface ShootingBubble {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: BubbleColor;
}

export interface Shooter {
  x: number;
  y: number;
  angle: number;
  currentColor: BubbleColor;
  nextColor: BubbleColor;
}

export interface BubbleShooterState {
  bubbles: Bubble[];
  shootingBubble: ShootingBubble | null;
  shooter: Shooter;
  score: number;
  highScore: number;
  level: number;
  gameStatus: GameStatus;
  shotsLeft: number;
}

export interface GameControls {
  startGame: () => void;
  pauseGame: () => void;
  resetGame: () => void;
  nextLevel: () => void;
  setAngle: (angle: number) => void;
  shoot: () => void;
}
