/**
 * useWinCelebration tests (PR-5a2)
 *
 * Validates that:
 *  - confetti + win sound fire exactly once on high-score game-over
 *  - neither fires for a normal (non-high-score) game-over
 *  - confetti.reset() is called on unmount — no leaked animation frames
 */

import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';

// ── Mocks (must be hoisted above the SUT import) ─────────────────────────────
// vi.hoisted() ensures the variable is initialized before vi.mock factories run

const { mockConfetti, mockReset } = vi.hoisted(() => {
  const mockReset = vi.fn();
  const mockConfetti = Object.assign(vi.fn(), { reset: mockReset });
  return { mockConfetti, mockReset };
});

vi.mock('canvas-confetti', () => ({ default: mockConfetti }));

vi.mock('../utils/gameUtils', () => ({
  playSound: vi.fn(),
  getSoundEnabled: vi.fn(() => true),
  getHighScore: vi.fn(() => 0),
  saveHighScore: vi.fn(),
  celebrateWin: vi.fn(),
  formatTime: vi.fn(() => '0:00'),
  getStatusColor: vi.fn(() => ''),
}));

// ── SUT import (after mocks) ──────────────────────────────────────────────────

import { useWinCelebration } from './useWinCelebration';
import { playSound } from '../utils/gameUtils';

// ── Tests ─────────────────────────────────────────────────────────────────────

beforeEach(() => {
  vi.clearAllMocks();
});

describe('useWinCelebration — high-score path', () => {
  it('fires confetti when gameOver=true and isHighScore=true', () => {
    const { rerender } = renderHook(
      ({ gameOver, isHighScore }: { gameOver: boolean; isHighScore: boolean }) =>
        useWinCelebration(gameOver, isHighScore),
      { initialProps: { gameOver: false, isHighScore: false } },
    );

    act(() => {
      rerender({ gameOver: true, isHighScore: true });
    });

    expect(mockConfetti).toHaveBeenCalledTimes(1);
    expect(mockConfetti).toHaveBeenCalledWith(
      expect.objectContaining({ particleCount: expect.any(Number), spread: expect.any(Number) }),
    );
  });

  it('plays win sound on high-score game-over', () => {
    const { rerender } = renderHook(
      ({ gameOver, isHighScore }: { gameOver: boolean; isHighScore: boolean }) =>
        useWinCelebration(gameOver, isHighScore),
      { initialProps: { gameOver: false, isHighScore: false } },
    );

    act(() => {
      rerender({ gameOver: true, isHighScore: true });
    });

    expect(playSound).toHaveBeenCalledWith('win');
  });
});

describe('useWinCelebration — non-high-score path', () => {
  it('does NOT fire confetti for a normal game-over', () => {
    const { rerender } = renderHook(
      ({ gameOver, isHighScore }: { gameOver: boolean; isHighScore: boolean }) =>
        useWinCelebration(gameOver, isHighScore),
      { initialProps: { gameOver: false, isHighScore: false } },
    );

    act(() => {
      rerender({ gameOver: true, isHighScore: false });
    });

    expect(mockConfetti).not.toHaveBeenCalled();
    expect(playSound).not.toHaveBeenCalled();
  });
});

describe('useWinCelebration — cleanup (PR-5a2)', () => {
  it('calls confetti.reset() on unmount — no leaked animation frames', () => {
    const { rerender, unmount } = renderHook(
      ({ gameOver, isHighScore }: { gameOver: boolean; isHighScore: boolean }) =>
        useWinCelebration(gameOver, isHighScore),
      { initialProps: { gameOver: false, isHighScore: false } },
    );

    act(() => {
      rerender({ gameOver: true, isHighScore: true });
    });

    expect(mockConfetti).toHaveBeenCalledTimes(1);

    unmount();

    // reset() must be called so the confetti canvas + rAF are torn down
    expect(mockReset).toHaveBeenCalled();
  });

  it('does not fire confetti again on re-render with identical deps', () => {
    const { rerender } = renderHook(
      ({ gameOver, isHighScore }: { gameOver: boolean; isHighScore: boolean }) =>
        useWinCelebration(gameOver, isHighScore),
      { initialProps: { gameOver: true, isHighScore: true } },
    );

    // Re-render with exactly the same props — deps unchanged, effect must not re-fire
    act(() => {
      rerender({ gameOver: true, isHighScore: true });
    });

    expect(mockConfetti).toHaveBeenCalledTimes(1);
  });
});
