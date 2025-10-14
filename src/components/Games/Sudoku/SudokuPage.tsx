import { useState, useEffect } from 'react';
import SudokuBoard from './SudokuBoard';
import SudokuKeypad from './SudokuKeypad';
import SudokuHeader from './SudokuHeader';
import { useSudokuGame } from '../../../hooks/useSudokuGame';
import { Difficulty } from '../../../types/sudoku';

export default function SudokuPage({ onNavigateHome }: { onNavigateHome: () => void }) {
  const [difficulty, setDifficulty] = useState<Difficulty>('easy');
  const game = useSudokuGame({ difficulty });

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
  }, [game.selection, game.status, game.mode, game.setValue, game.toggleNote, game.clearCell, game.toggleNoteMode]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary-100 via-primary-50 to-secondary-50 p-4">
      <header className="flex items-center justify-between mb-4">
        <button className="kid-button bg-secondary-500 hover:bg-secondary-600 active:bg-secondary-700" onClick={onNavigateHome}>
          ← Home
        </button>
        <h1 className="text-2xl font-bold text-primary-600">🧩 Sudoku</h1>
        <div className="w-16" />
      </header>

      <div className="kid-card max-w-3xl mx-auto">
        <SudokuHeader
          difficulty={difficulty}
          onChangeDifficulty={(d) => { setDifficulty(d); game.newGame(d); }}
          elapsedMs={game.elapsedMs}
          status={game.status}
          onNewGame={() => game.newGame(difficulty)}
        />

        <div className="flex flex-col items-center gap-4">
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
    </div>
  );
}