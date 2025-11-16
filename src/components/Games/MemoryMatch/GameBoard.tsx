/**
 * Memory Match Game Board Component
 * Grid layout for memory cards
 */

import React from 'react';
import Card from './Card';
import type { MemoryMatchState } from './types';
import { difficultySettings } from './themes';

interface GameBoardProps {
  gameState: MemoryMatchState;
  onCardClick: (index: number) => void;
}

const GameBoard: React.FC<GameBoardProps> = ({ gameState, onCardClick }) => {
  const { cards, difficulty } = gameState;
  const { gridCols } = difficultySettings[difficulty];

  // Viewport-aware styling for mobile optimization
  // On mobile, use full width and smaller gaps for better space utilization
  // On desktop, constrain width for better aesthetics
  const gridClasses = gridCols === 4
    ? 'grid-cols-4 gap-2 md:gap-4'
    : 'grid-cols-6 gap-1.5 md:gap-3';

  return (
    <div
      className={`
        grid ${gridClasses}
        w-full max-w-full md:max-w-3xl lg:max-w-4xl mx-auto
        px-1 md:px-0
      `}
      role="grid"
      aria-label="Memory match game board"
    >
      {cards.map((card) => (
        <Card
          key={card.id}
          card={card}
          onClick={() => onCardClick(card.index)}
        />
      ))}
    </div>
  );
};

export default GameBoard;
