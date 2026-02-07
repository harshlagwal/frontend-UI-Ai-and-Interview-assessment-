import { useState, useRef, useEffect, useCallback } from 'react';
import { Camera, CameraOff, Mic, MicOff, PhoneOff, User, AlertCircle, Sun, Moon } from 'lucide-react';

/**
 * Premium Interview Dashboard - Google Meet Style
 */
export default function InterviewDashboard() {
    const [phase, setPhase] = useState<'loading' | 'live' | 'error'>('loading');
    const [isCameraOn, setIsCameraOn] = useState(true);
    const [isMicOn, setIsMicOn] = useState(true);
    const [errorHeader, setErrorHeader] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    // Persistent Refs for WebRTC Stability
    const streamRef = useRef<MediaStream | null>(null);
    const hasRequestedRef = useRef(false);
    const videoRef = useRef<HTMLVideoElement>(null);
    const [theme, setTheme] = useState<'light' | 'dark'>(() => {
        if (typeof window !== 'undefined') {
            return (localStorage.getItem('theme') as 'light' | 'dark') || 'dark';
        }
        return 'dark';
    });

    /**
     * Theme Effect
     */
    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme(prev => prev === 'light' ? 'dark' : 'light');
    };


    /**
     * Video Attachment Effect - Senior Level Reliability
     */
    useEffect(() => {
        const videoElement = videoRef.current;
        const stream = streamRef.current;

        if (videoElement && stream && phase === 'live') {
            // Only re-assign if it's different to prevent flicker/black frames
            if (videoElement.srcObject !== stream) {
                videoElement.srcObject = stream;
            }

            videoElement.play().catch(err => {
                if (err.name !== 'AbortError') {
                    console.error("Video play failed:", err);
                }
            });
        }
    }, [phase]);

    /**
     * Keyboard Shortcuts Handler
     */
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (phase !== 'live') return;

            switch (e.key.toLowerCase()) {
                case 'm':
                    toggleMic();
                    break;
                case 'c':
                    toggleCamera();
                    break;
                case 'escape':
                    handleEndInterview();
                    break;
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [phase]);

    /**
     * Media Management - Singleton Pattern
     */
    const stopTracks = useCallback(() => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
            streamRef.current = null;
        }
    }, []);

    const startInterview = useCallback(async () => {
        if (hasRequestedRef.current) return;
        hasRequestedRef.current = true;

        setPhase('loading');
        setErrorMessage('');

        try {
            const mediaStream = await navigator.mediaDevices.getUserMedia({
                video: { width: { ideal: 1280 }, height: { ideal: 720 }, facingMode: "user" },
                audio: true,
            });

            streamRef.current = mediaStream;
            setPhase('live');
        } catch (err: any) {
            hasRequestedRef.current = false; // Reset if failed so retry is possible
            setPhase('error');
            setErrorHeader('Connection Error');
            if (err.name === 'NotAllowedError') {
                setErrorMessage('Camera or microphone access denied. Please allow permissions in your browser bar.');
            } else {
                setErrorMessage('No media gear detected. Ensure your devices are connected.');
            }
        }
    }, []);

    /**
     * Auto-start Effect
     */
    useEffect(() => {
        startInterview();
    }, [startInterview]);

    const toggleCamera = useCallback(() => {
        if (streamRef.current) {
            const videoTrack = streamRef.current.getVideoTracks()[0];
            if (videoTrack) {
                videoTrack.enabled = !videoTrack.enabled;
                setIsCameraOn(videoTrack.enabled);
            }
        }
    }, []);

    const toggleMic = useCallback(() => {
        if (streamRef.current) {
            const audioTrack = streamRef.current.getAudioTracks()[0];
            if (audioTrack) {
                audioTrack.enabled = !audioTrack.enabled;
                setIsMicOn(audioTrack.enabled);
            }
        }
    }, []);

    const handleEndInterview = () => {
        if (window.confirm("Submit your assessment and end the call?")) {
            stopTracks();
            window.location.reload();
        }
    };

    useEffect(() => {
        return () => stopTracks();
    }, [stopTracks]);

    // --- COMPONENTS ---

    const ThemeToggle = () => (
        <button
            onClick={toggleTheme}
            className="fixed top-5 right-5 z-[100] p-2.5 rounded-full bg-[var(--glass-bg)] border border-[var(--glass-border)] hover:bg-indigo-500/10 hover:border-indigo-500/30 transition-all duration-300 group shadow-lg backdrop-blur-md active:scale-90"
            aria-label="Toggle theme"
        >
            {theme === 'light' ? (
                <Moon className="w-4 h-4 text-indigo-600" />
            ) : (
                <Sun className="w-4 h-4 text-amber-400" />
            )}
        </button>
    );

    // --- RENDERING ---

    // --- FINAL RENDER ---
    return (
        <>
            <ThemeToggle />

            {phase === 'loading' && (
                <div className="relative w-full h-screen flex flex-col items-center justify-center p-4 animate-fade-in bg-[var(--bg-primary)]">
                    <div className="flex flex-col items-center gap-6">
                        <div className="w-16 h-16 rounded-full border-4 border-indigo-500/20 border-t-indigo-500 animate-spin" />
                        <div className="text-center">
                            <h2 className="text-xl font-bold mb-2">Setting Up Hardware</h2>
                            <p className="text-sm text-[var(--text-secondary)]">Please allow camera and microphone access...</p>
                        </div>
                    </div>
                </div>
            )}

            {phase === 'error' && (
                <div className="relative w-full h-screen flex items-center justify-center bg-[var(--bg-primary)] overflow-hidden">
                    <div className="w-full max-w-md mx-auto p-4 z-10 animate-fade-in">
                        <div className="glass-card p-10 text-center">
                            <div className="w-16 h-16 bg-red-500/10 border border-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                                <AlertCircle className="w-8 h-8 text-red-400" />
                            </div>
                            <h2 className="text-xl font-bold text-white mb-3 leading-tight">{errorHeader}</h2>
                            <p className="text-slate-400 text-xs mb-8 leading-relaxed font-medium px-4">{errorMessage}</p>
                            <button
                                onClick={() => {
                                    hasRequestedRef.current = false;
                                    startInterview();
                                }}
                                className="w-full bg-slate-800/80 hover:bg-slate-700 text-white font-bold py-3.5 rounded-xl border border-white/5 transition-all active:scale-95 text-xs"
                            >
                                Go Back & Retry
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {phase === 'live' && (
                <div className="relative w-full h-screen flex flex-col p-6 animate-fade-in overflow-hidden items-center justify-center">
                    {/* Main Video Viewport */}
                    <div className="relative z-10 flex flex-col items-center gap-8">
                        <div className={`video-surface shadow-2xl ${isCameraOn ? 'active' : ''}`}>
                            <video
                                ref={videoRef}
                                autoPlay
                                playsInline
                                muted
                                className={`w-full h-full object-cover transform scale-x-[-1] transition-opacity duration-700 ${isCameraOn ? 'opacity-100' : 'opacity-0'}`}
                            />

                            {/* Camera OFF Layout */}
                            {!isCameraOn && (
                                <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900 animate-fade-in">
                                    <User className="w-16 h-16 text-slate-700 mb-4" />
                                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Camera Off</span>
                                </div>
                            )}
                        </div>

                        {/* Controls - Strictly BELOW video card */}
                        <div className="flex items-center gap-4 py-4 px-8 bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-full shadow-2xl backdrop-blur-xl">
                            <button
                                onClick={toggleCamera}
                                className={`meet-btn ${!isCameraOn ? 'off' : ''}`}
                                aria-label="Toggle camera"
                            >
                                {isCameraOn ? <Camera size={20} strokeWidth={2.5} /> : <CameraOff size={20} strokeWidth={2.5} />}
                            </button>

                            <button
                                onClick={toggleMic}
                                className={`meet-btn ${!isMicOn ? 'off' : ''}`}
                                aria-label="Toggle microphone"
                            >
                                {isMicOn ? <Mic size={20} strokeWidth={2.5} /> : <MicOff size={20} strokeWidth={2.5} />}
                            </button>

                            <button
                                onClick={handleEndInterview}
                                className="meet-btn danger"
                                aria-label="End call"
                            >
                                <PhoneOff size={24} strokeWidth={2.5} />
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
