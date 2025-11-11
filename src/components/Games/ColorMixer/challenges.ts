/**
 * Color Mixer Challenges
 */

import type { Challenge } from './types';

export const challenges: Challenge[] = [
  { name: 'Orange', target: { r: 255, g: 165, b: 0 }, hint: 'Mix red + yellow' },
  { name: 'Purple', target: { r: 128, g: 0, b: 128 }, hint: 'Mix red + blue' },
  { name: 'Green', target: { r: 0, g: 255, b: 0 }, hint: 'Mix blue + yellow' },
  { name: 'Pink', target: { r: 255, g: 192, b: 203 }, hint: 'Mix red + white' },
  { name: 'Brown', target: { r: 139, g: 69, b: 19 }, hint: 'Mix all colors' },
  { name: 'Turquoise', target: { r: 64, g: 224, b: 208 }, hint: 'Mix blue + green + white' }
];
