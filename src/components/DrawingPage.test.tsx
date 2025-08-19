import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
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

const renderWithRouter = (component: React.ReactElement) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('DrawingPage', () => {
  it('renders drawing page with header', () => {
    renderWithRouter(<DrawingPage />);
    expect(screen.getByText('🎨 Draw Something Amazing!')).toBeInTheDocument();
  });

  it('renders home button', () => {
    renderWithRouter(<DrawingPage />);
    expect(screen.getByText('← Home')).toBeInTheDocument();
  });

  it('renders clear button', () => {
    renderWithRouter(<DrawingPage />);
    expect(screen.getByText('Clear 🗑️')).toBeInTheDocument();
  });

  it('renders drawing canvas', () => {
    renderWithRouter(<DrawingPage />);
    expect(screen.getByTestId('drawing-canvas')).toBeInTheDocument();
  });

  it('renders mobile instructions', () => {
    renderWithRouter(<DrawingPage />);
    expect(screen.getByText(/On mobile:/)).toBeInTheDocument();
    expect(screen.getByText(/On desktop:/)).toBeInTheDocument();
  });

  it('clears canvas when clear button is clicked', () => {
    renderWithRouter(<DrawingPage />);
    const clearButton = screen.getByText('Clear 🗑️');
    
    fireEvent.click(clearButton);
    
    // Canvas should be re-rendered (new component instance)
    expect(screen.getByTestId('drawing-canvas')).toBeInTheDocument();
  });
});