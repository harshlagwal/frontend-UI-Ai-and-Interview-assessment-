# 🤖 Unified AI-Powered Interview & Assessment Platform

## 📌 Project Overview
The core objective of this project is to improve the **security and fairness** of online AI-based interviews and assessments. Many existing systems fail to prevent cheating and trigger false warnings due to lighting issues, skin tone variations, or normal human movements.

Our system uses **Artificial Intelligence** to monitor **video, audio, and user behaviour** in real-time. It detects suspicious activities (such as mobile phones, multiple people, abnormal head/eye movements, or background voices) and calculates a **Risk Score** by combining multiple signals, which helps severely reduce false alarms. The result is a secure, reliable, and ethical AI interview monitoring system that ensures fair evaluation and builds trust in online assessments.

---

## 🔬 AI Dashboard Framework (AI Pipeline)

### 📹 1. Object Detection (`YOLOv8`)
*   **Purpose**: Detect unfair activities using the camera in real-time.
*   **Action**: Identifies suspicious objects (mobile phones, restricted items) and multiple persons in the frame. Helps the system verify candidate transparency.

### 👁️ 2. Face Movement & Pose Tracking (`OpenCV`)
*   **Purpose**: Track candidate behaviour and posture with webcam.
*   **Action**: Tracks face position, head turns, and posture to catch excessive looking away without flagging normal human movement errors.

### 🎙️ 3. Speech-to-Text (`Whisper Model`)
*   **Purpose**: Monitor spoken content during the interview stream.
*   **Action**: Converts live microphone audio to text. Detects background voices and captures content for later answer evaluation.

### 📝 4. Intelligent Answer Evaluation (`GPT / LLM` - Optional)
*   **Purpose**: Score interview answers intelligently and accurately.
*   **Action**: Generates a relevance score by comparing spoken answers against expected responses (context over template matches).

---

## 🏗️ Core Engineering Stack

### 💻 Frontend (`React`, `HTML/CSS`, `WebRTC`)
*   **Framework Interface**: Smart proctoring dashboard panel aggregates overlay metrics cleanly.
*   **Media Access**: WebRTC capture nodes capture live micro-panel feeds securely triggers layout.

### ⚙️ Backend & AI Controllers (`FastAPI`, `Python`)
*   **Pipeline Control**: Connects AI models seamlessly with frontend streams rollout heartbeats triggers aggregate.
*   **Risk Evaluation triggers aggregates metrics setup setup:**: Central scoring aggregation timeout handles rollbacks setup rollback setup indices accurately.

### 📊 DB Structure (`PostgreSQL`)
*   **Data Aggregation setup trackers setup**: candidate information trackers logs aggregated rollback triggers setup layout configuration accurate setup metrics tracks layout index setup trackers setup metrics tracks layout index setup trackers setup.

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
