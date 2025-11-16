import { Cell } from '../../../types/sudoku';

export default function SudokuCell({
  cell,
  row,
  col,
  selected,
  highlighted,
  onSelect,
}: {
  cell: Cell;
  row: number;
  col: number;
  selected: boolean;
  highlighted: boolean;
  onSelect: () => void;
}) {
  const base = 'w-full aspect-square flex items-center justify-center select-none text-base sm:text-lg md:text-xl';
  const givenCls = cell.given ? 'font-bold text-gray-900' : 'text-primary-700';
  const selectedCls = selected ? 'ring-2 ring-primary-400' : '';
  const highlightedCls = highlighted && !selected ? 'bg-primary-100 ring-1 ring-primary-200' : '';
  const conflictCls = (cell.conflict.row || cell.conflict.col || cell.conflict.box) ? 'bg-red-100' : '';

  return (
    <button
      aria-label={`r${row+1} c${col+1} ${cell.given ? 'given' : 'editable'}`}
      className={`${base} ${givenCls} ${selectedCls} ${highlightedCls} ${conflictCls}`}
      onClick={onSelect}
    >
      {cell.value ?? ''}
    </button>
  );
}