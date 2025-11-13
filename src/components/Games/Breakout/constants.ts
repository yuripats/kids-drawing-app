export const GAME_CONSTANTS = {
  // Canvas
  CANVAS_WIDTH: 600,
  CANVAS_HEIGHT: 700,

  // Paddle
  PADDLE_WIDTH: 100,
  PADDLE_HEIGHT: 15,
  PADDLE_Y: 650,
  PADDLE_SPEED: 12,
  PADDLE_COLOR: '#3498db',

  // Ball
  BALL_RADIUS: 8,
  BALL_SPEED: 5,
  BALL_COLOR: '#e74c3c',
  MAX_BALL_SPEED: 8,
  MIN_BALL_SPEED: 3,

  // Bricks
  BRICK_WIDTH: 60,
  BRICK_HEIGHT: 20,
  BRICK_PADDING: 5,
  BRICK_OFFSET_TOP: 80,
  BRICK_OFFSET_LEFT: 30,
  BRICK_ROWS: 6,
  BRICK_COLS: 9,

  // Game
  INITIAL_LIVES: 3,
  POWERUP_FALL_SPEED: 2,
  POWERUP_DURATION: 10000, // 10 seconds
  POWERUP_WIDTH: 40,
  POWERUP_HEIGHT: 20,

  // Power-up modifiers
  WIDER_PADDLE_MULTIPLIER: 1.5,
  SLOW_BALL_MULTIPLIER: 0.7,
};

export const BRICK_COLORS = {
  normal: '#e74c3c',      // Red
  strong: '#f39c12',      // Orange
  veryStrong: '#9b59b6',  // Purple
  unbreakable: '#95a5a6', // Gray
  powerup: '#3498db',     // Blue
};

export const POINTS = {
  normal: 10,
  strong: 20,
  veryStrong: 30,
  unbreakable: 0,
  powerup: 30,
  combo: 5,               // Bonus per combo hit
};

export const POWERUP_COLORS = {
  widerPaddle: '#2ecc71',   // Green
  multiball: '#e67e22',     // Orange
  slowBall: '#9b59b6',      // Purple
  extraLife: '#e74c3c',     // Red
};

export const POWERUP_ICONS = {
  widerPaddle: '⬌',
  multiball: '●●●',
  slowBall: '🐌',
  extraLife: '❤️',
};
