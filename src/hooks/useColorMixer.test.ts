/**
 * useColorMixer – proximity computation tests
 */

import { describe, test, expect } from 'vitest';
import { computeProximity } from './useColorMixer';

describe('computeProximity', () => {
  test('proximity is 1.0 at exact match', () => {
    const color = { r: 128, g: 64, b: 200 };
    expect(computeProximity(color, color)).toBe(1);
  });

  test('proximity is 0 at max distance', () => {
    expect(computeProximity({ r: 0, g: 0, b: 0 }, { r: 255, g: 255, b: 255 })).toBe(0);
  });
});
