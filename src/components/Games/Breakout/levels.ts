import { BrickType, BrickPattern } from './types';

const N: BrickType = 'normal';
const S: BrickType = 'strong';
const V: BrickType = 'veryStrong';
const U: BrickType = 'unbreakable';
const P: BrickType = 'powerup';

export const LEVELS: BrickPattern[] = [
  // Level 1: Simple rows
  {
    rows: 4,
    cols: 9,
    pattern: [
      [N, N, N, N, N, N, N, N, N],
      [N, N, N, N, P, N, N, N, N],
      [N, N, N, N, N, N, N, N, N],
      [N, N, N, N, N, N, N, N, N],
    ],
  },

  // Level 2: Alternating strong bricks
  {
    rows: 5,
    cols: 9,
    pattern: [
      [S, N, S, N, S, N, S, N, S],
      [N, S, N, S, P, S, N, S, N],
      [S, N, S, N, S, N, S, N, S],
      [N, N, N, N, N, N, N, N, N],
      [N, N, N, N, P, N, N, N, N],
    ],
  },

  // Level 3: Pyramid with unbreakable base
  {
    rows: 6,
    cols: 9,
    pattern: [
      [null, null, null, null, N, null, null, null, null],
      [null, null, null, N, P, N, null, null, null],
      [null, null, S, S, S, S, S, null, null],
      [null, N, N, N, N, N, N, N, null],
      [S, S, S, S, P, S, S, S, S],
      [U, U, U, U, U, U, U, U, U],
    ],
  },

  // Level 4: Checkerboard pattern
  {
    rows: 6,
    cols: 9,
    pattern: [
      [N, S, N, S, N, S, N, S, N],
      [S, N, S, N, P, N, S, N, S],
      [N, S, N, S, N, S, N, S, N],
      [S, N, S, N, S, N, S, N, S],
      [N, S, N, P, N, P, N, S, N],
      [S, N, S, N, S, N, S, N, S],
    ],
  },

  // Level 5: Fortress
  {
    rows: 7,
    cols: 9,
    pattern: [
      [U, S, S, S, P, S, S, S, U],
      [S, V, V, V, V, V, V, V, S],
      [S, V, U, U, U, U, U, V, S],
      [S, V, U, null, null, null, U, V, S],
      [S, V, U, U, P, U, U, V, S],
      [S, V, V, V, V, V, V, V, S],
      [U, S, S, S, S, S, S, S, U],
    ],
  },

  // Level 6: Smiley face
  {
    rows: 7,
    cols: 9,
    pattern: [
      [null, S, S, S, S, S, S, S, null],
      [S, N, N, N, N, N, N, N, S],
      [S, N, V, V, null, V, V, N, S],
      [S, N, V, V, null, V, V, N, S],
      [S, N, null, null, P, null, null, N, S],
      [S, N, V, null, null, null, V, N, S],
      [null, S, S, V, V, V, S, S, null],
    ],
  },

  // Level 7: Stripes with very strong
  {
    rows: 6,
    cols: 9,
    pattern: [
      [V, V, V, V, V, V, V, V, V],
      [N, N, N, N, P, N, N, N, N],
      [V, V, V, V, V, V, V, V, V],
      [S, S, S, S, P, S, S, S, S],
      [V, V, V, V, V, V, V, V, V],
      [U, U, U, U, U, U, U, U, U],
    ],
  },

  // Level 8: Diamond pattern
  {
    rows: 7,
    cols: 9,
    pattern: [
      [null, null, null, null, V, null, null, null, null],
      [null, null, null, V, P, V, null, null, null],
      [null, null, V, S, S, S, V, null, null],
      [null, V, S, N, N, N, S, V, null],
      [null, null, V, S, P, S, V, null, null],
      [null, null, null, V, S, V, null, null, null],
      [null, null, null, null, V, null, null, null, null],
    ],
  },

  // Level 9: Wall pattern
  {
    rows: 7,
    cols: 9,
    pattern: [
      [V, null, V, null, V, null, V, null, V],
      [V, null, V, null, P, null, V, null, V],
      [V, null, V, null, V, null, V, null, V],
      [S, S, S, S, S, S, S, S, S],
      [N, null, N, null, P, null, N, null, N],
      [N, null, N, null, N, null, N, null, N],
      [U, U, U, U, U, U, U, U, U],
    ],
  },

  // Level 10: Ultimate challenge
  {
    rows: 8,
    cols: 9,
    pattern: [
      [U, V, V, V, P, V, V, V, U],
      [V, S, S, S, S, S, S, S, V],
      [V, S, U, U, U, U, U, S, V],
      [V, S, U, V, V, V, U, S, V],
      [V, S, U, V, P, V, U, S, V],
      [V, S, U, U, U, U, U, S, V],
      [V, S, S, S, S, S, S, S, V],
      [U, V, V, V, V, V, V, V, U],
    ],
  },
];
