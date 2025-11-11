/**
 * Math Facts Game Hook
 */

import { useState, useCallback } from 'react';
import type { MathFactsState, Question, Operation, Difficulty } from '../components/Games/MathFacts/types';
import { playSound, celebrateWin } from '../utils/gameUtils';

const generateQuestion = (difficulty: Difficulty): Question => {
  const operations: Operation[] = difficulty === 'easy' ? ['add'] : difficulty === 'medium' ? ['add', 'subtract'] : ['add', 'subtract', 'multiply'];
  const operation = operations[Math.floor(Math.random() * operations.length)];

  const maxNum = difficulty === 'easy' ? 10 : difficulty === 'medium' ? 20 : 12;
  let num1 = Math.floor(Math.random() * maxNum) + 1;
  let num2 = Math.floor(Math.random() * maxNum) + 1;

  // Ensure subtraction doesn't give negative results
  if (operation === 'subtract' && num2 > num1) {
    [num1, num2] = [num2, num1];
  }

  const answer =
    operation === 'add' ? num1 + num2 :
    operation === 'subtract' ? num1 - num2 :
    num1 * num2;

  return { num1, num2, operation, answer };
};

export const useMathFacts = () => {
  const [gameState, setGameState] = useState<MathFactsState>({
    currentQuestion: generateQuestion('easy'),
    score: 0,
    correct: 0,
    incorrect: 0,
    streak: 0,
    difficulty: 'easy'
  });

  const checkAnswer = useCallback((userAnswer: number) => {
    const { currentQuestion } = gameState;
    if (!currentQuestion) return;

    const isCorrect = userAnswer === currentQuestion.answer;

    if (isCorrect) {
      playSound('match');
      if (gameState.streak > 0 && gameState.streak % 5 === 4) {
        celebrateWin();
      }
      setGameState(prev => ({
        ...prev,
        currentQuestion: generateQuestion(prev.difficulty),
        score: prev.score + (prev.streak >= 5 ? 20 : 10),
        correct: prev.correct + 1,
        streak: prev.streak + 1
      }));
    } else {
      playSound('lose');
      setGameState(prev => ({
        ...prev,
        currentQuestion: generateQuestion(prev.difficulty),
        incorrect: prev.incorrect + 1,
        streak: 0
      }));
    }
  }, [gameState]);

  const setDifficulty = useCallback((difficulty: Difficulty) => {
    setGameState(prev => ({
      ...prev,
      difficulty,
      currentQuestion: generateQuestion(difficulty)
    }));
  }, []);

  const resetGame = useCallback(() => {
    setGameState(prev => ({
      currentQuestion: generateQuestion(prev.difficulty),
      score: 0,
      correct: 0,
      incorrect: 0,
      streak: 0,
      difficulty: prev.difficulty
    }));
  }, []);

  return {
    gameState,
    checkAnswer,
    setDifficulty,
    resetGame
  };
};
