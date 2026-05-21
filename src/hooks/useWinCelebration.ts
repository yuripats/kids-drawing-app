/**
 * useWinCelebration — fires confetti + win sound when a game ends with a new
 * high score. Cleans up the animation on unmount or when the game resets so no
 * rAF callbacks or canvas nodes are leaked.
 */

import { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { playSound } from '../utils/gameUtils';

/**
 * @param gameOver   True when the game-over modal is visible.
 * @param isHighScore True when the player just set a new personal best.
 */
export function useWinCelebration(gameOver: boolean, isHighScore: boolean): void {
  useEffect(() => {
    if (!gameOver || !isHighScore) return;

    playSound('win');
    confetti({
      particleCount: 150,
      spread: 80,
      origin: { y: 0.6 },
    });

    // Cancel any in-flight animation frames when this effect re-runs or the
    // component unmounts — prevents stale rAF callbacks after modal closes.
    return () => {
      confetti.reset();
    };
  }, [gameOver, isHighScore]);
}
