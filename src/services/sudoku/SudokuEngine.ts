import { Difficulty } from '../../types/sudoku';
import { fromPuzzleString, validateConflicts } from '../../utils/sudoku';
import { Cell } from '../../types/sudoku';

const EASY_PUZZLES: string[] = [
  // 0 = empty; example easy puzzle
  '530070000600195000098000060800060003400803001700020006060000280000419005000080079'
];

const MEDIUM_PUZZLES: string[] = [
  '000260701680070090190004500820100040004602900050003028009300074040050036703018000'
];

const HARD_PUZZLES: string[] = [
  '005300000800000020070010500400005300010070006003200080060000000000418000000000000'
];

function pickPuzzle(d: Difficulty): string {
  const pool = d === 'easy' ? EASY_PUZZLES : d === 'medium' ? MEDIUM_PUZZLES : HARD_PUZZLES;
  return pool[Math.floor(Math.random() * pool.length)];
}

export function loadPuzzle(d: Difficulty): { id: string; board: Cell[] } {
  const p = pickPuzzle(d);
  const id = `${d}-${Date.now()}`;
  const raw = fromPuzzleString(p);
  const validated = validateConflicts(raw);
  return { id, board: validated };
}