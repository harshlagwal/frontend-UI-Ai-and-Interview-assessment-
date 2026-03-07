import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
    Outlet, useNavigate, useLocation
} from 'react-router-dom';
import {
    AlertCircle, ShieldAlert, AlertTriangle
} from 'lucide-react';
import Draggable from 'react-draggable';
import AssessmentLayout from '../assessment/AssessmentLayout';

/**
 * ProctoringPanel - Isolated component for better drag performance
 * Uses React.memo and individual refs to prevent dashboard-wide re-renders
 */
const ProctoringPanel = React.memo(({ stream, nodeRef }: { stream: MediaStream | null; nodeRef: React.RefObject<HTMLDivElement | null> }) => {
    const localVideoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        if (localVideoRef.current && stream) {
            localVideoRef.current.srcObject = stream;
        }
    }, [stream]);

    return (
        <Draggable
            nodeRef={nodeRef as React.RefObject<HTMLElement>}
            bounds="parent"
        >
            <div
                ref={nodeRef}
                className="fixed bottom-10 right-10 w-56 aspect-video bg-[var(--bg-secondary)] rounded-2xl overflow-hidden cursor-move border border-[var(--glass-border)] z-[200] group shadow-2xl transition-shadow duration-300 hover:shadow-indigo-500/10 active:scale-[0.98]"
            >
                <video ref={localVideoRef} autoPlay playsInline muted className="w-full h-full object-cover scale-x-[-1] pointer-events-none" />

                <div className="absolute top-3 left-3 flex items-center gap-2 px-2.5 py-1 rounded-full bg-black/60 border border-white/10 pointer-events-none">
                    <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                    <span className="text-[9px] font-bold uppercase tracking-wider text-white">Live Monitor</span>
                </div>
            </div>
        </Draggable>
    );
});

/**
 * Premium Interview Dashboard - Modern SaaS Style
 */
export default function InterviewDashboard() {
    const navigate = useNavigate();
    const location = useLocation();

    // Core State
    const [phase, setPhase] = useState<'loading' | 'live' | 'error'>('loading');
    const [isSecured, setIsSecured] = useState(false);
    const [proctoringWarnings, setProctoringWarnings] = useState(0);
    const [showWarningPopup, setShowWarningPopup] = useState({ show: false, message: '' });
    const [errorHeader, setErrorHeader] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [testFailed, setTestFailed] = useState(false);

    const isAssessmentActive = location.pathname.includes('/assessment');
    const isQuestionPage = location.pathname.includes('/assessment/question');

    // Refs
    const streamRef = useRef<MediaStream | null>(null);
    const screenStreamRef = useRef<MediaStream | null>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const draggableRef = useRef<HTMLDivElement>(null);
    const hasRequestedRef = useRef(false);
    const lastWarningTimeRef = useRef(0);

    // Media Management
    const stopTracks = useCallback(() => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
            streamRef.current = null;
        }
        if (screenStreamRef.current) {
            screenStreamRef.current.getTracks().forEach(track => track.stop());
            screenStreamRef.current = null;
        }
    }, []);

    const startInterview = useCallback(async () => {
        if (hasRequestedRef.current) return;
        hasRequestedRef.current = true;
        setPhase('loading');
        try {
            const mediaStream = await navigator.mediaDevices.getUserMedia({
                video: { width: { ideal: 1280 }, height: { ideal: 720 } },
                audio: true,
            });
            streamRef.current = mediaStream;
            setPhase('live');
        } catch (err: any) {
            hasRequestedRef.current = false;
            setPhase('error');
            setErrorHeader('Security Initialization Failed');
            setErrorMessage('Unable to access primary camera and microphone. Ensure permissions are granted for proctoring.');
        }
    }, []);

    useEffect(() => {
        startInterview();
        return () => stopTracks();
    }, [startInterview, stopTracks]);

    // UI Effects
    useEffect(() => {
        if (videoRef.current && streamRef.current && phase === 'live' && !isAssessmentActive) {
            videoRef.current.srcObject = streamRef.current;
        }
    }, [phase, isAssessmentActive]);

    const enterFullscreen = async () => {
        try {
            if (!document.fullscreenElement) {
                await document.documentElement.requestFullscreen();
            }
            setIsSecured(true);
            return true;
        } catch (err) {
            console.error("Fullscreen failed", err);
            setIsSecured(false);
            return false;
        }
    };

    const handleViolation = useCallback(async (msg: string, immediate: boolean = false) => {
        const now = Date.now();
        // Bypass throttle for immediate actions (like Escape key)
        if (!immediate && now - lastWarningTimeRef.current < 2000) return;
        lastWarningTimeRef.current = now;

        setProctoringWarnings(prev => {
            const newVal = prev + 1;
            if (newVal >= 5) {
                setTestFailed(true);
                stopTracks();
                setTimeout(() => navigate('/'), 4000);
            }
            return newVal;
        });

        setShowWarningPopup({ show: true, message: msg });
        setIsSecured(false); // Force re-authorization gate

        if (immediate) {
            // Attempt a best-effort sync restoration
            document.documentElement.requestFullscreen().catch(() => { });
        }
    }, [navigate, stopTracks]);

    // Security Listeners
    useEffect(() => {
        if (!isAssessmentActive || phase !== 'live' || testFailed) return;

        const handleBlur = () => handleViolation('Environment focus lost. Unauthorized background activity detected.');
        const handleFullscreenChange = () => {
            if (!document.fullscreenElement && isAssessmentActive && !testFailed) {
                setIsSecured(false);
                if (isSecured) {
                    handleViolation('Security breach: Fullscreen mode bypassed.');
                }
            }
        };
        const handleContextMenu = (e: MouseEvent) => {
            if (isAssessmentActive) {
                e.preventDefault();
                handleViolation('Unauthorized interaction: Right-click restricted.');
            }
        };

        const handleKeyDown = (e: KeyboardEvent) => {
            if (!isAssessmentActive) return;

            // Block Alt+Tab, Ctrl, Meta, F12, F5
            const restrictedKeys = ['F12', 'F5', 'Tab', 'Escape'];
            if (e.altKey || e.ctrlKey || e.metaKey || restrictedKeys.includes(e.key)) {
                if (e.key === 'r' && (e.ctrlKey || e.metaKey)) e.preventDefault(); // Block Refresh

                if (e.key !== 'Enter' && e.key !== ' ' && e.key !== 'Backspace' && e.key.length !== 1) {
                    e.preventDefault();
                    // If Escape, use it as a gesture to immediately restore
                    handleViolation('Security violation detected. Potential environment tampering.', e.key === 'Escape');
                }
            }
        };

        window.addEventListener('blur', handleBlur);
        document.addEventListener('fullscreenchange', handleFullscreenChange);
        window.addEventListener('contextmenu', handleContextMenu);
        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('blur', handleBlur);
            document.removeEventListener('fullscreenchange', handleFullscreenChange);
            window.removeEventListener('contextmenu', handleContextMenu);
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [isAssessmentActive, phase, handleViolation, testFailed, isSecured]);



    if (testFailed) {
        return (
            <div className="fixed inset-0 z-[2000] bg-[var(--bg-primary)] flex items-center justify-center p-8 text-center animate-in fade-in duration-500">
                <div className="max-w-sm w-full p-12 bg-[var(--bg-secondary)] border border-red-500/20 rounded-[2rem] shadow-2xl">
                    <div className="w-16 h-16 rounded-2xl bg-red-500/10 flex items-center justify-center text-red-500 mx-auto mb-8 border border-red-500/10">
                        <ShieldAlert className="w-8 h-8 animate-shake" />
                    </div>
                    <h2 className="text-2xl font-semibold text-red-500 mb-4 tracking-tight uppercase">Session Terminated</h2>
                    <p className="text-[var(--text-secondary)] mb-10 text-sm font-normal">Environmental violations detected. Access has been revoked to maintain assessment integrity.</p>
                    <button onClick={() => navigate('/')} className="w-full py-4 bg-red-600 hover:bg-red-500 text-white font-bold rounded-xl uppercase tracking-widest text-[10px] transition-all">Return to Home</button>
                </div>
            </div>
        );
    }

    return (
        <div className={`fixed inset-0 bg-[var(--bg-primary)] ${isQuestionPage ? 'overflow-hidden' : 'overflow-y-auto'}`}>
            {showWarningPopup.show && (
                <div className="fixed inset-0 z-[1000] bg-[var(--bg-primary)]/90 backdrop-blur-xl flex items-center justify-center p-6 animate-in fade-in duration-300">
                    <div className="max-w-sm w-full p-10 bg-[var(--bg-secondary)] border border-red-500/10 shadow-2xl rounded-[1.5rem] text-center">
                        <div className="w-12 h-12 rounded-xl bg-red-500/10 flex items-center justify-center text-red-500 mx-auto mb-6">
                            <AlertTriangle className="w-6 h-6" />
                        </div>

                        <h2 className="text-xl font-semibold mb-2 text-red-500 uppercase tracking-tight">Violation Alert</h2>
                        <div className="flex items-center justify-center gap-2 mb-8">
                            <span className="text-[9px] uppercase tracking-widest font-bold text-slate-500">Counter:</span>
                            <div className="flex gap-1">
                                {[1, 2, 3, 4, 5].map(v => (
                                    <div key={v} className={`w-1.5 h-1.5 rounded-full transition-all ${v <= proctoringWarnings ? 'bg-red-500' : 'bg-white/10'}`} />
                                ))}
                            </div>
                        </div>

                        <div className="bg-[var(--bg-primary)]/50 rounded-xl p-6 border border-[var(--glass-border)] mb-8 text-left">
                            <p className="text-[11px] font-medium text-[var(--text-primary)] leading-relaxed tracking-tight">{showWarningPopup.message}</p>
                        </div>

                        <div className="flex flex-col gap-3">
                            <button
                                onClick={async () => {
                                    const success = await enterFullscreen();
                                    if (success) {
                                        setShowWarningPopup({ show: false, message: '' });
                                    }
                                }}
                                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-4 rounded-xl uppercase tracking-widest text-[10px] transition-all"
                            >
                                Restore Fullscreen
                            </button>
                            <button
                                onClick={() => navigate('/')}
                                className="w-full py-2 text-[9px] font-bold text-slate-600 hover:text-red-400 transition-colors uppercase tracking-[0.3em]"
                            >
                                Abandon Session
                            </button>
                        </div>
                    </div>
                </div>
            )}



            {phase === 'loading' && (
                <div className="relative w-full h-screen flex flex-col items-center justify-center bg-[var(--bg-primary)]">
                    <div className="relative">
                        <div className="w-20 h-20 rounded-[2rem] border-[4px] border-indigo-500/10 border-t-indigo-500 animate-spin" />
                        <div className="absolute inset-0 flex items-center justify-center">
                            <ShieldCheck className="w-8 h-8 text-indigo-500/40" />
                        </div>
                    </div>
                    <p className="mt-8 text-[11px] font-bold uppercase tracking-[0.5em] text-indigo-500/80 animate-pulse">Initializing Security Core</p>
                </div>
            )}

            {phase === 'error' && (
                <div className="w-full h-screen flex items-center justify-center bg-[var(--bg-primary)] p-6">
                    <div className="p-14 bg-[var(--bg-secondary)]/80 backdrop-blur-3xl text-center max-w-md rounded-[3rem] border border-[var(--glass-border)] shadow-2xl">
                        <div className="w-16 h-16 rounded-[1.5rem] bg-red-500/10 flex items-center justify-center text-red-500 mx-auto mb-8">
                            <AlertCircle size={32} />
                        </div>
                        <h2 className="text-2xl font-semibold mb-4 tracking-tighter text-[var(--text-primary)] uppercase">{errorHeader}</h2>
                        <p className="text-slate-500 text-[14px] leading-relaxed mb-12 font-normal">{errorMessage}</p>
                        <button onClick={startInterview} className="w-full bg-[#1a1a1c] hover:bg-white hover:text-black text-white font-bold py-5 rounded-2xl uppercase tracking-[0.25em] text-[11px] transition-all border border-white/5 shadow-2xl">Re-attempt Sync</button>
                    </div>
                </div>
            )}

            {phase === 'live' && (
                <>
                    {/* Security Protocol Gate */}
                    {isAssessmentActive && !isSecured ? (
                        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-[var(--bg-primary)]/95 p-6 animate-in fade-in duration-500">
                            <div className="max-w-md w-full p-12 bg-[var(--bg-secondary)] border border-[var(--glass-border)] shadow-2xl rounded-[2rem] relative overflow-hidden">
                                <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-500 mx-auto mb-8">
                                    <ShieldAlert className="w-8 h-8" />
                                </div>
                                <h1 className="text-2xl font-semibold mb-2 tracking-tight text-[var(--text-primary)] uppercase text-center">Security Gate</h1>
                                <p className="text-indigo-500 text-[10px] uppercase tracking-[0.4em] font-bold mb-10 text-center">System Authorization Required</p>

                                <div className="text-left mb-10 space-y-4 px-8 py-8 bg-[var(--bg-primary)]/50 rounded-2xl border border-[var(--glass-border)]">
                                    {[
                                        "Persistent fullscreen presence is mandatory.",
                                        "Biometric monitoring is active.",
                                        "Environment scanning in progress.",
                                        "5 violations will terminate the session."
                                    ].map((text, i) => (
                                        <div key={i} className="flex items-start gap-3">
                                            <div className="w-1 h-1 rounded-full bg-indigo-500 mt-2 flex-shrink-0" />
                                            <p className="text-[12px] font-medium text-[var(--text-secondary)] leading-relaxed">{text}</p>
                                        </div>
                                    ))}
                                </div>

                                <button onClick={enterFullscreen} className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-4.5 rounded-xl uppercase tracking-widest text-[11px] transition-all">Enable Protection & Start</button>
                            </div>
                        </div>
                    ) : null}

                    {/* Primary Assessment Interface */}
                    <AssessmentLayout>
                        <div className="animate-in fade-in slide-in-from-bottom-8 duration-1000">
                            <Outlet />
                        </div>
                    </AssessmentLayout>

                    {/* Draggable Proctoring Panel */}
                    <ProctoringPanel
                        stream={streamRef.current}
                        nodeRef={draggableRef}
                    />
                </>
            )}
        </div>
    );
}

// Add ShieldCheck for the loading icon
function ShieldCheck({ className, size }: { className?: string; size?: number }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={size || 24}
            height={size || 24}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
        >
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
            <path d="m9 12 2 2 4-4" />
        </svg>
    );
}
