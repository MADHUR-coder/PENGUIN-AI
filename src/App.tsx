import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
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
import RewardVisualizer from './components/RewardVisualizer';

const PageTransition = ({ children }: { children: React.ReactNode }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.98 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 1.02 }}
    transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
    style={{ minHeight: '100vh', width: '100%' }}
  >
    {children}
  </motion.div>
);

function AppRoutes() {
  const { state } = useApp();
  const location = useLocation();

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
        <motion.div
          animate={{ scale: [1, 1.1, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="sync-spinner"
          style={{ width: 48, height: 48, marginBottom: 24 }}
        />
        <span style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'var(--font-lg)',
          fontWeight: 600,
          letterSpacing: '0.05em'
        }}>
          PENQ IS WAKING UP
        </span>
      </div>
    );
  }

  return (
    <>
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route
            path="/"
            element={
              <PageTransition>
                {!state.user.onboardingDone ? (
                  <Onboarding />
                ) : !state.calibrationDone ? (
                  <Navigate to="/quiz" replace />
                ) : !state.user.language ? (
                  <Navigate to="/language-select" replace />
                ) : (
                  <Navigate to="/dashboard" replace />
                )
                }
              </PageTransition>
            }
          />
          <Route path="/quiz" element={<PageTransition><Quiz /></PageTransition>} />
          <Route path="/language-select" element={<PageTransition><LanguageSelect /></PageTransition>} />
          <Route path="/dashboard" element={<PageTransition><Dashboard /></PageTransition>} />
          <Route path="/module/:id" element={<PageTransition><Module /></PageTransition>} />
          <Route path="/paths" element={<PageTransition><Paths /></PageTransition>} />
          <Route path="/labs" element={<PageTransition><Labs /></PageTransition>} />
          <Route path="/lab/:id" element={<PageTransition><LabSpace /></PageTransition>} />
          <Route path="/leaderboard" element={<PageTransition><Leaderboard /></PageTransition>} />
          <Route path="/focus" element={<PageTransition><FocusRoom /></PageTransition>} />
          <Route path="/settings" element={<PageTransition><Settings /></PageTransition>} />
          <Route path="/path-quiz/:language/:level" element={<PageTransition><PathQuiz /></PageTransition>} />
        </Routes>
      </AnimatePresence>
      <RewardVisualizer />
    </>
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
