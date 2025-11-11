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

  return (
    <div
      className={`
        grid gap-3 md:gap-4 max-w-4xl mx-auto
        ${gridCols === 4 ? 'grid-cols-4' : 'grid-cols-6'}
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
