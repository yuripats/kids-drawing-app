import React, { useEffect } from 'react';
import { useEndlessRunner } from '../../../hooks/useEndlessRunner';
import { GameCanvas } from './GameCanvas';

interface EndlessRunnerPageProps {
  onNavigateHome: () => void;
}

export const EndlessRunnerPage: React.FC<EndlessRunnerPageProps> = ({ onNavigateHome }) => {
  const [gameState, controls] = useEndlessRunner();

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameState.gameStatus === 'ready' && (e.key === ' ' || e.key === 'ArrowUp')) {
        e.preventDefault();
        controls.startGame();
        controls.jump();
        return;
      }

      if (gameState.gameStatus !== 'playing') return;

      if (e.key === ' ' || e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') {
        e.preventDefault();
        controls.jump();
      } else if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') {
        e.preventDefault();
        controls.duck();
      } else if (e.key === 'p' || e.key === 'P') {
        controls.pauseGame();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') {
        e.preventDefault();
        controls.stopDuck();
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
    <div className="min-h-screen bg-gradient-to-b from-blue-400 via-blue-300 to-green-300 p-4">
      {/* Header */}
      <div className="max-w-4xl mx-auto mb-6">
        <div className="flex items-center justify-between">
          <button
            onClick={onNavigateHome}
            className="kid-button bg-white hover:bg-gray-100 text-gray-800"
          >
            ← Home
          </button>
          <h1 className="text-3xl font-bold text-white drop-shadow-lg">
            🏃 Endless Runner
          </h1>
          <div className="w-24"></div>
        </div>
      </div>

      {/* Game Area */}
      <div className="max-w-4xl mx-auto">
        <div className="kid-card bg-white p-6">
          <div className="flex flex-col items-center gap-6">
            {/* Canvas */}
            <GameCanvas gameState={gameState} />

            {/* Mobile Controls */}
            <div className="w-full max-w-md md:hidden">
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={controls.jump}
                  className="kid-button bg-green-600 hover:bg-green-700 text-white text-xl font-bold"
                  style={{ minHeight: '70px' }}
                >
                  ⬆️ JUMP
                </button>
                <button
                  onTouchStart={controls.duck}
                  onTouchEnd={controls.stopDuck}
                  onMouseDown={controls.duck}
                  onMouseUp={controls.stopDuck}
                  onMouseLeave={controls.stopDuck}
                  className="kid-button bg-orange-600 hover:bg-orange-700 text-white text-xl font-bold"
                  style={{ minHeight: '70px' }}
                >
                  ⬇️ DUCK
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
                <div className="text-2xl font-bold text-purple-800">{Math.floor(gameState.distance)}m</div>
                <div className="text-sm text-purple-600">Distance</div>
              </div>
              <div className="kid-card bg-orange-100 p-4 text-center">
                <div className="text-2xl font-bold text-orange-800">{gameState.speed.toFixed(1)}x</div>
                <div className="text-sm text-orange-600">Speed</div>
              </div>
              <div className="kid-card bg-green-100 p-4 text-center">
                <div className="text-2xl font-bold text-green-800">{gameState.highScore}</div>
                <div className="text-sm text-green-600">Best</div>
              </div>
            </div>

            {/* Controls */}
            <div className="flex gap-4 flex-wrap justify-center">
              {gameState.gameStatus === 'ready' && (
                <button
                  onClick={() => {
                    controls.startGame();
                    controls.jump();
                  }}
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
            <div className="kid-card bg-blue-50 p-4 max-w-md">
              <h3 className="font-bold text-gray-800 mb-2">How to Play:</h3>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Desktop: Press SPACE or ↑ to jump</li>
                <li>• Desktop: Hold ↓ to duck/slide</li>
                <li>• Mobile: Tap JUMP button to jump</li>
                <li>• Mobile: Hold DUCK button to slide</li>
                <li>• Avoid all obstacles to keep running</li>
                <li>• The game gets faster as you progress!</li>
              </ul>

              <h3 className="font-bold text-gray-800 mt-4 mb-2">Obstacles:</h3>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• 🌵 Cactus - Jump over it</li>
                <li>• 🪨 Rock - Jump over it</li>
                <li>• 🐦 Bird - Duck under it or jump over it</li>
              </ul>

              <h3 className="font-bold text-gray-800 mt-4 mb-2">Tips:</h3>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Birds fly at different heights</li>
                <li>• Speed increases automatically</li>
                <li>• Distance and obstacles give points</li>
                <li>• Stay focused as speed increases!</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EndlessRunnerPage;
