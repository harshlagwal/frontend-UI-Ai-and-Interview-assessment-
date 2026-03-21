import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';
import { sessionService } from '../services/sessionService';



const Timer = ({ isActive, remainingTime }) => {
    const [seconds, setSeconds] = useState(null); 
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    

    const fetchRemainingTime = () => {
        if (remainingTime !== undefined && remainingTime !== null) {
            setSeconds(remainingTime);
            setError(null);
            setIsLoading(false);
        }
    };

    // 1. Initial fetch when page mounts/reloads
    useEffect(() => {
        if (isActive) {
            fetchRemainingTime();
        }
    }, [isActive, remainingTime]);

    // 2. Backing Poll removed - Centralized in dashboard

    // 3. High-latency local tick interval for smooth countdown
    useEffect(() => {
        let interval = null;
        if (isActive && seconds !== null && seconds > 0) {
            interval = setInterval(() => {
                setSeconds((prev) => (prev && prev > 0 ? prev - 1 : 0));
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [isActive, seconds]);

    const formatTime = (totalSeconds) => {
        if (totalSeconds === null) return '--:--';
        const mins = Math.floor(totalSeconds / 60);
        const secs = totalSeconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    if (isLoading && seconds === null) {
        return (
             <div className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-slate-500/5 text-slate-500 animate-pulse">
                 <Clock size={16} />
                 <span className="text-[14px] font-medium">Syncing...</span>
             </div>
        );
    }

    if (error && seconds === null) {
        return (
             <div className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-red-500/5 text-red-500 border-2 border-red-500/20 shadow-2xl shadow-red-500/10">
                 <Clock size={16} />
                 <span className="text-[14px] font-medium">{error}</span>
             </div>
        );
    }

    const isUrgent = seconds !== null && seconds <= 300; // 5 minutes

    return (
        <div className={`flex items-center gap-3 px-6 py-2.5 rounded-full backdrop-blur-xl border-2 transition-all duration-500 shadow-2xl ${
            seconds === 0 ? 'bg-red-500/10 border-red-500/40 text-red-500 animate-shake' :
            isUrgent
            ? 'bg-red-500/5 border-red-500/20 text-red-500 shadow-red-500/10'
            : 'bg-emerald-500/5 border-emerald-500/20 text-emerald-500 shadow-emerald-500/10'
            }`}>
            <Clock size={16} className={isUrgent ? 'animate-pulse' : ''} />
            <span className="text-[14px] font-medium tracking-tight leading-none">
                {seconds === 0 ? 'Time Up' : formatTime(seconds)}
            </span>
            <div className={`w-1.5 h-1.5 rounded-full ${isUrgent ? 'bg-red-500 animate-ping' : 'bg-emerald-500'}`} />
        </div>
    );
};

export default Timer;
