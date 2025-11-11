/**
 * Snake Game Page
 * Main container for the Snake game
 */

import React from 'react';
import { useSnakeGame } from '../../../hooks/useSnakeGame';
import { SnakeBoard } from './SnakeBoard';
import { SnakeControls } from './SnakeControls';
import type { Difficulty, GridSize } from './types';

interface SnakePageProps {
  onNavigateHome: () => void;
}

const SnakePage: React.FC<SnakePageProps> = ({ onNavigateHome }) => {
  const { gameState, config, controls } = useSnakeGame();

  const handleDifficultyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    controls.setDifficulty(e.target.value as Difficulty);
  };

  const handleGridSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    controls.setGridSize(e.target.value as GridSize);
  };

  const getStatusMessage = (): string => {
    switch (gameState.gameStatus) {
      case 'ready':
        return 'Press any arrow key or tap a direction to start!';
      case 'playing':
        return 'Playing...';
      case 'paused':
        return 'Paused - Press Space or Pause button to resume';
      case 'gameOver':
        return 'Game Over! Press R or Play Again to restart';
      default:
        return '';
    }
  };

  const getStatusColor = (): string => {
    switch (gameState.gameStatus) {
      case 'ready':
        return 'text-blue-600';
      case 'playing':
        return 'text-green-600';
      case 'paused':
        return 'text-yellow-600';
      case 'gameOver':
        return 'text-red-600';
      default:
        return 'text-slate-600';
    }
  };

  return (
    <div className="p-2 md:p-4 min-h-screen bg-gradient-to-b from-emerald-100 to-emerald-200">
      {/* Header - Mobile First */}
      <div className="flex items-center justify-between mb-2 md:mb-4 gap-2">
        <h1 className="text-xl md:text-3xl font-bold text-emerald-800 flex items-center gap-1 md:gap-2">
          <span className="text-2xl md:text-3xl">🐍</span>
          <span className="hidden sm:inline">Snake Game</span>
        </h1>

        <div className="flex gap-1 md:gap-2 flex-wrap items-center justify-end">
          {/* Speed Selector - Compact on mobile */}
          <select
            value={gameState.difficulty}
            onChange={handleDifficultyChange}
            disabled={gameState.gameStatus === 'playing'}
            className="kid-input text-xs md:text-sm px-2 md:px-3 py-1 md:py-2"
            title="Game Speed"
          >
            <option value="easy">🐌 Slow</option>
            <option value="medium">🏃 Med</option>
            <option value="hard">⚡ Fast</option>
          </select>

          {/* Grid Size Selector - Compact on mobile */}
          <select
            value={gameState.gridSize}
            onChange={handleGridSizeChange}
            disabled={gameState.gameStatus === 'playing'}
            className="kid-input text-xs md:text-sm px-2 md:px-3 py-1 md:py-2"
            title="Grid Size"
          >
            <option value="small">📐 15×15</option>
            <option value="medium">📏 20×20</option>
            <option value="large">📊 25×25</option>
            <option value="xlarge">🗺️ 30×30</option>
          </select>

          {/* Pause/Resume Button - Compact on mobile */}
          {(gameState.gameStatus === 'playing' || gameState.gameStatus === 'paused') && (
            <button
              className="kid-button text-xs md:text-sm bg-yellow-500 hover:bg-yellow-600 px-2 md:px-4 py-1 md:py-2"
              onClick={controls.togglePause}
            >
              {gameState.gameStatus === 'paused' ? '▶️' : '⏸️'}
              <span className="hidden md:inline ml-1">{gameState.gameStatus === 'paused' ? 'Resume' : 'Pause'}</span>
            </button>
          )}

          {/* Reset Button - Compact on mobile */}
          {gameState.gameStatus !== 'ready' && (
            <button
              className="kid-button text-xs md:text-sm bg-blue-500 hover:bg-blue-600 px-2 md:px-4 py-1 md:py-2"
              onClick={controls.resetGame}
            >
              🔄<span className="hidden md:inline ml-1">Play Again</span>
            </button>
          )}

          {/* Home Button - Compact on mobile */}
          <button
            className="kid-button text-xs md:text-sm bg-slate-500 hover:bg-slate-600 px-2 md:px-4 py-1 md:py-2"
            onClick={onNavigateHome}
            title="Home"
          >
            <span className="md:hidden">←</span>
            <span className="hidden md:inline">← Home</span>
          </button>
        </div>
      </div>

      {/* Score Display - Compact on mobile */}
      <div className="kid-card max-w-4xl mx-auto mb-2 md:mb-4 p-2 md:p-4">
        <div className="grid grid-cols-3 gap-2 md:gap-4">
          <div className="text-center">
            <p className="text-xs md:text-sm text-slate-600 font-semibold">Score</p>
            <p className="text-xl md:text-3xl font-bold text-lime-600">{gameState.score}</p>
          </div>
          <div className="text-center">
            <p className="text-xs md:text-sm text-slate-600 font-semibold">High</p>
            <p className="text-xl md:text-3xl font-bold text-yellow-600">{gameState.highScore}</p>
          </div>
          <div className="text-center">
            <p className="text-xs md:text-sm text-slate-600 font-semibold">Length</p>
            <p className="text-xl md:text-3xl font-bold text-blue-600">{gameState.snake.length}</p>
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
      <div className="mb-2 md:mb-4">
        <SnakeBoard gameState={gameState} config={config} />
      </div>

      {/* Mobile Controls */}
      <div className="md:hidden mb-2">
        <SnakeControls
          onDirectionChange={controls.changeDirection}
          disabled={gameState.gameStatus === 'gameOver' || gameState.gameStatus === 'paused'}
        />
      </div>

      {/* Instructions - Hidden on mobile */}
      <div className="kid-card max-w-4xl mx-auto hidden md:block">
        <h2 className="text-xl font-bold mb-3 text-center text-emerald-800">
          How to Play
        </h2>

        <div className="space-y-3">
          <div>
            <h3 className="font-semibold text-lg mb-1">🎯 Goal</h3>
            <p className="text-slate-700">
              Eat the apples 🍎 to grow your snake and score points. Don't hit the walls or yourself!
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-1">⌨️ Keyboard Controls</h3>
            <ul className="text-slate-700 space-y-1">
              <li><strong>Arrow Keys</strong> or <strong>WASD</strong> - Move snake</li>
              <li><strong>Space</strong> - Pause/Resume</li>
              <li><strong>R</strong> - Restart (when game over)</li>
            </ul>
          </div>

          <div className="md:hidden">
            <h3 className="font-semibold text-lg mb-1">📱 Touch Controls</h3>
            <p className="text-slate-700">
              Tap the arrow buttons above to change direction
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-1">📊 Scoring</h3>
            <p className="text-slate-700">
              Each apple gives you <strong>+10 points</strong> and makes your snake longer!
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-1">⚙️ Game Settings</h3>
            <div className="text-slate-700 space-y-2">
              <div>
                <strong>Speed:</strong>
                <ul className="ml-4 mt-1 space-y-1">
                  <li>🐌 <strong>Slow</strong> - Relaxed pace (200ms)</li>
                  <li>🏃 <strong>Medium</strong> - Moderate speed (150ms)</li>
                  <li>⚡ <strong>Fast</strong> - Quick reflexes needed! (100ms)</li>
                </ul>
              </div>
              <div>
                <strong>Grid Size:</strong>
                <ul className="ml-4 mt-1 space-y-1">
                  <li>📐 <strong>Small</strong> - Cozy 15×15 grid</li>
                  <li>📏 <strong>Medium</strong> - Standard 20×20 grid</li>
                  <li>📊 <strong>Large</strong> - Spacious 25×25 grid</li>
                  <li>🗺️ <strong>X-Large</strong> - Huge 30×30 grid!</li>
                </ul>
              </div>
              <p className="text-sm italic">Mix and match speed and grid size for your perfect challenge!</p>
            </div>
          </div>
        </div>
      </div>

      {/* Game Over Modal Overlay */}
      {gameState.gameStatus === 'gameOver' && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="kid-card max-w-md w-full text-center">
            <h2 className="text-3xl font-bold text-red-600 mb-4">Game Over!</h2>

            <div className="mb-6">
              <p className="text-xl mb-2">Final Score</p>
              <p className="text-5xl font-bold text-lime-600 mb-4">{gameState.score}</p>

              {gameState.score === gameState.highScore && gameState.score > 0 && (
                <p className="text-lg text-yellow-600 font-semibold">
                  🎉 New High Score! 🎉
                </p>
              )}
            </div>

            <div className="flex gap-3 justify-center">
              <button
                className="kid-button bg-lime-500 hover:bg-lime-600 text-lg"
                onClick={controls.resetGame}
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
    </div>
  );
};

export default SnakePage;
