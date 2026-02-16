# Professional Interview & Assessment Platform

This repository contains a full-stack assessment platform featuring a secure, Google Meet-style interview dashboard with WebRTC integration, real-time security monitoring, and a professional dark/light themed UI.

## 🌟 Key Features

- **WebRTC Video/Audio**: Stable singleton-based media stream management.
- **Secure Environment**:
  - Fullscreen enforcement and violation tracking.
  - Tab switch and focus loss detection.
  - Development tools (F12) and hotkey blocking.
  - Multi-tab prevention via `BroadcastChannel`.
- **Professional Dashboard**: Opaque, high-contrast UI for clear data presentation.
- **Full Authentication**: Secure Login and Signup flow with JWT.
- **Dynamic Theming**: Smooth transition between premium Light and Dark modes.

---

## 🏗️ Project Structure

```text
frontend-assessment/
├── server/            # Backend Node.js/Express API
│   ├── auth.js        # Authentication logic (JWT)
│   ├── db.js          # Database connection & schema init
│   └── index.js       # Main server entry point
├── src/               # Frontend React/Vite source
│   ├── components/    # Reusable UI components (Auth, Dashboard, etc.)
│   └── services/      # API communication services
└── public/            # Static assets
```

---

## 🛠️ Installation & Setup

### 1. Prerequisites
- **Node.js**: v18 or later
- **PostgreSQL**: A running instance with a database named `interview_db`

### 2. Database Setup
1. Open your PostgreSQL terminal or tool (like pgAdmin).
2. Create the database: `CREATE DATABASE interview_db;`.
3. Import the provided schema:
   ```bash
   psql -U your_postgres_user -d interview_db -f interview_db_final_structure.sql
   ```
   *The server will also automatically initialize basic tables (users, feedback) if the file is not imported.*

### 3. Backend Configuration
1. Navigate to the server directory:
   ```bash
   cd server
   ```
2. Create a `.env` file (refer to `.env.example` in the server folder):
   ```env
   DB_USER=your_postgres_user
   DB_PASSWORD=your_postgres_password
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=interview_db
   JWT_SECRET=your_super_secret_key
   PORT=5000
   ```
3. Install dependencies:
   ```bash
   npm install
   ```

### 4. Frontend Configuration
1. Navigate to the root folder:
   ```bash
   cd ..
   ```
2. Install dependencies:
   ```bash
   npm install
   ```

---

## 🚀 Running the Application

You need to run **both** the backend and the frontend simultaneously in two different terminals.

### Start the Backend
```bash
cd server
npm start
```
*The server will run on `http://localhost:5000`*

### Start the Frontend
Open a **new terminal** window:
```bash
# From the root directory (frontend-assessment)
npm run dev
```
*The app will run on `http://localhost:5173` (or the next available port)*

---

## 💻 Tech Stack
- **Frontend**: React 18, Vite, TypeScript, Tailwind CSS, Lucide Icons.
- **Backend**: Node.js, Express, JWT, Bcrypt.
- **Database**: PostgreSQL.

---

## 📧 Contact Information
- **Portfolio/GitHub**: [harshlagwal](https://github.com/harshlagwal)
- **Gmail**: [harshlagwal123@gmail.com](mailto:harshlagwal123@gmail.com)
- **Project Link**: [GitHub Repository](https://github.com/harshlagwal/frontend-UI-Ai-and-Interview-assessment-)

---
*Built for excellence in engineering and assessment.*
