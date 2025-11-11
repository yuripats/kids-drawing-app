import React from 'react';
import { useColorBlocksGame } from '../../../hooks/useColorBlocksGame';
import ColorBlocksBoard from './ColorBlocksBoard';

interface ColorBlocksPageProps {
  onNavigateHome: () => void;
}

const ColorBlocksPage: React.FC<ColorBlocksPageProps> = ({ onNavigateHome }) => {
  const { gameState, controls } = useColorBlocksGame({
    gridWidth: 8,
    gridHeight: 10,
    initialColors: 4
  });

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
      </div>

      {/* Game Status Messages */}
      {gameState.gameStatus === 'won' && (
        <div className="kid-card bg-gradient-to-r from-green-300 to-emerald-300 text-center animate-bounce">
          <h2 className="text-3xl font-bold text-green-900 mb-2">🎉 You Won! 🎉</h2>
          <p className="text-xl text-green-800">
            Amazing! You cleared the board in {gameState.moves} moves!
          </p>
          <p className="text-2xl font-bold text-green-900 mt-2">
            Final Score: {gameState.score}
          </p>
          <button
            className="kid-button bg-green-600 hover:bg-green-700 mt-4"
            onClick={controls.resetGame}
          >
            🎮 Play Again
          </button>
        </div>
      )}

      {gameState.gameStatus === 'gameOver' && (
        <div className="kid-card bg-gradient-to-r from-orange-300 to-red-300 text-center">
          <h2 className="text-3xl font-bold text-orange-900 mb-2">Game Over!</h2>
          <p className="text-xl text-orange-800">
            No more moves available!
          </p>
          <p className="text-2xl font-bold text-orange-900 mt-2">
            Final Score: {gameState.score}
          </p>
          <p className="text-lg text-orange-800">
            You made {gameState.moves} moves
          </p>
          <button
            className="kid-button bg-orange-600 hover:bg-orange-700 mt-4"
            onClick={controls.resetGame}
          >
            🎮 Try Again
          </button>
        </div>
      )}

      {/* Instructions */}
      {(gameState.gameStatus === 'ready' || gameState.gameStatus === 'playing') && (
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
              <span className="text-2xl mr-2">🎯</span>
              <span className="font-semibold">Goal: Clear the entire board!</span>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default ColorBlocksPage;
