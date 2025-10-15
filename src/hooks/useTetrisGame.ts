import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { Cell, Piece, TetrominoType, TetrisConfig, TetrisState } from '../components/Games/Tetris/types';

const TYPES: TetrominoType[] = ['I', 'O', 'T', 'S', 'Z', 'J', 'L'];

// Rotation shapes as arrays of [x, y] offsets from piece origin
const SHAPES: Record<TetrominoType, [number, number][][]> = {
  I: [
    [[-1, 0], [0, 0], [1, 0], [2, 0]], // ----
    [[1, -1], [1, 0], [1, 1], [1, 2]], // |
    [[-1, 1], [0, 1], [1, 1], [2, 1]],
    [[0, -1], [0, 0], [0, 1], [0, 2]],
  ],
  O: [
    [[0, 0], [1, 0], [0, 1], [1, 1]],
    [[0, 0], [1, 0], [0, 1], [1, 1]],
    [[0, 0], [1, 0], [0, 1], [1, 1]],
    [[0, 0], [1, 0], [0, 1], [1, 1]],
  ],
  T: [
    [[-1, 0], [0, 0], [1, 0], [0, 1]],
    [[0, -1], [0, 0], [0, 1], [1, 0]],
    [[-1, 0], [0, 0], [1, 0], [0, -1]],
    [[0, -1], [0, 0], [0, 1], [-1, 0]],
  ],
  S: [
    [[0, 0], [1, 0], [-1, 1], [0, 1]],
    [[0, -1], [0, 0], [1, 0], [1, 1]],
    [[0, 0], [1, 0], [-1, 1], [0, 1]],
    [[0, -1], [0, 0], [1, 0], [1, 1]],
  ],
  Z: [
    [[-1, 0], [0, 0], [0, 1], [1, 1]],
    [[1, -1], [0, 0], [1, 0], [0, 1]],
    [[-1, 0], [0, 0], [0, 1], [1, 1]],
    [[1, -1], [0, 0], [1, 0], [0, 1]],
  ],
  J: [
    [[-1, 0], [0, 0], [1, 0], [-1, 1]],
    [[0, -1], [0, 0], [0, 1], [1, -1]],
    [[-1, 0], [0, 0], [1, 0], [1, -1]],
    [[0, -1], [0, 0], [0, 1], [-1, 1]],
  ],
  L: [
    [[-1, 0], [0, 0], [1, 0], [1, 1]],
    [[0, -1], [0, 0], [0, 1], [1, 1]],
    [[-1, -1], [-1, 0], [0, 0], [1, 0]],
    [[-1, -1], [0, -1], [0, 0], [0, 1]],
  ],
};

function createEmptyBoard(height: number, width: number): Cell[][] {
  return Array.from({ length: height }, () => Array.from({ length: width }, () => null));
}

function collides(board: Cell[][], piece: Piece): boolean {
  const { x, y, rotation, type } = piece;
  const shape = SHAPES[type][rotation % 4];
  const height = board.length;
  const width = board[0]?.length ?? 0;
  for (const [dx, dy] of shape) {
    const cx = x + dx;
    const cy = y + dy;
    if (cx < 0 || cx >= width || cy >= height) return true;
    if (cy >= 0 && board[cy][cx]) return true;
  }
  return false;
}

function mergePiece(board: Cell[][], piece: Piece): Cell[][] {
  const { x, y, rotation, type } = piece;
  const shape = SHAPES[type][rotation % 4];
  const clone = board.map((row) => row.slice());
  for (const [dx, dy] of shape) {
    const cx = x + dx;
    const cy = y + dy;
    if (cy >= 0) {
      clone[cy][cx] = { type, locked: true };
    }
  }
  return clone;
}

function clearLines(board: Cell[][]): { board: Cell[][]; cleared: number } {
  const width = board[0]?.length ?? 0;
  const remaining: Cell[][] = [];
  let cleared = 0;
  for (const row of board) {
    if (row.every((c) => c)) {
      cleared++;
    } else {
      remaining.push(row);
    }
  }
  while (remaining.length < board.length) {
    remaining.unshift(Array.from({ length: width }, () => null));
  }
  return { board: remaining, cleared };
}

function nextLevelSpeed(level: number): number {
  // Simple speed curve: faster every 10 lines
  return Math.max(120, 800 - (level - 1) * 60);
}

function makeBag(): TetrominoType[] {
  const bag = [...TYPES];
  for (let i = bag.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [bag[i], bag[j]] = [bag[j], bag[i]];
  }
  return bag;
}

export function useTetrisGame(initial: TetrisConfig) {
  const [state, setState] = useState<TetrisState>(() => ({
    board: createEmptyBoard(initial.height, initial.width),
    active: null,
    nextQueue: makeBag(),
    score: 0,
    lines: 0,
    level: 1,
    gameOver: false,
    tickMs: initial.tickMs ?? 800,
  }));

  const configRef = useRef<TetrisConfig>(initial);
  const runningRef = useRef<boolean>(true);

  const spawnPiece = useCallback((prev: TetrisState): TetrisState => {
    const queue = prev.nextQueue.length ? prev.nextQueue : makeBag();
    const [type, ...rest] = queue;
    const width = configRef.current.width;
    const piece: Piece = {
      type,
      rotation: 0,
      x: Math.floor(width / 2) - 1,
      y: -1, // spawn just above the board
    };
    if (collides(prev.board, piece)) {
      return { ...prev, active: null, gameOver: true };
    }
    return { ...prev, active: piece, nextQueue: rest.length ? rest : makeBag() };
  }, []);

  // Start a new game
  const reset = useCallback((cfg?: Partial<TetrisConfig>) => {
    if (cfg) {
      configRef.current = { ...configRef.current, ...cfg };
    }
    const width = configRef.current.width;
    const height = configRef.current.height;
    const tickMs = cfg?.tickMs ?? state.tickMs;
    setState(() => ({
      board: createEmptyBoard(height, width),
      active: null,
      nextQueue: makeBag(),
      score: 0,
      lines: 0,
      level: 1,
      gameOver: false,
      tickMs: tickMs,
    }));
  }, [state.tickMs]);

  // Game tick: gravity
  const tick = useCallback(() => {
    setState((prev) => {
      if (prev.gameOver || !runningRef.current) return prev;
      if (!prev.active) return spawnPiece(prev);

      const moved: Piece = { ...prev.active, y: prev.active.y + 1 };
      if (!collides(prev.board, moved)) {
        return { ...prev, active: moved };
      }
      // lock piece
      const merged = mergePiece(prev.board, prev.active);
      const { board: clearedBoard, cleared } = clearLines(merged);
      const newLines = prev.lines + cleared;
      const newLevel = 1 + Math.floor(newLines / 10);
      const gained = [0, 40, 100, 300, 1200][cleared] ?? 0;
      const newScore = prev.score + gained * newLevel;
      return spawnPiece({
        ...prev,
        board: clearedBoard,
        lines: newLines,
        level: newLevel,
        score: newScore,
        tickMs: nextLevelSpeed(newLevel),
      });
    });
  }, [spawnPiece]);

  // Timer loop
  useEffect(() => {
    runningRef.current = true;
    const id = setInterval(tick, state.tickMs);
    return () => clearInterval(id);
  }, [tick, state.tickMs]);

  const tryMove = useCallback((dx: number, dy: number) => {
    setState((prev) => {
      if (!prev.active || prev.gameOver) return prev;
      const moved: Piece = { ...prev.active, x: prev.active.x + dx, y: prev.active.y + dy };
      if (collides(prev.board, moved)) return prev;
      return { ...prev, active: moved };
    });
  }, []);

  const rotate = useCallback(() => {
    setState((prev) => {
      if (!prev.active || prev.gameOver) return prev;
      const rotated: Piece = { ...prev.active, rotation: (prev.active.rotation + 1) % 4 };
      // simple rotation: if collides, cancel (no wall-kicks in MVP)
      if (collides(prev.board, rotated)) return prev;
      return { ...prev, active: rotated };
    });
  }, []);

  const softDrop = useCallback(() => tryMove(0, 1), [tryMove]);
  const moveLeft = useCallback(() => tryMove(-1, 0), [tryMove]);
  const moveRight = useCallback(() => tryMove(1, 0), [tryMove]);

  const pause = useCallback(() => { runningRef.current = false; }, []);
  const resume = useCallback(() => { runningRef.current = true; }, []);

  // Derived board with active overlaid for rendering
  const renderBoard: Cell[][] = useMemo(() => {
    const base = state.board.map((row) => row.slice());
    const p = state.active;
    if (!p) return base;
    for (const [dx, dy] of SHAPES[p.type][p.rotation % 4]) {
      const cx = p.x + dx;
      const cy = p.y + dy;
      if (cy >= 0 && base[cy] && base[cy][cx] === null) {
        base[cy][cx] = { type: p.type, locked: false };
      }
    }
    return base;
  }, [state.board, state.active]);

  return {
    state,
    board: renderBoard,
    controls: { moveLeft, moveRight, rotate, softDrop, pause, resume, reset },
    setConfig: (cfg: Partial<TetrisConfig>) => reset(cfg),
  } as const;
}