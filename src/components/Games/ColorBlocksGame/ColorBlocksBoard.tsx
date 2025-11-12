import React, { useMemo } from 'react';
import { GameState } from './types';

interface ColorBlocksBoardProps {
  gameState: GameState;
  onBlockClick: (x: number, y: number) => void;
  onBlockHover: (x: number, y: number) => void;
  onMouseLeave: () => void;
}

const ColorBlocksBoard: React.FC<ColorBlocksBoardProps> = ({
  gameState,
  onBlockClick,
  onBlockHover,
  onMouseLeave
}) => {
  const isBlockSelected = (x: number, y: number): boolean => {
    return gameState.selectedBlocks.some(pos => pos.x === x && pos.y === y);
  };

  // Calculate optimal block size based on grid dimensions and viewport
  const blockSize = useMemo(() => {
    const gridWidth = gameState.gridSize[0];
    const gridHeight = gameState.gridSize[1];

    // Get viewport dimensions
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    // Account for padding, margins, and other UI elements
    // Header (~48px) + Score (~56px) + Message (~40px) + Controls (~60px) + Instructions (~40px) + padding
    const reservedHeight = 244;
    const availableHeight = viewportHeight - reservedHeight;

    // Account for horizontal padding (3 * 2 = 6 for px-3, plus board padding)
    const reservedWidth = 40;
    const availableWidth = viewportWidth - reservedWidth;

    // Calculate max block size based on width (accounting for gaps)
    const gapSize = 4; // gap-1 is 0.25rem = 4px
    const boardPadding = 16; // p-2 is 0.5rem = 8px, times 2 for both sides
    const maxWidthBasedSize = Math.floor((availableWidth - boardPadding - (gridWidth - 1) * gapSize) / gridWidth);

    // Calculate max block size based on height (accounting for gaps)
    const maxHeightBasedSize = Math.floor((availableHeight - boardPadding - (gridHeight - 1) * gapSize) / gridHeight);

    // Use the smaller of the two to ensure it fits in viewport
    const calculatedSize = Math.min(maxWidthBasedSize, maxHeightBasedSize);

    // Ensure minimum size of 24px for usability and max of 48px for aesthetics
    return Math.max(24, Math.min(48, calculatedSize));
  }, [gameState.gridSize]);

  return (
    <div
      className="inline-block p-2 bg-purple-200 rounded-xl shadow-2xl"
      onMouseLeave={onMouseLeave}
    >
      <div className="flex flex-col gap-1">
        {gameState.grid.map((row, y) => (
          <div key={y} className="flex gap-1">
            {row.map((color, x) => {
              const isEmpty = color === '';
              const isSelected = isBlockSelected(x, y);

              return (
                <button
                  key={`${x}-${y}`}
                  className={`
                    rounded-lg transition-all duration-150
                    ${isEmpty ? 'invisible' : 'visible'}
                    ${isSelected ? 'ring-4 ring-white ring-inset shadow-2xl brightness-110' : 'hover:brightness-105'}
                    ${!isEmpty && !isSelected ? 'shadow-md hover:shadow-lg' : ''}
                    active:brightness-95
                  `}
                  style={{
                    width: `${blockSize}px`,
                    height: `${blockSize}px`,
                    backgroundColor: isEmpty ? 'transparent' : color,
                    cursor: isEmpty ? 'default' : 'pointer',
                  }}
                  onClick={() => !isEmpty && onBlockClick(x, y)}
                  onMouseEnter={() => !isEmpty && onBlockHover(x, y)}
                  onTouchStart={() => !isEmpty && onBlockHover(x, y)}
                  disabled={isEmpty}
                  aria-label={isEmpty ? 'Empty cell' : `Block at ${x}, ${y}`}
                />
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ColorBlocksBoard;
