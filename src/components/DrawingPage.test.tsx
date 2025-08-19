import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import DrawingPage from './DrawingPage';

// Mock the DrawingCanvasWithTools component
vi.mock('./Canvas/DrawingCanvasWithTools', () => ({
  default: ({ onDrawingChange }: { onDrawingChange?: (dataURL: string) => void }) => {
    return (
      <div data-testid="drawing-canvas" onClick={() => onDrawingChange?.('mock-data-url')}>
        Mock Canvas with Tools
        <button data-testid="mock-clear-button">Clear Canvas</button>
      </div>
    );
  }
}));

describe('DrawingPage', () => {
  const mockNavigateHome = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders drawing page with header', () => {
    render(<DrawingPage onNavigateHome={mockNavigateHome} />);
    expect(screen.getByText('🎨 Draw Something Amazing!')).toBeInTheDocument();
  });

  it('renders home button', () => {
    render(<DrawingPage onNavigateHome={mockNavigateHome} />);
    expect(screen.getByText('← Home')).toBeInTheDocument();
  });

  it('renders clear button in canvas tools', () => {
    render(<DrawingPage onNavigateHome={mockNavigateHome} />);
    expect(screen.getByTestId('mock-clear-button')).toBeInTheDocument();
  });

  it('renders drawing canvas', () => {
    render(<DrawingPage onNavigateHome={mockNavigateHome} />);
    expect(screen.getByTestId('drawing-canvas')).toBeInTheDocument();
  });

  it('renders mobile instructions', () => {
    render(<DrawingPage onNavigateHome={mockNavigateHome} />);
    expect(screen.getByText(/On mobile:/)).toBeInTheDocument();
    expect(screen.getByText(/On desktop:/)).toBeInTheDocument();
  });

  it('calls navigation callback when home button is clicked', () => {
    render(<DrawingPage onNavigateHome={mockNavigateHome} />);
    const homeButton = screen.getByText('← Home');
    
    fireEvent.click(homeButton);
    
    expect(mockNavigateHome).toHaveBeenCalledTimes(1);
  });

  it('renders canvas with tools', () => {
    render(<DrawingPage onNavigateHome={mockNavigateHome} />);
    
    // Canvas with tools should be rendered
    expect(screen.getByTestId('drawing-canvas')).toBeInTheDocument();
    expect(screen.getByText('Mock Canvas with Tools')).toBeInTheDocument();
  });
});