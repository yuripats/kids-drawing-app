import { useState, useEffect } from 'react';
import SudokuBoard from './SudokuBoard';
import SudokuKeypad from './SudokuKeypad';
import SudokuHeader from './SudokuHeader';
import { useSudokuGame } from '../../../hooks/useSudokuGame';
import { Difficulty } from '../../../types/sudoku';
import GameLayout from '../../shared/GameLayout';

export default function SudokuPage({ onNavigateHome }: { onNavigateHome: () => void }) {
  const [difficulty, setDifficulty] = useState<Difficulty>('easy');
  const game = useSudokuGame({ difficulty });
  const hintsRemaining = 3 - game.hintsUsed;

  // Handle keyboard input
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Only handle if a cell is selected and the game is in progress
      if (!game.selection || game.status !== 'in_progress') return;
      
      const key = event.key;
      
      // Handle number keys 1-9
      if (key >= '1' && key <= '9') {
        event.preventDefault();
        const number = parseInt(key, 10);
        if (game.mode === 'value') {
          game.setValue(number);
        } else {
          game.toggleNote(number);
        }
      }
      // Handle backspace, delete, or 0 to clear cell
      else if (key === 'Backspace' || key === 'Delete' || key === '0') {
        event.preventDefault();
        game.clearCell();
      }
      // Handle space to toggle note mode
      else if (key === ' ') {
        event.preventDefault();
        game.toggleNoteMode();
      }
    };

    // Add event listener
    window.addEventListener('keydown', handleKeyDown);
    
    // Cleanup
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [game]);

  const headerActions = (
    <button
      aria-label={`Hint (${hintsRemaining} remaining)`}
      disabled={hintsRemaining <= 0 || game.status !== 'in_progress'}
      onClick={() => game.getHint()}
      className="kid-button text-base md:text-lg px-2 md:px-3 py-1 md:py-2 disabled:opacity-40 disabled:cursor-not-allowed"
    >
      💡 {hintsRemaining}
    </button>
  );

  return (
    <GameLayout
      title="Sudoku"
      emoji="🧩"
      onNavigateHome={onNavigateHome}
      bgColorClass="bg-gradient-to-br from-secondary-100 via-primary-50 to-secondary-50"
      headerActions={headerActions}
    >
      <div className="kid-card max-w-3xl mx-auto">
        <SudokuHeader
          difficulty={difficulty}
          onChangeDifficulty={(d) => { setDifficulty(d); game.newGame(d); }}
          elapsedMs={game.elapsedMs}
          status={game.status}
          onNewGame={() => game.newGame(difficulty)}
        />

        <div className="flex flex-col items-center gap-4 w-full">
          <SudokuBoard
            board={game.board}
            selection={game.selection}
            settings={game.settings}
            onSelect={game.selectCell}
          />
          <SudokuKeypad
            mode={game.mode}
            canUndo={game.canUndo}
            canRedo={game.canRedo}
            onSetValue={game.setValue}
            onClear={game.clearCell}
            onToggleNoteMode={game.toggleNoteMode}
            onToggleNote={game.toggleNote}
            onUndo={game.undo}
            onRedo={game.redo}
          />
        </div>
      </div>
    </GameLayout>
  );
}