import { useState } from 'react';
import HomePage from './components/HomePage';
import DrawingPage from './components/DrawingPage';
import GameBoard from './components/Games/ColorBlocksGame/GameBoard';
import { Stencil } from './types/Stencil';
import SudokuPage from './components/Games/Sudoku/SudokuPage';
import TetrisPage from './components/Games/Tetris/TetrisPage';
import JellyVolleyballPage from './components/Games/JellyVolleyball/JellyVolleyballPage';
import SnakePage from './components/Games/Snake/SnakePage';

type AppPage = 'home' | 'draw' | 'stencil' | 'game' | 'sudoku' | 'tetris' | 'jellyvolleyball' | 'snake';

function App() {
  const [currentPage, setCurrentPage] = useState<AppPage>('home');
  const [selectedStencil, setSelectedStencil] = useState<Stencil | null>(null);

  const navigateTo = (page: AppPage) => {
    setCurrentPage(page);
  };

  const navigateToStencil = (stencil: Stencil) => {
    setSelectedStencil(stencil);
    setCurrentPage('stencil');
  };

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'home':
        return (
<HomePage
            onNavigateToDrawing={() => navigateTo('draw')}
            onNavigateToStencil={navigateToStencil}
            onNavigateToGame={() => navigateTo('game')}
            onNavigateToSudoku={() => navigateTo('sudoku')}
            onNavigateToTetris={() => navigateTo('tetris')}
            onNavigateToJellyVolleyball={() => navigateTo('jellyvolleyball')}
            onNavigateToSnake={() => navigateTo('snake')}
          />
        );
      case 'draw':
        return <DrawingPage onNavigateHome={() => navigateTo('home')} />;
      case 'stencil':
        return (
          <DrawingPage 
            onNavigateHome={() => navigateTo('home')} 
            stencil={selectedStencil}
          />
        );
      case 'game':
        return (
          <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Color Blocks Game</h1>
            <GameBoard config={{ gridWidth: 6, gridHeight: 7, initialColors: 4 }} />
            <button
              className="kid-button mt-4"
              onClick={() => navigateTo('home')}
            >
              ← Back to Home
            </button>
          </div>
        );
case 'sudoku':
        return (
          <SudokuPage onNavigateHome={() => navigateTo('home')} />
        );
      case 'tetris':
        return (
          <TetrisPage onNavigateHome={() => navigateTo('home')} />
        );
      case 'jellyvolleyball':
        return (
          <JellyVolleyballPage onNavigateHome={() => navigateTo('home')} />
        );
      case 'snake':
        return (
          <SnakePage onNavigateHome={() => navigateTo('home')} />
        );
      default:
        return (
<HomePage
            onNavigateToDrawing={() => navigateTo('draw')}
            onNavigateToStencil={navigateToStencil}
            onNavigateToGame={() => navigateTo('game')}
            onNavigateToSudoku={() => navigateTo('sudoku')}
            onNavigateToTetris={() => navigateTo('tetris')}
            onNavigateToJellyVolleyball={() => navigateTo('jellyvolleyball')}
            onNavigateToSnake={() => navigateTo('snake')}
          />
        );
    }
  };

  return (
    <div>
      {renderCurrentPage()}
    </div>
  );
}

export default App;
