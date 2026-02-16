import { useState, useEffect } from 'react';
import './App.css';
import InterviewDashboard from './components/InterviewDashboard';
import Auth from './components/Auth';
import InterviewInstructions from './components/InterviewInstructions';
import type { User } from './services/authService';
import { Sun, Moon } from 'lucide-react';

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasSeenInstructions, setHasSeenInstructions] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem('theme') as 'light' | 'dark') || 'dark';
    }
    return 'dark';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  // Disable session restore to force Login/Signup on start as requested
  /*
  useEffect(() => {
    const restoreSession = async () => {
      try {
        const token = authService.getToken();
        if (token) {
          const userData = await authService.getMe();
          setUser(userData);
        }
      } catch (err) {
        console.error('Failed to restore session:', err);
      } finally {
        setLoading(false);
      }
    };

    restoreSession();
  }, []);
  */

  // Manual loading state reset since restore is disabled
  useEffect(() => {
    setLoading(false);
  }, []);

  const ThemeToggle = () => (
    <button
      onClick={toggleTheme}
      className="fixed top-6 right-6 z-[100] w-10 h-10 rounded-full bg-white/5 backdrop-blur-xl border border-white/10 hover:border-indigo-500/30 transition-all duration-300 group shadow-2xl active:scale-90 flex items-center justify-center"
      aria-label="Toggle theme"
    >
      {theme === 'light' ? (
        <Moon className="w-4 h-4 text-indigo-600" />
      ) : (
        <Sun className="w-4 h-4 text-amber-400" />
      )}
    </button>
  );

  if (loading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-[var(--bg-primary)]">
        <div className="w-12 h-12 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="App">
      <ThemeToggle />
      {!user ? (
        <Auth onSuccess={(userData) => setUser(userData)} />
      ) : !hasSeenInstructions ? (
        <InterviewInstructions onComplete={() => setHasSeenInstructions(true)} />
      ) : (
        <InterviewDashboard />
      )}
    </div>
  );
}

export default App;
