export interface FlappyBirdState {
  bird: Bird;
  pipes: Pipe[];
  score: number;
  highScore: number;
  gameStatus: 'ready' | 'playing' | 'gameOver';
  distanceTraveled: number;
}

export interface Bird {
  y: number;              // Vertical position (px)
  velocity: number;       // Vertical velocity (px/frame)
  rotation: number;       // Visual rotation in degrees
  radius: number;         // Collision radius
}

export interface Pipe {
  id: string;
  x: number;              // Horizontal position
  gapY: number;           // Center of gap
  gapSize: number;        // Height of gap
  width: number;
  passed: boolean;        // Has bird passed this pipe?
}

export interface GameControls {
  startGame: () => void;
  flap: () => void;
  resetGame: () => void;
  pauseGame: () => void;
}
