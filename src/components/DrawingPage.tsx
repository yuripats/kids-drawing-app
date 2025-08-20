import { useState, useCallback, useEffect, useRef } from 'react';
import DrawingCanvasWithTools from './Canvas/DrawingCanvasWithTools';
import { isMobileDevice, getViewportDimensions } from '../utils/DeviceUtils';
import { Stencil } from '../types/Stencil';

interface DrawingPageProps {
  onNavigateHome: () => void;
  stencil?: Stencil | null;
}

const DrawingPage = ({ onNavigateHome, stencil }: DrawingPageProps) => {
  const [isMobile, setIsMobile] = useState(false);
  const [viewport, setViewport] = useState({ width: 800, height: 600 });
  const clearCanvasRef = useRef<(() => void) | null>(null);

  const handleDrawingChange = useCallback((dataURL: string) => {
    // For now, just log the drawing change
    console.log('Drawing updated:', dataURL.substring(0, 50) + '...');
  }, []);

  const handleClearCanvas = useCallback(() => {
    if (clearCanvasRef.current) {
      clearCanvasRef.current();
    }
  }, []);

  // Detect mobile and calculate optimal canvas size
  useEffect(() => {
    const updateLayout = () => {
      const mobile = isMobileDevice();
      const dimensions = getViewportDimensions();
      
      setIsMobile(mobile);
      setViewport(dimensions);
    };

    updateLayout();
    
    window.addEventListener('resize', updateLayout);
    window.addEventListener('orientationchange', updateLayout);
    
    return () => {
      window.removeEventListener('resize', updateLayout);
      window.removeEventListener('orientationchange', updateLayout);
    };
  }, []);


  // Calculate optimal canvas size based on device and viewport
  const getCanvasSize = () => {
    if (isMobile) {
      // Mobile: use more of the screen, account for header and padding
      const maxWidth = viewport.width - 32; // 16px padding on each side
      const maxHeight = viewport.height - 200; // Header, buttons, and safe area
      return {
        width: Math.min(maxWidth, 600), // Cap at reasonable size
        height: Math.min(maxHeight, 500)
      };
    } else {
      // Desktop: comfortable centered canvas
      return {
        width: Math.min(800, viewport.width - 100),
        height: Math.min(600, viewport.height - 300)
      };
    }
  };

  const canvasSize = getCanvasSize();

  if (isMobile) {
    // Mobile: Full-screen layout with no padding, tools at top/bottom
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        {/* Mobile Header */}
        <header className="bg-white border-b border-gray-200 px-4 py-3 flex justify-between items-center">
          <button 
            onClick={onNavigateHome}
            className="kid-button bg-secondary-500 hover:bg-secondary-600 active:bg-secondary-700 px-3 py-2 text-sm"
          >
            ← Home
          </button>
          
          <h1 className="font-bold text-primary-600 text-base truncate mx-2">
            {stencil ? `🎭 ${stencil.name}` : '🎨 Draw!'}
          </h1>
          
          {/* Clear Button */}
          <button 
            onClick={handleClearCanvas}
            className="kid-button bg-red-500 hover:bg-red-600 active:bg-red-700 px-3 py-2 text-sm flex items-center gap-1"
          >
            <span>🗑️</span>
            Clear
          </button>
        </header>

        {/* Canvas with Tools - takes remaining space */}
        <main className="flex-1 flex flex-col">
          <DrawingCanvasWithTools
            width={canvasSize.width}
            height={canvasSize.height}
            className="h-full"
            onDrawingChange={handleDrawingChange}
            clearCanvasRef={clearCanvasRef}
            stencil={stencil}
          />
        </main>
      </div>
    );
  }

  // Desktop: Keep the existing layout
  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary-100 via-primary-50 to-secondary-50 p-4">
      {/* Header */}
      <header className="flex justify-between items-center mb-6">
        <button 
          onClick={onNavigateHome}
          className="kid-button bg-secondary-500 hover:bg-secondary-600 active:bg-secondary-700 px-4 py-2 text-sm"
        >
          ← Home
        </button>
        
        <h1 className="font-bold text-primary-600 text-2xl md:text-3xl">
          {stencil 
            ? `🎭 Color ${stencil.name}!`
            : '🎨 Draw Something Amazing!'
          }
        </h1>
        
        {/* Spacer for layout balance */}
        <div className="w-16"></div>
      </header>

      {/* Drawing Area */}
      <main className="flex justify-center">
        <div className="kid-card max-w-4xl w-full">
          <div className="flex flex-col items-center space-y-4">
            <p className="text-lg text-gray-600 text-center">
              {stencil 
                ? `Fill in the ${stencil.name.toLowerCase()} with colors and patterns!`
                : 'Use your finger or stylus to draw on the canvas below'
              }
            </p>
            
            {/* Canvas with Tools Container */}
            <div className="w-full flex justify-center">
              <DrawingCanvasWithTools
                width={canvasSize.width}
                height={canvasSize.height}
                className="max-w-full"
                onDrawingChange={handleDrawingChange}
                clearCanvasRef={clearCanvasRef}
                stencil={stencil}
              />
            </div>

            {/* Instructions */}
            <div className="text-center text-gray-500 text-sm max-w-md">
              <p className="mb-2">📱 <strong>On mobile:</strong> Draw with your finger</p>
              <p>🖥️ <strong>On desktop:</strong> Click and drag to draw</p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer Info */}
      <footer className="mt-8 text-center text-gray-500 text-sm">
        <p>✨ Your drawing will be automatically saved when you're done!</p>
      </footer>
    </div>
  );
};

export default DrawingPage;