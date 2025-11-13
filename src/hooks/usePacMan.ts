import { useState, useEffect, useCallback, useRef } from 'react';
import { PacManState, GameControls, Direction, Ghost, GhostMode } from '../components/Games/PacMan/types';
import { GAME_CONSTANTS, DIRECTION_VECTORS, GHOST_COLORS } from '../components/Games/PacMan/constants';
import { CLASSIC_MAZE, initializeMaze, isValidMove } from '../components/Games/PacMan/mazes';
import { getNextGhostDirection } from '../components/Games/PacMan/ghostAI';

export const usePacMan = (): [PacManState, GameControls] => {
  const pacmanIntervalRef = useRef<NodeJS.Timeout>();
  const ghostIntervalRef = useRef<NodeJS.Timeout>();
  const powerUpIntervalRef = useRef<NodeJS.Timeout>();

  function getHighScore(): number {
    return parseInt(localStorage.getItem('highScore_pacman') || '0', 10);
  }

  const saveHighScore = useCallback((score: number) => {
    const current = parseInt(localStorage.getItem('highScore_pacman') || '0', 10);
    if (score > current) {
      localStorage.setItem('highScore_pacman', score.toString());
    }
  }, []);

  const initializeGame = useCallback((): PacManState => {
    const { dots, powerPellets } = initializeMaze();

    const ghosts: Ghost[] = [
      {
        id: 'blinky',
        name: 'blinky',
        row: 9,
        col: 9,
        direction: 'left',
        color: GHOST_COLORS.blinky,
        personality: 'aggressive',
        mode: 'chase',
        spawnRow: 9,
        spawnCol: 9,
      },
      {
        id: 'pinky',
        name: 'pinky',
        row: 9,
        col: 10,
        direction: 'right',
        color: GHOST_COLORS.pinky,
        personality: 'ambush',
        mode: 'chase',
        spawnRow: 9,
        spawnCol: 10,
      },
      {
        id: 'inky',
        name: 'inky',
        row: 9,
        col: 8,
        direction: 'up',
        color: GHOST_COLORS.inky,
        personality: 'flanker',
        mode: 'chase',
        spawnRow: 9,
        spawnCol: 8,
      },
      {
        id: 'clyde',
        name: 'clyde',
        row: 10,
        col: 9,
        direction: 'down',
        color: GHOST_COLORS.clyde,
        personality: 'random',
        mode: 'chase',
        spawnRow: 10,
        spawnCol: 9,
      },
    ];

    return {
      pacman: {
        row: GAME_CONSTANTS.PACMAN_SPAWN_ROW,
        col: GAME_CONSTANTS.PACMAN_SPAWN_COL,
        direction: 'none',
        nextDirection: null,
        mouthAngle: 0,
        speed: GAME_CONSTANTS.PACMAN_SPEED,
      },
      ghosts,
      maze: CLASSIC_MAZE,
      dots,
      powerPellets,
      score: 0,
      highScore: getHighScore(),
      lives: GAME_CONSTANTS.INITIAL_LIVES,
      level: 1,
      gameStatus: 'ready',
      powerUpActive: false,
      powerUpTimer: 0,
      frightenedTimer: 0,
    };
  }, []);

  const [gameState, setGameState] = useState<PacManState>(() => initializeGame());

  // Move Pac-Man
  const movePacMan = useCallback(() => {
    setGameState(prev => {
      if (prev.gameStatus !== 'playing') return prev;

      const { pacman, dots, powerPellets, score, ghosts } = prev;
      const newPacman = { ...pacman };

      // Try to change direction if nextDirection is set
      if (newPacman.nextDirection) {
        const nextVector = DIRECTION_VECTORS[newPacman.nextDirection];
        const nextRow = newPacman.row + nextVector.dr;
        const nextCol = newPacman.col + nextVector.dc;

        if (isValidMove(prev.maze, nextRow, nextCol)) {
          newPacman.direction = newPacman.nextDirection;
          newPacman.nextDirection = null;
        }
      }

      // Move in current direction
      if (newPacman.direction !== 'none') {
        const vector = DIRECTION_VECTORS[newPacman.direction];
        const newRow = newPacman.row + vector.dr;
        const newCol = newPacman.col + vector.dc;

        if (isValidMove(prev.maze, newRow, newCol)) {
          newPacman.row = newRow;
          newPacman.col = newCol;

          // Wrap around edges
          if (newRow === 10 && newCol < 0) {
            newPacman.col = prev.maze[0].length - 1;
          } else if (newRow === 10 && newCol >= prev.maze[0].length) {
            newPacman.col = 0;
          }

          // Animate mouth
          newPacman.mouthAngle = (newPacman.mouthAngle + 15) % 60;
        }
      }

      // Check dot collection
      const posKey = `${newPacman.row},${newPacman.col}`;
      let newPowerUpActive = prev.powerUpActive;
      let newPowerUpTimer = prev.powerUpTimer;
      let newGhosts = [...ghosts];
      let newFrightenedTimer = prev.frightenedTimer;
      let ghostMultiplier = 1;

      if (dots.has(posKey)) {
        const newDots = new Set(dots);
        newDots.delete(posKey);
        dots = newDots;
        score += GAME_CONSTANTS.DOT_POINTS;
      }

      if (powerPellets.has(posKey)) {
        const newPowerPellets = new Set(powerPellets);
        newPowerPellets.delete(posKey);
        powerPellets = newPowerPellets;
        score += GAME_CONSTANTS.POWER_PELLET_POINTS;

        // Activate power-up
        newPowerUpActive = true;
        newPowerUpTimer = GAME_CONSTANTS.POWER_UP_DURATION;
        newFrightenedTimer = GAME_CONSTANTS.POWER_UP_DURATION;

        // Make ghosts frightened
        newGhosts = newGhosts.map(g => ({
          ...g,
          mode: (g.mode === 'eaten' ? 'eaten' : 'frightened') as GhostMode,
        }));
        ghostMultiplier = 1; // Reset multiplier
      }

      // Check all ghost collisions
      for (const ghost of newGhosts) {
        if (ghost.row === newPacman.row && ghost.col === newPacman.col) {
          if (ghost.mode === 'frightened') {
            // Eat ghost
            score += GAME_CONSTANTS.GHOST_BASE_POINTS * ghostMultiplier;
            ghostMultiplier *= 2;

            newGhosts = newGhosts.map(g =>
              g.id === ghost.id ? { ...g, mode: 'eaten', row: g.spawnRow, col: g.spawnCol } : g
            );
          } else if (ghost.mode !== 'eaten') {
            // Pac-Man caught by ghost
            const newLives = prev.lives - 1;
            if (newLives <= 0) {
              saveHighScore(score);
              return {
                ...prev,
                pacman: newPacman,
                score,
                lives: newLives,
                highScore: Math.max(prev.highScore, score),
                gameStatus: 'gameOver',
              };
            }

            // Reset positions
            return {
              ...prev,
              pacman: {
                row: GAME_CONSTANTS.PACMAN_SPAWN_ROW,
                col: GAME_CONSTANTS.PACMAN_SPAWN_COL,
                direction: 'none',
                nextDirection: null,
                mouthAngle: 0,
                speed: GAME_CONSTANTS.PACMAN_SPEED,
              },
              ghosts: newGhosts.map(g => ({
                ...g,
                row: g.spawnRow,
                col: g.spawnCol,
                mode: 'chase',
              })),
              score,
              lives: newLives,
              powerUpActive: false,
              powerUpTimer: 0,
              frightenedTimer: 0,
              gameStatus: 'ready',
            };
          }
        }
      }

      // Check level complete
      if (dots.size === 0 && powerPellets.size === 0) {
        return {
          ...prev,
          pacman: newPacman,
          dots,
          powerPellets,
          score,
          ghosts: newGhosts,
          powerUpActive: newPowerUpActive,
          powerUpTimer: newPowerUpTimer,
          frightenedTimer: newFrightenedTimer,
          gameStatus: 'levelComplete',
        };
      }

      return {
        ...prev,
        pacman: newPacman,
        dots,
        powerPellets,
        score,
        ghosts: newGhosts,
        powerUpActive: newPowerUpActive,
        powerUpTimer: newPowerUpTimer,
        frightenedTimer: newFrightenedTimer,
      };
    });
  }, [saveHighScore]);

  // Move ghosts
  const moveGhosts = useCallback(() => {
    setGameState(prev => {
      if (prev.gameStatus !== 'playing') return prev;

      const newGhosts = prev.ghosts.map(ghost => {
        const newDirection = getNextGhostDirection(ghost, prev.pacman, prev.maze, prev.ghosts);
        const vector = DIRECTION_VECTORS[newDirection];
        const newRow = ghost.row + vector.dr;
        const newCol = ghost.col + vector.dc;

        if (isValidMove(prev.maze, newRow, newCol)) {
          return {
            ...ghost,
            row: newRow,
            col: newCol,
            direction: newDirection,
          };
        }

        return ghost;
      });

      return { ...prev, ghosts: newGhosts };
    });
  }, []);

  // Update power-up timer
  const updatePowerUpTimer = useCallback(() => {
    setGameState(prev => {
      if (!prev.powerUpActive || prev.gameStatus !== 'playing') return prev;

      const newTimer = Math.max(0, prev.powerUpTimer - 100);
      const newFrightenedTimer = Math.max(0, prev.frightenedTimer - 100);

      if (newTimer === 0) {
        // Power-up expired
        return {
          ...prev,
          powerUpActive: false,
          powerUpTimer: 0,
          frightenedTimer: 0,
          ghosts: prev.ghosts.map(g => ({
            ...g,
            mode: (g.mode === 'frightened' ? 'chase' : g.mode) as GhostMode,
          })),
        };
      }

      return {
        ...prev,
        powerUpTimer: newTimer,
        frightenedTimer: newFrightenedTimer,
      };
    });
  }, []);

  // Game loop effects
  useEffect(() => {
    if (gameState.gameStatus === 'playing') {
      pacmanIntervalRef.current = setInterval(movePacMan, GAME_CONSTANTS.PACMAN_SPEED);
      ghostIntervalRef.current = setInterval(
        moveGhosts,
        gameState.powerUpActive ? GAME_CONSTANTS.FRIGHTENED_SPEED : GAME_CONSTANTS.GHOST_SPEED
      );
      powerUpIntervalRef.current = setInterval(updatePowerUpTimer, 100);
    }

    return () => {
      if (pacmanIntervalRef.current) clearInterval(pacmanIntervalRef.current);
      if (ghostIntervalRef.current) clearInterval(ghostIntervalRef.current);
      if (powerUpIntervalRef.current) clearInterval(powerUpIntervalRef.current);
    };
  }, [gameState.gameStatus, gameState.powerUpActive, movePacMan, moveGhosts, updatePowerUpTimer]);

  // Controls
  const startGame = useCallback(() => {
    setGameState(prev => ({ ...prev, gameStatus: 'playing' }));
  }, []);

  const setDirection = useCallback((direction: Direction) => {
    setGameState(prev => ({
      ...prev,
      pacman: {
        ...prev.pacman,
        nextDirection: direction,
      },
      gameStatus: prev.gameStatus === 'ready' ? 'playing' : prev.gameStatus,
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
  }, [initializeGame]);

  const nextLevel = useCallback(() => {
    setGameState(prev => {
      const { dots, powerPellets } = initializeMaze();
      return {
        ...prev,
        pacman: {
          row: GAME_CONSTANTS.PACMAN_SPAWN_ROW,
          col: GAME_CONSTANTS.PACMAN_SPAWN_COL,
          direction: 'none',
          nextDirection: null,
          mouthAngle: 0,
          speed: GAME_CONSTANTS.PACMAN_SPEED,
        },
        ghosts: prev.ghosts.map(g => ({
          ...g,
          row: g.spawnRow,
          col: g.spawnCol,
          mode: 'chase',
        })),
        dots,
        powerPellets,
        level: prev.level + 1,
        powerUpActive: false,
        powerUpTimer: 0,
        frightenedTimer: 0,
        gameStatus: 'ready',
      };
    });
  }, []);

  const controls: GameControls = {
    startGame,
    setDirection,
    pauseGame,
    resetGame,
    nextLevel,
  };

  return [gameState, controls];
};
