// AI opponent logic for Jelly Volleyball

import type { Player, Ball, Court, Controls } from './types';

export interface AIConfig {
  reactionTime: number; // How quickly AI responds (0-1, higher = faster)
  accuracy: number; // How accurate AI positioning is (0-1)
  aggressiveness: number; // How much AI tries to attack (0-1)
}

export const defaultAIConfig: AIConfig = {
  reactionTime: 0.7,
  accuracy: 0.8,
  aggressiveness: 0.6,
};

// Simple AI that tries to position itself under the ball
export function calculateAIControls(
  player: Player,
  ball: Ball,
  court: Court,
  config: AIConfig = defaultAIConfig
): Controls {
  const controls: Controls = {
    left: false,
    right: false,
    jump: false,
  };

  // Only react if ball is on AI's side or coming towards it
  const isOnAISide = ball.position.x > court.width / 2;
  const isBallComingToAI = ball.velocity.x > 0;

  if (!isOnAISide && !isBallComingToAI) {
    // Ball is on player's side and moving away, return to center
    const centerX = (court.width * 3) / 4;
    if (Math.abs(player.position.x - centerX) > 10) {
      if (player.position.x < centerX) {
        controls.right = true;
      } else {
        controls.left = true;
      }
    }
    return controls;
  }

  // Predict where the ball will be
  const predictedBallX = predictBallPosition(ball, court, 30);

  // Add some inaccuracy based on AI skill
  const inaccuracy = (1 - config.accuracy) * 40;
  const targetX = predictedBallX + (Math.random() - 0.5) * inaccuracy;

  // Move towards predicted position
  const distanceToTarget = targetX - player.position.x;
  const reactionThreshold = 10 + (1 - config.reactionTime) * 30;

  if (Math.abs(distanceToTarget) > reactionThreshold) {
    if (distanceToTarget < 0) {
      controls.left = true;
    } else {
      controls.right = true;
    }
  }

  // Decide when to jump
  const ballHeight = ball.position.y;
  const ballDistance = Math.abs(ball.position.x - player.position.x);
  const isOnGround = player.position.y + player.radius >= court.height - 1;

  // Jump conditions:
  // 1. Ball is close horizontally
  // 2. Ball is at a hittable height
  // 3. AI is on the ground
  // 4. Add some randomness based on aggressiveness

  const shouldJump =
    isOnGround &&
    ballDistance < 100 &&
    ballHeight < court.height - 50 &&
    Math.random() < config.aggressiveness;

  if (shouldJump) {
    controls.jump = true;
  }

  return controls;
}

// Predict where the ball will land (simple linear prediction)
function predictBallPosition(ball: Ball, court: Court, steps: number): number {
  let predictedX = ball.position.x;
  let predictedVX = ball.velocity.x;

  for (let i = 0; i < steps; i++) {
    predictedX += predictedVX;

    // Account for wall bounces
    if (predictedX < 0 || predictedX > court.width) {
      predictedVX *= -0.85; // Ball bounciness
      predictedX = Math.max(0, Math.min(court.width, predictedX));
    }
  }

  return predictedX;
}

// Create different AI difficulty levels
export const AI_DIFFICULTY = {
  easy: {
    reactionTime: 0.4,
    accuracy: 0.5,
    aggressiveness: 0.3,
  },
  medium: {
    reactionTime: 0.7,
    accuracy: 0.75,
    aggressiveness: 0.6,
  },
  hard: {
    reactionTime: 0.9,
    accuracy: 0.9,
    aggressiveness: 0.8,
  },
} as const;
