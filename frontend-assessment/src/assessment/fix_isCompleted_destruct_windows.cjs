const fs = require('fs');

const pagePath = "c:\\Users\\harsh\\OneDrive\\Desktop\\UptoSkills Work\\Frontedn Assessment and Interview\\frontend-assessment\\src\\assessment\\QuestionPage.jsx";

let content = fs.readFileSync(pagePath, 'utf8');

// Replace standard destructure inside QuestionPage
content = content.replace(
    /isLoading,\s*error\s*\}\s*=\s*useOutletContext\(\);/m,
    `isLoading, 
        error, 
        isCompleted 
    } = useOutletContext();`
);

fs.writeFileSync(pagePath, content, 'utf8');
console.log("isCompleted added to destructure securely!");
const check = fs.readFileSync(pagePath, 'utf8');
if (!check.includes("isCompleted")) {
    console.log("Warning: isCompleted not found! Regex mismatch.");
}
