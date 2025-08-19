import { useState } from 'react';
import ColorPicker from './ColorPicker';
import BrushSizePicker from './BrushSizePicker';
import ToolSelector from './ToolSelector';
import { isMobileDevice } from '../../utils/DeviceUtils';

interface DrawingToolPanelProps {
  currentColor: string;
  currentBrushSize: number;
  currentTool: 'brush' | 'fill';
  onColorChange: (color: string) => void;
  onBrushSizeChange: (size: number) => void;
  onToolChange: (tool: 'brush' | 'fill') => void;
  onClearCanvas: () => void;
}

const DrawingToolPanel = ({
  currentColor,
  currentBrushSize,
  currentTool,
  onColorChange,
  onBrushSizeChange,
  onToolChange,
  onClearCanvas
}: DrawingToolPanelProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const isMobile = isMobileDevice();

  const handleToggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div className={`
      ${isMobile 
        ? 'fixed bottom-4 left-4 right-4 z-10' 
        : 'mb-6'
      }
    `}>
      <div className={`
        bg-white rounded-2xl shadow-lg border-2 border-gray-100 overflow-hidden
        ${isMobile ? 'mx-auto max-w-sm' : 'max-w-2xl mx-auto'}
        transition-all duration-300 ease-in-out
        ${isCollapsed ? 'h-16' : 'h-auto'}
      `}>
        {/* Toggle header for mobile */}
        {isMobile && (
          <button
            onClick={handleToggleCollapse}
            className={`
              w-full p-4 flex items-center justify-between
              text-gray-700 hover:bg-gray-50 transition-colors
              ${isCollapsed ? '' : 'border-b border-gray-100'}
            `}
            aria-label={isCollapsed ? "Show drawing tools" : "Hide drawing tools"}
          >
            <span className="font-semibold">🎨 Drawing Tools</span>
            <span className={`
              transform transition-transform duration-200
              ${isCollapsed ? 'rotate-0' : 'rotate-180'}
            `}>
              ▲
            </span>
          </button>
        )}

        {/* Tool panel content */}
        <div className={`
          ${isMobile && isCollapsed ? 'hidden' : 'block'}
          ${isMobile ? 'p-3' : 'p-4'}
        `}>
          {!isMobile && (
            <h2 className="text-lg font-bold text-center text-gray-800 mb-4">
              🎨 Drawing Tools
            </h2>
          )}

          <div className={`
            ${isMobile 
              ? 'flex flex-col space-y-4' 
              : 'grid grid-cols-1 md:grid-cols-3 gap-6'
            }
          `}>
            <div className="flex-1">
              <ToolSelector 
                selectedTool={currentTool} 
                onToolChange={onToolChange} 
              />
            </div>

            <div className="flex-1">
              <ColorPicker 
                selectedColor={currentColor} 
                onColorChange={onColorChange} 
              />
            </div>

            <div className="flex-1">
              <BrushSizePicker 
                selectedSize={currentBrushSize} 
                onSizeChange={onBrushSizeChange} 
              />
            </div>
          </div>

          {/* Action buttons */}
          <div className={`
            flex justify-center gap-3 mt-4 pt-4 border-t border-gray-100
          `}>
            <button
              onClick={onClearCanvas}
              className={`
                kid-button bg-red-500 hover:bg-red-600 active:bg-red-700 
                ${isMobile ? 'text-sm px-4 py-2' : 'text-base px-6 py-3'}
                flex items-center gap-2
              `}
            >
              <span>🗑️</span>
              Clear Canvas
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DrawingToolPanel;