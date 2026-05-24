/**
 * useSudokuGame – hint feature tests
 */

import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useSudokuGame } from './useSudokuGame';

vi.mock('../utils/storage', () => ({
  get: vi.fn().mockReturnValue(null),
  set: vi.fn(),
}));

describe('useSudokuGame hints', () => {
  beforeEach(() => {
    vi.useFakeTimers(); // prevent setInterval timer from firing
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  test('hint returns valid coordinate', () => {
    const { result } = renderHook(() => useSudokuGame({ difficulty: 'easy' }));

    let coord: { row: number; col: number } | null = null;
    act(() => {
      coord = result.current.getHint();
    });

    expect(coord).not.toBeNull();
     
    const { row, col } = coord!;
    expect(row).toBeGreaterThanOrEqual(0);
    expect(row).toBeLessThanOrEqual(8);
    expect(col).toBeGreaterThanOrEqual(0);
    expect(col).toBeLessThanOrEqual(8);
  });

  test('counter caps at 3', () => {
    const { result } = renderHook(() => useSudokuGame({ difficulty: 'easy' }));

    act(() => { result.current.getHint(); });
    act(() => { result.current.getHint(); });
    act(() => { result.current.getHint(); });
    expect(result.current.hintsUsed).toBe(3);

    // 4th attempt: hook must reject and return null
    let fourth: { row: number; col: number } | null = { row: -1, col: -1 };
    act(() => { fourth = result.current.getHint(); });
    expect(fourth).toBeNull();
    expect(result.current.hintsUsed).toBe(3);
  });
});
