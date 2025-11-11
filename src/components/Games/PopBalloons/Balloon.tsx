/**
 * Balloon Component
 * Individual balloon with pop animation
 */

import React, { useState } from 'react';
import type { Balloon as BalloonType } from './types';

interface BalloonProps {
  balloon: BalloonType;
  onPop: () => void;
}

const Balloon: React.FC<BalloonProps> = ({ balloon, onPop }) => {
  const { type, color } = balloon;
  const [isPopping, setIsPopping] = useState(false);

  const handleClick = () => {
    if (isPopping) return;

    setIsPopping(true);
    onPop();
  };

  const getBalloonContent = () => {
    switch (type) {
      case 'golden':
        return (
          <div className="relative w-full h-full">
            <div
              className="absolute inset-0 rounded-full shadow-lg"
              style={{
                background: `radial-gradient(circle at 30% 30%, ${color}, hsl(45, 100%, 50%))`
              }}
            />
            <div className="absolute inset-0 flex items-center justify-center text-4xl md:text-5xl">
              ⭐
            </div>
            {/* Sparkle effect */}
            <div className="absolute top-0 right-0 text-2xl animate-ping">✨</div>
          </div>
        );

      case 'bomb':
        return (
          <div className="relative w-full h-full">
            <div
              className="absolute inset-0 rounded-full shadow-lg border-4 border-red-500"
              style={{
                background: `radial-gradient(circle at 30% 30%, hsl(0, 0%, 40%), hsl(0, 0%, 20%))`
              }}
            />
            <div className="absolute inset-0 flex items-center justify-center text-4xl md:text-5xl">
              💣
            </div>
            {/* Warning */}
            <div className="absolute -top-2 -right-2 text-xl animate-pulse">⚠️</div>
          </div>
        );

      default:
        return (
          <div
            className="absolute inset-0 rounded-full shadow-lg"
            style={{
              background: `radial-gradient(circle at 30% 30%, ${color}, ${adjustBrightness(color, -20)})`
            }}
          >
            {/* Highlight */}
            <div
              className="absolute top-3 left-4 w-6 h-8 rounded-full opacity-40"
              style={{ background: 'white' }}
            />
          </div>
        );
    }
  };

  return (
    <button
      className={`
        relative w-full h-full
        transition-all duration-150
        ${isPopping ? 'scale-0 opacity-0' : 'scale-100 opacity-100 hover:scale-110 active:scale-95'}
        ${type !== 'bomb' ? 'cursor-pointer' : 'cursor-pointer animate-bounce'}
      `}
      onClick={handleClick}
      aria-label={`${type} balloon`}
      disabled={isPopping}
    >
      {/* Balloon */}
      <div className="w-20 h-24 md:w-24 md:h-28 mx-auto relative animate-float">
        {getBalloonContent()}

        {/* String */}
        <div
          className="absolute bottom-0 left-1/2 w-0.5 h-6 -translate-x-1/2 translate-y-full"
          style={{ background: 'rgba(0,0,0,0.3)' }}
        />
      </div>
    </button>
  );
};

// Helper function to adjust color brightness
function adjustBrightness(hslColor: string, amount: number): string {
  const match = hslColor.match(/hsl\((\d+),\s*(\d+)%,\s*(\d+)%\)/);
  if (!match) return hslColor;

  const h = match[1];
  const s = match[2];
  const l = Math.max(0, Math.min(100, parseInt(match[3]) + amount));

  return `hsl(${h}, ${s}%, ${l}%)`;
}

export default Balloon;

// Add float animation to CSS
if (typeof document !== 'undefined') {
  const styleId = 'balloon-animation-styles';

  if (!document.getElementById(styleId)) {
    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = `
      @keyframes float {
        0%, 100% { transform: translateY(0px); }
        50% { transform: translateY(-10px); }
      }

      @keyframes bounce-once {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.1); }
      }

      .animate-float {
        animation: float 2s ease-in-out infinite;
      }

      .animate-bounce-once {
        animation: bounce-once 0.5s ease-in-out;
      }
    `;
    document.head.appendChild(style);
  }
}
