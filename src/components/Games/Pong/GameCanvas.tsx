import React, { useRef, useEffect } from 'react';
import { PongState } from './types';
import { GAME_CONSTANTS } from './constants';

interface GameCanvasProps {
  gameState: PongState;
  onMovePaddle: (y: number) => void;
}

export const GameCanvas: React.FC<GameCanvasProps> = ({ gameState, onMovePaddle }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Handle mouse/touch movement
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const scaleY = GAME_CONSTANTS.CANVAS_HEIGHT / rect.height;
      const y = (e.clientY - rect.top) * scaleY;
      onMovePaddle(y);
    };

    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      const rect = canvas.getBoundingClientRect();
      const scaleY = GAME_CONSTANTS.CANVAS_HEIGHT / rect.height;
      const y = (e.touches[0].clientY - rect.top) * scaleY;
      onMovePaddle(y);
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

    // Clear canvas with dark background
    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(0, 0, GAME_CONSTANTS.CANVAS_WIDTH, GAME_CONSTANTS.CANVAS_HEIGHT);

    // Draw center net
    ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
    const netSegments = Math.floor(GAME_CONSTANTS.CANVAS_HEIGHT / (GAME_CONSTANTS.NET_SEGMENT_HEIGHT + GAME_CONSTANTS.NET_GAP));
    for (let i = 0; i < netSegments; i++) {
      const y = i * (GAME_CONSTANTS.NET_SEGMENT_HEIGHT + GAME_CONSTANTS.NET_GAP);
      ctx.fillRect(
        GAME_CONSTANTS.CANVAS_WIDTH / 2 - GAME_CONSTANTS.NET_WIDTH / 2,
        y,
        GAME_CONSTANTS.NET_WIDTH,
        GAME_CONSTANTS.NET_SEGMENT_HEIGHT
      );
    }

    // Draw player paddle (left)
    const playerGradient = ctx.createLinearGradient(
      gameState.playerPaddle.x,
      0,
      gameState.playerPaddle.x + gameState.playerPaddle.width,
      0
    );
    playerGradient.addColorStop(0, gameState.playerPaddle.color);
    playerGradient.addColorStop(1, '#66BB6A');
    ctx.fillStyle = playerGradient;
    ctx.fillRect(
      gameState.playerPaddle.x,
      gameState.playerPaddle.y,
      gameState.playerPaddle.width,
      gameState.playerPaddle.height
    );

    // Player paddle border
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 2;
    ctx.strokeRect(
      gameState.playerPaddle.x,
      gameState.playerPaddle.y,
      gameState.playerPaddle.width,
      gameState.playerPaddle.height
    );

    // Draw AI paddle (right)
    const aiGradient = ctx.createLinearGradient(
      gameState.aiPaddle.x,
      0,
      gameState.aiPaddle.x + gameState.aiPaddle.width,
      0
    );
    aiGradient.addColorStop(0, '#EF5350');
    aiGradient.addColorStop(1, gameState.aiPaddle.color);
    ctx.fillStyle = aiGradient;
    ctx.fillRect(
      gameState.aiPaddle.x,
      gameState.aiPaddle.y,
      gameState.aiPaddle.width,
      gameState.aiPaddle.height
    );

    // AI paddle border
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 2;
    ctx.strokeRect(
      gameState.aiPaddle.x,
      gameState.aiPaddle.y,
      gameState.aiPaddle.width,
      gameState.aiPaddle.height
    );

    // Draw ball
    const ballGradient = ctx.createRadialGradient(
      gameState.ball.x - gameState.ball.radius / 3,
      gameState.ball.y - gameState.ball.radius / 3,
      gameState.ball.radius / 4,
      gameState.ball.x,
      gameState.ball.y,
      gameState.ball.radius
    );
    ballGradient.addColorStop(0, '#FFF9C4');
    ballGradient.addColorStop(1, gameState.ball.color);

    ctx.fillStyle = ballGradient;
    ctx.beginPath();
    ctx.arc(gameState.ball.x, gameState.ball.y, gameState.ball.radius, 0, Math.PI * 2);
    ctx.fill();

    // Ball trail effect
    ctx.shadowBlur = 15;
    ctx.shadowColor = gameState.ball.color;
    ctx.beginPath();
    ctx.arc(gameState.ball.x, gameState.ball.y, gameState.ball.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    // Draw scores
    ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.font = 'bold 48px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(gameState.playerScore.toString(), GAME_CONSTANTS.CANVAS_WIDTH / 4, 60);
    ctx.fillText(gameState.aiScore.toString(), (GAME_CONSTANTS.CANVAS_WIDTH * 3) / 4, 60);

    // Rally counter
    if (gameState.rallyCount > 0) {
      ctx.fillStyle = 'rgba(255, 215, 0, 0.7)';
      ctx.font = 'bold 20px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(`Rally: ${gameState.rallyCount}`, GAME_CONSTANTS.CANVAS_WIDTH / 2, 30);
    }

    // Ball speed indicator
    ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.font = '14px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(`Speed: ${gameState.ball.speed.toFixed(1)}`, GAME_CONSTANTS.CANVAS_WIDTH / 2, GAME_CONSTANTS.CANVAS_HEIGHT - 10);

    // Draw ready message
    if (gameState.gameStatus === 'ready') {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
      ctx.fillRect(0, 0, GAME_CONSTANTS.CANVAS_WIDTH, GAME_CONSTANTS.CANVAS_HEIGHT);

      ctx.fillStyle = '#fff';
      ctx.font = 'bold 42px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('PONG', GAME_CONSTANTS.CANVAS_WIDTH / 2, GAME_CONSTANTS.CANVAS_HEIGHT / 2 - 60);

      ctx.font = '20px Arial';
      ctx.fillText('First to 11 wins!', GAME_CONSTANTS.CANVAS_WIDTH / 2, GAME_CONSTANTS.CANVAS_HEIGHT / 2 - 10);
      ctx.fillText('Click Start to Begin', GAME_CONSTANTS.CANVAS_WIDTH / 2, GAME_CONSTANTS.CANVAS_HEIGHT / 2 + 30);
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

      const playerWon = gameState.playerScore >= gameState.winScore;

      ctx.fillStyle = playerWon ? '#4CAF50' : '#FF6B6B';
      ctx.font = 'bold 42px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(playerWon ? 'You Win!' : 'AI Wins!', GAME_CONSTANTS.CANVAS_WIDTH / 2, GAME_CONSTANTS.CANVAS_HEIGHT / 2 - 40);

      ctx.fillStyle = '#fff';
      ctx.font = '24px Arial';
      ctx.fillText(
        `Final Score: ${gameState.playerScore} - ${gameState.aiScore}`,
        GAME_CONSTANTS.CANVAS_WIDTH / 2,
        GAME_CONSTANTS.CANVAS_HEIGHT / 2 + 10
      );
    }
  }, [gameState]);

  return (
    <canvas
      ref={canvasRef}
      width={GAME_CONSTANTS.CANVAS_WIDTH}
      height={GAME_CONSTANTS.CANVAS_HEIGHT}
      className="border-4 border-gray-800 rounded-lg cursor-pointer"
      style={{
        maxWidth: '100%',
        height: 'auto',
        touchAction: 'none',
        backgroundColor: '#1a1a2e',
      }}
    />
  );
};
