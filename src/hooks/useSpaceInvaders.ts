import { useState, useEffect, useCallback, useRef } from 'react';
import { SpaceInvadersState, GameControls, Alien, Bullet, Barrier } from '../components/Games/SpaceInvaders/types';
import { GAME_CONSTANTS, ALIEN_COLORS } from '../components/Games/SpaceInvaders/constants';

export const useSpaceInvaders = (): [SpaceInvadersState, GameControls] => {
  const [gameState, setGameState] = useState<SpaceInvadersState>(initializeGame());
  const animationFrameRef = useRef<number>();
  const alienMoveIntervalRef = useRef<number>();
  const playerVelocityRef = useRef<number>(0);
  const lastShotTimeRef = useRef<number>(0);

  function getHighScore(): number {
    return parseInt(localStorage.getItem('highScore_spaceInvaders') || '0', 10);
  }

  function saveHighScore(score: number) {
    const current = getHighScore();
    if (score > current) {
      localStorage.setItem('highScore_spaceInvaders', score.toString());
    }
  }

  function initializeGame(): SpaceInvadersState {
    return {
      player: {
        x: GAME_CONSTANTS.CANVAS_WIDTH / 2 - GAME_CONSTANTS.PLAYER_WIDTH / 2,
        y: GAME_CONSTANTS.CANVAS_HEIGHT - GAME_CONSTANTS.PLAYER_Y_OFFSET,
        width: GAME_CONSTANTS.PLAYER_WIDTH,
        height: GAME_CONSTANTS.PLAYER_HEIGHT,
        speed: GAME_CONSTANTS.PLAYER_SPEED,
        color: GAME_CONSTANTS.PLAYER_COLOR,
      },
      aliens: createAliens(1),
      bullets: [],
      barriers: createBarriers(),
      score: 0,
      highScore: getHighScore(),
      lives: GAME_CONSTANTS.INITIAL_LIVES,
      level: 1,
      gameStatus: 'ready',
      alienDirection: 1,
      alienMoveDownNext: false,
      lastAlienShot: 0,
    };
  }

  function createAliens(_level: number): Alien[] {
    const aliens: Alien[] = [];
    const startX = (GAME_CONSTANTS.CANVAS_WIDTH - (GAME_CONSTANTS.ALIEN_COLS * (GAME_CONSTANTS.ALIEN_WIDTH + GAME_CONSTANTS.ALIEN_SPACING_X))) / 2;

    for (let row = 0; row < GAME_CONSTANTS.ALIEN_ROWS; row++) {
      for (let col = 0; col < GAME_CONSTANTS.ALIEN_COLS; col++) {
        const type = row === 0 ? 'advanced' : row <= 2 ? 'medium' : 'basic';
        const points = type === 'advanced' ? GAME_CONSTANTS.POINTS_ADVANCED : type === 'medium' ? GAME_CONSTANTS.POINTS_MEDIUM : GAME_CONSTANTS.POINTS_BASIC;

        aliens.push({
          id: `alien-${row}-${col}`,
          x: startX + col * (GAME_CONSTANTS.ALIEN_WIDTH + GAME_CONSTANTS.ALIEN_SPACING_X),
          y: GAME_CONSTANTS.ALIEN_START_Y + row * (GAME_CONSTANTS.ALIEN_HEIGHT + GAME_CONSTANTS.ALIEN_SPACING_Y),
          width: GAME_CONSTANTS.ALIEN_WIDTH,
          height: GAME_CONSTANTS.ALIEN_HEIGHT,
          type,
          points,
          alive: true,
          color: ALIEN_COLORS[type],
        });
      }
    }

    return aliens;
  }

  function createBarriers(): Barrier[] {
    const barriers: Barrier[] = [];
    const totalWidth = GAME_CONSTANTS.BARRIER_COUNT * GAME_CONSTANTS.BARRIER_WIDTH + (GAME_CONSTANTS.BARRIER_COUNT - 1) * 30;
    const startX = (GAME_CONSTANTS.CANVAS_WIDTH - totalWidth) / 2;

    for (let i = 0; i < GAME_CONSTANTS.BARRIER_COUNT; i++) {
      const blocksX = Math.ceil(GAME_CONSTANTS.BARRIER_WIDTH / GAME_CONSTANTS.BARRIER_BLOCK_SIZE);
      const blocksY = Math.ceil(GAME_CONSTANTS.BARRIER_HEIGHT / GAME_CONSTANTS.BARRIER_BLOCK_SIZE);
      const blocks: boolean[][] = Array(blocksY).fill(null).map(() => Array(blocksX).fill(true));

      barriers.push({
        id: `barrier-${i}`,
        x: startX + i * (GAME_CONSTANTS.BARRIER_WIDTH + 30),
        y: GAME_CONSTANTS.BARRIER_Y,
        width: GAME_CONSTANTS.BARRIER_WIDTH,
        height: GAME_CONSTANTS.BARRIER_HEIGHT,
        blocks,
        blockSize: GAME_CONSTANTS.BARRIER_BLOCK_SIZE,
      });
    }

    return barriers;
  }

  // Check collision between bullet and barrier
  const checkBarrierCollision = useCallback((bullet: Bullet, barriers: Barrier[]): boolean => {
    for (const barrier of barriers) {
      if (
        bullet.x + bullet.width > barrier.x &&
        bullet.x < barrier.x + barrier.width &&
        bullet.y + bullet.height > barrier.y &&
        bullet.y < barrier.y + barrier.height
      ) {
        // Hit barrier - destroy some blocks
        const relX = bullet.x - barrier.x;
        const relY = bullet.y - barrier.y;
        const blockX = Math.floor(relX / barrier.blockSize);
        const blockY = Math.floor(relY / barrier.blockSize);

        if (blockY >= 0 && blockY < barrier.blocks.length && blockX >= 0 && blockX < barrier.blocks[0].length) {
          barrier.blocks[blockY][blockX] = false;
          // Destroy adjacent blocks for bigger impact
          if (blockX > 0) barrier.blocks[blockY][blockX - 1] = false;
          if (blockX < barrier.blocks[0].length - 1) barrier.blocks[blockY][blockX + 1] = false;
        }

        return true;
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

      const newState = { ...prev };

      // Update player position based on velocity
      if (playerVelocityRef.current !== 0) {
        const newX = newState.player.x + playerVelocityRef.current;
        newState.player.x = Math.max(0, Math.min(GAME_CONSTANTS.CANVAS_WIDTH - newState.player.width, newX));
      }

      // Update bullets
      newState.bullets = newState.bullets.map(bullet => ({
        ...bullet,
        y: bullet.source === 'player' ? bullet.y - bullet.speed : bullet.y + bullet.speed,
      })).filter(bullet => {
        // Remove off-screen bullets
        if (bullet.y < -bullet.height || bullet.y > GAME_CONSTANTS.CANVAS_HEIGHT) {
          return false;
        }

        // Check collision with barriers
        if (checkBarrierCollision(bullet, newState.barriers)) {
          return false;
        }

        // Check collision with player (alien bullets only)
        if (bullet.source === 'alien') {
          if (
            bullet.x + bullet.width > newState.player.x &&
            bullet.x < newState.player.x + newState.player.width &&
            bullet.y + bullet.height > newState.player.y &&
            bullet.y < newState.player.y + newState.player.height
          ) {
            newState.lives -= 1;
            if (newState.lives <= 0) {
              saveHighScore(newState.score);
              newState.gameStatus = 'gameOver';
              newState.highScore = Math.max(newState.highScore, newState.score);
            }
            return false;
          }
        }

        // Check collision with aliens (player bullets only)
        if (bullet.source === 'player') {
          for (const alien of newState.aliens) {
            if (
              alien.alive &&
              bullet.x + bullet.width > alien.x &&
              bullet.x < alien.x + alien.width &&
              bullet.y < alien.y + alien.height &&
              bullet.y + bullet.height > alien.y
            ) {
              alien.alive = false;
              newState.score += alien.points;
              return false;
            }
          }
        }

        return true;
      });

      // Random alien shooting
      const aliveAliens = newState.aliens.filter(a => a.alive);
      if (Math.random() < GAME_CONSTANTS.ALIEN_SHOOT_CHANCE * aliveAliens.length) {
        const shooter = aliveAliens[Math.floor(Math.random() * aliveAliens.length)];
        newState.bullets.push({
          id: `bullet-alien-${Date.now()}-${Math.random()}`,
          x: shooter.x + shooter.width / 2 - GAME_CONSTANTS.BULLET_WIDTH / 2,
          y: shooter.y + shooter.height,
          width: GAME_CONSTANTS.BULLET_WIDTH,
          height: GAME_CONSTANTS.BULLET_HEIGHT,
          speed: GAME_CONSTANTS.ALIEN_BULLET_SPEED,
          source: 'alien',
          color: GAME_CONSTANTS.ALIEN_BULLET_COLOR,
        });
      }

      // Check if all aliens destroyed
      if (aliveAliens.length === 0) {
        return {
          ...newState,
          gameStatus: 'levelComplete',
        };
      }

      // Check if aliens reached player
      const lowestAlien = aliveAliens.reduce((lowest, alien) => alien.y > lowest ? alien.y : lowest, 0);
      if (lowestAlien + GAME_CONSTANTS.ALIEN_HEIGHT >= newState.player.y) {
        saveHighScore(newState.score);
        return {
          ...newState,
          lives: 0,
          gameStatus: 'gameOver',
          highScore: Math.max(newState.highScore, newState.score),
        };
      }

      return newState;
    });

    animationFrameRef.current = requestAnimationFrame(gameLoop);
  }, [checkBarrierCollision]);

  // Alien movement (separate interval)
  const moveAliens = useCallback(() => {
    setGameState((prev) => {
      if (prev.gameStatus !== 'playing') {
        return prev;
      }

      const newState = { ...prev };
      const aliveAliens = newState.aliens.filter(a => a.alive);

      if (newState.alienMoveDownNext) {
        // Move down
        newState.aliens = newState.aliens.map(alien => ({
          ...alien,
          y: alien.y + GAME_CONSTANTS.ALIEN_MOVE_DOWN,
        }));
        newState.alienDirection *= -1;
        newState.alienMoveDownNext = false;
      } else {
        // Move horizontally
        newState.aliens = newState.aliens.map(alien => ({
          ...alien,
          x: alien.x + GAME_CONSTANTS.ALIEN_MOVE_SPEED * newState.alienDirection,
        }));

        // Check if any alien hit the edge
        const leftmost = aliveAliens.reduce((min, alien) => Math.min(min, alien.x), GAME_CONSTANTS.CANVAS_WIDTH);
        const rightmost = aliveAliens.reduce((max, alien) => Math.max(max, alien.x + alien.width), 0);

        if (leftmost <= 0 || rightmost >= GAME_CONSTANTS.CANVAS_WIDTH) {
          newState.alienMoveDownNext = true;
        }
      }

      return newState;
    });
  }, []);

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
    playerVelocityRef.current = 0;
  }, []);

  const nextLevel = useCallback(() => {
    setGameState(prev => {
      const newLevel = prev.level + 1;
      return {
        ...prev,
        level: newLevel,
        aliens: createAliens(newLevel),
        bullets: [],
        barriers: createBarriers(),
        gameStatus: 'ready',
        alienDirection: 1,
        alienMoveDownNext: false,
      };
    });
  }, []);

  const movePlayer = useCallback((x: number) => {
    setGameState(prev => ({
      ...prev,
      player: {
        ...prev.player,
        x: Math.max(0, Math.min(GAME_CONSTANTS.CANVAS_WIDTH - prev.player.width, x - prev.player.width / 2)),
      },
    }));
  }, []);

  const movePlayerLeft = useCallback(() => {
    playerVelocityRef.current = -GAME_CONSTANTS.PLAYER_SPEED;
  }, []);

  const movePlayerRight = useCallback(() => {
    playerVelocityRef.current = GAME_CONSTANTS.PLAYER_SPEED;
  }, []);

  const stopPlayer = useCallback(() => {
    playerVelocityRef.current = 0;
  }, []);

  const shoot = useCallback(() => {
    const now = Date.now();
    if (now - lastShotTimeRef.current < 300) return; // Rate limit: 300ms

    lastShotTimeRef.current = now;
    setGameState(prev => {
      if (prev.gameStatus !== 'playing') return prev;

      return {
        ...prev,
        bullets: [
          ...prev.bullets,
          {
            id: `bullet-player-${Date.now()}-${Math.random()}`,
            x: prev.player.x + prev.player.width / 2 - GAME_CONSTANTS.BULLET_WIDTH / 2,
            y: prev.player.y,
            width: GAME_CONSTANTS.BULLET_WIDTH,
            height: GAME_CONSTANTS.BULLET_HEIGHT,
            speed: GAME_CONSTANTS.PLAYER_BULLET_SPEED,
            source: 'player',
            color: GAME_CONSTANTS.PLAYER_BULLET_COLOR,
          },
        ],
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

  // Effect: Alien movement interval
  useEffect(() => {
    if (gameState.gameStatus === 'playing') {
      const aliveCount = gameState.aliens.filter(a => a.alive).length;
      const totalAliens = GAME_CONSTANTS.ALIEN_ROWS * GAME_CONSTANTS.ALIEN_COLS;
      const speedMultiplier = Math.pow(GAME_CONSTANTS.LEVEL_SPEED_MULTIPLIER, gameState.level - 1);
      const densityMultiplier = 1 + (1 - aliveCount / totalAliens) * 0.5; // Faster when fewer aliens
      const interval = Math.max(
        GAME_CONSTANTS.ALIEN_MIN_MOVE_INTERVAL,
        GAME_CONSTANTS.ALIEN_MOVE_INTERVAL * speedMultiplier / densityMultiplier
      );

      alienMoveIntervalRef.current = window.setInterval(moveAliens, interval);
    }

    return () => {
      if (alienMoveIntervalRef.current) {
        clearInterval(alienMoveIntervalRef.current);
      }
    };
  }, [gameState.gameStatus, gameState.aliens, gameState.level, moveAliens]);

  const controls: GameControls = {
    startGame,
    pauseGame,
    resetGame,
    nextLevel,
    movePlayer,
    movePlayerLeft,
    movePlayerRight,
    stopPlayer,
    shoot,
  };

  return [gameState, controls];
};
