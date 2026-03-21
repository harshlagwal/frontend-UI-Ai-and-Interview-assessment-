# Unified AI Interview & Assessment Platform (Full-Stack)

This repository contains a cutting-edge, full-stack platform designed for modern technical recruitment. It combines a secure Google Meet-style interview dashboard, live WebRTC proctoring trackers, and a comprehensive backend-driven assessment engine offering real-time tracking and grading.

---

## 🌟 Key Modules & Features

### 🛡️ 1. AI Proctoring & Security Control
*   **Secure Environment Rules**: Automatic full-screen enforcement with violation tracking (5 strikes cap rule).
*   **Activity Monitoring**: Detection of tab switching, window focus loss, and unauthorized background noise node behavior.
*   **Interaction Restrictions**: Blocked mouse Right-clicks, restricted hotkeys, and F12 inspect constraints layout.
*   **Multi-Tab Prevention**: Singleton session management using local `BroadcastChannel` streams trackers node.

### 🎥 2. Live Interview Dashboard
*   **WebRTC Integration**: High-performance client-side camera metadata integration streams overlays node.
*   **Draggable UI Panel**: Smart Proctoring Dashboard feeds can hover dynamically customized layout positions.
*   **Premium Quality Design**: Elegant Glassmorphism design tokens layout containing complete dark mode layout integrations setup node metrics.

### 📝 3. Synchronized Assessment Engine
*   **Domain Paths Selection**: Dynamically tailored assessments paths (Frontend, Python, Java, etc.).
*   **Production-Grade Timer**: Centralised distributed background timers calculation enforced flawlessly bypassing local client-clock disparities nodes safely.
*   **Dynamic Questions allocation**: Fetches questions iteratively triggers state grading flows rollback triggers setup node configuration.

---

## 🏗️ Architecture & Structure

```text
App Root/
├── LIFECYCLE/            # FastAPI Backend (Session & Lifecycle Management)
│   ├── main.py           # FastAPI gateway & Endpoint aggregates
│   ├── session_manager.py# Heartbeat timeout logic & dynamic allocation arrays
│   └── db_repository.py  # SQLite/PostgreSQL Session DB handlers
├── frontend-assessment/  # Frontend ecosystem split
│   ├── server/           # Node.js Express Authentication Backend
│   │   ├── auth.js       # JWT Login/Signup handlers
│   │   ├── db.js         # PostgreSQL connection routers setup
│   │   └── index.js      # API Entry Point index
│   └── src/              # React (Vite) Frontend layout nodes
```

---

## 🛠️ Installation & Setup Prerequisites

1.  **Node.js**: `v18+`
2.  **Python**: `v3.9+` (FastAPI lifecycle processes)
3.  **PostgreSQL**: Setup `interview_db` (or falls back to built-in fallback nodes local SQLite during testing phase).

### Database setup Node:
1. Create Database: `CREATE DATABASE interview_db;`
2. Import triggers schema:
   ```bash
   psql -U your_user -d interview_db -f LIFECYCLE/interview_db_final_structure.sql
   ```

---

## ⚡ Execution Instructions

You need to execute **3 independent Terminal commands** concurrently to run the full split application:

#### **Terminal 1: Node.js Auth Backend**
```bash
cd frontend-assessment/server
npm install
node index.js
```
*The Auth server executes on `http://localhost:5000` (or similar configured fallback).*

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
*The primary Client listens dynamically on setup `http://localhost:5173`.*

---

## 🚀 API Flow Overview Details

1.  **Session Startup**: `POST /api/sessions/start` registers candidate starting state thresholds returns `session_id`.
2.  **Questions Polling**: `GET /api/sessions/{id}/question` retrieves current dynamically loaded indices.
3.  **Submission Triggering**: `POST /api/sessions/{id}/submit` triggers context grading rollup advances rollover nodes correctly.

---

## 🧪 Future Improvements roadmap

*   **Database unification**: Merge Node.js database queries directly into FastAPI modules to remove redundant middle hops metrics layout.
*   **Scaling Backend capabilities**: Transition FastAPI layers triggers to asynchronous queues optimizing high concurrency node nodes.
*   **Reliability structures**: Introduce automated retry triggers on status synchroniser requests nodes layout index metrics accurately.
*   **Log setups metrics tracker**: Insert centralized Logging and metric captures tracers index setup configuration.

---
**Lead Developer**: Harsh Lagwal  
**Email Contact Layout**: [harshlagwal123@gmail.com](mailto:harshlagwal123@gmail.com)  
*Designed for Harsh lagwal.*
