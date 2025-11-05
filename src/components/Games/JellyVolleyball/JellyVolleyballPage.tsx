// Main page component for Jelly Volleyball game

import { useJellyVolleyball } from '../../../hooks/useJellyVolleyball';
import GameCanvas from './GameCanvas';

interface Props {
  onNavigateHome: () => void;
}

export default function JellyVolleyballPage({ onNavigateHome }: Props) {
  const { gameState, isPaused, controls } = useJellyVolleyball({
    courtWidth: 800,
    courtHeight: 400,
    netHeight: 100,
    playerRadius: 35,
    ballRadius: 12,
    gravity: 0.5,
    pointsToWin: 7,
  });

  return (
    <div className="p-4 min-h-screen bg-gradient-to-b from-blue-100 to-blue-200">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-3xl font-bold text-blue-900">Jelly Volleyball</h1>
        <div className="flex gap-2">
          <button className="kid-button text-sm" onClick={controls.togglePause}>
            {isPaused ? '▶️ Resume' : '⏸️ Pause'}
          </button>
          <button className="kid-button text-sm" onClick={onNavigateHome}>
            ← Home
          </button>
        </div>
      </div>

      {/* Game Canvas */}
      <div className="flex justify-center mb-4">
        <GameCanvas
          gameState={gameState}
          width={gameState.court.width}
          height={gameState.court.height}
        />
      </div>

      {/* Controls Info */}
      <div className="kid-card max-w-4xl mx-auto">
        <h2 className="text-xl font-bold mb-3 text-center">How to Play</h2>

        <div className="grid md:grid-cols-2 gap-4">
          {/* Player 1 Controls */}
          <div className="bg-red-100 p-4 rounded-lg border-2 border-red-300">
            <h3 className="font-bold text-lg mb-2 text-red-700">
              🔴 Player 1 (Left - You!)
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="font-semibold">Move Left:</span>
                <span className="bg-white px-2 py-1 rounded">A or ←</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold">Move Right:</span>
                <span className="bg-white px-2 py-1 rounded">D or →</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold">Jump:</span>
                <span className="bg-white px-2 py-1 rounded">W or ↑ or Space</span>
              </div>
            </div>

            {/* Touch Controls for Mobile */}
            <div className="mt-3 pt-3 border-t border-red-300">
              <p className="font-semibold mb-2 text-sm">Touch Controls:</p>
              <div className="flex gap-2 justify-center">
                <button
                  className="kid-button text-2xl px-6 py-3"
                  onTouchStart={() => controls.setControl('left', true)}
                  onTouchEnd={() => controls.setControl('left', false)}
                  onMouseDown={() => controls.setControl('left', true)}
                  onMouseUp={() => controls.setControl('left', false)}
                  onMouseLeave={() => controls.setControl('left', false)}
                >
                  ←
                </button>
                <button
                  className="kid-button text-2xl px-6 py-3"
                  onTouchStart={() => controls.setControl('jump', true)}
                  onTouchEnd={() => controls.setControl('jump', false)}
                  onMouseDown={() => controls.setControl('jump', true)}
                  onMouseUp={() => controls.setControl('jump', false)}
                  onMouseLeave={() => controls.setControl('jump', false)}
                >
                  ↑
                </button>
                <button
                  className="kid-button text-2xl px-6 py-3"
                  onTouchStart={() => controls.setControl('right', true)}
                  onTouchEnd={() => controls.setControl('right', false)}
                  onMouseDown={() => controls.setControl('right', true)}
                  onMouseUp={() => controls.setControl('right', false)}
                  onMouseLeave={() => controls.setControl('right', false)}
                >
                  →
                </button>
              </div>
            </div>
          </div>

          {/* Player 2 (AI) Info */}
          <div className="bg-teal-100 p-4 rounded-lg border-2 border-teal-300">
            <h3 className="font-bold text-lg mb-2 text-teal-700">
              🔵 Player 2 (Right - AI)
            </h3>
            <div className="space-y-2 text-sm">
              <p>
                <span className="font-semibold">Controlled by:</span> Computer AI
              </p>
              <p>
                <span className="font-semibold">Difficulty:</span> Medium
              </p>
              <p className="text-xs text-gray-600 mt-2">
                The AI will try to hit the ball back to you. Try to make it land on their side!
              </p>
            </div>
          </div>
        </div>

        {/* Game Rules */}
        <div className="mt-4 p-4 bg-yellow-50 rounded-lg border-2 border-yellow-300">
          <h3 className="font-bold text-lg mb-2 text-yellow-800">📋 Game Rules</h3>
          <ul className="space-y-1 text-sm list-disc list-inside">
            <li>Keep the ball from touching the ground on your side</li>
            <li>Make the ball land on your opponent's side to score</li>
            <li>First player to <strong>{gameState.court.width ? '7' : ''} points</strong> wins!</li>
            <li>The ball must go over the net</li>
            <li>Use your jelly body to bounce the ball</li>
          </ul>
        </div>

        {/* Additional Controls */}
        <div className="mt-4 flex justify-center gap-3">
          <button className="kid-button" onClick={controls.resetGame}>
            🔄 New Game
          </button>
          {isPaused && (
            <div className="text-center py-2 px-4 bg-yellow-100 border-2 border-yellow-400 rounded-lg">
              <span className="font-bold">⏸️ PAUSED</span>
            </div>
          )}
        </div>
      </div>

      {/* Game Status Messages */}
      {gameState.lastScorer && gameState.gameStatus === 'playing' && (
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none">
          <div className="bg-white border-4 border-blue-500 rounded-lg px-8 py-4 shadow-2xl animate-bounce">
            <p className="text-3xl font-bold text-blue-900">
              {gameState.lastScorer === 1 ? 'You Scored! 🎉' : 'AI Scored! 💪'}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
