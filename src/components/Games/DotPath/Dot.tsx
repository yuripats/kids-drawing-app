/**
 * Dot Component
 * Individual dot in the grid
 */

import React from 'react';
import type { DotPosition } from './types';

interface DotProps {
  position: DotPosition;
  visited: boolean;
  isStart: boolean;
  isEnd: boolean;
  isCurrent: boolean;
  number?: number;
  showNumbers: boolean;
  onClick: (position: DotPosition) => void;
}

const Dot: React.FC<DotProps> = ({
  position,
  visited,
  isStart,
  isEnd,
  isCurrent,
  number,
  showNumbers,
  onClick,
}) => {
  const handleClick = () => {
    onClick(position);
  };

  // Determine dot appearance
  const getDotClasses = (): string => {
    const baseClasses =
      'w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center font-bold text-lg transition-all duration-200 cursor-pointer select-none';

    if (isCurrent) {
      return `${baseClasses} bg-gradient-to-br from-yellow-400 to-orange-500 text-white shadow-lg scale-110 animate-pulse`;
    }

    if (visited) {
      return `${baseClasses} bg-gradient-to-br from-green-400 to-blue-500 text-white shadow-md`;
    }

    if (isStart) {
      return `${baseClasses} bg-gradient-to-br from-green-300 to-green-500 text-white border-4 border-green-600 shadow-lg`;
    }

    if (isEnd) {
      return `${baseClasses} bg-gradient-to-br from-purple-300 to-purple-500 text-white border-4 border-purple-600 shadow-lg`;
    }

    return `${baseClasses} bg-gradient-to-br from-gray-200 to-gray-300 text-gray-700 hover:scale-110 hover:shadow-md active:scale-95`;
  };

  // Determine what to show inside the dot
  const getDotContent = (): React.ReactNode => {
    if (isCurrent) {
      return '●';
    }

    if (isStart && !visited) {
      return '▶';
    }

    if (isEnd && !visited) {
      return '★';
    }

    if (showNumbers && number) {
      return number;
    }

    if (visited) {
      return '✓';
    }

    return '';
  };

  return (
    <button
      className={getDotClasses()}
      onClick={handleClick}
      onTouchStart={handleClick}
      aria-label={`Dot ${number || ''} at row ${position.row + 1}, column ${position.col + 1}`}
      type="button"
    >
      {getDotContent()}
    </button>
  );
};

export default Dot;
