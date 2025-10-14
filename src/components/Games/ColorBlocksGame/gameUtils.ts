import { GameState, GameConfig } from './types';

const generateColorPalette = (count: number): string[] => {
  const colors = [];
  for (let i = 0; i < count; i++) {
    colors.push(`hsl(${(i * 360) / count}, 70%, 60%)`);
  }
  return colors;
};

const createGrid = (width: number, height: number, colors: string[]): string[][] => {
  return Array.from({ length: height }, () => 
    Array.from({ length: width }, () => 
      colors[Math.floor(Math.random() * colors.length)]
    )
  );
};

export const initializeGame = (config: GameConfig): GameState => {
  const colors = generateColorPalette(config.initialColors || 3);
  return {
    grid: createGrid(
      config.gridWidth || 6,
      config.gridHeight || 7,
      colors
    ),
    score: 0,
    colorCount: colors.length,
    gridSize: [config.gridWidth || 6, config.gridHeight || 7]
  };
};