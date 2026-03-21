const fs = require('fs');
const path = require('path');

const filePath = "c:\\Users\\harsh\\OneDrive\\Desktop\\UptoSkills Work\\Frontedn Assessment and Interview\\frontend-assessment\\src\\hooks\\useSession.ts";

let content = fs.readFileSync(filePath, 'utf8');

const formatErrorHelper = `
const formatError = (err: any): string => {
    const detail = err.response?.data?.detail;
    if (detail) {
        if (Array.isArray(detail)) {
            return detail.map((e) => \`\${e.loc?.join('.') || 'error'}: \${e.msg || 'ValidationError'}\`).join(' | ');
        }
        if (typeof detail === 'string') return detail;
        return JSON.stringify(detail);
    }
    return err.message || 'An unknown error occurred';
};
`;

// Insert helper after imports
if (!content.includes('const formatError =')) {
    const importEnd = content.indexOf("import { useLoading } from '../context/LoadingContext';");
    if (importEnd !== -1) {
         // Find end of line
         const lineEnd = content.indexOf('\n', importEnd);
         content = content.slice(0, lineEnd + 1) + formatErrorHelper + content.slice(lineEnd + 1);
    }
}

// Replace catch block 1 (startSession)
content = content.replace(
    /\} catch \(err: any\) \{\s*const errMsg = err\.response\?\.data\?\.detail || err\.message || 'Failed to start session';\s*setError\(errMsg\);/m,
    `} catch (err: any) {
            const errMsg = formatError(err);
            setError(errMsg);`
);

// Replace catch block 2 (fetchQuestion)
content = content.replace(
    /\} catch \(err: any\) \{\s*const errMsg = err\.response\?\.data\?\.detail || err\.message || 'Failed to fetch question';\s*setError\(errMsg\);/m,
    `} catch (err: any) {
            const errMsg = formatError(err);
            setError(errMsg);`
);

// Replace catch block 3 (submitAnswer)
content = content.replace(
    /\} catch \(err: any\) \{\s*const errMsg = err\.response\?\.data\?\.detail || err\.message || 'Failed to submit answer';\s*setError\(errMsg\);/m,
    `} catch (err: any) {
            const errMsg = formatError(err);
            setError(errMsg);`
);

fs.writeFileSync(filePath, content, 'utf8');
console.log("Error formatting crash handler applied in useSession.ts!");
