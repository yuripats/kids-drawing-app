import { useState } from 'react';
import HomePage from './components/HomePage';
import DrawingPage from './components/DrawingPage';
import { Stencil } from './types/Stencil';

type AppPage = 'home' | 'draw' | 'stencil';

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
      default:
        return (
          <HomePage 
            onNavigateToDrawing={() => navigateTo('draw')} 
            onNavigateToStencil={navigateToStencil}
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