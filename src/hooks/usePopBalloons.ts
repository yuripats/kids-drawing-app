/**
 * Pop the Balloons Game Hook
 * Manages game state and logic for Pop the Balloons
 * Refactored from 12 useState calls to a single useReducer (PR-4c1)
 */

import { useReducer, useEffect, useCallback, useRef } from 'react';
import type {
  PopBalloonsState,
  Balloon,
  BalloonType,
  Difficulty,
  GridSize,
} from '../components/Games/PopBalloons/types';
import {
  difficultySettings,
  gridSizeSettings,
  POINTS,
  balloonColors,
  COMBO_WINDOW,
} from '../components/Games/PopBalloons/constants';
import { saveHighScore, getHighScore, playSound, randomChoice } from '../utils/gameUtils';

const GAME_KEY = 'popBalloons';

// Internal state — superset of public PopBalloonsState; adds lastPopTime for combo timing
interface InternalState extends PopBalloonsState {
  lastPopTime: number;
}

// Discriminated union of all state transitions
export type BalloonAction =
  | { type: 'RESET'; difficulty: Difficulty; gridSize: GridSize; highScore: number }
  | { type: 'START' }
  | { type: 'SET_DIFFICULTY'; difficulty: Difficulty }
  | { type: 'SET_GRID_SIZE'; gridSize: GridSize }
  | { type: 'SPAWN_BALLOON'; balloon: Balloon }
  | { type: 'POP_BALLOON'; balloonId: string; now: number }
  | { type: 'EXPIRE_BALLOON'; balloonId: string }
  | { type: 'TICK' }
  | { type: 'LOAD_HIGH_SCORE'; highScore: number };

export function makeInitialState(
  difficulty: Difficulty,
  gridSize: GridSize = 'small',
  highScore = 0,
): InternalState {
  const settings = difficultySettings[difficulty];
  return {
    difficulty,
    gridSize,
    balloons: [],
    score: 0,
    highScore,
    combo: 0,
    maxCombo: 0,
    gameStatus: 'ready',
    timeRemaining: settings.gameDuration,
    lives: settings.startingLives,
    totalPopped: 0,
    totalMissed: 0,
    lastPopTime: 0,
  };
}

export function balloonReducer(state: InternalState, action: BalloonAction): InternalState {
  switch (action.type) {
    case 'RESET':
      return makeInitialState(action.difficulty, action.gridSize, action.highScore);

    case 'START':
      return { ...state, gameStatus: 'playing', lastPopTime: Date.now() };

    case 'SET_DIFFICULTY':
      // Changing difficulty resets the game (matches original initializeGame re-run behaviour)
      return makeInitialState(action.difficulty, state.gridSize, state.highScore);

    case 'SET_GRID_SIZE':
      return { ...state, gridSize: action.gridSize };

    case 'SPAWN_BALLOON':
      return { ...state, balloons: [...state.balloons, action.balloon] };

    case 'POP_BALLOON': {
      const balloon = state.balloons.find(b => b.id === action.balloonId);
      if (!balloon) return state;

      const withoutBalloon = state.balloons.filter(b => b.id !== action.balloonId);

      if (balloon.type === 'bomb') {
        const newLives = state.lives - 1;
        return {
          ...state,
          balloons: withoutBalloon,
          lives: newLives,
          combo: 0,
          gameStatus: newLives <= 0 ? 'gameOver' : state.gameStatus,
        };
      }

      // Good balloon — compute combo from reducer state (no stale closure)
      const timeSinceLastPop = action.now - state.lastPopTime;
      const newCombo = timeSinceLastPop < COMBO_WINDOW ? state.combo + 1 : 1;
      const basePoints = balloon.type === 'golden' ? POINTS.golden : POINTS.normal;
      const comboBonus = newCombo > 1 ? (newCombo - 1) * POINTS.combo : 0;

      return {
        ...state,
        balloons: withoutBalloon,
        score: state.score + basePoints + comboBonus,
        combo: newCombo,
        maxCombo: Math.max(state.maxCombo, newCombo),
        totalPopped: state.totalPopped + 1,
        lastPopTime: action.now,
      };
    }

    case 'EXPIRE_BALLOON': {
      const balloon = state.balloons.find(b => b.id === action.balloonId);
      if (!balloon) return state; // Already popped — no-op

      const withoutBalloon = state.balloons.filter(b => b.id !== action.balloonId);

      if (balloon.type === 'bomb') {
        // Bomb expired — no life penalty, but combo resets
        return { ...state, balloons: withoutBalloon, combo: 0 };
      }

      // Normal/golden missed
      const newLives = state.lives - 1;
      return {
        ...state,
        balloons: withoutBalloon,
        totalMissed: state.totalMissed + 1,
        lives: newLives,
        combo: 0,
        gameStatus: newLives <= 0 ? 'gameOver' : state.gameStatus,
      };
    }

    case 'TICK': {
      if (state.timeRemaining <= 1) {
        return { ...state, timeRemaining: 0, gameStatus: 'gameOver' };
      }
      return { ...state, timeRemaining: state.timeRemaining - 1 };
    }

    case 'LOAD_HIGH_SCORE':
      return { ...state, highScore: action.highScore };

    default:
      return state;
  }
}

interface UsePopBalloonsReturn {
  gameState: PopBalloonsState;
  handleBalloonPop: (balloonId: string) => void;
  startGame: () => void;
  resetGame: () => void;
  setDifficulty: (difficulty: Difficulty) => void;
  setGridSize: (gridSize: GridSize) => void;
}

export const usePopBalloons = (): UsePopBalloonsReturn => {
  const [state, dispatch] = useReducer(balloonReducer, makeInitialState('easy'));

  // stateRef — gives setTimeout / setInterval callbacks access to fresh state
  // without needing them in their dependency arrays
  const stateRef = useRef(state);
  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  const spawnTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const gameTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // ── Load high score whenever difficulty changes (includes mount) ──────────
  useEffect(() => {
    const saved = getHighScore(`${GAME_KEY}_${state.difficulty}`);
    dispatch({ type: 'LOAD_HIGH_SCORE', highScore: saved });
  }, [state.difficulty]);

  // ── Derive occupied positions from current state (replaces occupiedPositionsRef) ──
  const getRandomPosition = useCallback((): { row: number; col: number } | null => {
    const { balloons, gridSize } = stateRef.current;
    const occupied = new Set(balloons.map(b => `${b.position.row}-${b.position.col}`));
    const size = gridSizeSettings[gridSize].size;
    const available: { row: number; col: number }[] = [];

    for (let row = 0; row < size; row++) {
      for (let col = 0; col < size; col++) {
        if (!occupied.has(`${row}-${col}`)) available.push({ row, col });
      }
    }

    return available.length === 0 ? null : randomChoice(available);
  }, []);

  const getBalloonType = useCallback((difficulty: Difficulty): BalloonType => {
    const { bombChance, goldenChance } = difficultySettings[difficulty];
    const rand = Math.random();
    if (rand < bombChance) return 'bomb';
    if (rand < bombChance + goldenChance) return 'golden';
    return 'normal';
  }, []);

  // ── Spawn balloon (called from setInterval — reads fresh state via stateRef) ──
  const spawnBalloon = useCallback(() => {
    const position = getRandomPosition();
    if (!position) return; // Grid is full

    const { difficulty } = stateRef.current;
    const settings = difficultySettings[difficulty];
    const type = getBalloonType(difficulty);

    const balloon: Balloon = {
      id: `balloon-${Date.now()}-${Math.random()}`,
      position,
      type,
      color:
        type === 'golden'
          ? 'hsl(45, 100%, 60%)'
          : type === 'bomb'
            ? 'hsl(0, 0%, 30%)'
            : randomChoice(balloonColors),
      lifetime: settings.balloonLifetime,
      spawnTime: Date.now(),
    };

    dispatch({ type: 'SPAWN_BALLOON', balloon });

    // Auto-expire after lifetime — EXPIRE_BALLOON is a no-op if already popped
    setTimeout(() => {
      dispatch({ type: 'EXPIRE_BALLOON', balloonId: balloon.id });
    }, settings.balloonLifetime);
  }, [getRandomPosition, getBalloonType]);

  // ── Public callbacks ──────────────────────────────────────────────────────

  const handleBalloonPop = useCallback((balloonId: string) => {
    const balloon = stateRef.current.balloons.find(b => b.id === balloonId);
    if (!balloon) return;

    // Side-effects (sounds) happen before dispatch — keeps reducer pure
    if (balloon.type === 'bomb') {
      playSound('lose');
    } else {
      playSound(balloon.type === 'golden' ? 'collect' : 'pop');
    }

    dispatch({ type: 'POP_BALLOON', balloonId, now: Date.now() });
  }, []);

  const startGame = useCallback(() => {
    dispatch({ type: 'START' });
  }, []);

  const resetGame = useCallback(() => {
    const { difficulty, gridSize, highScore } = stateRef.current;
    dispatch({ type: 'RESET', difficulty, gridSize, highScore });
  }, []);

  const setDifficulty = useCallback((difficulty: Difficulty) => {
    dispatch({ type: 'SET_DIFFICULTY', difficulty });
  }, []);

  const setGridSize = useCallback((gridSize: GridSize) => {
    dispatch({ type: 'SET_GRID_SIZE', gridSize });
  }, []);

  // ── Spawn interval (re-runs only when play state or difficulty changes) ───
  useEffect(() => {
    if (state.gameStatus === 'playing') {
      spawnBalloon(); // Immediate first spawn

      spawnTimerRef.current = setInterval(() => {
        spawnBalloon();
      }, difficultySettings[state.difficulty].spawnRate);
    } else if (spawnTimerRef.current) {
      clearInterval(spawnTimerRef.current);
      spawnTimerRef.current = null;
    }

    return () => {
      if (spawnTimerRef.current) {
        clearInterval(spawnTimerRef.current);
        spawnTimerRef.current = null;
      }
    };
  }, [state.gameStatus, state.difficulty, spawnBalloon]);

  // ── Game countdown timer ──────────────────────────────────────────────────
  useEffect(() => {
    if (state.gameStatus === 'playing') {
      gameTimerRef.current = setInterval(() => {
        dispatch({ type: 'TICK' });
      }, 1000);
    } else if (gameTimerRef.current) {
      clearInterval(gameTimerRef.current);
      gameTimerRef.current = null;
    }

    return () => {
      if (gameTimerRef.current) {
        clearInterval(gameTimerRef.current);
        gameTimerRef.current = null;
      }
    };
  }, [state.gameStatus]);

  // ── Persist high score on game over ──────────────────────────────────────
  useEffect(() => {
    if (state.gameStatus === 'gameOver' && state.score > state.highScore) {
      saveHighScore(`${GAME_KEY}_${state.difficulty}`, state.score);
      dispatch({ type: 'LOAD_HIGH_SCORE', highScore: state.score });
    }
  }, [state.gameStatus, state.score, state.highScore, state.difficulty]);

  // ── Build public state (omit internal lastPopTime field) ─────────────────
  const gameState: PopBalloonsState = {
    balloons: state.balloons,
    score: state.score,
    highScore: state.highScore,
    combo: state.combo,
    maxCombo: state.maxCombo,
    gameStatus: state.gameStatus,
    difficulty: state.difficulty,
    gridSize: state.gridSize,
    timeRemaining: state.timeRemaining,
    lives: state.lives,
    totalPopped: state.totalPopped,
    totalMissed: state.totalMissed,
  };

  return { gameState, handleBalloonPop, startGame, resetGame, setDifficulty, setGridSize };
};
