import React, { useEffect } from 'react';
import { usePacMan } from '../../../hooks/usePacMan';
import { GameCanvas } from './GameCanvas';
import { Direction } from './types';

interface PacManPageProps {
  onNavigateHome: () => void;
}

export const PacManPage: React.FC<PacManPageProps> = ({ onNavigateHome }) => {
  const [gameState, controls] = usePacMan();

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const keyMap: Record<string, Direction> = {
        ArrowUp: 'up',
        ArrowDown: 'down',
        ArrowLeft: 'left',
        ArrowRight: 'right',
        w: 'up',
        s: 'down',
        a: 'left',
        d: 'right',
      };

      const direction = keyMap[e.key];
      if (direction) {
        e.preventDefault();
        controls.setDirection(direction);
      }

      if (e.key === 'p' || e.key === 'P') {
        controls.pauseGame();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [controls]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-blue-900 to-black p-4">
      {/* Header */}
      <div className="max-w-4xl mx-auto mb-6">
        <div className="flex items-center justify-between">
          <button
            onClick={onNavigateHome}
            className="kid-button bg-white hover:bg-gray-100 text-gray-800"
          >
            ← Home
          </button>
          <h1 className="text-3xl font-bold text-yellow-400">
            🟡 Pac-Man
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
              onDirectionChange={controls.setDirection}
            />

            {/* Mobile D-Pad Controls */}
            <div className="grid grid-cols-3 gap-2 w-64 h-64 md:hidden">
              <div></div>
              <button
                onClick={() => controls.setDirection('up')}
                className="kid-button bg-blue-600 hover:bg-blue-700 text-white text-3xl flex items-center justify-center"
                style={{ minHeight: '80px' }}
              >
                ↑
              </button>
              <div></div>

              <button
                onClick={() => controls.setDirection('left')}
                className="kid-button bg-blue-600 hover:bg-blue-700 text-white text-3xl flex items-center justify-center"
                style={{ minHeight: '80px' }}
              >
                ←
              </button>
              <div className="flex items-center justify-center">
                <div className="w-16 h-16 bg-gray-700 rounded-full"></div>
              </div>
              <button
                onClick={() => controls.setDirection('right')}
                className="kid-button bg-blue-600 hover:bg-blue-700 text-white text-3xl flex items-center justify-center"
                style={{ minHeight: '80px' }}
              >
                →
              </button>

              <div></div>
              <button
                onClick={() => controls.setDirection('down')}
                className="kid-button bg-blue-600 hover:bg-blue-700 text-white text-3xl flex items-center justify-center"
                style={{ minHeight: '80px' }}
              >
                ↓
              </button>
              <div></div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-2xl">
              <div className="kid-card bg-yellow-100 p-4 text-center">
                <div className="text-2xl font-bold text-yellow-800">{gameState.score}</div>
                <div className="text-sm text-yellow-600">Score</div>
              </div>
              <div className="kid-card bg-purple-100 p-4 text-center">
                <div className="text-2xl font-bold text-purple-800">{gameState.level}</div>
                <div className="text-sm text-purple-600">Level</div>
              </div>
              <div className="kid-card bg-red-100 p-4 text-center">
                <div className="text-2xl font-bold text-red-800">{'🟡'.repeat(gameState.lives)}</div>
                <div className="text-sm text-red-600">Lives</div>
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
                  ➡️ Next Level
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
                <li>• Use arrow buttons (mobile) or keys (desktop)</li>
                <li>• Eat all dots to complete the level</li>
                <li>• Avoid the ghosts!</li>
                <li>• Eat power pellets to turn ghosts blue</li>
                <li>• Eat blue ghosts for bonus points</li>
              </ul>

              <h3 className="font-bold text-gray-800 mt-4 mb-2">Ghosts:</h3>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• 🔴 Blinky (Red) - Chases you directly</li>
                <li>• 🩷 Pinky (Pink) - Ambushes from ahead</li>
                <li>• 🔵 Inky (Cyan) - Unpredictable flanker</li>
                <li>• 🟠 Clyde (Orange) - Acts randomly</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PacManPage;
