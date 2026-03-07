import { useState } from 'react';
import { Mail, Lock, User, Eye, EyeOff } from 'lucide-react';
import { authService } from '../services/authService';
import type { User as UserType } from '../services/authService';
import { useLoading } from '../context/LoadingContext';

interface AuthProps {
    onSuccess: (user: UserType) => void;
}

export default function Auth({ onSuccess }: AuthProps) {
    const [isLogin, setIsLogin] = useState(true);
    const [error, setError] = useState('');
    const [successMsg, setSuccessMsg] = useState('');
    const { showLoader, hideLoader } = useLoading();
    const [showPassword, setShowPassword] = useState(false);
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
        showLoader();
        setError('');
        setSuccessMsg('');

        try {
            if (isLogin) {
                const res = await authService.login(formData.email, formData.password);
                onSuccess(res.user);
            } else {
                await authService.signup(formData);
                setSuccessMsg('Account created successfully!');
                setTimeout(() => setIsLogin(true), 1500);
            }
        } catch (err: any) {
            setError(err.message || 'Authentication failed');
        } finally {
            hideLoader();
        }
    };

    return (
        <div className="fixed inset-0 h-screen w-full flex items-center justify-center p-6 bg-[var(--bg-primary)] overflow-hidden">
            {/* Minimal Background gradient */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
                <div className="absolute top-0 right-0 w-[40%] h-[40%] bg-indigo-500/5 blur-[120px] rounded-full" />
            </div>

            <div className="auth-container p-8 md:p-10 animate-fade-in relative z-10 transition-all duration-500 rounded-[2rem] bg-[var(--bg-secondary)] border border-[var(--glass-border)] shadow-2xl">
                <div className="text-center mb-10">
                    <h2 className="text-3xl font-semibold mb-2 tracking-tight text-[var(--text-primary)]">
                        {isLogin ? 'Log in' : 'Create Account'}
                    </h2>
                    <p className="text-sm font-normal leading-relaxed max-w-[300px] mx-auto text-[var(--text-secondary)]">
                        {isLogin
                            ? 'Secure access to your professional assessment dashboard.'
                            : 'Join the community and start your journey today.'}
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {!isLogin && (
                        <>
                            <div className="relative group">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors text-slate-500 group-focus-within:text-indigo-500" />
                                <input
                                    type="text"
                                    name="full_name"
                                    required
                                    placeholder="Full Name"
                                    value={formData.full_name}
                                    onChange={handleChange}
                                    className="w-full pl-11 pr-4 py-3.5 rounded-xl outline-none transition-all duration-300 text-sm border bg-[var(--bg-primary)] border-[var(--glass-border)] text-[var(--text-primary)] focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/5"
                                />
                            </div>
                            <div className="relative group">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors text-slate-500 group-focus-within:text-indigo-500" />
                                <input
                                    type="text"
                                    name="username"
                                    required
                                    placeholder="Username"
                                    value={formData.username}
                                    onChange={handleChange}
                                    className="w-full pl-11 pr-4 py-3.5 rounded-xl outline-none transition-all duration-300 text-sm border bg-[var(--bg-primary)] border-[var(--glass-border)] text-[var(--text-primary)] focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/5"
                                />
                            </div>
                        </>
                    )}

                    <div className="relative group">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors text-slate-500 group-focus-within:text-indigo-500" />
                        <input
                            type="email"
                            name="email"
                            required
                            placeholder="Email Address"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full pl-11 pr-4 py-3.5 rounded-xl outline-none transition-all duration-300 text-sm border bg-[var(--bg-primary)] border-[var(--glass-border)] text-[var(--text-primary)] focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/5"
                        />
                    </div>

                    <div className="relative group">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors text-slate-500 group-focus-within:text-indigo-500" />
                        <input
                            type={showPassword ? 'text' : 'password'}
                            name="password"
                            required
                            placeholder="Password"
                            value={formData.password}
                            onChange={handleChange}
                            className="w-full pl-11 pr-12 py-3.5 rounded-xl outline-none transition-all duration-300 text-sm border bg-[var(--bg-primary)] border-[var(--glass-border)] text-[var(--text-primary)] focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/5"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-indigo-500 transition-colors"
                        >
                            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-4 rounded-xl transition-all duration-300 active:scale-[0.98] shadow-lg shadow-indigo-600/20 mt-4 text-[12px] uppercase tracking-widest"
                    >
                        {isLogin ? 'Log in' : 'Create account'}
                    </button>
                </form>

                {error && (
                    <div className="mt-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20">
                        <p className="text-red-500 text-[11px] font-medium text-center">{error}</p>
                    </div>
                )}
                {successMsg && (
                    <div className="mt-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                        <p className="text-emerald-500 text-[11px] font-medium text-center">{successMsg}</p>
                    </div>
                )}

                <div className="mt-8 text-center border-t border-[var(--glass-border)] pt-8">
                    <p className="text-sm font-medium text-[var(--text-secondary)]">
                        {isLogin ? "No account yet? " : "Already registered? "}
                        <button
                            onClick={() => {
                                setIsLogin(!isLogin);
                                setError('');
                            }}
                            className="text-indigo-500 hover:underline underline-offset-4"
                        >
                            {isLogin ? 'Create one' : 'Log in'}
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
}
