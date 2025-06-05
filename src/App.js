import React from "react";
import CopilotResponse from "./CopilotResponse";

const longMarkdown = `
# AI Copilot Response

Welcome to your personal AI Copilot. Here's a detailed breakdown of the features and performance across different modules:

---

## ✨ Feature Summary

| Feature                | Description                                                 | Status       |
|------------------------|-------------------------------------------------------------|--------------|
| Sequential Text Reveal | Text appears word-by-word with animation                   | ✅ Completed |
| Markdown Support       | Parses headings, tables, bold, etc.                         | ✅ Completed |
| Auto Scroll            | Scrolls as new content appears                              | ✅ Completed |
| Code Formatting        | Supports inline and block code syntax                      | 🔄 In-Progress |
| Table Styling          | Supports markdown tables                                    | ✅ Completed |

---

## 🧠 Why This Copilot Is Awesome

> “AI is not replacing humans, it’s amplifying them.” — Your Copilot

This component was designed to:

1. Feel natural and human-like  
2. Work with any markdown-based input  
3. Auto-adjust for length and scroll  

---

## 🧪 Sample Code Output

\`\`\`javascript
function greet(name) {
  console.log("Hello, " + name + "!");
}
greet("World");
\`\`\`

---

## 🗂️ Task History (Last 5 Days)

| Date       | Task                                     | Owner   |
|------------|------------------------------------------|---------|
| 2025-06-01 | Setup React app with MUI and Markdown    | Parth   |
| 2025-06-02 | Animated fade-in for copilot responses   | Ansh    |
| 2025-06-03 | Auto-scroll implementation               | Dev     |
| 2025-06-04 | Markdown table + code support            | Team    |
| 2025-06-05 | Styling, polish and optimization         | QA Team |

---

Thanks for using your Copilot!
`;

function App() {
  return <CopilotResponse markdown={longMarkdown} />;
}

export default App;
