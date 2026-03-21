const fs = require('fs');

const hookPath = "c:\\Users\\harsh\\OneDrive\\Desktop\\UptoSkills Work\\Frontedn Assessment and Interview\\frontend-assessment\\src\\hooks\\useSession.ts";

let content = fs.readFileSync(hookPath, 'utf8');

// 1. Add defensive clearing inside startSession
content = content.replace(
    /setError\(null\);[\s\S]*?try {/m,
    `setError(null);
        localStorage.removeItem('assessment_session_id'); // Clear previous before starting new
        try {`
);

// 2. Add audit logs inside fetchStatus
content = content.replace(
    /if \(\!sessionId\) return;[\s\S]*?try {/m,
    `if (!sessionId) return;
        console.log(\`[API] fetchStatus calling with SessionID: \${sessionId}\`);
        try {`
);

// 3. Add audit logs inside fetchQuestion
content = content.replace(
    /if \(\!sessionId\) return;[\s\S]*?showLoader\(\);[\s\S]*?setError\(null\);[\s\S]*?try {/m,
    `if (!sessionId) return;
        showLoader();
        setError(null);
        console.log(\`[API] fetchQuestion calling with SessionID: \${sessionId}\`);
        try {`
);

fs.writeFileSync(hookPath, content, 'utf8');
console.log("Defensive clear and audit logs applied to useSession.ts!");
