# Professional AI Interview & Assessment Platform

This repository contains a cutting-edge full-stack assessment platform. It features a secure, Google Meet-style interview dashboard, real-time AI proctoring, and a comprehensive assessment module designed for technical and domain-based evaluations.

## 🌟 Key Features

### 🛡️ AI Proctoring & Security
- **Secure Environment**: Automatic fullscreen enforcement with violation tracking (5 strikes rule).
- **Activity Monitoring**: Detection of tab switching, focus loss, and unauthorized background activity.
- **Interaction Control**: Blocking of right-click, developer tools (F12), and restricted hotkeys.
- **Multi-Tab Prevention**: Singleton session management using `BroadcastChannel`.

### 🎥 Interview Dashboard
- **WebRTC Integration**: High-performance video/audio streaming with live proctoring overlays.
- **Draggable UI**: Floating proctoring panel for a customized viewing experience.
- **Premium Aesthetics**: Glassmorphism design with dynamic light/dark mode support.

### 📝 Assessment Module
- **Domain Selection**: Tailored assessment paths (e.g., Frontend, Backend, Java, Python).
- **Advanced Timer**: 40-minute session limit with urgent state warnings (last 5 minutes).
- **Question Engine**: Dynamic question loading with professional feedback and submission flows.
- **Success Modal**: High-impact submission confirmation with success animations.

---

## 🏗️ Project Structure

```text
frontend-assessment/
├── server/               # Node.js/Express Backend
│   ├── auth.js           # JWT-based Authentication Logic
│   ├── db.js             # PostgreSQL Connection & Schema
│   └── index.js          # API Entry Point
├── src/                  # React/Vite Frontend
│   ├── assessment/       # Assessment Module (Timer, Questions, Layout)
│   ├── components/       # UI Components (Auth, Dashboard, Proctored Panels)
│   ├── context/          # State Management Providers
│   ├── services/         # API abstraction layer
│   └── App.tsx           # Main Application Router
├── public/               # Static Assets & Icons
└── interview_db_final_structure.sql  # Database Schema Export
```

---

## 🛠️ Installation & Setup

### 1. Prerequisites
- **Node.js**: v18+
- **PostgreSQL**: Database named `interview_db`

### 2. Database Initialization
1. Create the database: `CREATE DATABASE interview_db;`
2. Import schema:
   ```bash
   psql -U your_user -d interview_db -f interview_db_final_structure.sql
   ```

### 3. Environment Configuration
Create a `.env` file in the `server/` directory:
```env
DB_USER=your_postgres_user
DB_PASSWORD=your_password
DB_HOST=localhost
DB_PORT=5432
DB_NAME=interview_db
JWT_SECRET=your_jwt_secret
PORT=5000
```

### 4. Running the App
**Terminal 1 (Backend)**:
```bash
cd server
npm install
npm start
```

**Terminal 2 (Frontend)**:
```bash
npm install
npm run dev
```

---

## 🚀 Tech Stack
- **Frontend**: React 18, Vite, TypeScript, Tailwind CSS, Lucide Icons, Framer Motion.
- **Backend**: Node.js, Express, Postgres (pg), JsonWebToken.
- **Deployment**: Optimized for modern Vercel/Render workflows.

---

## 📧 Contact & Repository
- **Lead Developer**: Harsh Lagwal
- **Email**: [harshlagwal123@gmail.com](mailto:harshlagwal123@gmail.com)
- **Repository**: [Frontend UI AI & Interview Assessment](https://github.com/harshlagwal/frontend-UI-Ai-and-Interview-assessment-)

---
*Developed for professional excellence in engineering assessments.*
