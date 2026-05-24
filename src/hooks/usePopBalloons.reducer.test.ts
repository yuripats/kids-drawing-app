/**
 * Pure reducer tests for usePopBalloons (PR-4c1)
 * Tests balloonReducer and makeInitialState in isolation — no React, no timers.
 */

import { describe, it, expect } from 'vitest';
import { balloonReducer, makeInitialState } from './usePopBalloons';
import { POINTS, COMBO_WINDOW, difficultySettings } from '../components/Games/PopBalloons/constants';
import type { Balloon } from '../components/Games/PopBalloons/types';

// ── Helpers ───────────────────────────────────────────────────────────────────

function makeBalloon(overrides: Partial<Balloon> = {}): Balloon {
  return {
    id: 'b1',
    position: { row: 0, col: 0 },
    type: 'normal',
    color: 'hsl(0, 70%, 60%)',
    lifetime: 2000,
    spawnTime: 1000,
    ...overrides,
  };
}

// ── makeInitialState ──────────────────────────────────────────────────────────

describe('makeInitialState', () => {
  it('produces a ready state with correct duration and lives for easy', () => {
    const s = makeInitialState('easy');
    expect(s.gameStatus).toBe('ready');
    expect(s.difficulty).toBe('easy');
    expect(s.gridSize).toBe('small');
    expect(s.timeRemaining).toBe(difficultySettings.easy.gameDuration);
    expect(s.lives).toBe(difficultySettings.easy.startingLives);
    expect(s.score).toBe(0);
    expect(s.highScore).toBe(0);
    expect(s.balloons).toEqual([]);
    expect(s.lastPopTime).toBe(0);
  });

  it('respects gridSize and highScore overrides', () => {
    const s = makeInitialState('hard', 'large', 99);
    expect(s.gridSize).toBe('large');
    expect(s.highScore).toBe(99);
    expect(s.difficulty).toBe('hard');
    expect(s.lives).toBe(difficultySettings.hard.startingLives);
  });
});

// ── RESET ─────────────────────────────────────────────────────────────────────

describe('RESET action', () => {
  it('resets score, balloons, lives while preserving gridSize and highScore', () => {
    const before = { ...makeInitialState('easy', 'medium', 50), score: 200, balloons: [makeBalloon()] };
    const after = balloonReducer(before, { type: 'RESET', difficulty: 'easy', gridSize: 'medium', highScore: 50 });

    expect(after.score).toBe(0);
    expect(after.balloons).toEqual([]);
    expect(after.highScore).toBe(50);
    expect(after.gridSize).toBe('medium');
    expect(after.gameStatus).toBe('ready');
  });
});

// ── START ─────────────────────────────────────────────────────────────────────

describe('START action', () => {
  it('sets gameStatus to playing and initialises lastPopTime', () => {
    const before = makeInitialState('easy');
    const now = Date.now();
    const after = balloonReducer(before, { type: 'START' });

    expect(after.gameStatus).toBe('playing');
    expect(after.lastPopTime).toBeGreaterThanOrEqual(now);
  });
});

// ── SET_DIFFICULTY ────────────────────────────────────────────────────────────

describe('SET_DIFFICULTY action', () => {
  it('resets game with the new difficulty settings', () => {
    const before = { ...makeInitialState('easy'), score: 100, gameStatus: 'playing' as const };
    const after = balloonReducer(before, { type: 'SET_DIFFICULTY', difficulty: 'hard' });

    expect(after.difficulty).toBe('hard');
    expect(after.score).toBe(0);
    expect(after.gameStatus).toBe('ready');
    expect(after.lives).toBe(difficultySettings.hard.startingLives);
  });

  it('preserves gridSize when resetting for new difficulty', () => {
    const before = { ...makeInitialState('easy', 'large'), score: 50 };
    const after = balloonReducer(before, { type: 'SET_DIFFICULTY', difficulty: 'medium' });

    expect(after.gridSize).toBe('large');
  });
});

// ── SET_GRID_SIZE ─────────────────────────────────────────────────────────────

describe('SET_GRID_SIZE action', () => {
  it('updates gridSize without touching other fields', () => {
    const before = { ...makeInitialState('easy'), score: 42 };
    const after = balloonReducer(before, { type: 'SET_GRID_SIZE', gridSize: 'large' });

    expect(after.gridSize).toBe('large');
    expect(after.score).toBe(42);
    expect(after.gameStatus).toBe('ready');
  });
});

// ── SPAWN_BALLOON ─────────────────────────────────────────────────────────────

describe('SPAWN_BALLOON action', () => {
  it('appends the balloon to the array', () => {
    const balloon = makeBalloon({ id: 'b-spawn' });
    const before = makeInitialState('easy');
    const after = balloonReducer(before, { type: 'SPAWN_BALLOON', balloon });

    expect(after.balloons).toHaveLength(1);
    expect(after.balloons[0].id).toBe('b-spawn');
  });

  it('does not mutate other state fields', () => {
    const before = { ...makeInitialState('easy'), score: 77 };
    const after = balloonReducer(before, { type: 'SPAWN_BALLOON', balloon: makeBalloon() });

    expect(after.score).toBe(77);
  });
});

// ── POP_BALLOON (normal) ──────────────────────────────────────────────────────

describe('POP_BALLOON — normal balloon', () => {
  it('removes the balloon, increments score and totalPopped, starts combo at 1', () => {
    const balloon = makeBalloon({ id: 'b1', type: 'normal' });
    const before = { ...makeInitialState('easy'), balloons: [balloon], lastPopTime: 0 };
    const now = COMBO_WINDOW + 1; // outside window → combo resets to 1

    const after = balloonReducer(before, { type: 'POP_BALLOON', balloonId: 'b1', now });

    expect(after.balloons).toHaveLength(0);
    expect(after.score).toBe(POINTS.normal);
    expect(after.combo).toBe(1);
    expect(after.totalPopped).toBe(1);
    expect(after.lastPopTime).toBe(now);
  });

  it('increments combo when popped within COMBO_WINDOW', () => {
    const balloon = makeBalloon({ id: 'b1', type: 'normal' });
    const lastPopTime = 5000;
    const now = lastPopTime + COMBO_WINDOW - 1; // within window
    const before = { ...makeInitialState('easy'), balloons: [balloon], combo: 2, lastPopTime };

    const after = balloonReducer(before, { type: 'POP_BALLOON', balloonId: 'b1', now });

    expect(after.combo).toBe(3);
    expect(after.maxCombo).toBe(3);
    // Score = POINTS.normal + (3-1) * POINTS.combo
    expect(after.score).toBe(POINTS.normal + 2 * POINTS.combo);
  });

  it('resets combo to 1 when outside COMBO_WINDOW', () => {
    const balloon = makeBalloon({ id: 'b1', type: 'normal' });
    const lastPopTime = 0;
    const now = COMBO_WINDOW + 100; // outside window
    const before = { ...makeInitialState('easy'), balloons: [balloon], combo: 5, lastPopTime };

    const after = balloonReducer(before, { type: 'POP_BALLOON', balloonId: 'b1', now });

    expect(after.combo).toBe(1);
    expect(after.score).toBe(POINTS.normal); // No combo bonus
  });

  it('returns same state when balloonId not found', () => {
    const before = makeInitialState('easy');
    const after = balloonReducer(before, { type: 'POP_BALLOON', balloonId: 'nonexistent', now: 1 });

    expect(after).toBe(before); // Reference equality — no change
  });
});

// ── POP_BALLOON (golden) ──────────────────────────────────────────────────────

describe('POP_BALLOON — golden balloon', () => {
  it('awards POINTS.golden as base score', () => {
    const balloon = makeBalloon({ id: 'b1', type: 'golden' });
    const before = { ...makeInitialState('easy'), balloons: [balloon], lastPopTime: 0 };
    const now = COMBO_WINDOW + 1; // outside window → combo = 1, no bonus

    const after = balloonReducer(before, { type: 'POP_BALLOON', balloonId: 'b1', now });

    expect(after.score).toBe(POINTS.golden);
  });
});

// ── POP_BALLOON (bomb) ────────────────────────────────────────────────────────

describe('POP_BALLOON — bomb balloon', () => {
  it('decrements lives and resets combo', () => {
    const bomb = makeBalloon({ id: 'bomb1', type: 'bomb' });
    const before = { ...makeInitialState('medium'), balloons: [bomb], lives: 3, combo: 4 };

    const after = balloonReducer(before, { type: 'POP_BALLOON', balloonId: 'bomb1', now: 1 });

    expect(after.lives).toBe(2);
    expect(after.combo).toBe(0);
    expect(after.score).toBe(0); // No points for bombs
    expect(after.totalPopped).toBe(0);
  });

  it('sets gameOver when last life lost on bomb pop', () => {
    const bomb = makeBalloon({ id: 'bomb1', type: 'bomb' });
    const before = { ...makeInitialState('medium'), balloons: [bomb], lives: 1, gameStatus: 'playing' as const };

    const after = balloonReducer(before, { type: 'POP_BALLOON', balloonId: 'bomb1', now: 1 });

    expect(after.lives).toBe(0);
    expect(after.gameStatus).toBe('gameOver');
  });
});

// ── EXPIRE_BALLOON ────────────────────────────────────────────────────────────

describe('EXPIRE_BALLOON action', () => {
  it('normal balloon expiry: decrements lives, increments totalMissed, resets combo', () => {
    const balloon = makeBalloon({ id: 'b1', type: 'normal' });
    const before = { ...makeInitialState('easy'), balloons: [balloon], lives: 4, combo: 3 };

    const after = balloonReducer(before, { type: 'EXPIRE_BALLOON', balloonId: 'b1' });

    expect(after.lives).toBe(3);
    expect(after.totalMissed).toBe(1);
    expect(after.combo).toBe(0);
    expect(after.balloons).toHaveLength(0);
  });

  it('normal balloon expiry causes gameOver when last life lost', () => {
    const balloon = makeBalloon({ id: 'b1', type: 'normal' });
    const before = {
      ...makeInitialState('easy'),
      balloons: [balloon],
      lives: 1,
      gameStatus: 'playing' as const,
    };

    const after = balloonReducer(before, { type: 'EXPIRE_BALLOON', balloonId: 'b1' });

    expect(after.gameStatus).toBe('gameOver');
  });

  it('bomb expiry: no life lost, combo resets, balloon removed', () => {
    const bomb = makeBalloon({ id: 'bomb1', type: 'bomb' });
    const before = { ...makeInitialState('medium'), balloons: [bomb], lives: 3, combo: 2 };

    const after = balloonReducer(before, { type: 'EXPIRE_BALLOON', balloonId: 'bomb1' });

    expect(after.lives).toBe(3); // No life lost
    expect(after.totalMissed).toBe(0); // Not counted as missed
    expect(after.combo).toBe(0); // Combo still resets
    expect(after.balloons).toHaveLength(0);
  });

  it('is a no-op when balloon already popped (not in array)', () => {
    const before = makeInitialState('easy');
    const after = balloonReducer(before, { type: 'EXPIRE_BALLOON', balloonId: 'already-gone' });

    expect(after).toBe(before); // Reference equality
  });
});

// ── TICK ──────────────────────────────────────────────────────────────────────

describe('TICK action', () => {
  it('decrements timeRemaining by 1', () => {
    const before = { ...makeInitialState('easy'), timeRemaining: 30, gameStatus: 'playing' as const };
    const after = balloonReducer(before, { type: 'TICK' });

    expect(after.timeRemaining).toBe(29);
    expect(after.gameStatus).toBe('playing');
  });

  it('sets timeRemaining=0 and gameStatus=gameOver when timeRemaining is 1', () => {
    const before = { ...makeInitialState('easy'), timeRemaining: 1, gameStatus: 'playing' as const };
    const after = balloonReducer(before, { type: 'TICK' });

    expect(after.timeRemaining).toBe(0);
    expect(after.gameStatus).toBe('gameOver');
  });
});

// ── LOAD_HIGH_SCORE ───────────────────────────────────────────────────────────

describe('LOAD_HIGH_SCORE action', () => {
  it('updates highScore without touching other fields', () => {
    const before = { ...makeInitialState('easy'), score: 55 };
    const after = balloonReducer(before, { type: 'LOAD_HIGH_SCORE', highScore: 100 });

    expect(after.highScore).toBe(100);
    expect(after.score).toBe(55);
    expect(after.gameStatus).toBe('ready');
  });
});
