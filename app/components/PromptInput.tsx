'use client';

import React, { useState } from 'react';

interface PromptInputProps {
  onSubmit: (prompt: string) => void;
  loading: boolean;
}

export default function PromptInput({ onSubmit, loading }: PromptInputProps) {
  const [prompt, setPrompt] = useState('');

  function handleClick() {
    if (prompt.trim()) {
      onSubmit(prompt);
      setPrompt('');
      // Clear the response output box immediately on submit
      if (typeof window !== 'undefined') {
        const event = new CustomEvent('clear-response-output');
        window.dispatchEvent(event);
      }
    }
  }

  return (
    <div>
      <textarea
        rows={4}
        style={{ width: '100%', fontSize: 16 }}
        placeholder="Enter your prompt here..."
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        disabled={loading}
      />
      <button
        onClick={handleClick}
        disabled={loading || prompt.trim() === ''}
        style={{ marginTop: 10, padding: '8px 16px', fontSize: 16 }}
      >
        {loading ? 'Loading...' : 'Send'}
      </button>
    </div>
  );
}
