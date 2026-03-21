const fs = require('fs');

const filePath = "c:\\Users\\harsh\\OneDrive\\Desktop\\UptoSkills Work\\Frontedn Assessment and Interview\\frontend-assessment\\src\\services\\sessionService.ts";

let content = fs.readFileSync(filePath, 'utf8');

const startSessionBlock = `     async startSession(candidateId: string): Promise<SessionResponse> {
        console.log(\`[sessionService] startSession candidateId: \${candidateId}\`);
        const { data } = await sessionClient.post<SessionResponse>('/api/sessions/start', {
            candidateId: candidateId || "test-user",
        });
        return data;
    },`;

const submitAnswerBlock = `    async submitAnswer(sessionId: string, request: SubmitAnswerRequest): Promise<SessionResponse> {
        console.log(\`[sessionService] submitAnswer sessionId: \${sessionId}, request:\`, request);
        const { data } = await sessionClient.post<SessionResponse>(\`/api/sessions/\${sessionId}/submit\`, request);
        return data;
    },`;

// Replace startSession
content = content.replace(
    /async startSession\(candidateId: string\): Promise<SessionResponse> \{\s*console\.log\([\s\S]*?\)\s*const \{ data \} = await sessionClient\.post[\s\S]*?\}\s*\}\);[\s\S]*?return data;\s*\},/m,
    startSessionBlock
);

// Replace submitAnswer
content = content.replace(
    /async submitAnswer\(sessionId: string, request: SubmitAnswerRequest\): Promise<SessionResponse> \{\s*console\.log\([\s\S]*?\)\s*const \{ data \} = await sessionClient\.post[\s\S]*?JSON\.stringify\(request\)[\s\S]*?headers[\s\S]*?Content-Type[\s\S]*?\}[\s\S]*?\}\);[\s\S]*?return data;\s*\},/m,
    submitAnswerBlock
);

fs.writeFileSync(filePath, content, 'utf8');
console.log("Service methods startSession and submitAnswer restored to standard Axios objects Payload!");
