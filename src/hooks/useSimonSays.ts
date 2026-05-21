/**
 * Simon Says Game Hook
 * Manages game state and logic for Simon Says pattern memory game
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import type { SimonSaysState, Speed } from '../components/Games/SimonSays/types';
import { playSound, getHighScore, saveHighScore } from '../utils/gameUtils';

const SPEED_DELAYS = {
  slow: 800,
  normal: 600,
  fast: 400
};

export const useSimonSays = () => {
  const [gameState, setGameState] = useState<SimonSaysState>({
    sequence: [],
    userInput: [],
    round: 0,
    gameStatus: 'ready',
    speed: 'normal',
    highScore: getHighScore('simonSays'),
    showingIndex: -1
  });

  const audioContextRef = useRef<AudioContext | null>(null);
  // Array tracks ALL pending timeout IDs across all 3 nesting levels so every
  // one can be cleared on reset or unmount (the single-ref approach only tracked
  // the last outer timeout and leaked the inner ones).
  const showTimeoutsRef = useRef<NodeJS.Timeout[]>([]);

  // Initialize audio context
  useEffect(() => {
    const AudioContextClass = window.AudioContext || (window as Window & typeof globalThis & { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    audioContextRef.current = new AudioContextClass();
    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  // Play button tone
  const playButtonTone = useCallback((buttonIndex: number) => {
    const frequencies = [261.63, 329.63, 392.00, 523.25]; // C, E, G, C
    const frequency = frequencies[buttonIndex];

    if (audioContextRef.current) {
      const oscillator = audioContextRef.current.createOscillator();
      const gainNode = audioContextRef.current.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContextRef.current.destination);

      oscillator.frequency.value = frequency;
      oscillator.type = 'sine';
      gainNode.gain.value = 0.3;

      oscillator.start();
      oscillator.stop(audioContextRef.current.currentTime + 0.3);
    }
  }, []);

  // Show sequence to player
  const showSequence = useCallback((sequence: number[]) => {
    // Cancel any in-flight timeouts from a previous showSequence call
    showTimeoutsRef.current.forEach(clearTimeout);
    showTimeoutsRef.current = [];

    setGameState(prev => ({ ...prev, gameStatus: 'showing', showingIndex: -1 }));

    const delay = SPEED_DELAYS[gameState.speed];

    sequence.forEach((buttonIndex, idx) => {
      // LEVEL 1: highlight each button in turn
      const outerId = setTimeout(() => {
        setGameState(prev => ({ ...prev, showingIndex: buttonIndex }));
        playButtonTone(buttonIndex);

        // LEVEL 2: un-highlight after a short flash
        const innerId = setTimeout(() => {
          setGameState(prev => ({ ...prev, showingIndex: -1 }));

          // LEVEL 3: transition to 'playing' after the last button
          if (idx === sequence.length - 1) {
            const finalId = setTimeout(() => {
              setGameState(prev => ({ ...prev, gameStatus: 'playing' }));
            }, 200);
            showTimeoutsRef.current.push(finalId);
          }
        }, delay * 0.6);
        showTimeoutsRef.current.push(innerId);
      }, idx * delay);

      // Track the outer ID (do NOT clear the previous iteration's timeout —
      // the old code had a forEach bug that cancelled every step except the last)
      showTimeoutsRef.current.push(outerId);
    });
  }, [gameState.speed, playButtonTone]);

  // Start new game
  const startGame = useCallback(() => {
    const firstButton = Math.floor(Math.random() * 4);
    const newSequence = [firstButton];

    setGameState(prev => ({
      ...prev,
      sequence: newSequence,
      userInput: [],
      round: 1,
      gameStatus: 'showing',
      showingIndex: -1
    }));

    showSequence(newSequence);
  }, [showSequence]);

  // Handle button press
  const handleButtonPress = useCallback((buttonIndex: number) => {
    if (gameState.gameStatus !== 'playing') return;

    playButtonTone(buttonIndex);

    const newUserInput = [...gameState.userInput, buttonIndex];
    const currentIndex = newUserInput.length - 1;

    // Check if correct
    if (newUserInput[currentIndex] !== gameState.sequence[currentIndex]) {
      // Wrong button!
      playSound('lose');

      const finalRound = gameState.round;
      if (finalRound > gameState.highScore) {
        saveHighScore('simonSays', finalRound);
      }

      setGameState(prev => ({
        ...prev,
        gameStatus: 'gameOver',
        userInput: newUserInput,
        highScore: Math.max(prev.highScore, finalRound)
      }));
      return;
    }

    // Correct so far
    setGameState(prev => ({ ...prev, userInput: newUserInput }));

    // Check if round complete
    if (newUserInput.length === gameState.sequence.length) {
      playSound('match');

      // Add new button to sequence
      setTimeout(() => {
        const newButton = Math.floor(Math.random() * 4);
        const newSequence = [...gameState.sequence, newButton];

        setGameState(prev => ({
          ...prev,
          sequence: newSequence,
          userInput: [],
          round: prev.round + 1,
          gameStatus: 'showing'
        }));

        showSequence(newSequence);
      }, 1000);
    }
  }, [gameState, playButtonTone, showSequence]);

  // Reset game
  const resetGame = useCallback(() => {
    showTimeoutsRef.current.forEach(clearTimeout);
    showTimeoutsRef.current = [];

    setGameState({
      sequence: [],
      userInput: [],
      round: 0,
      gameStatus: 'ready',
      speed: gameState.speed,
      highScore: getHighScore('simonSays'),
      showingIndex: -1
    });
  }, [gameState.speed]);

  // Set speed
  const setSpeed = useCallback((speed: Speed) => {
    setGameState(prev => ({ ...prev, speed }));
  }, []);

  // Cleanup — clear every tracked timeout on unmount
  useEffect(() => {
    return () => {
      showTimeoutsRef.current.forEach(clearTimeout);
      showTimeoutsRef.current = [];
    };
  }, []);

  return {
    gameState,
    startGame,
    handleButtonPress,
    resetGame,
    setSpeed
  };
};
