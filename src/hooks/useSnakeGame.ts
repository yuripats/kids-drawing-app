/**
 * Snake Game Hook
 * Core game logic and state management
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import type {
  Position,
  Direction,
  GameState,
  Difficulty,
  GridSize,
  SnakeControls,
  SnakeConfig,
} from '../components/Games/Snake/types';
import { buildSnakeConfig } from '../components/Games/Snake/types';

const HIGH_SCORE_KEY = 'snakeHighScore';

// Direction vectors
const DIRECTION_VECTORS: Record<Direction, Position> = {
  up: { x: 0, y: -1 },
  down: { x: 0, y: 1 },
  left: { x: -1, y: 0 },
  right: { x: 1, y: 0 },
};

// Opposite directions (to prevent 180° turns)
const OPPOSITE_DIRECTIONS: Record<Direction, Direction> = {
  up: 'down',
  down: 'up',
  left: 'right',
  right: 'left',
};

/**
 * Get high score from localStorage
 */
const getHighScore = (): number => {
  const saved = localStorage.getItem(HIGH_SCORE_KEY);
  return saved ? parseInt(saved, 10) : 0;
};

/**
 * Save high score to localStorage
 */
const saveHighScore = (score: number): void => {
  localStorage.setItem(HIGH_SCORE_KEY, score.toString());
};

/**
 * Initialize snake at center of grid
 */
const initializeSnake = (config: SnakeConfig): Position[] => {
  const centerX = Math.floor(config.gridWidth / 2);
  const centerY = Math.floor(config.gridHeight / 2);

  const snake: Position[] = [];
  for (let i = 0; i < config.initialLength; i++) {
    snake.push({ x: centerX - i, y: centerY });
  }
  return snake;
};

/**
 * Spawn food at random position not occupied by snake
 */
const spawnFood = (snake: Position[], config: SnakeConfig): Position => {
  let attempts = 0;
  const maxAttempts = 100;

  while (attempts < maxAttempts) {
    const food: Position = {
      x: Math.floor(Math.random() * config.gridWidth),
      y: Math.floor(Math.random() * config.gridHeight),
    };

    // Check if food overlaps with snake
    const overlaps = snake.some(segment =>
      segment.x === food.x && segment.y === food.y
    );

    if (!overlaps) {
      return food;
    }

    attempts++;
  }

  // Fallback: return top-left corner (should never happen)
  return { x: 0, y: 0 };
};

/**
 * Initialize game state
 */
const initializeGameState = (difficulty: Difficulty, gridSize: GridSize): GameState => {
  const config = buildSnakeConfig(difficulty, gridSize);
  const snake = initializeSnake(config);
  const food = spawnFood(snake, config);
  const highScore = getHighScore();

  return {
    snake,
    food,
    direction: 'right',
    nextDirection: 'right',
    score: 0,
    highScore,
    gameStatus: 'ready',
    difficulty,
    gridSize,
  };
};

export const useSnakeGame = () => {
  const [difficulty, setDifficulty] = useState<Difficulty>('easy');
  const [gridSize, setGridSize] = useState<GridSize>('medium');
  const [gameState, setGameState] = useState<GameState>(() =>
    initializeGameState(difficulty, gridSize)
  );

  const gameLoopRef = useRef<number | null>(null);
  const nextDirectionRef = useRef<Direction>('right');

  /**
   * Get current config based on difficulty and grid size
   */
  const config: SnakeConfig = buildSnakeConfig(gameState.difficulty, gameState.gridSize);

  /**
   * Check if two positions are equal
   */
  const positionsEqual = (p1: Position, p2: Position): boolean => {
    return p1.x === p2.x && p1.y === p2.y;
  };

  /**
   * Check wall collision
   */
  const checkWallCollision = useCallback((head: Position): boolean => {
    return (
      head.x < 0 ||
      head.x >= config.gridWidth ||
      head.y < 0 ||
      head.y >= config.gridHeight
    );
  }, [config]);

  /**
   * Check self collision
   */
  const checkSelfCollision = useCallback((head: Position, snake: Position[]): boolean => {
    return snake.some(segment => positionsEqual(segment, head));
  }, []);

  /**
   * Game tick - move snake and update state
   */
  const gameTick = useCallback(() => {
    setGameState((prevState: GameState) => {
      if (prevState.gameStatus !== 'playing') {
        return prevState;
      }

      const { snake, food, score, highScore } = prevState;
      const direction = nextDirectionRef.current;

      // Calculate new head position
      const currentHead = snake[0];
      const vector: Position = DIRECTION_VECTORS[direction];
      const newHead: Position = {
        x: currentHead.x + vector.x,
        y: currentHead.y + vector.y,
      };

      // Check wall collision
      if (checkWallCollision(newHead)) {
        const finalHighScore = Math.max(score, highScore);
        saveHighScore(finalHighScore);
        return {
          ...prevState,
          gameStatus: 'gameOver',
          highScore: finalHighScore,
        };
      }

      // Check self collision
      if (checkSelfCollision(newHead, snake)) {
        const finalHighScore = Math.max(score, highScore);
        saveHighScore(finalHighScore);
        return {
          ...prevState,
          gameStatus: 'gameOver',
          highScore: finalHighScore,
        };
      }

      // Check food collision
      const ateFood = positionsEqual(newHead, food);
      let newSnake: Position[];
      let newFood = food;
      let newScore = score;

      if (ateFood) {
        // Grow snake (don't remove tail)
        newSnake = [newHead, ...snake];
        newFood = spawnFood(newSnake, config);
        newScore = score + 10;
      } else {
        // Move snake (remove tail)
        newSnake = [newHead, ...snake.slice(0, -1)];
      }

      return {
        ...prevState,
        snake: newSnake,
        food: newFood,
        direction,
        score: newScore,
        highScore: Math.max(newScore, highScore),
      };
    });
  }, [config, checkWallCollision, checkSelfCollision]);

  /**
   * Start game loop
   */
  const startGameLoop = useCallback(() => {
    if (gameLoopRef.current !== null) {
      clearInterval(gameLoopRef.current);
    }

    gameLoopRef.current = window.setInterval(() => {
      gameTick();
    }, config.tickMs);
  }, [gameTick, config.tickMs]);

  /**
   * Stop game loop
   */
  const stopGameLoop = useCallback(() => {
    if (gameLoopRef.current !== null) {
      clearInterval(gameLoopRef.current);
      gameLoopRef.current = null;
    }
  }, []);

  /**
   * Change direction (with validation)
   */
  const changeDirection = useCallback((newDirection: Direction) => {
    setGameState((prevState: GameState) => {
      // Don't allow direction change if game is not playing or ready
      if (prevState.gameStatus !== 'playing' && prevState.gameStatus !== 'ready') {
        return prevState;
      }

      // Start game if in ready state
      if (prevState.gameStatus === 'ready') {
        nextDirectionRef.current = newDirection;
        return {
          ...prevState,
          direction: newDirection,
          nextDirection: newDirection,
          gameStatus: 'playing' as const,
        };
      }

      // Prevent 180° turns
      const currentDirection = nextDirectionRef.current;
      const oppositeDirection: Direction = OPPOSITE_DIRECTIONS[currentDirection];
      if (oppositeDirection === newDirection) {
        return prevState;
      }

      // Buffer the direction change
      nextDirectionRef.current = newDirection;

      return {
        ...prevState,
        nextDirection: newDirection,
      };
    });
  }, []);

  /**
   * Toggle pause
   */
  const togglePause = useCallback(() => {
    setGameState((prevState: GameState) => {
      if (prevState.gameStatus === 'playing') {
        return { ...prevState, gameStatus: 'paused' as const };
      } else if (prevState.gameStatus === 'paused') {
        return { ...prevState, gameStatus: 'playing' as const };
      }
      return prevState;
    });
  }, []);

  /**
   * Reset game
   */
  const resetGame = useCallback(() => {
    stopGameLoop();
    const newState = initializeGameState(gameState.difficulty, gameState.gridSize);
    nextDirectionRef.current = 'right';
    setGameState(newState);
  }, [stopGameLoop, gameState.difficulty, gameState.gridSize]);

  /**
   * Change difficulty (resets game, keeps grid size)
   */
  const changeDifficulty = useCallback((newDifficulty: Difficulty) => {
    stopGameLoop();
    const newState = initializeGameState(newDifficulty, gameState.gridSize);
    nextDirectionRef.current = 'right';
    setGameState(newState);
    setDifficulty(newDifficulty);
  }, [stopGameLoop, gameState.gridSize]);

  /**
   * Change grid size (resets game, keeps difficulty)
   */
  const changeGridSize = useCallback((newGridSize: GridSize) => {
    stopGameLoop();
    const newState = initializeGameState(gameState.difficulty, newGridSize);
    nextDirectionRef.current = 'right';
    setGameState(newState);
    setGridSize(newGridSize);
  }, [stopGameLoop, gameState.difficulty]);

  /**
   * Handle keyboard input
   */
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          e.preventDefault();
          changeDirection('up');
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          e.preventDefault();
          changeDirection('down');
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          e.preventDefault();
          changeDirection('left');
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          e.preventDefault();
          changeDirection('right');
          break;
        case ' ':
          e.preventDefault();
          togglePause();
          break;
        case 'r':
        case 'R':
          if (gameState.gameStatus === 'gameOver') {
            e.preventDefault();
            resetGame();
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [changeDirection, togglePause, resetGame, gameState.gameStatus]);

  /**
   * Manage game loop based on game status
   */
  useEffect(() => {
    if (gameState.gameStatus === 'playing') {
      startGameLoop();
    } else {
      stopGameLoop();
    }

    return () => stopGameLoop();
  }, [gameState.gameStatus, startGameLoop, stopGameLoop]);

  /**
   * Cleanup on unmount
   */
  useEffect(() => {
    return () => {
      stopGameLoop();
    };
  }, [stopGameLoop]);

  const controls: SnakeControls = {
    changeDirection,
    togglePause,
    resetGame,
    setDifficulty: changeDifficulty,
    setGridSize: changeGridSize,
  };

  return {
    gameState,
    config,
    controls,
  };
};
