import React from 'react';
import { CheckCircle2, ArrowRight } from 'lucide-react';
import { useLoading } from '../context/LoadingContext';

const SubmissionModal = ({ isOpen, onConfirm }) => {
    const { showLoader, hideLoader } = useLoading();

    if (!isOpen) return null;

    const handleConfirm = () => {
        showLoader();
        setTimeout(() => {
            hideLoader();
            onConfirm();
        }, 1500);
    };

    return (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-6 animate-in fade-in duration-500">
            {/* Ultra-deep Backdrop */}
            <div className="absolute inset-0 bg-[var(--bg-primary)]/90 backdrop-blur-2xl" />

            {/* Premium Modal Card */}
            <div className="relative w-full max-w-md p-14 rounded-[3rem] bg-[var(--bg-secondary)]/80 backdrop-blur-3xl border border-[var(--glass-border)] shadow-[0_50px_100px_rgba(0,0,0,0.8)] text-center animate-in fade-in zoom-in-95 slide-in-from-bottom-12 duration-700 delay-100">
                <div className="w-20 h-20 rounded-[2rem] bg-indigo-500/10 flex items-center justify-center text-indigo-400 mx-auto mb-10 shadow-inner border border-indigo-500/20">
                    <CheckCircle2 size={40} strokeWidth={1.5} className="animate-in zoom-in duration-1000 delay-300" />
                </div>

                <h2 className="text-3xl font-semibold text-[var(--text-primary)] mb-4 tracking-tighter">
                    Success!
                </h2>
                <p className="text-[var(--text-secondary)] text-[15px] leading-relaxed mb-12 px-2 font-normal">
                    Your assessment results have been securely archived and transmitted to the evaluation center.
                </p>

                <button
                    onClick={handleConfirm}
                    className="w-full py-5 bg-[#1a1a1c] hover:bg-indigo-600 text-white font-medium rounded-2xl transition-all duration-300 shadow-2xl flex items-center justify-center gap-3 text-[13px] border border-white/5 group active:scale-95"
                >
                    Finalize & Exit
                    <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </button>
            </div>
        </div>
    );
};

export default SubmissionModal;
