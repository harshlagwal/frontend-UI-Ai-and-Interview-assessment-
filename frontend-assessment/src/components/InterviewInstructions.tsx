import { Shield, Camera, Mic, Monitor, ChevronRight } from 'lucide-react';

interface InstructionsProps {
    onComplete: () => void;
}

export default function InterviewInstructions({ onComplete }: InstructionsProps) {
    const guidelines = [
        {
            icon: <Shield className="w-5 h-5" />,
            title: "Proctored Environment",
            description: "Fullscreen is mandatory. Tab switching or exiting is a violation."
        },
        {
            icon: <Camera className="w-5 h-5" />,
            title: "Visual Monitoring",
            description: "Maintain posture. Webcam monitoring is active throughout."
        },
        {
            icon: <Mic className="w-5 h-5" />,
            title: "Acoustics & Background",
            description: "Use a quiet, well-lit room. High noise levels trigger alerts."
        },
        {
            icon: <Monitor className="w-5 h-5" />,
            title: "Identity Verification",
            description: "Stay centered. AI facial verification is active continuously."
        }
    ];

    return (
        <div className="h-screen w-full flex items-center justify-center p-4 bg-[var(--bg-primary)] overflow-hidden">
            {/* Premium Background Ambience */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-500/10 blur-[120px] rounded-full" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-500/10 blur-[120px] rounded-full" />
            </div>

            <div className="guideline-container animate-fade-in relative z-10">
                <div className="glass-card p-8 md:p-12 bg-[var(--bg-secondary)] border-[var(--glass-border)] shadow-2xl">
                    <div className="text-center mb-10">
                        <div className="w-14 h-14 bg-indigo-500/10 rounded-2xl flex items-center justify-center mx-auto mb-5 border border-indigo-500/20 shadow-inner group py-1">
                            <Shield className="w-7 h-7 text-indigo-500" />
                        </div>
                        <h2 className="mb-2 tracking-tight text-[var(--text-primary)]">AI Security Guidelines</h2>
                        <p className="text-[var(--text-secondary)] text-sm leading-relaxed max-w-[400px] mx-auto font-normal">
                            Please review the proctoring protocols below to ensure a secure and interrupted assessment experience.
                        </p>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4 mb-10">
                        {guidelines.map((item, index) => (
                            <div key={index} className="flex gap-4 p-4 rounded-2xl bg-[var(--bg-primary)] border border-[var(--glass-border)] hover:border-indigo-500/30 transition-all duration-300 group">
                                <div className="w-10 h-10 bg-[var(--bg-secondary)] rounded-xl flex items-center justify-center shrink-0 border border-[var(--glass-border)] text-indigo-500 group-hover:bg-indigo-500/10 transition-all">
                                    <span className="w-5 h-5">{item.icon}</span>
                                </div>
                                <div>
                                    <h3 className="text-[var(--text-primary)] text-sm font-semibold mb-0.5 tracking-tight">{item.title}</h3>
                                    <p className="text-[var(--text-muted)] text-[11px] leading-relaxed font-medium">{item.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="space-y-4 max-w-[320px] mx-auto">
                        <button
                            onClick={onComplete}
                            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-4 rounded-xl transition-all duration-300 active:scale-[0.98] shadow-xl shadow-indigo-600/20 flex items-center justify-center gap-2 text-sm group"
                        >
                            Initialize Assessment
                            <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                        </button>

                        <div className="flex items-center justify-center gap-2 text-[10px] uppercase tracking-[0.2em] text-[var(--text-muted)] font-bold">
                            <div className="w-1 h-1 rounded-full bg-indigo-500 animate-pulse" />
                            AI Guard Protection Enabled
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
