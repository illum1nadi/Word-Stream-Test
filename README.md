# Gemini AI Prompt App

A Next.js 14 application that interfaces with Google's Gemini API to stream AI responses with Markdown formatting.

## Features

- Send prompts to Gemini API via Next.js API routes
- Stream responses character-by-character
- Render Markdown output (tables, lists, code blocks)
- Modular component architecture
- Environment variable configuration

## Installation

### 1. Clone the repository
```sh
https://github.com/illum1nadi/Word-Stream-Test.git
cd Word-Stream-Test
```

### 2. Install dependencies:
```sh
npm install
```

### 3. Create environment file:
```sh
echo "GEMINI_API_KEY=your_api_key_here" > .env.local
```


## Usage

### 1. Start development server:
```sh
npm run dev
```


### 2. Open http://localhost:3000

### 3. Enter your prompt and submit

## API Implementation

The API route (`app/api/gemini/route.ts`) uses:

```typescript
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const model = genAI.getGenerativeModel({ model: "gemini-pro" });
const result = await model.generateContent(prompt);
```

## Components
### PromptInput.tsx: Handles user input

### ResponseOutput.tsx: Displays streaming response with Markdown

![Demo](https://streamable.com/6856f9)
