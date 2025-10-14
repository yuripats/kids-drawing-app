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
      <div className="flex gap-2 items-center">
        <label className="text-sm text-gray-700">Difficulty:</label>
        <select
          className="kid-input"
          value={difficulty}
          onChange={(e) => onChangeDifficulty(e.target.value as Difficulty)}
        >
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>
      </div>
      <div className="text-gray-700 text-sm">⏱️ {formatTime(elapsedMs)} {status === 'completed' ? '✅' : ''}</div>
      <button className="kid-button" onClick={onNewGame}>New Game</button>
    </div>
  );
}