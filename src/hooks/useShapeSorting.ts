/**
 * Shape Sorting Game Hook
 */

import { useState, useCallback, useEffect } from 'react';
import type { ShapeSortingState, ShapeType, Shape, FieldSize, ShapeSortingSettings } from '../components/Games/ShapeSorting/types';
import { playSound } from '../utils/gameUtils';

const SHAPE_TYPES: ShapeType[] = ['circle', 'square', 'triangle', 'star'];
const COLORS = ['#FF6B9D', '#4ECDC4', '#F7DC6F', '#BB8FCE', '#85C1E2', '#52C41A', '#FA8C16', '#EB2F96', '#13C2C2'];
const STORAGE_KEY = 'shapeSortingSettings';

const loadSettings = (): ShapeSortingSettings => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (error) {
    console.error('Failed to load shape sorting settings:', error);
  }
  return { fieldSize: 12 }; // Default to 12 shapes for more fun
};

const saveSettings = (settings: ShapeSortingSettings) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  } catch (error) {
    console.error('Failed to save shape sorting settings:', error);
  }
};

const generateShapes = (count: number): Shape[] => {
  return Array.from({ length: count }, (_, i) => ({
    id: `shape-${i}-${Date.now()}-${Math.random()}`,
    type: SHAPE_TYPES[Math.floor(Math.random() * SHAPE_TYPES.length)],
    color: COLORS[Math.floor(Math.random() * COLORS.length)]
  }));
};

export const useShapeSorting = () => {
  const [gameState, setGameState] = useState<ShapeSortingState>(() => {
    const settings = loadSettings();
    return {
      currentShapes: generateShapes(settings.fieldSize),
      targetShape: SHAPE_TYPES[Math.floor(Math.random() * SHAPE_TYPES.length)],
      score: 0,
      round: 1,
      correctSorts: 0,
      settings
    };
  });

  // Save settings whenever they change
  useEffect(() => {
    saveSettings(gameState.settings);
  }, [gameState.settings]);

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
            ...prev,
            currentShapes: generateShapes(prev.settings.fieldSize),
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

  const setFieldSize = useCallback((fieldSize: FieldSize) => {
    setGameState(prev => ({
      currentShapes: generateShapes(fieldSize),
      targetShape: SHAPE_TYPES[Math.floor(Math.random() * SHAPE_TYPES.length)],
      score: 0,
      round: 1,
      correctSorts: 0,
      settings: { ...prev.settings, fieldSize }
    }));
  }, []);

  const resetGame = useCallback(() => {
    setGameState(prev => ({
      currentShapes: generateShapes(prev.settings.fieldSize),
      targetShape: SHAPE_TYPES[Math.floor(Math.random() * SHAPE_TYPES.length)],
      score: 0,
      round: 1,
      correctSorts: 0,
      settings: prev.settings
    }));
  }, []);

  return {
    gameState,
    sortShape,
    setFieldSize,
    resetGame
  };
};
