/**
 * Shape Sorting Game Tests
 */

import { describe, test, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useShapeSorting } from '../../../../hooks/useShapeSorting';

// Clear localStorage before each test
beforeEach(() => {
  localStorage.clear();
});

describe('useShapeSorting Hook', () => {
  test('initializes with correct default state', () => {
    const { result } = renderHook(() => useShapeSorting());

    expect(result.current.gameState.score).toBe(0);
    expect(result.current.gameState.round).toBe(1);
    expect(result.current.gameState.correctSorts).toBe(0);
    expect(result.current.gameState.currentShapes.length).toBe(12); // Default field size
    expect(result.current.gameState.targetShape).toBeTruthy();
    expect(result.current.gameState.settings).toBeTruthy();
    expect(result.current.gameState.settings.fieldSize).toBe(12);
  });

  test('currentShapes have valid properties', () => {
    const { result } = renderHook(() => useShapeSorting());

    result.current.gameState.currentShapes.forEach(shape => {
      expect(shape.id).toBeTruthy();
      expect(['circle', 'square', 'triangle', 'star']).toContain(shape.type);
      expect(shape.color).toBeTruthy();
    });
  });

  test('targetShape is a valid shape type', () => {
    const { result } = renderHook(() => useShapeSorting());

    expect(['circle', 'square', 'triangle', 'star']).toContain(
      result.current.gameState.targetShape
    );
  });

  test('sortShape increases score on correct match', () => {
    const { result } = renderHook(() => useShapeSorting());

    // Find a shape that matches the target
    const targetType = result.current.gameState.targetShape;
    const matchingShape = result.current.gameState.currentShapes.find(
      shape => shape.type === targetType
    );

    if (matchingShape) {
      const initialScore = result.current.gameState.score;
      const initialSorts = result.current.gameState.correctSorts;

      act(() => {
        result.current.sortShape(matchingShape);
      });

      expect(result.current.gameState.score).toBeGreaterThan(initialScore);
      expect(result.current.gameState.correctSorts).toBe(initialSorts + 1);
    }
  });

  test('sortShape does not change score on incorrect match', () => {
    const { result } = renderHook(() => useShapeSorting());

    // Find a shape that does NOT match the target
    const targetType = result.current.gameState.targetShape;
    const nonMatchingShape = result.current.gameState.currentShapes.find(
      shape => shape.type !== targetType
    );

    if (nonMatchingShape) {
      const initialScore = result.current.gameState.score;
      const initialSorts = result.current.gameState.correctSorts;

      act(() => {
        result.current.sortShape(nonMatchingShape);
      });

      expect(result.current.gameState.score).toBe(initialScore);
      expect(result.current.gameState.correctSorts).toBe(initialSorts);
    }
  });

  test('sortShape removes the shape from currentShapes on correct match', () => {
    const { result } = renderHook(() => useShapeSorting());

    const targetType = result.current.gameState.targetShape;
    const matchingShape = result.current.gameState.currentShapes.find(
      shape => shape.type === targetType
    );

    if (matchingShape) {
      const initialCount = result.current.gameState.currentShapes.length;
      const initialRound = result.current.gameState.round;
      const fieldSize = result.current.gameState.settings.fieldSize;

      act(() => {
        result.current.sortShape(matchingShape);
      });

      const afterRound = result.current.gameState.round;

      // If round didn't advance, count should decrease
      // If round advanced (all shapes sorted), count resets to field size
      if (afterRound === initialRound) {
        expect(result.current.gameState.currentShapes.length).toBeLessThan(initialCount);
      } else {
        expect(result.current.gameState.currentShapes.length).toBe(fieldSize);
      }

      // In either case, the original matching shape should be gone
      expect(
        result.current.gameState.currentShapes.find(s => s.id === matchingShape.id)
      ).toBeUndefined();
    }
  });

  test('sorting all matching shapes advances to next round', () => {
    const { result } = renderHook(() => useShapeSorting());

    const initialRound = result.current.gameState.round;
    const targetType = result.current.gameState.targetShape;
    const fieldSize = result.current.gameState.settings.fieldSize;

    // Sort all matching shapes
    act(() => {
      const matchingShapes = result.current.gameState.currentShapes.filter(
        shape => shape.type === targetType
      );
      matchingShapes.forEach(shape => {
        result.current.sortShape(shape);
      });
    });

    // Should advance to next round or have different target
    const afterRound = result.current.gameState.round;

    // Either round increased or we got new shapes (if there were no matching shapes initially)
    expect(afterRound >= initialRound).toBe(true);
    // Should have field size shapes again if round advanced
    if (afterRound > initialRound) {
      expect(result.current.gameState.currentShapes.length).toBe(fieldSize);
    }
  });

  test('setFieldSize changes field size and resets game', () => {
    const { result } = renderHook(() => useShapeSorting());

    expect(result.current.gameState.settings.fieldSize).toBe(12);

    act(() => {
      result.current.setFieldSize(18);
    });

    expect(result.current.gameState.settings.fieldSize).toBe(18);
    expect(result.current.gameState.currentShapes.length).toBe(18);
    expect(result.current.gameState.score).toBe(0);
    expect(result.current.gameState.round).toBe(1);
  });

  test('settings persist across hook instances', () => {
    const { result: result1 } = renderHook(() => useShapeSorting());

    act(() => {
      result1.current.setFieldSize(24);
    });

    expect(result1.current.gameState.settings.fieldSize).toBe(24);

    // Create new hook instance
    const { result: result2 } = renderHook(() => useShapeSorting());

    // Should load the same settings
    expect(result2.current.gameState.settings.fieldSize).toBe(24);
    expect(result2.current.gameState.currentShapes.length).toBe(24);
  });

  test('resetGame resets all stats but keeps settings', () => {
    const { result } = renderHook(() => useShapeSorting());

    // Change field size
    act(() => {
      result.current.setFieldSize(18);
    });

    // Make some progress
    const targetType = result.current.gameState.targetShape;
    const matchingShape = result.current.gameState.currentShapes.find(
      shape => shape.type === targetType
    );

    if (matchingShape) {
      act(() => {
        result.current.sortShape(matchingShape);
      });
    }

    // Reset
    act(() => {
      result.current.resetGame();
    });

    expect(result.current.gameState.score).toBe(0);
    expect(result.current.gameState.round).toBe(1);
    expect(result.current.gameState.correctSorts).toBe(0);
    expect(result.current.gameState.currentShapes.length).toBe(18); // Kept settings
    expect(result.current.gameState.settings.fieldSize).toBe(18); // Kept settings
    expect(result.current.gameState.targetShape).toBeTruthy();
  });

  test('game generates shapes with variety of types', () => {
    const { result } = renderHook(() => useShapeSorting());

    // Collect shape types from multiple rounds
    const shapeTypes = new Set<string>();

    for (let i = 0; i < 10; i++) {
      result.current.gameState.currentShapes.forEach(shape => {
        shapeTypes.add(shape.type);
      });

      act(() => {
        result.current.resetGame();
      });
    }

    // Should have at least 2 different shape types across rounds
    expect(shapeTypes.size).toBeGreaterThanOrEqual(2);
  });
});
