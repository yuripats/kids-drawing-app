import { useState } from 'react';
import HomePage from './components/HomePage';
import DrawingPage from './components/DrawingPage';

type AppPage = 'home' | 'draw';

function App() {
  const [currentPage, setCurrentPage] = useState<AppPage>('home');

  const navigateTo = (page: AppPage) => {
    setCurrentPage(page);
  };

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage onNavigateToDrawing={() => navigateTo('draw')} />;
      case 'draw':
        return <DrawingPage onNavigateHome={() => navigateTo('home')} />;
      default:
        return <HomePage onNavigateToDrawing={() => navigateTo('draw')} />;
    }
  };

  return (
    <div>
      {renderCurrentPage()}
    </div>
  );
}

export default App;