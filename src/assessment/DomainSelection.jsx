import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Code2, Globe, Database, Cpu, Layout, ShieldCheck, ChevronRight } from 'lucide-react';
import { useLoading } from '../context/LoadingContext';

const domains = [
    { id: 'frontend', name: 'Frontend Development', icon: <Globe size={24} />, description: 'React, CSS, and modern web architecture.', color: 'from-blue-500/20 to-indigo-500/20', glow: 'shadow-blue-500/20' },
    { id: 'backend', name: 'Backend Systems', icon: <Database size={24} />, description: 'Node.js, Databases, and API design.', color: 'from-emerald-500/20 to-teal-500/20', glow: 'shadow-emerald-500/20' },
    { id: 'fullstack', name: 'Full Stack Engineering', icon: <Cpu size={24} />, description: 'End-to-end application development.', color: 'from-violet-500/20 to-purple-500/20', glow: 'shadow-violet-500/20' },
    { id: 'uiux', name: 'UI/UX Design', icon: <Layout size={24} />, description: 'Interface design and user experience.', color: 'from-pink-500/20 to-rose-500/20', glow: 'shadow-pink-500/20' },
    { id: 'security', name: 'Cybersecurity', icon: <ShieldCheck size={24} />, description: 'Network security and ethical hacking.', color: 'from-amber-500/20 to-orange-500/20', glow: 'shadow-amber-500/20' },
    { id: 'devops', name: 'DevOps & Cloud', icon: <Code2 size={24} />, description: 'Deployment and infrastructure.', color: 'from-cyan-500/20 to-sky-500/20', glow: 'shadow-cyan-500/20' },
];

const DomainSelection = () => {
    const navigate = useNavigate();
    const { showLoader, hideLoader } = useLoading();

    const handleDomainSelect = (domainId) => {
        showLoader();
        setTimeout(() => {
            hideLoader();
            navigate(`/assessment/question/${domainId}/1`);
        }, 1200);
    };

    return (
        <div className="w-full flex flex-col items-center py-10 px-6 relative bg-[var(--bg-primary)]">
            {/* Minimal Background ambience */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-0 right-0 w-[40%] h-[40%] bg-indigo-500/5 blur-[120px] rounded-full" />
            </div>

            <div className="text-center mb-16 relative z-10 animate-fade-in">

                <h1 className="text-3xl md:text-4xl font-semibold text-[var(--text-primary)] mb-4 tracking-tight">
                    Select Specialization
                </h1>
                <p className="text-[var(--text-secondary)] text-[14px] leading-relaxed max-w-[400px] mx-auto font-normal">
                    Choose the diagnostic path to begin your secure, proctored assessment.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-6xl relative z-10 animate-fade-in [animation-delay:100ms]">
                {domains.map((domain) => (
                    <button
                        key={domain.id}
                        onClick={() => handleDomainSelect(domain.id)}
                        className={`group relative text-left p-10 rounded-[2.5rem] bg-[var(--bg-secondary)] border border-[var(--glass-border)] hover:border-indigo-500/30 transition-all duration-500 flex flex-col hover:-translate-y-2 hover:shadow-[0_40px_80px_-15px_rgba(0,0,0,0.3)] active:scale-95 overflow-hidden`}
                    >
                        {/* Decorative background gradient glow */}
                        <div className={`absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-br ${domain.color} blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700`} />
                        <div className={`w-14 h-14 rounded-[1.25rem] bg-white/5 flex items-center justify-center text-indigo-400 mb-8 border border-white/5 group-hover:bg-indigo-500 group-hover:text-white transition-all duration-500 shadow-xl ${domain.glow}`}>
                            {React.cloneElement(domain.icon, { size: 24, strokeWidth: 1.5 })}
                        </div>

                        <h3 className="text-[19px] font-medium text-[var(--text-primary)] mb-3 tracking-tight transition-colors">
                            {domain.name}
                        </h3>
                        <p className="text-[var(--text-secondary)] text-[14px] leading-relaxed font-normal transition-opacity">
                            {domain.description}
                        </p>

                        <div className="mt-10 flex items-center gap-2 text-[11px] font-medium text-indigo-400 opacity-60 group-hover:opacity-100 uppercase tracking-[0.2em] transition-all">
                            Initialize Module <ChevronRight size={12} strokeWidth={2.5} className="group-hover:translate-x-1 transition-transform" />
                        </div>
                    </button>
                ))}
            </div>


        </div>
    );
};

export default DomainSelection;
