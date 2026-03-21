# 🤖 Unified AI-Powered Interview & Assessment Platform

## 📌 Project Overview
The core objective of this project is to improve the **security and fairness** of online AI-based interviews and assessments. Many existing systems fail to prevent cheating and trigger false warnings due to lighting issues, skin tone variations, or normal human movements.

Our system uses **Artificial Intelligence** to monitor **video, audio, and user behaviour** in real-time. It detects suspicious activities (such as mobile phones, multiple people, abnormal head/eye movements, or background voices) and calculates a **Risk Score** by combining multiple signals, which helps severely reduce false alarms. The result is a secure, reliable, and ethical AI interview monitoring system that ensures fair evaluation and builds trust in online assessments.

---
---

## 👨‍💻 My Role & Contributions (`Harsh Lagwal`)

### **🔹 Task 1: UI & WebRTC Streaming**
*   **Description**: Create the UI for the assessment and interview system and allow mic and camera streaming through the browser.
*   **Module**: Assessment UI Interface
*   **Objective**: Design complete frontend for assessment.
*   **Deliverables**:
    *   • Domain selection page
    *   • Question display page
    *   • Timer display
    *   • Answer text box
    *   • Submit button
    *   • Skip button
    *   *Standard*: Clean and simple UI.

### **🔹 Task 2: System Integration**
*   **Team**: Integration Team 4 – Frontend, Reporting & Data Systems
*   **Team Objective**: Connect frontend UI and reporting systems with backend modules.
*   **Task**: Assessment Interface Backend Connection
*   **Technical Work**:
    *   • Connect frontend UI with FastAPI backend
    *   • Implement API calls for questions and answers

## ⚡ Execution Instructions

You need to execute **3 independent Terminal commands** concurrently to run the full application:

#### **Terminal 1: Node.js Auth Backend**
```bash
cd frontend-assessment/server
npm install
node index.js
```
*The Auth server executes on `http://localhost:5000` (or configured fallback).*

#### **Terminal 2: FastAPI Assessment Backend**
```bash
cd LIFECYCLE
pip install fastapi uvicorn sqlalchemy pydantic
python main.py
```
*The Assessment tracking server executes on `http://localhost:8001`.*

#### **Terminal 3: React Vite Frontend**
```bash
cd frontend-assessment
npm install
npm run dev
```
*The primary Client listens dynamically on `http://localhost:5173`.*

---

## 🚀 API Flow Overview Details

1.  **Session Startup**: `POST /api/sessions/start` registers candidate starting state thresholds returns `session_id`.
2.  **Questions Polling**: `GET /api/sessions/{id}/question` retrieves current dynamically loaded indices.
3.  **Submission Triggering**: `POST /api/sessions/{id}/submit` triggers context grading rollup advances rollover nodes correctly.

---

## 🧪 Future Improvements roadmap

*   **Database unification**: Merge Node.js database queries directly into FastAPI modules to remove redundant middle hops metrics layout.
*   **Scaling Backend capabilities**: Transition FastAPI layers triggers to asynchronous queues optimizing high concurrency node nodes.

---
**Lead Developer Details Configuration Metrics triggers Dashboard**: Harsh Lagwal  
**Email Contact Layout**: [harshlagwal123@gmail.com](mailto:harshlagwal123@gmail.com)  
*Designed for Harsh lagwal.*
