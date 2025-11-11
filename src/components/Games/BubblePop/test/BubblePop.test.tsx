/**
 * Bubble Pop Game Tests
 */

import { describe, test, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useBubblePop } from '../../../../hooks/useBubblePop';

// Mock requestAnimationFrame
beforeEach(() => {
  vi.useFakeTimers();
});

describe('useBubblePop Hook', () => {
  test('initializes with correct default state', () => {
    const { result } = renderHook(() => useBubblePop());

    expect(result.current.gameState.score).toBe(0);
    expect(result.current.gameState.bubblesPopped).toBe(0);
    expect(result.current.gameState.gameStatus).toBe('playing');
    expect(result.current.gameState.bubbles.length).toBeGreaterThanOrEqual(0);
  });

  test('popBubble increases score and bubblesPopped', () => {
    const { result } = renderHook(() => useBubblePop());

    // Add a bubble to pop
    act(() => {
      const testBubble = {
        id: 'test-bubble-1',
        x: 50,
        y: 50,
        size: 40,
        color: '#FF6B9D',
        speed: 1
      };
      result.current.gameState.bubbles.push(testBubble);
    });

    const initialScore = result.current.gameState.score;
    const initialPopped = result.current.gameState.bubblesPopped;

    act(() => {
      const bubbleId = result.current.gameState.bubbles[0]?.id;
      if (bubbleId) {
        result.current.popBubble(bubbleId);
      }
    });

    expect(result.current.gameState.score).toBeGreaterThan(initialScore);
    expect(result.current.gameState.bubblesPopped).toBe(initialPopped + 1);
  });

  test('resetGame resets score and bubblesPopped to zero', () => {
    const { result } = renderHook(() => useBubblePop());

    act(() => {
      result.current.resetGame();
    });

    expect(result.current.gameState.score).toBe(0);
    expect(result.current.gameState.bubblesPopped).toBe(0);
    expect(result.current.gameState.gameStatus).toBe('playing');
  });

  test('bubble properties are within expected ranges', () => {
    const { result } = renderHook(() => useBubblePop());

    const bubble = result.current.gameState.bubbles[0];
    if (bubble) {
      expect(bubble.x).toBeGreaterThanOrEqual(0);
      expect(bubble.x).toBeLessThanOrEqual(100);
      expect(bubble.y).toBeGreaterThanOrEqual(-100);
      expect(bubble.size).toBeGreaterThan(0);
      expect(bubble.speed).toBeGreaterThan(0);
      expect(bubble.color).toBeTruthy();
      expect(bubble.id).toBeTruthy();
    }
  });
});
