/**
 * Pop the Balloons Game Page
 * Main container for the Pop the Balloons game
 */

import React from 'react';
import { usePopBalloons } from '../../../hooks/usePopBalloons';
import GameLayout from '../../shared/GameLayout';
import GameBoard from './GameBoard';
import type { Difficulty, GridSize } from './types';
import { difficultySettings, gridSizeSettings } from './constants';

interface PopBalloonsPageProps {
  onNavigateHome: () => void;
}

const PopBalloonsPage: React.FC<PopBalloonsPageProps> = ({ onNavigateHome }) => {
  const { gameState, handleBalloonPop, startGame, resetGame, setDifficulty, setGridSize } = usePopBalloons();

  const {
    score,
    highScore,
    combo,
    maxCombo,
    gameStatus,
    difficulty,
    gridSize,
    timeRemaining,
    lives,
    totalPopped,
    totalMissed
  } = gameState;

  const handleDifficultyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (gameStatus !== 'playing') {
      setDifficulty(e.target.value as Difficulty);
    }
  };

  const handleGridSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (gameStatus !== 'playing') {
      setGridSize(e.target.value as GridSize);
    }
  };

  const getStatusMessage = (): string => {
    switch (gameStatus) {
      case 'ready':
        return '🎯 Ready to pop some balloons?';
      case 'playing':
        return combo > 1 ? `🔥 ${combo}x Combo!` : '👆 Pop the balloons quickly!';
      case 'gameOver':
        return timeRemaining === 0 ? '⏰ Time\'s up!' : '💔 No more lives!';
      default:
        return '';
    }
  };

  const getStatusColor = (): string => {
    switch (gameStatus) {
      case 'ready':
        return 'text-blue-600';
      case 'playing':
        return combo > 1 ? 'text-orange-600 animate-pulse' : 'text-green-600';
      case 'gameOver':
        return 'text-red-600';
      default:
        return 'text-slate-600';
    }
  };

  const headerActions = (
    <>
      {/* Difficulty Selector - Compact on mobile */}
      <select
        value={difficulty}
        onChange={handleDifficultyChange}
        disabled={gameStatus === 'playing'}
        className="kid-input text-xs md:text-sm px-2 md:px-3 py-1 md:py-2"
        title="Game Difficulty"
      >
        {Object.entries(difficultySettings).map(([key, settings]) => (
          <option key={key} value={key}>
            {settings.name}
          </option>
        ))}
      </select>

      {/* Grid Size Selector - Compact on mobile */}
      <select
        value={gridSize}
        onChange={handleGridSizeChange}
        disabled={gameStatus === 'playing'}
        className="kid-input text-xs md:text-sm px-2 md:px-3 py-1 md:py-2"
        title="Grid Size"
      >
        {Object.entries(gridSizeSettings).map(([key, settings]) => (
          <option key={key} value={key}>
            {settings.name}
          </option>
        ))}
      </select>

      {/* New Game Button - Compact on mobile */}
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

  // Handle balloon click during gameplay
  const handleBalloonClick = (balloonId: string) => {
    // Only allow popping balloons when game is playing
    if (gameStatus === 'playing') {
      handleBalloonPop(balloonId);
    }
  };

  return (
    <GameLayout
      title="Pop the Balloons"
      emoji="🎯"
      onNavigateHome={onNavigateHome}
      headerActions={headerActions}
      bgColorClass="bg-gradient-to-b from-yellow-100 to-orange-100"
    >
      {/* Stats Panel - Compact on mobile */}
      <div className="kid-card max-w-4xl mx-auto mb-2 md:mb-4 p-2 md:p-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4">
          {/* Score */}
          <div className="text-center">
            <p className="text-xs md:text-sm text-slate-600 font-semibold">Score</p>
            <p className="text-xl md:text-3xl font-bold text-blue-600">{score}</p>
          </div>

          {/* High Score */}
          <div className="text-center">
            <p className="text-xs md:text-sm text-slate-600 font-semibold">High</p>
            <p className="text-xl md:text-3xl font-bold text-yellow-600">{highScore}</p>
          </div>

          {/* Time */}
          <div className="text-center">
            <p className="text-xs md:text-sm text-slate-600 font-semibold">Time</p>
            <p className={`text-xl md:text-3xl font-bold ${timeRemaining < 10 ? 'text-red-600 animate-pulse' : 'text-green-600'}`}>
              {timeRemaining}s
            </p>
          </div>

          {/* Lives */}
          <div className="text-center">
            <p className="text-xs md:text-sm text-slate-600 font-semibold">Lives</p>
            <p className="text-xl md:text-3xl font-bold text-pink-600">
              {Array.from({ length: lives }, () => '❤️').join('')}
              {lives === 0 && '💔'}
            </p>
          </div>
        </div>

        {/* Combo Display - Smaller on mobile */}
        {combo > 1 && gameStatus === 'playing' && (
          <div className="mt-2 md:mt-4 text-center">
            <div className="inline-block bg-orange-500 text-white px-4 md:px-6 py-1 md:py-2 rounded-full font-bold text-base md:text-xl animate-pulse">
              🔥 {combo}x COMBO! 🔥
            </div>
          </div>
        )}
      </div>

      {/* Status Message - Smaller on mobile */}
      <div className="text-center mb-2 md:mb-4">
        <p className={`text-sm md:text-lg font-semibold ${getStatusColor()}`}>
          {getStatusMessage()}
        </p>
      </div>

      {/* Start Game Button - Smaller on mobile */}
      {gameStatus === 'ready' && (
        <div className="text-center mb-2 md:mb-6">
          <button
            className="kid-button bg-yellow-500 hover:bg-yellow-600 text-lg md:text-2xl px-6 md:px-12 py-2 md:py-4"
            onClick={startGame}
          >
            🎯 Start Game!
          </button>
        </div>
      )}

      {/* Game Board */}
      <div className="mb-2 md:mb-6">
        <GameBoard gameState={gameState} onBalloonPop={handleBalloonClick} />
      </div>

      {/* Legend - More compact on mobile */}
      {gameStatus === 'ready' && (
        <div className="kid-card max-w-xl mx-auto mb-2 md:mb-4 p-2 md:p-4">
          <div className="grid grid-cols-4 gap-2 md:flex md:justify-around items-center text-center">
            <div>
              <div className="text-2xl md:text-4xl mb-1">🎈</div>
              <p className="text-xs md:text-sm font-semibold">Normal</p>
              <p className="text-xs text-slate-600">+10</p>
            </div>
            <div>
              <div className="text-2xl md:text-4xl mb-1">⭐</div>
              <p className="text-xs md:text-sm font-semibold">Golden</p>
              <p className="text-xs text-slate-600">+30</p>
            </div>
            <div>
              <div className="text-2xl md:text-4xl mb-1">💣</div>
              <p className="text-xs md:text-sm font-semibold">Bomb</p>
              <p className="text-xs text-red-600">-1♥</p>
            </div>
            <div>
              <div className="text-2xl md:text-4xl mb-1">🔥</div>
              <p className="text-xs md:text-sm font-semibold">Combo</p>
              <p className="text-xs text-slate-600">+5</p>
            </div>
          </div>
        </div>
      )}

      {/* Instructions - Hidden on mobile */}
      <div className="kid-card max-w-4xl mx-auto hidden md:block">
        <h2 className="text-xl font-bold mb-3 text-center text-orange-800">
          How to Play
        </h2>

        <div className="space-y-3 text-slate-700">
          <div>
            <h3 className="font-semibold text-lg mb-1">🎯 Goal</h3>
            <p>
              Pop as many balloons as you can before time runs out! Avoid the bombs!
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-1">🎮 How to Play</h3>
            <ul className="list-disc list-inside space-y-1">
              <li>Tap balloons quickly to pop them before they disappear</li>
              <li>Normal balloons give you <strong>+10 points</strong></li>
              <li>Golden balloons (⭐) give you <strong>+30 points</strong></li>
              <li>Avoid bombs (💣) - they cost you a life!</li>
              <li>Missing a balloon also costs a life</li>
              <li>Game ends when time runs out or you lose all lives</li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-1">🔥 Combos</h3>
            <p>
              Pop balloons quickly in succession to build a combo! Each combo level adds <strong>+5 bonus points</strong>.
              The combo resets if you miss a balloon, hit a bomb, or wait too long between pops.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-1">⚙️ Difficulty</h3>
            <div className="space-y-2">
              <div>
                <strong>🐌 Easy:</strong>
                <ul className="ml-4 mt-1 space-y-1 text-sm">
                  <li>• Slower spawn rate (1.5s)</li>
                  <li>• Balloons stay longer (2s)</li>
                  <li>• No bombs!</li>
                  <li>• 5 starting lives</li>
                </ul>
              </div>
              <div>
                <strong>🏃 Medium:</strong>
                <ul className="ml-4 mt-1 space-y-1 text-sm">
                  <li>• Faster spawns (1s)</li>
                  <li>• Shorter lifetime (1.5s)</li>
                  <li>• 10% bombs</li>
                  <li>• 3 starting lives</li>
                </ul>
              </div>
              <div>
                <strong>⚡ Hard:</strong>
                <ul className="ml-4 mt-1 space-y-1 text-sm">
                  <li>• Very fast spawns (0.7s)</li>
                  <li>• Quick lifetime (1.2s)</li>
                  <li>• 20% bombs!</li>
                  <li>• 3 starting lives</li>
                  <li>• More golden balloons (15%)</li>
                </ul>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-1">💡 Tips</h3>
            <ul className="list-disc list-inside space-y-1">
              <li>Focus on golden balloons for big points!</li>
              <li>Watch out for the bomb warning (⚠️)</li>
              <li>Build combos by popping balloons quickly</li>
              <li>Don't let balloons disappear - you'll lose a life!</li>
              <li>Practice makes perfect!</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Game Over Modal */}
      {gameStatus === 'gameOver' && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="kid-card max-w-md w-full text-center">
            <div className="text-6xl mb-4">
              {score > highScore || score === highScore ? '🎉' : '😊'}
            </div>
            <h2 className="text-3xl font-bold text-orange-600 mb-4">
              Game Over!
            </h2>

            <div className="mb-6 space-y-3">
              <div>
                <p className="text-lg text-slate-600">Final Score</p>
                <p className="text-5xl font-bold text-blue-600">{score}</p>
              </div>

              {score === highScore && highScore > 0 && score > 0 && (
                <div className="bg-yellow-100 border-2 border-yellow-400 rounded-lg p-3">
                  <p className="text-lg text-yellow-800 font-semibold">
                    🏆 New High Score! 🏆
                  </p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="bg-slate-100 rounded-lg p-2">
                  <p className="text-slate-600">Popped</p>
                  <p className="text-2xl font-bold text-green-600">{totalPopped}</p>
                </div>
                <div className="bg-slate-100 rounded-lg p-2">
                  <p className="text-slate-600">Missed</p>
                  <p className="text-2xl font-bold text-red-600">{totalMissed}</p>
                </div>
              </div>

              {maxCombo > 1 && (
                <div className="bg-orange-100 rounded-lg p-2">
                  <p className="text-slate-600 text-sm">Max Combo</p>
                  <p className="text-2xl font-bold text-orange-600">🔥 {maxCombo}x</p>
                </div>
              )}
            </div>

            <div className="flex gap-3 justify-center">
              <button
                className="kid-button bg-orange-500 hover:bg-orange-600 text-lg"
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

export default PopBalloonsPage;
