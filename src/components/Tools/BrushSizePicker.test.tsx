import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import BrushSizePicker from './BrushSizePicker';

describe('BrushSizePicker', () => {
  const mockOnSizeChange = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders all brush size options', () => {
    render(
      <BrushSizePicker
        selectedSize={4}
        onSizeChange={mockOnSizeChange}
      />
    );

    expect(screen.getByText('📏 Brush Size')).toBeInTheDocument();
    
    // Should render 3 brush size buttons
    expect(screen.getByLabelText('Select Thin brush size')).toBeInTheDocument();
    expect(screen.getByLabelText('Select Medium brush size')).toBeInTheDocument();
    expect(screen.getByLabelText('Select Thick brush size')).toBeInTheDocument();
  });

  it('shows selected brush size with visual indication', () => {
    render(
      <BrushSizePicker
        selectedSize={8}
        onSizeChange={mockOnSizeChange}
      />
    );

    const selectedButton = screen.getByLabelText('Select Thick brush size');
    
    // Selected button should have special styling
    expect(selectedButton).toHaveClass('border-primary-500', 'bg-primary-50', 'scale-110', 'shadow-lg');
  });

  it('shows non-selected brush sizes without visual indication', () => {
    render(
      <BrushSizePicker
        selectedSize={8}
        onSizeChange={mockOnSizeChange}
      />
    );

    const nonSelectedButton = screen.getByLabelText('Select Thin brush size');
    
    // Non-selected button should not have selected styling
    expect(nonSelectedButton).toHaveClass('border-gray-200', 'bg-white');
    expect(nonSelectedButton).not.toHaveClass('border-primary-500', 'bg-primary-50', 'scale-110');
  });

  it('calls onSizeChange when a brush size is clicked', () => {
    render(
      <BrushSizePicker
        selectedSize={4}
        onSizeChange={mockOnSizeChange}
      />
    );

    const thickButton = screen.getByLabelText('Select Thick brush size');
    fireEvent.click(thickButton);

    expect(mockOnSizeChange).toHaveBeenCalledWith(8);
  });

  it('updates visual selection when selectedSize prop changes', () => {
    const { rerender } = render(
      <BrushSizePicker
        selectedSize={2}
        onSizeChange={mockOnSizeChange}
      />
    );

    // Initially thin should be selected
    expect(screen.getByLabelText('Select Thin brush size')).toHaveClass('border-primary-500');
    expect(screen.getByLabelText('Select Medium brush size')).toHaveClass('border-gray-200');

    // Change to medium
    rerender(
      <BrushSizePicker
        selectedSize={4}
        onSizeChange={mockOnSizeChange}
      />
    );

    // Now medium should be selected, thin should not
    expect(screen.getByLabelText('Select Medium brush size')).toHaveClass('border-primary-500');
    expect(screen.getByLabelText('Select Thin brush size')).toHaveClass('border-gray-200');
  });

  it('displays proper visual size indicators', () => {
    render(
      <BrushSizePicker
        selectedSize={4}
        onSizeChange={mockOnSizeChange}
      />
    );

    const thinButton = screen.getByLabelText('Select Thin brush size');
    const mediumButton = screen.getByLabelText('Select Medium brush size');
    const thickButton = screen.getByLabelText('Select Thick brush size');

    // Check that visual size dots are present
    expect(thinButton.querySelector('div[style*="width: 4px"]')).toBeInTheDocument();
    expect(mediumButton.querySelector('div[style*="width: 4px"]')).toBeInTheDocument();
    expect(thickButton.querySelector('div[style*="width: 8px"]')).toBeInTheDocument();
  });

  it('has proper accessibility attributes', () => {
    render(
      <BrushSizePicker
        selectedSize={4}
        onSizeChange={mockOnSizeChange}
      />
    );

    const brushButtons = [
      screen.getByLabelText('Select Thin brush size'),
      screen.getByLabelText('Select Medium brush size'),
      screen.getByLabelText('Select Thick brush size')
    ];
    
    brushButtons.forEach(button => {
      expect(button).toHaveAttribute('title');
      expect(button.getAttribute('title')).toMatch(/(Fine lines|Perfect for most drawing|Bold strokes)/);
    });
  });
});