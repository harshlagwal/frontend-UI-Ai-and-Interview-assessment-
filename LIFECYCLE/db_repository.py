import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from db_models import DBInterviewSession, DBAnswerEvaluation

# Fallback to local SQLite for easy testing. 
# To use Postgres, set the DATABASE_URL environment variable to: 
# postgresql://postgres:Harsh%40200515@localhost:5432/interview_db
SQLALCHEMY_DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./mock_test.db")



engine = create_engine(
    SQLALCHEMY_DATABASE_URL, 
    # check_same_thread only needed for SQLite
    connect_args={"check_same_thread": False} if "sqlite" in SQLALCHEMY_DATABASE_URL else {}
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

from db_models import Base
try:
    Base.metadata.create_all(bind=engine)
except Exception as e:
    print(f"[DB Integration] Warning: Failed to create tables: {e}")

def save_session_start_to_db(user_id: int) -> int:
    """Save the started session to DB and return the numerical ID."""
    try:
        db = SessionLocal()
        db_session = DBInterviewSession(user_id=user_id, status="IN_PROGRESS")
        db.add(db_session)
        db.commit()
        db.refresh(db_session)
        session_id = db_session.id
        db.close()
        return session_id
    except Exception as e:
        print(f"[DB Integration] Error saving session start: {e}")
        return -1

def save_answer_evaluation_to_db(session_id: int, question_id: str, candidate_answer: str, ai_relevance_score: float, ai_feedback: str):
    """Save an answer provided by candidate to the DB."""
    try:
        db = SessionLocal()
        db_eval = DBAnswerEvaluation(
            session_id=session_id,
            question_id=question_id,
            candidate_answer=candidate_answer,
            ai_relevance_score=ai_relevance_score,
            ai_feedback=ai_feedback
        )
        db.add(db_eval)
        db.commit()
        db.close()
    except Exception as e:
        print(f"[DB Integration] Error saving answer evaluation: {e}")

def update_session_status_in_db(session_id: int, status: str, total_risk_score: float = 0.0):
    """Update the session status upon completion or termination."""
    try:
        db = SessionLocal()
        db_session = db.query(DBInterviewSession).filter(DBInterviewSession.id == session_id).first()
        if db_session:
            db_session.status = status
            db_session.total_risk_score = total_risk_score
            from sqlalchemy.sql import func
            db_session.end_time = func.now()
            db.commit()
        db.close()
    except Exception as e:
        print(f"[DB Integration] Error updating session status: {e}")
