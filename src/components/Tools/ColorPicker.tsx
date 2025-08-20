import { useState } from 'react';
import { isMobileDevice } from '../../utils/DeviceUtils';

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
  const isMobile = isMobileDevice();

  const handleColorSelect = (color: string) => {
    setIsAnimating(color);
    onColorChange(color);
    
    // Reset animation after a short delay
    setTimeout(() => setIsAnimating(null), 200);
  };

  if (isMobile) {
    // Mobile: Horizontal scrollable color picker
    return (
      <div className="w-full">
        <div 
          className="flex gap-2 overflow-x-auto pb-1" 
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {kidColors.map((color) => {
            const isSelected = selectedColor === color;
            const isCurrentlyAnimating = isAnimating === color;
            
            return (
              <button
                key={color}
                className={`
                  flex-shrink-0 w-9 h-9 rounded-full border-2 transition-all duration-200
                  ${isSelected 
                    ? 'border-gray-800 scale-110 shadow-lg' 
                    : 'border-white hover:border-gray-300'
                  }
                  ${isCurrentlyAnimating ? 'animate-pulse' : ''}
                  active:scale-95 shadow-md flex items-center justify-center
                `}
                style={{ 
                  backgroundColor: color,
                  minWidth: '36px',
                  minHeight: '36px'
                }}
                onClick={() => handleColorSelect(color)}
                aria-label={`Select ${color} color`}
                role="button"
              >
                {isSelected && (
                  <span className="text-white text-sm font-bold drop-shadow-lg">
                    ✓
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  // Desktop: Keep the existing grid layout
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
                active:scale-95 shadow-md hover:shadow-lg flex items-center justify-center
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