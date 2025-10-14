import { describe, test, expect } from 'vitest'
import { initializeGame } from '../GameBoard'
import { GameConfig } from '../types'

describe('Color Blocks Game Initialization', () => {
  test('creates 6x7 grid with 3 colors by default', () => {
    const gameState = initializeGame({})
    expect(gameState.grid.length).toBe(7) // rows
    expect(gameState.grid[0].length).toBe(6) // columns
    expect(new Set(gameState.grid.flat()).size).toBe(3)
  })

  test('respects custom grid dimensions', () => {
    const config: GameConfig = { gridWidth: 8, gridHeight: 10 }
    const gameState = initializeGame(config)
    expect(gameState.grid.length).toBe(10)
    expect(gameState.grid[0].length).toBe(8)
  })

  test('supports different color counts', () => {
    const config: GameConfig = { initialColors: 5 }
    const gameState = initializeGame(config)
    expect(new Set(gameState.grid.flat()).size).toBe(5)
  })
})
