import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import Onboarding from './pages/Onboarding';
import Quiz from './pages/Quiz';
import Dashboard from './pages/Dashboard';
import Module from './pages/Module';
import Settings from './pages/Settings';
import LanguageSelect from './pages/LanguageSelect';
import Leaderboard from './pages/Leaderboard';
import Labs from './pages/Labs';
import LabSpace from './pages/LabSpace';
import Paths from './pages/Paths';
import FocusRoom from './pages/FocusRoom';
import PathQuiz from './pages/PathQuiz';

function AppRoutes() {
  const { state } = useApp();

  if (state.loading) {
    return (
      <div style={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--bg-primary)',
        color: 'var(--cyan)'
      }}>
        <div className="sync-spinner" style={{ width: 40, height: 40, marginBottom: 20 }} />
        <span style={{ fontSize: 'var(--font-lg)', fontWeight: 600 }}>Penq is waking up... 🐧</span>
      </div>
    );
  }

  return (
    <Routes>
      <Route
        path="/"
        element={
          !state.user.onboardingDone ? (
            <Onboarding />
          ) : !state.calibrationDone ? (
            <Navigate to="/quiz" replace />
          ) : !state.user.language ? (
            <Navigate to="/language-select" replace />
          ) : (
            <Navigate to="/dashboard" replace />
          )
        }
      />
      <Route path="/quiz" element={<Quiz />} />
      <Route path="/language-select" element={<LanguageSelect />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/module/:id" element={<Module />} />
      {/* Placeholder routes for sidebar nav */}
      <Route path="/paths" element={<Paths />} />
      <Route path="/labs" element={<Labs />} />
      <Route path="/lab/:id" element={<LabSpace />} />
      <Route path="/leaderboard" element={<Leaderboard />} />
      <Route path="/focus" element={<FocusRoom />} />
      <Route path="/settings" element={<Settings />} />
      <Route path="/path-quiz/:language/:level" element={<PathQuiz />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <AppRoutes />
      </AppProvider>
    </BrowserRouter>
  );
}
