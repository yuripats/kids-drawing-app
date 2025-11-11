/**
 * Memory Match Game Page
 * Main container for the Memory Match game
 */

import React, { useEffect } from 'react';
import { useMemoryMatch } from '../../../hooks/useMemoryMatch';
import GameLayout from '../../shared/GameLayout';
import GameBoard from './GameBoard';
import type { Difficulty, Theme } from './types';
import { difficultySettings, themeNames } from './themes';
import { formatTime, celebrateWin } from '../../../utils/gameUtils';

interface MemoryMatchPageProps {
  onNavigateHome: () => void;
}

const MemoryMatchPage: React.FC<MemoryMatchPageProps> = ({ onNavigateHome }) => {
  const { gameState, handleCardClick, resetGame, setDifficulty, setTheme } = useMemoryMatch();

  const {
    moves,
    timer,
    bestTime,
    gameStatus,
    difficulty,
    theme,
    matchedPairs
  } = gameState;

  const totalPairs = difficultySettings[difficulty].pairs;
  const progress = (matchedPairs.size / totalPairs) * 100;

  // Celebrate on win
  useEffect(() => {
    if (gameStatus === 'completed') {
      celebrateWin();
    }
  }, [gameStatus]);

  const handleDifficultyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (gameStatus !== 'playing') {
      setDifficulty(e.target.value as Difficulty);
    }
  };

  const handleThemeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (gameStatus !== 'playing') {
      setTheme(e.target.value as Theme);
    }
  };

  const getStatusMessage = (): string => {
    switch (gameStatus) {
      case 'ready':
        return '🎯 Click any card to start!';
      case 'playing':
        return '🧠 Find all the matching pairs!';
      case 'completed':
        return '🎉 You won! Congratulations!';
      default:
        return '';
    }
  };

  const getStatusColor = (): string => {
    switch (gameStatus) {
      case 'ready':
        return 'text-blue-600';
      case 'playing':
        return 'text-purple-600';
      case 'completed':
        return 'text-green-600';
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

      {/* Theme Selector - Compact on mobile */}
      <select
        value={theme}
        onChange={handleThemeChange}
        disabled={gameStatus === 'playing'}
        className="kid-input text-xs md:text-sm px-2 md:px-3 py-1 md:py-2"
        title="Card Theme"
      >
        {Object.entries(themeNames).map(([key, name]) => (
          <option key={key} value={key}>
            {name}
          </option>
        ))}
      </select>

      {/* New Game Button - Compact on mobile */}
      <button
        className="kid-button text-xs md:text-sm bg-blue-500 hover:bg-blue-600 px-2 md:px-4 py-1 md:py-2"
        onClick={resetGame}
      >
        <span className="md:hidden">🔄</span>
        <span className="hidden md:inline">🔄 New Game</span>
      </button>
    </>
  );

  return (
    <GameLayout
      title="Memory Match"
      emoji="🃏"
      onNavigateHome={onNavigateHome}
      headerActions={headerActions}
      bgColorClass="bg-gradient-to-b from-pink-100 to-purple-100"
    >
      {/* Stats Panel - Compact on mobile */}
      <div className="kid-card max-w-4xl mx-auto mb-2 md:mb-4 p-2 md:p-4">
        <div className="grid grid-cols-3 gap-2 md:gap-4">
          {/* Moves */}
          <div className="text-center">
            <p className="text-xs md:text-sm text-slate-600 font-semibold">Moves</p>
            <p className="text-xl md:text-3xl font-bold text-blue-600">{moves}</p>
          </div>

          {/* Timer */}
          <div className="text-center">
            <p className="text-xs md:text-sm text-slate-600 font-semibold">Time</p>
            <p className="text-xl md:text-3xl font-bold text-purple-600">
              {formatTime(timer)}
            </p>
          </div>

          {/* Best Time */}
          <div className="text-center">
            <p className="text-xs md:text-sm text-slate-600 font-semibold">Best</p>
            <p className="text-xl md:text-3xl font-bold text-yellow-600">
              {bestTime > 0 ? formatTime(bestTime) : '--:--'}
            </p>
          </div>
        </div>

        {/* Progress Bar - Smaller on mobile */}
        <div className="mt-2 md:mt-4">
          <div className="flex justify-between text-xs md:text-sm text-slate-600 mb-1">
            <span>Progress</span>
            <span>{matchedPairs.size} / {totalPairs}</span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-2 md:h-4 overflow-hidden">
            <div
              className="bg-gradient-to-r from-blue-500 to-purple-500 h-full transition-all duration-300 rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Status Message - Smaller on mobile */}
      <div className="text-center mb-2 md:mb-4">
        <p className={`text-sm md:text-lg font-semibold ${getStatusColor()}`}>
          {getStatusMessage()}
        </p>
      </div>

      {/* Game Board */}
      <div className="mb-2 md:mb-6">
        <GameBoard gameState={gameState} onCardClick={handleCardClick} />
      </div>

      {/* Instructions - Hidden on mobile, visible on larger screens */}
      <div className="kid-card max-w-4xl mx-auto hidden md:block">
        <h2 className="text-xl font-bold mb-3 text-center text-purple-800">
          How to Play
        </h2>

        <div className="space-y-3 text-slate-700">
          <div>
            <h3 className="font-semibold text-lg mb-1">🎯 Goal</h3>
            <p>
              Find all matching pairs of cards by remembering where each card is located!
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-1">🎮 How to Play</h3>
            <ul className="list-disc list-inside space-y-1">
              <li>Click on a card to flip it over</li>
              <li>Click on a second card to see if they match</li>
              <li>If they match, they stay face up! ✓</li>
              <li>If they don't match, they flip back</li>
              <li>Try to find all pairs in the fewest moves!</li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-1">⚙️ Settings</h3>
            <ul className="list-disc list-inside space-y-1">
              <li><strong>Easy:</strong> 6 pairs (4x3 grid)</li>
              <li><strong>Medium:</strong> 8 pairs (4x4 grid)</li>
              <li><strong>Hard:</strong> 12 pairs (6x4 grid)</li>
            </ul>
            <p className="mt-2 text-sm italic">
              Choose your favorite theme and challenge level before starting!
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-1">💡 Tips</h3>
            <ul className="list-disc list-inside space-y-1">
              <li>Pay attention to where each card is!</li>
              <li>Try to remember patterns</li>
              <li>The fewer moves, the better your score</li>
              <li>Beat your best time!</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Completion Modal */}
      {gameStatus === 'completed' && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="kid-card max-w-md w-full text-center">
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-3xl font-bold text-green-600 mb-4">
              You Won!
            </h2>

            <div className="mb-6 space-y-3">
              <div>
                <p className="text-lg text-slate-600">Total Moves</p>
                <p className="text-4xl font-bold text-blue-600">{moves}</p>
              </div>

              <div>
                <p className="text-lg text-slate-600">Time</p>
                <p className="text-4xl font-bold text-purple-600">
                  {formatTime(timer)}
                </p>
              </div>

              {timer === bestTime && bestTime > 0 && (
                <div className="bg-yellow-100 border-2 border-yellow-400 rounded-lg p-3">
                  <p className="text-lg text-yellow-800 font-semibold">
                    🏆 New Best Time! 🏆
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

export default MemoryMatchPage;
