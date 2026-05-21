/**
 * Color Mixer Game Hook
 */

import { useState, useCallback } from 'react';
import type { ColorMixerState, ColorRGB } from '../components/Games/ColorMixer/types';
import { challenges } from '../components/Games/ColorMixer/challenges';
import { playSound } from '../utils/gameUtils';

/** Returns 0 (no match) → 1 (exact match). Max distance is black→white. */
export function computeProximity(mix: ColorRGB, target: ColorRGB): number {
  const dist = Math.sqrt(
    (mix.r - target.r) ** 2 +
    (mix.g - target.g) ** 2 +
    (mix.b - target.b) ** 2
  );
  return Math.max(0, 1 - dist / Math.sqrt(255 * 255 * 3));
}

export const useColorMixer = () => {
  const [gameState, setGameState] = useState<ColorMixerState>({
    currentMix: { r: 0, g: 0, b: 0 }, // Start from black so adding colors is visible
    challenge: challenges[0],
    score: 0,
    completedChallenges: 0
  });

  const addColor = useCallback((color: Partial<ColorRGB>) => {
    setGameState(prev => ({
      ...prev,
      currentMix: {
        r: Math.max(0, Math.min(255, prev.currentMix.r + (color.r || 0))),
        g: Math.max(0, Math.min(255, prev.currentMix.g + (color.g || 0))),
        b: Math.max(0, Math.min(255, prev.currentMix.b + (color.b || 0)))
      }
    }));
  }, []);

  const checkMatch = useCallback(() => {
    const { currentMix, challenge } = gameState;
    if (!challenge) return;

    const tolerance = 50;
    const matches =
      Math.abs(currentMix.r - challenge.target.r) < tolerance &&
      Math.abs(currentMix.g - challenge.target.g) < tolerance &&
      Math.abs(currentMix.b - challenge.target.b) < tolerance;

    if (matches) {
      playSound('match');
      const nextIndex = (gameState.completedChallenges + 1) % challenges.length;
      setGameState(prev => ({
        currentMix: { r: 0, g: 0, b: 0 }, // Reset to black
        challenge: challenges[nextIndex],
        score: prev.score + 100,
        completedChallenges: prev.completedChallenges + 1
      }));
    } else {
      playSound('mismatch');
    }
  }, [gameState]);

  const reset = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      currentMix: { r: 0, g: 0, b: 0 } // Reset to black
    }));
  }, []);

  const proximity = gameState.challenge
    ? computeProximity(gameState.currentMix, gameState.challenge.target)
    : 0;

  return {
    gameState,
    addColor,
    checkMatch,
    reset,
    proximity,
  };
};
