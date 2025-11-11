/**
 * Pop the Balloons Game Hook
 * Manages game state and logic for Pop the Balloons
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import type { PopBalloonsState, Balloon, BalloonType, Difficulty, GameStatus } from '../components/Games/PopBalloons/types';
import { difficultySettings, GRID_SIZE, POINTS, balloonColors, COMBO_WINDOW } from '../components/Games/PopBalloons/constants';
import { saveHighScore, getHighScore, playSound, randomChoice } from '../utils/gameUtils';

const GAME_KEY = 'popBalloons';

interface UsePopBalloonsReturn {
  gameState: PopBalloonsState;
  handleBalloonPop: (balloonId: string) => void;
  startGame: () => void;
  resetGame: () => void;
  setDifficulty: (difficulty: Difficulty) => void;
}

export const usePopBalloons = (): UsePopBalloonsReturn => {
  const [difficulty, setDifficultyState] = useState<Difficulty>('easy');
  const [balloons, setBalloons] = useState<Balloon[]>([]);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [gameStatus, setGameStatus] = useState<GameStatus>('ready');
  const [timeRemaining, setTimeRemaining] = useState(difficultySettings[difficulty].gameDuration);
  const [lives, setLives] = useState(difficultySettings[difficulty].startingLives);
  const [totalPopped, setTotalPopped] = useState(0);
  const [totalMissed, setTotalMissed] = useState(0);

  const spawnTimerRef = useRef<NodeJS.Timeout | null>(null);
  const gameTimerRef = useRef<NodeJS.Timeout | null>(null);
  const lastPopTimeRef = useRef<number>(0);
  const occupiedPositionsRef = useRef<Set<string>>(new Set());

  // Load high score
  useEffect(() => {
    const savedHighScore = getHighScore(`${GAME_KEY}_${difficulty}`);
    setHighScore(savedHighScore);
  }, [difficulty]);

  // Initialize game
  const initializeGame = useCallback(() => {
    const settings = difficultySettings[difficulty];
    setBalloons([]);
    setScore(0);
    setCombo(0);
    setMaxCombo(0);
    setTimeRemaining(settings.gameDuration);
    setLives(settings.startingLives);
    setTotalPopped(0);
    setTotalMissed(0);
    setGameStatus('ready');
    occupiedPositionsRef.current.clear();
    lastPopTimeRef.current = 0;
  }, [difficulty]);

  // Get random unoccupied position
  const getRandomPosition = useCallback((): { row: number; col: number } | null => {
    const available: { row: number; col: number }[] = [];

    for (let row = 0; row < GRID_SIZE; row++) {
      for (let col = 0; col < GRID_SIZE; col++) {
        const key = `${row}-${col}`;
        if (!occupiedPositionsRef.current.has(key)) {
          available.push({ row, col });
        }
      }
    }

    if (available.length === 0) return null;
    return randomChoice(available);
  }, []);

  // Determine balloon type based on difficulty
  const getBalloonType = useCallback((): BalloonType => {
    const settings = difficultySettings[difficulty];
    const rand = Math.random();

    if (rand < settings.bombChance) {
      return 'bomb';
    } else if (rand < settings.bombChance + settings.goldenChance) {
      return 'golden';
    }
    return 'normal';
  }, [difficulty]);

  // Spawn a new balloon
  const spawnBalloon = useCallback(() => {
    const position = getRandomPosition();
    if (!position) return; // Grid is full

    const settings = difficultySettings[difficulty];
    const type = getBalloonType();

    const balloon: Balloon = {
      id: `balloon-${Date.now()}-${Math.random()}`,
      position,
      type,
      color: type === 'golden' ? 'hsl(45, 100%, 60%)' : type === 'bomb' ? 'hsl(0, 0%, 30%)' : randomChoice(balloonColors),
      lifetime: settings.balloonLifetime,
      spawnTime: Date.now()
    };

    const posKey = `${position.row}-${position.col}`;
    occupiedPositionsRef.current.add(posKey);

    setBalloons(prev => [...prev, balloon]);

    // Auto-remove balloon after lifetime
    setTimeout(() => {
      setBalloons(prev => {
        const exists = prev.find(b => b.id === balloon.id);
        if (exists) {
          // Balloon was missed
          setTotalMissed(m => m + 1);

          // Lose a life only for normal and golden balloons (not bombs)
          if (balloon.type !== 'bomb') {
            setLives(l => {
              const newLives = l - 1;
              if (newLives <= 0) {
                setGameStatus('gameOver');
              }
              return newLives;
            });
          }

          // Reset combo
          setCombo(0);
        }

        occupiedPositionsRef.current.delete(posKey);
        return prev.filter(b => b.id !== balloon.id);
      });
    }, settings.balloonLifetime);
  }, [difficulty, getRandomPosition, getBalloonType]);

  // Handle balloon pop
  const handleBalloonPop = useCallback((balloonId: string) => {
    setBalloons(prev => {
      const balloon = prev.find(b => b.id === balloonId);
      if (!balloon) return prev;

      const posKey = `${balloon.position.row}-${balloon.position.col}`;
      occupiedPositionsRef.current.delete(posKey);

      if (balloon.type === 'bomb') {
        // Hit a bomb!
        playSound('lose');
        setLives(l => {
          const newLives = l - 1;
          if (newLives <= 0) {
            setGameStatus('gameOver');
          }
          return newLives;
        });
        setCombo(0);
      } else {
        // Popped a good balloon
        const now = Date.now();
        const timeSinceLastPop = now - lastPopTimeRef.current;
        lastPopTimeRef.current = now;

        // Update combo
        const newCombo = timeSinceLastPop < COMBO_WINDOW ? combo + 1 : 1;
        setCombo(newCombo);
        setMaxCombo(mc => Math.max(mc, newCombo));

        // Calculate points
        const basePoints = balloon.type === 'golden' ? POINTS.golden : POINTS.normal;
        const comboBonus = newCombo > 1 ? (newCombo - 1) * POINTS.combo : 0;
        const totalPoints = basePoints + comboBonus;

        setScore(s => s + totalPoints);
        setTotalPopped(p => p + 1);

        // Play sound
        playSound(balloon.type === 'golden' ? 'collect' : 'pop');
      }

      return prev.filter(b => b.id !== balloonId);
    });
  }, [combo]);

  // Start game
  const startGame = useCallback(() => {
    setGameStatus('playing');
    lastPopTimeRef.current = Date.now();
  }, []);

  // Reset game
  const resetGame = useCallback(() => {
    initializeGame();
  }, [initializeGame]);

  // Set difficulty
  const setDifficulty = useCallback((newDifficulty: Difficulty) => {
    setDifficultyState(newDifficulty);
  }, []);

  // Spawn balloons during play
  useEffect(() => {
    if (gameStatus === 'playing') {
      const settings = difficultySettings[difficulty];

      spawnTimerRef.current = setInterval(() => {
        spawnBalloon();
      }, settings.spawnRate);

      // Spawn first balloon immediately
      spawnBalloon();
    } else if (spawnTimerRef.current) {
      clearInterval(spawnTimerRef.current);
      spawnTimerRef.current = null;
    }

    return () => {
      if (spawnTimerRef.current) {
        clearInterval(spawnTimerRef.current);
      }
    };
  }, [gameStatus, difficulty, spawnBalloon]);

  // Game timer countdown
  useEffect(() => {
    if (gameStatus === 'playing') {
      gameTimerRef.current = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            if (gameTimerRef.current) {
              clearInterval(gameTimerRef.current);
            }
            setGameStatus('gameOver');

            // Save high score
            if (score > highScore) {
              saveHighScore(`${GAME_KEY}_${difficulty}`, score);
              setHighScore(score);
            }

            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (gameTimerRef.current) {
      clearInterval(gameTimerRef.current);
      gameTimerRef.current = null;
    }

    return () => {
      if (gameTimerRef.current) {
        clearInterval(gameTimerRef.current);
      }
    };
  }, [gameStatus, score, highScore, difficulty]);

  // Initialize on mount
  useEffect(() => {
    initializeGame();
  }, [initializeGame]);

  const gameState: PopBalloonsState = {
    balloons,
    score,
    highScore,
    combo,
    maxCombo,
    gameStatus,
    difficulty,
    timeRemaining,
    lives,
    totalPopped,
    totalMissed
  };

  return {
    gameState,
    handleBalloonPop,
    startGame,
    resetGame,
    setDifficulty
  };
};
