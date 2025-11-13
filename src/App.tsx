import { useState } from 'react';
import HomePage from './components/HomePage';
import DrawingPage from './components/DrawingPage';
import ColorBlocksPage from './components/Games/ColorBlocksGame/ColorBlocksPage';
import { Stencil } from './types/Stencil';
import SudokuPage from './components/Games/Sudoku/SudokuPage';
import TetrisPage from './components/Games/Tetris/TetrisPage';
import JellyVolleyballPage from './components/Games/JellyVolleyball/JellyVolleyballPage';
import SnakePage from './components/Games/Snake/SnakePage';
import MemoryMatchPage from './components/Games/MemoryMatch/MemoryMatchPage';
import DrawingChallengePage from './components/Games/DrawingChallenge/DrawingChallengePage';
import PopBalloonsPage from './components/Games/PopBalloons/PopBalloonsPage';
import SimonSaysPage from './components/Games/SimonSays/SimonSaysPage';
import BubblePopPage from './components/Games/BubblePop/BubblePopPage';
import ColorMixerPage from './components/Games/ColorMixer/ColorMixerPage';
import MathFactsPage from './components/Games/MathFacts/MathFactsPage';
import ShapeSortingPage from './components/Games/ShapeSorting/ShapeSortingPage';
import FlappyBirdPage from './components/Games/FlappyBird/FlappyBirdPage';
import BreakoutPage from './components/Games/Breakout/BreakoutPage';
import PacManPage from './components/Games/PacMan/PacManPage';
import SpaceInvadersPage from './components/Games/SpaceInvaders/SpaceInvadersPage';

type AppPage = 'home' | 'draw' | 'stencil' | 'colorblocks' | 'sudoku' | 'tetris' | 'jellyvolleyball' | 'snake' | 'memoryMatch' | 'drawingChallenge' | 'popBalloons' | 'simonSays' | 'bubblePop' | 'colorMixer' | 'mathFacts' | 'shapeSorting' | 'flappyBird' | 'breakout' | 'pacman' | 'spaceInvaders';

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
            onNavigateToColorBlocks={() => navigateTo('colorblocks')}
            onNavigateToSudoku={() => navigateTo('sudoku')}
            onNavigateToTetris={() => navigateTo('tetris')}
            onNavigateToJellyVolleyball={() => navigateTo('jellyvolleyball')}
            onNavigateToSnake={() => navigateTo('snake')}
            onNavigateToMemoryMatch={() => navigateTo('memoryMatch')}
            onNavigateToDrawingChallenge={() => navigateTo('drawingChallenge')}
            onNavigateToPopBalloons={() => navigateTo('popBalloons')}
            onNavigateToSimonSays={() => navigateTo('simonSays')}
            onNavigateToBubblePop={() => navigateTo('bubblePop')}
            onNavigateToColorMixer={() => navigateTo('colorMixer')}
            onNavigateToMathFacts={() => navigateTo('mathFacts')}
            onNavigateToShapeSorting={() => navigateTo('shapeSorting')}
            onNavigateToFlappyBird={() => navigateTo('flappyBird')}
            onNavigateToBreakout={() => navigateTo('breakout')}
            onNavigateToPacMan={() => navigateTo('pacman')}
            onNavigateToSpaceInvaders={() => navigateTo('spaceInvaders')}
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
      case 'colorblocks':
        return <ColorBlocksPage onNavigateHome={() => navigateTo('home')} />;
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
      case 'memoryMatch':
        return (
          <MemoryMatchPage onNavigateHome={() => navigateTo('home')} />
        );
      case 'drawingChallenge':
        return (
          <DrawingChallengePage onNavigateHome={() => navigateTo('home')} />
        );
      case 'popBalloons':
        return (
          <PopBalloonsPage onNavigateHome={() => navigateTo('home')} />
        );
      case 'simonSays':
        return (
          <SimonSaysPage onNavigateHome={() => navigateTo('home')} />
        );
      case 'bubblePop':
        return (
          <BubblePopPage onNavigateHome={() => navigateTo('home')} />
        );
      case 'colorMixer':
        return (
          <ColorMixerPage onNavigateHome={() => navigateTo('home')} />
        );
      case 'mathFacts':
        return (
          <MathFactsPage onNavigateHome={() => navigateTo('home')} />
        );
      case 'shapeSorting':
        return (
          <ShapeSortingPage onNavigateHome={() => navigateTo('home')} />
        );
      case 'flappyBird':
        return (
          <FlappyBirdPage onNavigateHome={() => navigateTo('home')} />
        );
      case 'breakout':
        return (
          <BreakoutPage onNavigateHome={() => navigateTo('home')} />
        );
      case 'pacman':
        return (
          <PacManPage onNavigateHome={() => navigateTo('home')} />
        );
      case 'spaceInvaders':
        return (
          <SpaceInvadersPage onNavigateHome={() => navigateTo('home')} />
        );
      default:
        return (
<HomePage
            onNavigateToDrawing={() => navigateTo('draw')}
            onNavigateToStencil={navigateToStencil}
            onNavigateToColorBlocks={() => navigateTo('colorblocks')}
            onNavigateToSudoku={() => navigateTo('sudoku')}
            onNavigateToTetris={() => navigateTo('tetris')}
            onNavigateToJellyVolleyball={() => navigateTo('jellyvolleyball')}
            onNavigateToSnake={() => navigateTo('snake')}
            onNavigateToMemoryMatch={() => navigateTo('memoryMatch')}
            onNavigateToDrawingChallenge={() => navigateTo('drawingChallenge')}
            onNavigateToPopBalloons={() => navigateTo('popBalloons')}
            onNavigateToSimonSays={() => navigateTo('simonSays')}
            onNavigateToBubblePop={() => navigateTo('bubblePop')}
            onNavigateToColorMixer={() => navigateTo('colorMixer')}
            onNavigateToMathFacts={() => navigateTo('mathFacts')}
            onNavigateToShapeSorting={() => navigateTo('shapeSorting')}
            onNavigateToFlappyBird={() => navigateTo('flappyBird')}
            onNavigateToBreakout={() => navigateTo('breakout')}
            onNavigateToPacMan={() => navigateTo('pacman')}
            onNavigateToSpaceInvaders={() => navigateTo('spaceInvaders')}
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
