export const GAME_CONSTANTS = {
  // Canvas dimensions
  CANVAS_WIDTH: 400,
  CANVAS_HEIGHT: 600,

  // Physics
  GRAVITY: 0.5,              // Acceleration downward
  FLAP_STRENGTH: -9,         // Upward velocity on flap
  MAX_VELOCITY: 10,          // Terminal velocity

  // Bird
  BIRD_RADIUS: 15,
  BIRD_START_X: 100,
  BIRD_START_Y: 300,

  // Pipes
  PIPE_WIDTH: 60,
  PIPE_GAP: 150,             // Vertical gap size
  PIPE_SPACING: 250,         // Horizontal spacing between pipes
  PIPE_SPEED: 3,             // Horizontal scroll speed

  // Game
  SPAWN_DISTANCE: 400,       // Start spawning pipes at this x
  MIN_GAP_Y: 150,            // Minimum gap center Y
  MAX_GAP_Y: 450,            // Maximum gap center Y
};

export const COLORS = {
  background: '#87CEEB',     // Sky blue
  bird: '#FFD700',           // Gold
  pipe: '#2ecc71',           // Green
  ground: '#8B4513',         // Brown
  text: '#2c3e50',           // Dark gray
};
