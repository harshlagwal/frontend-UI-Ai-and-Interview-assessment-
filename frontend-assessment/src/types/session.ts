export interface Question {
    questionId: string;
    text: string;
    difficulty: number;
}

export interface Answer {
    questionId: string;
    text: string;
    score: number;
    feedback: string;
}

export interface AssessmentSession {
    sessionId: string;
    dbSessionId?: number;
    candidateId: string;
    startTime: string; // ISO datetime
    currentQuestionIndex: number;
    status: 'active' | 'completed' | 'terminated' | 'timeout';
    questionStartTime: string; // ISO datetime
    score: number;
}

export interface SessionCreateRequest {
    candidateId: string;
}

export interface SubmitAnswerRequest {
    candidateId: string;
    answerText: string;
}

export interface SessionResponse {
    sessionId: string;
    candidateId: string;
    status: string;
    currentQuestionIndex: number;
    message: string;
}

export interface SessionStatus {
    sessionId: string;
    candidateId: string;
    status: string;
    currentQuestionIndex: number;
    score: number;
    timeStarted: string;
    questionStartTime: string;
    remainingTimeSeconds?: number;
}
