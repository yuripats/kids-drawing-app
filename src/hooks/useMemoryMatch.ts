/**
 * Memory Match Game Hook
 * Manages game state and logic for Memory Match
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import type { Card, MemoryMatchState, Difficulty, Theme, GameStatus } from '../components/Games/MemoryMatch/types';
import { shuffleArray, loadGameData, saveGameData, playSound } from '../utils/gameUtils';
import { getCardsForTheme, difficultySettings } from '../components/Games/MemoryMatch/themes';

const GAME_KEY = 'memoryMatch';
const FLIP_DELAY = 1000; // Time to view mismatched cards before flipping back

interface UseMemoryMatchReturn {
  gameState: MemoryMatchState;
  handleCardClick: (index: number) => void;
  resetGame: () => void;
  setDifficulty: (difficulty: Difficulty) => void;
  setTheme: (theme: Theme) => void;
}

export const useMemoryMatch = (): UseMemoryMatchReturn => {
  const [difficulty, setDifficultyState] = useState<Difficulty>('easy');
  const [theme, setThemeState] = useState<Theme>('animals');
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
  const [matchedPairs, setMatchedPairs] = useState<Set<string>>(new Set());
  const [moves, setMoves] = useState(0);
  const [gameStatus, setGameStatus] = useState<GameStatus>('ready');
  const [timer, setTimer] = useState(0);
  const [bestTime, setBestTime] = useState<number>(0);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const isCheckingRef = useRef(false);

  // Initialize game
  const initializeGame = useCallback(() => {
    const { pairs } = difficultySettings[difficulty];
    const values = getCardsForTheme(theme, pairs);

    // Create pairs of cards
    const cardPairs: Card[] = [];
    values.forEach((value, idx) => {
      cardPairs.push({
        id: `${value}-1-${idx}`,
        value,
        isFlipped: false,
        isMatched: false,
        index: 0
      });
      cardPairs.push({
        id: `${value}-2-${idx}`,
        value,
        isFlipped: false,
        isMatched: false,
        index: 0
      });
    });

    // Shuffle and assign indices
    const shuffled = shuffleArray(cardPairs).map((card, index) => ({
      ...card,
      index
    }));

    setCards(shuffled);
    setFlippedIndices([]);
    setMatchedPairs(new Set());
    setMoves(0);
    setTimer(0);
    setGameStatus('ready');
    isCheckingRef.current = false;

    // Load best time
    const savedData = loadGameData<{ bestTime: number }>(
      `${GAME_KEY}_${difficulty}_${theme}`,
      { bestTime: 0 }
    );
    setBestTime(savedData.bestTime);
  }, [difficulty, theme]);

  // Initialize on mount and when difficulty/theme changes
  useEffect(() => {
    initializeGame();
  }, [initializeGame]);

  // Timer effect
  useEffect(() => {
    if (gameStatus === 'playing') {
      timerRef.current = setInterval(() => {
        setTimer(prev => prev + 1);
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
  }, [gameStatus]);

  // Check for matches
  const checkMatch = useCallback((indices: number[]) => {
    if (indices.length !== 2 || isCheckingRef.current) return;

    isCheckingRef.current = true;
    const [idx1, idx2] = indices;
    const card1 = cards[idx1];
    const card2 = cards[idx2];

    if (card1.value === card2.value) {
      // Match found!
      playSound('match');
      setMatchedPairs(prev => new Set([...prev, card1.value]));
      setCards(prev => prev.map((card, idx) => {
        if (idx === idx1 || idx === idx2) {
          return { ...card, isMatched: true };
        }
        return card;
      }));
      setFlippedIndices([]);
      isCheckingRef.current = false;

      // Check if game is complete
      const totalPairs = difficultySettings[difficulty].pairs;
      if (matchedPairs.size + 1 === totalPairs) {
        setGameStatus('completed');
        playSound('win');

        // Save best time if it's a new record
        const currentBestTime = bestTime;
        if (currentBestTime === 0 || timer + 1 < currentBestTime) {
          setBestTime(timer + 1);
          saveGameData(`${GAME_KEY}_${difficulty}_${theme}`, { bestTime: timer + 1 });
        }
      }
    } else {
      // No match
      playSound('mismatch');

      // Flip back after delay
      setTimeout(() => {
        setCards(prev => prev.map((card, idx) => {
          if (idx === idx1 || idx === idx2) {
            return { ...card, isFlipped: false };
          }
          return card;
        }));
        setFlippedIndices([]);
        isCheckingRef.current = false;
      }, FLIP_DELAY);
    }
  }, [cards, matchedPairs.size, difficulty, theme, timer, bestTime]);

  // Handle card click
  const handleCardClick = useCallback((index: number) => {
    const card = cards[index];

    // Ignore if card is already flipped, matched, or checking in progress
    if (card.isFlipped || card.isMatched || isCheckingRef.current) {
      return;
    }

    // Start game on first click
    if (gameStatus === 'ready') {
      setGameStatus('playing');
    }

    playSound('click', 0.2);

    // Flip the card
    setCards(prev => prev.map((c, idx) =>
      idx === index ? { ...c, isFlipped: true } : c
    ));

    const newFlippedIndices = [...flippedIndices, index];
    setFlippedIndices(newFlippedIndices);

    // If this is the second card, increment moves and check for match
    if (newFlippedIndices.length === 2) {
      setMoves(prev => prev + 1);
      checkMatch(newFlippedIndices);
    }
  }, [cards, flippedIndices, gameStatus, checkMatch]);

  // Reset game
  const resetGame = useCallback(() => {
    initializeGame();
  }, [initializeGame]);

  // Set difficulty
  const setDifficulty = useCallback((newDifficulty: Difficulty) => {
    setDifficultyState(newDifficulty);
  }, []);

  // Set theme
  const setTheme = useCallback((newTheme: Theme) => {
    setThemeState(newTheme);
  }, []);

  const gameState: MemoryMatchState = {
    cards,
    flippedIndices,
    matchedPairs,
    moves,
    gameStatus,
    difficulty,
    theme,
    timer,
    bestTime
  };

  return {
    gameState,
    handleCardClick,
    resetGame,
    setDifficulty,
    setTheme
  };
};
