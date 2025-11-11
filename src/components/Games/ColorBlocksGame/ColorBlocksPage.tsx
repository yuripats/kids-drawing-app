import React, { useState } from 'react';
import { useColorBlocksGame } from '../../../hooks/useColorBlocksGame';
import ColorBlocksBoard from './ColorBlocksBoard';
import { GameConfig } from './types';

interface ColorBlocksPageProps {
  onNavigateHome: () => void;
}

const ColorBlocksPage: React.FC<ColorBlocksPageProps> = ({ onNavigateHome }) => {
  const [config, setConfig] = useState<GameConfig>({
    gridWidth: 8,
    gridHeight: 10,
    initialColors: 4
  });
  const [showSettings, setShowSettings] = useState(false);
  const [tempConfig, setTempConfig] = useState<GameConfig>(config);

  const { gameState, controls } = useColorBlocksGame(config);

  const handleApplySettings = () => {
    setConfig(tempConfig);
    setShowSettings(false);
    // Reset game will be triggered by config change in useColorBlocksGame
    controls.resetGame();
  };

  return (
    <div className="p-4 min-h-screen bg-gradient-to-b from-purple-100 to-pink-100">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-3xl font-bold text-purple-800">🎨 Color Blocks</h1>
        <button
          className="kid-button text-sm bg-purple-500 hover:bg-purple-600"
          onClick={onNavigateHome}
        >
          ← Home
        </button>
      </div>

      {/* Score Display */}
      <div className="kid-card bg-white mb-4">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-lg font-semibold text-purple-700">Score</p>
            <p className="text-3xl font-bold text-purple-900">{gameState.score}</p>
          </div>
          <div>
            <p className="text-lg font-semibold text-pink-700">High Score</p>
            <p className="text-3xl font-bold text-pink-900">{gameState.highScore}</p>
          </div>
          <div>
            <p className="text-lg font-semibold text-indigo-700">Moves</p>
            <p className="text-3xl font-bold text-indigo-900">{gameState.moves}</p>
          </div>
        </div>
      </div>

      {/* Message Display */}
      <div className="kid-card bg-gradient-to-r from-yellow-100 to-yellow-200 mb-4 text-center">
        <p className="text-xl font-bold text-yellow-900">{gameState.message}</p>
      </div>

      {/* Game Board */}
      <div className="flex justify-center mb-4">
        <ColorBlocksBoard
          gameState={gameState}
          onBlockClick={controls.handleBlockClick}
          onBlockHover={controls.handleBlockHover}
          onMouseLeave={controls.clearSelection}
        />
      </div>

      {/* Controls */}
      <div className="flex justify-center gap-4 mb-4">
        <button
          className="kid-button bg-green-500 hover:bg-green-600 active:bg-green-700"
          onClick={controls.resetGame}
        >
          🔄 New Game
        </button>
        <button
          className="kid-button bg-blue-500 hover:bg-blue-600 active:bg-blue-700"
          onClick={() => {
            setTempConfig(config);
            setShowSettings(!showSettings);
          }}
        >
          ⚙️ Settings
        </button>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <div className="kid-card bg-white mb-4">
          <h2 className="text-2xl font-bold text-blue-800 mb-4">⚙️ Game Settings</h2>

          <div className="space-y-4">
            {/* Grid Width */}
            <div>
              <label className="block text-lg font-semibold text-gray-700 mb-2">
                Grid Width: {tempConfig.gridWidth || 8} blocks
              </label>
              <input
                type="range"
                min="6"
                max="12"
                value={tempConfig.gridWidth || 8}
                onChange={(e) => setTempConfig({ ...tempConfig, gridWidth: parseInt(e.target.value) })}
                className="w-full h-3 bg-blue-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-sm text-gray-600 mt-1">
                <span>Small (6)</span>
                <span>Large (12)</span>
              </div>
            </div>

            {/* Grid Height */}
            <div>
              <label className="block text-lg font-semibold text-gray-700 mb-2">
                Grid Height: {tempConfig.gridHeight || 10} blocks
              </label>
              <input
                type="range"
                min="8"
                max="14"
                value={tempConfig.gridHeight || 10}
                onChange={(e) => setTempConfig({ ...tempConfig, gridHeight: parseInt(e.target.value) })}
                className="w-full h-3 bg-blue-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-sm text-gray-600 mt-1">
                <span>Short (8)</span>
                <span>Tall (14)</span>
              </div>
            </div>

            {/* Number of Colors */}
            <div>
              <label className="block text-lg font-semibold text-gray-700 mb-2">
                Number of Colors: {tempConfig.initialColors || 4}
              </label>
              <input
                type="range"
                min="3"
                max="6"
                value={tempConfig.initialColors || 4}
                onChange={(e) => setTempConfig({ ...tempConfig, initialColors: parseInt(e.target.value) })}
                className="w-full h-3 bg-blue-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-sm text-gray-600 mt-1">
                <span>Easy (3)</span>
                <span>Hard (6)</span>
              </div>
            </div>
          </div>

          {/* Apply Button */}
          <div className="flex justify-center gap-4 mt-6">
            <button
              className="kid-button bg-green-500 hover:bg-green-600 active:bg-green-700"
              onClick={handleApplySettings}
            >
              ✅ Apply Settings
            </button>
            <button
              className="kid-button bg-gray-500 hover:bg-gray-600 active:bg-gray-700"
              onClick={() => {
                setTempConfig(config);
                setShowSettings(false);
              }}
            >
              ❌ Cancel
            </button>
          </div>
        </div>
      )}

      {/* Instructions */}
      <div className="kid-card bg-white">
        <h2 className="text-2xl font-bold text-purple-800 mb-3">📖 How to Play</h2>
        <ul className="space-y-2 text-lg text-gray-700">
          <li className="flex items-start">
            <span className="text-2xl mr-2">1️⃣</span>
            <span>Click or tap on a colored block</span>
          </li>
          <li className="flex items-start">
            <span className="text-2xl mr-2">2️⃣</span>
            <span>All connected blocks of the same color will be highlighted</span>
          </li>
          <li className="flex items-start">
            <span className="text-2xl mr-2">3️⃣</span>
            <span>You need at least 2 connected blocks to remove them</span>
          </li>
          <li className="flex items-start">
            <span className="text-2xl mr-2">4️⃣</span>
            <span>Bigger groups = more points! (blocks² × 10)</span>
          </li>
          <li className="flex items-start">
            <span className="text-2xl mr-2">♾️</span>
            <span className="font-semibold">The game never ends - new blocks fill the empty spaces!</span>
          </li>
          <li className="flex items-start">
            <span className="text-2xl mr-2">🎯</span>
            <span className="font-semibold">Goal: Get the highest score possible!</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default ColorBlocksPage;
