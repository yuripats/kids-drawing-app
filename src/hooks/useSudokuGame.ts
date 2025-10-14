import { useCallback, useEffect, useRef, useState } from 'react';
import { Difficulty, GameState, Settings } from '../types/sudoku';
import { createEmptyBoard, validateConflicts } from '../utils/sudoku';
import { loadPuzzle } from '../services/sudoku/SudokuEngine';

interface Options { difficulty: Difficulty }

const ACTIVE_KEY = 'kda:sudoku:active';
const GAME_KEY = (id: string) => `kda:sudoku:game:${id}`;

export function useSudokuGame({ difficulty }: Options) {
  const [game, setGame] = useState<GameState>(() => initialGame(difficulty));
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    // resume active game if present
    const activeId = localStorage.getItem(ACTIVE_KEY);
    if (activeId) {
      const raw = localStorage.getItem(GAME_KEY(activeId));
      if (raw) {
        try {
          const parsed: GameState = revive(JSON.parse(raw));
          setGame(parsed);
          return;
        } catch {
          // Ignore parsing errors for invalid stored games
        }
      }
    }
    // otherwise new game
    newGame(difficulty);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // timer
  useEffect(() => {
    if (game.status === 'in_progress') {
      timerRef.current = window.setInterval(() => {
        setGame((g) => ({ ...g, elapsedMs: g.elapsedMs + 1000 }));
      }, 1000);
      return () => { if (timerRef.current) window.clearInterval(timerRef.current); };
    }
  }, [game.status]);

  const persist = useCallback((g: GameState) => {
    localStorage.setItem(ACTIVE_KEY, g.id);
    localStorage.setItem(GAME_KEY(g.id), JSON.stringify(serialize(g)));
  }, []);

  const selectCell = useCallback((row: number, col: number) => {
    setGame((g) => ({ ...g, selection: { row, col } }));
  }, []);

  const setValue = useCallback((n: number) => {
    setGame((g) => {
      if (!g.selection) return g;
      const idx = g.selection.row * 9 + g.selection.col;
      const cell = g.board[idx];
      if (cell.given) return g;
      const prev = g.board;
      const next = [...prev];
      next[idx] = { ...cell, value: n, notes: new Set<number>(), conflict: { row: false, col: false, box: false } };
      const validated = validateConflicts(next);
      const completed = validated.every((c) => c.value && !c.conflict.row && !c.conflict.col && !c.conflict.box);
      const newState: GameState = {
        ...g,
        board: validated,
        status: completed ? 'completed' : 'in_progress',
        history: [...g.history, prev].slice(-50),
        future: [],
      };
      persist(newState);
      return newState;
    });
  }, [persist]);

  const clearCell = useCallback(() => {
    setGame((g) => {
      if (!g.selection) return g;
      const idx = g.selection.row * 9 + g.selection.col;
      const cell = g.board[idx];
      if (cell.given) return g;
      const prev = g.board;
      const next = [...prev];
      next[idx] = { ...cell, value: null, conflict: { row: false, col: false, box: false } };
      const validated = validateConflicts(next);
      const newState: GameState = { ...g, board: validated, history: [...g.history, prev].slice(-50), future: [] };
      persist(newState);
      return newState;
    });
  }, [persist]);

  const toggleNoteMode = useCallback(() => {
    setGame((g) => ({ ...g, mode: g.mode === 'value' ? 'note' : 'value' }));
  }, []);

  const toggleNote = useCallback((n: number) => {
    setGame((g) => {
      if (!g.selection) return g;
      const idx = g.selection.row * 9 + g.selection.col;
      const cell = g.board[idx];
      if (cell.given) return g;
      const prev = g.board;
      const next = [...prev];
      const newNotes = new Set(cell.notes);
      if (newNotes.has(n)) newNotes.delete(n); else newNotes.add(n);
      next[idx] = { ...cell, notes: newNotes };
      const newState: GameState = { ...g, board: next, history: [...g.history, prev].slice(-50), future: [] };
      persist(newState);
      return newState;
    });
  }, [persist]);

  const undo = useCallback(() => {
    setGame((g) => {
      if (g.history.length === 0) return g;
      const prev = g.history[g.history.length - 1];
      const newHistory = g.history.slice(0, -1);
      const newFuture = [g.board, ...g.future].slice(0, 50);
      const validated = validateConflicts(prev);
      const newState: GameState = { ...g, board: validated, history: newHistory, future: newFuture };
      persist(newState);
      return newState;
    });
  }, [persist]);

  const redo = useCallback(() => {
    setGame((g) => {
      if (g.future.length === 0) return g;
      const next = g.future[0];
      const restFuture = g.future.slice(1);
      const newHistory = [...g.history, g.board].slice(-50);
      const validated = validateConflicts(next);
      const newState: GameState = { ...g, board: validated, history: newHistory, future: restFuture };
      persist(newState);
      return newState;
    });
  }, [persist]);

  const newGame = useCallback((d: Difficulty) => {
    const { id, board } = loadPuzzle(d);
    const base: GameState = {
      id,
      difficulty: d,
      board,
      selection: { row: 0, col: 0 },
      mode: 'value',
      history: [],
      future: [],
      elapsedMs: 0,
      status: 'in_progress',
      settings: defaultSettings(),
      version: 1,
    };
    setGame(base);
    persist(base);
  }, [persist]);

  const canUndo = game.history.length > 0;
  const canRedo = game.future.length > 0;

  return {
    board: game.board,
    selection: game.selection,
    mode: game.mode,
    settings: game.settings,
    elapsedMs: game.elapsedMs,
    status: game.status,
    canUndo,
    canRedo,
    selectCell,
    setValue,
    clearCell,
    toggleNoteMode,
    toggleNote,
    undo,
    redo,
    newGame,
  };
}

function initialGame(d: Difficulty): GameState {
  return {
    id: 'init',
    difficulty: d,
    board: createEmptyBoard(),
    selection: { row: 0, col: 0 },
    mode: 'value',
    history: [],
    future: [],
    elapsedMs: 0,
    status: 'in_progress',
    settings: defaultSettings(),
    version: 1,
  };
}

function defaultSettings(): Settings {
  return {
    validateOnInput: true,
    highlightPeers: true,
    highlightSameNumbers: true,
    haptics: false,
  };
}

function serialize(g: GameState) {
  return {
    ...g,
    board: g.board.map((c) => ({ ...c, notes: Array.from(c.notes) })),
  };
}

interface SerializedCell {
  value: number | null;
  given: boolean;
  notes: number[];
  conflict: { row: boolean; col: boolean; box: boolean };
}

interface SerializedGameState {
  id: string;
  difficulty: Difficulty;
  board: SerializedCell[];
  selection: { row: number; col: number } | null;
  mode: 'value' | 'note';
  history: SerializedCell[][];
  future: SerializedCell[][];
  elapsedMs: number;
  status: 'in_progress' | 'completed';
  settings: Settings;
  version: number;
}

function revive(g: SerializedGameState): GameState {
  return {
    ...g,
    board: g.board.map((c) => ({ ...c, notes: new Set<number>(c.notes || []) })),
    history: g.history.map((boardState) => 
      boardState.map((c) => ({ ...c, notes: new Set<number>(c.notes || []) }))
    ),
    future: g.future.map((boardState) => 
      boardState.map((c) => ({ ...c, notes: new Set<number>(c.notes || []) }))
    ),
  };
}
