import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ColorPicker from './ColorPicker';

describe('ColorPicker', () => {
  const mockOnColorChange = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders all color options', () => {
    render(
      <ColorPicker
        selectedColor="#FF6B6B"
        onColorChange={mockOnColorChange}
      />
    );

    expect(screen.getByText('🎨 Choose Your Color')).toBeInTheDocument();
    
    // Should render 8 color buttons
    const colorButtons = screen.getAllByRole('button');
    expect(colorButtons).toHaveLength(8);
  });

  it('shows selected color with visual indication', () => {
    render(
      <ColorPicker
        selectedColor="#4ECDC4"
        onColorChange={mockOnColorChange}
      />
    );

    const selectedButton = screen.getByLabelText('Select #4ECDC4 color');
    
    // Selected button should have special styling and checkmark
    expect(selectedButton).toHaveClass('border-gray-800', 'scale-110', 'shadow-lg');
    expect(selectedButton.querySelector('span')).toHaveTextContent('✓');
  });

  it('shows non-selected colors without visual indication', () => {
    render(
      <ColorPicker
        selectedColor="#FF6B6B"
        onColorChange={mockOnColorChange}
      />
    );

    const nonSelectedButton = screen.getByLabelText('Select #4ECDC4 color');
    
    // Non-selected button should not have selected styling
    expect(nonSelectedButton).toHaveClass('border-white');
    expect(nonSelectedButton).not.toHaveClass('border-gray-800', 'scale-110');
    expect(nonSelectedButton.querySelector('span')).toBeNull();
  });

  it('calls onColorChange when a color is clicked', () => {
    render(
      <ColorPicker
        selectedColor="#FF6B6B"
        onColorChange={mockOnColorChange}
      />
    );

    const greenButton = screen.getByLabelText('Select #96CEB4 color');
    fireEvent.click(greenButton);

    expect(mockOnColorChange).toHaveBeenCalledWith('#96CEB4');
  });

  it('updates visual selection when selectedColor prop changes', () => {
    const { rerender } = render(
      <ColorPicker
        selectedColor="#FF6B6B"
        onColorChange={mockOnColorChange}
      />
    );

    // Initially red should be selected
    expect(screen.getByLabelText('Select #FF6B6B color')).toHaveClass('border-gray-800');
    expect(screen.getByLabelText('Select #45B7D1 color')).toHaveClass('border-white');

    // Change to blue
    rerender(
      <ColorPicker
        selectedColor="#45B7D1"
        onColorChange={mockOnColorChange}
      />
    );

    // Now blue should be selected, red should not
    expect(screen.getByLabelText('Select #45B7D1 color')).toHaveClass('border-gray-800');
    expect(screen.getByLabelText('Select #FF6B6B color')).toHaveClass('border-white');
  });

  it('has proper accessibility attributes', () => {
    render(
      <ColorPicker
        selectedColor="#FF6B6B"
        onColorChange={mockOnColorChange}
      />
    );

    const colorButtons = screen.getAllByRole('button');
    
    colorButtons.forEach(button => {
      expect(button).toHaveAttribute('aria-label');
      expect(button.getAttribute('aria-label')).toMatch(/Select #[A-F0-9]{6} color/);
    });
  });
});