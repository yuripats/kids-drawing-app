import { Cell, Settings, Selection } from '../../../types/sudoku';
import SudokuCell from './SudokuCell';

export default function SudokuBoard({
  board,
  selection,
  settings,
  onSelect,
}: {
  board: Cell[];
  selection: Selection;
  settings: Settings;
  onSelect: (r: number, c: number) => void;
}) {
  // Determine the value of the selected cell for highlighting
  const selectedCellValue = selection && settings.highlightSameNumbers
    ? board[selection.row * 9 + selection.col]?.value
    : null;

  return (
    <div className="p-2">
      <div className="grid grid-cols-9 gap-0.5 bg-gray-300 p-1 rounded-lg">
        {board.map((cell, idx) => {
          const r = Math.floor(idx / 9);
          const c = idx % 9;
          const isBoxBorderRight = c % 3 === 2 && c !== 8;
          const isBoxBorderBottom = r % 3 === 2 && r !== 8;
          
          // Determine if this cell should be highlighted (same number as selected)
          const isHighlighted = selectedCellValue !== null && 
                               cell.value === selectedCellValue &&
                               cell.value !== null;
          
          return (
            <div
              key={idx}
              className={`bg-white ${isBoxBorderRight ? 'border-r-4 border-gray-300' : ''} ${isBoxBorderBottom ? 'border-b-4 border-gray-300' : ''}`}
            >
              <SudokuCell
                cell={cell}
                row={r}
                col={c}
                selected={selection?.row === r && selection?.col === c}
                highlighted={isHighlighted}
                onSelect={() => onSelect(r, c)}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}