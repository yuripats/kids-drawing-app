export const GAME_CONSTANTS = {
  // Canvas - Mobile-first
  CANVAS_WIDTH: 400,
  CANVAS_HEIGHT: 600,

  // Player
  PLAYER_WIDTH: 40,
  PLAYER_HEIGHT: 30,
  PLAYER_SPEED: 5,
  PLAYER_Y_OFFSET: 80, // Distance from bottom
  PLAYER_COLOR: '#4CAF50',

  // Aliens
  ALIEN_WIDTH: 30,
  ALIEN_HEIGHT: 25,
  ALIEN_ROWS: 5,
  ALIEN_COLS: 8,
  ALIEN_SPACING_X: 10,
  ALIEN_SPACING_Y: 10,
  ALIEN_START_Y: 60,
  ALIEN_MOVE_SPEED: 20, // Pixels per move
  ALIEN_MOVE_DOWN: 20, // Pixels to move down
  ALIEN_MOVE_INTERVAL: 1000, // ms between moves (gets faster)
  ALIEN_MIN_MOVE_INTERVAL: 200, // Fastest speed

  // Bullets
  BULLET_WIDTH: 4,
  BULLET_HEIGHT: 15,
  PLAYER_BULLET_SPEED: 8,
  ALIEN_BULLET_SPEED: 5,
  PLAYER_BULLET_COLOR: '#FFD700',
  ALIEN_BULLET_COLOR: '#FF4444',
  ALIEN_SHOOT_CHANCE: 0.001, // Per frame per alien

  // Barriers
  BARRIER_COUNT: 4,
  BARRIER_WIDTH: 60,
  BARRIER_HEIGHT: 40,
  BARRIER_Y: 450,
  BARRIER_BLOCK_SIZE: 5,
  BARRIER_COLOR: '#00FF00',

  // Game settings
  INITIAL_LIVES: 3,
  POINTS_BASIC: 10,
  POINTS_MEDIUM: 20,
  POINTS_ADVANCED: 30,
  LEVEL_SPEED_MULTIPLIER: 0.85, // Each level is 15% faster
} as const;

export const ALIEN_COLORS = {
  basic: '#FF6B6B',
  medium: '#4ECDC4',
  advanced: '#FFD93D',
} as const;
