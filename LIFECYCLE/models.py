from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime
import uuid

class Question(BaseModel):
    questionId: str = Field(default_factory=lambda: str(uuid.uuid4()))
    text: str
    difficulty: int = 1

class Answer(BaseModel):
    questionId: str
    text: str
    score: float = 0.0
    feedback: str = ""

class AssessmentSession(BaseModel):
    sessionId: str = Field(default_factory=lambda: str(uuid.uuid4()))
    dbSessionId: Optional[int] = None
    candidateId: str
    startTime: datetime = Field(default_factory=datetime.utcnow)
    currentQuestionIndex: int = 0
    questions: List[Question]
    answers: List[Answer] = []
    status: str = "active" # active, completed, terminated, timeout
    questionStartTime: datetime = Field(default_factory=datetime.utcnow)
    score: float = 0.0

class SessionCreateRequest(BaseModel):
    candidateId: str

class SubmitAnswerRequest(BaseModel):
    candidateId: str
    answerText: str

class SessionResponse(BaseModel):
    sessionId: str
    candidateId: str
    status: str
    currentQuestionIndex: int
    message: str = ""
