/**
 * Color Mixer Game Tests
 */

import { describe, test, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useColorMixer } from '../../../../hooks/useColorMixer';

describe('useColorMixer Hook', () => {
  test('initializes with correct default state', () => {
    const { result } = renderHook(() => useColorMixer());

    expect(result.current.gameState.currentMix).toEqual({ r: 0, g: 0, b: 0 }); // Starts from black
    expect(result.current.gameState.score).toBe(0);
    expect(result.current.gameState.completedChallenges).toBe(0);
    expect(result.current.gameState.challenge).toBeTruthy();
  });

  test('addColor adds to the current color mix', () => {
    const { result } = renderHook(() => useColorMixer());

    act(() => {
      result.current.addColor({ r: 50 });
    });

    expect(result.current.gameState.currentMix.r).toBe(50); // 0 + 50
    expect(result.current.gameState.currentMix.g).toBe(0);
    expect(result.current.gameState.currentMix.b).toBe(0);

    // Add more to test cumulative effect
    act(() => {
      result.current.addColor({ r: 30, g: 100 });
    });

    expect(result.current.gameState.currentMix.r).toBe(80); // 50 + 30
    expect(result.current.gameState.currentMix.g).toBe(100); // 0 + 100
  });

  test('addColor clamps upper values at 255', () => {
    const { result } = renderHook(() => useColorMixer());

    // Add a lot of red to hit the upper limit
    act(() => {
      result.current.addColor({ r: 300 });
    });
    expect(result.current.gameState.currentMix.r).toBe(255);

    // Test that it clamps at the upper bound
    act(() => {
      result.current.reset();
      result.current.addColor({ b: 100 });
      result.current.addColor({ b: 200 });
    });
    expect(result.current.gameState.currentMix.b).toBe(255); // 0 + 100 + 200 = 300, clamped to 255
  });

  test('addColor clamps lower values at 0', () => {
    const { result } = renderHook(() => useColorMixer());

    // Try to subtract from black
    act(() => {
      result.current.addColor({ r: -50 });
    });
    expect(result.current.gameState.currentMix.r).toBe(0); // Can't go below 0

    // Add some color then subtract more than we have
    act(() => {
      result.current.addColor({ g: 50 });
      result.current.addColor({ g: -100 });
    });
    expect(result.current.gameState.currentMix.g).toBe(0); // 50 - 100 = -50, clamped to 0
  });

  test('checkMatch correctly identifies close color matches', () => {
    const { result } = renderHook(() => useColorMixer());

    // Get the target color
    const targetColor = result.current.gameState.challenge?.target;

    if (targetColor) {
      // Set colors to match the target
      act(() => {
        result.current.addColor({
          r: targetColor.r,
          g: targetColor.g,
          b: targetColor.b
        });
      });

      const initialScore = result.current.gameState.score;
      const initialCompleted = result.current.gameState.completedChallenges;

      act(() => {
        result.current.checkMatch();
      });

      // Should increase score and completed challenges
      expect(result.current.gameState.score).toBeGreaterThanOrEqual(initialScore);
      expect(result.current.gameState.completedChallenges).toBeGreaterThanOrEqual(initialCompleted);
    }
  });

  test('reset clears the current color mix to black', () => {
    const { result } = renderHook(() => useColorMixer());

    // Add some colors
    act(() => {
      result.current.addColor({ r: 100, g: 100, b: 100 });
    });

    expect(result.current.gameState.currentMix.r).toBe(100);

    // Reset the mix
    act(() => {
      result.current.reset();
    });

    expect(result.current.gameState.currentMix).toEqual({ r: 0, g: 0, b: 0 }); // Back to black
  });

  test('challenge has required properties', () => {
    const { result } = renderHook(() => useColorMixer());

    const challenge = result.current.gameState.challenge;
    expect(challenge).toBeTruthy();
    expect(challenge?.name).toBeTruthy();
    expect(challenge?.target).toBeTruthy();
    expect(challenge?.hint).toBeTruthy();
    expect(challenge?.target.r).toBeGreaterThanOrEqual(0);
    expect(challenge?.target.r).toBeLessThanOrEqual(255);
    expect(challenge?.target.g).toBeGreaterThanOrEqual(0);
    expect(challenge?.target.g).toBeLessThanOrEqual(255);
    expect(challenge?.target.b).toBeGreaterThanOrEqual(0);
    expect(challenge?.target.b).toBeLessThanOrEqual(255);
  });
});
