import { useState, useEffect, useCallback, useRef } from 'react';
import { PongState, GameControls } from '../components/Games/Pong/types';
import { GAME_CONSTANTS } from '../components/Games/Pong/constants';

export const usePong = (): [PongState, GameControls] => {
  const [gameState, setGameState] = useState<PongState>(initializeGame());
  const animationFrameRef = useRef<number>();
  const playerVelocityRef = useRef<number>(0);
  const aiTargetYRef = useRef<number>(GAME_CONSTANTS.CANVAS_HEIGHT / 2);
  const aiReactionCounterRef = useRef<number>(0);
  const servingRef = useRef<boolean>(false);

  function initializeGame(): PongState {
    return {
      playerPaddle: {
        x: GAME_CONSTANTS.PADDLE_OFFSET,
        y: GAME_CONSTANTS.CANVAS_HEIGHT / 2 - GAME_CONSTANTS.PADDLE_HEIGHT / 2,
        width: GAME_CONSTANTS.PADDLE_WIDTH,
        height: GAME_CONSTANTS.PADDLE_HEIGHT,
        speed: GAME_CONSTANTS.PADDLE_SPEED,
        color: GAME_CONSTANTS.PLAYER_COLOR,
      },
      aiPaddle: {
        x: GAME_CONSTANTS.CANVAS_WIDTH - GAME_CONSTANTS.PADDLE_OFFSET - GAME_CONSTANTS.PADDLE_WIDTH,
        y: GAME_CONSTANTS.CANVAS_HEIGHT / 2 - GAME_CONSTANTS.PADDLE_HEIGHT / 2,
        width: GAME_CONSTANTS.PADDLE_WIDTH,
        height: GAME_CONSTANTS.PADDLE_HEIGHT,
        speed: GAME_CONSTANTS.PADDLE_SPEED,
        color: GAME_CONSTANTS.AI_COLOR,
      },
      ball: {
        x: GAME_CONSTANTS.CANVAS_WIDTH / 2,
        y: GAME_CONSTANTS.CANVAS_HEIGHT / 2,
        radius: GAME_CONSTANTS.BALL_RADIUS,
        vx: GAME_CONSTANTS.BALL_INITIAL_SPEED * (Math.random() > 0.5 ? 1 : -1),
        vy: (Math.random() - 0.5) * GAME_CONSTANTS.BALL_INITIAL_SPEED,
        speed: GAME_CONSTANTS.BALL_INITIAL_SPEED,
        color: GAME_CONSTANTS.BALL_COLOR,
      },
      playerScore: 0,
      aiScore: 0,
      gameStatus: 'ready',
      winScore: GAME_CONSTANTS.WIN_SCORE,
      difficulty: 'medium',
      rallyCount: 0,
    };
  }

  function serveBall(toPlayer: boolean): void {
    servingRef.current = true;
    setTimeout(() => {
      setGameState(prev => ({
        ...prev,
        ball: {
          ...prev.ball,
          x: GAME_CONSTANTS.CANVAS_WIDTH / 2,
          y: GAME_CONSTANTS.CANVAS_HEIGHT / 2,
          vx: prev.ball.speed * (toPlayer ? -1 : 1),
          vy: (Math.random() - 0.5) * prev.ball.speed,
        },
        rallyCount: 0,
      }));
      servingRef.current = false;
    }, GAME_CONSTANTS.SERVE_DELAY);
  }

  // AI logic
  const updateAI = useCallback((ball: PongState['ball'], aiPaddle: PongState['aiPaddle'], difficulty: PongState['difficulty']) => {
    // Only track ball if it's moving toward AI
    if (ball.vx > 0) {
      aiReactionCounterRef.current++;

      if (aiReactionCounterRef.current >= GAME_CONSTANTS.AI_REACTION_DELAY) {
        const errorMargin = difficulty === 'easy' ? GAME_CONSTANTS.AI_ERROR_MARGIN_EASY
          : difficulty === 'medium' ? GAME_CONSTANTS.AI_ERROR_MARGIN_MEDIUM
          : GAME_CONSTANTS.AI_ERROR_MARGIN_HARD;

        // Predict ball position with some error
        const predictedY = ball.y + (Math.random() - 0.5) * errorMargin;
        aiTargetYRef.current = predictedY;
        aiReactionCounterRef.current = 0;
      }
    }

    // Move AI paddle toward target
    const paddleCenter = aiPaddle.y + aiPaddle.height / 2;
    const diff = aiTargetYRef.current - paddleCenter;
    const speedMultiplier = difficulty === 'easy' ? GAME_CONSTANTS.AI_SPEED_MULTIPLIER_EASY
      : difficulty === 'medium' ? GAME_CONSTANTS.AI_SPEED_MULTIPLIER_MEDIUM
      : GAME_CONSTANTS.AI_SPEED_MULTIPLIER_HARD;

    if (Math.abs(diff) > 5) {
      const moveSpeed = aiPaddle.speed * speedMultiplier;
      return Math.max(
        0,
        Math.min(
          GAME_CONSTANTS.CANVAS_HEIGHT - aiPaddle.height,
          aiPaddle.y + Math.sign(diff) * moveSpeed
        )
      );
    }

    return aiPaddle.y;
  }, []);

  // Game loop
  const gameLoop = useCallback(() => {
    setGameState((prev) => {
      if (prev.gameStatus !== 'playing' || servingRef.current) {
        return prev;
      }

      const newState = { ...prev };

      // Update player paddle
      if (playerVelocityRef.current !== 0) {
        newState.playerPaddle.y = Math.max(
          0,
          Math.min(
            GAME_CONSTANTS.CANVAS_HEIGHT - newState.playerPaddle.height,
            newState.playerPaddle.y + playerVelocityRef.current
          )
        );
      }

      // Update AI paddle
      newState.aiPaddle.y = updateAI(newState.ball, newState.aiPaddle, newState.difficulty);

      // Update ball
      newState.ball.x += newState.ball.vx;
      newState.ball.y += newState.ball.vy;

      // Ball collision with top/bottom walls
      if (newState.ball.y - newState.ball.radius <= 0 || newState.ball.y + newState.ball.radius >= GAME_CONSTANTS.CANVAS_HEIGHT) {
        newState.ball.vy = -newState.ball.vy;
        newState.ball.y = Math.max(
          newState.ball.radius,
          Math.min(GAME_CONSTANTS.CANVAS_HEIGHT - newState.ball.radius, newState.ball.y)
        );
      }

      // Ball collision with player paddle
      if (
        newState.ball.x - newState.ball.radius <= newState.playerPaddle.x + newState.playerPaddle.width &&
        newState.ball.x + newState.ball.radius >= newState.playerPaddle.x &&
        newState.ball.y + newState.ball.radius >= newState.playerPaddle.y &&
        newState.ball.y - newState.ball.radius <= newState.playerPaddle.y + newState.playerPaddle.height &&
        newState.ball.vx < 0
      ) {
        // Hit player paddle
        const hitPos = (newState.ball.y - (newState.playerPaddle.y + newState.playerPaddle.height / 2)) / (newState.playerPaddle.height / 2);
        const angle = hitPos * (Math.PI / 4); // Max 45 degrees

        newState.ball.speed = Math.min(GAME_CONSTANTS.BALL_MAX_SPEED, newState.ball.speed + GAME_CONSTANTS.BALL_SPEED_INCREMENT);
        newState.ball.vx = newState.ball.speed * Math.cos(angle);
        newState.ball.vy = newState.ball.speed * Math.sin(angle);
        newState.ball.x = newState.playerPaddle.x + newState.playerPaddle.width + newState.ball.radius;
        newState.rallyCount++;
      }

      // Ball collision with AI paddle
      if (
        newState.ball.x + newState.ball.radius >= newState.aiPaddle.x &&
        newState.ball.x - newState.ball.radius <= newState.aiPaddle.x + newState.aiPaddle.width &&
        newState.ball.y + newState.ball.radius >= newState.aiPaddle.y &&
        newState.ball.y - newState.ball.radius <= newState.aiPaddle.y + newState.aiPaddle.height &&
        newState.ball.vx > 0
      ) {
        // Hit AI paddle
        const hitPos = (newState.ball.y - (newState.aiPaddle.y + newState.aiPaddle.height / 2)) / (newState.aiPaddle.height / 2);
        const angle = hitPos * (Math.PI / 4);

        newState.ball.speed = Math.min(GAME_CONSTANTS.BALL_MAX_SPEED, newState.ball.speed + GAME_CONSTANTS.BALL_SPEED_INCREMENT);
        newState.ball.vx = -newState.ball.speed * Math.cos(angle);
        newState.ball.vy = newState.ball.speed * Math.sin(angle);
        newState.ball.x = newState.aiPaddle.x - newState.ball.radius;
        newState.rallyCount++;
      }

      // Ball out of bounds - score
      if (newState.ball.x < -newState.ball.radius) {
        // AI scores
        newState.aiScore++;
        newState.ball.speed = GAME_CONSTANTS.BALL_INITIAL_SPEED;

        if (newState.aiScore >= newState.winScore) {
          newState.gameStatus = 'gameOver';
        } else {
          serveBall(true);
        }
      } else if (newState.ball.x > GAME_CONSTANTS.CANVAS_WIDTH + newState.ball.radius) {
        // Player scores
        newState.playerScore++;
        newState.ball.speed = GAME_CONSTANTS.BALL_INITIAL_SPEED;

        if (newState.playerScore >= newState.winScore) {
          newState.gameStatus = 'gameOver';
        } else {
          serveBall(false);
        }
      }

      return newState;
    });

    animationFrameRef.current = requestAnimationFrame(gameLoop);
  }, [updateAI]);

  // Controls
  const startGame = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      gameStatus: 'playing',
    }));
    serveBall(Math.random() > 0.5);
  }, []);

  const pauseGame = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      gameStatus: prev.gameStatus === 'playing' ? 'paused' : 'playing',
    }));
  }, []);

  const resetGame = useCallback(() => {
    setGameState(initializeGame());
    playerVelocityRef.current = 0;
    servingRef.current = false;
  }, []);

  const movePaddle = useCallback((y: number) => {
    setGameState(prev => ({
      ...prev,
      playerPaddle: {
        ...prev.playerPaddle,
        y: Math.max(0, Math.min(GAME_CONSTANTS.CANVAS_HEIGHT - prev.playerPaddle.height, y - prev.playerPaddle.height / 2)),
      },
    }));
  }, []);

  const movePlayerUp = useCallback(() => {
    playerVelocityRef.current = -GAME_CONSTANTS.PADDLE_SPEED;
  }, []);

  const movePlayerDown = useCallback(() => {
    playerVelocityRef.current = GAME_CONSTANTS.PADDLE_SPEED;
  }, []);

  const stopPlayer = useCallback(() => {
    playerVelocityRef.current = 0;
  }, []);

  const setDifficulty = useCallback((difficulty: 'easy' | 'medium' | 'hard') => {
    setGameState(prev => ({
      ...prev,
      difficulty,
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

  const controls: GameControls = {
    startGame,
    pauseGame,
    resetGame,
    movePaddle,
    movePlayerUp,
    movePlayerDown,
    stopPlayer,
    setDifficulty,
  };

  return [gameState, controls];
};
