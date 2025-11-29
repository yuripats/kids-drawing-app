import { useState } from 'react';
import StencilGallery from './Stencils/StencilGallery';
import { Stencil } from '../types/Stencil';

interface HomePageProps {
  onNavigateToDrawing: () => void;
  onNavigateToStencil: (stencil: Stencil) => void;
  onNavigateToColorBlocks: () => void;
  onNavigateToSudoku: () => void;
  onNavigateToTetris: () => void;
  onNavigateToJellyVolleyball: () => void;
  onNavigateToSnake: () => void;
  onNavigateToMemoryMatch: () => void;
  onNavigateToDrawingChallenge: () => void;
  onNavigateToPopBalloons: () => void;
  onNavigateToSimonSays: () => void;
  onNavigateToBubblePop: () => void;
  onNavigateToColorMixer: () => void;
  onNavigateToMathFacts: () => void;
  onNavigateToShapeSorting: () => void;
  onNavigateToDotPath: () => void;
}

function HomePage({ onNavigateToDrawing, onNavigateToStencil, onNavigateToColorBlocks, onNavigateToSudoku, onNavigateToTetris, onNavigateToJellyVolleyball, onNavigateToSnake, onNavigateToMemoryMatch, onNavigateToDrawingChallenge, onNavigateToPopBalloons, onNavigateToSimonSays, onNavigateToBubblePop, onNavigateToColorMixer, onNavigateToMathFacts, onNavigateToShapeSorting, onNavigateToDotPath }: HomePageProps) {
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
          </div>
        </div>

        {/* Games Section */}
        <div className="kid-card max-w-6xl mx-auto mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4 text-center">
            🎮 Fun Games to Play!
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {/* Color Blocks Game */}
            <button
              className="kid-card bg-green-500 hover:bg-green-600 active:bg-green-700 transition-colors duration-200 p-6 text-center cursor-pointer border-2 border-transparent hover:border-green-700"
              onClick={() => onNavigateToColorBlocks()}
              onTouchStart={() => setIsExcited(true)}
            >
              <div className="text-5xl mb-2">🎨</div>
              <div className="text-white font-bold text-lg">Color Blocks</div>
            </button>

            {/* Sudoku */}
            <button
              className="kid-card bg-blue-500 hover:bg-blue-600 active:bg-blue-700 transition-colors duration-200 p-6 text-center cursor-pointer border-2 border-transparent hover:border-blue-700"
              onClick={() => onNavigateToSudoku()}
              onTouchStart={() => setIsExcited(true)}
            >
              <div className="text-5xl mb-2">🧩</div>
              <div className="text-white font-bold text-lg">Sudoku</div>
            </button>

            {/* Tetris */}
            <button
              className="kid-card bg-orange-500 hover:bg-orange-600 active:bg-orange-700 transition-colors duration-200 p-6 text-center cursor-pointer border-2 border-transparent hover:border-orange-700"
              onClick={() => onNavigateToTetris()}
              onTouchStart={() => setIsExcited(true)}
            >
              <div className="text-5xl mb-2">🧱</div>
              <div className="text-white font-bold text-lg">Tetris</div>
            </button>

            {/* Jelly Volleyball */}
            <button
              className="kid-card bg-teal-500 hover:bg-teal-600 active:bg-teal-700 transition-colors duration-200 p-6 text-center cursor-pointer border-2 border-transparent hover:border-teal-700"
              onClick={() => onNavigateToJellyVolleyball()}
              onTouchStart={() => setIsExcited(true)}
            >
              <div className="text-5xl mb-2">🏐</div>
              <div className="text-white font-bold text-lg">Jelly Volleyball</div>
            </button>

            {/* Snake Game */}
            <button
              className="kid-card bg-lime-500 hover:bg-lime-600 active:bg-lime-700 transition-colors duration-200 p-6 text-center cursor-pointer border-2 border-transparent hover:border-lime-700"
              onClick={() => onNavigateToSnake()}
              onTouchStart={() => setIsExcited(true)}
            >
              <div className="text-5xl mb-2">🐍</div>
              <div className="text-white font-bold text-lg">Snake</div>
            </button>

            {/* Memory Match - NEW! */}
            <button
              className="kid-card bg-pink-500 hover:bg-pink-600 active:bg-pink-700 transition-colors duration-200 p-6 text-center cursor-pointer border-2 border-transparent hover:border-pink-700"
              onClick={() => onNavigateToMemoryMatch()}
              onTouchStart={() => setIsExcited(true)}
            >
              <div className="text-5xl mb-2">🃏</div>
              <div className="text-white font-bold text-lg">Memory Match</div>
            </button>

            {/* Drawing Challenge - NEW! */}
            <button
              className="kid-card bg-purple-500 hover:bg-purple-600 active:bg-purple-700 transition-colors duration-200 p-6 text-center cursor-pointer border-2 border-transparent hover:border-purple-700"
              onClick={() => onNavigateToDrawingChallenge()}
              onTouchStart={() => setIsExcited(true)}
            >
              <div className="text-5xl mb-2">🎨</div>
              <div className="text-white font-bold text-lg">Drawing Challenge</div>
            </button>

            {/* Pop the Balloons - NEW! */}
            <button
              className="kid-card bg-yellow-500 hover:bg-yellow-600 active:bg-yellow-700 transition-colors duration-200 p-6 text-center cursor-pointer border-2 border-transparent hover:border-yellow-700"
              onClick={() => onNavigateToPopBalloons()}
              onTouchStart={() => setIsExcited(true)}
            >
              <div className="text-5xl mb-2">🎯</div>
              <div className="text-white font-bold text-lg">Pop Balloons</div>
            </button>

            {/* Simon Says - NEW! */}
            <button
              className="kid-card bg-indigo-500 hover:bg-indigo-600 active:bg-indigo-700 transition-colors duration-200 p-6 text-center cursor-pointer border-2 border-transparent hover:border-indigo-700"
              onClick={() => onNavigateToSimonSays()}
              onTouchStart={() => setIsExcited(true)}
            >
              <div className="text-5xl mb-2">🎵</div>
              <div className="text-white font-bold text-lg">Simon Says</div>
            </button>

            {/* Bubble Pop - NEW! */}
            <button
              className="kid-card bg-cyan-500 hover:bg-cyan-600 active:bg-cyan-700 transition-colors duration-200 p-6 text-center cursor-pointer border-2 border-transparent hover:border-cyan-700"
              onClick={() => onNavigateToBubblePop()}
              onTouchStart={() => setIsExcited(true)}
            >
              <div className="text-5xl mb-2">🫧</div>
              <div className="text-white font-bold text-lg">Bubble Pop</div>
            </button>

            {/* Color Mixer - NEW! */}
            <button
              className="kid-card bg-rose-500 hover:bg-rose-600 active:bg-rose-700 transition-colors duration-200 p-6 text-center cursor-pointer border-2 border-transparent hover:border-rose-700"
              onClick={() => onNavigateToColorMixer()}
              onTouchStart={() => setIsExcited(true)}
            >
              <div className="text-5xl mb-2">🎨</div>
              <div className="text-white font-bold text-lg">Color Mixer</div>
            </button>

            {/* Math Facts - NEW! */}
            <button
              className="kid-card bg-emerald-500 hover:bg-emerald-600 active:bg-emerald-700 transition-colors duration-200 p-6 text-center cursor-pointer border-2 border-transparent hover:border-emerald-700"
              onClick={() => onNavigateToMathFacts()}
              onTouchStart={() => setIsExcited(true)}
            >
              <div className="text-5xl mb-2">🔢</div>
              <div className="text-white font-bold text-lg">Math Facts</div>
            </button>

            {/* Shape Sorting - NEW! */}
            <button
              className="kid-card bg-amber-500 hover:bg-amber-600 active:bg-amber-700 transition-colors duration-200 p-6 text-center cursor-pointer border-2 border-transparent hover:border-amber-700"
              onClick={() => onNavigateToShapeSorting()}
              onTouchStart={() => setIsExcited(true)}
            >
              <div className="text-5xl mb-2">🎪</div>
              <div className="text-white font-bold text-lg">Shape Sorting</div>
            </button>

            {/* Dot Path - NEW! */}
            <button
              className="kid-card bg-violet-500 hover:bg-violet-600 active:bg-violet-700 transition-colors duration-200 p-6 text-center cursor-pointer border-2 border-transparent hover:border-violet-700"
              onClick={() => onNavigateToDotPath()}
              onTouchStart={() => setIsExcited(true)}
            >
              <div className="text-5xl mb-2">🎯</div>
              <div className="text-white font-bold text-lg">Dot Path</div>
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
        <p className="text-xs mt-1 font-mono text-gray-400">
          Build: {__COMMIT_HASH__}
        </p>
      </footer>
    </div>
  );
}

export default HomePage;
