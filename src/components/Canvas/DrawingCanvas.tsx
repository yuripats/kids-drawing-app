import { useEffect } from 'react';
import { useCanvas } from '../../hooks/useCanvas';
import { CanvasProps } from '../../types/Drawing';

const DrawingCanvas = ({ 
  width = 800, 
  height = 600, 
  className = '',
  onDrawingChange 
}: CanvasProps) => {
  const {
    canvasRef,
    startDrawing,
    draw,
    stopDrawing
  } = useCanvas({ width, height, onDrawingChange });

  // Prevent scrolling on the canvas container
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const preventDefault = (e: Event) => e.preventDefault();

    // Prevent touch scrolling on canvas
    canvas.addEventListener('touchstart', preventDefault, { passive: false });
    canvas.addEventListener('touchend', preventDefault, { passive: false });
    canvas.addEventListener('touchmove', preventDefault, { passive: false });

    return () => {
      canvas.removeEventListener('touchstart', preventDefault);
      canvas.removeEventListener('touchend', preventDefault);
      canvas.removeEventListener('touchmove', preventDefault);
    };
  }, [canvasRef]);

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

  return (
    <div className={`relative ${className}`}>
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        className="border-4 border-primary-200 rounded-2xl bg-white touch-none select-none"
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
  );
};

export default DrawingCanvas;