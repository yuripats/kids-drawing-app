/**
 * Simon Says Game Page
 * Pattern memory game with colored buttons and audio feedback
 */

import React from 'react';
import { useSimonSays } from '../../../hooks/useSimonSays';
import GameLayout from '../../shared/GameLayout';
import type { Speed, ButtonConfig } from './types';

interface SimonSaysPageProps {
  onNavigateHome: () => void;
}

const buttonConfigs: ButtonConfig[] = [
  { color: 'red', frequency: 261.63, className: 'bg-red-500 hover:bg-red-600 active:bg-red-700' },
  { color: 'blue', frequency: 329.63, className: 'bg-blue-500 hover:bg-blue-600 active:bg-blue-700' },
  { color: 'green', frequency: 392.00, className: 'bg-green-500 hover:bg-green-600 active:bg-green-700' },
  { color: 'yellow', frequency: 523.25, className: 'bg-yellow-500 hover:bg-yellow-600 active:bg-yellow-700' }
];

const SimonSaysPage: React.FC<SimonSaysPageProps> = ({ onNavigateHome }) => {
  const { gameState, startGame, handleButtonPress, resetGame, setSpeed } = useSimonSays();

  const { round, gameStatus, speed, highScore, showingIndex } = gameState;

  const handleSpeedChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSpeed(e.target.value as Speed);
  };

  const getStatusMessage = (): string => {
    switch (gameStatus) {
      case 'ready':
        return '👆 Press Start to play!';
      case 'showing':
        return '👀 Watch the pattern!';
      case 'playing':
        return '🎯 Your turn!';
      case 'gameOver':
        return '💥 Game Over!';
      default:
        return '';
    }
  };

  const getStatusColor = (): string => {
    switch (gameStatus) {
      case 'ready':
        return 'text-blue-600';
      case 'showing':
        return 'text-purple-600';
      case 'playing':
        return 'text-green-600';
      case 'gameOver':
        return 'text-red-600';
      default:
        return 'text-slate-600';
    }
  };

  const headerActions = (
    <>
      {/* Speed Selector - Compact on mobile */}
      <select
        value={speed}
        onChange={handleSpeedChange}
        disabled={gameStatus === 'showing' || gameStatus === 'playing'}
        className="kid-input text-xs md:text-sm px-2 md:px-3 py-1 md:py-2"
        title="Game Speed"
      >
        <option value="slow">🐌 Slow</option>
        <option value="normal">🏃 Normal</option>
        <option value="fast">⚡ Fast</option>
      </select>

      {/* Reset Button - Compact on mobile */}
      {gameStatus !== 'ready' && (
        <button
          className="kid-button text-xs md:text-sm bg-blue-500 hover:bg-blue-600 px-2 md:px-4 py-1 md:py-2"
          onClick={resetGame}
        >
          <span className="md:hidden">🔄</span>
          <span className="hidden md:inline">🔄 New Game</span>
        </button>
      )}
    </>
  );

  return (
    <GameLayout
      title="Simon Says"
      emoji="🎵"
      onNavigateHome={onNavigateHome}
      headerActions={headerActions}
      bgColorClass="bg-gradient-to-b from-indigo-100 to-purple-100"
    >
      {/* Stats Panel - Compact on mobile */}
      <div className="kid-card max-w-4xl mx-auto mb-2 md:mb-4 p-2 md:p-4">
        <div className="grid grid-cols-2 gap-2 md:gap-4">
          {/* Round */}
          <div className="text-center">
            <p className="text-xs md:text-sm text-slate-600 font-semibold">Round</p>
            <p className="text-xl md:text-3xl font-bold text-purple-600">{round}</p>
          </div>

          {/* High Score */}
          <div className="text-center">
            <p className="text-xs md:text-sm text-slate-600 font-semibold">Best</p>
            <p className="text-xl md:text-3xl font-bold text-yellow-600">{highScore}</p>
          </div>
        </div>
      </div>

      {/* Status Message - Smaller on mobile */}
      <div className="text-center mb-2 md:mb-4">
        <p className={`text-sm md:text-lg font-semibold ${getStatusColor()}`}>
          {getStatusMessage()}
        </p>
      </div>

      {/* Start Button */}
      {gameStatus === 'ready' && (
        <div className="text-center mb-4 md:mb-6">
          <button
            className="kid-button bg-purple-500 hover:bg-purple-600 text-lg md:text-2xl px-8 md:px-16 py-3 md:py-5"
            onClick={startGame}
          >
            🎵 Start Game!
          </button>
        </div>
      )}

      {/* Simon Buttons Grid */}
      <div className="max-w-md mx-auto mb-4 md:mb-6">
        <div className="grid grid-cols-2 gap-3 md:gap-4 p-4">
          {buttonConfigs.map((config, index) => (
            <button
              key={config.color}
              onClick={() => handleButtonPress(index)}
              disabled={gameStatus !== 'playing'}
              className={`
                ${config.className}
                ${showingIndex === index ? 'ring-8 ring-white scale-110' : ''}
                ${gameStatus === 'playing' ? 'cursor-pointer' : 'cursor-not-allowed opacity-60'}
                aspect-square rounded-2xl md:rounded-3xl
                shadow-lg transition-all duration-200
                flex items-center justify-center
                text-white font-bold text-2xl md:text-4xl
                touch-none select-none
              `}
              style={{
                transform: showingIndex === index ? 'scale(1.1)' : 'scale(1)'
              }}
            >
              <span className="drop-shadow-lg">
                {index === 0 && '🔴'}
                {index === 1 && '🔵'}
                {index === 2 && '🟢'}
                {index === 3 && '🟡'}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Instructions - Hidden on mobile */}
      <div className="kid-card max-w-4xl mx-auto hidden md:block">
        <h2 className="text-xl font-bold mb-3 text-center text-purple-800">
          How to Play
        </h2>

        <div className="space-y-3 text-slate-700">
          <div>
            <h3 className="font-semibold text-lg mb-1">🎯 Goal</h3>
            <p>
              Repeat the pattern by pressing the buttons in the same order Simon shows you!
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-1">🎮 How to Play</h3>
            <ul className="list-disc list-inside space-y-1">
              <li>Watch as Simon lights up buttons in a sequence</li>
              <li>Listen to the musical tones for each button</li>
              <li>Repeat the pattern by pressing the same buttons in order</li>
              <li>Each round adds one more button to the sequence</li>
              <li>One mistake and the game is over!</li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-1">⚙️ Speed Settings</h3>
            <ul className="list-disc list-inside space-y-1">
              <li><strong>Slow:</strong> 800ms between buttons - great for learning</li>
              <li><strong>Normal:</strong> 600ms - standard challenge</li>
              <li><strong>Fast:</strong> 400ms - expert mode!</li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-1">💡 Tips</h3>
            <ul className="list-disc list-inside space-y-1">
              <li>Pay attention to both colors and sounds</li>
              <li>Create a rhythm or pattern to remember the sequence</li>
              <li>Stay focused - one wrong button ends the game!</li>
              <li>Try to beat your high score!</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Game Over Modal */}
      {gameStatus === 'gameOver' && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="kid-card max-w-md w-full text-center">
            <div className="text-6xl mb-4">😅</div>
            <h2 className="text-3xl font-bold text-red-600 mb-4">
              Game Over!
            </h2>

            <div className="mb-6">
              <p className="text-lg text-slate-600">You reached round</p>
              <p className="text-5xl font-bold text-purple-600 my-2">{round}</p>

              {round === highScore && round > 1 && (
                <div className="bg-yellow-100 border-2 border-yellow-400 rounded-lg p-3 mt-4">
                  <p className="text-lg text-yellow-800 font-semibold">
                    🏆 New High Score! 🏆
                  </p>
                </div>
              )}
            </div>

            <div className="flex gap-3 justify-center">
              <button
                className="kid-button bg-purple-500 hover:bg-purple-600 text-lg"
                onClick={resetGame}
              >
                🔄 Play Again
              </button>
              <button
                className="kid-button bg-slate-500 hover:bg-slate-600 text-lg"
                onClick={onNavigateHome}
              >
                ← Home
              </button>
            </div>
          </div>
        </div>
      )}
    </GameLayout>
  );
};

export default SimonSaysPage;
