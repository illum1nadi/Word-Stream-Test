"use client";
import { useState } from 'react';

function streamWords(
  text: string,
  setOutput: React.Dispatch<React.SetStateAction<string>>,
  delay = 50
) {
  const words = text.split(' ');
  let index = 0;

  function showNextWord() {
    if (index < words.length) {
      setOutput((prev) => prev + (prev ? ' ' : '') + words[index]);
      index++;
      setTimeout(showNextWord, delay);
    }
  }

  showNextWord();
}

export default function Home() {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    setLoading(true);
    setResponse('');

    try {
      const res = await fetch('/api/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });

      if (!res.ok) {
        throw new Error('Failed to fetch response');
      }

      const data = await res.json();
      streamWords(data.text, setResponse, 50); // ✅ Stream the words
    } catch (err) {
      setResponse('Error: ' + (err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ padding: 20, maxWidth: 600, margin: 'auto' }}>
      <h1>AI Gemini Prompt</h1>
      <textarea
        rows={4}
        style={{ width: '100%', fontSize: 16 }}
        placeholder="Enter your prompt here..."
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
      />
      <button
        onClick={handleSubmit}
        disabled={loading || prompt.trim() === ''}
        style={{ marginTop: 10, padding: '8px 16px', fontSize: 16 }}
      >
        {loading ? 'Loading...' : 'Send'}
      </button>
      <pre
        style={{
          marginTop: 20,
          padding: 10,
          backgroundColor: '#f0f0f0',
          minHeight: 100,
          whiteSpace: 'pre-wrap',
        }}
      >
        {response}
      </pre>
    </div>
  );
}
