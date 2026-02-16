import { useState, useRef, useEffect, useCallback } from 'react';
import { Camera, CameraOff, Mic, MicOff, PhoneOff, User, AlertCircle, Monitor, MonitorOff } from 'lucide-react';

/**
 * Premium Interview Dashboard - Google Meet Style
 */
export default function InterviewDashboard() {
    const [phase, setPhase] = useState<'loading' | 'live' | 'error'>('loading');
    const [isCameraOn, setIsCameraOn] = useState(true);
    const [isMicOn, setIsMicOn] = useState(true);
    const [isScreenSharing, setIsScreenSharing] = useState(false);
    const [isSecured, setIsSecured] = useState(false);
    const [violations, setViolations] = useState(0);
    const [showWarning, setShowWarning] = useState(false);
    const [warningMsg, setWarningMsg] = useState('');
    const [infoMsg, setInfoMsg] = useState('');
    const [errorHeader, setErrorHeader] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    // Persistent Refs for WebRTC Stability
    const streamRef = useRef<MediaStream | null>(null);
    const screenStreamRef = useRef<MediaStream | null>(null);
    const isScreenSharingRef = useRef(false);
    const isRequestingScreenRef = useRef(false);
    const hasRequestedRef = useRef(false);
    const videoRef = useRef<HTMLVideoElement>(null);

    /**
     * Media Management - Singleton Pattern
     */
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

    useEffect(() => {
        return () => stopTracks();
    }, [stopTracks]);

    /**
     * Security: Multi-Tab Prevention
     */
    useEffect(() => {
        const channel = new BroadcastChannel('interview_session');
        channel.postMessage('new_tab_attempt');

        channel.onmessage = (msg) => {
            if (msg.data === 'new_tab_attempt') {
                channel.postMessage('session_exists');
            } else if (msg.data === 'session_exists' && phase === 'live') {
                setPhase('error');
                setErrorHeader('Security Violation');
                setErrorMessage('Another session is already active in a different tab/window. Please close all other tabs and retry.');
            }
        };

        return () => channel.close();
    }, [phase]);


    /**
     * Security: Keyboard & UI Restrictions
     */
    const handleViolation = useCallback((msg: string) => {
        if (!isSecured) return;

        setViolations(v => {
            const next = v + 1;
            if (next >= 3) {
                // Auto-terminate
                stopTracks();
                window.location.reload();
            }
            return next;
        });

        setWarningMsg(msg);
        setShowWarning(true);
    }, [isSecured, stopTracks]);

    useEffect(() => {
        if (!isSecured) return;

        const isExempt = () => isScreenSharingRef.current || isRequestingScreenRef.current;

        const handleBlur = () => {
            // Exempt blur if screen sharing is active or being requested
            if (!isExempt()) handleViolation("Window focus lost! Please stay on the assessment page.");
        };
        const handleVisibilityChange = () => {
            if (document.visibilityState === 'hidden' && !isExempt()) {
                handleViolation("Tab switch detected! This activity is logged.");
            }
        };
        const handleContextMenu = (e: MouseEvent) => {
            e.preventDefault();
            return false;
        };
        const handleFullscreenChange = () => {
            if (!document.fullscreenElement && !isExempt()) {
                handleViolation("Fullscreen exited! Assessment must be taken in fullscreen mode.");
            } else if (!document.fullscreenElement && isExempt()) {
                // If sharing but not fullscreen, attempt re-entry after a brief delay
                // to allow browser UI transitions to settle.
                setTimeout(() => {
                    if (!document.fullscreenElement && isExempt()) {
                        enterFullscreen().catch(() => { });
                    }
                }, 1000);
            }
        };

        window.addEventListener('blur', handleBlur);
        document.addEventListener('visibilitychange', handleVisibilityChange);
        window.addEventListener('contextmenu', handleContextMenu);
        document.addEventListener('fullscreenchange', handleFullscreenChange);

        return () => {
            window.removeEventListener('blur', handleBlur);
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            window.removeEventListener('contextmenu', handleContextMenu);
            document.removeEventListener('fullscreenchange', handleFullscreenChange);
        };
    }, [isSecured, handleViolation]);

    /**
     * Tablet Safety: Restrict Touch Gestures (Best Effort)
     */
    useEffect(() => {
        if (!isSecured) return;

        const preventGestures = (e: TouchEvent) => {
            if (e.touches.length > 1) {
                e.preventDefault();
                handleViolation("Multi-touch gestures are restricted during the assessment.");
            }
        };

        window.addEventListener('touchstart', preventGestures, { passive: false });
        // Minimal restriction for swipe-up is impossible via JS, but we log the resulting blur.

        return () => window.removeEventListener('touchstart', preventGestures);
    }, [isSecured, handleViolation]);

    /**
     * Video Attachment Effect - Senior Level Reliability
     */
    useEffect(() => {
        const videoElement = videoRef.current;
        const currentStream = isScreenSharing ? screenStreamRef.current : streamRef.current;

        if (videoElement && currentStream && phase === 'live') {
            // Only re-assign if it's different to prevent flicker/black frames
            if (videoElement.srcObject !== currentStream) {
                videoElement.srcObject = currentStream;
            }

            videoElement.play().catch(err => {
                if (err.name !== 'AbortError') {
                    console.error("Video play failed:", err);
                }
            });
        }
    }, [phase, isScreenSharing]);

    /**
     * Keyboard Shortcuts Handler
     */
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (phase !== 'live') return;

            switch (e.key.toLowerCase()) {
                case 'm':
                    if (isSecured) toggleMic();
                    break;
                case 'c':
                    if (isSecured) toggleCamera();
                    break;
                case 's':
                    if (isSecured) toggleScreenShare();
                    break;
                case 'escape':
                    if (isSecured) handleEndInterview();
                    break;
            }

            // Security: Block sensitive hotkeys
            const isCtrl = e.ctrlKey || e.metaKey;
            const isAlt = e.altKey;
            const key = e.key.toLowerCase();

            // Block common inspect/source keys
            if (
                (isCtrl && (key === 'u' || key === 's' || key === 'i' || key === 'j')) ||
                (isCtrl && e.shiftKey && (key === 'i' || key === 'j' || key === 'c')) ||
                key === 'f12'
            ) {
                e.preventDefault();
                handleViolation("Developer tools and source viewing are disabled.");
                return false;
            }

            // Block Alt+Tab/Meta+Tab (best effort)
            if (isAlt || key === 'tab') {
                // Browsers usually don't allow blocking Alt+Tab for OS security, 
                // but we detect the resulting blur.
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [phase]);


    const enterFullscreen = async () => {
        try {
            if (!document.fullscreenElement) {
                await document.documentElement.requestFullscreen();
            }
            setIsSecured(true);
            setShowWarning(false);
        } catch (err) {
            console.error("Fullscreen failed:", err);
            setPhase('error');
            setErrorHeader('Fullscreen Required');
            setErrorMessage('Assessments require fullscreen mode for security. Please allow fullscreen and retry.');
        }
    };

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

    const handleScreenShareEnd = useCallback(() => {
        if (screenStreamRef.current) {
            screenStreamRef.current.getTracks().forEach(track => track.stop());
            screenStreamRef.current = null;
        }
        isScreenSharingRef.current = false;
        setIsScreenSharing(false);

        // Notify and Force Fullscreen
        setInfoMsg("Screen sharing has ended. You have entered Fullscreen Mode. Please continue your interview.");
        enterFullscreen();
    }, []);

    const toggleScreenShare = useCallback(async () => {
        if (isScreenSharing) {
            handleScreenShareEnd();
        } else {
            // Start screen sharing
            isRequestingScreenRef.current = true;
            try {
                const screenStream = await navigator.mediaDevices.getDisplayMedia({
                    video: true,
                    audio: false // We keep the mic from the user audio stream
                });

                screenStreamRef.current = screenStream;

                // Handle when user clicks "Stop sharing" in browser UI
                screenStream.getVideoTracks()[0].onended = () => {
                    handleScreenShareEnd();
                };

                isScreenSharingRef.current = true;
                setIsScreenSharing(true);
                setInfoMsg(''); // Clear any previous info message

                // Re-enforce Fullscreen after sharing starts
                // Short timeout gives browser time to finalize sharing state before we request fullscreen
                setTimeout(() => {
                    enterFullscreen();
                }, 500);
            } catch (err) {
                console.error("Screen sharing failed:", err);
            } finally {
                isRequestingScreenRef.current = false;
            }
        }
    }, [isScreenSharing, handleScreenShareEnd]);

    const handleEndInterview = () => {
        if (window.confirm("Submit your assessment and end the call?")) {
            stopTracks();
            window.location.reload();
        }
    };


    // --- COMPONENTS ---

    // --- SECURITY OVERLAY ---
    const SecurityOverlay = () => {
        if (!isSecured && phase === 'live') {
            return (
                <div className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-950/90 backdrop-blur-xl animate-fade-in p-6">
                    <div className="glass-card max-w-lg p-10 text-center border-indigo-500/20">
                        <div className="w-20 h-20 bg-indigo-500/10 rounded-full flex items-center justify-center mx-auto mb-8 animate-pulse">
                            <AlertCircle className="w-10 h-10 text-indigo-400" />
                        </div>
                        <h2 className="text-2xl font-bold mb-4 text-[var(--text-primary)]">Start Secure Assessment</h2>
                        <ul className="text-white text-sm text-left mb-10 space-y-4 px-4 bg-slate-900 shadow-inner p-6 rounded-2xl border border-white/5">
                            <li className="flex items-start gap-3">
                                <span className="w-5 h-5 bg-indigo-500/20 rounded-full flex items-center justify-center text-[10px] text-indigo-400 font-bold shrink-0 mt-0.5">1</span>
                                Fullscreen mode will be enforced throughout the session.
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="w-5 h-5 bg-indigo-500/20 rounded-full flex items-center justify-center text-[10px] text-indigo-400 font-bold shrink-0 mt-0.5">2</span>
                                Tab switching or minimizing will result in immediate violations.
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="w-5 h-5 bg-indigo-500/30 rounded-full flex items-center justify-center text-[10px] text-indigo-300 font-bold shrink-0 mt-0.5">3</span>
                                Three violations will lead to automatic termination.
                            </li>
                        </ul>
                        <button
                            onClick={enterFullscreen}
                            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-4 rounded-xl shadow-[0_10px_30px_rgba(79,70,229,0.3)] transition-all active:scale-[0.98] text-sm"
                        >
                            Agree & Enter Fullscreen
                        </button>
                    </div>
                </div>
            );
        }

        if (showWarning && isSecured) {
            return (
                <div className="fixed inset-0 z-[300] flex items-center justify-center bg-red-950/80 backdrop-blur-md animate-fade-in p-6">
                    <div className="glass-card max-w-sm p-8 text-center border-red-500/30">
                        <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                            <AlertCircle className="w-8 h-8 text-red-500" />
                        </div>
                        <h3 className="text-xl font-bold text-[var(--accent-red)] mb-2">Warning: {violations}/3</h3>
                        <p className="text-[var(--text-primary)] font-bold text-sm mb-8 leading-relaxed">{warningMsg}</p>
                        <button
                            onClick={enterFullscreen}
                            className="w-full bg-[var(--accent-red)] text-white font-bold py-3.5 rounded-xl shadow-lg hover:shadow-red-500/20 transition-all text-xs"
                        >
                            Refocus & Re-enter Fullscreen
                        </button>
                    </div>
                </div>
            );
        }

        if (infoMsg && isSecured) {
            return (
                <div className="fixed inset-0 z-[250] flex items-center justify-center bg-slate-950/80 backdrop-blur-md animate-fade-in p-6">
                    <div className="glass-card max-w-md p-8 text-center border-indigo-500/20">
                        <div className="w-16 h-16 bg-indigo-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Monitor className="w-8 h-8 text-indigo-400" />
                        </div>
                        <h3 className="text-xl font-bold text-[var(--text-primary)] mb-2">Assessment Secured</h3>
                        <p className="text-[var(--text-secondary)] text-sm mb-8 leading-relaxed font-bold">{infoMsg}</p>
                        <button
                            onClick={() => {
                                setInfoMsg('');
                                enterFullscreen();
                            }}
                            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3.5 rounded-xl shadow-lg transition-all text-xs"
                        >
                            Continue Interview
                        </button>
                    </div>
                </div>
            );
        }

        return null;
    };

    // --- RENDERING ---

    // --- FINAL RENDER ---
    return (
        <div className="min-h-screen bg-[var(--bg-primary)]">
            <SecurityOverlay />

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
                            <h2 className="text-xl font-bold text-[var(--accent-red)] mb-3 leading-tight drop-shadow-sm">{errorHeader}</h2>
                            <p className="text-[var(--text-secondary)] text-xs mb-8 leading-relaxed font-bold px-4">{errorMessage}</p>
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
                <div className="h-screen w-full bg-[var(--bg-primary)] flex flex-col items-center justify-center p-6 relative overflow-hidden">
                    <div className="flex flex-col items-center gap-8 w-full max-w-5xl z-10">
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
                                data-tip={isCameraOn ? "Turn off camera" : "Turn on camera"}
                            >
                                {isCameraOn ? <Camera size={20} strokeWidth={2.5} /> : <CameraOff size={20} strokeWidth={2.5} />}
                            </button>

                            <button
                                onClick={toggleMic}
                                className={`meet-btn ${!isMicOn ? 'off' : ''}`}
                                aria-label="Toggle microphone"
                                data-tip={isMicOn ? "Mute microphone" : "Unmute microphone"}
                            >
                                {isMicOn ? <Mic size={20} strokeWidth={2.5} /> : <MicOff size={20} strokeWidth={2.5} />}
                            </button>

                            <button
                                onClick={toggleScreenShare}
                                className={`meet-btn ${isScreenSharing ? 'active-share' : ''}`}
                                aria-label="Share screen"
                                data-tip={isScreenSharing ? "Stop sharing" : "Share screen"}
                            >
                                {isScreenSharing ? <MonitorOff size={20} strokeWidth={2.5} /> : <Monitor size={20} strokeWidth={2.5} />}
                            </button>

                            <button
                                onClick={handleEndInterview}
                                className="meet-btn danger"
                                aria-label="End call"
                                data-tip="End call"
                            >
                                <PhoneOff size={24} strokeWidth={2.5} />
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
