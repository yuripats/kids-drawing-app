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
    <div className="min-h-screen bg-gradient-to-b from-purple-100 to-pink-100 pb-4">
      {/* Compact Header - Mobile First */}
      <div className="sticky top-0 z-10 bg-purple-500 shadow-md px-3 py-2 flex items-center justify-between">
        <h1 className="text-xl font-bold text-white">🎨 Color Blocks</h1>
        <button
          className="px-3 py-1 bg-white text-purple-700 rounded-lg font-semibold text-sm hover:bg-purple-50 active:bg-purple-100"
          onClick={onNavigateHome}
        >
          ← Home
        </button>
      </div>

      {/* Score Display - Compact */}
      <div className="px-3 py-2 bg-white shadow-sm border-b border-gray-200">
        <div className="flex justify-around items-center text-center">
          <div>
            <p className="text-xs font-semibold text-purple-700">Score</p>
            <p className="text-xl font-bold text-purple-900">{gameState.score}</p>
          </div>
          <div>
            <p className="text-xs font-semibold text-pink-700">High Score</p>
            <p className="text-xl font-bold text-pink-900">{gameState.highScore}</p>
          </div>
          <div>
            <p className="text-xs font-semibold text-indigo-700">Moves</p>
            <p className="text-xl font-bold text-indigo-900">{gameState.moves}</p>
          </div>
        </div>
      </div>

      {/* Message Display - Compact */}
      <div className="px-3 py-2 bg-yellow-100 border-b border-yellow-200">
        <p className="text-sm font-semibold text-yellow-900 text-center">{gameState.message}</p>
      </div>

      {/* Game Board - Centered and Prominent */}
      <div className="flex justify-center py-4 px-2">
        <ColorBlocksBoard
          gameState={gameState}
          onBlockClick={controls.handleBlockClick}
          onBlockHover={controls.handleBlockHover}
          onMouseLeave={controls.clearSelection}
        />
      </div>

      {/* Compact Controls */}
      <div className="px-3 pb-3">
        <div className="flex gap-2 justify-center">
          <button
            className="flex-1 max-w-[200px] py-2 px-4 bg-green-500 hover:bg-green-600 active:bg-green-700 text-white font-bold rounded-lg shadow-md"
            onClick={controls.resetGame}
          >
            🔄 New Game
          </button>
          <button
            className="flex-1 max-w-[200px] py-2 px-4 bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white font-bold rounded-lg shadow-md"
            onClick={() => {
              setTempConfig(config);
              setShowSettings(!showSettings);
            }}
          >
            ⚙️ Settings
          </button>
        </div>
      </div>

      {/* Settings Panel - Compact */}
      {showSettings && (
        <div className="mx-3 mb-4 bg-white rounded-lg shadow-md p-4">
          <h2 className="text-xl font-bold text-blue-800 mb-3">⚙️ Settings</h2>

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

      {/* Instructions - Collapsible on Mobile */}
      <div className="mx-3 mb-4">
        <details className="bg-white rounded-lg shadow-md">
          <summary className="p-3 font-bold text-purple-800 cursor-pointer hover:bg-purple-50 rounded-lg">
            📖 How to Play
          </summary>
          <div className="p-3 pt-0">
            <ul className="space-y-1 text-sm text-gray-700">
              <li className="flex items-start">
                <span className="text-lg mr-2">1️⃣</span>
                <span>Tap a colored block</span>
              </li>
              <li className="flex items-start">
                <span className="text-lg mr-2">2️⃣</span>
                <span>Connected blocks highlight</span>
              </li>
              <li className="flex items-start">
                <span className="text-lg mr-2">3️⃣</span>
                <span>Need 2+ blocks to remove</span>
              </li>
              <li className="flex items-start">
                <span className="text-lg mr-2">4️⃣</span>
                <span>Bigger groups = more points!</span>
              </li>
              <li className="flex items-start">
                <span className="text-lg mr-2">♾️</span>
                <span className="font-semibold">Endless mode!</span>
              </li>
            </ul>
          </div>
        </details>
      </div>
    </div>
  );
};

export default ColorBlocksPage;
