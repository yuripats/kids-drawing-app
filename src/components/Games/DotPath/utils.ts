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
 * Generate numbered dots puzzle
 * Returns array of positions with their sequence numbers
 */
export const generateNumberedDotsPuzzle = (
  gridSize: number,
  dotCount: number
): DotPosition[] => {
  const positions: DotPosition[] = [];
  const occupied = new Set<string>();
  const posKey = (pos: DotPosition) => `${pos.row},${pos.col}`;

  // Helper to check if position is valid and not too close to existing dots
  const isValidPosition = (pos: DotPosition, minDistance: number = 1): boolean => {
    if (occupied.has(posKey(pos))) return false;

    // For easy puzzles, allow closer dots. For harder, require more spacing
    if (minDistance > 1) {
      for (const existingPos of positions) {
        const distance = Math.abs(existingPos.row - pos.row) + Math.abs(existingPos.col - pos.col);
        if (distance < minDistance) return false;
      }
    }

    return true;
  };

  // Place first dot randomly
  const firstRow = Math.floor(Math.random() * gridSize);
  const firstCol = Math.floor(Math.random() * gridSize);
  const firstPos = { row: firstRow, col: firstCol };
  positions.push(firstPos);
  occupied.add(posKey(firstPos));

  // Place remaining dots
  let attempts = 0;
  const maxAttempts = 1000;

  while (positions.length < dotCount && attempts < maxAttempts) {
    attempts++;

    // Random position
    const row = Math.floor(Math.random() * gridSize);
    const col = Math.floor(Math.random() * gridSize);
    const pos = { row, col };

    // Check if valid (not too close to other dots for harder difficulties)
    const minDistance = dotCount > 8 ? 1 : 0; // Require spacing for harder puzzles
    if (isValidPosition(pos, minDistance)) {
      positions.push(pos);
      occupied.add(posKey(pos));
    }
  }

  // If we couldn't place all dots, fill remaining with any valid positions
  if (positions.length < dotCount) {
    for (let row = 0; row < gridSize && positions.length < dotCount; row++) {
      for (let col = 0; col < gridSize && positions.length < dotCount; col++) {
        const pos = { row, col };
        if (!occupied.has(posKey(pos))) {
          positions.push(pos);
          occupied.add(posKey(pos));
        }
      }
    }
  }

  return positions.slice(0, dotCount);
};

/**
 * Format time in MM:SS format
 */
export const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};
