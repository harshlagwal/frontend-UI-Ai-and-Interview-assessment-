from typing import Dict, List, Optional
from datetime import datetime, timedelta
import uuid

from models import AssessmentSession, Question, SessionResponse, Answer
from evaluation_system import evaluate_answer, adjust_difficulty
import db_repository

# In-memory session store (replace with PostgreSQL tracking logic later)
active_sessions: Dict[str, AssessmentSession] = {}

QUESTION_TIMEOUT_MINUTES = 30
TOTAL_QUESTIONS = 5

MOCK_QUESTION_BANK = {
    1: ["What is polymorphism in Object-Oriented Programming?", "Explain the difference between a list and a tuple in Python."],
    2: ["How does an HTTP GET request differ from POST?", "Describe the purpose of indexing in a database."],
    3: ["Explain the consensus mechanism in distributed systems.", "How would you design a scalable web scraper?"]
}

def generate_question(difficulty: int) -> Question:
    import random
    # Select random question from the difficulty tier
    # Real implementation would query a DB
    questions_at_diff = MOCK_QUESTION_BANK.get(difficulty, MOCK_QUESTION_BANK[1])
    text = random.choice(questions_at_diff)
    return Question(text=text, difficulty=difficulty)

def initialize_session(candidate_id: str) -> SessionResponse:
    """Start an assessment session and allocate initial questions"""
    session_id = str(uuid.uuid4())
    first_question = generate_question(difficulty=1)
    
    try:
        user_id = int(candidate_id)
    except ValueError:
        user_id = 9999 # mock user account mapping for demo / raw UUID test strings
        
    db_session_id = db_repository.save_session_start_to_db(user_id=user_id)
    
    session = AssessmentSession(
        sessionId=session_id,
        dbSessionId=db_session_id if db_session_id > 0 else None,
        candidateId=candidate_id,
        startTime=datetime.now(),
        currentQuestionIndex=0,
        questions=[first_question],
        status="active",
        questionStartTime=datetime.now()
    )
    active_sessions[session_id] = session
    
    return SessionResponse(
        sessionId=session.sessionId,
        candidateId=session.candidateId,
        status=session.status,
        currentQuestionIndex=session.currentQuestionIndex,
        message="Session successfully started!"
    )

def check_timeout(session: AssessmentSession) -> bool:
    """Enforce the 30-minute question timeout rule"""
    elapsed = datetime.now() - session.questionStartTime
    if elapsed.total_seconds() > (QUESTION_TIMEOUT_MINUTES * 60):
        # We enforce a timeout by failing this question or terminating
        session.status = "terminated"
        if session.dbSessionId is not None:
            db_repository.update_session_status_in_db(session.dbSessionId, "TIMEOUT", session.score)
        return True
    return False

def get_current_question(session_id: str) -> Optional[Question]:
    """Retrieve the current question, enforcing timeouts"""
    session = active_sessions.get(session_id)
    if not session:
        return None
    
    if session.status != "active":
        return None # Return nothing if already terminated/completed
        
    if check_timeout(session):
        return None # The check modified the session status to terminated
        
    if session.currentQuestionIndex < len(session.questions):
        return session.questions[session.currentQuestionIndex]
    return None

def submit_answer(session_id: str, candidate_id: str, answer_text: str) -> SessionResponse:
    """Process a submitted answer and update session state"""
    session = active_sessions.get(session_id)
    if not session or session.candidateId != candidate_id:
        return SessionResponse(sessionId=session_id, candidateId=candidate_id, status="error", currentQuestionIndex=0, message="Session valid not found")
        
    if session.status != "active":
        return SessionResponse(
             sessionId=session.sessionId,
             candidateId=session.candidateId,
             status=session.status,
             currentQuestionIndex=session.currentQuestionIndex,
             message="Session is no longer active."
        )

    # Check for timeout before accepting answer
    if check_timeout(session):
        return SessionResponse(
             sessionId=session.sessionId,
             candidateId=session.candidateId,
             status=session.status,
             currentQuestionIndex=session.currentQuestionIndex,
             message="Question timed out. Session terminated."
        )

    # All checks passed, evaluate answer
    current_q = session.questions[session.currentQuestionIndex]
    
    # -------------------------------------------------------------
    # 2. Connect Session Manager with Evaluation System Layer
    # -------------------------------------------------------------
    score, feedback = evaluate_answer(
        question_text=current_q.text,
        answer_text=answer_text,
        candidate_id=candidate_id,
        difficulty=current_q.difficulty
    )
    
    session.answers.append(Answer(
        questionId=current_q.questionId,
        text=answer_text,
        score=score,
        feedback=feedback
    ))
    
    if session.dbSessionId is not None:
        db_repository.save_answer_evaluation_to_db(
            session_id=session.dbSessionId,
            question_id=current_q.questionId,
            candidate_answer=answer_text,
            ai_relevance_score=score,
            ai_feedback=feedback
        )
    
    session.score += score
    session.currentQuestionIndex += 1

    # End session if max questions reached
    if session.currentQuestionIndex >= TOTAL_QUESTIONS:
        session.status = "completed"
        if session.dbSessionId is not None:
            db_repository.update_session_status_in_db(session.dbSessionId, "COMPLETED", session.score)
            
        return SessionResponse(
            sessionId=session.sessionId,
            candidateId=session.candidateId,
            status=session.status,
            currentQuestionIndex=session.currentQuestionIndex,
            message=f"Assessment Complete. Final Score: {session.score:.2f}"
        )
        
    # Generate next question with adjusted difficulty
    new_diff = adjust_difficulty(current_q.difficulty, score)
    next_question = generate_question(new_diff)
    session.questions.append(next_question)
    session.questionStartTime = datetime.now() # Reset timeout timer

    return SessionResponse(
         sessionId=session.sessionId,
         candidateId=session.candidateId,
         status=session.status,
         currentQuestionIndex=session.currentQuestionIndex,
         message="Answer recorded successfully."
    )

def terminate_session(session_id: str, reason: str = "Administrator intervention") -> SessionResponse:
    """
    4. Implement Session Termination Logic
    Ends a session abruptly (e.g., cheating detected, manual stop).
    """
    session = active_sessions.get(session_id)
    if not session:
        return SessionResponse(sessionId=session_id, candidateId="unknown", status="error", currentQuestionIndex=0, message="Session not found")
        
    session.status = "terminated"
    if session.dbSessionId is not None:
        db_repository.update_session_status_in_db(session.dbSessionId, "TERMINATED", session.score)
        
    return SessionResponse(
        sessionId=session.sessionId,
        candidateId=session.candidateId,
        status="terminated",
        currentQuestionIndex=session.currentQuestionIndex,
        message=f"Session terminated: {reason}"
    )

def get_session_status(session_id: str) -> Optional[AssessmentSession]:
    """Admin function to poll current session state"""
    session = active_sessions.get(session_id)
    if session and session.status == "active":
        check_timeout(session) # Lazily update timeout
    return session
