from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Text, Numeric
from sqlalchemy.orm import declarative_base, relationship
from sqlalchemy.sql import func

Base = declarative_base()

class DBUser(Base):
    __tablename__ = 'users'
    id = Column(Integer, primary_key=True, autoincrement=True)
    username = Column(String, nullable=False)
    email = Column(String, nullable=False, unique=True)
    password_hash = Column(Text, nullable=False)
    full_name = Column(String, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class DBInterviewSession(Base):
    __tablename__ = 'interview_sessions'
    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey('users.id'), nullable=False)
    start_time = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    end_time = Column(DateTime(timezone=True), nullable=True)
    total_risk_score = Column(Numeric(5, 2), default=0.00)
    status = Column(String, default='IN_PROGRESS')

    evaluations = relationship("DBAnswerEvaluation", backref="session")

class DBAnswerEvaluation(Base):
    __tablename__ = 'answer_evaluations'
    id = Column(Integer, primary_key=True, autoincrement=True)
    session_id = Column(Integer, ForeignKey('interview_sessions.id'), nullable=False)
    question_id = Column(String, nullable=True)
    candidate_answer = Column(Text, nullable=True)
    ai_relevance_score = Column(Numeric(5, 2), nullable=True)
    ai_feedback = Column(Text, nullable=True)
