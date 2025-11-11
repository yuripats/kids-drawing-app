import { GameState, GameConfig, Position } from './types';

const STORAGE_KEY = 'colorBlocksHighScore';

// Kid-friendly bright colors
export const generateColorPalette = (count: number): string[] => {
  const colors = [
    '#FF6B6B', // Red
    '#4ECDC4', // Teal
    '#FFE66D', // Yellow
    '#95E1D3', // Mint
    '#F38181', // Pink
    '#AA96DA', // Purple
    '#FCBAD3', // Light Pink
    '#A8E6CF', // Light Green
  ];
  return colors.slice(0, count);
};

const createGrid = (width: number, height: number, colors: string[]): string[][] => {
  return Array.from({ length: height }, () =>
    Array.from({ length: width }, () =>
      colors[Math.floor(Math.random() * colors.length)]
    )
  );
};

const loadHighScore = (): number => {
  const saved = localStorage.getItem(STORAGE_KEY);
  return saved ? parseInt(saved, 10) : 0;
};

export const saveHighScore = (score: number): void => {
  const currentHigh = loadHighScore();
  if (score > currentHigh) {
    localStorage.setItem(STORAGE_KEY, score.toString());
  }
};

export const initializeGame = (config: GameConfig): GameState => {
  const colors = generateColorPalette(config.initialColors || 4);
  return {
    grid: createGrid(
      config.gridWidth || 8,
      config.gridHeight || 10,
      colors
    ),
    score: 0,
    highScore: loadHighScore(),
    colorCount: colors.length,
    colorPalette: colors,
    gridSize: [config.gridWidth || 8, config.gridHeight || 10],
    gameStatus: 'ready',
    moves: 0,
    selectedBlocks: [],
    message: 'Click on blocks to remove them!'
  };
};

// Flood fill algorithm to find connected blocks of same color
export const findConnectedBlocks = (
  grid: string[][],
  x: number,
  y: number
): Position[] => {
  const width = grid[0]?.length || 0;
  const height = grid.length;

  if (x < 0 || x >= width || y < 0 || y >= height || grid[y][x] === '') {
    return [];
  }

  const targetColor = grid[y][x];
  const visited = new Set<string>();
  const connected: Position[] = [];

  const flood = (cx: number, cy: number) => {
    const key = `${cx},${cy}`;
    if (visited.has(key)) return;

    if (cx < 0 || cx >= width || cy < 0 || cy >= height) return;
    if (grid[cy][cx] !== targetColor || grid[cy][cx] === '') return;

    visited.add(key);
    connected.push({ x: cx, y: cy });

    // Check all 4 directions
    flood(cx + 1, cy);
    flood(cx - 1, cy);
    flood(cx, cy + 1);
    flood(cx, cy - 1);
  };

  flood(x, y);
  return connected;
};

// Remove blocks and return new grid
export const removeBlocks = (grid: string[][], blocks: Position[]): string[][] => {
  const newGrid = grid.map(row => [...row]);

  // Mark blocks for removal
  blocks.forEach(({ x, y }) => {
    newGrid[y][x] = '';
  });

  return newGrid;
};

// Apply gravity - blocks fall down
export const applyGravity = (grid: string[][]): string[][] => {
  const width = grid[0]?.length || 0;
  const height = grid.length;
  const newGrid: string[][] = Array.from({ length: height }, () =>
    Array.from({ length: width }, () => '')
  );

  // For each column, stack non-empty blocks from bottom
  for (let x = 0; x < width; x++) {
    let writeY = height - 1;

    // Read from bottom to top
    for (let y = height - 1; y >= 0; y--) {
      if (grid[y][x] !== '') {
        newGrid[writeY][x] = grid[y][x];
        writeY--;
      }
    }
  }

  return newGrid;
};

// Remove empty columns and shift remaining columns left
export const removeEmptyColumns = (grid: string[][]): string[][] => {
  const height = grid.length;
  const width = grid[0]?.length || 0;

  const nonEmptyColumns: string[][] = [];

  // Find non-empty columns
  for (let x = 0; x < width; x++) {
    let hasBlocks = false;
    for (let y = 0; y < height; y++) {
      if (grid[y][x] !== '') {
        hasBlocks = true;
        break;
      }
    }

    if (hasBlocks) {
      const column: string[] = [];
      for (let y = 0; y < height; y++) {
        column.push(grid[y][x]);
      }
      nonEmptyColumns.push(column);
    }
  }

  // Reconstruct grid
  const newGrid: string[][] = Array.from({ length: height }, () =>
    Array.from({ length: width }, () => '')
  );

  for (let x = 0; x < nonEmptyColumns.length; x++) {
    for (let y = 0; y < height; y++) {
      newGrid[y][x] = nonEmptyColumns[x][y];
    }
  }

  return newGrid;
};

// Check if grid is empty (player won)
export const isGridEmpty = (grid: string[][]): boolean => {
  return grid.every(row => row.every(cell => cell === ''));
};

// Check if there are any valid moves left
export const hasValidMoves = (grid: string[][]): boolean => {
  const width = grid[0]?.length || 0;
  const height = grid.length;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (grid[y][x] !== '') {
        const connected = findConnectedBlocks(grid, x, y);
        if (connected.length >= 2) {
          return true;
        }
      }
    }
  }

  return false;
};

// Calculate score for removing blocks
export const calculateScore = (blocksRemoved: number): number => {
  // Score formula: (blocks)² × 10
  // Encourages removing larger groups
  return blocksRemoved * blocksRemoved * 10;
};

// Fill empty spaces with new random blocks for endless mode
export const fillEmptySpaces = (grid: string[][], colorPalette: string[]): string[][] => {
  const width = grid[0]?.length || 0;
  const height = grid.length;
  const newGrid = grid.map(row => [...row]);

  // For each column, fill empty cells from top
  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
      if (newGrid[y][x] === '') {
        // Add random color from palette
        newGrid[y][x] = colorPalette[Math.floor(Math.random() * colorPalette.length)];
      }
    }
  }

  return newGrid;
};