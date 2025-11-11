/**
 * Pop the Balloons Game Board Component
 * Dynamic grid for balloons (3x3, 4x4, or 5x5)
 */

import React from 'react';
import Balloon from './Balloon';
import type { PopBalloonsState } from './types';
import { gridSizeSettings } from './constants';

interface GameBoardProps {
  gameState: PopBalloonsState;
  onBalloonPop: (balloonId: string) => void;
}

const GameBoard: React.FC<GameBoardProps> = ({ gameState, onBalloonPop }) => {
  const { balloons, gridSize } = gameState;
  const currentGridSize = gridSizeSettings[gridSize].size;

  // Create a dynamic grid with balloons in their positions
  const grid = Array.from({ length: currentGridSize }, (_, row) =>
    Array.from({ length: currentGridSize }, (_, col) => {
      const balloon = balloons.find(
        b => b.position.row === row && b.position.col === col
      );
      return balloon;
    })
  );

  // Dynamic grid class based on size
  const gridColsClass = currentGridSize === 3 ? 'grid-cols-3' : currentGridSize === 4 ? 'grid-cols-4' : 'grid-cols-5';

  return (
    <div
      className="max-w-xl mx-auto bg-gradient-to-b from-sky-200 to-sky-300 rounded-2xl p-6 shadow-lg"
      role="grid"
      aria-label="Balloon popping game board"
    >
      <div className={`grid ${gridColsClass} gap-4`}>
        {grid.flat().map((balloon, index) => {
          const row = Math.floor(index / currentGridSize);
          const col = index % currentGridSize;

          return (
            <div
              key={`cell-${row}-${col}`}
              className="aspect-square flex items-center justify-center bg-white bg-opacity-20 rounded-lg"
            >
              {balloon && (
                <Balloon
                  balloon={balloon}
                  onPop={() => onBalloonPop(balloon.id)}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default GameBoard;
