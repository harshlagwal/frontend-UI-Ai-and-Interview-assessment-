# Premium Interview & Assessment Dashboard

A high-performance, secure, and professional frontend assessment platform designed for recruiters and candidates. This project simulates a real-world interview environment with enhanced security features and WebRTC capabilities.

## 🚀 The Task
The goal was to build a secure, Google Meet-style interview dashboard that ensures integrity during remote assessments. This involves managing media streams, preventing unauthorized user actions, and providing a premium user experience with both light and dark modes.

## ✨ Key Features
- **WebRTC Integration**: Seamless camera and microphone management using singleton patterns for stability.
- **Secure Screen Sharing**: Controlled screen sharing that automatically re-enforces fullscreen mode.
- **Security & Integrity**:
  - **Fullscreen Enforcement**: Detects and logs when a user exits fullscreen.
  - **Tab/Window Detection**: Monitors visibility changes and focus loss to prevent cheating.
  - **Multi-Tab Prevention**: Uses `BroadcastChannel` to ensure only one active session exists.
  - **Hotkey Blocking**: Restricts developer tools (F12) and common keyboard shortcuts.
- **Premium Design**:
  - **Dynamic Theme Support**: Toggle between sleek Dark Mode and high-contrast Light Mode.
  - **Glassmorphic UI**: Modern aesthetic with Lucide-React icons and smooth animations (Tailwind CSS 4.0).
  - **Responsive Layout**: Designed to work across different screen sizes with a focus on usability.

## 🛠️ How to Run the Project

Follow these steps to set up and run the project locally:

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/harshlagwal/frontend-UI-Ai-and-Interview-assessment-.git
   cd frontend-assessment
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Start the Development Server**:
   ```bash
   npm run dev
   ```

4. **Build for Production**:
   ```bash
   npm run build
   ```

---

## 📧 Contact Information
- **Portfolio/GitHub**: [harshlagwal](https://github.com/harshlagwal)
- **Gmail**: [harshlagwal123@gmail.com](mailto:harshlagwal123@gmail.com)
- **Project Link**: [GitHub Repository](https://github.com/harshlagwal/frontend-UI-Ai-and-Interview-assessment-)

---
*Built with ❤️ using React, TypeScript, and Vite.*
