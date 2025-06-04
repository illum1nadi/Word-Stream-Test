'use client';

import { useState } from 'react';
import PromptInput from './components/PromptInput';
import ResponseOutput from './components/ResponseOutput';

function streamCharacters(
  text: string,
  setChars: React.Dispatch<React.SetStateAction<string>>,
  delay = 25
) {
  let index = 0;

  function showNext() {
    if (index < text.length) {
      setChars((prev) => prev + text[index]);
      index++;
      setTimeout(showNext, delay);
    }
  }

  showNext();
}

export default function Home() {
  const [responseText, setResponseText] = useState('');
  const [loading, setLoading] = useState(false);

  async function handlePrompt(prompt: string) {
    setLoading(true);
    setResponseText('');

    try {
      const res = await fetch('/api/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });

      if (!res.ok) throw new Error('Failed to fetch');

      const data = await res.json();
      streamCharacters(data.text, setResponseText, 25); // Character streaming
    } catch (e) {
      setResponseText('Error: ' + (e as Error).message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ padding: 20, maxWidth: 600, margin: 'auto' }}>
      <h1>AI Gemini Prompt</h1>
      <PromptInput onSubmit={handlePrompt} loading={loading} />
      <ResponseOutput responseText={responseText} />
    </div>
  );
}
