import React, { useRef, useEffect } from 'react';
import { PacManState, Direction } from './types';
import { GAME_CONSTANTS, DIRECTION_VECTORS } from './constants';
import { MazeTile } from './types';

interface GameCanvasProps {
  gameState: PacManState;
  onDirectionChange: (direction: Direction) => void;
}

export const GameCanvas: React.FC<GameCanvasProps> = ({ gameState, onDirectionChange }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Render game
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const cellSize = GAME_CONSTANTS.CELL_SIZE;

    // Clear canvas
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, GAME_CONSTANTS.CANVAS_WIDTH, GAME_CONSTANTS.CANVAS_HEIGHT);

    // Draw maze
    for (let row = 0; row < gameState.maze.length; row++) {
      for (let col = 0; col < gameState.maze[row].length; col++) {
        const cell = gameState.maze[row][col];
        const x = col * cellSize;
        const y = row * cellSize;

        if (cell === MazeTile.WALL) {
          ctx.fillStyle = '#2121DE';
          ctx.fillRect(x, y, cellSize, cellSize);
          ctx.strokeStyle = '#1A1AB7';
          ctx.lineWidth = 1;
          ctx.strokeRect(x, y, cellSize, cellSize);
        }
      }
    }

    // Draw dots
    ctx.fillStyle = '#FFB897';
    gameState.dots.forEach(dotKey => {
      const [row, col] = dotKey.split(',').map(Number);
      const x = col * cellSize + cellSize / 2;
      const y = row * cellSize + cellSize / 2;
      ctx.beginPath();
      ctx.arc(x, y, 2, 0, Math.PI * 2);
      ctx.fill();
    });

    // Draw power pellets
    gameState.powerPellets.forEach(pelletKey => {
      const [row, col] = pelletKey.split(',').map(Number);
      const x = col * cellSize + cellSize / 2;
      const y = row * cellSize + cellSize / 2;

      const flash = Math.floor(Date.now() / 200) % 2 === 0;
      ctx.fillStyle = flash ? '#FFB897' : '#FFF';
      ctx.beginPath();
      ctx.arc(x, y, 4, 0, Math.PI * 2);
      ctx.fill();
    });

    // Draw Pac-Man
    const pacX = gameState.pacman.col * cellSize + cellSize / 2;
    const pacY = gameState.pacman.row * cellSize + cellSize / 2;
    const pacRadius = cellSize / 2 - 2;

    const directionAngles: Record<Direction, number> = {
      right: 0,
      down: Math.PI / 2,
      left: Math.PI,
      up: (3 * Math.PI) / 2,
      none: 0,
    };

    const baseAngle = directionAngles[gameState.pacman.direction];
    const mouthAngle = (gameState.pacman.mouthAngle * Math.PI) / 180;

    ctx.fillStyle = '#FFFF00';
    ctx.beginPath();
    ctx.arc(
      pacX,
      pacY,
      pacRadius,
      baseAngle + mouthAngle / 2,
      baseAngle + 2 * Math.PI - mouthAngle / 2
    );
    ctx.lineTo(pacX, pacY);
    ctx.closePath();
    ctx.fill();

    // Draw ghosts
    gameState.ghosts.forEach(ghost => {
      const gX = ghost.col * cellSize + cellSize / 2;
      const gY = ghost.row * cellSize + cellSize / 2;
      const gRadius = cellSize / 2 - 2;

      // Ghost color (blue when frightened, flashing when almost over)
      let ghostColor = ghost.color;
      if (ghost.mode === 'frightened') {
        if (gameState.frightenedTimer < GAME_CONSTANTS.FRIGHTENED_FLASH_TIME) {
          const flash = Math.floor(Date.now() / 150) % 2 === 0;
          ghostColor = flash ? '#0000FF' : '#FFF';
        } else {
          ghostColor = '#0000FF';
        }
      } else if (ghost.mode === 'eaten') {
        ghostColor = '#666';
      }

      // Ghost body
      ctx.fillStyle = ghostColor;
      ctx.beginPath();
      ctx.arc(gX, gY - gRadius / 3, gRadius, Math.PI, 0, false);
      ctx.lineTo(gX + gRadius, gY + gRadius);
      ctx.lineTo(gX + gRadius / 2, gY + gRadius / 2);
      ctx.lineTo(gX, gY + gRadius);
      ctx.lineTo(gX - gRadius / 2, gY + gRadius / 2);
      ctx.lineTo(gX - gRadius, gY + gRadius);
      ctx.closePath();
      ctx.fill();

      // Ghost eyes
      if (ghost.mode !== 'eaten') {
        ctx.fillStyle = '#FFF';
        ctx.beginPath();
        ctx.arc(gX - gRadius / 3, gY - gRadius / 3, gRadius / 4, 0, Math.PI * 2);
        ctx.arc(gX + gRadius / 3, gY - gRadius / 3, gRadius / 4, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#000';
        const eyeVector = DIRECTION_VECTORS[ghost.direction];
        const eyeOffsetX = eyeVector.dc * 2;
        const eyeOffsetY = eyeVector.dr * 2;

        ctx.beginPath();
        ctx.arc(gX - gRadius / 3 + eyeOffsetX, gY - gRadius / 3 + eyeOffsetY, gRadius / 6, 0, Math.PI * 2);
        ctx.arc(gX + gRadius / 3 + eyeOffsetX, gY - gRadius / 3 + eyeOffsetY, gRadius / 6, 0, Math.PI * 2);
        ctx.fill();
      }
    });

    // Draw HUD
    ctx.fillStyle = '#FFF';
    ctx.font = 'bold 16px Arial';
    ctx.textAlign = 'left';
    ctx.fillText(`Score: ${gameState.score}`, 10, GAME_CONSTANTS.CANVAS_HEIGHT - 30);
    ctx.fillText(`Level: ${gameState.level}`, 10, GAME_CONSTANTS.CANVAS_HEIGHT - 10);

    ctx.textAlign = 'right';
    ctx.fillText(`Lives: ${'🟡'.repeat(gameState.lives)}`, GAME_CONSTANTS.CANVAS_WIDTH - 10, GAME_CONSTANTS.CANVAS_HEIGHT - 30);

    if (gameState.powerUpActive) {
      const timeLeft = Math.ceil(gameState.powerUpTimer / 1000);
      ctx.fillStyle = '#FFB897';
      ctx.fillText(`Power: ${timeLeft}s`, GAME_CONSTANTS.CANVAS_WIDTH - 10, GAME_CONSTANTS.CANVAS_HEIGHT - 10);
    }

    // Game state overlays
    if (gameState.gameStatus === 'ready') {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
      ctx.fillRect(0, 0, GAME_CONSTANTS.CANVAS_WIDTH, GAME_CONSTANTS.CANVAS_HEIGHT);

      ctx.fillStyle = '#FFFF00';
      ctx.font = 'bold 24px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('Ready!', GAME_CONSTANTS.CANVAS_WIDTH / 2, GAME_CONSTANTS.CANVAS_HEIGHT / 2 - 20);
      ctx.font = '16px Arial';
      ctx.fillStyle = '#FFF';
      ctx.fillText('Use arrow buttons to start', GAME_CONSTANTS.CANVAS_WIDTH / 2, GAME_CONSTANTS.CANVAS_HEIGHT / 2 + 10);
    }

    if (gameState.gameStatus === 'paused') {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
      ctx.fillRect(0, 0, GAME_CONSTANTS.CANVAS_WIDTH, GAME_CONSTANTS.CANVAS_HEIGHT);

      ctx.fillStyle = '#FFFF00';
      ctx.font = 'bold 32px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('PAUSED', GAME_CONSTANTS.CANVAS_WIDTH / 2, GAME_CONSTANTS.CANVAS_HEIGHT / 2);
    }

    if (gameState.gameStatus === 'gameOver') {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
      ctx.fillRect(0, 0, GAME_CONSTANTS.CANVAS_WIDTH, GAME_CONSTANTS.CANVAS_HEIGHT);

      ctx.fillStyle = '#FF0000';
      ctx.font = 'bold 36px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('Game Over', GAME_CONSTANTS.CANVAS_WIDTH / 2, GAME_CONSTANTS.CANVAS_HEIGHT / 2 - 40);

      ctx.fillStyle = '#FFF';
      ctx.font = '20px Arial';
      ctx.fillText(`Score: ${gameState.score}`, GAME_CONSTANTS.CANVAS_WIDTH / 2, GAME_CONSTANTS.CANVAS_HEIGHT / 2);
      ctx.fillText(`Best: ${gameState.highScore}`, GAME_CONSTANTS.CANVAS_WIDTH / 2, GAME_CONSTANTS.CANVAS_HEIGHT / 2 + 30);
    }

    if (gameState.gameStatus === 'levelComplete') {
      ctx.fillStyle = 'rgba(0, 128, 0, 0.8)';
      ctx.fillRect(0, 0, GAME_CONSTANTS.CANVAS_WIDTH, GAME_CONSTANTS.CANVAS_HEIGHT);

      ctx.fillStyle = '#FFFF00';
      ctx.font = 'bold 32px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('Level Complete!', GAME_CONSTANTS.CANVAS_WIDTH / 2, GAME_CONSTANTS.CANVAS_HEIGHT / 2 - 20);

      ctx.fillStyle = '#FFF';
      ctx.font = '18px Arial';
      ctx.fillText(`Score: ${gameState.score}`, GAME_CONSTANTS.CANVAS_WIDTH / 2, GAME_CONSTANTS.CANVAS_HEIGHT / 2 + 20);
    }
  }, [gameState]);

  return (
    <canvas
      ref={canvasRef}
      width={GAME_CONSTANTS.CANVAS_WIDTH}
      height={GAME_CONSTANTS.CANVAS_HEIGHT}
      className="border-4 border-blue-900 rounded-lg"
      style={{
        maxWidth: '100%',
        height: 'auto',
        backgroundColor: '#000',
      }}
    />
  );
};
