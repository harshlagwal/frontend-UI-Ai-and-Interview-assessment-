import { sessionClient } from './apiClient';
import type { SessionResponse, SubmitAnswerRequest, Question, SessionStatus } from '../types/session';

export const sessionService = {
    /**
     * Initializes a new session.
     */
    async startSession(candidateId: string): Promise<SessionResponse> {
        console.log(`[sessionService] startSession candidateId: ${candidateId}`);
        const { data } = await sessionClient.post<SessionResponse>('/api/sessions/start', {
            candidateId: String(candidateId || "test-user"),
        });
        return data;
    },

    /**
     * Fetches current question in the session.
     */
    async getQuestion(sessionId: string): Promise<Question> {
        const { data } = await sessionClient.get<Question>(`/api/sessions/${sessionId}/question`);
        return data;
    },

    /**
     * Submits an answer to current question.
     */
    async submitAnswer(sessionId: string, request: SubmitAnswerRequest): Promise<SessionResponse> {
        console.log(`[sessionService] submitAnswer sessionId: ${sessionId}, request:`, request);
        const { data } = await sessionClient.post<SessionResponse>(`/api/sessions/${sessionId}/submit`, {
             candidateId: String(request.candidateId || "test-user"),
             answerText: String(request.answerText || "")
        });
        return data;
    },

    /**
     * Views session state/status overall.
     */
    async getStatus(sessionId: string): Promise<SessionStatus> {
        const { data } = await sessionClient.get<SessionStatus>(`/api/sessions/${sessionId}/status`);
        return data;
    },

    /**
     * Gets session final or summary results.
     */
    async getResults(sessionId: string) {
        const { data } = await sessionClient.get(`/api/sessions/${sessionId}/results`);
        return data;
    },

    /**
     * Terminates a session forcefully.
     */
    async terminateSession(sessionId: string, reason = "User requested") {
        const { data } = await sessionClient.post(`/api/sessions/${sessionId}/terminate`, null, {
            params: { reason }
        });
        return data;
    }
};
