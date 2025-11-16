/**
 * Memory Match Game Themes
 * Collections of emojis for different card themes
 */

import { Theme, Difficulty, DifficultySettings } from './types';

export const themes: Record<Theme, string[]> = {
  animals: [
    '🐶', '🐱', '🐭', '🐹', '🐰', '🦊',
    '🐻', '🐼', '🐨', '🐯', '🦁', '🐮'
  ],
  food: [
    '🍎', '🍌', '🍊', '🍇', '🍓', '🍉',
    '🍑', '🍒', '🥝', '🍕', '🍔', '🍟'
  ],
  space: [
    '🌟', '🌙', '🌍', '🪐', '🚀', '🛸',
    '👽', '☄️', '🌌', '🌠', '⭐', '✨'
  ],
  shapes: [
    '🔴', '🟠', '🟡', '🟢', '🔵', '🟣',
    '⚫', '⚪', '🟤', '❤️', '💛', '💚'
  ]
};

export const difficultySettings: Record<Difficulty, DifficultySettings> = {
  easy: {
    pairs: 6,
    gridCols: 4,
    name: '🐌 Easy (6 pairs)'
  },
  medium: {
    pairs: 8,
    gridCols: 4,
    name: '🏃 Medium (8 pairs)'
  },
  hard: {
    pairs: 12,
    gridCols: 4,
    name: '⚡ Hard (12 pairs)'
  }
};

export const themeNames: Record<Theme, string> = {
  animals: '🐾 Animals',
  food: '🍔 Food',
  space: '🚀 Space',
  shapes: '⭐ Shapes'
};

export const getCardsForTheme = (theme: Theme, count: number): string[] => {
  const available = themes[theme];
  return available.slice(0, count);
};
