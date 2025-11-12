/**
 * Bubble Pop Game Page
 * Relaxing bubble popping game for ages 3+
 */

import React, { useState, useEffect } from 'react';
import { useBubblePop } from '../../../hooks/useBubblePop';
import GameLayout from '../../shared/GameLayout';

interface Particle {
  id: string;
  x: number;
  y: number;
  color: string;
  angle: number;
}

interface BubblePopPageProps {
  onNavigateHome: () => void;
}

const BubblePopPage: React.FC<BubblePopPageProps> = ({ onNavigateHome }) => {
  const { gameState, popBubble, togglePause, resetGame } = useBubblePop();
  const [particles, setParticles] = useState<Particle[]>([]);

  const { bubbles, score, bubblesPopped, gameStatus } = gameState;

  // Create particle burst effect when bubble pops
  const createParticles = (x: number, y: number, size: number, color: string) => {
    const particleCount = 8;
    const newParticles: Particle[] = [];

    for (let i = 0; i < particleCount; i++) {
      const angle = (Math.PI * 2 * i) / particleCount;
      newParticles.push({
        id: `particle-${Date.now()}-${i}`,
        x: x + size / 2,
        y: y + size / 2,
        color,
        angle
      });
    }

    setParticles(prev => [...prev, ...newParticles]);

    // Remove particles after animation
    setTimeout(() => {
      setParticles(prev => prev.filter(p => !newParticles.find(np => np.id === p.id)));
    }, 600);
  };

  const handleBubblePop = (bubbleId: string) => {
    const bubble = bubbles.find(b => b.id === bubbleId);
    if (bubble && !bubble.popping) {
      createParticles(bubble.x, bubble.y, bubble.size, bubble.color);
      popBubble(bubbleId);
    }
  };

  // Inject animation styles
  useEffect(() => {
    const styleId = 'bubble-pop-animations';
    if (!document.getElementById(styleId)) {
      const style = document.createElement('style');
      style.id = styleId;
      style.textContent = `
        @keyframes bubble-burst {
          0% {
            transform: scale(1);
            opacity: 0.8;
          }
          50% {
            transform: scale(1.3);
            opacity: 0.6;
          }
          100% {
            transform: scale(0);
            opacity: 0;
          }
        }

        @keyframes particle-burst {
          0% {
            transform: translate(0, 0) scale(1);
            opacity: 1;
          }
          100% {
            transform: translate(var(--tx), var(--ty)) scale(0);
            opacity: 0;
          }
        }

        .bubble-popping {
          animation: bubble-burst 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }

        .particle {
          animation: particle-burst 0.6s ease-out forwards;
        }
      `;
      document.head.appendChild(style);
    }
  }, []);

  const headerActions = (
    <>
      <button
        className="kid-button text-xs md:text-sm bg-yellow-500 hover:bg-yellow-600 px-2 md:px-4 py-1 md:py-2"
        onClick={togglePause}
      >
        {gameStatus === 'paused' ? '▶️' : '⏸️'}
        <span className="hidden md:inline ml-1">{gameStatus === 'paused' ? 'Resume' : 'Pause'}</span>
      </button>

      <button
        className="kid-button text-xs md:text-sm bg-blue-500 hover:bg-blue-600 px-2 md:px-4 py-1 md:py-2"
        onClick={resetGame}
      >
        <span className="md:hidden">🔄</span>
        <span className="hidden md:inline">🔄 Reset</span>
      </button>
    </>
  );

  return (
    <GameLayout
      title="Bubble Pop"
      emoji="🐠"
      onNavigateHome={onNavigateHome}
      headerActions={headerActions}
      bgColorClass="bg-gradient-to-b from-cyan-100 to-blue-200"
    >
      {/* Stats */}
      <div className="kid-card max-w-4xl mx-auto mb-2 md:mb-4 p-2 md:p-4">
        <div className="grid grid-cols-2 gap-2 md:gap-4">
          <div className="text-center">
            <p className="text-xs md:text-sm text-slate-600 font-semibold">Score</p>
            <p className="text-xl md:text-3xl font-bold text-blue-600">{score}</p>
          </div>
          <div className="text-center">
            <p className="text-xs md:text-sm text-slate-600 font-semibold">Popped</p>
            <p className="text-xl md:text-3xl font-bold text-purple-600">{bubblesPopped}</p>
          </div>
        </div>
      </div>

      {/* Bubble Container */}
      <div className="relative w-full h-[500px] md:h-[600px] bg-gradient-to-b from-blue-50 to-cyan-50 rounded-lg overflow-hidden border-4 border-blue-300">
        {gameStatus === 'paused' && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 z-10">
            <div className="text-4xl md:text-6xl text-white font-bold">⏸️ PAUSED</div>
          </div>
        )}

        {bubbles.map(bubble => (
          <button
            key={bubble.id}
            onClick={() => handleBubblePop(bubble.id)}
            className={`
              absolute rounded-full cursor-pointer shadow-lg
              ${bubble.popping ? 'bubble-popping' : 'transition-transform hover:scale-110 active:scale-95'}
            `}
            style={{
              left: `${bubble.x}px`,
              bottom: `${bubble.y}px`,
              width: `${bubble.size}px`,
              height: `${bubble.size}px`,
              backgroundColor: bubble.color,
              opacity: bubble.popping ? 0 : 0.8,
              border: '3px solid rgba(255,255,255,0.5)',
              pointerEvents: bubble.popping ? 'none' : 'auto'
            }}
            aria-label="Pop bubble"
            disabled={bubble.popping}
          />
        ))}

        {/* Particle effects */}
        {particles.map(particle => {
          const distance = 60;
          const tx = Math.cos(particle.angle) * distance;
          const ty = Math.sin(particle.angle) * distance;

          return (
            <div
              key={particle.id}
              className="particle absolute rounded-full pointer-events-none"
              style={{
                left: `${particle.x}px`,
                bottom: `${particle.y}px`,
                width: '12px',
                height: '12px',
                backgroundColor: particle.color,
                // @ts-expect-error - CSS custom properties
                '--tx': `${tx}px`,
                '--ty': `${ty}px`
              }}
            />
          );
        })}

        {bubbles.length === 0 && gameStatus === 'playing' && (
          <div className="absolute inset-0 flex items-center justify-center">
            <p className="text-2xl text-blue-400">Bubbles are coming...</p>
          </div>
        )}
      </div>

      {/* Instructions - Hidden on mobile */}
      <div className="kid-card max-w-4xl mx-auto mt-4 hidden md:block">
        <h2 className="text-xl font-bold mb-3 text-center text-cyan-800">How to Play</h2>
        <div className="space-y-2 text-slate-700">
          <p>• Tap the bubbles to pop them!</p>
          <p>• Bigger bubbles = more points</p>
          <p>• Relax and enjoy - no time limit!</p>
          <p>• Perfect for ages 3+</p>
        </div>
      </div>
    </GameLayout>
  );
};

export default BubblePopPage;
