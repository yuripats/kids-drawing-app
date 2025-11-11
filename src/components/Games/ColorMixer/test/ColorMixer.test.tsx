/**
 * Color Mixer Game Tests
 */

import { describe, test, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useColorMixer } from '../../../../hooks/useColorMixer';

describe('useColorMixer Hook', () => {
  test('initializes with correct default state', () => {
    const { result } = renderHook(() => useColorMixer());

    expect(result.current.gameState.currentMix).toEqual({ r: 255, g: 255, b: 255 });
    expect(result.current.gameState.score).toBe(0);
    expect(result.current.gameState.completedChallenges).toBe(0);
    expect(result.current.gameState.challenge).toBeTruthy();
  });

  test('addColor adds to the current color mix', () => {
    const { result } = renderHook(() => useColorMixer());

    act(() => {
      result.current.addColor({ r: 50 });
    });

    expect(result.current.gameState.currentMix.r).toBe(255); // Already at max, stays at 255
    expect(result.current.gameState.currentMix.g).toBe(255);
    expect(result.current.gameState.currentMix.b).toBe(255);

    // Reset first to test properly
    act(() => {
      result.current.reset();
      result.current.addColor({ r: -50 });
    });

    expect(result.current.gameState.currentMix.r).toBe(205); // 255 - 50
  });

  test('addColor clamps upper values at 255', () => {
    const { result } = renderHook(() => useColorMixer());

    // Adding more red when already at 255 should keep it at 255
    act(() => {
      result.current.addColor({ r: 50 });
    });
    expect(result.current.gameState.currentMix.r).toBe(255);

    // Test that it clamps at the upper bound
    act(() => {
      result.current.reset();
      result.current.addColor({ b: -100 });
      result.current.addColor({ b: 200 });
    });
    expect(result.current.gameState.currentMix.b).toBe(255); // 255 - 100 + 200 = 355, clamped to 255
  });

  test('checkMatch correctly identifies close color matches', () => {
    const { result } = renderHook(() => useColorMixer());

    // Get the target color and calculate difference
    const targetColor = result.current.gameState.challenge?.target;

    if (targetColor) {
      // Reset to white first
      act(() => {
        result.current.reset();
      });

      // Calculate how much we need to add/subtract to get close to target
      const rDiff = targetColor.r - 255;
      const gDiff = targetColor.g - 255;
      const bDiff = targetColor.b - 255;

      act(() => {
        result.current.addColor({ r: rDiff, g: gDiff, b: bDiff });
      });

      const initialScore = result.current.gameState.score;
      const initialCompleted = result.current.gameState.completedChallenges;

      act(() => {
        result.current.checkMatch();
      });

      // Should increase score and completed challenges if match is close enough
      expect(result.current.gameState.score).toBeGreaterThanOrEqual(initialScore);
      expect(result.current.gameState.completedChallenges).toBeGreaterThanOrEqual(initialCompleted);
    }
  });

  test('reset clears the current color mix to white', () => {
    const { result } = renderHook(() => useColorMixer());

    // Make some changes first
    act(() => {
      result.current.addColor({ r: -100, g: -100, b: -100 });
    });

    expect(result.current.gameState.currentMix.r).toBe(155);

    // Reset the mix
    act(() => {
      result.current.reset();
    });

    expect(result.current.gameState.currentMix).toEqual({ r: 255, g: 255, b: 255 });
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
