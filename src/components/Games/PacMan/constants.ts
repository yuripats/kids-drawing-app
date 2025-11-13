export const GAME_CONSTANTS = {
  // Canvas (mobile-friendly smaller size)
  CANVAS_WIDTH: 400,
  CANVAS_HEIGHT: 500,

  // Maze
  CELL_SIZE: 20,
  MAZE_ROWS: 21,
  MAZE_COLS: 19,

  // Game speeds
  PACMAN_SPEED: 150,        // ms per move
  GHOST_SPEED: 170,         // ms per move (slightly slower)
  FRIGHTENED_SPEED: 250,    // Ghosts move slower when frightened

  // Power-up
  POWER_UP_DURATION: 8000,  // 8 seconds
  FRIGHTENED_FLASH_TIME: 2000, // Start flashing 2s before end

  // Scoring
  DOT_POINTS: 10,
  POWER_PELLET_POINTS: 50,
  GHOST_BASE_POINTS: 200,   // 200, 400, 800, 1600 for consecutive ghosts
  FRUIT_POINTS: 100,

  // Lives
  INITIAL_LIVES: 3,

  // Ghost spawn position
  GHOST_SPAWN_ROW: 9,
  GHOST_SPAWN_COL: 9,

  // Pacman spawn position
  PACMAN_SPAWN_ROW: 15,
  PACMAN_SPAWN_COL: 9,
};

export const GHOST_COLORS = {
  blinky: '#FF0000',  // Red - Aggressive chaser
  pinky: '#FFB8FF',   // Pink - Ambusher
  inky: '#00FFFF',    // Cyan - Flanker
  clyde: '#FFB852',   // Orange - Random
};

export const DIRECTION_VECTORS: Record<string, { dr: number; dc: number }> = {
  up: { dr: -1, dc: 0 },
  down: { dr: 1, dc: 0 },
  left: { dr: 0, dc: -1 },
  right: { dr: 0, dc: 1 },
  none: { dr: 0, dc: 0 },
};

export const OPPOSITE_DIRECTION: Record<string, string> = {
  up: 'down',
  down: 'up',
  left: 'right',
  right: 'left',
  none: 'none',
};
