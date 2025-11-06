// Canvas component for rendering Jelly Volleyball

import { useEffect, forwardRef } from 'react';
import type { GameState } from './types';
import {
  clearCanvas,
  drawCourt,
  drawPlayer,
  drawBall,
  drawScore,
  drawGameOver,
} from './rendering';

interface GameCanvasProps {
  gameState: GameState;
  width: number;
  height: number;
}

const GameCanvas = forwardRef<HTMLCanvasElement, GameCanvasProps>(
  ({ gameState, width, height }, ref) => {
  const canvasRef = ref as React.RefObject<HTMLCanvasElement>;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    clearCanvas(ctx, width, height);

    // Draw court
    drawCourt(ctx, gameState.court);

    // Draw players
    drawPlayer(ctx, gameState.player1);
    drawPlayer(ctx, gameState.player2);

    // Draw ball
    drawBall(ctx, gameState.ball);

    // Draw score
    drawScore(ctx, gameState, gameState.court.width);

    // Draw game over screen if applicable
    if (gameState.gameStatus === 'gameOver' && gameState.winner) {
      const winnerColor = gameState.winner === 1 ? gameState.player1.color : gameState.player2.color;
      drawGameOver(ctx, gameState.winner, winnerColor, gameState.court);
    }
  }, [gameState, width, height, canvasRef]);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      className="border-4 border-gray-700 rounded-lg shadow-lg bg-white"
      style={{ maxWidth: '100%', height: 'auto' }}
    />
  );
});

GameCanvas.displayName = 'GameCanvas';

export default GameCanvas;
