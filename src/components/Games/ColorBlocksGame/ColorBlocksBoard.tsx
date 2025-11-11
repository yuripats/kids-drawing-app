import React from 'react';
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
                    w-12 h-12 rounded-lg transition-all duration-150
                    ${isEmpty ? 'invisible' : 'visible'}
                    ${isSelected ? 'scale-110 ring-4 ring-white shadow-2xl' : 'hover:scale-105'}
                    ${!isEmpty && !isSelected ? 'shadow-md hover:shadow-lg' : ''}
                    active:scale-95
                  `}
                  style={{
                    backgroundColor: isEmpty ? 'transparent' : color,
                    cursor: isEmpty ? 'default' : 'pointer',
                  }}
                  onClick={() => !isEmpty && onBlockClick(x, y)}
                  onMouseEnter={() => !isEmpty && onBlockHover(x, y)}
                  onTouchStart={() => !isEmpty && onBlockHover(x, y)}
                  disabled={isEmpty || gameState.gameStatus === 'won' || gameState.gameStatus === 'gameOver'}
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
