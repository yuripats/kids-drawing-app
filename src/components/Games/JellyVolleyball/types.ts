// Type definitions for Jelly Volleyball game

export interface Vector2D {
  x: number;
  y: number;
}

export interface Player {
  position: Vector2D;
  velocity: Vector2D;
  radius: number;
  mass: number;
  // Jelly wobble effect (spring-mass system)
  wobbleOffset: Vector2D;
  wobbleVelocity: Vector2D;
  color: string;
  isAI: boolean;
}

export interface Ball {
  position: Vector2D;
  velocity: Vector2D;
  radius: number;
  mass: number;
}

export interface Court {
  width: number;
  height: number;
  netHeight: number;
  netWidth: number;
}

export interface GameConfig {
  courtWidth: number;
  courtHeight: number;
  netHeight: number;
  playerRadius: number;
  ballRadius: number;
  gravity: number;
  pointsToWin: number;
}

export interface GameState {
  player1: Player;
  player2: Player;
  ball: Ball;
  court: Court;
  score: {
    player1: number;
    player2: number;
  };
  gameStatus: 'menu' | 'playing' | 'paused' | 'gameOver';
  winner: number | null;
  lastScorer: number | null;
  servingPlayer: number;
}

export interface Controls {
  left: boolean;
  right: boolean;
  jump: boolean;
}

export interface PhysicsConfig {
  gravity: number;
  playerJumpForce: number;
  playerMoveSpeed: number;
  playerBounciness: number;
  ballBounciness: number;
  springStiffness: number;
  springDamping: number;
  friction: number;
}
