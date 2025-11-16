# Active Arcade Games - Implementation Plan

## Executive Summary

This document provides a detailed, step-by-step implementation plan for adding 3 iconic active arcade games to the Kids Drawing App:

1. **Breakout/Arkanoid** - Paddle + ball brick-breaking game
2. **Pac-Man** - Maze navigation with ghost AI
3. **Flappy Bird** - One-button endless flying game

**Target Timeline:** 2-3 weeks (11-14 days)
**Current Games:** 13
**Games After Completion:** 16

These games were specifically chosen to match your preference for active, reflex-based gameplay similar to Tetris, Snake, and Color Blocks.

---

## 🎯 Implementation Priorities

### Order of Implementation

**Recommended Order:**
1. **Flappy Bird** (Days 1-3) - Simplest, builds momentum
2. **Breakout** (Days 4-8) - Medium complexity, reuses physics patterns
3. **Pac-Man** (Days 9-14) - Most complex, benefits from experience with first two

**Why This Order?**
- Start easy to gain confidence and establish patterns
- Breakout benefits from canvas/physics experience
- Pac-Man's AI complexity is easier after completing two games
- Can ship Flappy Bird independently if needed

---

## Game 1: Flappy Bird 🐦

### Overview
**Timeline:** 2-3 days
**Complexity:** ⭐⭐☆☆☆ (Medium-Low)
**Priority:** Start here for quick win

### Day 1: Core Game Logic & Physics

#### Step 1: File Structure Setup (30 minutes)
```bash
mkdir -p src/components/Games/FlappyBird
mkdir -p src/hooks
touch src/components/Games/FlappyBird/FlappyBirdPage.tsx
touch src/components/Games/FlappyBird/GameCanvas.tsx
touch src/components/Games/FlappyBird/types.ts
touch src/components/Games/FlappyBird/constants.ts
touch src/hooks/useFlappyBird.ts
```

#### Step 2: Define Types (30 minutes)
**File:** `src/components/Games/FlappyBird/types.ts`
```typescript
export interface FlappyBirdState {
  bird: Bird;
  pipes: Pipe[];
  score: number;
  highScore: number;
  gameStatus: 'ready' | 'playing' | 'gameOver';
  distanceTraveled: number;
}

export interface Bird {
  y: number;              // Vertical position (px)
  velocity: number;       // Vertical velocity (px/frame)
  rotation: number;       // Visual rotation in degrees
  radius: number;         // Collision radius
}

export interface Pipe {
  id: string;
  x: number;              // Horizontal position
  gapY: number;           // Center of gap
  gapSize: number;        // Height of gap
  width: number;
  passed: boolean;        // Has bird passed this pipe?
}

export interface GameControls {
  startGame: () => void;
  flap: () => void;
  resetGame: () => void;
  pauseGame: () => void;
}
```

#### Step 3: Define Constants (15 minutes)
**File:** `src/components/Games/FlappyBird/constants.ts`
```typescript
export const GAME_CONSTANTS = {
  // Canvas dimensions
  CANVAS_WIDTH: 400,
  CANVAS_HEIGHT: 600,

  // Physics
  GRAVITY: 0.5,              // Acceleration downward
  FLAP_STRENGTH: -9,         // Upward velocity on flap
  MAX_VELOCITY: 10,          // Terminal velocity

  // Bird
  BIRD_RADIUS: 15,
  BIRD_START_X: 100,
  BIRD_START_Y: 300,

  // Pipes
  PIPE_WIDTH: 60,
  PIPE_GAP: 150,             // Vertical gap size
  PIPE_SPACING: 250,         // Horizontal spacing between pipes
  PIPE_SPEED: 3,             // Horizontal scroll speed

  // Game
  SPAWN_DISTANCE: 400,       // Start spawning pipes at this x
  MIN_GAP_Y: 150,            // Minimum gap center Y
  MAX_GAP_Y: 450,            // Maximum gap center Y
};

export const COLORS = {
  background: '#87CEEB',     // Sky blue
  bird: '#FFD700',           // Gold
  pipe: '#2ecc71',           // Green
  ground: '#8B4513',         // Brown
  text: '#2c3e50',           // Dark gray
};
```

#### Step 4: Core Game Hook (2-3 hours)
**File:** `src/hooks/useFlappyBird.ts`
```typescript
import { useState, useEffect, useCallback, useRef } from 'react';
import { FlappyBirdState, GameControls, Pipe } from '../components/Games/FlappyBird/types';
import { GAME_CONSTANTS } from '../components/Games/FlappyBird/constants';

export const useFlappyBird = (): [FlappyBirdState, GameControls] => {
  const [gameState, setGameState] = useState<FlappyBirdState>({
    bird: {
      y: GAME_CONSTANTS.BIRD_START_Y,
      velocity: 0,
      rotation: 0,
      radius: GAME_CONSTANTS.BIRD_RADIUS,
    },
    pipes: [],
    score: 0,
    highScore: getHighScore(),
    gameStatus: 'ready',
    distanceTraveled: 0,
  });

  const animationFrameRef = useRef<number>();
  const lastPipeXRef = useRef<number>(GAME_CONSTANTS.SPAWN_DISTANCE);

  // Load high score from localStorage
  function getHighScore(): number {
    return parseInt(localStorage.getItem('highScore_flappyBird') || '0', 10);
  }

  // Save high score to localStorage
  function saveHighScore(score: number) {
    const current = getHighScore();
    if (score > current) {
      localStorage.setItem('highScore_flappyBird', score.toString());
    }
  }

  // Generate new pipe
  const generatePipe = useCallback((x: number): Pipe => {
    const gapY = Math.random() *
      (GAME_CONSTANTS.MAX_GAP_Y - GAME_CONSTANTS.MIN_GAP_Y) +
      GAME_CONSTANTS.MIN_GAP_Y;

    return {
      id: `pipe-${Date.now()}-${Math.random()}`,
      x,
      gapY,
      gapSize: GAME_CONSTANTS.PIPE_GAP,
      width: GAME_CONSTANTS.PIPE_WIDTH,
      passed: false,
    };
  }, []);

  // Check collision
  const checkCollision = useCallback((bird: FlappyBirdState['bird'], pipes: Pipe[]): boolean => {
    // Ground collision
    if (bird.y + bird.radius >= GAME_CONSTANTS.CANVAS_HEIGHT - 50) {
      return true;
    }

    // Ceiling collision
    if (bird.y - bird.radius <= 0) {
      return true;
    }

    // Pipe collision
    for (const pipe of pipes) {
      // Check if bird is in pipe's horizontal range
      if (
        bird.y - bird.radius < pipe.gapY - pipe.gapSize / 2 ||
        bird.y + bird.radius > pipe.gapY + pipe.gapSize / 2
      ) {
        // Bird is outside gap - check horizontal overlap
        const birdX = GAME_CONSTANTS.BIRD_START_X;
        if (
          birdX + bird.radius > pipe.x &&
          birdX - bird.radius < pipe.x + pipe.width
        ) {
          return true; // Collision!
        }
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

      // Update bird physics
      let newVelocity = prev.bird.velocity + GAME_CONSTANTS.GRAVITY;
      if (newVelocity > GAME_CONSTANTS.MAX_VELOCITY) {
        newVelocity = GAME_CONSTANTS.MAX_VELOCITY;
      }

      const newY = prev.bird.y + newVelocity;
      const newRotation = Math.min(Math.max(newVelocity * 3, -30), 90);

      const newBird = {
        ...prev.bird,
        y: newY,
        velocity: newVelocity,
        rotation: newRotation,
      };

      // Update pipes
      let newPipes = prev.pipes
        .map((pipe) => ({
          ...pipe,
          x: pipe.x - GAME_CONSTANTS.PIPE_SPEED,
        }))
        .filter((pipe) => pipe.x > -pipe.width); // Remove off-screen pipes

      // Check if bird passed any pipes (for scoring)
      let newScore = prev.score;
      newPipes = newPipes.map((pipe) => {
        if (!pipe.passed && pipe.x + pipe.width < GAME_CONSTANTS.BIRD_START_X) {
          newScore++;
          return { ...pipe, passed: true };
        }
        return pipe;
      });

      // Spawn new pipes
      const lastPipeX = newPipes.length > 0
        ? Math.max(...newPipes.map(p => p.x))
        : lastPipeXRef.current;

      if (lastPipeX < GAME_CONSTANTS.CANVAS_WIDTH) {
        const newPipe = generatePipe(lastPipeX + GAME_CONSTANTS.PIPE_SPACING);
        newPipes.push(newPipe);
        lastPipeXRef.current = newPipe.x;
      }

      // Check collision
      if (checkCollision(newBird, newPipes)) {
        saveHighScore(newScore);
        return {
          ...prev,
          bird: newBird,
          pipes: newPipes,
          score: newScore,
          highScore: Math.max(prev.highScore, newScore),
          gameStatus: 'gameOver',
        };
      }

      return {
        ...prev,
        bird: newBird,
        pipes: newPipes,
        score: newScore,
        distanceTraveled: prev.distanceTraveled + GAME_CONSTANTS.PIPE_SPEED,
      };
    });

    animationFrameRef.current = requestAnimationFrame(gameLoop);
  }, [generatePipe, checkCollision]);

  // Start game
  const startGame = useCallback(() => {
    setGameState((prev) => ({
      ...prev,
      gameStatus: 'playing',
    }));
  }, []);

  // Flap
  const flap = useCallback(() => {
    if (gameState.gameStatus === 'ready') {
      startGame();
    }

    if (gameState.gameStatus === 'playing') {
      setGameState((prev) => ({
        ...prev,
        bird: {
          ...prev.bird,
          velocity: GAME_CONSTANTS.FLAP_STRENGTH,
        },
      }));
    }
  }, [gameState.gameStatus, startGame]);

  // Reset game
  const resetGame = useCallback(() => {
    lastPipeXRef.current = GAME_CONSTANTS.SPAWN_DISTANCE;
    setGameState({
      bird: {
        y: GAME_CONSTANTS.BIRD_START_Y,
        velocity: 0,
        rotation: 0,
        radius: GAME_CONSTANTS.BIRD_RADIUS,
      },
      pipes: [],
      score: 0,
      highScore: getHighScore(),
      gameStatus: 'ready',
      distanceTraveled: 0,
    });
  }, []);

  // Pause game
  const pauseGame = useCallback(() => {
    setGameState((prev) => ({
      ...prev,
      gameStatus: 'ready',
    }));
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

  // Effect: Keyboard controls
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.code === 'ArrowUp') {
        e.preventDefault();
        flap();
      }
      if (e.code === 'KeyR' && gameState.gameStatus === 'gameOver') {
        resetGame();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [flap, resetGame, gameState.gameStatus]);

  const controls: GameControls = {
    startGame,
    flap,
    resetGame,
    pauseGame,
  };

  return [gameState, controls];
};
```

### Day 2: Canvas Rendering

#### Step 5: Game Canvas Component (2-3 hours)
**File:** `src/components/Games/FlappyBird/GameCanvas.tsx`
```typescript
import React, { useRef, useEffect } from 'react';
import { FlappyBirdState } from './types';
import { GAME_CONSTANTS, COLORS } from './constants';

interface GameCanvasProps {
  gameState: FlappyBirdState;
  onFlap: () => void;
}

export const GameCanvas: React.FC<GameCanvasProps> = ({ gameState, onFlap }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Render game
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.fillStyle = COLORS.background;
    ctx.fillRect(0, 0, GAME_CONSTANTS.CANVAS_WIDTH, GAME_CONSTANTS.CANVAS_HEIGHT);

    // Draw pipes
    ctx.fillStyle = COLORS.pipe;
    gameState.pipes.forEach((pipe) => {
      const topHeight = pipe.gapY - pipe.gapSize / 2;
      const bottomY = pipe.gapY + pipe.gapSize / 2;
      const bottomHeight = GAME_CONSTANTS.CANVAS_HEIGHT - 50 - bottomY;

      // Top pipe
      ctx.fillRect(pipe.x, 0, pipe.width, topHeight);

      // Bottom pipe
      ctx.fillRect(pipe.x, bottomY, pipe.width, bottomHeight);

      // Pipe caps
      ctx.fillStyle = '#27ae60';
      ctx.fillRect(pipe.x - 5, topHeight - 20, pipe.width + 10, 20);
      ctx.fillRect(pipe.x - 5, bottomY, pipe.width + 10, 20);
      ctx.fillStyle = COLORS.pipe;
    });

    // Draw ground
    ctx.fillStyle = COLORS.ground;
    ctx.fillRect(0, GAME_CONSTANTS.CANVAS_HEIGHT - 50, GAME_CONSTANTS.CANVAS_WIDTH, 50);

    // Draw bird
    ctx.save();
    ctx.translate(GAME_CONSTANTS.BIRD_START_X, gameState.bird.y);
    ctx.rotate((gameState.bird.rotation * Math.PI) / 180);

    // Bird body
    ctx.fillStyle = COLORS.bird;
    ctx.beginPath();
    ctx.arc(0, 0, gameState.bird.radius, 0, Math.PI * 2);
    ctx.fill();

    // Bird eye
    ctx.fillStyle = 'white';
    ctx.beginPath();
    ctx.arc(5, -5, 4, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = 'black';
    ctx.beginPath();
    ctx.arc(6, -5, 2, 0, Math.PI * 2);
    ctx.fill();

    // Bird beak
    ctx.fillStyle = '#ff6347';
    ctx.beginPath();
    ctx.moveTo(gameState.bird.radius - 2, 0);
    ctx.lineTo(gameState.bird.radius + 8, -3);
    ctx.lineTo(gameState.bird.radius + 8, 3);
    ctx.closePath();
    ctx.fill();

    ctx.restore();

    // Draw score
    ctx.fillStyle = COLORS.text;
    ctx.font = 'bold 48px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(gameState.score.toString(), GAME_CONSTANTS.CANVAS_WIDTH / 2, 80);

    // Draw "ready" message
    if (gameState.gameStatus === 'ready') {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
      ctx.fillRect(0, 0, GAME_CONSTANTS.CANVAS_WIDTH, GAME_CONSTANTS.CANVAS_HEIGHT);

      ctx.fillStyle = 'white';
      ctx.font = 'bold 36px Arial';
      ctx.fillText('Tap or Space to Start', GAME_CONSTANTS.CANVAS_WIDTH / 2, GAME_CONSTANTS.CANVAS_HEIGHT / 2);

      ctx.font = '24px Arial';
      ctx.fillText('Tap to Flap!', GAME_CONSTANTS.CANVAS_WIDTH / 2, GAME_CONSTANTS.CANVAS_HEIGHT / 2 + 50);
    }

    // Draw game over screen
    if (gameState.gameStatus === 'gameOver') {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
      ctx.fillRect(0, 0, GAME_CONSTANTS.CANVAS_WIDTH, GAME_CONSTANTS.CANVAS_HEIGHT);

      ctx.fillStyle = 'white';
      ctx.font = 'bold 48px Arial';
      ctx.fillText('Game Over', GAME_CONSTANTS.CANVAS_WIDTH / 2, GAME_CONSTANTS.CANVAS_HEIGHT / 2 - 50);

      ctx.font = '24px Arial';
      ctx.fillText(`Score: ${gameState.score}`, GAME_CONSTANTS.CANVAS_WIDTH / 2, GAME_CONSTANTS.CANVAS_HEIGHT / 2 + 10);
      ctx.fillText(`Best: ${gameState.highScore}`, GAME_CONSTANTS.CANVAS_WIDTH / 2, GAME_CONSTANTS.CANVAS_HEIGHT / 2 + 50);

      ctx.font = '20px Arial';
      ctx.fillText('Tap or Press R to Restart', GAME_CONSTANTS.CANVAS_WIDTH / 2, GAME_CONSTANTS.CANVAS_HEIGHT / 2 + 100);
    }
  }, [gameState]);

  // Handle touch/click
  const handleCanvasClick = () => {
    if (gameState.gameStatus === 'gameOver') {
      // Handled by reset button
      return;
    }
    onFlap();
  };

  return (
    <canvas
      ref={canvasRef}
      width={GAME_CONSTANTS.CANVAS_WIDTH}
      height={GAME_CONSTANTS.CANVAS_HEIGHT}
      onClick={handleCanvasClick}
      className="border-4 border-gray-800 rounded-lg cursor-pointer touch-none"
      style={{
        maxWidth: '100%',
        height: 'auto',
        touchAction: 'none'
      }}
    />
  );
};
```

### Day 3: Page Component & Integration

#### Step 6: Page Component (1-2 hours)
**File:** `src/components/Games/FlappyBird/FlappyBirdPage.tsx`
```typescript
import React from 'react';
import { useFlappyBird } from '../../../hooks/useFlappyBird';
import { GameCanvas } from './GameCanvas';

interface FlappyBirdPageProps {
  onNavigateHome: () => void;
}

export const FlappyBirdPage: React.FC<FlappyBirdPageProps> = ({ onNavigateHome }) => {
  const [gameState, controls] = useFlappyBird();

  // Get medal based on score
  const getMedal = (score: number): string => {
    if (score >= 100) return '🏆 Platinum';
    if (score >= 50) return '🥇 Gold';
    if (score >= 25) return '🥈 Silver';
    if (score >= 10) return '🥉 Bronze';
    return '';
  };

  const medal = getMedal(gameState.score);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-400 to-blue-600 p-4">
      {/* Header */}
      <div className="max-w-4xl mx-auto mb-6">
        <div className="flex items-center justify-between">
          <button
            onClick={onNavigateHome}
            className="kid-button bg-white hover:bg-gray-100 text-gray-800"
          >
            ← Home
          </button>
          <h1 className="text-3xl font-bold text-white">
            🐦 Flappy Bird
          </h1>
          <div className="w-24"></div>
        </div>
      </div>

      {/* Game Area */}
      <div className="max-w-4xl mx-auto">
        <div className="kid-card bg-white p-6">
          <div className="flex flex-col items-center gap-6">
            {/* Canvas */}
            <GameCanvas gameState={gameState} onFlap={controls.flap} />

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 w-full max-w-md">
              <div className="kid-card bg-blue-100 p-4 text-center">
                <div className="text-2xl font-bold text-blue-800">{gameState.score}</div>
                <div className="text-sm text-blue-600">Score</div>
                {medal && <div className="text-lg mt-1">{medal}</div>}
              </div>
              <div className="kid-card bg-purple-100 p-4 text-center">
                <div className="text-2xl font-bold text-purple-800">{gameState.highScore}</div>
                <div className="text-sm text-purple-600">Best</div>
              </div>
            </div>

            {/* Controls */}
            <div className="flex gap-4">
              {gameState.gameStatus === 'gameOver' && (
                <button
                  onClick={controls.resetGame}
                  className="kid-button bg-green-500 hover:bg-green-600 text-white px-8 py-3 text-lg"
                >
                  🔄 Play Again
                </button>
              )}
              {gameState.gameStatus === 'playing' && (
                <button
                  onClick={controls.flap}
                  className="kid-button bg-yellow-500 hover:bg-yellow-600 text-white px-8 py-3 text-lg"
                >
                  👆 Flap!
                </button>
              )}
            </div>

            {/* Instructions */}
            <div className="kid-card bg-yellow-50 p-4 max-w-md">
              <h3 className="font-bold text-gray-800 mb-2">How to Play:</h3>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Tap the screen or press SPACE to flap</li>
                <li>• Navigate through the pipes</li>
                <li>• Don't hit pipes or the ground!</li>
                <li>• Score points by passing pipes</li>
                <li>• Beat your high score!</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlappyBirdPage;
```

#### Step 7: App Integration (30 minutes)
1. Add `flappyBird` to `AppPage` type in `App.tsx`
2. Add route case for Flappy Bird
3. Add navigation button to `HomePage.tsx`

**App.tsx changes:**
```typescript
type AppPage =
  | 'home'
  | 'drawing'
  | 'gallery'
  // ... existing games
  | 'flappyBird';  // Add this

// In render section:
case 'flappyBird':
  return <FlappyBirdPage onNavigateHome={() => setCurrentPage('home')} />;
```

**HomePage.tsx changes:**
```typescript
<button
  onClick={onNavigateToFlappyBird}
  className="kid-button bg-gradient-to-br from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700"
>
  <span className="text-4xl mb-2">🐦</span>
  <span className="text-xl font-bold">Flappy Bird</span>
</button>
```

#### Step 8: Testing & Polish (1-2 hours)
- Test on desktop (keyboard)
- Test on mobile (touch)
- Adjust difficulty (gap size, speed) based on feedback
- Add sound effects (optional)
- Test localStorage persistence

---

## Game 2: Breakout 🧱

### Overview
**Timeline:** 4-5 days
**Complexity:** ⭐⭐⭐☆☆ (Medium)
**Priority:** Implement second

### Day 4-5: Core Game Implementation

#### Step 1: File Structure Setup (30 minutes)
```bash
mkdir -p src/components/Games/Breakout
touch src/components/Games/Breakout/BreakoutPage.tsx
touch src/components/Games/Breakout/GameCanvas.tsx
touch src/components/Games/Breakout/types.ts
touch src/components/Games/Breakout/constants.ts
touch src/components/Games/Breakout/levels.ts
touch src/hooks/useBreakout.ts
```

#### Step 2: Define Types (45 minutes)
**File:** `src/components/Games/Breakout/types.ts`
```typescript
export interface BreakoutState {
  paddle: Paddle;
  ball: Ball;
  bricks: Brick[][];
  powerUps: PowerUp[];
  score: number;
  highScore: number;
  lives: number;
  level: number;
  gameStatus: 'ready' | 'playing' | 'paused' | 'gameOver' | 'levelComplete';
  combo: number;
}

export interface Paddle {
  x: number;
  y: number;
  width: number;
  height: number;
  speed: number;
  color: string;
}

export interface Ball {
  x: number;
  y: number;
  vx: number;           // Horizontal velocity
  vy: number;           // Vertical velocity
  radius: number;
  speed: number;
  stuck: boolean;       // Stuck to paddle at start
}

export interface Brick {
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  hits: number;         // Current hits taken
  maxHits: number;      // Hits needed to destroy
  type: BrickType;
  destroyed: boolean;
  points: number;
}

export type BrickType =
  | 'normal'            // 1 hit, 10 points
  | 'strong'            // 2 hits, 20 points
  | 'unbreakable'       // Cannot be destroyed
  | 'powerup';          // Contains power-up, 30 points

export interface PowerUp {
  id: string;
  x: number;
  y: number;
  type: PowerUpType;
  active: boolean;
  duration?: number;    // ms remaining
  width: number;
  height: number;
  vy: number;           // Fall speed
}

export type PowerUpType =
  | 'widerPaddle'       // Paddle width increases
  | 'multiball'         // Spawn 2 additional balls
  | 'laser'             // Paddle can shoot lasers
  | 'sticky'            // Ball sticks to paddle
  | 'slowBall';         // Ball slows down

export interface GameControls {
  startGame: () => void;
  launchBall: () => void;
  movePaddle: (x: number) => void;
  pauseGame: () => void;
  resetGame: () => void;
}

export interface BrickPattern {
  rows: number;
  cols: number;
  pattern: BrickType[][];
}
```

#### Step 3: Define Constants & Levels (1 hour)
**File:** `src/components/Games/Breakout/constants.ts`
```typescript
export const GAME_CONSTANTS = {
  // Canvas
  CANVAS_WIDTH: 600,
  CANVAS_HEIGHT: 700,

  // Paddle
  PADDLE_WIDTH: 100,
  PADDLE_HEIGHT: 15,
  PADDLE_Y: 650,
  PADDLE_SPEED: 10,
  PADDLE_COLOR: '#3498db',

  // Ball
  BALL_RADIUS: 8,
  BALL_SPEED: 5,
  BALL_COLOR: '#e74c3c',
  MAX_BALL_SPEED: 8,

  // Bricks
  BRICK_WIDTH: 60,
  BRICK_HEIGHT: 20,
  BRICK_PADDING: 5,
  BRICK_OFFSET_TOP: 80,
  BRICK_OFFSET_LEFT: 30,
  BRICK_ROWS: 6,
  BRICK_COLS: 9,

  // Game
  INITIAL_LIVES: 3,
  POWERUP_FALL_SPEED: 2,
  POWERUP_DURATION: 10000, // 10 seconds
};

export const BRICK_COLORS = {
  normal: '#e74c3c',      // Red
  strong: '#f39c12',      // Orange
  unbreakable: '#95a5a6', // Gray
  powerup: '#9b59b6',     // Purple
};

export const POINTS = {
  normal: 10,
  strong: 20,
  unbreakable: 0,
  powerup: 30,
  combo: 5,               // Bonus per combo hit
};
```

**File:** `src/components/Games/Breakout/levels.ts`
```typescript
import { BrickType, BrickPattern } from './types';

const N: BrickType = 'normal';
const S: BrickType = 'strong';
const U: BrickType = 'unbreakable';
const P: BrickType = 'powerup';

export const LEVELS: BrickPattern[] = [
  // Level 1: Simple rows
  {
    rows: 4,
    cols: 9,
    pattern: [
      [N, N, N, N, N, N, N, N, N],
      [N, N, N, N, P, N, N, N, N],
      [N, N, N, N, N, N, N, N, N],
      [N, N, N, N, N, N, N, N, N],
    ],
  },

  // Level 2: Alternating strong bricks
  {
    rows: 5,
    cols: 9,
    pattern: [
      [S, N, S, N, S, N, S, N, S],
      [N, S, N, S, P, S, N, S, N],
      [S, N, S, N, S, N, S, N, S],
      [N, N, N, N, N, N, N, N, N],
      [N, N, N, N, N, N, N, N, N],
    ],
  },

  // Level 3: Pyramid with unbreakable base
  {
    rows: 6,
    cols: 9,
    pattern: [
      [null, null, null, null, N, null, null, null, null],
      [null, null, null, N, P, N, null, null, null],
      [null, null, S, S, S, S, S, null, null],
      [null, N, N, N, N, N, N, N, null],
      [S, S, S, S, S, S, S, S, S],
      [U, U, U, U, U, U, U, U, U],
    ] as (BrickType | null)[][],
  },

  // Level 4: Smiley face
  {
    rows: 6,
    cols: 9,
    pattern: [
      [null, S, S, null, null, null, S, S, null],
      [null, S, S, null, null, null, S, S, null],
      [null, null, null, null, null, null, null, null, null],
      [N, null, null, null, P, null, null, null, N],
      [null, N, null, null, null, null, null, N, null],
      [null, null, N, N, N, N, N, null, null],
    ] as (BrickType | null)[][],
  },

  // Level 5: Advanced pattern
  {
    rows: 7,
    cols: 9,
    pattern: [
      [U, S, S, S, P, S, S, S, U],
      [S, N, N, N, N, N, N, N, S],
      [S, N, U, U, U, U, U, N, S],
      [S, N, U, null, null, null, U, N, S],
      [S, N, U, U, U, U, U, N, S],
      [S, N, N, N, N, N, N, N, S],
      [U, S, S, S, S, S, S, S, U],
    ] as (BrickType | null)[][],
  },
];
```

### Day 6-7: Game Logic Hook

#### Step 4: Core Game Hook (4-6 hours)
**File:** `src/hooks/useBreakout.ts`

This hook is extensive (300+ lines). Key functions:

```typescript
// Main sections:
1. State management (paddle, ball, bricks, powerups)
2. Physics engine:
   - Ball movement and velocity
   - Paddle collision with angle reflection
   - Brick collision detection
   - Wall bouncing
3. Brick management:
   - Generate bricks from level patterns
   - Handle brick hits
   - Track destroyed bricks
4. Power-up system:
   - Spawn power-ups from bricks
   - Power-up falling and collection
   - Apply power-up effects
   - Timer for active power-ups
5. Scoring and combo system
6. Level progression
7. Game loop with requestAnimationFrame
```

**Key collision detection algorithm:**
```typescript
// Paddle collision with angle-based reflection
const checkPaddleCollision = (ball: Ball, paddle: Paddle): Ball | null => {
  if (
    ball.y + ball.radius >= paddle.y &&
    ball.y - ball.radius <= paddle.y + paddle.height &&
    ball.x >= paddle.x &&
    ball.x <= paddle.x + paddle.width
  ) {
    // Calculate hit position on paddle (-1 to 1)
    const hitPos = (ball.x - (paddle.x + paddle.width / 2)) / (paddle.width / 2);

    // Angle reflection based on hit position
    const angle = hitPos * (Math.PI / 3); // Max 60 degrees
    const speed = Math.sqrt(ball.vx ** 2 + ball.vy ** 2);

    return {
      ...ball,
      vy: -Math.abs(speed * Math.cos(angle)),
      vx: speed * Math.sin(angle),
      y: paddle.y - ball.radius,
    };
  }
  return null;
};
```

### Day 8: Canvas Rendering & Page Component

#### Step 5: Game Canvas (3-4 hours)
Render:
- Animated background
- Bricks with hit indicators
- Paddle with gradient
- Ball with trail effect
- Power-ups falling with icons
- Score, lives, level display
- Particle effects for brick destruction

#### Step 6: Page Component & Integration (2 hours)
Similar to Flappy Bird structure with:
- Level indicator
- Lives display (hearts)
- Combo meter
- Power-up indicators
- Pause functionality

---

## Game 3: Pac-Man 🟡

### Overview
**Timeline:** 5-6 days
**Complexity:** ⭐⭐⭐☆☆ (Medium)
**Priority:** Implement third (most complex)

### Day 9-10: Maze & Movement System

#### Step 1: File Structure (30 minutes)
```bash
mkdir -p src/components/Games/PacMan
touch src/components/Games/PacMan/PacManPage.tsx
touch src/components/Games/PacMan/GameCanvas.tsx
touch src/components/Games/PacMan/types.ts
touch src/components/Games/PacMan/constants.ts
touch src/components/Games/PacMan/mazes.ts
touch src/components/Games/PacMan/ghostAI.ts
touch src/hooks/usePacMan.ts
```

#### Step 2: Define Maze System (2 hours)
**File:** `src/components/Games/PacMan/mazes.ts`

```typescript
// Maze represented as 2D array:
// 0 = empty, 1 = wall, 2 = dot, 3 = power pellet, 4 = ghost spawn

export const CLASSIC_MAZE: number[][] = [
  // 28 cols x 31 rows classic maze layout
  // ... (maze pattern)
];

// Pathfinding for ghost AI
export const findPath = (
  maze: number[][],
  start: {x: number; y: number},
  goal: {x: number; y: number}
): Direction[] => {
  // A* pathfinding algorithm
};
```

### Day 11-12: Ghost AI System

#### Step 3: Ghost AI (4 hours)
**File:** `src/components/Games/PacMan/ghostAI.ts`

```typescript
// Four ghost personalities:

// 1. Blinky (Red) - Aggressive chaser
// Targets Pac-Man's current position directly

// 2. Pinky (Pink) - Ambusher
// Targets 4 tiles ahead of Pac-Man's direction

// 3. Inky (Cyan) - Flanker
// Uses Blinky's position + Pac-Man's position for complex targeting

// 4. Clyde (Orange) - Random/Scared
// Chases when far, runs when close

export class GhostAI {
  getNextMove(
    ghost: Ghost,
    pacman: PacMan,
    maze: number[][],
    otherGhosts: Ghost[]
  ): Direction {
    // Behavior varies by personality and mode
  }
}
```

### Day 13-14: Game Loop, Rendering & Integration

#### Step 4: Complete Implementation
- Pac-Man movement (grid-based snapping)
- Dot collection and scoring
- Power pellet effects
- Ghost state transitions (chase/scatter/frightened)
- Level progression
- Canvas rendering with animations
- Sound effects (wakka-wakka, ghost eaten, etc.)

---

## Integration & Testing

### App.tsx Updates
```typescript
type AppPage =
  | 'home'
  | 'drawing'
  | 'gallery'
  // ... existing 13 games
  | 'flappyBird'
  | 'breakout'
  | 'pacman';

// Add route cases for all 3 games
```

### HomePage.tsx Updates
Add 3 new game buttons with appropriate styling:
- Flappy Bird: Yellow gradient
- Breakout: Blue/cyan gradient
- Pac-Man: Yellow/gold gradient

### Testing Checklist
- [ ] All games work on desktop (keyboard)
- [ ] All games work on mobile (touch)
- [ ] High scores persist in localStorage
- [ ] No performance issues (60fps)
- [ ] Responsive layouts
- [ ] Collision detection accurate
- [ ] AI behaves correctly (Pac-Man ghosts)
- [ ] Power-ups work (Breakout)
- [ ] Level progression works
- [ ] Game over states correct
- [ ] Sound effects (optional)

---

## Timeline Summary

| Day | Task | Game | Hours |
|-----|------|------|-------|
| 1 | Core logic & types | Flappy Bird | 4-5 |
| 2 | Canvas rendering | Flappy Bird | 3-4 |
| 3 | Page & integration | Flappy Bird | 2-3 |
| 4-5 | Core logic & physics | Breakout | 6-8 |
| 6-7 | Canvas & interactions | Breakout | 6-8 |
| 8 | Integration & polish | Breakout | 3-4 |
| 9-10 | Maze & movement | Pac-Man | 6-8 |
| 11-12 | Ghost AI | Pac-Man | 6-8 |
| 13-14 | Rendering & polish | Pac-Man | 6-8 |

**Total:** 42-56 hours over 11-14 days

---

## Success Criteria

### Flappy Bird Complete When:
- ✅ Bird responds to tap/spacebar
- ✅ Physics feel natural (gravity, flap)
- ✅ Pipes generate and scroll smoothly
- ✅ Collision detection accurate
- ✅ Score tracks correctly
- ✅ High score persists
- ✅ Game over screen works
- ✅ Mobile touch works perfectly

### Breakout Complete When:
- ✅ Paddle follows mouse/touch
- ✅ Ball bounces realistically
- ✅ Angle reflection from paddle works
- ✅ Bricks break correctly (1-2 hits)
- ✅ Power-ups spawn and apply effects
- ✅ Multiple levels work
- ✅ Lives system functions
- ✅ Score and combo track correctly

### Pac-Man Complete When:
- ✅ Pac-Man moves smoothly in maze
- ✅ Grid-based movement feels tight
- ✅ All 4 ghosts have distinct AI
- ✅ Power pellet mode works
- ✅ Dots disappear when eaten
- ✅ Level progression works
- ✅ Lives and score track correctly
- ✅ Ghost respawn after eaten

---

## Code Reuse Opportunities

### From Existing Games:
- **Jelly Volleyball:** Canvas rendering patterns, physics
- **Snake:** Grid-based movement (Pac-Man)
- **Tetris:** Grid system for bricks (Breakout)
- **Color Blocks:** Collision detection patterns

### Shared Utilities:
```typescript
// src/utils/gameUtils.ts additions:

// Physics helpers
export const reflectAngle = (angle: number, normal: number): number => {...}
export const clampVelocity = (v: number, max: number): number => {...}

// Collision detection
export const circleRectCollision = (circle, rect): boolean => {...}
export const circleCircleCollision = (c1, c2): boolean => {...}

// Grid utilities
export const worldToGrid = (x: number, y: number, cellSize: number) => {...}
export const gridToWorld = (gridX: number, gridY: number, cellSize: number) => {...}
```

---

## Optional Enhancements (Future)

### Flappy Bird:
- Multiple bird characters
- Themed environments (night, space, underwater)
- Daily challenges
- More medals/achievements

### Breakout:
- Boss levels with moving brick formations
- Additional power-ups (mega ball, gun, extra life)
- Level editor
- Special brick types (explosive, multiplier)

### Pac-Man:
- Multiple maze layouts
- Fruit bonuses
- 2-player mode
- Custom maze editor

---

## Performance Targets

- **FPS:** Maintain 60fps during gameplay
- **Bundle Size:** Each game <30KB
- **Load Time:** Game ready to play in <100ms
- **Memory:** No memory leaks during extended play

---

## Accessibility

- Keyboard controls for all games
- Touch targets ≥44px
- High contrast mode options
- Pause functionality
- Clear visual feedback
- Screen reader labels for scores

---

## Next Steps After Completion

1. ✅ Test all 3 games thoroughly
2. ✅ Update documentation
3. ✅ Add to GAME_PROPOSALS.md as complete
4. ✅ Consider Phase B games (Space Invaders, Endless Runner)
5. ✅ Gather user feedback
6. ✅ Iterate based on metrics

---

**Document Version:** 1.0
**Created:** 2025-11-12
**Status:** Ready for Implementation
**Recommended Start:** Flappy Bird (Days 1-3)
