import React from 'react';
import { useBreakout } from '../../../hooks/useBreakout';
import { GameCanvas } from './GameCanvas';
import { POWERUP_ICONS } from './constants';

interface BreakoutPageProps {
  onNavigateHome: () => void;
}

export const BreakoutPage: React.FC<BreakoutPageProps> = ({ onNavigateHome }) => {
  const [gameState, controls] = useBreakout();

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900 via-purple-800 to-indigo-900 p-4">
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
            🧱 Breakout
          </h1>
          <div className="w-24"></div>
        </div>
      </div>

      {/* Game Area */}
      <div className="max-w-4xl mx-auto">
        <div className="kid-card bg-gray-900 p-6">
          <div className="flex flex-col items-center gap-6">
            {/* Canvas */}
            <GameCanvas
              gameState={gameState}
              onMovePaddle={controls.movePaddle}
              onLaunchBall={controls.launchBall}
            />

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-2xl">
              <div className="kid-card bg-blue-100 p-4 text-center">
                <div className="text-2xl font-bold text-blue-800">{gameState.score}</div>
                <div className="text-sm text-blue-600">Score</div>
              </div>
              <div className="kid-card bg-purple-100 p-4 text-center">
                <div className="text-2xl font-bold text-purple-800">{gameState.level}</div>
                <div className="text-sm text-purple-600">Level</div>
              </div>
              <div className="kid-card bg-red-100 p-4 text-center">
                <div className="text-2xl font-bold text-red-800">{'❤️'.repeat(gameState.lives)}</div>
                <div className="text-sm text-red-600">Lives</div>
              </div>
              <div className="kid-card bg-green-100 p-4 text-center">
                <div className="text-2xl font-bold text-green-800">{gameState.highScore}</div>
                <div className="text-sm text-green-600">Best</div>
              </div>
            </div>

            {/* Active Power-ups */}
            {gameState.activePowerUps.length > 0 && (
              <div className="kid-card bg-yellow-100 p-4 w-full max-w-md">
                <h3 className="font-bold text-gray-800 mb-2">Active Power-ups:</h3>
                <div className="flex gap-2 flex-wrap">
                  {gameState.activePowerUps.map((powerUp, index) => (
                    <div key={index} className="kid-card bg-yellow-200 px-3 py-1">
                      <span className="text-lg">{POWERUP_ICONS[powerUp.type]}</span>
                      {powerUp.duration && (
                        <span className="text-xs ml-2">
                          {Math.ceil((powerUp.duration - (Date.now() - powerUp.startTime)) / 1000)}s
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Controls */}
            <div className="flex gap-4 flex-wrap justify-center">
              {gameState.gameStatus === 'ready' && (
                <button
                  onClick={controls.launchBall}
                  className="kid-button bg-green-500 hover:bg-green-600 text-white px-8 py-3 text-lg"
                >
                  🚀 Launch Ball!
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
            <div className="kid-card bg-indigo-50 p-4 max-w-md">
              <h3 className="font-bold text-gray-800 mb-2">How to Play:</h3>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Move mouse/finger to control the paddle</li>
                <li>• Click or tap to launch the ball</li>
                <li>• Break all bricks to complete the level</li>
                <li>• Collect power-ups for special abilities</li>
                <li>• Don't let the ball fall!</li>
              </ul>

              <h3 className="font-bold text-gray-800 mt-4 mb-2">Power-ups:</h3>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• {POWERUP_ICONS.widerPaddle} Wider Paddle</li>
                <li>• {POWERUP_ICONS.multiball} Multi-Ball</li>
                <li>• {POWERUP_ICONS.slowBall} Slow Ball</li>
                <li>• {POWERUP_ICONS.extraLife} Extra Life</li>
              </ul>

              <h3 className="font-bold text-gray-800 mt-4 mb-2">Brick Types:</h3>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Red: 1 hit</li>
                <li>• Orange: 2 hits</li>
                <li>• Purple: 3 hits</li>
                <li>• Gray: Unbreakable</li>
                <li>• Blue with ?: Power-up!</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BreakoutPage;
