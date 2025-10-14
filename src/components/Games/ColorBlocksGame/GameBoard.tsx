import { useState } from 'react';
import { GameConfig } from './types';
import { initializeGame } from './gameUtils';

export default function GameBoard({ config }: { config: GameConfig }) {
  const [gameState] = useState(() => initializeGame(config));

  return (
    <div className="grid gap-1 p-4 bg-gray-100 rounded-lg">
      {gameState.grid.map((row: string[], y: number) => (
        <div key={y} className="flex gap-1">
          {row.map((color: string, x: number) => (
            <div 
              key={`${x}-${y}`}
              className="w-8 h-8 rounded shadow-md"
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
      ))}
    </div>
  );
}
