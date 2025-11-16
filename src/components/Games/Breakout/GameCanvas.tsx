import React, { useRef, useEffect } from 'react';
import { BreakoutState } from './types';
import { GAME_CONSTANTS, POWERUP_COLORS, POWERUP_ICONS } from './constants';

interface GameCanvasProps {
  gameState: BreakoutState;
  onMovePaddle: (x: number) => void;
  onLaunchBall: () => void;
}

export const GameCanvas: React.FC<GameCanvasProps> = ({ gameState, onMovePaddle, onLaunchBall }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Handle mouse movement
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const scaleX = GAME_CONSTANTS.CANVAS_WIDTH / rect.width;
      const x = (e.clientX - rect.left) * scaleX;
      onMovePaddle(x);
    };

    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      const rect = canvas.getBoundingClientRect();
      const scaleX = GAME_CONSTANTS.CANVAS_WIDTH / rect.width;
      const x = (e.touches[0].clientX - rect.left) * scaleX;
      onMovePaddle(x);
    };

    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('touchmove', handleTouchMove, { passive: false });

    return () => {
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('touchmove', handleTouchMove);
    };
  }, [onMovePaddle]);

  // Render game
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(0, 0, GAME_CONSTANTS.CANVAS_WIDTH, GAME_CONSTANTS.CANVAS_HEIGHT);

    // Draw bricks
    gameState.bricks.forEach(row => {
      row.forEach(brick => {
        if (!brick || brick.destroyed) return;

        // Brick body
        ctx.fillStyle = brick.color;
        ctx.fillRect(brick.x, brick.y, brick.width, brick.height);

        // Brick border
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 2;
        ctx.strokeRect(brick.x, brick.y, brick.width, brick.height);

        // Hit indicator for strong bricks
        if (brick.hits > 0 && brick.type !== 'unbreakable') {
          const alpha = brick.hits / brick.maxHits;
          ctx.fillStyle = `rgba(255, 255, 255, ${0.3 * (1 - alpha)})`;
          ctx.fillRect(brick.x, brick.y, brick.width, brick.height);
        }

        // Special indicator for power-up bricks
        if (brick.type === 'powerup') {
          ctx.fillStyle = '#fff';
          ctx.font = 'bold 16px Arial';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText('?', brick.x + brick.width / 2, brick.y + brick.height / 2);
        }

        // Unbreakable indicator
        if (brick.type === 'unbreakable') {
          ctx.fillStyle = '#333';
          ctx.font = 'bold 14px Arial';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText('■', brick.x + brick.width / 2, brick.y + brick.height / 2);
        }
      });
    });

    // Draw power-ups
    gameState.powerUps.forEach(powerUp => {
      if (powerUp.collected) return;

      ctx.fillStyle = POWERUP_COLORS[powerUp.type];
      ctx.fillRect(powerUp.x, powerUp.y, powerUp.width, powerUp.height);

      // Power-up border
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 2;
      ctx.strokeRect(powerUp.x, powerUp.y, powerUp.width, powerUp.height);

      // Power-up icon
      ctx.fillStyle = '#fff';
      ctx.font = 'bold 14px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(
        POWERUP_ICONS[powerUp.type],
        powerUp.x + powerUp.width / 2,
        powerUp.y + powerUp.height / 2
      );
    });

    // Draw paddle
    const gradient = ctx.createLinearGradient(
      gameState.paddle.x,
      gameState.paddle.y,
      gameState.paddle.x,
      gameState.paddle.y + gameState.paddle.height
    );
    gradient.addColorStop(0, '#4CAF50');
    gradient.addColorStop(1, '#2E7D32');
    ctx.fillStyle = gradient;
    ctx.fillRect(
      gameState.paddle.x,
      gameState.paddle.y,
      gameState.paddle.width,
      gameState.paddle.height
    );

    // Paddle border
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 2;
    ctx.strokeRect(
      gameState.paddle.x,
      gameState.paddle.y,
      gameState.paddle.width,
      gameState.paddle.height
    );

    // Draw balls
    gameState.balls.forEach(ball => {
      const ballGradient = ctx.createRadialGradient(
        ball.x - ball.radius / 3,
        ball.y - ball.radius / 3,
        ball.radius / 4,
        ball.x,
        ball.y,
        ball.radius
      );
      ballGradient.addColorStop(0, '#ff6b6b');
      ballGradient.addColorStop(1, '#ee5a6f');

      ctx.fillStyle = ballGradient;
      ctx.beginPath();
      ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
      ctx.fill();

      // Ball highlight
      ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.beginPath();
      ctx.arc(ball.x - ball.radius / 3, ball.y - ball.radius / 3, ball.radius / 3, 0, Math.PI * 2);
      ctx.fill();
    });

    // Draw UI
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 20px Arial';
    ctx.textAlign = 'left';
    ctx.fillText(`Score: ${gameState.score}`, 10, 30);
    ctx.fillText(`Level: ${gameState.level}`, 10, 55);

    // Lives
    ctx.textAlign = 'right';
    ctx.fillText(`Lives: ${'❤️'.repeat(gameState.lives)}`, GAME_CONSTANTS.CANVAS_WIDTH - 10, 30);

    // Combo
    if (gameState.combo > 1) {
      ctx.fillStyle = '#FFD700';
      ctx.font = 'bold 18px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(`Combo x${gameState.combo}!`, GAME_CONSTANTS.CANVAS_WIDTH / 2, 35);
    }

    // Active power-ups indicator
    if (gameState.activePowerUps.length > 0) {
      ctx.fillStyle = '#4CAF50';
      ctx.font = '14px Arial';
      ctx.textAlign = 'right';
      gameState.activePowerUps.forEach((powerUp, index) => {
        const text = POWERUP_ICONS[powerUp.type];
        ctx.fillText(text, GAME_CONSTANTS.CANVAS_WIDTH - 10, 60 + index * 20);
      });
    }

    // Draw ready message
    if (gameState.gameStatus === 'ready') {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
      ctx.fillRect(0, 0, GAME_CONSTANTS.CANVAS_WIDTH, GAME_CONSTANTS.CANVAS_HEIGHT);

      ctx.fillStyle = '#fff';
      ctx.font = 'bold 36px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('Click or Tap to Launch', GAME_CONSTANTS.CANVAS_WIDTH / 2, GAME_CONSTANTS.CANVAS_HEIGHT / 2);

      ctx.font = '20px Arial';
      ctx.fillText('Move mouse/finger to control paddle', GAME_CONSTANTS.CANVAS_WIDTH / 2, GAME_CONSTANTS.CANVAS_HEIGHT / 2 + 40);
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

      ctx.fillStyle = '#fff';
      ctx.font = 'bold 48px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('Game Over', GAME_CONSTANTS.CANVAS_WIDTH / 2, GAME_CONSTANTS.CANVAS_HEIGHT / 2 - 50);

      ctx.font = '24px Arial';
      ctx.fillText(`Final Score: ${gameState.score}`, GAME_CONSTANTS.CANVAS_WIDTH / 2, GAME_CONSTANTS.CANVAS_HEIGHT / 2 + 10);
      ctx.fillText(`Best: ${gameState.highScore}`, GAME_CONSTANTS.CANVAS_WIDTH / 2, GAME_CONSTANTS.CANVAS_HEIGHT / 2 + 50);
      ctx.fillText(`Level Reached: ${gameState.level}`, GAME_CONSTANTS.CANVAS_WIDTH / 2, GAME_CONSTANTS.CANVAS_HEIGHT / 2 + 90);
    }

    // Draw level complete message
    if (gameState.gameStatus === 'levelComplete') {
      ctx.fillStyle = 'rgba(0, 128, 0, 0.8)';
      ctx.fillRect(0, 0, GAME_CONSTANTS.CANVAS_WIDTH, GAME_CONSTANTS.CANVAS_HEIGHT);

      ctx.fillStyle = '#fff';
      ctx.font = 'bold 48px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('Level Complete!', GAME_CONSTANTS.CANVAS_WIDTH / 2, GAME_CONSTANTS.CANVAS_HEIGHT / 2 - 50);

      ctx.font = '24px Arial';
      ctx.fillText(`Score: ${gameState.score}`, GAME_CONSTANTS.CANVAS_WIDTH / 2, GAME_CONSTANTS.CANVAS_HEIGHT / 2 + 10);
      ctx.fillText('Click Next Level to continue', GAME_CONSTANTS.CANVAS_WIDTH / 2, GAME_CONSTANTS.CANVAS_HEIGHT / 2 + 50);
    }
  }, [gameState]);

  // Handle canvas click
  const handleCanvasClick = () => {
    if (gameState.gameStatus === 'ready') {
      onLaunchBall();
    }
  };

  return (
    <canvas
      ref={canvasRef}
      width={GAME_CONSTANTS.CANVAS_WIDTH}
      height={GAME_CONSTANTS.CANVAS_HEIGHT}
      onClick={handleCanvasClick}
      className="border-4 border-gray-800 rounded-lg cursor-pointer"
      style={{
        maxWidth: '100%',
        height: 'auto',
        touchAction: 'none',
      }}
    />
  );
};
