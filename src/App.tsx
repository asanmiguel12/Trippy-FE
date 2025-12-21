import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import { BackendWarmupProvider, useBackendWarmup } from './contexts/BackendWarmupContext';
import { setWarmupHandlers } from './services/api';
import BackendWarmupScreen from './components/BackendWarmupScreen';
import HomePage from './components/HomePage';
import PlanPage from './components/PlanPage';
import './index.css';

function AppContent() {
  const { isWarmingUp, checkCount, showWarmup, hideWarmup, incrementCheckCount } = useBackendWarmup();

  useEffect(() => {
    setWarmupHandlers({
      showWarmup,
      hideWarmup,
      incrementCheckCount,
    });
  }, [showWarmup, hideWarmup, incrementCheckCount]);

  return (
    <>
      {isWarmingUp && <BackendWarmupScreen checkCount={checkCount} />}
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/plan" element={<PlanPage />} />
          </Routes>
        </div>
      </Router>
    </>
  );
}

function App() {
  return (
    <BackendWarmupProvider>
      <AppContent />
    </BackendWarmupProvider>
  );
}

export default App;
