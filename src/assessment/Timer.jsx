import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

const Timer = ({ isActive }) => {
    const [seconds, setSeconds] = useState(2400); // 40 minutes

    useEffect(() => {
        let interval = null;
        if (isActive && seconds > 0) {
            interval = setInterval(() => {
                setSeconds((prev) => prev - 1);
            }, 1000);
        } else if (seconds === 0) {
            clearInterval(interval);
        }
        return () => clearInterval(interval);
    }, [isActive, seconds]);

    const formatTime = (totalSeconds) => {
        const mins = Math.floor(totalSeconds / 60);
        const secs = totalSeconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const isUrgent = seconds <= 300; // 5 minutes

    return (
        <div className={`flex items-center gap-3 px-6 py-2.5 rounded-full backdrop-blur-xl border-2 transition-all duration-500 shadow-2xl ${isUrgent
            ? 'bg-red-500/5 border-red-500/20 text-red-500 shadow-red-500/10'
            : 'bg-emerald-500/5 border-emerald-500/20 text-emerald-500 shadow-emerald-500/10'
            }`}>
            <Clock size={16} className={isUrgent ? 'animate-pulse' : ''} />
            <span className="text-[14px] font-medium tracking-tight leading-none">
                {formatTime(seconds)}
            </span>
            <div className={`w-1.5 h-1.5 rounded-full ${isUrgent ? 'bg-red-500 animate-ping' : 'bg-emerald-500'}`} />
        </div>
    );
};

export default Timer;
