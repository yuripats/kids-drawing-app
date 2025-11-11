/**
 * Shape Sorting Game Hook
 */

import { useState, useCallback } from 'react';
import type { ShapeSortingState, ShapeType, Shape } from '../components/Games/ShapeSorting/types';
import { playSound } from '../utils/gameUtils';

const SHAPE_TYPES: ShapeType[] = ['circle', 'square', 'triangle', 'star'];
const COLORS = ['#FF6B9D', '#4ECDC4', '#F7DC6F', '#BB8FCE', '#85C1E2'];

const generateShapes = (count: number): Shape[] => {
  return Array.from({ length: count }, (_, i) => ({
    id: `shape-${i}-${Date.now()}`,
    type: SHAPE_TYPES[Math.floor(Math.random() * SHAPE_TYPES.length)],
    color: COLORS[Math.floor(Math.random() * COLORS.length)]
  }));
};

export const useShapeSorting = () => {
  const [gameState, setGameState] = useState<ShapeSortingState>({
    currentShapes: generateShapes(6),
    targetShape: SHAPE_TYPES[Math.floor(Math.random() * SHAPE_TYPES.length)],
    score: 0,
    round: 1,
    correctSorts: 0
  });

  const sortShape = useCallback((shape: Shape) => {
    const isCorrect = shape.type === gameState.targetShape;

    if (isCorrect) {
      playSound('collect');
      setGameState(prev => {
        const newShapes = prev.currentShapes.filter(s => s.id !== shape.id);

        // Check if round complete
        const allSorted = !newShapes.some(s => s.type === prev.targetShape);

        if (allSorted) {
          return {
            currentShapes: generateShapes(6),
            targetShape: SHAPE_TYPES[Math.floor(Math.random() * SHAPE_TYPES.length)],
            score: prev.score + 50,
            round: prev.round + 1,
            correctSorts: prev.correctSorts + 1
          };
        }

        return {
          ...prev,
          currentShapes: newShapes,
          score: prev.score + 10,
          correctSorts: prev.correctSorts + 1
        };
      });
    } else {
      playSound('mismatch');
    }
  }, [gameState.targetShape]);

  const resetGame = useCallback(() => {
    setGameState({
      currentShapes: generateShapes(6),
      targetShape: SHAPE_TYPES[Math.floor(Math.random() * SHAPE_TYPES.length)],
      score: 0,
      round: 1,
      correctSorts: 0
    });
  }, []);

  return {
    gameState,
    sortShape,
    resetGame
  };
};
