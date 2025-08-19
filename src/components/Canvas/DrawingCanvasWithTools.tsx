import { useState, useCallback } from 'react';
import { useCanvas } from '../../hooks/useCanvas';
import DrawingToolPanel from '../Tools/DrawingToolPanel';
import { CanvasProps } from '../../types/Drawing';
import { isMobileDevice } from '../../utils/DeviceUtils';

const DrawingCanvasWithTools = ({ 
  width = 800, 
  height = 600, 
  className = '',
  onDrawingChange,
  stencil 
}: CanvasProps) => {
  const [isMobile] = useState(isMobileDevice());
  
  const {
    canvasRef,
    startDrawing,
    draw,
    stopDrawing,
    setColor,
    setLineWidth,
    setTool,
    clearCanvas,
    currentColor,
    currentLineWidth,
    currentTool
  } = useCanvas({ width, height, onDrawingChange, stencil });

  const handleColorChange = useCallback((color: string) => {
    setColor(color);
  }, [setColor]);

  const handleBrushSizeChange = useCallback((size: number) => {
    setLineWidth(size);
  }, [setLineWidth]);

  const handleToolChange = useCallback((tool: 'brush' | 'fill') => {
    setTool(tool);
  }, [setTool]);

  const handleClearCanvas = useCallback(() => {
    clearCanvas();
  }, [clearCanvas]);

  const handleTouchStart = (e: React.TouchEvent) => {
    startDrawing(e);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    draw(e);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    stopDrawing(e);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    startDrawing(e);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    draw(e);
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    stopDrawing(e);
  };

  // Dynamic canvas styling based on device type
  const canvasClassName = isMobile 
    ? "bg-white touch-none select-none rounded-lg shadow-sm" // Mobile: no border, subtle shadow
    : "border-4 border-primary-200 rounded-2xl bg-white touch-none select-none shadow-lg"; // Desktop: decorative border

  return (
    <div className="flex flex-col items-center">
      {/* Drawing Tools Panel */}
      <DrawingToolPanel
        currentColor={currentColor}
        currentBrushSize={currentLineWidth}
        currentTool={currentTool}
        onColorChange={handleColorChange}
        onBrushSizeChange={handleBrushSizeChange}
        onToolChange={handleToolChange}
        onClearCanvas={handleClearCanvas}
      />

      {/* Canvas */}
      <div className={`relative ${className} ${isMobile ? 'mb-20' : 'mb-4'}`}>
        <canvas
          ref={canvasRef}
          width={width}
          height={height}
          className={canvasClassName}
          style={{ touchAction: 'none' }}
          data-testid="drawing-canvas"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp} // Stop drawing when mouse leaves canvas
        />
      </div>
    </div>
  );
};

export default DrawingCanvasWithTools;