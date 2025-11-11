/**
 * Pop the Balloons Game Board Component
 * 3x3 grid for balloons
 */

import React from 'react';
import Balloon from './Balloon';
import type { PopBalloonsState } from './types';
import { GRID_SIZE } from './constants';

interface GameBoardProps {
  gameState: PopBalloonsState;
  onBalloonPop: (balloonId: string) => void;
}

const GameBoard: React.FC<GameBoardProps> = ({ gameState, onBalloonPop }) => {
  const { balloons } = gameState;

  // Create a 3x3 grid with balloons in their positions
  const grid = Array.from({ length: GRID_SIZE }, (_, row) =>
    Array.from({ length: GRID_SIZE }, (_, col) => {
      const balloon = balloons.find(
        b => b.position.row === row && b.position.col === col
      );
      return balloon;
    })
  );

  return (
    <div
      className="max-w-xl mx-auto bg-gradient-to-b from-sky-200 to-sky-300 rounded-2xl p-6 shadow-lg"
      role="grid"
      aria-label="Balloon popping game board"
    >
      <div className="grid grid-cols-3 gap-4">
        {grid.flat().map((balloon, index) => {
          const row = Math.floor(index / GRID_SIZE);
          const col = index % GRID_SIZE;

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
