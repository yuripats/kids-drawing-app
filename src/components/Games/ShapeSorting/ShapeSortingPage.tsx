/**
 * Shape Sorting Game Page
 * Educational shape recognition for early learners
 */

import React from 'react';
import { useShapeSorting } from '../../../hooks/useShapeSorting';
import GameLayout from '../../shared/GameLayout';
import type { ShapeType } from './types';

interface ShapeSortingPageProps {
  onNavigateHome: () => void;
}

const ShapeSortingPage: React.FC<ShapeSortingPageProps> = ({ onNavigateHome }) => {
  const { gameState, sortShape, resetGame } = useShapeSorting();

  const { currentShapes, targetShape, score, round, correctSorts } = gameState;

  const getShapeDisplay = (type: ShapeType) => {
    switch (type) {
      case 'circle': return '⚫';
      case 'square': return '⬛';
      case 'triangle': return '🔺';
      case 'star': return '⭐';
    }
  };

  const getShapeName = (type: ShapeType) => {
    return type.charAt(0).toUpperCase() + type.slice(1);
  };

  const headerActions = (
    <button
      onClick={resetGame}
      className="kid-button text-xs md:text-sm bg-blue-500 hover:bg-blue-600 px-2 md:px-4 py-1 md:py-2"
    >
      <span className="md:hidden">🔄</span>
      <span className="hidden md:inline">🔄 Reset</span>
    </button>
  );

  return (
    <GameLayout
      title="Shape Sorting"
      emoji="🎪"
      onNavigateHome={onNavigateHome}
      headerActions={headerActions}
      bgColorClass="bg-gradient-to-b from-orange-100 to-red-100"
    >
      {/* Stats */}
      <div className="kid-card max-w-4xl mx-auto mb-4 p-4">
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <p className="text-sm text-slate-600 font-semibold">Score</p>
            <p className="text-3xl font-bold text-orange-600">{score}</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-slate-600 font-semibold">Round</p>
            <p className="text-3xl font-bold text-purple-600">{round}</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-slate-600 font-semibold">Sorted</p>
            <p className="text-3xl font-bold text-green-600">{correctSorts}</p>
          </div>
        </div>
      </div>

      {/* Target Shape */}
      <div className="kid-card max-w-2xl mx-auto mb-4 p-6 text-center">
        <h2 className="text-2xl font-bold text-slate-800 mb-4">Find all the {getShapeName(targetShape)}s!</h2>
        <div className="text-9xl">{getShapeDisplay(targetShape)}</div>
      </div>

      {/* Shapes Grid */}
      <div className="kid-card max-w-2xl mx-auto mb-4 p-6">
        <div className="grid grid-cols-3 gap-4">
          {currentShapes.map(shape => (
            <button
              key={shape.id}
              onClick={() => sortShape(shape)}
              className="aspect-square rounded-lg shadow-lg hover:scale-110 transition-transform flex items-center justify-center text-6xl"
              style={{ backgroundColor: shape.color }}
            >
              {getShapeDisplay(shape.type)}
            </button>
          ))}
        </div>
      </div>

      {/* Instructions - Hidden on mobile */}
      <div className="kid-card max-w-4xl mx-auto hidden md:block">
        <h2 className="text-xl font-bold mb-3 text-center">How to Play</h2>
        <ul className="space-y-2 text-slate-700">
          <li>• Look at the target shape at the top</li>
          <li>• Click all shapes that match the target</li>
          <li>• When you find all matching shapes, you win the round!</li>
          <li>• Perfect for learning shape names</li>
        </ul>
      </div>
    </GameLayout>
  );
};

export default ShapeSortingPage;
