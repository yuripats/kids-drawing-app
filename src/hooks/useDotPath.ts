/**
 * useDotPath Hook
 * Manages game state and logic for Dot Path puzzle game
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import type {
  GameState,
  DotState,
  DotPosition,
  Difficulty,
  DifficultySettings,
  GameStatus,
} from '../components/Games/DotPath/types';
import {
  isSamePosition,
  areAdjacent,
  findDot,
  generateNumberedDotsPuzzle,
} from '../components/Games/DotPath/utils';

const DIFFICULTY_SETTINGS: Record<Difficulty, DifficultySettings> = {
  easy: {
    name: 'Easy',
    gridSize: 5,
    dotCount: 6,
  },
  medium: {
    name: 'Medium',
    gridSize: 6,
    dotCount: 10,
  },
  hard: {
    name: 'Hard',
    gridSize: 7,
    dotCount: 15,
  },
};

const STORAGE_KEY = 'dotpath_best_times';

export const useDotPath = (initialDifficulty: Difficulty = 'easy') => {
  const timerRef = useRef<number>();

  // Load best times from localStorage
  const loadBestTimes = (): Record<Difficulty, number> => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (error) {
      console.error('Failed to load best times:', error);
    }
    return { easy: 0, medium: 0, hard: 0 };
  };

  // Save best times to localStorage
  const saveBestTimes = (times: Record<Difficulty, number>) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(times));
    } catch (error) {
      console.error('Failed to save best times:', error);
    }
  };

  // Initialize game state
  const initializeGame = useCallback(
    (difficulty: Difficulty): GameState => {
      const settings = DIFFICULTY_SETTINGS[difficulty];
      const { gridSize, dotCount } = settings;

      // Generate numbered dot positions
      const dotPositions = generateNumberedDotsPuzzle(gridSize, dotCount);

      // Create a map of positions to numbers for quick lookup
      const positionToNumber = new Map<string, number>();
      dotPositions.forEach((pos, index) => {
        const key = `${pos.row},${pos.col}`;
        positionToNumber.set(key, index + 1); // Numbers are 1-indexed
      });

      // Create grid
      const grid: DotState[][] = [];
      for (let row = 0; row < gridSize; row++) {
        grid[row] = [];
        for (let col = 0; col < gridSize; col++) {
          const position = { row, col };
          const key = `${row},${col}`;
          const number = positionToNumber.get(key);

          if (number !== undefined) {
            // This cell has a numbered dot
            grid[row][col] = {
              position,
              visited: false,
              number,
              isEmpty: false,
            };
          } else {
            // This cell is empty (no dot)
            grid[row][col] = {
              position,
              visited: false,
              number: 0, // 0 means no number
              isEmpty: true,
            };
          }
        }
      }

      return {
        grid,
        path: [],
        currentDot: null,
        gridSize,
        difficulty,
        moves: 0,
        timer: 0,
        bestTimes: loadBestTimes(),
        gameStatus: 'ready',
        totalDots: dotCount,
        nextNumber: 1, // Start with connecting to dot #1
      };
    },
    []
  );

  const [gameState, setGameState] = useState<GameState>(() =>
    initializeGame(initialDifficulty)
  );

  // Timer effect
  useEffect(() => {
    if (gameState.gameStatus === 'playing') {
      timerRef.current = window.setInterval(() => {
        setGameState(prev => ({
          ...prev,
          timer: prev.timer + 1,
        }));
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [gameState.gameStatus]);

  /**
   * Handle clicking/tapping a dot
   */
  const handleDotClick = useCallback(
    (position: DotPosition) => {
      setGameState(prev => {
        // Can't play if game is completed
        if (prev.gameStatus === 'completed') return prev;

        const dot = findDot(prev.grid, position);
        if (!dot) return prev;

        // Can't click empty cells
        if (dot.isEmpty) return prev;

        // Already visited
        if (dot.visited) return prev;

        // Must click dots in sequential order
        if (dot.number !== prev.nextNumber) {
          // Wrong number - must click the next number in sequence
          return prev;
        }

        // First move - starting with dot #1
        if (prev.path.length === 0) {
          if (dot.number !== 1) {
            // Must start with dot #1
            return prev;
          }

          // Start the game
          const newGrid = prev.grid.map(row =>
            row.map(d =>
              isSamePosition(d.position, position)
                ? { ...d, visited: true }
                : d
            )
          );

          return {
            ...prev,
            grid: newGrid,
            path: [position],
            currentDot: position,
            gameStatus: 'playing',
            moves: 1,
            nextNumber: 2, // Next dot to click is #2
          };
        }

        // Subsequent moves - must be adjacent to current dot
        if (prev.currentDot && !areAdjacent(prev.currentDot, position)) {
          return prev; // Not adjacent
        }

        // Valid move
        const newPath = [...prev.path, position];
        const newGrid = prev.grid.map(row =>
          row.map(d =>
            isSamePosition(d.position, position) ? { ...d, visited: true } : d
          )
        );

        // Check if game is won
        const isComplete = newPath.length === prev.totalDots;

        let newGameStatus: GameStatus = prev.gameStatus;
        let newBestTimes = prev.bestTimes;

        if (isComplete) {
          newGameStatus = 'completed';

          // Update best time
          if (
            prev.bestTimes[prev.difficulty] === 0 ||
            prev.timer < prev.bestTimes[prev.difficulty]
          ) {
            newBestTimes = {
              ...prev.bestTimes,
              [prev.difficulty]: prev.timer,
            };
            saveBestTimes(newBestTimes);
          }
        }

        return {
          ...prev,
          grid: newGrid,
          path: newPath,
          currentDot: position,
          moves: prev.moves + 1,
          gameStatus: newGameStatus,
          bestTimes: newBestTimes,
          nextNumber: prev.nextNumber + 1,
        };
      });
    },
    []
  );

  /**
   * Undo last move
   */
  const undoMove = useCallback(() => {
    setGameState(prev => {
      if (prev.path.length === 0) return prev;

      const newPath = prev.path.slice(0, -1);
      const lastPos = prev.path[prev.path.length - 1];

      const newGrid = prev.grid.map(row =>
        row.map(d =>
          isSamePosition(d.position, lastPos) ? { ...d, visited: false } : d
        )
      );

      return {
        ...prev,
        grid: newGrid,
        path: newPath,
        currentDot: newPath.length > 0 ? newPath[newPath.length - 1] : null,
        gameStatus: newPath.length > 0 ? 'playing' : 'ready',
        nextNumber: newPath.length + 1, // Decrement next number to connect
      };
    });
  }, []);

  /**
   * Clear/restart the game
   */
  const clearGame = useCallback(() => {
    setGameState(prev => initializeGame(prev.difficulty));
  }, [initializeGame]);

  /**
   * Generate new puzzle
   */
  const newPuzzle = useCallback(() => {
    setGameState(prev => initializeGame(prev.difficulty));
  }, [initializeGame]);

  /**
   * Change difficulty
   */
  const setDifficulty = useCallback(
    (difficulty: Difficulty) => {
      setGameState(initializeGame(difficulty));
    },
    [initializeGame]
  );

  return {
    gameState,
    handleDotClick,
    undoMove,
    clearGame,
    newPuzzle,
    setDifficulty,
    difficultySettings: DIFFICULTY_SETTINGS,
  };
};
