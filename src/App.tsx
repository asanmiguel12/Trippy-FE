import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { BackendWarmupProvider, useBackendWarmup } from './contexts/BackendWarmupContext';
import { setWarmupHandlers } from './services/api';
import BackendWarmupScreen from './components/BackendWarmupScreen';
import HomePage from './components/HomePage';
import PlanPage from './components/PlanPage';
import './index.css';

function AppContent() {
  const { isWarmingUp, checkCount, showWarmup, hideWarmup, incrementCheckCount } = useBackendWarmup();
  const location = useLocation();
  const isPlanPage = location.pathname === '/plan';

  useEffect(() => {
    setWarmupHandlers({
      showWarmup,
      hideWarmup,
      incrementCheckCount,
    });
  }, [showWarmup, hideWarmup, incrementCheckCount]);

  return (
    <>
      {isWarmingUp && isPlanPage && <BackendWarmupScreen checkCount={checkCount} />}
      <div className="App">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/plan" element={<PlanPage />} />
        </Routes>
      </div>
    </>
  );
}

function App() {
  return (
    <BackendWarmupProvider>
      <Router>
        <AppContent />
      </Router>
    </BackendWarmupProvider>
  );
}

export default App;
