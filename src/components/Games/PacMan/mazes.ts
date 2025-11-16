import { MazeTile } from './types';

const W = MazeTile.WALL;
const E = MazeTile.EMPTY;
const D = MazeTile.DOT;
const P = MazeTile.POWER_PELLET;
const G = MazeTile.GHOST_SPAWN;
const M = MazeTile.PACMAN_SPAWN;

// Simplified mobile-friendly Pac-Man maze (19 cols x 21 rows)
export const CLASSIC_MAZE: number[][] = [
  [W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W],
  [W, D, D, D, D, D, D, D, D, W, D, D, D, D, D, D, D, D, W],
  [W, D, W, W, D, W, W, W, D, W, D, W, W, W, D, W, W, D, W],
  [W, P, W, W, D, W, W, W, D, W, D, W, W, W, D, W, W, P, W],
  [W, D, D, D, D, D, D, D, D, D, D, D, D, D, D, D, D, D, W],
  [W, D, W, W, D, W, D, W, W, W, W, W, D, W, D, W, W, D, W],
  [W, D, D, D, D, W, D, D, D, W, D, D, D, W, D, D, D, D, W],
  [W, W, W, W, D, W, W, W, E, W, E, W, W, W, D, W, W, W, W],
  [W, W, W, W, D, W, E, E, E, E, E, E, E, W, D, W, W, W, W],
  [W, W, W, W, D, W, E, W, G, G, G, W, E, W, D, W, W, W, W],
  [E, E, E, E, D, E, E, W, G, G, G, W, E, E, D, E, E, E, E],
  [W, W, W, W, D, W, E, W, W, W, W, W, E, W, D, W, W, W, W],
  [W, W, W, W, D, W, E, E, E, E, E, E, E, W, D, W, W, W, W],
  [W, W, W, W, D, W, D, W, W, W, W, W, D, W, D, W, W, W, W],
  [W, D, D, D, D, D, D, D, D, W, D, D, D, D, D, D, D, D, W],
  [W, D, W, W, D, W, W, W, D, W, D, W, W, W, D, W, W, D, W],
  [W, P, D, W, D, D, D, D, D, M, D, D, D, D, D, W, D, P, W],
  [W, W, D, W, D, W, D, W, W, W, W, W, D, W, D, W, D, W, W],
  [W, D, D, D, D, W, D, D, D, W, D, D, D, W, D, D, D, D, W],
  [W, D, W, W, W, W, W, W, D, W, D, W, W, W, W, W, W, D, W],
  [W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W],
];

export function initializeMaze(): { dots: Set<string>; powerPellets: Set<string> } {
  const dots = new Set<string>();
  const powerPellets = new Set<string>();

  for (let row = 0; row < CLASSIC_MAZE.length; row++) {
    for (let col = 0; col < CLASSIC_MAZE[row].length; col++) {
      const cell = CLASSIC_MAZE[row][col];
      if (cell === MazeTile.DOT) {
        dots.add(`${row},${col}`);
      } else if (cell === MazeTile.POWER_PELLET) {
        powerPellets.add(`${row},${col}`);
      }
    }
  }

  return { dots, powerPellets };
}

export function isWall(maze: number[][], row: number, col: number): boolean {
  if (row < 0 || row >= maze.length || col < 0 || col >= maze[0].length) {
    return true;
  }
  return maze[row][col] === MazeTile.WALL;
}

export function isValidMove(maze: number[][], row: number, col: number): boolean {
  return !isWall(maze, row, col);
}
