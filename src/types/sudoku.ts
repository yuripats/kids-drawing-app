export type Difficulty = 'easy' | 'medium' | 'hard';
export type Status = 'in_progress' | 'completed';

export interface Cell {
  value: number | null;
  given: boolean;
  notes: Set<number>;
  conflict: { row: boolean; col: boolean; box: boolean };
}

export type Selection = { row: number; col: number } | null;

export interface Settings {
  validateOnInput: boolean;
  highlightPeers: boolean;
  highlightSameNumbers: boolean;
  haptics: boolean;
}

export interface GameState {
  id: string;
  difficulty: Difficulty;
  board: Cell[]; // length 81
  selection: Selection;
  mode: 'value' | 'note';
  history: Cell[][]; // past board states
  future: Cell[][]; // redo stack
  elapsedMs: number;
  status: Status;
  settings: Settings;
  version: number;
}