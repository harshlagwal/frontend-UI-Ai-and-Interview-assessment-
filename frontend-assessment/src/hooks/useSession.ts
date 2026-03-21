import { useState, useEffect, useCallback, useRef } from 'react';
import { sessionService } from '../services/sessionService';
import type { Question } from '../types/session';

import { useLoading } from '../context/LoadingContext';

const formatError = (err: any): string => {
    const detail = err.response?.data?.detail;
    if (detail) {
        if (Array.isArray(detail)) {
            return detail.map((e: any) => `${e.loc?.join('.') || 'error'}: ${e.msg || 'ValidationError'}`).join(' | ');
        }
        if (typeof detail === 'string') return detail;
        return JSON.stringify(detail);
    }
    return err.message || 'An unknown error occurred';
};

export const useSession = (candidateId?: string) => {
    const [sessionId, setSessionId] = useState<string | null>(() => localStorage.getItem('assessment_session_id'));
    const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(1);
    const [remainingTime, setRemainingTime] = useState<number | null>(null);
    const [error, setError] = useState<string | null>(null);
    const { showLoader, hideLoader, isLoading } = useLoading();
    const isFetchingRef = useRef(false); // Real React ref persisting across renders
    const [isCompleted, setIsCompleted] = useState<boolean>(false);

    /**
     * Start a new assessment session
     */
    const startSession = useCallback(async (candId: string) => {
        if (isCompleted) {
            console.log("[Session] Assessment already completed. Blocking session creation.");
            return;
        }
        if (sessionId) {
            console.log("[Session] Session already exists in state:", sessionId);
            return;
        }
        showLoader();
        setError(null);
        localStorage.removeItem('assessment_session_id'); // Defensive clear before start
        try {
            console.log(`[Session] Attempting to start session for candidate: ${candId}`);
            const response = await sessionService.startSession(candId);
            console.log(`[Session] Start Response:`, response);
            if (response && response.sessionId) {
                 setSessionId(response.sessionId);
                 console.log(`[Session] Stored SessionID in state: ${response.sessionId}`);
                 localStorage.setItem('assessment_session_id', response.sessionId);
                 
                 const status = await sessionService.getStatus(response.sessionId);
                 if (status.remainingTimeSeconds !== undefined) {
                     setRemainingTime(status.remainingTimeSeconds);
                 }
            }
            setCurrentQuestionIndex(response.currentQuestionIndex !== undefined ? response.currentQuestionIndex + 1 : 1);
            return response;
        } catch (err: any) {
            const errMsg = formatError(err);
            setError(errMsg);
            console.error(`[Session] Start Failed:`, err);
            throw new Error(errMsg);
        } finally {
            hideLoader();
            if (typeof isFetchingRef !== 'undefined') isFetchingRef.current = false;
            isFetchingRef.current = false;
        }
    }, [showLoader, hideLoader, sessionId, isCompleted]);

    /**
     * Fetches session overall status containing remaining time
     */
    const fetchStatus = useCallback(async () => {
        if (!sessionId || isFetchingRef.current) return;
        isFetchingRef.current = true;
        console.log(`[API] fetchStatus calling with SessionID: ${sessionId}`);
        try {
            const status = await sessionService.getStatus(sessionId);
            if (status.remainingTimeSeconds !== undefined) {
                setRemainingTime(status.remainingTimeSeconds);
            }
            isFetchingRef.current = false;
            return status;
        } catch (err: any) {
             console.error(`[Session] Fetch status failed:`, err);
             if (err.response?.status === 403) {
                 console.log(`[Session] Assessment Completed!`);
                 setIsCompleted(true);
                 localStorage.removeItem('assessment_session_id');
             } else if (err.response?.status === 404) {
                 setSessionId(null);
                 localStorage.removeItem('assessment_session_id');
             }
             isFetchingRef.current = false;
        }
    }, [sessionId]);

    /**
     * Fetches current question allocated for session
     */
    const fetchQuestion = useCallback(async () => {
        if (!sessionId || isFetchingRef.current) return;
        isFetchingRef.current = true;
        showLoader();
        setError(null);
        console.log(`[API] fetchQuestion calling with SessionID: ${sessionId}`);
        try {
            console.log(`[Session] Fetching question for session: ${sessionId}`);
            const question = await sessionService.getQuestion(sessionId);
            console.log(`[Session] Question Fetched:`, question);
            setCurrentQuestion(question);
            await fetchStatus(); // Sequential status call
            isFetchingRef.current = false;
            return question;
        } catch (err: any) {
            const errMsg = formatError(err);
            setError(errMsg);
            console.error(`[Session] Fetch question failed:`, err);
            if (err.response?.status === 403) {
                 setIsCompleted(true);
                 localStorage.removeItem('assessment_session_id');
             } else if (err.response?.status === 404) {
                 setSessionId(null);
                 localStorage.removeItem('assessment_session_id');
            }
        } finally {
            hideLoader();
        }
    }, [sessionId, showLoader, hideLoader]);

    /**
     * Submit answer for the current question
     */
    const submitAnswer = useCallback(async (answerText: string) => {
        if (!sessionId || !candidateId) {
            console.error(`[Session] submitAnswer blocked: sessionId=${sessionId}`);
            setError('Missing Session ID');
            return;
        }
        showLoader();
        setError(null);
        try {
            const response = await sessionService.submitAnswer(sessionId, {
                candidateId: String(candidateId || "test-user"),
                answerText: answerText || "[Fallback Answer]",
            });
            setCurrentQuestionIndex(prev => response.currentQuestionIndex !== undefined ? response.currentQuestionIndex + 1 : prev + 1);
            setCurrentQuestion(null);
            await fetchStatus();
            return response;
        } catch (err: any) {
            const errMsg = formatError(err);
            setError(errMsg);
            throw new Error(errMsg);
        } finally {
            hideLoader();
        }
    }, [sessionId, candidateId, showLoader, hideLoader, fetchStatus]);

    /**
     * Clear session locally (Complete or Terminated)
     */
    const endSession = useCallback(() => {
        setSessionId(null);
        setCurrentQuestion(null);
        setCurrentQuestionIndex(1);
        setRemainingTime(null);
        localStorage.removeItem('assessment_session_id');
    }, []);

    // Auto-start removed to allow explicit button triggers

    // Automatically fetch question once sessionId becomes available
    useEffect(() => {
        if (sessionId && !currentQuestion && !isLoading && !error && !isCompleted) {
            fetchQuestion();
        }
    }, [sessionId, currentQuestion, fetchQuestion, fetchStatus, isLoading, error, isCompleted]);

    return {
        sessionId,
        currentQuestion,
        currentQuestionIndex,
        remainingTime,
        isLoading,
        error,
        isCompleted,
        setError,
        startSession,
        fetchQuestion,
        submitAnswer,
        endSession
    };
};
