import React from 'react';
import { useFlappyBird } from '../../../hooks/useFlappyBird';
import { GameCanvas } from './GameCanvas';

interface FlappyBirdPageProps {
  onNavigateHome: () => void;
}

export const FlappyBirdPage: React.FC<FlappyBirdPageProps> = ({ onNavigateHome }) => {
  const [gameState, controls] = useFlappyBird();

  // Get medal based on score
  const getMedal = (score: number): string => {
    if (score >= 100) return '🏆 Platinum';
    if (score >= 50) return '🥇 Gold';
    if (score >= 25) return '🥈 Silver';
    if (score >= 10) return '🥉 Bronze';
    return '';
  };

  const medal = getMedal(gameState.score);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-400 to-blue-600 p-4">
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
            🐦 Flappy Bird
          </h1>
          <div className="w-24"></div>
        </div>
      </div>

      {/* Game Area */}
      <div className="max-w-4xl mx-auto">
        <div className="kid-card bg-white p-6">
          <div className="flex flex-col items-center gap-6">
            {/* Canvas */}
            <GameCanvas gameState={gameState} onFlap={controls.flap} />

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 w-full max-w-md">
              <div className="kid-card bg-blue-100 p-4 text-center">
                <div className="text-2xl font-bold text-blue-800">{gameState.score}</div>
                <div className="text-sm text-blue-600">Score</div>
                {medal && <div className="text-lg mt-1">{medal}</div>}
              </div>
              <div className="kid-card bg-purple-100 p-4 text-center">
                <div className="text-2xl font-bold text-purple-800">{gameState.highScore}</div>
                <div className="text-sm text-purple-600">Best</div>
              </div>
            </div>

            {/* Controls */}
            <div className="flex gap-4">
              {gameState.gameStatus === 'gameOver' && (
                <button
                  onClick={controls.resetGame}
                  className="kid-button bg-green-500 hover:bg-green-600 text-white px-8 py-3 text-lg"
                >
                  🔄 Play Again
                </button>
              )}
              {gameState.gameStatus === 'playing' && (
                <button
                  onClick={controls.flap}
                  className="kid-button bg-yellow-500 hover:bg-yellow-600 text-white px-8 py-3 text-lg"
                >
                  👆 Flap!
                </button>
              )}
            </div>

            {/* Instructions */}
            <div className="kid-card bg-yellow-50 p-4 max-w-md">
              <h3 className="font-bold text-gray-800 mb-2">How to Play:</h3>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Tap the screen or press SPACE to flap</li>
                <li>• Navigate through the pipes</li>
                <li>• Don't hit pipes or the ground!</li>
                <li>• Score points by passing pipes</li>
                <li>• Beat your high score!</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlappyBirdPage;
