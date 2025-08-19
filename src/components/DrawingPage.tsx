import { useState, useCallback, useEffect } from 'react';
import DrawingCanvasWithTools from './Canvas/DrawingCanvasWithTools';
import { isMobileDevice, getViewportDimensions } from '../utils/DeviceUtils';

interface DrawingPageProps {
  onNavigateHome: () => void;
}

const DrawingPage = ({ onNavigateHome }: DrawingPageProps) => {
  const [isMobile, setIsMobile] = useState(false);
  const [viewport, setViewport] = useState({ width: 800, height: 600 });

  const handleDrawingChange = useCallback((dataURL: string) => {
    // For now, just log the drawing change
    console.log('Drawing updated:', dataURL.substring(0, 50) + '...');
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

  return (
    <div className={`min-h-screen ${isMobile ? 'bg-gray-50' : 'bg-gradient-to-br from-secondary-100 via-primary-50 to-secondary-50'} ${isMobile ? 'p-2' : 'p-4'}`}>
      {/* Header */}
      <header className={`flex justify-between items-center ${isMobile ? 'mb-4' : 'mb-6'}`}>
        <button 
          onClick={onNavigateHome}
          className="kid-button bg-secondary-500 hover:bg-secondary-600 active:bg-secondary-700 px-4 py-2 text-sm"
        >
          ← Home
        </button>
        
        <h1 className={`font-bold text-primary-600 ${isMobile ? 'text-lg' : 'text-2xl md:text-3xl'}`}>
          {isMobile ? '🎨 Draw!' : '🎨 Draw Something Amazing!'}
        </h1>
        
        {/* Spacer for layout balance */}
        <div className="w-16"></div>
      </header>

      {/* Drawing Area */}
      <main className="flex justify-center">
        <div className={`${isMobile ? 'w-full' : 'kid-card max-w-4xl w-full'}`}>
          <div className="flex flex-col items-center space-y-4">
            {!isMobile && (
              <p className="text-lg text-gray-600 text-center">
                Use your finger or stylus to draw on the canvas below
              </p>
            )}
            
            {/* Canvas with Tools Container */}
            <div className="w-full flex justify-center">
              <DrawingCanvasWithTools
                width={canvasSize.width}
                height={canvasSize.height}
                className="max-w-full"
                onDrawingChange={handleDrawingChange}
              />
            </div>

            {/* Instructions - only show on desktop */}
            {!isMobile && (
              <div className="text-center text-gray-500 text-sm max-w-md">
                <p className="mb-2">📱 <strong>On mobile:</strong> Draw with your finger</p>
                <p>🖥️ <strong>On desktop:</strong> Click and drag to draw</p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer Info - only show on desktop */}
      {!isMobile && (
        <footer className="mt-8 text-center text-gray-500 text-sm">
          <p>✨ Your drawing will be automatically saved when you're done!</p>
        </footer>
      )}
    </div>
  );
};

export default DrawingPage;