import { useState } from 'react';
import { LogIn, UserPlus, Mail, Lock, User, AlertCircle, Loader2, CheckCircle } from 'lucide-react';
import { authService } from '../services/authService';
import type { User as UserType } from '../services/authService';

interface AuthProps {
    onSuccess: (user: UserType) => void;
}

export default function Auth({ onSuccess }: AuthProps) {
    const [isLogin, setIsLogin] = useState(true);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [successMsg, setSuccessMsg] = useState('');
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        full_name: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError('');
        setSuccessMsg('');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccessMsg('');

        try {
            if (isLogin) {
                const res = await authService.login(formData.email, formData.password);
                onSuccess(res.user);
            } else {
                await authService.signup(formData);
                setSuccessMsg('Account created successfully! Please sign in.');
                setIsLogin(true);
                setFormData({ ...formData, password: '' });
            }
        } catch (err: any) {
            setError(err.message || 'Authentication failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="h-screen w-full flex items-center justify-center p-6 bg-[var(--bg-primary)] overflow-hidden">
            <div className="glass-card w-full max-w-md p-8 md:p-10 animate-fade-in shadow-2xl relative">
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-indigo-500/10 rounded-2xl flex items-center justify-center mx-auto mb-5 border border-indigo-500/10 shadow-inner group transition-all duration-500 hover:border-indigo-500/50">
                        {isLogin ? (
                            <LogIn className="w-8 h-8 text-indigo-500" />
                        ) : (
                            <UserPlus className="w-8 h-8 text-indigo-500" />
                        )}
                    </div>
                    <h2 className="text-3xl font-extrabold text-[var(--text-primary)] mb-2 tracking-tight">
                        {isLogin ? 'Welcome Back' : 'Create Account'}
                    </h2>
                    <p className="text-[var(--text-secondary)] text-sm font-medium opacity-80">
                        {isLogin ? 'Sign in to access your dashboard' : 'Join us to start your secure assessment'}
                    </p>
                </div>

                {successMsg && (
                    <div className="mb-6 p-4 bg-emerald-500/5 border border-emerald-500/20 rounded-xl flex items-start gap-3 animate-fade-in">
                        <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                        <p className="text-[var(--accent-emerald)] text-xs font-semibold leading-relaxed">{successMsg}</p>
                    </div>
                )}

                {error && (
                    <div className="mb-6 p-4 bg-red-500/5 border border-red-500/20 rounded-xl flex items-start gap-3 animate-shake">
                        <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                        <p className="text-[var(--accent-red)] text-xs font-semibold leading-relaxed">{error}</p>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    {!isLogin && (
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-[11px] font-bold text-[var(--text-muted)] uppercase tracking-widest px-1">Full Name</label>
                                    <div className="relative">
                                        <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
                                        <input
                                            type="text"
                                            name="full_name"
                                            required
                                            placeholder="John Doe"
                                            value={formData.full_name}
                                            onChange={handleChange}
                                            className="w-full pl-10 pr-4 py-3 bg-[var(--glass-inner)] border border-[var(--glass-border)] rounded-xl focus:border-indigo-500 outline-none transition-all text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)]"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[11px] font-bold text-[var(--text-muted)] uppercase tracking-widest px-1">Username</label>
                                    <div className="relative">
                                        <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
                                        <input
                                            type="text"
                                            name="username"
                                            required
                                            placeholder="johndoe"
                                            value={formData.username}
                                            onChange={handleChange}
                                            className="w-full pl-10 pr-4 py-3 bg-[var(--glass-inner)] border border-[var(--glass-border)] rounded-xl focus:border-indigo-500 outline-none transition-all text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)]"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="space-y-2">
                        <label className="text-[11px] font-bold text-[var(--text-muted)] uppercase tracking-widest px-1">Email Address</label>
                        <div className="relative">
                            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
                            <input
                                type="email"
                                name="email"
                                required
                                placeholder="name@company.com"
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full pl-10 pr-4 py-3 bg-[var(--glass-inner)] border border-[var(--glass-border)] rounded-xl focus:border-indigo-500 outline-none transition-all text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)]"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[11px] font-bold text-[var(--text-muted)] uppercase tracking-widest px-1">Password</label>
                        <div className="relative">
                            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
                            <input
                                type="password"
                                name="password"
                                required
                                placeholder="••••••••"
                                value={formData.password}
                                onChange={handleChange}
                                className="w-full pl-10 pr-4 py-3 bg-[var(--glass-inner)] border border-[var(--glass-border)] rounded-xl focus:border-indigo-500 outline-none transition-all text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)]"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-600/50 text-white font-bold py-4 rounded-xl shadow-xl shadow-indigo-600/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2 mt-6 text-sm group"
                    >
                        {loading ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                            <>
                                {isLogin ? 'Sign In to Dashboard' : 'Create Your Account'}
                                <LogIn className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                            </>
                        )}
                    </button>
                </form>

                <div className="mt-8 text-center pt-6 border-t border-[var(--glass-border)]">
                    <button
                        onClick={() => {
                            setIsLogin(!isLogin);
                            setError('');
                        }}
                        className="text-[12px] font-bold text-[var(--text-secondary)] hover:text-indigo-500 transition-colors uppercase tracking-widest flex items-center justify-center gap-2 mx-auto group"
                    >
                        {isLogin ? (
                            <>Don't have an account? <span className="text-indigo-500 group-hover:underline">Sign up free</span></>
                        ) : (
                            <>Already have an account? <span className="text-indigo-500 group-hover:underline">Sign in</span></>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
