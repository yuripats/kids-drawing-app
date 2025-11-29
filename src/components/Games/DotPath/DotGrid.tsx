/**
 * DotGrid Component
 * Renders the grid of dots and connecting lines
 */

import React from 'react';
import Dot from './Dot';
import type { GameState, DotPosition } from './types';
import { isSamePosition } from './utils';

interface DotGridProps {
  gameState: GameState;
  onDotClick: (position: DotPosition) => void;
}

const DotGrid: React.FC<DotGridProps> = ({ gameState, onDotClick }) => {
  const { grid, path, currentDot, showNumbers, gridSize } = gameState;

  // Calculate SVG line paths
  const renderPaths = () => {
    if (path.length < 2) return null;

    const lines: React.ReactNode[] = [];
    const cellSize = 80; // Approximate size for calculations

    for (let i = 0; i < path.length - 1; i++) {
      const start = path[i];
      const end = path[i + 1];

      // Calculate center positions
      const x1 = start.col * cellSize + cellSize / 2;
      const y1 = start.row * cellSize + cellSize / 2;
      const x2 = end.col * cellSize + cellSize / 2;
      const y2 = end.row * cellSize + cellSize / 2;

      // Create gradient for the line
      const gradientId = `gradient-${i}`;

      lines.push(
        <g key={i}>
          <defs>
            <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#10b981" />
              <stop offset="100%" stopColor="#3b82f6" />
            </linearGradient>
          </defs>
          <line
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke={`url(#${gradientId})`}
            strokeWidth="6"
            strokeLinecap="round"
            className="transition-all duration-200"
          />
        </g>
      );
    }

    return lines;
  };

  return (
    <div className="relative flex items-center justify-center w-full h-full">
      {/* SVG Layer for paths */}
      <svg
        className="absolute inset-0 pointer-events-none"
        style={{
          width: '100%',
          height: '100%',
        }}
        viewBox={`0 0 ${gridSize * 80} ${gridSize * 80}`}
        preserveAspectRatio="xMidYMid meet"
      >
        {renderPaths()}
      </svg>

      {/* Grid of dots */}
      <div
        className="grid gap-4 md:gap-6 p-4"
        style={{
          gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))`,
          gridTemplateRows: `repeat(${gridSize}, minmax(0, 1fr))`,
        }}
      >
        {grid.map((row, rowIndex) =>
          row.map((dot, colIndex) => {
            const isCurrent =
              currentDot !== null && isSamePosition(dot.position, currentDot);

            return (
              <Dot
                key={`${rowIndex}-${colIndex}`}
                position={dot.position}
                visited={dot.visited}
                isStart={dot.isStart}
                isEnd={dot.isEnd}
                isCurrent={isCurrent}
                number={dot.number}
                showNumbers={showNumbers}
                onClick={onDotClick}
              />
            );
          })
        )}
      </div>
    </div>
  );
};

export default DotGrid;
