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
        rounded-lg md:rounded-xl border-2 md:border-4
        transition-all duration-300 ease-in-out
        ${isMatched
          ? 'border-green-400 bg-green-100 opacity-70'
          : isFlipped
            ? 'border-blue-400 bg-white'
            : 'border-slate-300 bg-gradient-to-br from-purple-400 to-pink-400 hover:scale-105 active:scale-95'
        }
        ${!isFlipped && !isMatched ? 'cursor-pointer' : 'cursor-default'}
        shadow-md md:shadow-lg
        ${isFlipped || isMatched ? 'transform-none' : ''}
      `}
      onClick={onClick}
      disabled={isFlipped || isMatched}
      aria-label={isFlipped ? `Card showing ${value}` : 'Face down card'}
    >
      <div className="absolute inset-0 flex items-center justify-center">
        {isFlipped || isMatched ? (
          // Front face (showing emoji) - responsive sizing for mobile
          <span className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl select-none animate-bounce-once">
            {value}
          </span>
        ) : (
          // Back face (pattern)
          <div className="w-full h-full flex items-center justify-center">
            <div className="grid grid-cols-3 gap-0.5 sm:gap-1 opacity-40">
              {[...Array(9)].map((_, i) => (
                <div
                  key={i}
                  className="w-1.5 h-1.5 sm:w-2 sm:h-2 md:w-3 md:h-3 rounded-full bg-white"
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Matched checkmark */}
      {isMatched && (
        <div className="absolute top-0.5 right-0.5 sm:top-1 sm:right-1 bg-green-500 rounded-full w-4 h-4 sm:w-6 sm:h-6 flex items-center justify-center">
          <span className="text-white text-xs sm:text-sm">✓</span>
        </div>
      )}
    </button>
  );
};

export default Card;
