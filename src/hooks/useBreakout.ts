import { useState, useEffect, useCallback, useRef } from 'react';
import { BreakoutState, GameControls, Brick, Ball, PowerUp, BrickType, PowerUpType, ActivePowerUp } from '../components/Games/Breakout/types';
import { GAME_CONSTANTS, BRICK_COLORS, POINTS } from '../components/Games/Breakout/constants';
import { LEVELS } from '../components/Games/Breakout/levels';

export const useBreakout = (): [BreakoutState, GameControls] => {
  const [gameState, setGameState] = useState<BreakoutState>(initializeGame());
  const animationFrameRef = useRef<number>();
  const mouseXRef = useRef<number>(GAME_CONSTANTS.CANVAS_WIDTH / 2);

  function getHighScore(): number {
    return parseInt(localStorage.getItem('highScore_breakout') || '0', 10);
  }

  function saveHighScore(score: number) {
    const current = getHighScore();
    if (score > current) {
      localStorage.setItem('highScore_breakout', score.toString());
    }
  }

  function initializeGame(): BreakoutState {
    return {
      paddle: {
        x: GAME_CONSTANTS.CANVAS_WIDTH / 2 - GAME_CONSTANTS.PADDLE_WIDTH / 2,
        y: GAME_CONSTANTS.PADDLE_Y,
        width: GAME_CONSTANTS.PADDLE_WIDTH,
        height: GAME_CONSTANTS.PADDLE_HEIGHT,
        speed: GAME_CONSTANTS.PADDLE_SPEED,
        color: GAME_CONSTANTS.PADDLE_COLOR,
        originalWidth: GAME_CONSTANTS.PADDLE_WIDTH,
      },
      balls: [createBall()],
      bricks: generateBricks(0),
      powerUps: [],
      score: 0,
      highScore: getHighScore(),
      lives: GAME_CONSTANTS.INITIAL_LIVES,
      level: 1,
      gameStatus: 'ready',
      combo: 0,
      activePowerUps: [],
    };
  }

  function createBall(stuck = true): Ball {
    return {
      id: `ball-${Date.now()}-${Math.random()}`,
      x: GAME_CONSTANTS.CANVAS_WIDTH / 2,
      y: GAME_CONSTANTS.PADDLE_Y - GAME_CONSTANTS.BALL_RADIUS - 5,
      vx: 0,
      vy: 0,
      radius: GAME_CONSTANTS.BALL_RADIUS,
      speed: GAME_CONSTANTS.BALL_SPEED,
      stuck,
      color: GAME_CONSTANTS.BALL_COLOR,
    };
  }

  function generateBricks(level: number): Brick[][] {
    const levelData = LEVELS[level % LEVELS.length];
    const bricks: Brick[][] = [];

    for (let row = 0; row < levelData.rows; row++) {
      bricks[row] = [];
      for (let col = 0; col < levelData.cols; col++) {
        const brickType = levelData.pattern[row][col];

        if (brickType === null) {
          continue; // Skip null bricks
        }

        const x = GAME_CONSTANTS.BRICK_OFFSET_LEFT + col * (GAME_CONSTANTS.BRICK_WIDTH + GAME_CONSTANTS.BRICK_PADDING);
        const y = GAME_CONSTANTS.BRICK_OFFSET_TOP + row * (GAME_CONSTANTS.BRICK_HEIGHT + GAME_CONSTANTS.BRICK_PADDING);

        const brick: Brick = {
          x,
          y,
          width: GAME_CONSTANTS.BRICK_WIDTH,
          height: GAME_CONSTANTS.BRICK_HEIGHT,
          type: brickType,
          color: BRICK_COLORS[brickType],
          hits: 0,
          maxHits: getMaxHitsForType(brickType),
          destroyed: false,
          points: POINTS[brickType],
        };

        bricks[row][col] = brick;
      }
    }

    return bricks;
  }

  function getMaxHitsForType(type: BrickType): number {
    switch (type) {
      case 'normal': return 1;
      case 'strong': return 2;
      case 'veryStrong': return 3;
      case 'unbreakable': return Infinity;
      case 'powerup': return 1;
      default: return 1;
    }
  }

  // Check collision between ball and paddle
  const checkPaddleCollision = useCallback((ball: Ball, paddle: BreakoutState['paddle']): Ball | null => {
    if (
      ball.y + ball.radius >= paddle.y &&
      ball.y - ball.radius <= paddle.y + paddle.height &&
      ball.x >= paddle.x &&
      ball.x <= paddle.x + paddle.width
    ) {
      // Calculate hit position on paddle (-1 to 1)
      const hitPos = (ball.x - (paddle.x + paddle.width / 2)) / (paddle.width / 2);

      // Angle reflection based on hit position (max 60 degrees)
      const angle = hitPos * (Math.PI / 3);
      const speed = ball.speed;

      return {
        ...ball,
        vy: -Math.abs(speed * Math.cos(angle)),
        vx: speed * Math.sin(angle),
        y: paddle.y - ball.radius,
      };
    }
    return null;
  }, []);

  // Check collision between ball and bricks
  const checkBrickCollision = useCallback((ball: Ball, bricks: Brick[][]): { ball: Ball; hitBrick: Brick | null } => {
    for (let row = 0; row < bricks.length; row++) {
      for (let col = 0; col < bricks[row].length; col++) {
        const brick = bricks[row][col];
        if (!brick || brick.destroyed || brick.type === 'unbreakable') continue;

        if (
          ball.x + ball.radius > brick.x &&
          ball.x - ball.radius < brick.x + brick.width &&
          ball.y + ball.radius > brick.y &&
          ball.y - ball.radius < brick.y + brick.height
        ) {
          // Hit brick!
          const ballCenterX = ball.x;
          const ballCenterY = ball.y;
          const brickCenterX = brick.x + brick.width / 2;
          const brickCenterY = brick.y + brick.height / 2;

          const dx = ballCenterX - brickCenterX;
          const dy = ballCenterY - brickCenterY;

          // Determine which side was hit
          if (Math.abs(dx / brick.width) > Math.abs(dy / brick.height)) {
            // Hit from left or right
            return {
              ball: { ...ball, vx: -ball.vx },
              hitBrick: brick,
            };
          } else {
            // Hit from top or bottom
            return {
              ball: { ...ball, vy: -ball.vy },
              hitBrick: brick,
            };
          }
        }
      }
    }

    return { ball, hitBrick: null };
  }, []);

  // Spawn power-up from brick
  const spawnPowerUp = useCallback((brick: Brick): PowerUp | null => {
    const powerUpTypes: PowerUpType[] = ['widerPaddle', 'multiball', 'slowBall', 'extraLife'];
    const randomType = powerUpTypes[Math.floor(Math.random() * powerUpTypes.length)];

    return {
      id: `powerup-${Date.now()}-${Math.random()}`,
      x: brick.x + brick.width / 2 - GAME_CONSTANTS.POWERUP_WIDTH / 2,
      y: brick.y,
      type: randomType,
      width: GAME_CONSTANTS.POWERUP_WIDTH,
      height: GAME_CONSTANTS.POWERUP_HEIGHT,
      vy: GAME_CONSTANTS.POWERUP_FALL_SPEED,
      collected: false,
    };
  }, []);

  // Apply power-up effect
  const applyPowerUp = useCallback((type: PowerUpType, gameState: BreakoutState): BreakoutState => {
    const newActivePowerUps = [...gameState.activePowerUps];

    switch (type) {
      case 'widerPaddle':
        newActivePowerUps.push({
          type,
          duration: GAME_CONSTANTS.POWERUP_DURATION,
          startTime: Date.now(),
        });
        return {
          ...gameState,
          paddle: {
            ...gameState.paddle,
            width: gameState.paddle.originalWidth * GAME_CONSTANTS.WIDER_PADDLE_MULTIPLIER,
          },
          activePowerUps: newActivePowerUps,
        };

      case 'multiball':
        // Spawn 2 additional balls
        const newBalls = [
          ...gameState.balls,
          { ...createBall(false), vx: -3, vy: -5, x: gameState.balls[0].x - 20, y: gameState.balls[0].y },
          { ...createBall(false), vx: 3, vy: -5, x: gameState.balls[0].x + 20, y: gameState.balls[0].y },
        ];
        return {
          ...gameState,
          balls: newBalls,
        };

      case 'slowBall':
        newActivePowerUps.push({
          type,
          duration: GAME_CONSTANTS.POWERUP_DURATION,
          startTime: Date.now(),
        });
        return {
          ...gameState,
          balls: gameState.balls.map(ball => ({
            ...ball,
            speed: GAME_CONSTANTS.BALL_SPEED * GAME_CONSTANTS.SLOW_BALL_MULTIPLIER,
          })),
          activePowerUps: newActivePowerUps,
        };

      case 'extraLife':
        return {
          ...gameState,
          lives: gameState.lives + 1,
        };

      default:
        return gameState;
    }
  }, []);

  // Game loop
  const gameLoop = useCallback(() => {
    setGameState((prev) => {
      if (prev.gameStatus !== 'playing') {
        return prev;
      }

      let newState = { ...prev };

      // Update balls
      let newBalls = newState.balls.map(ball => {
        if (ball.stuck) {
          // Keep ball attached to paddle
          return {
            ...ball,
            x: newState.paddle.x + newState.paddle.width / 2,
            y: newState.paddle.y - ball.radius - 2,
          };
        }

        // Update ball position
        let newBall = {
          ...ball,
          x: ball.x + ball.vx,
          y: ball.y + ball.vy,
        };

        // Wall collisions
        if (newBall.x - newBall.radius <= 0 || newBall.x + newBall.radius >= GAME_CONSTANTS.CANVAS_WIDTH) {
          newBall.vx = -newBall.vx;
          newBall.x = Math.max(newBall.radius, Math.min(GAME_CONSTANTS.CANVAS_WIDTH - newBall.radius, newBall.x));
        }

        // Ceiling collision
        if (newBall.y - newBall.radius <= 0) {
          newBall.vy = -newBall.vy;
          newBall.y = newBall.radius;
        }

        // Paddle collision
        const paddleCollision = checkPaddleCollision(newBall, newState.paddle);
        if (paddleCollision) {
          newBall = paddleCollision;
        }

        // Brick collision
        const { ball: ballAfterBrick, hitBrick } = checkBrickCollision(newBall, newState.bricks);
        newBall = ballAfterBrick;

        if (hitBrick) {
          // Update brick
          newState.bricks = newState.bricks.map(row =>
            row.map(brick => {
              if (brick === hitBrick) {
                const newHits = brick.hits + 1;
                if (newHits >= brick.maxHits) {
                  // Brick destroyed
                  newState.score += brick.points + (newState.combo * POINTS.combo);
                  newState.combo += 1;

                  // Spawn power-up if it's a power-up brick
                  if (brick.type === 'powerup') {
                    const powerUp = spawnPowerUp(brick);
                    if (powerUp) {
                      newState.powerUps = [...newState.powerUps, powerUp];
                    }
                  }

                  return { ...brick, destroyed: true, hits: newHits };
                } else {
                  // Brick damaged but not destroyed
                  return { ...brick, hits: newHits };
                }
              }
              return brick;
            })
          );
        }

        return newBall;
      });

      // Remove balls that fell off screen
      const ballsOnScreen = newBalls.filter(ball => ball.y - ball.radius < GAME_CONSTANTS.CANVAS_HEIGHT);

      if (ballsOnScreen.length === 0) {
        // Lost all balls - lose a life
        const newLives = newState.lives - 1;
        if (newLives <= 0) {
          saveHighScore(newState.score);
          return {
            ...newState,
            lives: newLives,
            gameStatus: 'gameOver',
            highScore: Math.max(newState.highScore, newState.score),
          };
        }

        // Reset ball and paddle
        return {
          ...newState,
          balls: [createBall()],
          lives: newLives,
          combo: 0,
          gameStatus: 'ready',
        };
      }

      newState.balls = ballsOnScreen;

      // Update power-ups
      newState.powerUps = newState.powerUps.map(powerUp => ({
        ...powerUp,
        y: powerUp.y + powerUp.vy,
      })).filter(powerUp => {
        // Check collision with paddle
        if (
          !powerUp.collected &&
          powerUp.y + powerUp.height >= newState.paddle.y &&
          powerUp.x + powerUp.width >= newState.paddle.x &&
          powerUp.x <= newState.paddle.x + newState.paddle.width
        ) {
          // Collected!
          newState = applyPowerUp(powerUp.type, newState);
          return false;
        }

        // Remove if off screen
        return powerUp.y < GAME_CONSTANTS.CANVAS_HEIGHT;
      });

      // Update active power-up durations
      const now = Date.now();
      newState.activePowerUps = newState.activePowerUps.filter(powerUp => {
        if (powerUp.duration === undefined) return true; // Permanent power-ups

        const elapsed = now - powerUp.startTime;
        if (elapsed >= powerUp.duration) {
          // Power-up expired - reset effects
          if (powerUp.type === 'widerPaddle') {
            newState.paddle.width = newState.paddle.originalWidth;
          } else if (powerUp.type === 'slowBall') {
            newState.balls = newState.balls.map(ball => ({
              ...ball,
              speed: GAME_CONSTANTS.BALL_SPEED,
            }));
          }
          return false;
        }
        return true;
      });

      // Check level complete
      const allBricksDestroyed = newState.bricks.every(row =>
        row.every(brick => !brick || brick.destroyed || brick.type === 'unbreakable')
      );

      if (allBricksDestroyed) {
        return {
          ...newState,
          gameStatus: 'levelComplete',
        };
      }

      return newState;
    });

    animationFrameRef.current = requestAnimationFrame(gameLoop);
  }, [checkPaddleCollision, checkBrickCollision, spawnPowerUp, applyPowerUp]);

  // Controls
  const startGame = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      gameStatus: 'playing',
    }));
  }, []);

  const launchBall = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      balls: prev.balls.map(ball =>
        ball.stuck
          ? { ...ball, stuck: false, vx: 3, vy: -GAME_CONSTANTS.BALL_SPEED }
          : ball
      ),
      gameStatus: 'playing',
    }));
  }, []);

  const movePaddle = useCallback((x: number) => {
    mouseXRef.current = x;
    setGameState(prev => {
      const newX = Math.max(
        0,
        Math.min(GAME_CONSTANTS.CANVAS_WIDTH - prev.paddle.width, x - prev.paddle.width / 2)
      );
      return {
        ...prev,
        paddle: { ...prev.paddle, x: newX },
      };
    });
  }, []);

  const pauseGame = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      gameStatus: prev.gameStatus === 'playing' ? 'paused' : 'playing',
    }));
  }, []);

  const resetGame = useCallback(() => {
    setGameState(initializeGame());
  }, []);

  const nextLevel = useCallback(() => {
    setGameState(prev => {
      const newLevel = prev.level + 1;
      return {
        ...prev,
        level: newLevel,
        bricks: generateBricks(newLevel - 1),
        balls: [createBall()],
        powerUps: [],
        activePowerUps: [],
        paddle: {
          ...prev.paddle,
          width: prev.paddle.originalWidth,
        },
        combo: 0,
        gameStatus: 'ready',
      };
    });
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
    launchBall,
    movePaddle,
    pauseGame,
    resetGame,
    nextLevel,
  };

  return [gameState, controls];
};
