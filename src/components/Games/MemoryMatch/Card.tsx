/**
 * Memory Match Card Component
 * Individual card with flip animation
 */

import React from 'react';
import type { Card as CardType } from './types';

interface CardProps {
  card: CardType;
  onClick: () => void;
}

const Card: React.FC<CardProps> = ({ card, onClick }) => {
  const { value, isFlipped, isMatched } = card;

  return (
    <button
      className={`
        memory-card
        relative w-full aspect-square
        rounded-xl border-4
        transition-all duration-300 ease-in-out
        ${isMatched
          ? 'border-green-400 bg-green-100 opacity-70'
          : isFlipped
            ? 'border-blue-400 bg-white'
            : 'border-slate-300 bg-gradient-to-br from-purple-400 to-pink-400 hover:scale-105 active:scale-95'
        }
        ${!isFlipped && !isMatched ? 'cursor-pointer' : 'cursor-default'}
        shadow-lg
        ${isFlipped || isMatched ? 'transform-none' : ''}
      `}
      onClick={onClick}
      disabled={isFlipped || isMatched}
      aria-label={isFlipped ? `Card showing ${value}` : 'Face down card'}
    >
      <div className="absolute inset-0 flex items-center justify-center">
        {isFlipped || isMatched ? (
          // Front face (showing emoji)
          <span className="text-4xl md:text-6xl select-none animate-bounce-once">
            {value}
          </span>
        ) : (
          // Back face (pattern)
          <div className="w-full h-full flex items-center justify-center">
            <div className="grid grid-cols-3 gap-1 opacity-40">
              {[...Array(9)].map((_, i) => (
                <div
                  key={i}
                  className="w-2 h-2 md:w-3 md:h-3 rounded-full bg-white"
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Matched checkmark */}
      {isMatched && (
        <div className="absolute top-1 right-1 bg-green-500 rounded-full w-6 h-6 flex items-center justify-center">
          <span className="text-white text-sm">✓</span>
        </div>
      )}
    </button>
  );
};

export default Card;
