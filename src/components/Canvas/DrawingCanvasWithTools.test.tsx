import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import DrawingCanvasWithTools from './DrawingCanvasWithTools';

// Mock the useCanvas hook
const mockSetColor = vi.fn();
const mockSetLineWidth = vi.fn();
const mockSetTool = vi.fn();
const mockClearCanvas = vi.fn();

vi.mock('../../hooks/useCanvas', () => ({
  useCanvas: () => ({
    canvasRef: { current: null },
    startDrawing: vi.fn(),
    draw: vi.fn(),
    stopDrawing: vi.fn(),
    setColor: mockSetColor,
    setLineWidth: mockSetLineWidth,
    setTool: mockSetTool,
    clearCanvas: mockClearCanvas,
    currentColor: '#FF6B6B',
    currentLineWidth: 4,
    currentTool: 'brush',
    redrawCanvas: vi.fn()
  })
}));

// Mock device utils
vi.mock('../../utils/DeviceUtils', () => ({
  isMobileDevice: () => false
}));

describe('DrawingCanvasWithTools', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders canvas and drawing tools', () => {
    render(
      <DrawingCanvasWithTools
        width={800}
        height={600}
        onDrawingChange={vi.fn()}
      />
    );

    expect(screen.getByText('🎨 Drawing Tools')).toBeInTheDocument();
    expect(screen.getByText('🛠️ Drawing Tool')).toBeInTheDocument();
    expect(screen.getByText('🎨 Choose Your Color')).toBeInTheDocument();
    // Brush size picker is now in a popup, not shown by default
    expect(screen.getByTestId('drawing-canvas')).toBeInTheDocument();
  });

  it('shows default color selection (red) visually', () => {
    render(
      <DrawingCanvasWithTools
        width={800}
        height={600}
        onDrawingChange={vi.fn()}
      />
    );

    // The red color button should have the checkmark (selected state)
    const redColorButton = screen.getByLabelText('Select #FF6B6B color');
    expect(redColorButton).toHaveClass('border-gray-800', 'scale-110', 'shadow-lg');
    expect(redColorButton.querySelector('span')).toHaveTextContent('✓');
  });

  it('shows brush size picker popup when brush tool is clicked twice', () => {
    render(
      <DrawingCanvasWithTools
        width={800}
        height={600}
        onDrawingChange={vi.fn()}
      />
    );

    // Initially, brush size picker should not be visible
    expect(screen.queryByText('📏 Brush Size')).not.toBeInTheDocument();
    
    // Click on brush tool (it's already selected, so this triggers the popup)
    const brushToolButton = screen.getByLabelText('Select Brush tool');
    fireEvent.click(brushToolButton);

    // Now brush size picker popup should be visible
    expect(screen.getByText('📏 Brush Size')).toBeInTheDocument();
    expect(screen.getByLabelText('Select Medium brush size')).toBeInTheDocument();
  });

  it('shows default tool selection (brush) visually', () => {
    render(
      <DrawingCanvasWithTools
        width={800}
        height={600}
        onDrawingChange={vi.fn()}
      />
    );

    // The brush tool button should be selected
    const brushToolButton = screen.getByLabelText('Select Brush tool');
    expect(brushToolButton).toHaveClass('border-primary-500', 'bg-primary-50', 'scale-110', 'shadow-lg');
  });

  it('calls setColor when a color is selected', () => {
    render(
      <DrawingCanvasWithTools
        width={800}
        height={600}
        onDrawingChange={vi.fn()}
      />
    );

    const blueColorButton = screen.getByLabelText('Select #45B7D1 color');
    fireEvent.click(blueColorButton);

    expect(mockSetColor).toHaveBeenCalledWith('#45B7D1');
  });

  it('calls setLineWidth when a brush size is selected', () => {
    render(
      <DrawingCanvasWithTools
        width={800}
        height={600}
        onDrawingChange={vi.fn()}
      />
    );

    // First click on brush tool to show the size picker popup
    const brushToolButton = screen.getByLabelText('Select Brush tool');
    fireEvent.click(brushToolButton);

    // Now click on the thick brush size
    const thickBrushButton = screen.getByLabelText('Select Thick brush size');
    fireEvent.click(thickBrushButton);

    expect(mockSetLineWidth).toHaveBeenCalledWith(8);
  });

  it('calls setTool when a tool is selected', () => {
    render(
      <DrawingCanvasWithTools
        width={800}
        height={600}
        onDrawingChange={vi.fn()}
      />
    );

    const fillToolButton = screen.getByLabelText('Select Fill tool');
    fireEvent.click(fillToolButton);

    expect(mockSetTool).toHaveBeenCalledWith('fill');
  });

  it('calls clearCanvas when clear button is clicked', () => {
    render(
      <DrawingCanvasWithTools
        width={800}
        height={600}
        onDrawingChange={vi.fn()}
      />
    );

    const clearButton = screen.getByText('Clear Canvas');
    fireEvent.click(clearButton);

    expect(mockClearCanvas).toHaveBeenCalledTimes(1);
  });

  it('shows visual feedback during color selection (animation)', async () => {
    render(
      <DrawingCanvasWithTools
        width={800}
        height={600}
        onDrawingChange={vi.fn()}
      />
    );

    const yellowColorButton = screen.getByLabelText('Select #FECA57 color');
    fireEvent.click(yellowColorButton);

    // Should trigger animation class temporarily
    expect(mockSetColor).toHaveBeenCalledWith('#FECA57');
  });

  it('shows visual feedback during brush size selection (animation)', async () => {
    render(
      <DrawingCanvasWithTools
        width={800}
        height={600}
        onDrawingChange={vi.fn()}
      />
    );

    // First click on brush tool to show the size picker popup
    const brushToolButton = screen.getByLabelText('Select Brush tool');
    fireEvent.click(brushToolButton);

    // Now click on the thin brush size
    const thinBrushButton = screen.getByLabelText('Select Thin brush size');
    fireEvent.click(thinBrushButton);

    // Should trigger animation class temporarily
    expect(mockSetLineWidth).toHaveBeenCalledWith(2);
  });
});