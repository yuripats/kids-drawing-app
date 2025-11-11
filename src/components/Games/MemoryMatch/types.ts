/**
 * Memory Match Game Types
 */

export type Difficulty = 'easy' | 'medium' | 'hard';
export type Theme = 'animals' | 'food' | 'space' | 'shapes';
export type GameStatus = 'ready' | 'playing' | 'completed';

export interface Card {
  id: string;
  value: string;       // emoji or image
  isFlipped: boolean;
  isMatched: boolean;
  index: number;
}

export interface MemoryMatchState {
  cards: Card[];
  flippedIndices: number[];
  matchedPairs: Set<string>;
  moves: number;
  gameStatus: GameStatus;
  difficulty: Difficulty;
  theme: Theme;
  timer: number;
  bestTime: number;
}

export interface MemoryMatchConfig {
  difficulty: Difficulty;
  theme: Theme;
}

export interface DifficultySettings {
  pairs: number;
  gridCols: number;
  name: string;
}
