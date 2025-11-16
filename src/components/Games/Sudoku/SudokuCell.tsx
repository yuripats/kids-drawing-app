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
  // Base styles with default white background
  const base = 'w-full h-full flex items-center justify-center select-none text-base sm:text-lg md:text-xl bg-white';
  const givenCls = cell.given ? 'font-bold text-gray-900' : 'text-primary-700';

  // Build background color - order matters! Conflict > Highlighted > Selected > Default(white)
  let bgColor = '';
  if (cell.conflict.row || cell.conflict.col || cell.conflict.box) {
    bgColor = 'bg-red-100';
  } else if (highlighted && !selected) {
    bgColor = 'bg-primary-100';
  } else if (selected) {
    bgColor = 'bg-primary-50';
  }

  const ringCls = selected ? 'ring-2 ring-primary-400 ring-inset' : highlighted ? 'ring-1 ring-primary-200 ring-inset' : '';

  return (
    <button
      aria-label={`r${row+1} c${col+1} ${cell.given ? 'given' : 'editable'}`}
      className={`${base} ${bgColor} ${givenCls} ${ringCls}`}
      onClick={onSelect}
    >
      {cell.value ?? ''}
    </button>
  );
}