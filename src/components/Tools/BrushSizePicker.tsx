import { useState } from 'react';
import { isMobileDevice } from '../../utils/DeviceUtils';

interface BrushSizePickerProps {
  selectedSize: number;
  onSizeChange: (size: number) => void;
}

const brushSizes = [
  { size: 2, label: 'Thin', emoji: '✏️', description: 'Fine lines' },
  { size: 4, label: 'Medium', emoji: '🖊️', description: 'Perfect for most drawing' },
  { size: 8, label: 'Thick', emoji: '🖌️', description: 'Bold strokes' }
];

const BrushSizePicker = ({ selectedSize, onSizeChange }: BrushSizePickerProps) => {
  const [isAnimating, setIsAnimating] = useState<number | null>(null);
  const isMobile = isMobileDevice();

  const handleSizeSelect = (size: number) => {
    setIsAnimating(size);
    onSizeChange(size);
    
    // Reset animation after a short delay
    setTimeout(() => setIsAnimating(null), 200);
  };

  if (isMobile) {
    // Mobile: Compact horizontal layout
    return (
      <div className="flex gap-2">
        {brushSizes.map(({ size, label, emoji, description }) => {
          const isSelected = selectedSize === size;
          const isCurrentlyAnimating = isAnimating === size;
          
          return (
            <button
              key={size}
              className={`
                flex items-center gap-1 px-2 py-1 rounded-lg border-2 transition-all duration-200
                ${isSelected 
                  ? 'border-primary-500 bg-primary-50 shadow-md' 
                  : 'border-gray-200 bg-white hover:border-primary-300'
                }
                ${isCurrentlyAnimating ? 'animate-pulse' : ''}
                active:scale-95
              `}
              onClick={() => handleSizeSelect(size)}
              aria-label={`Select ${label} brush size`}
              title={description}
            >
              <span className="text-sm">{emoji}</span>
              <div
                className="rounded-full bg-gray-600"
                style={{
                  width: Math.max(3, size / 1.5),
                  height: Math.max(3, size / 1.5)
                }}
              />
            </button>
          );
        })}
      </div>
    );
  }

  // Desktop: Keep the existing layout
  return (
    <div className="flex flex-col items-center p-2">
      <h3 className="text-sm font-semibold text-gray-700 mb-3">
        📏 Brush Size
      </h3>
      <div className="flex gap-3">
        {brushSizes.map(({ size, label, emoji, description }) => {
          const isSelected = selectedSize === size;
          const isCurrentlyAnimating = isAnimating === size;
          
          return (
            <button
              key={size}
              className={`
                flex flex-col items-center p-3 rounded-2xl border-2 transition-all duration-200
                min-w-[60px] min-h-[60px]
                ${isSelected 
                  ? 'border-primary-500 bg-primary-50 scale-110 shadow-lg' 
                  : 'border-gray-200 bg-white hover:border-primary-300 hover:bg-primary-25 hover:scale-105'
                }
                ${isCurrentlyAnimating ? 'animate-bounce' : ''}
                active:scale-95 shadow-md hover:shadow-lg
              `}
              onClick={() => handleSizeSelect(size)}
              aria-label={`Select ${label} brush size`}
              title={description}
              style={{ minWidth: '44px', minHeight: '44px' }}
            >
              <span className="text-xl mb-1">{emoji}</span>
              <span className="text-xs font-medium text-gray-600">{label}</span>
              
              {/* Visual preview of brush size */}
              <div className="mt-1 flex items-center justify-center">
                <div
                  className="rounded-full bg-gray-600"
                  style={{
                    width: Math.max(4, size),
                    height: Math.max(4, size)
                  }}
                />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default BrushSizePicker;