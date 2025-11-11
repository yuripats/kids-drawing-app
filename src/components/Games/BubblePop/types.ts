/**
 * Bubble Pop Game Types
 */

export type GameStatus = 'playing' | 'paused';

export interface Bubble {
  id: string;
  x: number;
  y: number;
  size: number;
  color: string;
  speed: number;
}

export interface BubblePopState {
  bubbles: Bubble[];
  score: number;
  bubblesPopped: number;
  gameStatus: GameStatus;
}
