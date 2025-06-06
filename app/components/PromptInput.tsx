'use client';

import React, { useState } from 'react';

interface PromptInputProps {
  onSubmit: (prompt: string) => void;
  loading: boolean;
}

export default function PromptInput({ onSubmit, loading }: PromptInputProps) {
  const [prompt, setPrompt] = useState('');

  const handleClick = (): void => {
    const trimmed = prompt.trim();
    if (trimmed) {
      onSubmit(trimmed);
      setPrompt('');

      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('clear-response-output'));
      }
    }
  };

  return (
    <div>
      <label htmlFor="prompt-input" style={{ display: 'none' }}>
        Prompt Input
      </label>
      <textarea
        id="prompt-input"
        rows={4}
        style={{ width: '100%', fontSize: 16, resize: 'vertical' }}
        placeholder="Enter your prompt here..."
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        disabled={loading}
        aria-label="Prompt input"
      />
      <button
        type="button"
        onClick={handleClick}
        disabled={loading || prompt.trim() === ''}
        style={{
          marginTop: 10,
          padding: '8px 16px',
          fontSize: 16,
          cursor: loading || prompt.trim() === '' ? 'not-allowed' : 'pointer',
        }}
        aria-disabled={loading || prompt.trim() === ''}
      >
        {loading ? 'Loading...' : 'Send'}
      </button>
    </div>
  );
}
