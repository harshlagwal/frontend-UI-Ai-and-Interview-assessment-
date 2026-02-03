import { useState, useRef, useEffect, useCallback } from 'react';
import { Camera, CameraOff, Mic, MicOff, PhoneOff, Loader2, User, Activity, AlertCircle, Clock, Shield, Wifi } from 'lucide-react';

/**
 * Premium Interview Dashboard - Google Meet Style
 */
export default function InterviewDashboard() {
    const [phase, setPhase] = useState<'entry' | 'loading' | 'live' | 'error'>('entry');
    const [candidateName, setCandidateName] = useState('');
    const [stream, setStream] = useState<MediaStream | null>(null);
    const [isCameraOn, setIsCameraOn] = useState(true);
    const [isMicOn, setIsMicOn] = useState(true);
    const [seconds, setSeconds] = useState(0);
    const [errorHeader, setErrorHeader] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const videoRef = useRef<HTMLVideoElement>(null);

    /**
     * Session Timer Logic
     */
    useEffect(() => {
        let interval: any;
        if (phase === 'live') {
            interval = setInterval(() => {
                setSeconds(s => s + 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [phase]);

    const formatTime = (totalSeconds: number) => {
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const secs = totalSeconds % 60;
        return `${hours > 0 ? hours + ':' : ''}${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    /**
     * Get Initials for Avatar
     */
    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map(part => part[0])
            .join('')
            .toUpperCase()
            .slice(0, 2) || 'C';
    };

    /**
     * Video Attachment Effect
     */
    useEffect(() => {
        if (videoRef.current && stream && phase === 'live') {
            videoRef.current.srcObject = stream;
            videoRef.current.play().catch(console.error);
        }
    }, [stream, phase]);

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
    }, [phase, isCameraOn, isMicOn, stream]);

    /**
     * Media Management
     */
    const stopTracks = useCallback(() => {
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
            setStream(null);
        }
    }, [stream]);

    const startInterview = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if (!candidateName.trim()) return;

        setPhase('loading');
        setErrorMessage('');

        try {
            const mediaStream = await navigator.mediaDevices.getUserMedia({
                video: { width: { ideal: 1280 }, height: { ideal: 720 }, facingMode: "user" },
                audio: true,
            });

            setStream(mediaStream);
            setPhase('live');
        } catch (err: any) {
            setPhase('error');
            setErrorHeader('Connection Error');
            if (err.name === 'NotAllowedError') {
                setErrorMessage('Camera or microphone access denied. Please allow permissions in your browser bar.');
            } else {
                setErrorMessage('No media gear detected. Ensure your devices are connected.');
            }
        }
    };

    const toggleCamera = () => {
        if (stream) {
            const track = stream.getVideoTracks()[0];
            if (track) {
                track.enabled = !track.enabled;
                setIsCameraOn(track.enabled);
            }
        }
    };

    const toggleMic = () => {
        if (stream) {
            const track = stream.getAudioTracks()[0];
            if (track) {
                track.enabled = !track.enabled;
                setIsMicOn(track.enabled);
            }
        }
    };

    const handleEndInterview = () => {
        if (window.confirm("Submit your assessment and end the call?")) {
            stopTracks();
            window.location.reload();
        }
    };

    useEffect(() => {
        return () => stopTracks();
    }, [stopTracks]);

    // --- RENDERING ---

    // 1. Entry / Authenticating
    if (phase === 'entry' || phase === 'loading') {
        return (
            <div className="w-full max-w-md mx-auto p-4 z-10 animate-fade-in">
                <div className="glass-card p-10 text-center relative overflow-hidden">
                    <div className="absolute -top-24 -right-24 w-48 h-48 bg-indigo-500/10 blur-3xl rounded-full" />

                    <div className="w-20 h-20 bg-indigo-600/20 border border-indigo-500/20 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-2xl">
                        <Shield className="w-10 h-10 text-indigo-400" />
                    </div>

                    <h1 className="text-3xl font-bold tracking-tight text-white mb-3">Welcome to Assessment</h1>
                    <p className="text-slate-400 text-sm mb-10 font-medium px-4">Identify yourself to join the secure session.</p>

                    <form onSubmit={startInterview} className="space-y-6">
                        <div className="relative group">
                            <User className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
                            <input
                                autoFocus
                                type="text"
                                placeholder="Your name for the recruiter"
                                value={candidateName}
                                onChange={(e) => setCandidateName(e.target.value)}
                                className="w-full bg-slate-950/60 border border-white/5 rounded-2xl py-4 pl-12 pr-6 text-white text-sm focus:outline-none focus:border-indigo-500/40 focus:ring-[6px] focus:ring-indigo-500/5 transition-all outline-none placeholder:text-slate-700"
                            />
                        </div>

                        <button
                            disabled={!candidateName.trim() || phase === 'loading'}
                            className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold py-4 rounded-2xl transition-all shadow-2xl shadow-indigo-600/30 flex items-center justify-center gap-3 active:scale-[0.98] relative overflow-hidden group/btn"
                        >
                            <div className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-700 pointer-events-none" />
                            {phase === 'loading' ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    <span className="uppercase tracking-widest text-[10px]">Verifying...</span>
                                </>
                            ) : (
                                <span className="uppercase tracking-widest text-[10px]">Start Interview</span>
                            )}
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    // 2. Error Display
    if (phase === 'error') {
        return (
            <div className="w-full max-w-md mx-auto p-4 z-10 animate-fade-in">
                <div className="glass-card p-10 text-center">
                    <div className="w-20 h-20 bg-red-500/10 border border-red-500/20 rounded-full flex items-center justify-center mx-auto mb-8">
                        <AlertCircle className="w-10 h-10 text-red-400" />
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-4 leading-tight">{errorHeader}</h2>
                    <p className="text-slate-400 text-sm mb-10 leading-relaxed font-medium px-4">{errorMessage}</p>
                    <button
                        onClick={() => setPhase('entry')}
                        className="w-full bg-slate-800/80 hover:bg-slate-700 text-white font-bold py-4 rounded-2xl border border-white/5 transition-all active:scale-95"
                    >
                        Go Back & Retry
                    </button>
                </div>
            </div>
        );
    }

    // 3. Live Session
    return (
        <div className="relative w-full h-full min-h-screen flex flex-col p-6 animate-fade-in overflow-hidden">

            {/* Top Header Overlay */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4 z-20">
                <div className="flex flex-col bg-slate-950/20 backdrop-blur-sm p-4 rounded-2xl border border-white/5 shadow-2xl">
                    <div className="flex items-center gap-3 mb-1">
                        <div className="w-8 h-8 rounded-xl bg-indigo-600/20 flex items-center justify-center border border-indigo-500/20">
                            <Activity size={16} className="text-indigo-400" />
                        </div>
                        <span className="text-lg font-bold text-white tracking-tight">Technical Assessment #492</span>
                    </div>
                    <div className="flex items-center gap-4 text-[9px] font-bold text-slate-500 uppercase tracking-widest">
                        <span className="text-slate-400">Role: Frontend Lead</span>
                        <span className="w-1 h-1 rounded-full bg-slate-700" />
                        <span className="text-slate-400">Session Status: Active</span>
                    </div>
                </div>

                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-3 bg-slate-950/80 border border-white/5 py-2 px-5 rounded-2xl shadow-xl backdrop-blur-md">
                        <Clock size={14} className="text-indigo-400" />
                        <span className="text-[12px] font-bold text-slate-200 tabular-nums font-mono">{formatTime(seconds)}</span>
                    </div>
                </div>
            </div>

            {/* Main Video Viewport */}
            <div className="flex-1 flex items-center justify-center relative w-full mb-20 z-10">
                <div className={`video-surface shadow-2xl w-full max-w-5xl ${isCameraOn ? 'active' : ''}`}>
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
                            <div className="avatar-placeholder">
                                {getInitials(candidateName)}
                            </div>
                            <div className="flex flex-col items-center gap-2">
                                <span className="text-sm font-bold text-slate-400 uppercase tracking-widest">Camera is turned off</span>
                            </div>
                        </div>
                    )}

                    {/* Identity Overlay */}
                    <div className="absolute top-6 left-6 z-20">
                        <div className="bg-slate-950/60 backdrop-blur-xl border border-white/10 py-2 px-4 rounded-2xl flex items-center gap-3 shadow-2xl">
                            <div className="w-2.5 h-2.5 rounded-full bg-indigo-500 shadow-[0_0_12px_rgba(99,102,241,0.8)]" />
                            <span className="text-[11px] font-bold text-white uppercase tracking-widest">{candidateName} (You)</span>
                        </div>
                    </div>

                    {/* Media Health */}
                    <div className="absolute bottom-6 left-6 flex items-center gap-3 z-20">
                        <div className="badge-pill status-active backdrop-blur-md py-2">
                            <div className="dot bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.5)] animate-pulse" />
                            <span>Ongoing Session</span>
                        </div>
                        <div className="badge-pill backdrop-blur-md py-2">
                            <div className={`audio-bar ${isMicOn ? 'pulsing' : ''}`}>
                                <span /><span /><span />
                            </div>
                            <span className="ml-2">{isMicOn ? 'Mic Active' : 'Mic Muted'}</span>
                        </div>
                    </div>

                    {/* Hardware Context */}
                    <div className="absolute top-6 right-6 flex flex-col gap-2 z-20">
                        <div className="flex items-center gap-2 bg-slate-950/60 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/5 shadow-lg">
                            <Wifi size={12} className="text-emerald-500" />
                            <span className="text-[9px] font-bold text-emerald-500 uppercase">Stable</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Meet-style Floating Bottom Control Bar */}
            <div className="floating-bar">
                <button
                    onClick={toggleCamera}
                    className={`meet-btn ${!isCameraOn ? 'off' : ''}`}
                    data-tip={isCameraOn ? "Turn off camera (C)" : "Turn on camera (C)"}
                    aria-label="Toggle camera"
                >
                    {isCameraOn ? <Camera size={20} strokeWidth={2} /> : <CameraOff size={20} strokeWidth={2} />}
                </button>

                <button
                    onClick={toggleMic}
                    className={`meet-btn ${!isMicOn ? 'off' : ''}`}
                    data-tip={isMicOn ? "Mute microphone (M)" : "Unmute microphone (M)"}
                    aria-label="Toggle microphone"
                >
                    {isMicOn ? <Mic size={20} strokeWidth={2} /> : <MicOff size={20} strokeWidth={2} />}
                </button>

                <button
                    onClick={handleEndInterview}
                    className="meet-btn danger"
                    data-tip="Leave session (Esc)"
                    aria-label="End call"
                >
                    <PhoneOff size={24} strokeWidth={2.5} />
                </button>
            </div>

            {/* Powered By Branding */}
            <div className="fixed bottom-6 right-8 text-[10px] font-extrabold text-slate-500 uppercase tracking-[0.2em] opacity-40 z-20 hidden md:block">
                Powered by UptoSkills AI
            </div>

        </div>
    );
}
