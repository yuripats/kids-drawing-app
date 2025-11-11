/**
 * Math Facts Game Tests
 */

import { describe, test, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useMathFacts } from '../../../../hooks/useMathFacts';

describe('useMathFacts Hook', () => {
  test('initializes with correct default state', () => {
    const { result } = renderHook(() => useMathFacts());

    expect(result.current.gameState.score).toBe(0);
    expect(result.current.gameState.correct).toBe(0);
    expect(result.current.gameState.incorrect).toBe(0);
    expect(result.current.gameState.streak).toBe(0);
    expect(result.current.gameState.difficulty).toBe('easy');
    expect(result.current.gameState.currentQuestion).toBeTruthy();
  });

  test('currentQuestion has valid properties', () => {
    const { result } = renderHook(() => useMathFacts());

    const question = result.current.gameState.currentQuestion!;
    expect(question.num1).toBeGreaterThan(0);
    expect(question.num2).toBeGreaterThan(0);
    expect(['add', 'subtract', 'multiply']).toContain(question.operation);
    expect(question.answer).toBeDefined();
  });

  test('checkAnswer increases score and streak on correct answer', () => {
    const { result } = renderHook(() => useMathFacts());

    const correctAnswer = result.current.gameState.currentQuestion!.answer;

    act(() => {
      result.current.checkAnswer(correctAnswer);
    });

    expect(result.current.gameState.score).toBeGreaterThan(0);
    expect(result.current.gameState.correct).toBe(1);
    expect(result.current.gameState.streak).toBe(1);
    expect(result.current.gameState.incorrect).toBe(0);
  });

  test('checkAnswer resets streak on incorrect answer', () => {
    const { result } = renderHook(() => useMathFacts());

    const correctAnswer = result.current.gameState.currentQuestion!.answer;

    // Get one correct answer first
    act(() => {
      result.current.checkAnswer(correctAnswer);
    });

    expect(result.current.gameState.streak).toBe(1);

    // Now give wrong answer
    act(() => {
      result.current.checkAnswer(-999);
    });

    expect(result.current.gameState.streak).toBe(0);
    expect(result.current.gameState.incorrect).toBe(1);
  });

  test('setDifficulty changes difficulty and generates new question', () => {
    const { result } = renderHook(() => useMathFacts());

    expect(result.current.gameState.difficulty).toBe('easy');

    act(() => {
      result.current.setDifficulty('hard');
    });

    expect(result.current.gameState.difficulty).toBe('hard');
    expect(result.current.gameState.currentQuestion).toBeTruthy();
  });

  test('resetGame resets all stats but keeps difficulty', () => {
    const { result } = renderHook(() => useMathFacts());

    // Set difficulty and answer some questions
    act(() => {
      result.current.setDifficulty('medium');
      const correctAnswer = result.current.gameState.currentQuestion!.answer;
      result.current.checkAnswer(correctAnswer);
    });

    expect(result.current.gameState.score).toBeGreaterThan(0);
    expect(result.current.gameState.difficulty).toBe('medium');

    act(() => {
      result.current.resetGame();
    });

    expect(result.current.gameState.score).toBe(0);
    expect(result.current.gameState.correct).toBe(0);
    expect(result.current.gameState.incorrect).toBe(0);
    expect(result.current.gameState.streak).toBe(0);
    expect(result.current.gameState.difficulty).toBe('medium'); // Kept
  });

  test('question answer is calculated correctly for addition', () => {
    const { result } = renderHook(() => useMathFacts());

    // Keep generating until we get an addition question
    let question = result.current.gameState.currentQuestion!;
    let attempts = 0;
    while (question.operation !== 'add' && attempts < 100) {
      act(() => {
        result.current.checkAnswer(question.answer);
      });
      question = result.current.gameState.currentQuestion!;
      attempts++;
    }

    if (question.operation === 'add') {
      expect(question.answer).toBe(question.num1 + question.num2);
    }
  });

  test('question answer is calculated correctly for subtraction', () => {
    const { result } = renderHook(() => useMathFacts());

    // Set to medium to get subtraction questions
    act(() => {
      result.current.setDifficulty('medium');
    });

    // Keep generating until we get a subtraction question
    let question = result.current.gameState.currentQuestion!;
    let attempts = 0;
    while (question.operation !== 'subtract' && attempts < 100) {
      act(() => {
        result.current.checkAnswer(question.answer);
      });
      question = result.current.gameState.currentQuestion!;
      attempts++;
    }

    if (question.operation === 'subtract') {
      expect(question.answer).toBe(question.num1 - question.num2);
      // Subtraction should never give negative result
      expect(question.answer).toBeGreaterThanOrEqual(0);
    }
  });

  test('easy difficulty only generates addition questions', () => {
    const { result } = renderHook(() => useMathFacts());

    act(() => {
      result.current.setDifficulty('easy');
    });

    // Check multiple questions
    for (let i = 0; i < 10; i++) {
      const question = result.current.gameState.currentQuestion!;
      expect(question.operation).toBe('add');
      act(() => {
        result.current.checkAnswer(question.answer);
      });
    }
  });
});
