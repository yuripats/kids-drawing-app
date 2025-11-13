import { useState, useEffect, useCallback, useRef } from 'react';
import { EndlessRunnerState, GameControls, Obstacle, Cloud } from '../components/Games/EndlessRunner/types';
import { GAME_CONSTANTS, OBSTACLE_COLORS } from '../components/Games/EndlessRunner/constants';

export const useEndlessRunner = (): [EndlessRunnerState, GameControls] => {
  const animationFrameRef = useRef<number>();
  const nextObstacleDistanceRef = useRef<number>(GAME_CONSTANTS.OBSTACLE_MIN_GAP);

  function getHighScore(): number {
    return parseInt(localStorage.getItem('highScore_endlessRunner') || '0', 10);
  }

  const saveHighScore = useCallback((score: number) => {
    const current = parseInt(localStorage.getItem('highScore_endlessRunner') || '0', 10);
    if (score > current) {
      localStorage.setItem('highScore_endlessRunner', score.toString());
    }
  }, []);

  function createClouds(): Cloud[] {
    const clouds: Cloud[] = [];
    for (let i = 0; i < GAME_CONSTANTS.CLOUD_COUNT; i++) {
      clouds.push({
        id: `cloud-${i}`,
        x: Math.random() * GAME_CONSTANTS.CANVAS_WIDTH,
        y: 20 + Math.random() * 80,
        width: GAME_CONSTANTS.CLOUD_MIN_WIDTH + Math.random() * (GAME_CONSTANTS.CLOUD_MAX_WIDTH - GAME_CONSTANTS.CLOUD_MIN_WIDTH),
      });
    }
    return clouds;
  }

  function createObstacle(x: number, _speed: number): Obstacle {
    const types: ('cactus' | 'rock' | 'bird')[] = ['cactus', 'rock', 'bird'];
    const type = types[Math.floor(Math.random() * types.length)];

    let width: number;
    let height: number;
    let y: number;

    if (type === 'cactus') {
      width = GAME_CONSTANTS.CACTUS_WIDTH;
      height = GAME_CONSTANTS.CACTUS_HEIGHT;
      y = GAME_CONSTANTS.GROUND_Y - height;
    } else if (type === 'rock') {
      width = GAME_CONSTANTS.ROCK_WIDTH;
      height = GAME_CONSTANTS.ROCK_HEIGHT;
      y = GAME_CONSTANTS.GROUND_Y - height;
    } else {
      // bird
      width = GAME_CONSTANTS.BIRD_WIDTH;
      height = GAME_CONSTANTS.BIRD_HEIGHT;
      const yPositions = GAME_CONSTANTS.BIRD_Y_POSITIONS;
      y = yPositions[Math.floor(Math.random() * yPositions.length)];
    }

    return {
      id: `obstacle-${Date.now()}-${Math.random()}`,
      x,
      y,
      width,
      height,
      type,
      color: OBSTACLE_COLORS[type],
    };
  }

  const initializeGame = useCallback((): EndlessRunnerState => {
    return {
      player: {
        x: GAME_CONSTANTS.PLAYER_X,
        y: GAME_CONSTANTS.GROUND_Y - GAME_CONSTANTS.PLAYER_HEIGHT,
        width: GAME_CONSTANTS.PLAYER_WIDTH,
        height: GAME_CONSTANTS.PLAYER_HEIGHT,
        velocityY: 0,
        isJumping: false,
        isDucking: false,
        color: GAME_CONSTANTS.PLAYER_COLOR,
      },
      obstacles: [],
      clouds: createClouds(),
      score: 0,
      highScore: getHighScore(),
      distance: 0,
      gameStatus: 'ready',
      speed: GAME_CONSTANTS.INITIAL_SPEED,
      groundY: GAME_CONSTANTS.GROUND_Y,
    };
  }, []);

  const [gameState, setGameState] = useState<EndlessRunnerState>(() => initializeGame());

  // Check collision
  const checkCollision = useCallback((player: EndlessRunnerState['player'], obstacle: Obstacle): boolean => {
    const playerHeight = player.isDucking ? GAME_CONSTANTS.PLAYER_DUCK_HEIGHT : player.height;
    const playerY = player.isDucking ? GAME_CONSTANTS.GROUND_Y - playerHeight : player.y;

    return (
      player.x < obstacle.x + obstacle.width &&
      player.x + player.width > obstacle.x &&
      playerY < obstacle.y + obstacle.height &&
      playerY + playerHeight > obstacle.y
    );
  }, []);

  // Game loop
  const gameLoop = useCallback(() => {
    setGameState((prev) => {
      if (prev.gameStatus !== 'playing') {
        return prev;
      }

      const newState = { ...prev };

      // Update speed
      newState.speed = Math.min(
        GAME_CONSTANTS.MAX_SPEED,
        newState.speed + GAME_CONSTANTS.SPEED_INCREMENT
      );

      // Update distance and score
      newState.distance += newState.speed / 10;
      newState.score = Math.floor(newState.distance * GAME_CONSTANTS.POINTS_PER_DISTANCE);

      // Update player
      if (newState.player.isJumping || newState.player.y < GAME_CONSTANTS.GROUND_Y - newState.player.height) {
        newState.player.velocityY += GAME_CONSTANTS.GRAVITY;
        newState.player.y += newState.player.velocityY;

        // Land on ground
        if (newState.player.y >= GAME_CONSTANTS.GROUND_Y - newState.player.height) {
          newState.player.y = GAME_CONSTANTS.GROUND_Y - newState.player.height;
          newState.player.velocityY = 0;
          newState.player.isJumping = false;
        }
      }

      // Update clouds
      newState.clouds = newState.clouds.map(cloud => {
        const newX = cloud.x - newState.speed * GAME_CONSTANTS.CLOUD_SPEED_MULTIPLIER;
        return {
          ...cloud,
          x: newX < -cloud.width ? GAME_CONSTANTS.CANVAS_WIDTH : newX,
        };
      });

      // Update obstacles
      newState.obstacles = newState.obstacles.map(obstacle => ({
        ...obstacle,
        x: obstacle.x - newState.speed,
      })).filter(obstacle => {
        // Remove off-screen obstacles
        if (obstacle.x + obstacle.width < 0) {
          newState.score += GAME_CONSTANTS.POINTS_PER_OBSTACLE;
          return false;
        }

        // Check collision
        if (checkCollision(newState.player, obstacle)) {
          saveHighScore(newState.score);
          newState.gameStatus = 'gameOver';
          newState.highScore = Math.max(newState.highScore, newState.score);
        }

        return true;
      });

      // Spawn new obstacles
      const lastObstacle = newState.obstacles[newState.obstacles.length - 1];
      const distanceFromLastObstacle = lastObstacle
        ? GAME_CONSTANTS.CANVAS_WIDTH - lastObstacle.x
        : GAME_CONSTANTS.CANVAS_WIDTH;

      if (distanceFromLastObstacle >= nextObstacleDistanceRef.current) {
        newState.obstacles.push(createObstacle(GAME_CONSTANTS.CANVAS_WIDTH, newState.speed));
        nextObstacleDistanceRef.current =
          GAME_CONSTANTS.OBSTACLE_MIN_GAP +
          Math.random() * (GAME_CONSTANTS.OBSTACLE_MAX_GAP - GAME_CONSTANTS.OBSTACLE_MIN_GAP);
      }

      return newState;
    });

    animationFrameRef.current = requestAnimationFrame(gameLoop);
  }, [checkCollision, saveHighScore]);

  // Controls
  const startGame = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      gameStatus: 'playing',
    }));
  }, []);

  const pauseGame = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      gameStatus: prev.gameStatus === 'playing' ? 'paused' : 'playing',
    }));
  }, []);

  const resetGame = useCallback(() => {
    setGameState(initializeGame());
    nextObstacleDistanceRef.current = GAME_CONSTANTS.OBSTACLE_MIN_GAP;
  }, [initializeGame]);

  const jump = useCallback(() => {
    setGameState(prev => {
      if (prev.gameStatus !== 'playing') return prev;
      if (prev.player.isJumping) return prev; // Already jumping
      if (prev.player.y < GAME_CONSTANTS.GROUND_Y - prev.player.height) return prev; // In air

      return {
        ...prev,
        player: {
          ...prev.player,
          velocityY: GAME_CONSTANTS.JUMP_FORCE,
          isJumping: true,
        },
      };
    });
  }, []);

  const duck = useCallback(() => {
    setGameState(prev => {
      if (prev.gameStatus !== 'playing') return prev;

      return {
        ...prev,
        player: {
          ...prev.player,
          isDucking: true,
          height: GAME_CONSTANTS.PLAYER_DUCK_HEIGHT,
        },
      };
    });
  }, []);

  const stopDuck = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      player: {
        ...prev.player,
        isDucking: false,
        height: GAME_CONSTANTS.PLAYER_HEIGHT,
      },
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
    jump,
    duck,
    stopDuck,
  };

  return [gameState, controls];
};
