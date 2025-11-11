/**
 * Shape Sorting Game Page
 * Educational shape recognition for early learners
 */

import React, { useState } from 'react';
import { useShapeSorting } from '../../../hooks/useShapeSorting';
import GameLayout from '../../shared/GameLayout';
import type { ShapeType, FieldSize } from './types';

interface ShapeSortingPageProps {
  onNavigateHome: () => void;
}

const ShapeSortingPage: React.FC<ShapeSortingPageProps> = ({ onNavigateHome }) => {
  const { gameState, sortShape, setFieldSize, resetGame } = useShapeSorting();
  const [showSettings, setShowSettings] = useState(false);

  const { currentShapes, targetShape, score, round, correctSorts, settings } = gameState;

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

  const getGridColumns = (fieldSize: FieldSize) => {
    if (fieldSize <= 6) return 'grid-cols-2 md:grid-cols-3';
    if (fieldSize <= 12) return 'grid-cols-3 md:grid-cols-4';
    if (fieldSize <= 18) return 'grid-cols-4 md:grid-cols-5';
    return 'grid-cols-4 md:grid-cols-6';
  };

  const getShapeSize = (fieldSize: FieldSize) => {
    if (fieldSize <= 6) return 'text-6xl md:text-7xl';
    if (fieldSize <= 12) return 'text-5xl md:text-6xl';
    if (fieldSize <= 18) return 'text-4xl md:text-5xl';
    return 'text-3xl md:text-4xl';
  };

  const fieldSizeOptions: FieldSize[] = [6, 9, 12, 15, 18, 24];

  const headerActions = (
    <div className="flex gap-1 md:gap-2">
      <button
        onClick={() => setShowSettings(!showSettings)}
        className="kid-button text-xs md:text-sm bg-purple-500 hover:bg-purple-600 px-2 md:px-4 py-1 md:py-2"
      >
        <span className="md:hidden">⚙️</span>
        <span className="hidden md:inline">⚙️ Settings</span>
      </button>
      <button
        onClick={resetGame}
        className="kid-button text-xs md:text-sm bg-blue-500 hover:bg-blue-600 px-2 md:px-4 py-1 md:py-2"
      >
        <span className="md:hidden">🔄</span>
        <span className="hidden md:inline">🔄 Reset</span>
      </button>
    </div>
  );

  return (
    <GameLayout
      title="Shape Sorting"
      emoji="🎪"
      onNavigateHome={onNavigateHome}
      headerActions={headerActions}
      bgColorClass="bg-gradient-to-b from-orange-100 to-red-100"
    >
      {/* Settings Panel */}
      {showSettings && (
        <div className="kid-card max-w-2xl mx-auto mb-4 p-4 md:p-6">
          <h3 className="text-lg md:text-xl font-bold mb-4 text-center">⚙️ Settings</h3>

          <div className="mb-4">
            <label className="block text-sm md:text-base font-semibold mb-2 text-slate-700">
              Field Size: <span className="text-orange-600">{settings.fieldSize} shapes</span>
            </label>
            <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
              {fieldSizeOptions.map(size => (
                <button
                  key={size}
                  onClick={() => setFieldSize(size)}
                  className={`px-3 py-2 rounded-lg font-bold transition-colors ${
                    settings.fieldSize === size
                      ? 'bg-orange-500 text-white'
                      : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
            <p className="text-xs md:text-sm text-slate-600 mt-2 text-center">
              {settings.fieldSize <= 6 && '🎯 Easy - Perfect for beginners!'}
              {settings.fieldSize > 6 && settings.fieldSize <= 12 && '🌟 Medium - Good challenge!'}
              {settings.fieldSize > 12 && settings.fieldSize <= 18 && '🔥 Hard - Getting tricky!'}
              {settings.fieldSize > 18 && '💪 Expert - Go wild!'}
            </p>
          </div>
        </div>
      )}

      {/* Compact Header with Stats and Target */}
      <div className="kid-card max-w-4xl mx-auto mb-3 p-3 md:p-4">
        <div className="flex items-center justify-between gap-4">
          {/* Stats - Compact */}
          <div className="flex gap-3 md:gap-4 text-xs md:text-sm">
            <div className="text-center">
              <p className="text-slate-600 font-semibold">Score</p>
              <p className="text-lg md:text-xl font-bold text-orange-600">{score}</p>
            </div>
            <div className="text-center">
              <p className="text-slate-600 font-semibold">Round</p>
              <p className="text-lg md:text-xl font-bold text-purple-600">{round}</p>
            </div>
            <div className="text-center">
              <p className="text-slate-600 font-semibold">Sorted</p>
              <p className="text-lg md:text-xl font-bold text-green-600">{correctSorts}</p>
            </div>
          </div>

          {/* Target Shape - Inline */}
          <div className="text-center">
            <p className="text-sm md:text-base font-bold text-slate-800 mb-1">
              Find {getShapeName(targetShape)}s
            </p>
            <div className="text-5xl md:text-6xl">{getShapeDisplay(targetShape)}</div>
          </div>
        </div>
      </div>

      {/* Shapes Grid - Compact */}
      <div className="kid-card max-w-6xl mx-auto mb-3 p-2 md:p-4">
        <div className={`grid ${getGridColumns(settings.fieldSize)} gap-1.5 md:gap-3`}>
          {currentShapes.map(shape => (
            <button
              key={shape.id}
              onClick={() => sortShape(shape)}
              className={`aspect-square rounded-lg shadow-lg hover:scale-110 active:scale-95 transition-transform flex items-center justify-center ${getShapeSize(settings.fieldSize)}`}
              style={{ backgroundColor: shape.color }}
            >
              {getShapeDisplay(shape.type)}
            </button>
          ))}
        </div>
        {/* Progress Indicator - Inline */}
        <p className="text-xs md:text-sm text-center text-slate-700 mt-2">
          <span className="font-bold text-orange-600">{currentShapes.filter(s => s.type === targetShape).length}</span>
          {' '}more to find!
        </p>
      </div>

      {/* Instructions - Hidden on mobile */}
      <div className="kid-card max-w-4xl mx-auto hidden md:block">
        <h2 className="text-xl font-bold mb-3 text-center">How to Play</h2>
        <ul className="space-y-2 text-slate-700">
          <li>• Look at the target shape at the top</li>
          <li>• Click all shapes that match the target</li>
          <li>• When you find all matching shapes, you win the round!</li>
          <li>• Try different field sizes for more challenge!</li>
          <li>• Perfect for learning shape names and recognition</li>
        </ul>
      </div>
    </GameLayout>
  );
};

export default ShapeSortingPage;
