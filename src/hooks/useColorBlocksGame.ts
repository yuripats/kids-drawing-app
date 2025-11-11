import { useState, useCallback } from 'react';
import {
  GameState,
  GameConfig,
  ColorBlocksControls
} from '../components/Games/ColorBlocksGame/types';
import {
  initializeGame,
  findConnectedBlocks,
  removeBlocks,
  applyGravity,
  removeEmptyColumns,
  fillEmptySpaces,
  calculateScore,
  saveHighScore
} from '../components/Games/ColorBlocksGame/gameUtils';

export const useColorBlocksGame = (config: GameConfig = {}) => {
  const [gameState, setGameState] = useState<GameState>(() => initializeGame(config));

  const handleBlockHover = useCallback((x: number, y: number) => {
    setGameState(prev => {
      const connected = findConnectedBlocks(prev.grid, x, y);

      if (connected.length < 2) {
        return {
          ...prev,
          selectedBlocks: [],
          message: 'Need at least 2 connected blocks!'
        };
      }

      return {
        ...prev,
        selectedBlocks: connected,
        message: `Click to remove ${connected.length} blocks! (+${calculateScore(connected.length)} points)`
      };
    });
  }, []);

  const handleBlockClick = useCallback((x: number, y: number) => {
    setGameState(prev => {
      const connected = findConnectedBlocks(prev.grid, x, y);

      // Need at least 2 connected blocks
      if (connected.length < 2) {
        return {
          ...prev,
          selectedBlocks: [],
          message: 'Need at least 2 connected blocks!'
        };
      }

      // Remove blocks
      let newGrid = removeBlocks(prev.grid, connected);

      // Apply gravity
      newGrid = applyGravity(newGrid);

      // Remove empty columns
      newGrid = removeEmptyColumns(newGrid);

      // Fill empty spaces with new blocks (endless mode)
      newGrid = fillEmptySpaces(newGrid, prev.colorPalette);

      // Calculate new score
      const pointsEarned = calculateScore(connected.length);
      const newScore = prev.score + pointsEarned;
      const newMoves = prev.moves + 1;

      // Update high score
      saveHighScore(newScore);

      // Game continues endlessly
      return {
        ...prev,
        grid: newGrid,
        score: newScore,
        highScore: Math.max(prev.highScore, newScore),
        moves: newMoves,
        gameStatus: 'playing',
        selectedBlocks: [],
        message: `Awesome! +${pointsEarned} points!`
      };
    });
  }, []);

  const clearSelection = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      selectedBlocks: [],
      message: prev.gameStatus === 'ready' ? 'Click on blocks to remove them!' : prev.message
    }));
  }, []);

  const resetGame = useCallback(() => {
    setGameState(initializeGame(config));
  }, [config]);

  const controls: ColorBlocksControls = {
    handleBlockClick,
    handleBlockHover,
    resetGame,
    clearSelection
  };

  return {
    gameState,
    config,
    controls
  };
};
