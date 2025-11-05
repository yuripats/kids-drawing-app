// Physics engine for Jelly Volleyball

import type { Vector2D, Player, Ball, Court, PhysicsConfig } from './types';

export const defaultPhysicsConfig: PhysicsConfig = {
  gravity: 0.06, // Even lower gravity - ball floats much longer
  playerJumpForce: 8, // Reduced jump height for better control
  playerMoveSpeed: 4, // Slower jelly movement for better control
  playerBounciness: 0.3,
  ballBounciness: 0.80, // Slightly reduced for more control
  springStiffness: 0.15,
  springDamping: 0.85,
  friction: 0.8,
};

// Vector math utilities
export function addVectors(a: Vector2D, b: Vector2D): Vector2D {
  return { x: a.x + b.x, y: a.y + b.y };
}

export function subtractVectors(a: Vector2D, b: Vector2D): Vector2D {
  return { x: a.x - b.x, y: a.y - b.y };
}

export function scaleVector(v: Vector2D, scale: number): Vector2D {
  return { x: v.x * scale, y: v.y * scale };
}

export function vectorLength(v: Vector2D): number {
  return Math.sqrt(v.x * v.x + v.y * v.y);
}

export function normalizeVector(v: Vector2D): Vector2D {
  const len = vectorLength(v);
  if (len === 0) return { x: 0, y: 0 };
  return { x: v.x / len, y: v.y / len };
}

// Collision detection
export function checkCircleCollision(
  pos1: Vector2D,
  radius1: number,
  pos2: Vector2D,
  radius2: number
): boolean {
  const dx = pos2.x - pos1.x;
  const dy = pos2.y - pos1.y;
  const distance = Math.sqrt(dx * dx + dy * dy);
  return distance < radius1 + radius2;
}

// Resolve collision between two circles (elastic collision)
export function resolveCircleCollision(
  obj1: { position: Vector2D; velocity: Vector2D; mass: number; radius: number },
  obj2: { position: Vector2D; velocity: Vector2D; mass: number; radius: number },
  restitution: number
): void {
  const dx = obj2.position.x - obj1.position.x;
  const dy = obj2.position.y - obj1.position.y;
  const distance = Math.sqrt(dx * dx + dy * dy);

  if (distance === 0) return; // Prevent division by zero

  // Normalize collision vector
  const nx = dx / distance;
  const ny = dy / distance;

  // Separate overlapping objects
  const overlap = obj1.radius + obj2.radius - distance;
  if (overlap > 0) {
    const separationX = (nx * overlap) / 2;
    const separationY = (ny * overlap) / 2;
    obj1.position.x -= separationX;
    obj1.position.y -= separationY;
    obj2.position.x += separationX;
    obj2.position.y += separationY;
  }

  // Relative velocity
  const dvx = obj2.velocity.x - obj1.velocity.x;
  const dvy = obj2.velocity.y - obj1.velocity.y;

  // Relative velocity in collision normal direction
  const dvn = dvx * nx + dvy * ny;

  // Do not resolve if velocities are separating
  if (dvn > 0) return;

  // Calculate impulse scalar
  const impulse = (-(1 + restitution) * dvn) / (1 / obj1.mass + 1 / obj2.mass);

  // Apply impulse
  obj1.velocity.x -= (impulse * nx) / obj1.mass;
  obj1.velocity.y -= (impulse * ny) / obj1.mass;
  obj2.velocity.x += (impulse * nx) / obj2.mass;
  obj2.velocity.y += (impulse * ny) / obj2.mass;
}

// Update player physics
export function updatePlayer(
  player: Player,
  court: Court,
  config: PhysicsConfig,
  controls: { left: boolean; right: boolean; jump: boolean },
  deltaTime: number = 1,
  playerSide: 'left' | 'right' = 'left'
): void {
  // Apply gravity
  player.velocity.y += config.gravity * deltaTime;

  // Apply horizontal movement
  if (controls.left) {
    player.velocity.x = -config.playerMoveSpeed;
  } else if (controls.right) {
    player.velocity.x = config.playerMoveSpeed;
  } else {
    // Apply friction when no input
    player.velocity.x *= config.friction;
  }

  // Check if on ground for jumping
  const onGround = player.position.y + player.radius >= court.height;

  if (controls.jump && onGround) {
    player.velocity.y = -config.playerJumpForce;
  }

  // Update position
  player.position.x += player.velocity.x * deltaTime;
  player.position.y += player.velocity.y * deltaTime;

  // Ground collision
  if (player.position.y + player.radius > court.height) {
    player.position.y = court.height - player.radius;
    player.velocity.y *= -config.playerBounciness;
    if (Math.abs(player.velocity.y) < 0.5) {
      player.velocity.y = 0;
    }
  }

  // Wall collision
  if (player.position.x - player.radius < 0) {
    player.position.x = player.radius;
    player.velocity.x = 0;
  }
  if (player.position.x + player.radius > court.width) {
    player.position.x = court.width - player.radius;
    player.velocity.x = 0;
  }

  // Net boundary (prevent crossing to opponent's side)
  const netX = court.width / 2;
  if (playerSide === 'left') {
    // Player 1 cannot go past the net to the right
    if (player.position.x + player.radius > netX) {
      player.position.x = netX - player.radius;
      player.velocity.x = 0;
    }
  } else {
    // Player 2 cannot go past the net to the left
    if (player.position.x - player.radius < netX) {
      player.position.x = netX + player.radius;
      player.velocity.x = 0;
    }
  }

  // Update jelly wobble effect (spring-mass damping)
  const wobbleForceX = -player.wobbleOffset.x * config.springStiffness;
  const wobbleForceY = -player.wobbleOffset.y * config.springStiffness;

  player.wobbleVelocity.x += wobbleForceX;
  player.wobbleVelocity.y += wobbleForceY;

  player.wobbleVelocity.x *= config.springDamping;
  player.wobbleVelocity.y *= config.springDamping;

  player.wobbleOffset.x += player.wobbleVelocity.x;
  player.wobbleOffset.y += player.wobbleVelocity.y;

  // Add velocity-based wobble
  const velocityMagnitude = Math.sqrt(
    player.velocity.x * player.velocity.x + player.velocity.y * player.velocity.y
  );
  if (velocityMagnitude > 2) {
    player.wobbleOffset.x += player.velocity.x * 0.1;
    player.wobbleOffset.y += player.velocity.y * 0.1;
  }
}

// Update ball physics
export function updateBall(
  ball: Ball,
  court: Court,
  config: PhysicsConfig,
  deltaTime: number = 1
): { scored: boolean; scoringSide: 'left' | 'right' | null } {
  // Apply gravity
  ball.velocity.y += config.gravity * deltaTime;

  // Update position
  ball.position.x += ball.velocity.x * deltaTime;
  ball.position.y += ball.velocity.y * deltaTime;

  let scored = false;
  let scoringSide: 'left' | 'right' | null = null;

  // Ground collision
  if (ball.position.y + ball.radius > court.height) {
    ball.position.y = court.height - ball.radius;
    ball.velocity.y *= -config.ballBounciness;

    // Check if ball hit the ground (scoring condition)
    if (Math.abs(ball.velocity.y) < 2) {
      scored = true;
      scoringSide = ball.position.x < court.width / 2 ? 'left' : 'right';
    }
  }

  // Wall collision
  if (ball.position.x - ball.radius < 0) {
    ball.position.x = ball.radius;
    ball.velocity.x *= -config.ballBounciness;
  }
  if (ball.position.x + ball.radius > court.width) {
    ball.position.x = court.width - ball.radius;
    ball.velocity.x *= -config.ballBounciness;
  }

  // Net collision (top of net)
  const netX = court.width / 2;
  const netWidth = court.netWidth || 5;
  const netTop = court.height - court.netHeight;

  if (
    ball.position.x > netX - netWidth / 2 - ball.radius &&
    ball.position.x < netX + netWidth / 2 + ball.radius &&
    ball.position.y + ball.radius > netTop &&
    ball.position.y - ball.radius < court.height
  ) {
    // Ball hit the net
    if (ball.position.y < netTop + ball.radius) {
      // Hit top of net
      ball.position.y = netTop - ball.radius;
      ball.velocity.y *= -config.ballBounciness;
      ball.velocity.x *= 0.8; // Reduce horizontal speed
    } else {
      // Hit side of net
      if (ball.position.x < netX) {
        ball.position.x = netX - netWidth / 2 - ball.radius;
      } else {
        ball.position.x = netX + netWidth / 2 + ball.radius;
      }
      ball.velocity.x *= -config.ballBounciness;
    }
  }

  return { scored, scoringSide };
}

// Handle ball-player collision
export function handleBallPlayerCollision(
  ball: Ball,
  player: Player,
  config: PhysicsConfig
): void {
  if (checkCircleCollision(ball.position, ball.radius, player.position, player.radius)) {
    resolveCircleCollision(player, ball, config.ballBounciness);

    // Add wobble to player on collision
    const dx = ball.position.x - player.position.x;
    const dy = ball.position.y - player.position.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist > 0) {
      player.wobbleOffset.x += (dx / dist) * 3;
      player.wobbleOffset.y += (dy / dist) * 3;
    }
  }
}
