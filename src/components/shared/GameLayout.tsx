/**
 * GameLayout Component
 * Shared layout wrapper for all games
 * Provides consistent header, navigation, and styling
 */

import React, { useState } from 'react';
import { useSoundSetting } from '../../hooks/useSoundSetting';

interface GameLayoutProps {
  title: string;
  emoji: string;
  onNavigateHome: () => void;
  children: React.ReactNode;
  headerActions?: React.ReactNode;
  bgColorClass?: string;
  /**
   * Optional "How to Play" content.
   * • On ≥md screens it is rendered inline below the game (always visible).
   * • On mobile a ⓘ button appears in the header; tapping it opens a slide-up
   *   modal so the instructions don't eat precious game space.
   */
  instructions?: React.ReactNode;
}

const GameLayout: React.FC<GameLayoutProps> = ({
  title,
  emoji,
  onNavigateHome,
  children,
  headerActions,
  bgColorClass = 'bg-gradient-to-b from-blue-100 to-blue-200',
  instructions,
}) => {
  const { soundEnabled, toggleSound } = useSoundSetting();
  const [showInstructions, setShowInstructions] = useState(false);

  return (
    <div className={`min-h-screen ${bgColorClass} p-2 md:p-4`}>
      {/* Header - Mobile First */}
      <div className="flex items-center justify-between mb-2 md:mb-4 gap-2">
        {/* Title - Compact on mobile */}
        <h1 className="text-xl md:text-3xl font-bold text-gray-800 flex items-center gap-1 md:gap-2">
          <span className="text-2xl md:text-3xl">{emoji}</span>
          <span className="hidden sm:inline">{title}</span>
        </h1>

        {/* Actions and Home Button - Compact on mobile */}
        <div className="flex gap-1 md:gap-2 flex-wrap items-center justify-end">
          {headerActions}

          {/* ⓘ How-to-play — only visible on mobile; desktop sees instructions inline */}
          {instructions && (
            <button
              className="kid-button md:hidden text-xs px-2 py-1"
              onClick={() => setShowInstructions(true)}
              aria-label="How to Play"
            >
              ⓘ
            </button>
          )}

          <button
            className="kid-button text-xs md:text-sm px-2 md:px-4 py-1 md:py-2"
            onClick={toggleSound}
            aria-label={soundEnabled ? 'Mute sounds' : 'Unmute sounds'}
          >
            {soundEnabled ? '🔊' : '🔇'}
          </button>

          <button
            className="kid-button text-xs md:text-sm bg-slate-500 hover:bg-slate-600 px-2 md:px-4 py-1 md:py-2"
            onClick={onNavigateHome}
            aria-label="← Home"
          >
            <span className="md:hidden" aria-hidden="true">←</span>
            <span className="hidden md:inline" aria-hidden="true">← Home</span>
          </button>
        </div>
      </div>

      {/* Game Content - Maximum space on mobile */}
      <div className="game-content">
        {children}
      </div>

      {/* Instructions — inline on desktop, slide-up modal on mobile */}
      {instructions && (
        <>
          {/* Desktop: always rendered below game content */}
          <div className="kid-card max-w-4xl mx-auto hidden md:block mt-4">
            <h2 className="text-xl font-bold mb-3 text-center text-gray-800">How to Play</h2>
            {instructions}
          </div>

          {/* Mobile: shown only when ⓘ is tapped */}
          {showInstructions && (
            <div
              className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-end justify-center z-50 p-4"
              role="dialog"
              aria-modal="true"
              aria-label="How to Play"
              onClick={() => setShowInstructions(false)}
            >
              <div
                className="kid-card w-full max-w-lg max-h-[75vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-xl font-bold text-gray-800">How to Play</h2>
                  <button
                    className="kid-button text-sm px-3 py-1 bg-slate-500 hover:bg-slate-600"
                    onClick={() => setShowInstructions(false)}
                    aria-label="Close instructions"
                  >
                    ✕
                  </button>
                </div>
                {instructions}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default GameLayout;
