import { Difficulty, Status } from '../../../types/sudoku';

function formatTime(ms: number) {
  const s = Math.floor(ms / 1000);
  const m = Math.floor(s / 60);
  const rems = s % 60;
  return `${m}:${rems.toString().padStart(2, '0')}`;
}

export default function SudokuHeader({
  difficulty,
  onChangeDifficulty,
  elapsedMs,
  status,
  onNewGame,
}: {
  difficulty: Difficulty;
  onChangeDifficulty: (d: Difficulty) => void;
  elapsedMs: number;
  status: Status;
  onNewGame: () => void;
}) {
  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex gap-1 items-center">
        {(['easy', 'medium', 'hard'] as const).map(d => (
          <button
            key={d}
            aria-label={d === 'easy' ? 'Easy' : d === 'medium' ? 'Medium' : 'Hard'}
            onClick={() => onChangeDifficulty(d)}
            className={`px-2 py-1 rounded-lg text-xl transition-colors ${
              difficulty === d
                ? 'bg-indigo-500 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {d === 'easy' ? '🐣' : d === 'medium' ? '🐱' : '🦁'}
          </button>
        ))}
      </div>
      <div className="text-gray-700 text-sm">⏱️ {formatTime(elapsedMs)} {status === 'completed' ? '✅' : ''}</div>
      <button className="kid-button" onClick={onNewGame}>New Game</button>
    </div>
  );
}