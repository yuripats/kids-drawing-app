import { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import DrawingCanvas from './Canvas/DrawingCanvas';

const DrawingPage = () => {
  const [canvasKey, setCanvasKey] = useState(0);

  const handleDrawingChange = useCallback((dataURL: string) => {
    // For now, just log the drawing change
    console.log('Drawing updated:', dataURL.substring(0, 50) + '...');
  }, []);

  const handleClearCanvas = useCallback(() => {
    // Force canvas to remount by changing key
    setCanvasKey(prev => prev + 1);
  }, []);


  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary-100 via-primary-50 to-secondary-50 p-4">
      {/* Header */}
      <header className="flex justify-between items-center mb-6">
        <Link 
          to="/"
          className="kid-button bg-secondary-500 hover:bg-secondary-600 active:bg-secondary-700 px-4 py-2 text-sm inline-block text-center no-underline"
        >
          ← Home
        </Link>
        
        <h1 className="text-2xl md:text-3xl font-bold text-primary-600">
          🎨 Draw Something Amazing!
        </h1>
        
        <button 
          onClick={handleClearCanvas}
          className="kid-button bg-red-500 hover:bg-red-600 active:bg-red-700 px-4 py-2 text-sm"
        >
          Clear 🗑️
        </button>
      </header>

      {/* Drawing Area */}
      <main className="flex justify-center">
        <div className="kid-card max-w-4xl w-full">
          <div className="flex flex-col items-center space-y-4">
            <p className="text-lg text-gray-600 text-center">
              Use your finger or stylus to draw on the canvas below
            </p>
            
            {/* Canvas Container */}
            <div className="w-full flex justify-center">
              <DrawingCanvas
                key={canvasKey}
                width={Math.min(800, window.innerWidth - 100)}
                height={Math.min(600, window.innerHeight - 300)}
                className="max-w-full"
                onDrawingChange={handleDrawingChange}
              />
            </div>

            {/* Instructions for mobile */}
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