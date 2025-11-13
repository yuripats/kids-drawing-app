import { Ghost, PacMan, Direction, GhostMode, Position } from './types';
import { DIRECTION_VECTORS, OPPOSITE_DIRECTION } from './constants';
import { isValidMove } from './mazes';

export function getNextGhostDirection(
  ghost: Ghost,
  pacman: PacMan,
  maze: number[][],
  ghosts: Ghost[]
): Direction {
  // If eaten, return to spawn
  if (ghost.mode === 'eaten') {
    return getDirectionToTarget(ghost, { row: ghost.spawnRow, col: ghost.spawnCol }, maze);
  }

  // If frightened, move randomly (run away)
  if (ghost.mode === 'frightened') {
    return getRandomValidDirection(ghost, maze);
  }

  // Get target based on ghost personality
  const target = getGhostTarget(ghost, pacman, ghosts, maze);

  // Move toward target
  return getDirectionToTarget(ghost, target, maze);
}

function getGhostTarget(
  ghost: Ghost,
  pacman: PacMan,
  ghosts: Ghost[],
  maze: number[][]
): Position {
  switch (ghost.personality) {
    case 'aggressive': // Blinky - chase Pac-Man directly
      return { row: pacman.row, col: pacman.col };

    case 'ambush': // Pinky - target 4 tiles ahead of Pac-Man
      const vector = DIRECTION_VECTORS[pacman.direction];
      return {
        row: Math.max(0, Math.min(maze.length - 1, pacman.row + vector.dr * 4)),
        col: Math.max(0, Math.min(maze[0].length - 1, pacman.col + vector.dc * 4)),
      };

    case 'flanker': // Inky - complex targeting using Blinky's position
      const blinky = ghosts.find(g => g.name === 'blinky');
      if (!blinky) return { row: pacman.row, col: pacman.col };

      const pacVector = DIRECTION_VECTORS[pacman.direction];
      const pivot = {
        row: pacman.row + pacVector.dr * 2,
        col: pacman.col + pacVector.dc * 2,
      };

      return {
        row: pivot.row + (pivot.row - blinky.row),
        col: pivot.col + (pivot.col - blinky.col),
      };

    case 'random': // Clyde - chase when far, scatter when close
      const distance = Math.abs(ghost.row - pacman.row) + Math.abs(ghost.col - pacman.col);
      if (distance > 8) {
        return { row: pacman.row, col: pacman.col };
      } else {
        // Scatter to corner
        return { row: maze.length - 2, col: 0 };
      }

    default:
      return { row: pacman.row, col: pacman.col };
  }
}

function getDirectionToTarget(ghost: Ghost, target: Position, maze: number[][]): Direction {
  const possibleDirections: Direction[] = ['up', 'down', 'left', 'right'];
  const currentOpposite = OPPOSITE_DIRECTION[ghost.direction] as Direction;

  // Remove opposite direction (ghosts can't reverse)
  const validDirections = possibleDirections.filter(dir => {
    if (dir === currentOpposite && ghost.direction !== 'none') return false;

    const vector = DIRECTION_VECTORS[dir];
    const newRow = ghost.row + vector.dr;
    const newCol = ghost.col + vector.dc;

    return isValidMove(maze, newRow, newCol);
  });

  if (validDirections.length === 0) {
    return ghost.direction; // Stuck, keep current direction
  }

  // Choose direction that minimizes distance to target
  let bestDirection = validDirections[0];
  let minDistance = Infinity;

  for (const dir of validDirections) {
    const vector = DIRECTION_VECTORS[dir];
    const newRow = ghost.row + vector.dr;
    const newCol = ghost.col + vector.dc;

    const distance = Math.abs(newRow - target.row) + Math.abs(newCol - target.col);

    if (distance < minDistance) {
      minDistance = distance;
      bestDirection = dir;
    }
  }

  return bestDirection;
}

function getRandomValidDirection(ghost: Ghost, maze: number[][]): Direction {
  const possibleDirections: Direction[] = ['up', 'down', 'left', 'right'];
  const currentOpposite = OPPOSITE_DIRECTION[ghost.direction] as Direction;

  const validDirections = possibleDirections.filter(dir => {
    if (dir === currentOpposite && ghost.direction !== 'none') return false;

    const vector = DIRECTION_VECTORS[dir];
    const newRow = ghost.row + vector.dr;
    const newCol = ghost.col + vector.dc;

    return isValidMove(maze, newRow, newCol);
  });

  if (validDirections.length === 0) {
    return ghost.direction;
  }

  return validDirections[Math.floor(Math.random() * validDirections.length)];
}
