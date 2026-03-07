import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronRight, SkipForward, Send, ShieldCheck } from 'lucide-react';
import SubmissionModal from './SubmissionModal';

const QuestionPage = () => {
    const { domain, id } = useParams();
    const navigate = useNavigate();
    const [answer, setAnswer] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);

    const questionNumber = parseInt(id) || 1;
    const totalQuestions = 10;

    const questionBank = {
        frontend: [
            "Explain the concept of 'lifting state up' in React. When is it necessary?",
            "What are the key differences between Server-Side Rendering (SSR) and Incremental Static Regeneration (ISR)?",
            "How do you optimize a React application that is experiencing performance bottlenecks?",
            "Explain the CSS Box Model and how 'box-sizing: border-box' changes it.",
            "What are the benefits of using TypeScript in a large-scale frontend project?",
            "How does the React Virtual DOM work to optimize UI updates?",
            "Explain the difference between 'useEffect' and 'useLayoutEffect'.",
            "How do you handle global state management in a modern React application?",
            "What is the purpose of 'React.memo' and when should it be avoided?",
            "Describe how you would implement a responsive, accessible navigation component."
        ],
        backend: [
            "Explain the differences between SQL and NoSQL databases. When would you choose one over the other?",
            "What is the role of middleware in a Node.js/Express application?",
            "How do you ensure data security and prevent SQL injection in a backend API?",
            "Describe the CAP theorem and its implications for distributed systems design.",
            "How would you implement a rate-limiting mechanism for a public API?",
            "Explain the concept of Connection Pooling in database management.",
            "What are the advantages of using a Message Queue like RabbitMQ or Kafka in a microservices architecture?",
            "How do you handle database migrations in a production environment?",
            "Describe the process of JWT-based authentication and how to securely store tokens.",
            "How would you optimize a slow database query in a PostgreSQL environment?"
        ],
        fullstack: [
            "Describe the end-to-end flow of a user request from the browser to the database and back.",
            "How do you coordinate state between a frontend client and a backend server using WebSockets?",
            "What are the key challenges in maintaining consistency between a frontend UI and a backend source of truth?",
            "Explain how you would implement a file upload system with progress tracking.",
            "How do you approach testing a full-stack feature (unit, integration, and E2E)?",
            "Describe the benefits of using a monorepo structure for full-stack projects.",
            "How would you implement Server-Sent Events (SSE) for real-time updates?",
            "What is the role of an API Gateway in a modern full-stack architecture?",
            "How do you handle CORS issues in a local development vs. production environment?",
            "Explain the strategic choice between GraphQL and REST for a new full-stack project."
        ],
        uiux: [
            "What are the core principles of accessible design (WCAG), and why are they important?",
            "Explain the concept of 'Visual Hierarchy' and how to achieve it in a layout.",
            "How do you balance aesthetic appeal with functional usability in design?",
            "Describe your process for conducting user research and gathering feedback.",
            "What is the importance of 'Micro-interactions' in enhancing user experience?",
            "How do you design for different screen sizes and orientations (Responsive vs. Adaptive)?",
            "Explain the 'Gestalt Principles' and how they apply to UI design.",
            "What is 'Design System' and how does it help in maintaining consistency?",
            "How do you handle color contrast and readability for users with visual impairments?",
            "Describe the process of wireframing vs. prototyping and when to use each."
        ],
        security: [
            "Explain the difference between Symmetric and Asymmetric encryption.",
            "What is a 'Man-in-the-Middle' (MITM) attack and how can it be prevented?",
            "How does Cross-Site Scripting (XSS) work and what are the various types?",
            "What is Cross-Site Request Forgery (CSRF) and how do anti-CSRF tokens work?",
            "Explain the principle of 'Least Privilege' in access control management.",
            "What is the purpose of a Web Application Firewall (WAF)?",
            "How do you securely store user passwords in a database?",
            "Explain the concept of 'Defense in Depth' in cybersecurity.",
            "What are 'Zero-Day' vulnerabilities and how should organizations respond to them?",
            "Describe the difference between OAuth 2.0 and OpenID Connect (OIDC)."
        ],
        devops: [
            "What is Infrastructure as Code (IaC) and what are its primary benefits?",
            "Explain the difference between Continuous Integration (CI) and Continuous Deployment (CD).",
            "How do Docker containers differ from Virtual Machines (VMs)?",
            "What is the role of Kubernetes in container orchestration?",
            "How would you implement a zero-downtime deployment strategy (e.g., Blue-Green)?",
            "Describe the benefits of using Serverless architecture (e.g., AWS Lambda).",
            "How do you monitor application performance and logs in a cloud environment?",
            "What is the purpose of a 'Health Check' in a load-balanced environment?",
            "Explain the concept of 'GitOps' and how it simplifies deployments.",
            "How do you manage secrets (e.g., API keys) securely in a CI/CD pipeline?"
        ]
    };

    const currentDomainQuestions = questionBank[domain] || questionBank['frontend'];
    const questionText = currentDomainQuestions[questionNumber - 1] || currentDomainQuestions[0];

    const handleNext = () => {
        if (questionNumber < totalQuestions) {
            navigate(`/assessment/question/${domain}/${questionNumber + 1}`);
            setAnswer('');
        } else {
            setIsModalOpen(true);
        }
    };

    const handleSkip = () => {
        if (questionNumber < totalQuestions) {
            navigate(`/assessment/question/${domain}/${questionNumber + 1}`);
            setAnswer('');
        }
    };

    const handleFinish = () => {
        navigate('/');
    };

    return (
        <div className="flex-1 flex flex-col items-center justify-center animate-fade-in relative z-10 px-6">
            <SubmissionModal isOpen={isModalOpen} onConfirm={handleFinish} />

            <div className="w-full max-w-2xl">
                {/* Simplified Header Indicator */}
                <div className="mb-10 flex flex-col items-center text-center">

                    <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-semibold text-[var(--text-primary)] tracking-tight">{questionNumber}</span>
                        <span className="text-[var(--text-secondary)] text-base font-medium">/ {totalQuestions}</span>
                    </div>
                </div>

                {/* Refined Question Card */}
                <div
                    key={id}
                    className="w-full p-10 md:p-12 bg-[var(--bg-secondary)] border border-[var(--glass-border)] rounded-[1.5rem] shadow-2xl flex flex-col relative overflow-hidden"
                >
                    <div className="mb-10 relative">
                        <p className="text-lg md:text-xl font-medium text-[var(--text-primary)] leading-relaxed tracking-tight">
                            {questionText}
                        </p>
                    </div>

                    <div className="relative">
                        <textarea
                            value={answer}
                            onChange={(e) => setAnswer(e.target.value)}
                            placeholder="Type your response here..."
                            className="w-full h-44 bg-[var(--bg-primary)]/50 text-[var(--text-primary)] border border-[var(--glass-border)] rounded-xl py-4 px-5 text-[15px] font-normal placeholder:text-[var(--text-muted)] outline-none focus:border-indigo-500/30 transition-all resize-none leading-relaxed"
                        />
                    </div>

                    {/* Footer Controls */}
                    <div className="mt-10 flex items-center justify-between">
                        <button
                            onClick={handleSkip}
                            className="px-4 py-2 rounded-lg text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-all text-[11px] font-bold uppercase tracking-widest flex items-center gap-2 group"
                        >
                            Skip Phase
                            <SkipForward size={14} className="opacity-40 group-hover:opacity-100 transition-all" />
                        </button>

                        <button
                            onClick={handleNext}
                            className="px-8 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold transition-all duration-300 text-[11px] uppercase tracking-widest flex items-center gap-2 shadow-lg shadow-indigo-600/20 active:scale-95"
                        >
                            {questionNumber === totalQuestions ? 'Finalize' : 'Next Question'}
                            {questionNumber === totalQuestions ? <Send size={14} /> : <ChevronRight size={14} />}
                        </button>
                    </div>
                </div>


            </div>
        </div>
    );
};

export default QuestionPage;
