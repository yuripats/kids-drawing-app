/**
 * Bubble Pop Game Hook
 * Simple relaxing bubble popping game
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import type { BubblePopState, Bubble } from '../components/Games/BubblePop/types';
import { playSound } from '../utils/gameUtils';

const BUBBLE_COLORS = ['#FF6B9D', '#C44569', '#4ECDC4', '#44A08D', '#F7DC6F', '#BB8FCE', '#85C1E2', '#F8B195'];

export const useBubblePop = () => {
  const [gameState, setGameState] = useState<BubblePopState>({
    bubbles: [],
    score: 0,
    bubblesPopped: 0,
    gameStatus: 'playing'
  });

  const animationFrameRef = useRef<number>();
  const lastBubbleTimeRef = useRef<number>(Date.now());

  // Generate random bubble
  const createBubble = useCallback((): Bubble => {
    const size = 40 + Math.random() * 40;
    return {
      id: `bubble-${Date.now()}-${Math.random()}`,
      x: Math.random() * (window.innerWidth - size),
      y: window.innerHeight + size,
      size,
      color: BUBBLE_COLORS[Math.floor(Math.random() * BUBBLE_COLORS.length)],
      speed: 0.5 + Math.random() * 1.5
    };
  }, []);

  // Pop bubble
  const popBubble = useCallback((bubbleId: string) => {
    setGameState(prev => {
      const bubble = prev.bubbles.find(b => b.id === bubbleId);
      if (!bubble || bubble.popping) return prev;

      playSound('pop');

      // Mark bubble as popping
      const updatedBubbles = prev.bubbles.map(b =>
        b.id === bubbleId ? { ...b, popping: true } : b
      );

      // Remove bubble after animation completes (500ms)
      setTimeout(() => {
        setGameState(current => ({
          ...current,
          bubbles: current.bubbles.filter(b => b.id !== bubbleId)
        }));
      }, 500);

      return {
        ...prev,
        bubbles: updatedBubbles,
        score: prev.score + Math.floor(bubble.size / 10),
        bubblesPopped: prev.bubblesPopped + 1
      };
    });
  }, []);

  // Animation loop
  useEffect(() => {
    if (gameState.gameStatus !== 'playing') return;

    const animate = () => {
      const now = Date.now();

      // Add new bubble every 2 seconds
      if (now - lastBubbleTimeRef.current > 2000 && gameState.bubbles.length < 12) {
        lastBubbleTimeRef.current = now;
        setGameState(prev => ({
          ...prev,
          bubbles: [...prev.bubbles, createBubble()]
        }));
      }

      // Update bubble positions
      setGameState(prev => ({
        ...prev,
        bubbles: prev.bubbles
          .map(bubble => ({
            ...bubble,
            y: bubble.y - bubble.speed
          }))
          .filter(bubble => bubble.y > -bubble.size)
      }));

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [gameState.gameStatus, gameState.bubbles.length, createBubble]);

  const togglePause = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      gameStatus: prev.gameStatus === 'playing' ? 'paused' : 'playing'
    }));
  }, []);

  const resetGame = useCallback(() => {
    setGameState({
      bubbles: [],
      score: 0,
      bubblesPopped: 0,
      gameStatus: 'playing'
    });
    lastBubbleTimeRef.current = Date.now();
  }, []);

  return {
    gameState,
    popBubble,
    togglePause,
    resetGame
  };
};
