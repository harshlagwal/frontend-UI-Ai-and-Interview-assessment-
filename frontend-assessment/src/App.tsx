import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import './App.css';
import InterviewDashboard from './components/InterviewDashboard';
import Auth from './components/Auth';
import InterviewInstructions from './components/InterviewInstructions';
import type { User } from './services/authService';

// Assessment Imports
import DomainSelection from './assessment/DomainSelection';
import QuestionPage from './assessment/QuestionPage';
import { LoadingProvider } from './context/LoadingContext';
import { ThemeProvider } from './context/ThemeContext';
import GlobalLoader from './components/GlobalLoader';
import ThemeToggle from './components/ThemeToggle';

function AppContent() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasSeenInstructions, setHasSeenInstructions] = useState(false);
  const location = useLocation();
  const isAssessmentRoute = location.pathname.includes('/assessment');

  useEffect(() => {
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-[var(--bg-primary)]">
        <div className="w-12 h-12 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="App">
      <GlobalLoader />
      {!isAssessmentRoute && <ThemeToggle className="fixed top-6 right-6 z-[70] w-10 h-10 rounded-full bg-white/5 backdrop-blur-xl border border-white/10 hover:border-indigo-500/30 transition-all duration-300 group shadow-2xl active:scale-90 flex items-center justify-center" />}
      <Routes>
        {/* Auth & Instructions Flow */}
        <Route
          path="/"
          element={
            !user ? (
              <Auth onSuccess={(userData) => setUser(userData)} />
            ) : !hasSeenInstructions ? (
              <InterviewInstructions onComplete={() => setHasSeenInstructions(true)} />
            ) : (
              <Navigate to="/assessment/domain" replace />
            )
          }
        />

        {/* Protected Assessment Flow */}
        <Route
          path="/"
          element={user && hasSeenInstructions ? <InterviewDashboard user={user} /> : <Navigate to="/" replace />}
        >
          {/* Nested Assessment Module Routes */}
          <Route path="assessment">
            <Route index element={<Navigate to="domain" replace />} />
            <Route path="domain" element={<DomainSelection />} />
            <Route path="question/:domain/:id" element={<QuestionPage />} />
          </Route>
        </Route>

        {/* Catch-all redirect */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <LoadingProvider>
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </LoadingProvider>
    </ThemeProvider>
  );
}

export default App;
