// Main game logic hook for Jelly Volleyball

import { useState, useEffect, useCallback, useRef } from 'react';
import type { GameState, GameConfig, Controls } from '../components/Games/JellyVolleyball/types';
import {
  updatePlayer,
  updateBall,
  handleBallPlayerCollision,
  defaultPhysicsConfig,
} from '../components/Games/JellyVolleyball/physics';
import { calculateAIControls, defaultAIConfig } from '../components/Games/JellyVolleyball/ai';

const DEFAULT_CONFIG: GameConfig = {
  courtWidth: 800,
  courtHeight: 400,
  netHeight: 100,
  playerRadius: 35,
  ballRadius: 18, // Bigger ball for better visibility
  gravity: 0.1, // Ultra-low gravity for very floaty gameplay
  pointsToWin: 7,
};

// Initialize game state
function createInitialState(config: GameConfig): GameState {
  const player1StartX = config.courtWidth / 4;
  const player2StartX = (config.courtWidth * 3) / 4;
  const startY = config.courtHeight - config.playerRadius;

  return {
    player1: {
      position: { x: player1StartX, y: startY },
      velocity: { x: 0, y: 0 },
      radius: config.playerRadius,
      mass: 1.0,
      wobbleOffset: { x: 0, y: 0 },
      wobbleVelocity: { x: 0, y: 0 },
      color: '#FF6B6B',
      isAI: false,
    },
    player2: {
      position: { x: player2StartX, y: startY },
      velocity: { x: 0, y: 0 },
      radius: config.playerRadius,
      mass: 1.0,
      wobbleOffset: { x: 0, y: 0 },
      wobbleVelocity: { x: 0, y: 0 },
      color: '#4ECDC4',
      isAI: true,
    },
    ball: {
      position: { x: config.courtWidth / 2, y: 100 },
      velocity: { x: -1.5, y: 0 },
      radius: config.ballRadius,
      mass: 0.5,
    },
    court: {
      width: config.courtWidth,
      height: config.courtHeight,
      netHeight: config.netHeight,
      netWidth: 8,
    },
    score: {
      player1: 0,
      player2: 0,
    },
    gameStatus: 'playing',
    winner: null,
    lastScorer: null,
    servingPlayer: 1,
  };
}

// Reset ball position after scoring
function resetBall(state: GameState, servingPlayer: number): void {
  const startX = servingPlayer === 1 ? state.court.width / 4 : (state.court.width * 3) / 4;

  state.ball.position.x = startX;
  state.ball.position.y = state.court.height - 150;
  state.ball.velocity.x = servingPlayer === 1 ? 1.5 : -1.5;
  state.ball.velocity.y = 0;
}

// Reset player positions
function resetPlayers(state: GameState): void {
  const player1StartX = state.court.width / 4;
  const player2StartX = (state.court.width * 3) / 4;
  const startY = state.court.height - state.player1.radius;

  state.player1.position.x = player1StartX;
  state.player1.position.y = startY;
  state.player1.velocity.x = 0;
  state.player1.velocity.y = 0;

  state.player2.position.x = player2StartX;
  state.player2.position.y = startY;
  state.player2.velocity.x = 0;
  state.player2.velocity.y = 0;
}

export function useJellyVolleyball(config: GameConfig = DEFAULT_CONFIG) {
  const [gameState, setGameState] = useState<GameState>(() => createInitialState(config));
  const [isPaused, setIsPaused] = useState(false);

  const player1ControlsRef = useRef<Controls>({ left: false, right: false, jump: false });
  const animationFrameRef = useRef<number>();
  const lastTimeRef = useRef<number>(Date.now());
  const scorePopupTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Game loop
  const gameLoop = useCallback(() => {
    if (isPaused) {
      animationFrameRef.current = requestAnimationFrame(gameLoop);
      return;
    }

    const now = Date.now();
    const deltaTime = Math.min((now - lastTimeRef.current) / 16, 2); // Cap at 2x speed
    lastTimeRef.current = now;

    setGameState((prevState: GameState) => {
      if (prevState.gameStatus !== 'playing') {
        return prevState;
      }

      const newState = { ...prevState };

      // Calculate AI controls for player 2
      const player2Controls = newState.player2.isAI
        ? calculateAIControls(newState.player2, newState.ball, newState.court, defaultAIConfig)
        : { left: false, right: false, jump: false };

      // Update players
      updatePlayer(
        newState.player1,
        newState.court,
        defaultPhysicsConfig,
        player1ControlsRef.current,
        deltaTime,
        'left'
      );
      updatePlayer(
        newState.player2,
        newState.court,
        defaultPhysicsConfig,
        player2Controls,
        deltaTime,
        'right'
      );

      // Update ball
      const { scored, scoringSide } = updateBall(
        newState.ball,
        newState.court,
        defaultPhysicsConfig,
        deltaTime
      );

      // Handle ball-player collisions
      handleBallPlayerCollision(newState.ball, newState.player1, defaultPhysicsConfig);
      handleBallPlayerCollision(newState.ball, newState.player2, defaultPhysicsConfig);

      // Handle scoring
      if (scored && scoringSide) {
        if (scoringSide === 'left') {
          // Ball landed on left side, player 2 scores
          newState.score.player2++;
          newState.lastScorer = 2;
          newState.servingPlayer = 1;
        } else {
          // Ball landed on right side, player 1 scores
          newState.score.player1++;
          newState.lastScorer = 1;
          newState.servingPlayer = 2;
        }

        // Check for winner
        if (newState.score.player1 >= config.pointsToWin) {
          newState.gameStatus = 'gameOver';
          newState.winner = 1;
        } else if (newState.score.player2 >= config.pointsToWin) {
          newState.gameStatus = 'gameOver';
          newState.winner = 2;
        } else {
          // Reset for next point
          resetBall(newState, newState.servingPlayer);
          resetPlayers(newState);
        }
      }

      return newState;
    });

    animationFrameRef.current = requestAnimationFrame(gameLoop);
  }, [config.pointsToWin, isPaused]);

  // Control functions for touch/button controls
  const setControl = useCallback((control: keyof Controls, value: boolean) => {
    player1ControlsRef.current[control] = value;
  }, []);

  const resetGame = useCallback(() => {
    setGameState(createInitialState(config));
    player1ControlsRef.current = { left: false, right: false, jump: false };
    setIsPaused(false);
  }, [config]);

  const togglePause = useCallback(() => {
    setIsPaused((prev: boolean) => !prev);
  }, []);

  // Start game loop
  useEffect(() => {
    lastTimeRef.current = Date.now();
    animationFrameRef.current = requestAnimationFrame(gameLoop);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [gameLoop]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameState.gameStatus === 'gameOver') {
        // Any key restarts the game
        resetGame();
        return;
      }

      const key = e.key.toLowerCase();

      if (key === 'arrowleft' || key === 'a') {
        player1ControlsRef.current.left = true;
        e.preventDefault();
      }
      if (key === 'arrowright' || key === 'd') {
        player1ControlsRef.current.right = true;
        e.preventDefault();
      }
      if (key === 'arrowup' || key === 'w' || key === ' ') {
        player1ControlsRef.current.jump = true;
        e.preventDefault();
      }
      if (key === 'escape') {
        setIsPaused((prev: boolean) => !prev);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();

      if (key === 'arrowleft' || key === 'a') {
        player1ControlsRef.current.left = false;
      }
      if (key === 'arrowright' || key === 'd') {
        player1ControlsRef.current.right = false;
      }
      if (key === 'arrowup' || key === 'w' || key === ' ') {
        player1ControlsRef.current.jump = false;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [gameState.gameStatus, resetGame]);

  // Clear score popup after 2 seconds
  useEffect(() => {
    if (gameState.lastScorer !== null) {
      // Clear any existing timeout
      if (scorePopupTimeoutRef.current) {
        clearTimeout(scorePopupTimeoutRef.current);
      }

      // Set timeout to clear the popup after 2 seconds
      scorePopupTimeoutRef.current = setTimeout(() => {
        setGameState((prev) => ({
          ...prev,
          lastScorer: null,
        }));
        scorePopupTimeoutRef.current = null;
      }, 2000);
    }

    return () => {
      if (scorePopupTimeoutRef.current) {
        clearTimeout(scorePopupTimeoutRef.current);
      }
    };
  }, [gameState.lastScorer]);

  return {
    gameState,
    isPaused,
    controls: {
      setControl,
      resetGame,
      togglePause,
    },
  };
}
