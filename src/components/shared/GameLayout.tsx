/**
 * GameLayout Component
 * Shared layout wrapper for all games
 * Provides consistent header, navigation, and styling
 */

import React from 'react';

interface GameLayoutProps {
  title: string;
  emoji: string;
  onNavigateHome: () => void;
  children: React.ReactNode;
  headerActions?: React.ReactNode;
  bgColorClass?: string;
}

const GameLayout: React.FC<GameLayoutProps> = ({
  title,
  emoji,
  onNavigateHome,
  children,
  headerActions,
  bgColorClass = 'bg-gradient-to-b from-blue-100 to-blue-200'
}) => {
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

          <button
            className="kid-button text-xs md:text-sm bg-slate-500 hover:bg-slate-600 px-2 md:px-4 py-1 md:py-2"
            onClick={onNavigateHome}
            title="Home"
          >
            <span className="md:hidden">←</span>
            <span className="hidden md:inline">← Home</span>
          </button>
        </div>
      </div>

      {/* Game Content - Maximum space on mobile */}
      <div className="game-content">
        {children}
      </div>
    </div>
  );
};

export default GameLayout;
