/**
 * Simon Says Game Types
 */

export type ButtonColor = 'red' | 'blue' | 'green' | 'yellow';
export type Speed = 'slow' | 'normal' | 'fast';
export type GameStatus = 'ready' | 'showing' | 'playing' | 'gameOver';

export interface SimonSaysState {
  sequence: number[];        // Button indices [0,1,2,3]
  userInput: number[];       // User's current input
  round: number;             // Current round number
  gameStatus: GameStatus;
  speed: Speed;
  highScore: number;
  showingIndex: number;      // Currently showing button in sequence
}

export interface ButtonConfig {
  color: ButtonColor;
  frequency: number;         // Audio frequency
  className: string;         // Tailwind classes
}
