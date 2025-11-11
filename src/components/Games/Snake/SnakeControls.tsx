/**
 * Snake Controls Component
 * Touch controls for mobile devices
 */

import React from 'react';
import type { Direction } from './types';

interface SnakeControlsProps {
  onDirectionChange: (direction: Direction) => void;
  disabled?: boolean;
}

export const SnakeControls: React.FC<SnakeControlsProps> = ({
  onDirectionChange,
  disabled = false,
}) => {
  const buttonClass = `
    kid-button bg-lime-500 hover:bg-lime-600 active:bg-lime-700
    w-16 h-16 text-2xl font-bold flex items-center justify-center
    disabled:opacity-50 disabled:cursor-not-allowed
  `;

  return (
    <div className="flex flex-col items-center gap-2 my-4">
      {/* Up button */}
      <button
        className={buttonClass}
        onClick={() => onDirectionChange('up')}
        onTouchStart={(e) => {
          e.preventDefault();
          onDirectionChange('up');
        }}
        disabled={disabled}
        aria-label="Move up"
      >
        ↑
      </button>

      {/* Left, Down, Right buttons */}
      <div className="flex gap-2">
        <button
          className={buttonClass}
          onClick={() => onDirectionChange('left')}
          onTouchStart={(e) => {
            e.preventDefault();
            onDirectionChange('left');
          }}
          disabled={disabled}
          aria-label="Move left"
        >
          ←
        </button>

        <button
          className={buttonClass}
          onClick={() => onDirectionChange('down')}
          onTouchStart={(e) => {
            e.preventDefault();
            onDirectionChange('down');
          }}
          disabled={disabled}
          aria-label="Move down"
        >
          ↓
        </button>

        <button
          className={buttonClass}
          onClick={() => onDirectionChange('right')}
          onTouchStart={(e) => {
            e.preventDefault();
            onDirectionChange('right');
          }}
          disabled={disabled}
          aria-label="Move right"
        >
          →
        </button>
      </div>

      {/* Mobile hint */}
      <p className="text-sm text-slate-600 mt-2 text-center">
        Tap arrows to move
      </p>
    </div>
  );
};
