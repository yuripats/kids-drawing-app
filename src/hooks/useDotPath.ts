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
  generateHamiltonianPath,
} from '../components/Games/DotPath/utils';

const DIFFICULTY_SETTINGS: Record<Difficulty, DifficultySettings> = {
  easy: {
    name: 'Easy',
    gridSize: 4,
    showNumbers: true,
    defineEnd: true,
  },
  medium: {
    name: 'Medium',
    gridSize: 5,
    showNumbers: false,
    defineEnd: true,
  },
  hard: {
    name: 'Hard',
    gridSize: 6,
    showNumbers: false,
    defineEnd: false,
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
      const { gridSize, showNumbers, defineEnd } = settings;

      // Generate solution path
      const solutionPath = generateHamiltonianPath(gridSize);
      const startPoint = solutionPath[0];
      const endPoint = defineEnd
        ? solutionPath[solutionPath.length - 1]
        : { row: -1, col: -1 }; // No specific end point

      // Create grid
      const grid: DotState[][] = [];
      for (let row = 0; row < gridSize; row++) {
        grid[row] = [];
        for (let col = 0; col < gridSize; col++) {
          const position = { row, col };
          const isStart = isSamePosition(position, startPoint);
          const isEnd = defineEnd && isSamePosition(position, endPoint);

          // Find number in solution path
          const number = showNumbers
            ? solutionPath.findIndex(p => isSamePosition(p, position)) + 1
            : undefined;

          grid[row][col] = {
            position,
            visited: false,
            isStart,
            isEnd,
            number,
          };
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
        showNumbers,
        startPoint,
        endPoint,
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

        // Already visited
        if (dot.visited) return prev;

        // First move - must start at start point for easy/medium
        if (prev.path.length === 0) {
          const settings = DIFFICULTY_SETTINGS[prev.difficulty];
          if (settings.defineEnd && !dot.isStart) {
            // Must start at the start point
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
          };
        }

        // Subsequent moves - must be adjacent to current dot
        if (prev.currentDot && !areAdjacent(prev.currentDot, position)) {
          return prev; // Not adjacent
        }

        // For numbered mode (easy), must follow sequence
        if (prev.showNumbers && dot.number) {
          const expectedNumber = prev.path.length + 1;
          if (dot.number !== expectedNumber) {
            return prev; // Wrong number
          }
        }

        // Valid move
        const newPath = [...prev.path, position];
        const newGrid = prev.grid.map(row =>
          row.map(d =>
            isSamePosition(d.position, position) ? { ...d, visited: true } : d
          )
        );

        // Check if game is won
        const totalDots = prev.gridSize * prev.gridSize;
        const isComplete = newPath.length === totalDots;

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
