/**
 * Snake Board Component
 * Renders the game grid with snake and food
 */

import React from 'react';
import type { SnakeConfig, GameState } from './types';

interface SnakeBoardProps {
  gameState: GameState;
  config: SnakeConfig;
}

export const SnakeBoard: React.FC<SnakeBoardProps> = ({ gameState, config }) => {
  const { snake, food } = gameState;
  const { gridWidth, gridHeight } = config;

  /**
   * Check if position is snake head
   */
  const isSnakeHead = (x: number, y: number): boolean => {
    if (snake.length === 0) return false;
    const head = snake[0];
    return head.x === x && head.y === y;
  };

  /**
   * Check if position is in snake body (not head)
   */
  const isSnakeBody = (x: number, y: number): boolean => {
    return snake.slice(1).some(segment => segment.x === x && segment.y === y);
  };

  /**
   * Check if position is food
   */
  const isFood = (x: number, y: number): boolean => {
    return food.x === x && food.y === y;
  };

  /**
   * Get cell className based on content
   */
  const getCellClassName = (x: number, y: number): string => {
    const baseClass = 'flex items-center justify-center transition-colors duration-100 rounded-sm aspect-square overflow-hidden';

    if (isSnakeHead(x, y)) {
      return `${baseClass} bg-lime-600 text-xl leading-none`;
    }

    if (isSnakeBody(x, y)) {
      return `${baseClass} bg-lime-500`;
    }

    if (isFood(x, y)) {
      return `${baseClass} bg-red-500 text-xl leading-none`;
    }

    return `${baseClass} bg-slate-800`;
  };

  /**
   * Get cell content (emoji)
   */
  const getCellContent = (x: number, y: number): string => {
    if (isSnakeHead(x, y)) {
      return '🐍';
    }

    if (isFood(x, y)) {
      return '🍎';
    }

    return '';
  };

  return (
    <div className="flex justify-center">
      <div
        className="grid gap-0.5 bg-slate-700 p-1 rounded-lg shadow-2xl"
        style={{
          gridTemplateColumns: `repeat(${gridWidth}, 1fr)`,
          width: 'min(90vw, 600px)',
          aspectRatio: '1',
        }}
      >
        {Array.from({ length: gridHeight }).map((_, y) =>
          Array.from({ length: gridWidth }).map((_, x) => (
            <div
              key={`${x}-${y}`}
              className={getCellClassName(x, y)}
            >
              {getCellContent(x, y)}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
