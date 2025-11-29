/**
 * Dot Path Game Utilities
 * Helper functions for game logic
 */

import type { DotPosition, DotState } from './types';

/**
 * Check if two positions are the same
 */
export const isSamePosition = (pos1: DotPosition, pos2: DotPosition): boolean => {
  return pos1.row === pos2.row && pos1.col === pos2.col;
};

/**
 * Check if two dots are adjacent (horizontal or vertical only)
 */
export const areAdjacent = (pos1: DotPosition, pos2: DotPosition): boolean => {
  const rowDiff = Math.abs(pos1.row - pos2.row);
  const colDiff = Math.abs(pos1.col - pos2.col);

  // Adjacent means exactly 1 step in one direction, 0 in the other
  return (rowDiff === 1 && colDiff === 0) || (rowDiff === 0 && colDiff === 1);
};

/**
 * Get all adjacent positions to a given position
 */
export const getAdjacentPositions = (
  pos: DotPosition,
  gridSize: number
): DotPosition[] => {
  const adjacent: DotPosition[] = [];
  const { row, col } = pos;

  // Up
  if (row > 0) adjacent.push({ row: row - 1, col });
  // Down
  if (row < gridSize - 1) adjacent.push({ row: row + 1, col });
  // Left
  if (col > 0) adjacent.push({ row, col: col - 1 });
  // Right
  if (col < gridSize - 1) adjacent.push({ row, col: col + 1 });

  return adjacent;
};

/**
 * Find a dot in the grid by position
 */
export const findDot = (
  grid: DotState[][],
  position: DotPosition
): DotState | null => {
  if (
    position.row >= 0 &&
    position.row < grid.length &&
    position.col >= 0 &&
    position.col < grid[0].length
  ) {
    return grid[position.row][position.col];
  }
  return null;
};

/**
 * Check if position is in path
 */
export const isInPath = (path: DotPosition[], position: DotPosition): boolean => {
  return path.some(p => isSamePosition(p, position));
};

/**
 * Generate a random Hamiltonian path for the puzzle
 * Returns array of positions in order
 */
export const generateHamiltonianPath = (gridSize: number): DotPosition[] => {
  const path: DotPosition[] = [];
  const visited = new Set<string>();

  const posKey = (pos: DotPosition) => `${pos.row},${pos.col}`;

  // Start from random position
  const startRow = Math.floor(Math.random() * gridSize);
  const startCol = Math.floor(Math.random() * gridSize);
  const start: DotPosition = { row: startRow, col: startCol };

  path.push(start);
  visited.add(posKey(start));

  // Use backtracking to find a Hamiltonian path
  const backtrack = (current: DotPosition): boolean => {
    if (path.length === gridSize * gridSize) {
      return true; // Found complete path
    }

    // Get adjacent unvisited positions
    const adjacent = getAdjacentPositions(current, gridSize)
      .filter(pos => !visited.has(posKey(pos)))
      .sort(() => Math.random() - 0.5); // Randomize order

    for (const next of adjacent) {
      path.push(next);
      visited.add(posKey(next));

      if (backtrack(next)) {
        return true;
      }

      // Backtrack
      path.pop();
      visited.delete(posKey(next));
    }

    return false;
  };

  // Try to find a path, if fails, use simple snake pattern
  if (!backtrack(start)) {
    // Fallback: snake pattern
    path.length = 0;
    visited.clear();

    for (let row = 0; row < gridSize; row++) {
      if (row % 2 === 0) {
        // Go left to right
        for (let col = 0; col < gridSize; col++) {
          path.push({ row, col });
        }
      } else {
        // Go right to left
        for (let col = gridSize - 1; col >= 0; col--) {
          path.push({ row, col });
        }
      }
    }
  }

  return path;
};

/**
 * Format time in MM:SS format
 */
export const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};
