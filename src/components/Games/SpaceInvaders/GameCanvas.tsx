import React, { useRef, useEffect } from 'react';
import { SpaceInvadersState } from './types';
import { GAME_CONSTANTS } from './constants';

interface GameCanvasProps {
  gameState: SpaceInvadersState;
  onMovePlayer: (x: number) => void;
  onShoot: () => void;
}

export const GameCanvas: React.FC<GameCanvasProps> = ({ gameState, onMovePlayer, onShoot: _onShoot }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Handle mouse/touch movement
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const scaleX = GAME_CONSTANTS.CANVAS_WIDTH / rect.width;
      const x = (e.clientX - rect.left) * scaleX;
      onMovePlayer(x);
    };

    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      const rect = canvas.getBoundingClientRect();
      const scaleX = GAME_CONSTANTS.CANVAS_WIDTH / rect.width;
      const x = (e.touches[0].clientX - rect.left) * scaleX;
      onMovePlayer(x);
    };

    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('touchmove', handleTouchMove, { passive: false });

    return () => {
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('touchmove', handleTouchMove);
    };
  }, [onMovePlayer]);

  // Render game
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas with starry background
    ctx.fillStyle = '#0a0a1a';
    ctx.fillRect(0, 0, GAME_CONSTANTS.CANVAS_WIDTH, GAME_CONSTANTS.CANVAS_HEIGHT);

    // Draw stars
    for (let i = 0; i < 50; i++) {
      const x = (i * 137.5) % GAME_CONSTANTS.CANVAS_WIDTH;
      const y = (i * 97.3) % GAME_CONSTANTS.CANVAS_HEIGHT;
      ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
      ctx.fillRect(x, y, 2, 2);
    }

    // Draw barriers
    gameState.barriers.forEach(barrier => {
      barrier.blocks.forEach((row, rowIndex) => {
        row.forEach((active, colIndex) => {
          if (active) {
            ctx.fillStyle = GAME_CONSTANTS.BARRIER_COLOR;
            ctx.fillRect(
              barrier.x + colIndex * barrier.blockSize,
              barrier.y + rowIndex * barrier.blockSize,
              barrier.blockSize,
              barrier.blockSize
            );
          }
        });
      });
    });

    // Draw aliens
    gameState.aliens.forEach(alien => {
      if (!alien.alive) return;

      ctx.fillStyle = alien.color;

      // Draw alien body
      ctx.fillRect(alien.x, alien.y, alien.width, alien.height);

      // Draw eyes
      ctx.fillStyle = '#000';
      const eyeSize = 4;
      ctx.fillRect(alien.x + 8, alien.y + 8, eyeSize, eyeSize);
      ctx.fillRect(alien.x + alien.width - 12, alien.y + 8, eyeSize, eyeSize);

      // Draw border
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 1;
      ctx.strokeRect(alien.x, alien.y, alien.width, alien.height);
    });

    // Draw player
    const gradient = ctx.createLinearGradient(
      gameState.player.x,
      gameState.player.y,
      gameState.player.x,
      gameState.player.y + gameState.player.height
    );
    gradient.addColorStop(0, '#4CAF50');
    gradient.addColorStop(1, '#2E7D32');
    ctx.fillStyle = gradient;

    // Draw player ship (triangle)
    ctx.beginPath();
    ctx.moveTo(gameState.player.x + gameState.player.width / 2, gameState.player.y); // Top
    ctx.lineTo(gameState.player.x, gameState.player.y + gameState.player.height); // Bottom left
    ctx.lineTo(gameState.player.x + gameState.player.width, gameState.player.y + gameState.player.height); // Bottom right
    ctx.closePath();
    ctx.fill();

    // Player border
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Draw bullets
    gameState.bullets.forEach(bullet => {
      ctx.fillStyle = bullet.color;
      ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);

      // Bullet glow
      ctx.shadowBlur = 5;
      ctx.shadowColor = bullet.color;
      ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
      ctx.shadowBlur = 0;
    });

    // Draw UI
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 20px Arial';
    ctx.textAlign = 'left';
    ctx.fillText(`Score: ${gameState.score}`, 10, 30);
    ctx.fillText(`Level: ${gameState.level}`, 10, 55);

    // Lives
    ctx.textAlign = 'right';
    ctx.fillText(`Lives: ${'🚀'.repeat(gameState.lives)}`, GAME_CONSTANTS.CANVAS_WIDTH - 10, 30);

    // High score
    ctx.textAlign = 'center';
    ctx.fillText(`Best: ${gameState.highScore}`, GAME_CONSTANTS.CANVAS_WIDTH / 2, 30);

    // Draw ready message
    if (gameState.gameStatus === 'ready') {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
      ctx.fillRect(0, 0, GAME_CONSTANTS.CANVAS_WIDTH, GAME_CONSTANTS.CANVAS_HEIGHT);

      ctx.fillStyle = '#fff';
      ctx.font = 'bold 36px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('Space Invaders', GAME_CONSTANTS.CANVAS_WIDTH / 2, GAME_CONSTANTS.CANVAS_HEIGHT / 2 - 40);

      ctx.font = '20px Arial';
      ctx.fillText('Click Start to Begin!', GAME_CONSTANTS.CANVAS_WIDTH / 2, GAME_CONSTANTS.CANVAS_HEIGHT / 2 + 10);
      ctx.fillText('Move mouse/finger to aim', GAME_CONSTANTS.CANVAS_WIDTH / 2, GAME_CONSTANTS.CANVAS_HEIGHT / 2 + 40);
      ctx.fillText('Tap Shoot or use Space', GAME_CONSTANTS.CANVAS_WIDTH / 2, GAME_CONSTANTS.CANVAS_HEIGHT / 2 + 70);
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
      ctx.font = 'bold 48px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('Game Over', GAME_CONSTANTS.CANVAS_WIDTH / 2, GAME_CONSTANTS.CANVAS_HEIGHT / 2 - 50);

      ctx.fillStyle = '#fff';
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
      ctx.fillText('Wave Clear!', GAME_CONSTANTS.CANVAS_WIDTH / 2, GAME_CONSTANTS.CANVAS_HEIGHT / 2 - 50);

      ctx.font = '24px Arial';
      ctx.fillText(`Score: ${gameState.score}`, GAME_CONSTANTS.CANVAS_WIDTH / 2, GAME_CONSTANTS.CANVAS_HEIGHT / 2 + 10);
      ctx.fillText('Click Next Wave to continue', GAME_CONSTANTS.CANVAS_WIDTH / 2, GAME_CONSTANTS.CANVAS_HEIGHT / 2 + 50);
    }
  }, [gameState]);

  return (
    <canvas
      ref={canvasRef}
      width={GAME_CONSTANTS.CANVAS_WIDTH}
      height={GAME_CONSTANTS.CANVAS_HEIGHT}
      className="border-4 border-gray-800 rounded-lg cursor-crosshair"
      style={{
        maxWidth: '100%',
        height: 'auto',
        touchAction: 'none',
        backgroundColor: '#0a0a1a',
      }}
    />
  );
};
