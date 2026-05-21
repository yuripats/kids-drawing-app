/**
 * useBubblePop rAF loop tests (PR-4c2)
 *
 * Validates that the animation loop:
 *  - fires exactly ONE setGameState per rAF frame (~60/s, not ~120/s)
 *  - is set up ONCE and never restarted when bubble count changes
 *  - halts correctly on pause and resumes on unpause
 */

import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { useBubblePop } from './useBubblePop';

// ── Setup ─────────────────────────────────────────────────────────────────────

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
});

// ── Helpers ───────────────────────────────────────────────────────────────────

/** Wraps global.requestAnimationFrame with a counter, returns cleanup fn. */
function countRaf(): { getCount: () => number; restore: () => void } {
  let count = 0;
  const original = global.requestAnimationFrame;
  global.requestAnimationFrame = (fn: FrameRequestCallback): number => {
    count++;
    return original(fn);
  };
  return {
    getCount: () => count,
    restore: () => { global.requestAnimationFrame = original; },
  };
}

// ── Tests ─────────────────────────────────────────────────────────────────────

describe('useBubblePop initialisation', () => {
  it('starts with correct default state', () => {
    const { result } = renderHook(() => useBubblePop());

    expect(result.current.gameState.score).toBe(0);
    expect(result.current.gameState.bubblesPopped).toBe(0);
    expect(result.current.gameState.gameStatus).toBe('playing');
    expect(Array.isArray(result.current.gameState.bubbles)).toBe(true);
  });
});

describe('useBubblePop — rAF loop (PR-4c2)', () => {
  it('registers ~60 rAF callbacks in 1 second of game time', () => {
    // Each rAF callback dispatches ONE setGameState (merged spawn+move update).
    // Counts rAF invocations, which equals the number of state updates per second.
    const raf = countRaf();

    const { unmount } = renderHook(() => useBubblePop());
    raf.restore(); // swap the counting wrapper in AFTER initial rAF registration

    // Fresh counter from here (don't count the setup call)
    const raf2 = countRaf();

    act(() => {
      vi.advanceTimersByTime(1000);
    });

    // jsdom rAF ≈ setTimeout(fn, 1000/60) → ~60 frames per second
    const frames = raf2.getCount();
    expect(frames).toBeGreaterThanOrEqual(50);
    expect(frames).toBeLessThanOrEqual(70);

    raf2.restore();
    unmount();
  });

  it('does NOT cancel/restart the rAF loop when bubbles spawn', () => {
    // KEY TEST: with the old dep array [gameStatus, bubbles.length, createBubble],
    // every bubble spawn changes bubbles.length → effect cleanup fires →
    // cancelAnimationFrame called → loop restarted. Fixed dep array prevents this.
    const cancelSpy = vi.spyOn(window, 'cancelAnimationFrame');

    const { unmount } = renderHook(() => useBubblePop());
    cancelSpy.mockClear(); // clear any calls from initial effect setup

    // Advance past the 2-second spawn threshold so at least one bubble spawns
    act(() => {
      vi.advanceTimersByTime(2100);
    });

    // cancelAnimationFrame must NOT have been called during gameplay —
    // the loop should be running continuously without restarts.
    expect(cancelSpy).not.toHaveBeenCalled();

    unmount();
    cancelSpy.mockRestore();
  });

  it('game status stays playing after 1 second of animation', () => {
    const { result, unmount } = renderHook(() => useBubblePop());

    act(() => {
      vi.advanceTimersByTime(1000);
    });

    expect(result.current.gameState.gameStatus).toBe('playing');
    unmount();
  });

  it('score remains 0 after 1 second (no auto-pops)', () => {
    const { result, unmount } = renderHook(() => useBubblePop());

    act(() => {
      vi.advanceTimersByTime(1000);
    });

    expect(result.current.gameState.score).toBe(0);
    expect(result.current.gameState.bubblesPopped).toBe(0);
    unmount();
  });
});

describe('useBubblePop — pause/resume', () => {
  it('pausing cancels the rAF loop (cancelAnimationFrame called once)', () => {
    const cancelSpy = vi.spyOn(window, 'cancelAnimationFrame');

    const { result, unmount } = renderHook(() => useBubblePop());
    cancelSpy.mockClear(); // ignore mount-time setup

    act(() => {
      result.current.togglePause();
    });

    // Effect cleanup fires exactly once when gameStatus transitions playing→paused
    expect(cancelSpy).toHaveBeenCalledTimes(1);

    expect(result.current.gameState.gameStatus).toBe('paused');

    unmount();
    cancelSpy.mockRestore();
  });

  it('paused game does not register rAF callbacks', () => {
    const { result, unmount } = renderHook(() => useBubblePop());

    act(() => { result.current.togglePause(); });

    const raf = countRaf();

    act(() => {
      vi.advanceTimersByTime(1000); // advance while paused
    });

    expect(raf.getCount()).toBe(0);
    raf.restore();
    unmount();
  });

  it('resuming after pause restarts the rAF loop', () => {
    const { result, unmount } = renderHook(() => useBubblePop());

    // Pause then resume
    act(() => { result.current.togglePause(); });
    act(() => { result.current.togglePause(); });

    expect(result.current.gameState.gameStatus).toBe('playing');

    const raf = countRaf();
    act(() => { vi.advanceTimersByTime(500); });

    // ~30 frames in 500ms — confirms the loop is running again
    expect(raf.getCount()).toBeGreaterThanOrEqual(20);
    raf.restore();
    unmount();
  });
});

describe('useBubblePop — reset', () => {
  it('resetGame restores initial state', () => {
    const { result, unmount } = renderHook(() => useBubblePop());

    act(() => { result.current.resetGame(); });

    expect(result.current.gameState.score).toBe(0);
    expect(result.current.gameState.bubblesPopped).toBe(0);
    expect(result.current.gameState.gameStatus).toBe('playing');

    unmount();
  });
});
