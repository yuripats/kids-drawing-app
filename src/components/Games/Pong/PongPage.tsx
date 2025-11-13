import React, { useEffect } from 'react';
import { usePong } from '../../../hooks/usePong';
import { GameCanvas } from './GameCanvas';

interface PongPageProps {
  onNavigateHome: () => void;
}

export const PongPage: React.FC<PongPageProps> = ({ onNavigateHome }) => {
  const [gameState, controls] = usePong();

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameState.gameStatus !== 'playing') return;

      if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') {
        e.preventDefault();
        controls.movePlayerUp();
      } else if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') {
        e.preventDefault();
        controls.movePlayerDown();
      } else if (e.key === 'p' || e.key === 'P') {
        controls.pauseGame();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'ArrowUp' || e.key === 'ArrowDown' || e.key === 'w' || e.key === 'W' || e.key === 's' || e.key === 'S') {
        e.preventDefault();
        controls.stopPlayer();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [controls, gameState.gameStatus]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-indigo-900 to-purple-900 p-4">
      {/* Header */}
      <div className="max-w-4xl mx-auto mb-6">
        <div className="flex items-center justify-between">
          <button
            onClick={onNavigateHome}
            className="kid-button bg-white hover:bg-gray-100 text-gray-800"
          >
            ← Home
          </button>
          <h1 className="text-3xl font-bold text-white">
            🏓 Pong
          </h1>
          <div className="w-24"></div>
        </div>
      </div>

      {/* Game Area */}
      <div className="max-w-4xl mx-auto">
        <div className="kid-card bg-black p-6">
          <div className="flex flex-col items-center gap-6">
            {/* Canvas */}
            <GameCanvas
              gameState={gameState}
              onMovePaddle={controls.movePaddle}
            />

            {/* Mobile Controls */}
            <div className="w-full max-w-md md:hidden">
              <div className="grid grid-cols-2 gap-4">
                <button
                  onTouchStart={controls.movePlayerUp}
                  onTouchEnd={controls.stopPlayer}
                  onMouseDown={controls.movePlayerUp}
                  onMouseUp={controls.stopPlayer}
                  onMouseLeave={controls.stopPlayer}
                  className="kid-button bg-green-600 hover:bg-green-700 text-white text-2xl"
                  style={{ minHeight: '70px' }}
                >
                  ⬆️ UP
                </button>
                <button
                  onTouchStart={controls.movePlayerDown}
                  onTouchEnd={controls.stopPlayer}
                  onMouseDown={controls.movePlayerDown}
                  onMouseUp={controls.stopPlayer}
                  onMouseLeave={controls.stopPlayer}
                  className="kid-button bg-green-600 hover:bg-green-700 text-white text-2xl"
                  style={{ minHeight: '70px' }}
                >
                  ⬇️ DOWN
                </button>
              </div>
              <p className="text-sm text-gray-600 text-center mt-2">
                Or move your finger on the screen to control paddle
              </p>
            </div>

            {/* Difficulty Selection (only when ready) */}
            {gameState.gameStatus === 'ready' && (
              <div className="kid-card bg-purple-50 p-4 w-full max-w-md">
                <h3 className="font-bold text-gray-800 mb-3 text-center">AI Difficulty:</h3>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => controls.setDifficulty('easy')}
                    className={`kid-button ${
                      gameState.difficulty === 'easy'
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    } py-2 text-sm`}
                  >
                    Easy
                  </button>
                  <button
                    onClick={() => controls.setDifficulty('medium')}
                    className={`kid-button ${
                      gameState.difficulty === 'medium'
                        ? 'bg-orange-600 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    } py-2 text-sm`}
                  >
                    Medium
                  </button>
                  <button
                    onClick={() => controls.setDifficulty('hard')}
                    className={`kid-button ${
                      gameState.difficulty === 'hard'
                        ? 'bg-red-600 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    } py-2 text-sm`}
                  >
                    Hard
                  </button>
                </div>
              </div>
            )}

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-2xl">
              <div className="kid-card bg-green-100 p-4 text-center">
                <div className="text-2xl font-bold text-green-800">{gameState.playerScore}</div>
                <div className="text-sm text-green-600">Your Score</div>
              </div>
              <div className="kid-card bg-red-100 p-4 text-center">
                <div className="text-2xl font-bold text-red-800">{gameState.aiScore}</div>
                <div className="text-sm text-red-600">AI Score</div>
              </div>
              <div className="kid-card bg-yellow-100 p-4 text-center">
                <div className="text-2xl font-bold text-yellow-800">{gameState.rallyCount}</div>
                <div className="text-sm text-yellow-600">Rally</div>
              </div>
              <div className="kid-card bg-blue-100 p-4 text-center">
                <div className="text-2xl font-bold text-blue-800">{gameState.ball.speed.toFixed(1)}x</div>
                <div className="text-sm text-blue-600">Speed</div>
              </div>
            </div>

            {/* Controls */}
            <div className="flex gap-4 flex-wrap justify-center">
              {gameState.gameStatus === 'ready' && (
                <button
                  onClick={controls.startGame}
                  className="kid-button bg-green-500 hover:bg-green-600 text-white px-8 py-3 text-lg"
                >
                  ▶️ Start Game
                </button>
              )}

              {gameState.gameStatus === 'playing' && (
                <button
                  onClick={controls.pauseGame}
                  className="kid-button bg-yellow-500 hover:bg-yellow-600 text-white px-8 py-3 text-lg"
                >
                  ⏸️ Pause
                </button>
              )}

              {gameState.gameStatus === 'paused' && (
                <button
                  onClick={controls.pauseGame}
                  className="kid-button bg-green-500 hover:bg-green-600 text-white px-8 py-3 text-lg"
                >
                  ▶️ Resume
                </button>
              )}

              {gameState.gameStatus === 'gameOver' && (
                <button
                  onClick={controls.resetGame}
                  className="kid-button bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 text-lg"
                >
                  🔄 Play Again
                </button>
              )}

              {(gameState.gameStatus === 'playing' || gameState.gameStatus === 'paused') && (
                <button
                  onClick={controls.resetGame}
                  className="kid-button bg-red-500 hover:bg-red-600 text-white px-6 py-3"
                >
                  🔄 Restart
                </button>
              )}
            </div>

            {/* Instructions */}
            <div className="kid-card bg-indigo-50 p-4 max-w-md">
              <h3 className="font-bold text-gray-800 mb-2">How to Play:</h3>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Desktop: Use ↑ ↓ arrow keys or W/S to move</li>
                <li>• Desktop: Move mouse up/down to position paddle</li>
                <li>• Mobile: Touch ⬆️ ⬇️ buttons or swipe screen</li>
                <li>• Hit the ball with your paddle (left side)</li>
                <li>• First to {gameState.winScore} points wins!</li>
                <li>• Ball speeds up after each hit</li>
              </ul>

              <h3 className="font-bold text-gray-800 mt-4 mb-2">Strategy:</h3>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Hit center of paddle = straight shot</li>
                <li>• Hit edge of paddle = angled shot</li>
                <li>• Build long rallies to increase speed</li>
                <li>• Try to make AI miss with angles!</li>
              </ul>

              <h3 className="font-bold text-gray-800 mt-4 mb-2">Difficulty:</h3>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Easy: Slower AI with poor accuracy</li>
                <li>• Medium: Balanced challenge</li>
                <li>• Hard: Fast AI with precise tracking</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PongPage;
