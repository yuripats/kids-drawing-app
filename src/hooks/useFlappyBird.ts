import { useState, useEffect, useCallback, useRef } from 'react';
import { FlappyBirdState, GameControls, Pipe } from '../components/Games/FlappyBird/types';
import { GAME_CONSTANTS } from '../components/Games/FlappyBird/constants';

export const useFlappyBird = (): [FlappyBirdState, GameControls] => {
  const [gameState, setGameState] = useState<FlappyBirdState>({
    bird: {
      y: GAME_CONSTANTS.BIRD_START_Y,
      velocity: 0,
      rotation: 0,
      radius: GAME_CONSTANTS.BIRD_RADIUS,
    },
    pipes: [],
    score: 0,
    highScore: getHighScore(),
    gameStatus: 'ready',
    distanceTraveled: 0,
  });

  const animationFrameRef = useRef<number>();
  const lastPipeXRef = useRef<number>(GAME_CONSTANTS.SPAWN_DISTANCE);

  // Load high score from localStorage
  function getHighScore(): number {
    return parseInt(localStorage.getItem('highScore_flappyBird') || '0', 10);
  }

  // Save high score to localStorage
  function saveHighScore(score: number) {
    const current = getHighScore();
    if (score > current) {
      localStorage.setItem('highScore_flappyBird', score.toString());
    }
  }

  // Generate new pipe
  const generatePipe = useCallback((x: number): Pipe => {
    const gapY = Math.random() *
      (GAME_CONSTANTS.MAX_GAP_Y - GAME_CONSTANTS.MIN_GAP_Y) +
      GAME_CONSTANTS.MIN_GAP_Y;

    return {
      id: `pipe-${Date.now()}-${Math.random()}`,
      x,
      gapY,
      gapSize: GAME_CONSTANTS.PIPE_GAP,
      width: GAME_CONSTANTS.PIPE_WIDTH,
      passed: false,
    };
  }, []);

  // Check collision
  const checkCollision = useCallback((bird: FlappyBirdState['bird'], pipes: Pipe[]): boolean => {
    // Ground collision
    if (bird.y + bird.radius >= GAME_CONSTANTS.CANVAS_HEIGHT - 50) {
      return true;
    }

    // Ceiling collision
    if (bird.y - bird.radius <= 0) {
      return true;
    }

    // Pipe collision
    for (const pipe of pipes) {
      const birdX = GAME_CONSTANTS.BIRD_START_X;

      // Check if bird is in pipe's horizontal range
      if (
        birdX + bird.radius > pipe.x &&
        birdX - bird.radius < pipe.x + pipe.width
      ) {
        // Check if bird is outside the gap
        if (
          bird.y - bird.radius < pipe.gapY - pipe.gapSize / 2 ||
          bird.y + bird.radius > pipe.gapY + pipe.gapSize / 2
        ) {
          return true; // Collision!
        }
      }
    }

    return false;
  }, []);

  // Game loop
  const gameLoop = useCallback(() => {
    setGameState((prev) => {
      if (prev.gameStatus !== 'playing') {
        return prev;
      }

      // Update bird physics
      let newVelocity = prev.bird.velocity + GAME_CONSTANTS.GRAVITY;
      if (newVelocity > GAME_CONSTANTS.MAX_VELOCITY) {
        newVelocity = GAME_CONSTANTS.MAX_VELOCITY;
      }

      const newY = prev.bird.y + newVelocity;
      const newRotation = Math.min(Math.max(newVelocity * 3, -30), 90);

      const newBird = {
        ...prev.bird,
        y: newY,
        velocity: newVelocity,
        rotation: newRotation,
      };

      // Update pipes
      let newPipes = prev.pipes
        .map((pipe) => ({
          ...pipe,
          x: pipe.x - GAME_CONSTANTS.PIPE_SPEED,
        }))
        .filter((pipe) => pipe.x > -pipe.width); // Remove off-screen pipes

      // Check if bird passed any pipes (for scoring)
      let newScore = prev.score;
      newPipes = newPipes.map((pipe) => {
        if (!pipe.passed && pipe.x + pipe.width < GAME_CONSTANTS.BIRD_START_X) {
          newScore++;
          return { ...pipe, passed: true };
        }
        return pipe;
      });

      // Spawn new pipes
      const lastPipeX = newPipes.length > 0
        ? Math.max(...newPipes.map(p => p.x))
        : lastPipeXRef.current;

      if (lastPipeX < GAME_CONSTANTS.CANVAS_WIDTH) {
        const newPipe = generatePipe(lastPipeX + GAME_CONSTANTS.PIPE_SPACING);
        newPipes.push(newPipe);
        lastPipeXRef.current = newPipe.x;
      }

      // Check collision
      if (checkCollision(newBird, newPipes)) {
        saveHighScore(newScore);
        return {
          ...prev,
          bird: newBird,
          pipes: newPipes,
          score: newScore,
          highScore: Math.max(prev.highScore, newScore),
          gameStatus: 'gameOver',
        };
      }

      return {
        ...prev,
        bird: newBird,
        pipes: newPipes,
        score: newScore,
        distanceTraveled: prev.distanceTraveled + GAME_CONSTANTS.PIPE_SPEED,
      };
    });

    animationFrameRef.current = requestAnimationFrame(gameLoop);
  }, [generatePipe, checkCollision, saveHighScore]);

  // Start game
  const startGame = useCallback(() => {
    setGameState((prev) => ({
      ...prev,
      gameStatus: 'playing',
    }));
  }, []);

  // Flap
  const flap = useCallback(() => {
    if (gameState.gameStatus === 'ready') {
      startGame();
    }

    if (gameState.gameStatus === 'playing') {
      setGameState((prev) => ({
        ...prev,
        bird: {
          ...prev.bird,
          velocity: GAME_CONSTANTS.FLAP_STRENGTH,
        },
      }));
    }
  }, [gameState.gameStatus, startGame]);

  // Reset game
  const resetGame = useCallback(() => {
    lastPipeXRef.current = GAME_CONSTANTS.SPAWN_DISTANCE;
    setGameState({
      bird: {
        y: GAME_CONSTANTS.BIRD_START_Y,
        velocity: 0,
        rotation: 0,
        radius: GAME_CONSTANTS.BIRD_RADIUS,
      },
      pipes: [],
      score: 0,
      highScore: getHighScore(),
      gameStatus: 'ready',
      distanceTraveled: 0,
    });
  }, []);

  // Pause game
  const pauseGame = useCallback(() => {
    setGameState((prev) => ({
      ...prev,
      gameStatus: 'ready',
    }));
  }, []);

  // Effect: Run game loop
  useEffect(() => {
    if (gameState.gameStatus === 'playing') {
      animationFrameRef.current = requestAnimationFrame(gameLoop);
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [gameState.gameStatus, gameLoop]);

  // Effect: Keyboard controls
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.code === 'ArrowUp') {
        e.preventDefault();
        flap();
      }
      if (e.code === 'KeyR' && gameState.gameStatus === 'gameOver') {
        resetGame();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [flap, resetGame, gameState.gameStatus]);

  const controls: GameControls = {
    startGame,
    flap,
    resetGame,
    pauseGame,
  };

  return [gameState, controls];
};
