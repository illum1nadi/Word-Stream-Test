'use client';

import { useState } from 'react';
import PromptInput from './components/PromptInput';
import ResponseOutput from './components/ResponseOutput';
import { useWordStream } from './lib/useWordStream';

export default function Home() {
  const [responseText, setResponseText] = useState('');
  const [loading, setLoading] = useState(false);
  const streamedText = useWordStream(responseText, 5);

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
      setResponseText(data.text);
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
      <ResponseOutput responseText={streamedText} />
    </div>
  );
}
