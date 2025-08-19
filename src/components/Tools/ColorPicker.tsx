import { useState } from 'react';

interface ColorPickerProps {
  selectedColor: string;
  onColorChange: (color: string) => void;
}

const kidColors = [
  '#FF6B6B', // Red
  '#4ECDC4', // Teal  
  '#45B7D1', // Blue
  '#96CEB4', // Green
  '#FECA57', // Yellow
  '#FF9FF3', // Pink
  '#54A0FF', // Light Blue
  '#5F27CD'  // Purple
];

const ColorPicker = ({ selectedColor, onColorChange }: ColorPickerProps) => {
  const [isAnimating, setIsAnimating] = useState<string | null>(null);

  const handleColorSelect = (color: string) => {
    setIsAnimating(color);
    onColorChange(color);
    
    // Reset animation after a short delay
    setTimeout(() => setIsAnimating(null), 200);
  };

  return (
    <div className="flex flex-wrap gap-2 justify-center p-2">
      <h3 className="w-full text-center text-sm font-semibold text-gray-700 mb-2">
        🎨 Choose Your Color
      </h3>
      <div className="flex flex-wrap gap-2 justify-center">
        {kidColors.map((color) => {
          const isSelected = selectedColor === color;
          const isCurrentlyAnimating = isAnimating === color;
          
          return (
            <button
              key={color}
              className={`
                w-11 h-11 rounded-full border-3 transition-all duration-200
                ${isSelected 
                  ? 'border-gray-800 scale-110 shadow-lg' 
                  : 'border-white hover:border-gray-300 hover:scale-105'
                }
                ${isCurrentlyAnimating ? 'animate-pulse' : ''}
                active:scale-95 shadow-md hover:shadow-lg
              `}
              style={{ 
                backgroundColor: color,
                minWidth: '44px',
                minHeight: '44px'
              }}
              onClick={() => handleColorSelect(color)}
              aria-label={`Select ${color} color`}
              role="button"
            >
              {isSelected && (
                <span className="text-white text-lg font-bold drop-shadow-lg">
                  ✓
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ColorPicker;