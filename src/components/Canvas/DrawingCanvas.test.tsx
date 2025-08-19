import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import DrawingCanvas from './DrawingCanvas';

// Mock the useCanvas hook
vi.mock('../../hooks/useCanvas', () => ({
  useCanvas: () => ({
    canvasRef: { current: null },
    startDrawing: vi.fn(),
    draw: vi.fn(),
    stopDrawing: vi.fn(),
    clearCanvas: vi.fn(),
    setColor: vi.fn(),
    setLineWidth: vi.fn(),
    currentColor: '#FF6B6B',
    currentLineWidth: 4
  })
}));

describe('DrawingCanvas', () => {
  it('renders canvas element', () => {
    render(<DrawingCanvas />);
    const canvas = screen.getByTestId('drawing-canvas'); 
    expect(canvas).toBeInTheDocument();
  });

  it('applies correct CSS classes for touch interaction', () => {
    render(<DrawingCanvas />);
    const canvas = screen.getByTestId('drawing-canvas');
    expect(canvas).toHaveClass('touch-none');
    expect(canvas).toHaveClass('select-none');
  });

  it('sets correct canvas dimensions', () => {
    render(<DrawingCanvas width={400} height={300} />);
    const canvas = screen.getByTestId('drawing-canvas') as HTMLCanvasElement;
    expect(canvas.width).toBe(400);
    expect(canvas.height).toBe(300);
  });

  it('applies custom className', () => {
    render(<DrawingCanvas className="custom-class" />);
    const container = screen.getByTestId('drawing-canvas').closest('div');
    expect(container).toHaveClass('custom-class');
  });
});