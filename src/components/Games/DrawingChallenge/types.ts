/**
 * Drawing Challenge Game Types
 */

export type Category = 'all' | 'animals' | 'food' | 'nature' | 'vehicles' | 'objects';
export type GameMode = 'free' | 'timed';
export type GameStatus = 'ready' | 'drawing' | 'finished';

export interface Prompt {
  id: string;
  category: Category;
  text: string;         // "Cat"
  emoji: string;        // 🐱
  difficulty: 1 | 2 | 3;
  hints?: string[];
}

export interface DrawingChallengeState {
  currentPrompt: Prompt | null;
  gameStatus: GameStatus;
  mode: GameMode;
  category: Category;
  timeLimit: number;        // seconds (0 = unlimited)
  timeRemaining: number;
  completedChallenges: string[]; // prompt IDs
}
