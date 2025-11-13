import React, { useRef, useEffect } from 'react';
import { FlappyBirdState } from './types';
import { GAME_CONSTANTS, COLORS } from './constants';

interface GameCanvasProps {
  gameState: FlappyBirdState;
  onFlap: () => void;
}

export const GameCanvas: React.FC<GameCanvasProps> = ({ gameState, onFlap }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Render game
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.fillStyle = COLORS.background;
    ctx.fillRect(0, 0, GAME_CONSTANTS.CANVAS_WIDTH, GAME_CONSTANTS.CANVAS_HEIGHT);

    // Draw pipes
    ctx.fillStyle = COLORS.pipe;
    gameState.pipes.forEach((pipe) => {
      const topHeight = pipe.gapY - pipe.gapSize / 2;
      const bottomY = pipe.gapY + pipe.gapSize / 2;
      const bottomHeight = GAME_CONSTANTS.CANVAS_HEIGHT - 50 - bottomY;

      // Top pipe
      ctx.fillRect(pipe.x, 0, pipe.width, topHeight);

      // Bottom pipe
      ctx.fillRect(pipe.x, bottomY, pipe.width, bottomHeight);

      // Pipe caps
      ctx.fillStyle = '#27ae60';
      ctx.fillRect(pipe.x - 5, topHeight - 20, pipe.width + 10, 20);
      ctx.fillRect(pipe.x - 5, bottomY, pipe.width + 10, 20);
      ctx.fillStyle = COLORS.pipe;
    });

    // Draw ground
    ctx.fillStyle = COLORS.ground;
    ctx.fillRect(0, GAME_CONSTANTS.CANVAS_HEIGHT - 50, GAME_CONSTANTS.CANVAS_WIDTH, 50);

    // Draw bird
    ctx.save();
    ctx.translate(GAME_CONSTANTS.BIRD_START_X, gameState.bird.y);
    ctx.rotate((gameState.bird.rotation * Math.PI) / 180);

    // Bird body
    ctx.fillStyle = COLORS.bird;
    ctx.beginPath();
    ctx.arc(0, 0, gameState.bird.radius, 0, Math.PI * 2);
    ctx.fill();

    // Bird eye
    ctx.fillStyle = 'white';
    ctx.beginPath();
    ctx.arc(5, -5, 4, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = 'black';
    ctx.beginPath();
    ctx.arc(6, -5, 2, 0, Math.PI * 2);
    ctx.fill();

    // Bird beak
    ctx.fillStyle = '#ff6347';
    ctx.beginPath();
    ctx.moveTo(gameState.bird.radius - 2, 0);
    ctx.lineTo(gameState.bird.radius + 8, -3);
    ctx.lineTo(gameState.bird.radius + 8, 3);
    ctx.closePath();
    ctx.fill();

    ctx.restore();

    // Draw score
    ctx.fillStyle = COLORS.text;
    ctx.font = 'bold 48px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(gameState.score.toString(), GAME_CONSTANTS.CANVAS_WIDTH / 2, 80);

    // Draw "ready" message
    if (gameState.gameStatus === 'ready') {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
      ctx.fillRect(0, 0, GAME_CONSTANTS.CANVAS_WIDTH, GAME_CONSTANTS.CANVAS_HEIGHT);

      ctx.fillStyle = 'white';
      ctx.font = 'bold 36px Arial';
      ctx.fillText('Tap or Space to Start', GAME_CONSTANTS.CANVAS_WIDTH / 2, GAME_CONSTANTS.CANVAS_HEIGHT / 2);

      ctx.font = '24px Arial';
      ctx.fillText('Tap to Flap!', GAME_CONSTANTS.CANVAS_WIDTH / 2, GAME_CONSTANTS.CANVAS_HEIGHT / 2 + 50);
    }

    // Draw game over screen
    if (gameState.gameStatus === 'gameOver') {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
      ctx.fillRect(0, 0, GAME_CONSTANTS.CANVAS_WIDTH, GAME_CONSTANTS.CANVAS_HEIGHT);

      ctx.fillStyle = 'white';
      ctx.font = 'bold 48px Arial';
      ctx.fillText('Game Over', GAME_CONSTANTS.CANVAS_WIDTH / 2, GAME_CONSTANTS.CANVAS_HEIGHT / 2 - 50);

      ctx.font = '24px Arial';
      ctx.fillText(`Score: ${gameState.score}`, GAME_CONSTANTS.CANVAS_WIDTH / 2, GAME_CONSTANTS.CANVAS_HEIGHT / 2 + 10);
      ctx.fillText(`Best: ${gameState.highScore}`, GAME_CONSTANTS.CANVAS_WIDTH / 2, GAME_CONSTANTS.CANVAS_HEIGHT / 2 + 50);

      ctx.font = '20px Arial';
      ctx.fillText('Tap or Press R to Restart', GAME_CONSTANTS.CANVAS_WIDTH / 2, GAME_CONSTANTS.CANVAS_HEIGHT / 2 + 100);
    }
  }, [gameState]);

  // Handle touch/click
  const handleCanvasClick = () => {
    if (gameState.gameStatus === 'gameOver') {
      // Handled by reset button
      return;
    }
    onFlap();
  };

  return (
    <canvas
      ref={canvasRef}
      width={GAME_CONSTANTS.CANVAS_WIDTH}
      height={GAME_CONSTANTS.CANVAS_HEIGHT}
      onClick={handleCanvasClick}
      className="border-4 border-gray-800 rounded-lg cursor-pointer touch-none"
      style={{
        maxWidth: '100%',
        height: 'auto',
        touchAction: 'none'
      }}
    />
  );
};
