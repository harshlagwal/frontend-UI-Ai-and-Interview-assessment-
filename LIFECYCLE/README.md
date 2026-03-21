# AI Assessment Session Management Integration (Module 1)

**Task Assigned To:** Kota OmSrikar  
**Integration Phase:** Team 1 – Core Backend System Integration

This repository contains the completed logic for the **Assessment Session Management Integration** layer. It connects the interview start state, active candidate timer (30-minute rule constraint), grading pipeline, and final cleanup into the PostgreSQL database tracking tables.

## 🚀 Overview of Features Implemented
1. **Integrate session lifecycle with backend:**
   - Starts generating new assessments assigning `uuid` tracking for frontend testing and assigning the official `interview_sessions` Postgres primary key (`dbSessionId`) for the team.  
2. **Connect session manager with evaluation system:**
   - Routes frontend answers via `submit_answer` into the Evaluation layer (`evaluate_answer` in `evaluation_system.py`) to adjust difficulties and pull grading/feedback strings before pushing it into the DB via `save_answer_evaluation_to_db`.
3. **Enforce question timeout rule (30 minutes):**
   - Implemented a timer layer. If an assessment query takes longer than 30 minutes, it automatically cascades a closure reporting `"TIMEOUT"` back to the Postgres tracking tables and terminating the active session manager cache.
4. **Implement session termination logic:**
   - Administrative endpoint handles manual interventions (cheating/browser quit) dynamically writing `"TERMINATED"` rules to the database and cleanly removing them from the cache.

## 📁 File Structure

1. **`models.py`**  
   *Pydantic Models*: Contains the data shapes for `AssessmentSession`, `Question`, and `Answer`. It connects HTTP Request/Response bodies cleanly using FastAPI.
2. **`main.py`**   
   *FastAPI Gateway*: The actual endpoints UI/Frontend uses to talk to this task's module. Includes custom routes required for extracting final reports dynamically.
3. **`session_manager.py`**   
   *Business Core*: Your actual task. Holds state, timeout rules, randomized mock questions, and triggers to update the Postgres databases.
4. **`db_models.py`**   
   *SQLAlchemy Setup*: Directly mirrors the `interview_db_final_structure.sql` structure. Holds `users`, `interview_sessions`, and `answer_evaluations` representations. 
5. **`db_repository.py`**   
   *PostgreSQL Integration Engine*: Commits start triggers, candidate answer inserts, and status terminations locally to SQLite while Docker/AWS dependencies are finalized, so the logic does not break!
6. **`evaluation_system.py`**  
   *AI Stub*: Mock system meant to interface with the eventual LLM inference module to assign scores and contextual feedback.

## ⚡ Usage & API Guide

To test the Assessment Interface Backend connection locally (required for Frontend, Reporting, Analytics, and Evaluation integration teams):
```bash
pip install fastapi uvicorn pydantic sqlalchemy
python main.py
```
Open `http://localhost:8001/docs` in your browser.

### Key Integrated Endpoints
* **Start Session:** `POST /api/sessions/start` 
  * Returns `sessionId`. Registers `IN_PROGRESS` log into Postgres.
* **Get Next Question:** `GET /api/sessions/{session_id}/question`
  * Validates the 30-minute rule rule organically. 
* **Submit Answer:** `POST /api/sessions/{session_id}/submit`
  * Passes text to Evaluate API, stores response iteratively to DB, checks for test `COMPLETED` flag.
* **Kill Session:** `POST /api/sessions/{session_id}/terminate`
  * Admin backend intervention endpoint.
* **Results / Review (Evaluation & Reporting Integration):** `GET /api/sessions/{session_id}/results` and `/answers`
  * Dedicated views built specifically to populate candidate-side analytics, reviewer interfaces, and final reports dynamically fetching from this module's active arrays.
  
---
**Dependencies Required by Environment:**
* `fastapi`
* `uvicorn`
* `sqlalchemy`
* `pydantic`
