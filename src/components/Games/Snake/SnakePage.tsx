/**
 * Snake Game Page
 * Main container for the Snake game - Mobile First
 */

import React, { useState } from 'react';
import { useSnakeGame } from '../../../hooks/useSnakeGame';
import { SnakeBoard } from './SnakeBoard';
import { SnakeControls } from './SnakeControls';
import type { Difficulty, GridSize } from './types';

interface SnakePageProps {
  onNavigateHome: () => void;
}

const SnakePage: React.FC<SnakePageProps> = ({ onNavigateHome }) => {
  const { gameState, config, controls } = useSnakeGame();
  const [showSettings, setShowSettings] = useState(false);

  const handleDifficultyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    controls.setDifficulty(e.target.value as Difficulty);
  };

  const handleGridSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    controls.setGridSize(e.target.value as GridSize);
  };

  const getStatusMessage = (): string => {
    switch (gameState.gameStatus) {
      case 'ready':
        return 'Tap a direction to start!';
      case 'playing':
        return 'Playing...';
      case 'paused':
        return 'Paused';
      case 'gameOver':
        return 'Game Over!';
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
    <div className="min-h-screen bg-gradient-to-b from-emerald-100 to-emerald-200 pb-4">
      {/* Compact Header - Mobile First */}
      <div className="sticky top-0 z-10 bg-emerald-500 shadow-md px-3 py-2 flex items-center justify-between">
        <h1 className="text-xl font-bold text-white">🐍 Snake</h1>
        <div className="flex gap-2">
          {(gameState.gameStatus === 'playing' || gameState.gameStatus === 'paused') && (
            <button
              className="px-3 py-1 bg-yellow-500 text-white rounded-lg font-semibold text-sm hover:bg-yellow-600"
              onClick={controls.togglePause}
            >
              {gameState.gameStatus === 'paused' ? '▶️' : '⏸️'}
            </button>
          )}
          <button
            className="px-3 py-1 bg-white text-emerald-700 rounded-lg font-semibold text-sm hover:bg-emerald-50"
            onClick={onNavigateHome}
          >
            ← Home
          </button>
        </div>
      </div>

      {/* Score Display - Compact */}
      <div className="px-3 py-2 bg-white shadow-sm border-b border-gray-200">
        <div className="flex justify-around items-center text-center">
          <div>
            <p className="text-xs font-semibold text-slate-600">Score</p>
            <p className="text-xl font-bold text-lime-600">{gameState.score}</p>
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-600">High Score</p>
            <p className="text-xl font-bold text-yellow-600">{gameState.highScore}</p>
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-600">Length</p>
            <p className="text-xl font-bold text-blue-600">{gameState.snake.length}</p>
          </div>
        </div>
      </div>

      {/* Status Message - Compact */}
      <div className="px-3 py-2 bg-emerald-50 border-b border-emerald-200">
        <p className={`text-sm font-semibold ${getStatusColor()} text-center`}>
          {getStatusMessage()}
        </p>
      </div>

      {/* Game Board - Centered */}
      <div className="py-4">
        <SnakeBoard gameState={gameState} config={config} />
      </div>

      {/* Mobile Controls */}
      <div className="px-3 mb-3">
        <SnakeControls
          onDirectionChange={controls.changeDirection}
          disabled={gameState.gameStatus === 'gameOver' || gameState.gameStatus === 'paused'}
        />
      </div>

      {/* Compact Controls */}
      <div className="px-3 pb-3">
        <div className="flex gap-2 justify-center">
          {gameState.gameStatus !== 'ready' && (
            <button
              className="flex-1 max-w-[150px] py-2 px-4 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-lg shadow-md"
              onClick={controls.resetGame}
            >
              🔄 Again
            </button>
          )}
          <button
            className="flex-1 max-w-[150px] py-2 px-4 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-lg shadow-md"
            onClick={() => setShowSettings(!showSettings)}
          >
            ⚙️ Settings
          </button>
        </div>
      </div>

      {/* Settings Panel - Compact */}
      {showSettings && (
        <div className="mx-3 mb-4 bg-white rounded-lg shadow-md p-4">
          <h2 className="text-xl font-bold text-emerald-800 mb-3">⚙️ Settings</h2>

          <div className="space-y-3">
            {/* Speed Selector */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Speed</label>
              <select
                value={gameState.difficulty}
                onChange={handleDifficultyChange}
                disabled={gameState.gameStatus === 'playing'}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              >
                <option value="easy">🐌 Slow</option>
                <option value="medium">🏃 Medium</option>
                <option value="hard">⚡ Fast</option>
              </select>
            </div>

            {/* Grid Size Selector */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Grid Size</label>
              <select
                value={gameState.gridSize}
                onChange={handleGridSizeChange}
                disabled={gameState.gameStatus === 'playing'}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              >
                <option value="small">📐 Small (15×15)</option>
                <option value="medium">📏 Medium (20×20)</option>
                <option value="large">📊 Large (25×25)</option>
                <option value="xlarge">🗺️ X-Large (30×30)</option>
              </select>
            </div>
          </div>

          <button
            className="w-full mt-4 py-2 bg-gray-500 hover:bg-gray-600 text-white font-bold rounded-lg"
            onClick={() => setShowSettings(false)}
          >
            ✅ Done
          </button>
        </div>
      )}

      {/* Instructions - Collapsible */}
      <div className="mx-3 mb-4">
        <details className="bg-white rounded-lg shadow-md">
          <summary className="p-3 font-bold text-emerald-800 cursor-pointer hover:bg-emerald-50 rounded-lg">
            📖 How to Play
          </summary>
          <div className="p-3 pt-0">
            <div className="space-y-2 text-sm text-gray-700">
              <div>
                <p className="font-semibold">🎯 Goal</p>
                <p>Eat apples 🍎 to grow. Don't hit walls or yourself!</p>
              </div>
              <div>
                <p className="font-semibold">⌨️ Controls</p>
                <p>Arrow Keys / WASD / Touch buttons</p>
              </div>
              <div>
                <p className="font-semibold">💡 Tips</p>
                <p>Plan ahead! Your snake gets longer and faster.</p>
              </div>
            </div>
          </div>
        </details>
      </div>
    </div>
  );
};

export default SnakePage;
