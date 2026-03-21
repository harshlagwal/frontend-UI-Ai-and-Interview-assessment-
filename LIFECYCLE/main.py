from fastapi import FastAPI, HTTPException, status
import uvicorn

from models import SessionCreateRequest, SubmitAnswerRequest, SessionResponse
import session_manager


from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Assessment Session Manager API",
              description="Handles the AI assessment session lifecycle, enforcing timeouts and integrating with evaluation.")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"], # Vite default port
    allow_origin_regex="https?://.*",  # Allows generic local networks for testing
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.post("/api/sessions/start", response_model=SessionResponse, status_code=status.HTTP_201_CREATED)
def start_session(request: SessionCreateRequest):
    """
    1. Integrate Session Lifecycle with Backend
    Initializes a new session, generates a session ID, and begins tracking the timer.
    """
    if not request.candidateId:
        raise HTTPException(status_code=400, detail="Candidate ID is required")
    
    session_response = session_manager.initialize_session(
        candidate_id=request.candidateId
    )
    return session_response

@app.get("/api/sessions/{session_id}/question")
def get_next_question(session_id: str):
    """
    3. Enforce Question Timeout Rule (30 minutes)
    Retrieves the candidate's current question, but fails and terminates if the 30-minute timer has expired.
    """
    question = session_manager.get_current_question(session_id)
    if not question:
        session = session_manager.get_session_status(session_id)
        if hasattr(session, "status") and session.status == "terminated":
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Session timed out or has been terminated.")
        elif hasattr(session, "status") and session.status == "completed":
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Session already completed.")
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Session not found or has expired.")
    
    return {"questionId": question.questionId, "text": question.text, "difficulty": question.difficulty}

@app.post("/api/sessions/{session_id}/submit", response_model=SessionResponse)
def submit_candidate_answer(session_id: str, request: SubmitAnswerRequest):
    """
    2. Connect Session Manager with Evaluation System
    Submit the candidate's response and transition to the next question based on the evaluation dynamically.
    """
    if not request.answerText:
        raise HTTPException(status_code=400, detail="Answer text is required")

    response = session_manager.submit_answer(
        session_id=session_id,
        candidate_id=request.candidateId,
        answer_text=request.answerText
    )
    
    if "Session timed out" in response.message:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail=response.message)
        
    return response

@app.post("/api/sessions/{session_id}/terminate", response_model=SessionResponse)
def forcefully_terminate_session(session_id: str, reason: str = "Admin requested"):
    """
    4. Implement Session Termination Logic
    A proctoring engine or administrative backend can forcefully close the session.
    """
    response = session_manager.terminate_session(session_id, reason)
    return response

@app.get("/api/sessions/{session_id}/status")
def view_session_status(session_id: str):
    """
    Get the overall risk score, answers, and session state.
    """
    session = session_manager.get_session_status(session_id)
    if not session:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Session not found")
        
    # Calculate Remaining Time (Production-grade Timer System)
    from datetime import datetime
    elapsed = (datetime.now() - session.questionStartTime).total_seconds()
    # Assuming session_manager.QUESTION_TIMEOUT_MINUTES is total timeout
    remaining = max(0, (session_manager.QUESTION_TIMEOUT_MINUTES * 60) - elapsed)

    return {
        "sessionId": session.sessionId,
        "candidateId": session.candidateId,
        "status": session.status,
        "currentQuestionIndex": session.currentQuestionIndex,
        "score": session.score,
        "timeStarted": session.startTime,
        "questionStartTime": session.questionStartTime,
        "remainingTimeSeconds": int(remaining)
    }

@app.get("/api/sessions/{session_id}/results")
def get_session_results(session_id: str):
    """
    Display evaluation results for candidate. Used by Frontend & Reporting teams.
    """
    session = session_manager.get_session_status(session_id)
    if not session:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Session not found")
        
    return {
        "sessionId": session.sessionId,
        "candidateId": session.candidateId,
        "status": session.status,
        "finalScore": session.score,
        "questionsAttempted": len(session.answers),
    }

@app.get("/api/sessions/{session_id}/answers")
def get_session_answers(session_id: str):
    """
    Retrieve candidate answers with evaluation feedback. Used by Admin Review and Summary teams.
    """
    session = session_manager.get_session_status(session_id)
    if not session:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Session not found")
        
    return {
        "sessionId": session.sessionId,
        "candidateId": session.candidateId,
        "answers": [
            {
                "questionId": ans.questionId,
                "text": ans.text,
                "score": ans.score,
                "feedback": ans.feedback
            }
            for ans in session.answers
        ]
    }

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8001)
