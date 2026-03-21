import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useOutletContext } from 'react-router-dom';
import { ChevronRight, SkipForward, Send, ShieldCheck } from 'lucide-react';
import SubmissionModal from './SubmissionModal';
import { useSession } from '../hooks/useSession';

const QuestionPage = () => {
    const { domain } = useParams();
    const navigate = useNavigate();
    const { 
        user, 
        currentQuestion, 
        currentQuestionIndex, 
        fetchQuestion, 
        submitAnswer, 
        endSession, 
        isLoading, 
        error,
        isCompleted 
    } = useOutletContext();
    const [answer, setAnswer] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);

    const totalQuestions = 5; // Matches backend session_manager.TOTAL_QUESTIONS

    const handleNext = async () => {
        if (answer.trim()) {
            try {
                const response = await submitAnswer(answer);
                setAnswer('');
                
                // If backend indicates session is completed or next question is fetchable
                if (response?.status === 'completed' || response?.status === 'terminated') {
                    setIsModalOpen(true);
                }
            } catch (err) {
                 console.error('Failed to submit answer:', err);
            }
        } else {
             alert('Please type a response before proceeding.');
        }
    };

    const handleSkip = async () => {
         try {
             const response = await submitAnswer("[Candidate skipped question]");
             setAnswer('');
             if (response?.status === 'completed' || response?.status === 'terminated') {
                 setIsModalOpen(true);
             }
         } catch (err) {
              console.error(err);
         }
    };

    const handleFinish = () => {
        endSession();
        navigate('/');
    };

    const questionText = currentQuestion?.text || 'Loading next question allocation...';

    if (isCompleted) {
         return (
             <div className="flex-1 flex flex-col items-center justify-center p-6 text-center animate-fade-in relative z-10">
                  <div className="w-20 h-20 rounded-full bg-green-500/10 flex items-center justify-center mb-6">
                       <svg className="w-10 h-10 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                       </svg>
                  </div>
                  <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-2">Assessment Completed ✅</h1>
                  <p className="text-sm text-[var(--text-secondary)] mb-8">Thank you for submitting your responses. Your session has finished.</p>
                  <button onClick={handleFinish} className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl transition-all">
                       Submit & Exit
                  </button>
             </div>
         )
    }

    if (isLoading && !currentQuestion) {
         return (
             <div className="flex-1 flex flex-col items-center justify-center">
                  <div className="w-12 h-12 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
                  <p className="mt-4 text-sm text-[var(--text-secondary)]">Fetching assessment data...</p>
             </div>
         )
    }

    if (error) {
         return (
             <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
                  <p className="text-red-500 text-sm mb-4">Error: {error}</p>
                  <button onClick={() => fetchQuestion()} className="px-4 py-2 bg-indigo-600 rounded-lg text-white">Retry Fetch</button>
             </div>
         )
    }


    return (
        <div className="flex-1 flex flex-col items-center justify-center animate-fade-in relative z-10 px-6">
            <SubmissionModal isOpen={isModalOpen} onConfirm={handleFinish} />

            <div className="w-full max-w-2xl">
                {/* Simplified Header Indicator */}
                <div className="mb-10 flex flex-col items-center text-center">

                    <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-semibold text-[var(--text-primary)] tracking-tight">{currentQuestionIndex}</span>
                        <span className="text-[var(--text-secondary)] text-base font-medium">/ {totalQuestions}</span>
                    </div>
                </div>

                {/* Refined Question Card */}
                <div
                    key={currentQuestion?.questionId || 'question-card'}
                    className="w-full p-10 md:p-12 bg-[var(--bg-secondary)] border border-[var(--glass-border)] rounded-[1.5rem] shadow-2xl flex flex-col relative overflow-hidden"
                >
                    <div className="mb-10 relative">
                        <p className="text-lg md:text-xl font-medium text-[var(--text-primary)] leading-relaxed tracking-tight">
                            {questionText}
                        </p>
                    </div>

                    <div className="relative">
                        <textarea
                            value={answer}
                            onChange={(e) => setAnswer(e.target.value)}
                            placeholder="Type your response here..."
                            className="w-full h-44 bg-[var(--bg-primary)]/50 text-[var(--text-primary)] border border-[var(--glass-border)] rounded-xl py-4 px-5 text-[15px] font-normal placeholder:text-[var(--text-muted)] outline-none focus:border-indigo-500/30 transition-all resize-none leading-relaxed"
                        />
                    </div>

                    {/* Footer Controls */}
                    <div className="mt-10 flex items-center justify-between">
                        <button
                            onClick={handleSkip}
                            className="px-4 py-2 rounded-lg text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-all text-[11px] font-bold uppercase tracking-widest flex items-center gap-2 group"
                        >
                            Skip Phase
                            <SkipForward size={14} className="opacity-40 group-hover:opacity-100 transition-all" />
                        </button>

                        <button
                            onClick={handleNext}
                            className="px-8 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold transition-all duration-300 text-[11px] uppercase tracking-widest flex items-center gap-2 shadow-lg shadow-indigo-600/20 active:scale-95"
                        >
                            {currentQuestionIndex === totalQuestions ? 'Finalize' : 'Next Question'}
                            {currentQuestionIndex === totalQuestions ? <Send size={14} /> : <ChevronRight size={14} />}
                        </button>
                    </div>
                </div>


            </div>
        </div>
    );
};

export default QuestionPage;
