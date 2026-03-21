import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface ThemeToggleProps {
    className?: string;
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({ className }) => {
    const { theme, toggleTheme } = useTheme();

    return (
        <button
            onClick={toggleTheme}
            className={className || "w-10 h-10 rounded-full bg-white/5 backdrop-blur-xl border border-white/10 hover:border-indigo-500/30 transition-all duration-300 group shadow-2xl active:scale-90 flex items-center justify-center"}
            aria-label="Toggle theme"
        >
            {theme === 'light' ? (
                <Moon className="w-4 h-4 text-indigo-600" />
            ) : (
                <Sun className="w-4 h-4 text-amber-400" />
            )}
        </button>
    );
};

export default ThemeToggle;
