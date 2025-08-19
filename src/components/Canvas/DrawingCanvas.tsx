import { useEffect, useState } from 'react';
import { useCanvas } from '../../hooks/useCanvas';
import { CanvasProps } from '../../types/Drawing';
import { isMobileDevice } from '../../utils/DeviceUtils';

const DrawingCanvas = ({ 
  width = 800, 
  height = 600, 
  className = '',
  onDrawingChange 
}: CanvasProps) => {
  const [isMobile, setIsMobile] = useState(false);
  
  const {
    canvasRef,
    startDrawing,
    draw,
    stopDrawing
  } = useCanvas({ width, height, onDrawingChange });

  // Detect mobile device on mount
  useEffect(() => {
    setIsMobile(isMobileDevice());
    
    // Listen for viewport changes (orientation, resize)
    const handleResize = () => {
      setIsMobile(isMobileDevice());
    };
    
    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
    };
  }, []);

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

  // Dynamic canvas styling based on device type
  const canvasClassName = isMobile 
    ? "bg-white touch-none select-none rounded-lg shadow-sm" // Mobile: no border, subtle shadow
    : "border-4 border-primary-200 rounded-2xl bg-white touch-none select-none shadow-lg"; // Desktop: decorative border

  return (
    <div className={`relative ${className}`}>
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
  );
};

export default DrawingCanvas;