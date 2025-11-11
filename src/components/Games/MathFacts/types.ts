/**
 * Math Facts Game Types
 */

export type Operation = 'add' | 'subtract' | 'multiply';
export type Difficulty = 'easy' | 'medium' | 'hard';

export interface Question {
  num1: number;
  num2: number;
  operation: Operation;
  answer: number;
}

export interface MathFactsState {
  currentQuestion: Question | null;
  score: number;
  correct: number;
  incorrect: number;
  streak: number;
  difficulty: Difficulty;
}
