import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import Timer from './Timer';
import { ShieldCheck } from 'lucide-react';
import ThemeToggle from '../components/ThemeToggle';

interface AssessmentLayoutProps {
    children: React.ReactNode;
}

const AssessmentLayout: React.FC<AssessmentLayoutProps> = ({ children }) => {
    const location = useLocation();
    const isQuestionPage = location.pathname.includes('/assessment/question');

    return (
        <div id="assessment-layout-root" className={`h-screen flex flex-col bg-[var(--bg-primary)] text-[var(--text-primary)] font-sans selection:bg-indigo-500/30 overflow-hidden`}>
            {/* Premium Header */}
            <header className="h-20 bg-[var(--header-bg)] backdrop-blur-3xl z-[60] flex items-center justify-between px-10 border-b border-[var(--border-primary)]">
                <Link to="/" className="flex items-center gap-3 group transition-all">
                    <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center shadow-2xl shadow-indigo-600/20 group-hover:scale-105 transition-all">
                        <ShieldCheck className="text-white w-6 h-6" />
                    </div>
                </Link>

                <div className="flex items-center gap-4">
                    {isQuestionPage && <Timer isActive={isQuestionPage} />}
                    <ThemeToggle className="w-10 h-10 rounded-full bg-white/5 backdrop-blur-xl border border-white/10 hover:border-indigo-500/30 transition-all duration-300 group shadow-2xl active:scale-90 flex items-center justify-center" />
                </div>
            </header>

            {/* Main Content Area */}
            <main className={`flex-1 flex flex-col relative ${location.pathname.includes('/assessment/domain') ? 'overflow-y-auto' : 'overflow-hidden'}`}>
                {/* Global Background Decorations */}
                <div className="fixed inset-0 pointer-events-none overflow-hidden h-screen w-screen">
                    <div className="absolute top-[20%] left-[-10%] w-[60%] h-[60%] bg-blue-900/[0.03] blur-[150px] rounded-full" />
                    <div className="absolute bottom-[20%] right-[-10%] w-[60%] h-[60%] bg-indigo-900/[0.03] blur-[150px] rounded-full" />
                </div>

                <div className="w-full max-w-6xl mx-auto flex-1 flex flex-col p-6 z-10 relative">
                    {children}
                </div>
            </main>
        </div>
    );
};

export default AssessmentLayout;
