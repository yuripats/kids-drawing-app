import { describe, test, expect } from 'vitest';
import { computeGameX } from './useJellyVolleyball';

/**
 * Unit tests for the touch coordinate scaling in JellyVolleyball.
 *
 * The canvas is rendered at its intrinsic size (e.g. 800×400) but CSS scales
 * it down to fit the device viewport (e.g. displayed as 360×180 on a phone).
 * Raw clientX/Y values must be multiplied by the scale factor to land at the
 * correct in-game position.
 */
describe('computeGameX — touch coordinate scaling', () => {
  test('touch at center of 360px display maps to game-center (400) on 800px court', () => {
    // Canvas intrinsic width: 800px
    // Displayed rect width:   360px  (CSS scales 800 → 360 on a phone)
    // Touch at clientX=180   (= center of the 360px display)
    // Expected gameX = 180 × (800 / 360) = 400 (= center of court)
    expect(computeGameX(180, 0, 360, 800)).toBe(400);
  });

  test('after resize to 720px wide, touch at 360 still maps to game-center (400)', () => {
    // Simulates a window.resize event that recomputes the cached rect:
    // New rect.width = 720px, touch at clientX=360 (center of the new size)
    // scaleX = 800 / 720  →  gameX = 360 × (800 / 720) = 400
    expect(computeGameX(360, 0, 720, 800)).toBe(400);
  });
});
