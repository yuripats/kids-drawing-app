import React, { useEffect } from 'react';
import { useSpaceInvaders } from '../../../hooks/useSpaceInvaders';
import { GameCanvas } from './GameCanvas';

interface SpaceInvadersPageProps {
  onNavigateHome: () => void;
}

export const SpaceInvadersPage: React.FC<SpaceInvadersPageProps> = ({ onNavigateHome }) => {
  const [gameState, controls] = useSpaceInvaders();

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameState.gameStatus !== 'playing') return;

      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        e.preventDefault();
        controls.movePlayerLeft();
      } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        e.preventDefault();
        controls.movePlayerRight();
      } else if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        controls.shoot();
      } else if (e.key === 'p' || e.key === 'P') {
        controls.pauseGame();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' || e.key === 'ArrowRight' || e.key === 'a' || e.key === 'A' || e.key === 'd' || e.key === 'D') {
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
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-purple-900 to-black p-4">
      {/* Header */}
      <div className="max-w-4xl mx-auto mb-6">
        <div className="flex items-center justify-between">
          <button
            onClick={onNavigateHome}
            className="kid-button bg-white hover:bg-gray-100 text-gray-800"
          >
            ← Home
          </button>
          <h1 className="text-3xl font-bold text-green-400">
            👾 Space Invaders
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
              onMovePlayer={controls.movePlayer}
              onShoot={controls.shoot}
            />

            {/* Mobile Controls */}
            <div className="w-full max-w-md md:hidden">
              <div className="grid grid-cols-3 gap-3">
                <button
                  onTouchStart={controls.movePlayerLeft}
                  onTouchEnd={controls.stopPlayer}
                  onMouseDown={controls.movePlayerLeft}
                  onMouseUp={controls.stopPlayer}
                  onMouseLeave={controls.stopPlayer}
                  className="kid-button bg-blue-600 hover:bg-blue-700 text-white text-2xl"
                  style={{ minHeight: '60px' }}
                >
                  ←
                </button>
                <button
                  onClick={controls.shoot}
                  className="kid-button bg-red-600 hover:bg-red-700 text-white text-xl font-bold"
                  style={{ minHeight: '60px' }}
                >
                  🔥 SHOOT
                </button>
                <button
                  onTouchStart={controls.movePlayerRight}
                  onTouchEnd={controls.stopPlayer}
                  onMouseDown={controls.movePlayerRight}
                  onMouseUp={controls.stopPlayer}
                  onMouseLeave={controls.stopPlayer}
                  className="kid-button bg-blue-600 hover:bg-blue-700 text-white text-2xl"
                  style={{ minHeight: '60px' }}
                >
                  →
                </button>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-2xl">
              <div className="kid-card bg-blue-100 p-4 text-center">
                <div className="text-2xl font-bold text-blue-800">{gameState.score}</div>
                <div className="text-sm text-blue-600">Score</div>
              </div>
              <div className="kid-card bg-purple-100 p-4 text-center">
                <div className="text-2xl font-bold text-purple-800">{gameState.level}</div>
                <div className="text-sm text-purple-600">Wave</div>
              </div>
              <div className="kid-card bg-red-100 p-4 text-center">
                <div className="text-2xl font-bold text-red-800">{'🚀'.repeat(gameState.lives)}</div>
                <div className="text-sm text-red-600">Lives</div>
              </div>
              <div className="kid-card bg-green-100 p-4 text-center">
                <div className="text-2xl font-bold text-green-800">{gameState.highScore}</div>
                <div className="text-sm text-green-600">Best</div>
              </div>
            </div>

            {/* Alien Count */}
            <div className="kid-card bg-yellow-100 p-4 w-full max-w-md text-center">
              <div className="text-lg font-bold text-gray-800">
                Aliens Remaining: {gameState.aliens.filter(a => a.alive).length}
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

              {gameState.gameStatus === 'levelComplete' && (
                <button
                  onClick={controls.nextLevel}
                  className="kid-button bg-purple-500 hover:bg-purple-600 text-white px-8 py-3 text-lg"
                >
                  ➡️ Next Wave
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
            <div className="kid-card bg-purple-50 p-4 max-w-md">
              <h3 className="font-bold text-gray-800 mb-2">How to Play:</h3>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Desktop: Use ← → arrow keys or A/D to move</li>
                <li>• Desktop: Press SPACE to shoot</li>
                <li>• Mobile: Touch ← → buttons to move, SHOOT to fire</li>
                <li>• Destroy all aliens to advance to next wave</li>
                <li>• Hide behind barriers for protection</li>
                <li>• Don't let aliens reach the bottom!</li>
              </ul>

              <h3 className="font-bold text-gray-800 mt-4 mb-2">Alien Types:</h3>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• 🟡 Advanced (Top row) - 30 points</li>
                <li>• 🩵 Medium (Rows 2-3) - 20 points</li>
                <li>• ❤️ Basic (Bottom rows) - 10 points</li>
              </ul>

              <h3 className="font-bold text-gray-800 mt-4 mb-2">Tips:</h3>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Aliens get faster as you destroy more</li>
                <li>• Each wave increases difficulty</li>
                <li>• Shoot from behind barriers for safety</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpaceInvadersPage;
