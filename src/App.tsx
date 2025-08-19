import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './components/HomePage';
import DrawingPage from './components/DrawingPage';

function App() {
  return (
    <Router basename="/kids-drawing-app">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/draw" element={<DrawingPage />} />
      </Routes>
    </Router>
  );
}

export default App;