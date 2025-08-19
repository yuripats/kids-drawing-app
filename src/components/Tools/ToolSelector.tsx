import { useState } from 'react';

interface ToolSelectorProps {
  selectedTool: 'brush' | 'fill';
  onToolChange: (tool: 'brush' | 'fill') => void;
}

const tools = [
  { 
    id: 'brush' as const, 
    label: 'Brush', 
    emoji: '🖌️', 
    description: 'Draw with brush' 
  },
  { 
    id: 'fill' as const, 
    label: 'Fill', 
    emoji: '🪣', 
    description: 'Fill areas with color' 
  }
];

const ToolSelector = ({ selectedTool, onToolChange }: ToolSelectorProps) => {
  const [isAnimating, setIsAnimating] = useState<string | null>(null);

  const handleToolSelect = (tool: 'brush' | 'fill') => {
    setIsAnimating(tool);
    onToolChange(tool);
    
    // Reset animation after a short delay
    setTimeout(() => setIsAnimating(null), 200);
  };

  return (
    <div className="flex flex-col items-center p-2">
      <h3 className="text-sm font-semibold text-gray-700 mb-3">
        🛠️ Drawing Tool
      </h3>
      <div className="flex gap-3">
        {tools.map(({ id, label, emoji, description }) => {
          const isSelected = selectedTool === id;
          const isCurrentlyAnimating = isAnimating === id;
          
          return (
            <button
              key={id}
              className={`
                flex flex-col items-center p-3 rounded-2xl border-2 transition-all duration-200
                min-w-[60px] min-h-[60px]
                ${isSelected 
                  ? 'border-primary-500 bg-primary-50 scale-110 shadow-lg' 
                  : 'border-gray-200 bg-white hover:border-primary-300 hover:bg-primary-25 hover:scale-105'
                }
                ${isCurrentlyAnimating ? 'animate-pulse' : ''}
                active:scale-95 shadow-md hover:shadow-lg
              `}
              onClick={() => handleToolSelect(id)}
              aria-label={`Select ${label} tool`}
              title={description}
              style={{ minWidth: '44px', minHeight: '44px' }}
            >
              <span className="text-xl mb-1">{emoji}</span>
              <span className="text-xs font-medium text-gray-600">{label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ToolSelector;