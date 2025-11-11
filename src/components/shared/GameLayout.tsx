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
    <div className={`min-h-screen ${bgColorClass} p-4`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4 flex-wrap gap-4">
        <h1 className="text-3xl font-bold text-gray-800">
          {emoji} {title}
        </h1>

        <div className="flex gap-2 flex-wrap items-center">
          {headerActions}

          <button
            className="kid-button text-sm bg-slate-500 hover:bg-slate-600"
            onClick={onNavigateHome}
          >
            ← Home
          </button>
        </div>
      </div>

      {/* Game Content */}
      <div className="game-content">
        {children}
      </div>
    </div>
  );
};

export default GameLayout;
