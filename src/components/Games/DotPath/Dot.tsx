/**
 * Dot Component
 * Individual dot in the grid
 */

import React from 'react';
import type { DotPosition } from './types';

interface DotProps {
  position: DotPosition;
  visited: boolean;
  isCurrent: boolean;
  number: number;
  isEmpty?: boolean;
  isNextInSequence: boolean; // true if this is the next dot to connect
  onClick: (position: DotPosition) => void;
}

const Dot: React.FC<DotProps> = ({
  position,
  visited,
  isCurrent,
  number,
  isEmpty,
  isNextInSequence,
  onClick,
}) => {
  const handleClick = () => {
    // Don't handle clicks on empty cells
    if (!isEmpty) {
      onClick(position);
    }
  };

  // Empty cells - just show a small dot for grid reference
  if (isEmpty) {
    return (
      <div className="w-12 h-12 md:w-14 md:h-14 flex items-center justify-center">
        <div className="w-2 h-2 rounded-full bg-gray-300" />
      </div>
    );
  }

  // Determine dot appearance
  const getDotClasses = (): string => {
    const baseClasses =
      'w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center font-bold text-lg md:text-xl transition-all duration-200 cursor-pointer select-none';

    if (isCurrent) {
      return `${baseClasses} bg-gradient-to-br from-yellow-400 to-orange-500 text-white shadow-lg scale-110 border-4 border-yellow-600`;
    }

    if (visited) {
      return `${baseClasses} bg-gradient-to-br from-green-400 to-blue-500 text-white shadow-md`;
    }

    if (isNextInSequence) {
      return `${baseClasses} bg-gradient-to-br from-green-300 to-green-500 text-white border-4 border-green-600 shadow-lg animate-pulse`;
    }

    return `${baseClasses} bg-gradient-to-br from-purple-200 to-purple-400 text-purple-900 hover:scale-110 hover:shadow-md active:scale-95 border-2 border-purple-500`;
  };

  // Determine what to show inside the dot
  const getDotContent = (): React.ReactNode => {
    if (visited) {
      return '✓';
    }

    return number;
  };

  return (
    <button
      className={getDotClasses()}
      onClick={handleClick}
      onTouchStart={handleClick}
      aria-label={`Dot ${number} at row ${position.row + 1}, column ${position.col + 1}`}
      type="button"
    >
      {getDotContent()}
    </button>
  );
};

export default Dot;
