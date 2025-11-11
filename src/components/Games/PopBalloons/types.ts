/**
 * Pop the Balloons Game Types
 */

export type Difficulty = 'easy' | 'medium' | 'hard';
export type GameStatus = 'ready' | 'playing' | 'gameOver';
export type BalloonType = 'normal' | 'golden' | 'bomb';

export interface Balloon {
  id: string;
  position: { row: number; col: number }; // 3x3 grid (0-2)
  type: BalloonType;
  color: string;              // HSL color string
  lifetime: number;            // ms until auto-pop
  spawnTime: number;           // timestamp when spawned
}

export interface PopBalloonsState {
  balloons: Balloon[];
  score: number;
  highScore: number;
  combo: number;               // Consecutive pops
  maxCombo: number;
  gameStatus: GameStatus;
  difficulty: Difficulty;
  timeRemaining: number;       // seconds
  lives: number;
  totalPopped: number;         // Statistics
  totalMissed: number;
}

export interface DifficultySettings {
  spawnRate: number;           // ms between spawns
  balloonLifetime: number;     // ms balloon stays visible
  bombChance: number;          // 0-1 probability
  startingLives: number;
  gameDuration: number;        // seconds
  goldenChance: number;        // 0-1 probability
  name: string;
}
