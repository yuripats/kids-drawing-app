/**
 * Drawing Challenge Game Hook
 * Manages game state and logic for Drawing Challenge
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import type { DrawingChallengeState, Category, GameMode, Prompt, GameStatus } from '../components/Games/DrawingChallenge/types';
import { getRandomPrompt } from '../components/Games/DrawingChallenge/prompts';
import { loadGameData, saveGameData, playSound } from '../utils/gameUtils';

const GAME_KEY = 'drawingChallenge';

interface UseDrawingChallengeReturn {
  gameState: DrawingChallengeState;
  startChallenge: () => void;
  finishChallenge: () => void;
  nextPrompt: () => void;
  setCategory: (category: Category) => void;
  setMode: (mode: GameMode) => void;
  setTimeLimit: (seconds: number) => void;
}

export const useDrawingChallenge = (): UseDrawingChallengeReturn => {
  const [currentPrompt, setCurrentPrompt] = useState<Prompt | null>(null);
  const [gameStatus, setGameStatus] = useState<GameStatus>('ready');
  const [mode, setModeState] = useState<GameMode>('free');
  const [category, setCategoryState] = useState<Category>('all');
  const [timeLimit, setTimeLimitState] = useState(0); // 0 = unlimited
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [completedChallenges, setCompletedChallenges] = useState<string[]>([]);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Load completed challenges from localStorage
  useEffect(() => {
    const savedData = loadGameData<{ completed: string[] }>(
      GAME_KEY,
      { completed: [] }
    );
    setCompletedChallenges(savedData.completed);
  }, []);

  // Save completed challenges to localStorage
  useEffect(() => {
    saveGameData(GAME_KEY, { completed: completedChallenges });
  }, [completedChallenges]);

  // Timer countdown
  useEffect(() => {
    if (gameStatus === 'drawing' && mode === 'timed' && timeLimit > 0) {
      timerRef.current = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            // Time's up!
            if (timerRef.current) {
              clearInterval(timerRef.current);
            }
            playSound('lose');
            setGameStatus('finished');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [gameStatus, mode, timeLimit]);

  // Get a new prompt
  const nextPrompt = useCallback(() => {
    const prompt = getRandomPrompt(category, completedChallenges);
    setCurrentPrompt(prompt);
    setGameStatus('ready');
    setTimeRemaining(timeLimit);
  }, [category, completedChallenges, timeLimit]);

  // Start challenge
  const startChallenge = useCallback(() => {
    if (!currentPrompt) {
      nextPrompt();
    }
    setGameStatus('drawing');
    setTimeRemaining(timeLimit);
    playSound('click', 0.2);
  }, [currentPrompt, nextPrompt, timeLimit]);

  // Finish challenge
  const finishChallenge = useCallback(() => {
    if (currentPrompt && !completedChallenges.includes(currentPrompt.id)) {
      setCompletedChallenges(prev => [...prev, currentPrompt.id]);
    }
    setGameStatus('finished');
    playSound('win');
  }, [currentPrompt, completedChallenges]);

  // Set category
  const setCategory = useCallback((newCategory: Category) => {
    setCategoryState(newCategory);
    setGameStatus('ready');
    setCurrentPrompt(null);
  }, []);

  // Set mode
  const setMode = useCallback((newMode: GameMode) => {
    setModeState(newMode);
    setGameStatus('ready');
    // Set default time limit for timed mode
    if (newMode === 'timed' && timeLimit === 0) {
      setTimeLimitState(180); // 3 minutes default
    }
  }, [timeLimit]);

  // Set time limit
  const setTimeLimit = useCallback((seconds: number) => {
    setTimeLimitState(seconds);
    setTimeRemaining(seconds);
  }, []);

  // Initialize with first prompt
  useEffect(() => {
    if (!currentPrompt && gameStatus === 'ready') {
      nextPrompt();
    }
  }, [currentPrompt, gameStatus, nextPrompt]);

  const gameState: DrawingChallengeState = {
    currentPrompt,
    gameStatus,
    mode,
    category,
    timeLimit,
    timeRemaining,
    completedChallenges
  };

  return {
    gameState,
    startChallenge,
    finishChallenge,
    nextPrompt,
    setCategory,
    setMode,
    setTimeLimit
  };
};
