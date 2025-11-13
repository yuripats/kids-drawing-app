import React, { useRef, useEffect } from 'react';
import { EndlessRunnerState } from './types';
import { GAME_CONSTANTS } from './constants';

interface GameCanvasProps {
  gameState: EndlessRunnerState;
}

export const GameCanvas: React.FC<GameCanvasProps> = ({ gameState }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Render game
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas with sky gradient
    const skyGradient = ctx.createLinearGradient(0, 0, 0, GAME_CONSTANTS.CANVAS_HEIGHT);
    skyGradient.addColorStop(0, '#87CEEB');
    skyGradient.addColorStop(1, '#E0F6FF');
    ctx.fillStyle = skyGradient;
    ctx.fillRect(0, 0, GAME_CONSTANTS.CANVAS_WIDTH, GAME_CONSTANTS.CANVAS_HEIGHT);

    // Draw clouds
    gameState.clouds.forEach(cloud => {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';

      // Cloud shape (3 circles)
      ctx.beginPath();
      ctx.arc(cloud.x + cloud.width * 0.25, cloud.y + 10, 15, 0, Math.PI * 2);
      ctx.arc(cloud.x + cloud.width * 0.5, cloud.y, 18, 0, Math.PI * 2);
      ctx.arc(cloud.x + cloud.width * 0.75, cloud.y + 10, 15, 0, Math.PI * 2);
      ctx.fill();
    });

    // Draw ground
    const groundGradient = ctx.createLinearGradient(0, GAME_CONSTANTS.GROUND_Y, 0, GAME_CONSTANTS.CANVAS_HEIGHT);
    groundGradient.addColorStop(0, '#8BC34A');
    groundGradient.addColorStop(1, '#689F38');
    ctx.fillStyle = groundGradient;
    ctx.fillRect(0, GAME_CONSTANTS.GROUND_Y, GAME_CONSTANTS.CANVAS_WIDTH, GAME_CONSTANTS.CANVAS_HEIGHT - GAME_CONSTANTS.GROUND_Y);

    // Ground line
    ctx.strokeStyle = '#558B2F';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(0, GAME_CONSTANTS.GROUND_Y);
    ctx.lineTo(GAME_CONSTANTS.CANVAS_WIDTH, GAME_CONSTANTS.GROUND_Y);
    ctx.stroke();

    // Ground details (grass)
    ctx.strokeStyle = '#7CB342';
    ctx.lineWidth = 2;
    for (let i = 0; i < GAME_CONSTANTS.CANVAS_WIDTH; i += 15) {
      const offset = (gameState.distance * 5) % 15;
      const x = i - offset;
      ctx.beginPath();
      ctx.moveTo(x, GAME_CONSTANTS.GROUND_Y + 2);
      ctx.lineTo(x + 3, GAME_CONSTANTS.GROUND_Y + 8);
      ctx.moveTo(x + 6, GAME_CONSTANTS.GROUND_Y + 2);
      ctx.lineTo(x + 9, GAME_CONSTANTS.GROUND_Y + 8);
      ctx.stroke();
    }

    // Draw obstacles
    gameState.obstacles.forEach(obstacle => {
      if (obstacle.type === 'cactus') {
        // Draw cactus
        ctx.fillStyle = obstacle.color;
        ctx.fillRect(obstacle.x + 6, obstacle.y, 8, obstacle.height);

        // Arms
        ctx.fillRect(obstacle.x, obstacle.y + 10, 6, 3);
        ctx.fillRect(obstacle.x, obstacle.y + 10, 3, 15);
        ctx.fillRect(obstacle.x + 14, obstacle.y + 15, 6, 3);
        ctx.fillRect(obstacle.x + 17, obstacle.y + 15, 3, 12);

        // Border
        ctx.strokeStyle = '#1B5E20';
        ctx.lineWidth = 2;
        ctx.strokeRect(obstacle.x + 6, obstacle.y, 8, obstacle.height);
      } else if (obstacle.type === 'rock') {
        // Draw rock
        ctx.fillStyle = obstacle.color;
        ctx.beginPath();
        ctx.ellipse(
          obstacle.x + obstacle.width / 2,
          obstacle.y + obstacle.height / 2,
          obstacle.width / 2,
          obstacle.height / 2,
          0,
          0,
          Math.PI * 2
        );
        ctx.fill();

        // Rock texture
        ctx.fillStyle = '#4E342E';
        ctx.beginPath();
        ctx.arc(obstacle.x + 8, obstacle.y + 8, 3, 0, Math.PI * 2);
        ctx.arc(obstacle.x + 18, obstacle.y + 12, 2, 0, Math.PI * 2);
        ctx.arc(obstacle.x + 10, obstacle.y + 18, 2.5, 0, Math.PI * 2);
        ctx.fill();

        // Border
        ctx.strokeStyle = '#3E2723';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.ellipse(
          obstacle.x + obstacle.width / 2,
          obstacle.y + obstacle.height / 2,
          obstacle.width / 2,
          obstacle.height / 2,
          0,
          0,
          Math.PI * 2
        );
        ctx.stroke();
      } else {
        // Draw bird
        ctx.fillStyle = obstacle.color;

        // Bird body
        ctx.beginPath();
        ctx.ellipse(
          obstacle.x + obstacle.width / 2,
          obstacle.y + obstacle.height / 2,
          obstacle.width / 2.5,
          obstacle.height / 2,
          0,
          0,
          Math.PI * 2
        );
        ctx.fill();

        // Wings (animated)
        const wingAngle = Math.sin(gameState.distance * 0.5) * 0.3;
        ctx.save();
        ctx.translate(obstacle.x + obstacle.width / 2, obstacle.y + obstacle.height / 2);

        // Left wing
        ctx.rotate(-wingAngle);
        ctx.fillRect(-12, -2, 15, 3);
        ctx.rotate(wingAngle);

        // Right wing
        ctx.rotate(wingAngle);
        ctx.fillRect(-3, -2, 15, 3);
        ctx.restore();

        // Eye
        ctx.fillStyle = '#000';
        ctx.beginPath();
        ctx.arc(obstacle.x + obstacle.width - 10, obstacle.y + obstacle.height / 2 - 2, 2, 0, Math.PI * 2);
        ctx.fill();
      }
    });

    // Draw player
    const playerHeight = gameState.player.isDucking ? GAME_CONSTANTS.PLAYER_DUCK_HEIGHT : gameState.player.height;
    const playerY = gameState.player.isDucking ? GAME_CONSTANTS.GROUND_Y - playerHeight : gameState.player.y;

    ctx.fillStyle = gameState.player.color;

    if (gameState.player.isDucking) {
      // Ducking pose - wider rectangle
      ctx.fillRect(gameState.player.x, playerY, gameState.player.width + 10, playerHeight);

      // Eyes
      ctx.fillStyle = '#000';
      ctx.fillRect(gameState.player.x + 20, playerY + 8, 4, 4);
      ctx.fillRect(gameState.player.x + 28, playerY + 8, 4, 4);
    } else {
      // Standing/jumping pose
      ctx.fillRect(gameState.player.x, playerY, gameState.player.width, playerHeight);

      // Eyes
      ctx.fillStyle = '#000';
      ctx.fillRect(gameState.player.x + 12, playerY + 8, 4, 4);
      ctx.fillRect(gameState.player.x + 20, playerY + 8, 4, 4);

      // Arms
      ctx.fillStyle = gameState.player.color;
      ctx.fillRect(gameState.player.x - 4, playerY + 15, 4, 10);
      ctx.fillRect(gameState.player.x + gameState.player.width, playerY + 15, 4, 10);
    }

    // Player border
    ctx.strokeStyle = '#2E7D32';
    ctx.lineWidth = 2;
    if (gameState.player.isDucking) {
      ctx.strokeRect(gameState.player.x, playerY, gameState.player.width + 10, playerHeight);
    } else {
      ctx.strokeRect(gameState.player.x, playerY, gameState.player.width, playerHeight);
    }

    // Draw UI
    ctx.fillStyle = '#333';
    ctx.font = 'bold 20px Arial';
    ctx.textAlign = 'left';
    ctx.fillText(`Score: ${gameState.score}`, 10, 30);
    ctx.fillText(`Speed: ${gameState.speed.toFixed(1)}x`, 10, 55);

    ctx.textAlign = 'right';
    ctx.fillText(`Best: ${gameState.highScore}`, GAME_CONSTANTS.CANVAS_WIDTH - 10, 30);
    ctx.fillText(`Distance: ${Math.floor(gameState.distance)}m`, GAME_CONSTANTS.CANVAS_WIDTH - 10, 55);

    // Draw ready message
    if (gameState.gameStatus === 'ready') {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
      ctx.fillRect(0, 0, GAME_CONSTANTS.CANVAS_WIDTH, GAME_CONSTANTS.CANVAS_HEIGHT);

      ctx.fillStyle = '#fff';
      ctx.font = 'bold 32px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('Endless Runner', GAME_CONSTANTS.CANVAS_WIDTH / 2, GAME_CONSTANTS.CANVAS_HEIGHT / 2 - 30);

      ctx.font = '18px Arial';
      ctx.fillText('Tap JUMP or press SPACE to start', GAME_CONSTANTS.CANVAS_WIDTH / 2, GAME_CONSTANTS.CANVAS_HEIGHT / 2 + 10);
      ctx.fillText('Hold DUCK or ↓ to slide', GAME_CONSTANTS.CANVAS_WIDTH / 2, GAME_CONSTANTS.CANVAS_HEIGHT / 2 + 35);
    }

    // Draw paused message
    if (gameState.gameStatus === 'paused') {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
      ctx.fillRect(0, 0, GAME_CONSTANTS.CANVAS_WIDTH, GAME_CONSTANTS.CANVAS_HEIGHT);

      ctx.fillStyle = '#fff';
      ctx.font = 'bold 48px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('PAUSED', GAME_CONSTANTS.CANVAS_WIDTH / 2, GAME_CONSTANTS.CANVAS_HEIGHT / 2);
    }

    // Draw game over message
    if (gameState.gameStatus === 'gameOver') {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
      ctx.fillRect(0, 0, GAME_CONSTANTS.CANVAS_WIDTH, GAME_CONSTANTS.CANVAS_HEIGHT);

      ctx.fillStyle = '#ff4444';
      ctx.font = 'bold 42px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('Game Over!', GAME_CONSTANTS.CANVAS_WIDTH / 2, GAME_CONSTANTS.CANVAS_HEIGHT / 2 - 40);

      ctx.fillStyle = '#fff';
      ctx.font = '22px Arial';
      ctx.fillText(`Distance: ${Math.floor(gameState.distance)}m`, GAME_CONSTANTS.CANVAS_WIDTH / 2, GAME_CONSTANTS.CANVAS_HEIGHT / 2);
      ctx.fillText(`Score: ${gameState.score}`, GAME_CONSTANTS.CANVAS_WIDTH / 2, GAME_CONSTANTS.CANVAS_HEIGHT / 2 + 30);
      ctx.fillText(`Best: ${gameState.highScore}`, GAME_CONSTANTS.CANVAS_WIDTH / 2, GAME_CONSTANTS.CANVAS_HEIGHT / 2 + 60);
    }
  }, [gameState]);

  return (
    <canvas
      ref={canvasRef}
      width={GAME_CONSTANTS.CANVAS_WIDTH}
      height={GAME_CONSTANTS.CANVAS_HEIGHT}
      className="border-4 border-gray-800 rounded-lg"
      style={{
        maxWidth: '100%',
        height: 'auto',
        touchAction: 'none',
      }}
    />
  );
};
