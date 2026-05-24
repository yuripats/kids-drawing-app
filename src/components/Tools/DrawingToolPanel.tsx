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
  onUndo?: () => void;
  onRedo?: () => void;
  canUndo?: boolean;
  canRedo?: boolean;
}

const DrawingToolPanel = ({
  currentColor,
  currentBrushSize,
  currentTool,
  onColorChange,
  onBrushSizeChange,
  onToolChange,
  onClearCanvas,
  onUndo,
  onRedo,
  canUndo = false,
  canRedo = false,
}: DrawingToolPanelProps) => {
  const isMobile = isMobileDevice();
  const [showBrushSizePicker, setShowBrushSizePicker] = useState(false);

  const handleBrushOptionsToggle = () => {
    setShowBrushSizePicker(!showBrushSizePicker);
  };

  const handleBrushSizeChange = (size: number) => {
    onBrushSizeChange(size);
    setShowBrushSizePicker(false); // Hide picker after selection
  };

  if (isMobile) {
    // Mobile: Return separate components for top and bottom bars
    return (
      <>
        {/* Top Bar - Tool Selector, Colors, Undo/Redo */}
        <div className="bg-white border-b border-gray-200 px-4 py-3">
          <div className="flex items-center justify-between gap-2">
            {/* Tool Selector */}
            <div className="flex-shrink-0 relative">
              <ToolSelector
                selectedTool={currentTool}
                onToolChange={onToolChange}
                onBrushOptionsToggle={handleBrushOptionsToggle}
              />

              {/* Brush Size Picker Popup */}
              {showBrushSizePicker && (
                <div className="absolute top-full mt-2 left-0 bg-white rounded-lg shadow-lg border border-gray-200 p-3 z-50">
                  <BrushSizePicker
                    selectedSize={currentBrushSize}
                    onSizeChange={handleBrushSizeChange}
                  />
                </div>
              )}
            </div>

            {/* Colors */}
            <div className="flex-1 px-2">
              <ColorPicker
                selectedColor={currentColor}
                onColorChange={onColorChange}
              />
            </div>

            {/* Undo / Redo */}
            <div className="flex gap-1 flex-shrink-0">
              <button
                onClick={onUndo}
                disabled={!canUndo}
                aria-label="Undo"
                className="kid-button text-xl px-3 py-2 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                ↩️
              </button>
              <button
                onClick={onRedo}
                disabled={!canRedo}
                aria-label="Redo"
                className="kid-button text-xl px-3 py-2 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                ↪️
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }

  // Desktop: Keep the existing centered layout
  return (
    <div className="mb-6">
      <div className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 overflow-hidden max-w-2xl mx-auto">
        <div className="p-4">
          <h2 className="text-lg font-bold text-center text-gray-800 mb-4">
            🎨 Drawing Tools
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex-1 relative">
              <ToolSelector 
                selectedTool={currentTool} 
                onToolChange={onToolChange}
                onBrushOptionsToggle={handleBrushOptionsToggle}
              />
              
              {/* Brush Size Picker Popup */}
              {showBrushSizePicker && (
                <div className="absolute top-full mt-2 left-1/2 transform -translate-x-1/2 bg-white rounded-lg shadow-lg border border-gray-200 p-3 z-50">
                  <BrushSizePicker 
                    selectedSize={currentBrushSize} 
                    onSizeChange={handleBrushSizeChange} 
                  />
                </div>
              )}
            </div>

            <div className="flex-1">
              <ColorPicker 
                selectedColor={currentColor} 
                onColorChange={onColorChange} 
              />
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex justify-center gap-3 mt-4 pt-4 border-t border-gray-100">
            <button
              onClick={onUndo}
              disabled={!canUndo}
              aria-label="Undo"
              className="kid-button bg-indigo-500 hover:bg-indigo-600 active:bg-indigo-700 text-base px-4 py-3 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              ↩️ Undo
            </button>
            <button
              onClick={onRedo}
              disabled={!canRedo}
              aria-label="Redo"
              className="kid-button bg-indigo-500 hover:bg-indigo-600 active:bg-indigo-700 text-base px-4 py-3 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              ↪️ Redo
            </button>
            <button
              onClick={onClearCanvas}
              className="kid-button bg-red-500 hover:bg-red-600 active:bg-red-700 text-base px-6 py-3 flex items-center gap-2"
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