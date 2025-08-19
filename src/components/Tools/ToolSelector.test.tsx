import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ToolSelector from './ToolSelector';

describe('ToolSelector', () => {
  const mockOnToolChange = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders all tool options', () => {
    render(
      <ToolSelector
        selectedTool="brush"
        onToolChange={mockOnToolChange}
      />
    );

    expect(screen.getByText('🛠️ Drawing Tool')).toBeInTheDocument();
    expect(screen.getByLabelText('Select Brush tool')).toBeInTheDocument();
    expect(screen.getByLabelText('Select Fill tool')).toBeInTheDocument();
  });

  it('shows selected tool with visual indication', () => {
    render(
      <ToolSelector
        selectedTool="fill"
        onToolChange={mockOnToolChange}
      />
    );

    const selectedButton = screen.getByLabelText('Select Fill tool');
    
    // Selected button should have special styling
    expect(selectedButton).toHaveClass('border-primary-500', 'bg-primary-50', 'scale-110', 'shadow-lg');
  });

  it('shows non-selected tool without visual indication', () => {
    render(
      <ToolSelector
        selectedTool="fill"
        onToolChange={mockOnToolChange}
      />
    );

    const nonSelectedButton = screen.getByLabelText('Select Brush tool');
    
    // Non-selected button should not have selected styling
    expect(nonSelectedButton).toHaveClass('border-gray-200', 'bg-white');
    expect(nonSelectedButton).not.toHaveClass('border-primary-500', 'bg-primary-50', 'scale-110');
  });

  it('calls onToolChange when a tool is clicked', () => {
    render(
      <ToolSelector
        selectedTool="brush"
        onToolChange={mockOnToolChange}
      />
    );

    const fillButton = screen.getByLabelText('Select Fill tool');
    fireEvent.click(fillButton);

    expect(mockOnToolChange).toHaveBeenCalledWith('fill');
  });

  it('updates visual selection when selectedTool prop changes', () => {
    const { rerender } = render(
      <ToolSelector
        selectedTool="brush"
        onToolChange={mockOnToolChange}
      />
    );

    // Initially brush should be selected
    expect(screen.getByLabelText('Select Brush tool')).toHaveClass('border-primary-500');
    expect(screen.getByLabelText('Select Fill tool')).toHaveClass('border-gray-200');

    // Change to fill
    rerender(
      <ToolSelector
        selectedTool="fill"
        onToolChange={mockOnToolChange}
      />
    );

    // Now fill should be selected, brush should not
    expect(screen.getByLabelText('Select Fill tool')).toHaveClass('border-primary-500');
    expect(screen.getByLabelText('Select Brush tool')).toHaveClass('border-gray-200');
  });

  it('displays correct tool labels and emojis', () => {
    render(
      <ToolSelector
        selectedTool="brush"
        onToolChange={mockOnToolChange}
      />
    );

    expect(screen.getByText('🖌️')).toBeInTheDocument(); // Brush emoji
    expect(screen.getByText('🪣')).toBeInTheDocument(); // Fill emoji
    expect(screen.getByText('Brush')).toBeInTheDocument();
    expect(screen.getByText('Fill')).toBeInTheDocument();
  });

  it('has proper accessibility attributes', () => {
    render(
      <ToolSelector
        selectedTool="brush"
        onToolChange={mockOnToolChange}
      />
    );

    const brushButton = screen.getByLabelText('Select Brush tool');
    const fillButton = screen.getByLabelText('Select Fill tool');
    
    expect(brushButton).toHaveAttribute('title', 'Draw with brush');
    expect(fillButton).toHaveAttribute('title', 'Fill areas with color');
  });
});