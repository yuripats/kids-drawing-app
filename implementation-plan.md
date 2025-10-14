# Kids Drawing App - Game Implementation Plan

## Color Blocks Game - Phase 1: Core Scaffolding

### File Structure
```ts
src/components/Games/
├── ColorBlocksGame/
│   ├── GameBoard.tsx
│   ├── GameProvider.tsx
│   ├── types.ts
│   └── test/
│       └── GameBoard.test.tsx
```

### Implementation Details

1. **Game Types** (src/components/Games/ColorBlocksGame/types.ts):
```ts
type BlockColor = `#${string}`;
type Position = [number, number];

interface GameState {
  grid: BlockColor[][];
  score: number;
  colorCount: number;
  gridSize: [number, number];
}

interface GameConfig {
  initialColors?: number;
  gridWidth?: number; 
  gridHeight?: number;
}
```

2. **Game Board Component** (src/components/Games/ColorBlocksGame/GameBoard.tsx):
```tsx
const GameBoard = ({ config }: { config: GameConfig }) => {
  const [gameState, setGameState] = useState<GameState>(() => 
    initializeGame(config)
  );

  return (
    <div className="game-grid">
      {gameState.grid.map((row, y) => (
        <div key={y} className="grid-row">
          {row.map((color, x) => (
            <div 
              key={`${x}-${y}`}
              className="block"
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
      ))}
    </div>
  );
};
```

3. **Initialization Logic**:
```ts
const initializeGame = (config: GameConfig): GameState => {
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
```

### Verification Plan

1. **Manual Testing**:
```bash
npm run test:games
```

2. **Automated Tests** (GameBoard.test.tsx):
```tsx
describe('Game Initialization', () => {
  test('Creates 6x7 grid with 3 colors', () => {
    const game = initializeGame({});
    expect(game.grid.length).toBe(7);
    expect(game.grid[0].length).toBe(6);
    expect(new Set(game.grid.flat()).size).toBe(3);
  });

  test('Custom grid size initialization', () => {
    const game = initializeGame({ gridWidth: 8, gridHeight: 10 });
    expect(game.grid.length).toBe(10);
    expect(game.grid[0].length).toBe(8);
  });
});
```

3. **Visual Inspection**:
- Confirm grid renders properly on desktop/mobile
- Verify color distribution appears random
- Check responsive layout behavior

---

## Phase 2: Movement System (Next)
```ts
// Planned movement logic interface
interface MovementHandler {
  moveLeft: () => void;
  moveRight: () => void;
  moveUp: () => void;
  moveDown: () => void;
}
