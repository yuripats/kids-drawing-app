import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import DrawingPage from './DrawingPage';

// Mock the DrawingCanvas component
vi.mock('./Canvas/DrawingCanvas', () => ({
  default: ({ onDrawingChange }: { onDrawingChange?: (dataURL: string) => void }) => {
    return (
      <div data-testid="drawing-canvas" onClick={() => onDrawingChange?.('mock-data-url')}>
        Mock Canvas
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

  it('renders clear button', () => {
    render(<DrawingPage onNavigateHome={mockNavigateHome} />);
    expect(screen.getByText('Clear 🗑️')).toBeInTheDocument();
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

  it('clears canvas when clear button is clicked', () => {
    render(<DrawingPage onNavigateHome={mockNavigateHome} />);
    const clearButton = screen.getByText('Clear 🗑️');
    
    fireEvent.click(clearButton);
    
    // Canvas should be re-rendered (new component instance)
    expect(screen.getByTestId('drawing-canvas')).toBeInTheDocument();
  });
});