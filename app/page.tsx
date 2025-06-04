'use client';

import { useState } from 'react';
import PromptInput from './components/PromptInput';
import ResponseOutput from './components/ResponseOutput';
import { fetchGeminiResponse } from './lib/gemini';

export default function Home() {
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(prompt: string) {
    setLoading(true);
    setResponse('');

    try {
      const text = await fetchGeminiResponse(prompt);
      setResponse(text);
    } catch (error) {
      setResponse('Error: ' + (error as Error).message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ padding: 20, maxWidth: 600, margin: 'auto' }}>
      <h1>AI Gemini Prompt</h1>
      <PromptInput onSubmit={handleSubmit} loading={loading} />
      <ResponseOutput response={response} />
    </div>
  );
}
