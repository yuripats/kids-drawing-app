import { useState } from 'react';
import StencilGallery from './Stencils/StencilGallery';
import { Stencil } from '../types/Stencil';

interface HomePageProps {
  onNavigateToDrawing: () => void;
  onNavigateToStencil: (stencil: Stencil) => void;
  onNavigateToGame: () => void;
  onNavigateToSudoku: () => void;
}

function HomePage({ onNavigateToDrawing, onNavigateToStencil, onNavigateToGame, onNavigateToSudoku }: HomePageProps) {
  const [isExcited, setIsExcited] = useState(false);
  const [showStencils, setShowStencils] = useState(false);

  const handleStencilSelect = (stencil: Stencil) => {
    onNavigateToStencil(stencil);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary-100 via-primary-50 to-secondary-50">
      {/* Header */}
      <header className="pt-8 pb-4 px-4 text-center">
        <h1 className="text-4xl md:text-6xl font-bold text-primary-600 mb-2">
          🎨 Kids Drawing App
        </h1>
        <p className="text-xl md:text-2xl text-gray-700 font-medium">
          Draw, Create, and Have Fun!
        </p>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Welcome Card */}
        <div className="kid-card max-w-2xl mx-auto text-center mb-8">
          <div className="text-6xl mb-4">
            {isExcited ? '🎉' : '✨'}
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
            Welcome to Your Creative Space!
          </h2>
          <p className="text-lg text-gray-600 mb-6">
            A magical drawing app where you can create amazing artwork 
            with your fingers, explore AI-powered stencils, and save your masterpieces!
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              className="kid-button text-xl"
              onTouchStart={() => setIsExcited(true)}
              onClick={() => {
                setIsExcited(true);
                onNavigateToDrawing();
              }}
            >
              🖌️ Free Drawing!
            </button>
            
            <button 
              className="kid-button bg-purple-500 hover:bg-purple-600 active:bg-purple-700 text-xl"
              onClick={() => {
                setIsExcited(true);
                setShowStencils(!showStencils);
              }}
              onTouchStart={() => setIsExcited(true)}
            >
              🎭 Color Stencils!
            </button>
            
          <button 
            className="kid-button bg-secondary-500 hover:bg-secondary-600 active:bg-secondary-700 text-xl"
            onClick={() => setIsExcited(!isExcited)}
            onTouchStart={() => setIsExcited(true)}
          >
            {isExcited ? 'So Excited!' : 'Tell Me More!'}
          </button>

          <button 
            className="kid-button bg-green-500 hover:bg-green-600 active:bg-green-700 text-xl"
            onClick={() => onNavigateToGame()}
            onTouchStart={() => setIsExcited(true)}
          >
            🎮 Color Blocks Game
          </button>

          <button 
            className="kid-button bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-xl"
            onClick={() => onNavigateToSudoku()}
            onTouchStart={() => setIsExcited(true)}
          >
            🧩 Sudoku
          </button>
          </div>
        </div>

        {/* Stencil Gallery */}
        {showStencils && (
          <div className="mb-8">
            <StencilGallery onStencilSelect={handleStencilSelect} />
          </div>
        )}

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {/* Feature 1: Touch Drawing */}
          <div className="kid-card text-center">
            <div className="text-4xl mb-4">👆</div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Touch & Draw</h3>
            <p className="text-gray-600">
              Draw with your finger or stylus. Perfect for tablets and phones!
            </p>
          </div>

          {/* Feature 2: Colors */}
          <div className="kid-card text-center">
            <div className="text-4xl mb-4">🌈</div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Bright Colors</h3>
            <p className="text-gray-600">
              Choose from lots of beautiful colors to make your art pop!
            </p>
          </div>

          {/* Feature 3: Save Art */}
          <div className="kid-card text-center">
            <div className="text-4xl mb-4">💾</div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Save Your Art</h3>
            <p className="text-gray-600">
              Keep all your drawings safe and show them to family and friends!
            </p>
          </div>
        </div>

        {/* Coming Soon Section */}
        <div className="mt-12 text-center">
          <h3 className="text-2xl font-bold text-gray-700 mb-6">Coming Soon</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
            <div className="bg-white/50 rounded-2xl p-4 border-2 border-dashed border-primary-300">
              <div className="text-2xl mb-2">🤖</div>
              <p className="text-sm font-medium text-gray-600">AI Stencils</p>
            </div>
            <div className="bg-white/50 rounded-2xl p-4 border-2 border-dashed border-primary-300">
              <div className="text-2xl mb-2">🖌️</div>
              <p className="text-sm font-medium text-gray-600">More Brushes</p>
            </div>
            <div className="bg-white/50 rounded-2xl p-4 border-2 border-dashed border-primary-300">
              <div className="text-2xl mb-2">📱</div>
              <p className="text-sm font-medium text-gray-600">Mobile App</p>
            </div>
            <div className="bg-white/50 rounded-2xl p-4 border-2 border-dashed border-primary-300">
              <div className="text-2xl mb-2">☁️</div>
              <p className="text-sm font-medium text-gray-600">Cloud Save</p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-12 pb-8 text-center text-gray-500">
        <p className="text-sm">
          Made with ❤️ for creative kids everywhere
        </p>
        <p className="text-xs mt-2">
          v0.1.6 - Enhanced High-Quality Stencils!
        </p>
      </footer>
    </div>
  );
}

export default HomePage;
