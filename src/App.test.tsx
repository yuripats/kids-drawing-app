import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import HomePage from './components/HomePage'
import DrawingPage from './components/DrawingPage'

// Mock the DrawingCanvasWithTools component
vi.mock('./components/Canvas/DrawingCanvasWithTools', () => ({
  default: ({ onDrawingChange }: { onDrawingChange?: (dataURL: string) => void }) => {
    return (
      <div data-testid="drawing-canvas" onClick={() => onDrawingChange?.('mock-data-url')}>
        Mock Canvas with Tools
      </div>
    );
  }
}));

describe('HomePage', () => {
  const mockNavigateToDrawing = vi.fn()
  const mockProps = {
    onNavigateToDrawing: mockNavigateToDrawing,
    onNavigateToStencil: vi.fn(),
    onNavigateToColorBlocks: vi.fn(),
    onNavigateToSudoku: vi.fn(),
    onNavigateToTetris: vi.fn(),
    onNavigateToJellyVolleyball: vi.fn(),
    onNavigateToSnake: vi.fn(),
    onNavigateToMemoryMatch: vi.fn(),
    onNavigateToDrawingChallenge: vi.fn(),
    onNavigateToPopBalloons: vi.fn(),
    onNavigateToSimonSays: vi.fn(),
    onNavigateToBubblePop: vi.fn(),
    onNavigateToColorMixer: vi.fn(),
    onNavigateToMathFacts: vi.fn(),
    onNavigateToShapeSorting: vi.fn(),
    onNavigateToFlappyBird: vi.fn(),
    onNavigateToBreakout: vi.fn(),
    onNavigateToPacMan: vi.fn(),
    onNavigateToSpaceInvaders: vi.fn(),
  }

  it('renders home page content', () => {
    render(<HomePage {...mockProps} />)
    expect(screen.getByText('🎨 Kids Drawing App')).toBeInTheDocument()
    expect(screen.getByText('Welcome to Your Creative Space!')).toBeInTheDocument()
  })

  it('renders feature cards', () => {
    render(<HomePage {...mockProps} />)
    expect(screen.getByText('Touch & Draw')).toBeInTheDocument()
    expect(screen.getByText('Bright Colors')).toBeInTheDocument()
    expect(screen.getByText('Save Your Art')).toBeInTheDocument()
  })

  it('renders start drawing button', () => {
    render(<HomePage {...mockProps} />)
    expect(screen.getByText('🖌️ Free Drawing!')).toBeInTheDocument()
  })
})

describe('DrawingPage', () => {
  const mockNavigateHome = vi.fn()

  it('renders drawing page content', () => {
    render(<DrawingPage onNavigateHome={mockNavigateHome} />)
    expect(screen.getByText('🎨 Draw Something Amazing!')).toBeInTheDocument()
  })
})