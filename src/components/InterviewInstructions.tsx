import { CheckCircle, Shield, Monitor, Camera, Mic } from 'lucide-react';

interface InstructionsProps {
    onComplete: () => void;
}

export default function InterviewInstructions({ onComplete }: InstructionsProps) {
    const guidelines = [
        {
            icon: <Shield className="w-5 h-5 text-indigo-400" />,
            title: "Secure Environment",
            description: "Fullscreen mode is required. Tab switching or exiting fullscreen will result in a violation."
        },
        {
            icon: <Camera className="w-5 h-5 text-indigo-400" />,
            title: "Camera Access",
            description: "Ensure your camera is turned on and you are clearly visible throughout the session."
        },
        {
            icon: <Mic className="w-5 h-5 text-indigo-400" />,
            title: "Audio Check",
            description: "A stable microphone and quiet environment are essential for clear communication."
        },
        {
            icon: <Monitor className="w-5 h-5 text-indigo-400" />,
            title: "Screen Sharing",
            description: "You may be asked to share your screen for technical assessments."
        }
    ];

    return (
        <div className="h-screen w-full flex items-center justify-center p-4 bg-[var(--bg-primary)] overflow-hidden">
            <div className="glass-card w-full max-w-md p-6 md:p-8 animate-fade-in shadow-2xl">
                <div className="mb-6 text-center">
                    <CheckCircle className="w-10 h-10 text-emerald-500 mx-auto mb-3" />
                    <h1 className="text-2xl font-extrabold text-[var(--text-primary)] mb-1 tracking-tight">
                        Assessment Guidelines
                    </h1>
                    <p className="text-[var(--text-secondary)] text-xs font-medium opacity-80">
                        Review these rules before starting your session.
                    </p>
                </div>

                <div className="space-y-3 mb-8">
                    {guidelines.map((item, index) => (
                        <div key={index} className="flex items-center gap-3 p-3 rounded-xl bg-[var(--glass-inner)] border border-[var(--glass-border)] transition-all">
                            <div className="w-9 h-9 bg-indigo-500/10 rounded-lg flex items-center justify-center shrink-0 border border-indigo-500/10 text-indigo-500">
                                {item.icon}
                            </div>
                            <div>
                                <h3 className="text-[var(--text-primary)] text-[13px] font-bold">{item.title}</h3>
                                <p className="text-[var(--text-secondary)] text-[10px] leading-tight font-medium opacity-70">{item.description}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="flex flex-col gap-3">
                    <button
                        onClick={onComplete}
                        className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-4 rounded-xl shadow-lg active:scale-[0.98] transition-all flex items-center justify-center gap-2 text-sm group"
                    >
                        Start Interview
                        <Monitor className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </button>
                    <p className="text-center text-[var(--text-secondary)] text-[9px] font-bold uppercase tracking-widest opacity-60">
                        Secure Environment Enforced
                    </p>
                </div>
            </div>
        </div>
    );
}
