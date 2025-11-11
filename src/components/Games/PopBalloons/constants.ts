/**
 * Pop the Balloons Game Constants
 */

import type { Difficulty, DifficultySettings } from './types';

export const GRID_SIZE = 3; // 3x3 grid
export const GAME_DURATION = 60; // 60 seconds

export const POINTS = {
  normal: 10,
  golden: 30,
  combo: 5 // Bonus per combo level
};

export const difficultySettings: Record<Difficulty, DifficultySettings> = {
  easy: {
    spawnRate: 1500,         // 1.5 seconds between spawns
    balloonLifetime: 2000,   // 2 seconds visible
    bombChance: 0,           // No bombs
    startingLives: 5,
    gameDuration: 60,
    goldenChance: 0.1,       // 10% golden balloons
    name: '🐌 Easy'
  },
  medium: {
    spawnRate: 1000,         // 1 second between spawns
    balloonLifetime: 1500,   // 1.5 seconds visible
    bombChance: 0.1,         // 10% bombs
    startingLives: 3,
    gameDuration: 60,
    goldenChance: 0.1,
    name: '🏃 Medium'
  },
  hard: {
    spawnRate: 700,          // 0.7 seconds between spawns
    balloonLifetime: 1200,   // 1.2 seconds visible
    bombChance: 0.2,         // 20% bombs
    startingLives: 3,
    gameDuration: 60,
    goldenChance: 0.15,      // 15% golden balloons
    name: '⚡ Hard'
  }
};

// Balloon colors (HSL format for easy random generation)
export const balloonColors = [
  'hsl(0, 70%, 60%)',    // Red
  'hsl(30, 70%, 60%)',   // Orange
  'hsl(60, 70%, 60%)',   // Yellow
  'hsl(120, 70%, 60%)',  // Green
  'hsl(180, 70%, 60%)',  // Cyan
  'hsl(240, 70%, 60%)',  // Blue
  'hsl(270, 70%, 60%)',  // Purple
  'hsl(300, 70%, 60%)',  // Pink
];

export const COMBO_WINDOW = 1000; // ms between pops to maintain combo
