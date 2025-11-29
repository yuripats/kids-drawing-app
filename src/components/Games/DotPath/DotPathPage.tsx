/**
 * Dot Path Game Page
 * Mobile-first puzzle game where players connect dots to fill the grid
 */

import React, { useEffect } from 'react';
import { useDotPath } from '../../../hooks/useDotPath';
import DotGrid from './DotGrid';
import type { Difficulty } from './types';
import { formatTime } from './utils';

interface DotPathPageProps {
  onNavigateHome: () => void;
}

const DotPathPage: React.FC<DotPathPageProps> = ({ onNavigateHome }) => {
  const {
    gameState,
    handleDotClick,
    undoMove,
    newPuzzle,
    setDifficulty,
    difficultySettings,
  } = useDotPath();

  const {
    path,
    gridSize,
    difficulty,
    moves,
    timer,
    bestTimes,
    gameStatus,
    showNumbers,
  } = gameState;

  const totalDots = gridSize * gridSize;
  const progress = (path.length / totalDots) * 100;

  // Celebrate on win with confetti
  useEffect(() => {
    if (gameStatus === 'completed') {
      // Simple celebration - could add confetti library later
      if ('vibrate' in navigator) {
        navigator.vibrate([100, 50, 100, 50, 200]);
      }
    }
  }, [gameStatus]);

  const handleDifficultyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setDifficulty(e.target.value as Difficulty);
  };

  const getStatusMessage = (): string => {
    switch (gameStatus) {
      case 'ready':
        return showNumbers
          ? '▶ Start at dot 1!'
          : '▶ Tap the green dot to start!';
      case 'playing':
        return `Connect all ${totalDots} dots!`;
      case 'completed':
        return '🎉 Perfect! You did it!';
      default:
        return '';
    }
  };

  return (
    <div className="h-screen w-screen flex flex-col bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 overflow-hidden">
      {/* Compact Header - Mobile First */}
      <div className="flex-shrink-0 bg-white/90 backdrop-blur-sm shadow-md">
        <div className="flex items-center justify-between px-2 py-2 md:px-4 md:py-3">
          {/* Left: Home & Title */}
          <div className="flex items-center gap-2">
            <button
              className="text-2xl md:text-3xl hover:scale-110 active:scale-95 transition-transform"
              onClick={onNavigateHome}
              aria-label="Go home"
            >
              🏠
            </button>
            <h1 className="text-lg md:text-2xl font-bold text-purple-600">
              🎯 Dot Path
            </h1>
          </div>

          {/* Right: Controls */}
          <div className="flex items-center gap-1 md:gap-2">
            <select
              value={difficulty}
              onChange={handleDifficultyChange}
              className="text-xs md:text-sm px-2 py-1 md:px-3 md:py-2 rounded-lg border-2 border-purple-300 bg-white font-semibold text-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-400"
            >
              {Object.entries(difficultySettings).map(([key, settings]) => (
                <option key={key} value={key}>
                  {settings.name}
                </option>
              ))}
            </select>
            <button
              className="text-xl md:text-2xl px-2 py-1 md:px-3 md:py-2 bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white rounded-lg font-bold transition-colors"
              onClick={newPuzzle}
              title="New Puzzle"
            >
              🔄
            </button>
          </div>
        </div>

        {/* Stats Bar - Compact */}
        <div className="px-2 pb-2 md:px-4 md:pb-3">
          <div className="flex items-center justify-around text-center text-xs md:text-sm">
            <div>
              <div className="text-gray-600 font-semibold">Dots</div>
              <div className="text-lg md:text-xl font-bold text-blue-600">
                {path.length}/{totalDots}
              </div>
            </div>
            <div>
              <div className="text-gray-600 font-semibold">Moves</div>
              <div className="text-lg md:text-xl font-bold text-purple-600">
                {moves}
              </div>
            </div>
            <div>
              <div className="text-gray-600 font-semibold">Time</div>
              <div className="text-lg md:text-xl font-bold text-green-600">
                {formatTime(timer)}
              </div>
            </div>
            {bestTimes[difficulty] > 0 && (
              <div>
                <div className="text-gray-600 font-semibold">Best</div>
                <div className="text-lg md:text-xl font-bold text-yellow-600">
                  {formatTime(bestTimes[difficulty])}
                </div>
              </div>
            )}
          </div>

          {/* Progress Bar */}
          <div className="mt-2">
            <div className="w-full bg-gray-200 rounded-full h-2 md:h-3 overflow-hidden">
              <div
                className="bg-gradient-to-r from-green-400 via-blue-500 to-purple-500 h-full transition-all duration-300 rounded-full"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Status Message */}
      <div className="flex-shrink-0 text-center py-2 md:py-3 bg-white/50">
        <p className="text-sm md:text-lg font-bold text-purple-700">
          {getStatusMessage()}
        </p>
      </div>

      {/* Game Board - Takes remaining space */}
      <div className="flex-1 flex items-center justify-center overflow-hidden p-2">
        <div className="w-full h-full max-w-2xl max-h-2xl">
          <DotGrid gameState={gameState} onDotClick={handleDotClick} />
        </div>
      </div>

      {/* Bottom Controls - Minimal */}
      <div className="flex-shrink-0 bg-white/90 backdrop-blur-sm border-t-2 border-purple-200">
        <div className="flex justify-center gap-2 md:gap-4 px-4 py-3">
          <button
            className="flex-1 max-w-xs px-4 py-2 md:py-3 bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-white rounded-lg font-bold text-sm md:text-base transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={undoMove}
            disabled={path.length === 0}
          >
            ↩️ Undo
          </button>
          <button
            className="flex-1 max-w-xs px-4 py-2 md:py-3 bg-red-500 hover:bg-red-600 active:bg-red-700 text-white rounded-lg font-bold text-sm md:text-base transition-colors"
            onClick={newPuzzle}
          >
            🔄 Reset
          </button>
        </div>
      </div>

      {/* Victory Modal */}
      {gameStatus === 'completed' && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6 text-center transform animate-bounce-in">
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-3xl md:text-4xl font-bold text-green-600 mb-4">
              You Won!
            </h2>

            <div className="mb-6 space-y-3">
              <div>
                <p className="text-lg text-gray-600">Moves</p>
                <p className="text-4xl font-bold text-blue-600">{moves}</p>
              </div>

              <div>
                <p className="text-lg text-gray-600">Time</p>
                <p className="text-4xl font-bold text-purple-600">
                  {formatTime(timer)}
                </p>
              </div>

              {timer === bestTimes[difficulty] && bestTimes[difficulty] > 0 && (
                <div className="bg-yellow-100 border-2 border-yellow-400 rounded-lg p-3">
                  <p className="text-lg text-yellow-800 font-semibold">
                    🏆 New Best Time! 🏆
                  </p>
                </div>
              )}
            </div>

            <div className="flex gap-3 justify-center">
              <button
                className="px-6 py-3 bg-purple-500 hover:bg-purple-600 active:bg-purple-700 text-white rounded-xl font-bold text-lg transition-colors"
                onClick={newPuzzle}
              >
                🎮 Play Again
              </button>
              <button
                className="px-6 py-3 bg-gray-500 hover:bg-gray-600 active:bg-gray-700 text-white rounded-xl font-bold text-lg transition-colors"
                onClick={onNavigateHome}
              >
                🏠 Home
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DotPathPage;
