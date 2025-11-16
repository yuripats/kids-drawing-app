import { BubbleColor } from './types';

export const GAME_CONSTANTS = {
  // Canvas - Mobile-first
  CANVAS_WIDTH: 400,
  CANVAS_HEIGHT: 600,

  // Bubbles
  BUBBLE_RADIUS: 18,
  BUBBLE_SPACING: 2,
  INITIAL_ROWS: 5,
  MAX_ROWS: 12,
  COLS: 10,

  // Shooter
  SHOOTER_Y: 550,
  SHOOT_SPEED: 10,
  MIN_ANGLE: 15, // degrees
  MAX_ANGLE: 165, // degrees

  // Game mechanics
  BUBBLES_TO_POP: 3, // Minimum bubbles of same color to pop
  SHOTS_PER_LEVEL: 20,
  ROW_ADD_INTERVAL: 5, // Add row every N shots
  POINTS_PER_BUBBLE: 10,
  POINTS_PER_COMBO: 50,

  // Level progression
  COLORS_LEVEL_1: 3,
  COLORS_LEVEL_2: 4,
  COLORS_LEVEL_3: 5,
  COLORS_LEVEL_4: 6,
} as const;

export const BUBBLE_COLORS: Record<BubbleColor, string> = {
  red: '#FF6B6B',
  blue: '#4ECDC4',
  green: '#95E1D3',
  yellow: '#FFD93D',
  purple: '#B968C7',
  orange: '#FFA07A',
};

export const ALL_COLORS: BubbleColor[] = ['red', 'blue', 'green', 'yellow', 'purple', 'orange'];
