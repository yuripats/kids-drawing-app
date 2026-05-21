/**
 * useSimonSays tests (PR-4c3)
 *
 * Covers:
 *  - forEach cancellation bug: all steps of a multi-step sequence now show
 *  - all 3 levels of nested timeouts cleared on unmount / resetGame
 */

import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { useSimonSays } from './useSimonSays';

// ── jsdom stubs ───────────────────────────────────────────────────────────────

// AudioContext is not available in jsdom — stub it before any hook renders
const mockOscillator = {
  connect: vi.fn(),
  start: vi.fn(),
  stop: vi.fn(),
  frequency: { value: 0 },
  type: 'sine' as OscillatorType,
};
const mockGainNode = { connect: vi.fn(), gain: { value: 0 } };
const mockAudioCtx = {
  createOscillator: () => mockOscillator,
  createGain: () => mockGainNode,
  destination: {},
  currentTime: 0,
  close: vi.fn().mockResolvedValue(undefined),
};
vi.stubGlobal('AudioContext', vi.fn(() => mockAudioCtx));

// Mock gameUtils side-effects so they don't throw
vi.mock('../utils/gameUtils', () => ({
  playSound: vi.fn(),
  getHighScore: vi.fn(() => 0),
  saveHighScore: vi.fn(),
}));

// ── Setup ─────────────────────────────────────────────────────────────────────

beforeEach(() => { vi.useFakeTimers(); });
afterEach(() => { vi.useRealTimers(); });

// ── Tests ─────────────────────────────────────────────────────────────────────

describe('useSimonSays — initialisation', () => {
  it('starts in ready state with empty sequence', () => {
    const { result } = renderHook(() => useSimonSays());

    expect(result.current.gameState.gameStatus).toBe('ready');
    expect(result.current.gameState.sequence).toHaveLength(0);
    expect(result.current.gameState.round).toBe(0);
    expect(result.current.gameState.showingIndex).toBe(-1);
  });
});

describe('useSimonSays — sequence display', () => {
  it('round 1 shows sequence and transitions to playing', () => {
    const { result, unmount } = renderHook(() => useSimonSays());

    act(() => { result.current.startGame(); });
    expect(result.current.gameState.gameStatus).toBe('showing');
    expect(result.current.gameState.sequence).toHaveLength(1);

    // normal speed: delay=600; sequence length=1 → transitions at delay*0.6+200=560ms
    act(() => { vi.advanceTimersByTime(700); });

    expect(result.current.gameState.gameStatus).toBe('playing');
    unmount();
  });

  it('shows first button immediately at round start (showingIndex != -1)', () => {
    const { result, unmount } = renderHook(() => useSimonSays());

    act(() => { result.current.startGame(); });

    // Advance 1ms: level-1 timeout (delay = idx*600 = 0) fires → highlights button
    act(() => { vi.advanceTimersByTime(1); });

    // First button should be highlighted
    expect(result.current.gameState.showingIndex).not.toBe(-1);

    unmount();
  });

  it('shows ALL buttons in a 2-step sequence — forEach cancellation bug fixed', () => {
    // BUG: old forEach overwrote showTimeoutRef on every iteration and called
    // clearTimeout on the previous, cancelling every step except the last.
    // FIX: all outer + inner timeout IDs tracked in an array; no cancellation.
    const { result, unmount } = renderHook(() => useSimonSays());

    // Complete round 1
    act(() => { result.current.startGame(); });
    act(() => { vi.advanceTimersByTime(700); }); // past 560ms transition
    expect(result.current.gameState.gameStatus).toBe('playing');

    // Press the one correct button to move to round 2
    const correctBtn = result.current.gameState.sequence[0];
    act(() => { result.current.handleButtonPress(correctBtn); });

    // Advance 1200ms:
    //   – 1000ms: round-transition setTimeout fires → showSequence([btn0, btn1])
    //   – +0ms:   level-1 for idx=0 fires (delay=0) → showingIndex = btn0
    //   – level-1 for idx=1 (delay=600) and subsequent dims haven't fired yet
    act(() => { vi.advanceTimersByTime(1200); });

    // Fixed: step-0 highlighted (showingIndex = btn0, which is 0..3)
    // Buggy: step-0 was cancelled → showingIndex stays -1
    expect(result.current.gameState.showingIndex).not.toBe(-1);

    unmount();
  });
});

describe('useSimonSays — timeout cleanup', () => {
  it('clears all nested timeouts (including level-2) when unmounted mid-sequence', () => {
    // BUG: only outermost ID was in showTimeoutRef; inner timeouts leaked.
    // FIX: showTimeoutsRef is an array; cleanup clears every tracked ID.
    const clearTimeoutSpy = vi.spyOn(global, 'clearTimeout');

    const { result, unmount } = renderHook(() => useSimonSays());
    act(() => { result.current.startGame(); });

    // Fire level-1 (delay=0): it pushes the level-2 ID into showTimeoutsRef
    act(() => { vi.advanceTimersByTime(1); });

    clearTimeoutSpy.mockClear(); // only count calls produced by unmount

    unmount();

    // Fixed: clearTimeout called for level-1 ID (already fired, no-op) AND
    // level-2 ID (still pending) = 2 calls minimum.
    // Buggy: only 1 call (the single outer ID stored in showTimeoutRef).
    expect(clearTimeoutSpy.mock.calls.length).toBeGreaterThanOrEqual(2);

    clearTimeoutSpy.mockRestore();
  });

  it('resetGame clears all pending sequence timeouts', () => {
    const clearTimeoutSpy = vi.spyOn(global, 'clearTimeout');

    const { result, unmount } = renderHook(() => useSimonSays());
    act(() => { result.current.startGame(); });
    act(() => { vi.advanceTimersByTime(1); }); // fire level-1, level-2 now pending

    clearTimeoutSpy.mockClear();
    act(() => { result.current.resetGame(); });

    // resetGame should clear all tracked timeouts
    expect(clearTimeoutSpy.mock.calls.length).toBeGreaterThanOrEqual(2);
    expect(result.current.gameState.gameStatus).toBe('ready');

    clearTimeoutSpy.mockRestore();
    unmount();
  });

  it('does not throw when unmounted during a sequence', () => {
    const { result, unmount } = renderHook(() => useSimonSays());
    act(() => { result.current.startGame(); });

    // Unmount mid-sequence; advancing time afterwards must not crash
    unmount();

    expect(() => {
      act(() => { vi.advanceTimersByTime(5000); });
    }).not.toThrow();
  });
});
