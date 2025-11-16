/**
 * Memory Match Game Board Component
 * Grid layout for memory cards
 */

import React from 'react';
import Card from './Card';
import type { MemoryMatchState } from './types';

interface GameBoardProps {
  gameState: MemoryMatchState;
  onCardClick: (index: number) => void;
}

const GameBoard: React.FC<GameBoardProps> = ({ gameState, onCardClick }) => {
  const { cards } = gameState;

  // Viewport-aware styling for mobile optimization
  // 4-column grid layout works well for all difficulties (easy 4x3, medium 4x4, hard 4x6)
  // On mobile, use full width and smaller gaps for better space utilization
  // On desktop, constrain width for better aesthetics
  return (
    <div
      className={`
        grid grid-cols-4 gap-2 md:gap-4
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
