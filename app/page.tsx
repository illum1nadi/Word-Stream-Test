'use client';

import { useState, useRef } from 'react';
import PromptInput from './components/PromptInput';
import {ResponseOutput} from './components/ResponseOutput';
import { useStreamingBuffer } from './lib/useWordStream';

// Simulates streaming chunks like a Gemini API might do.
function mockChunkedStream(
  fullText: string,
  addToStream: (chunk: string) => void,
  chunkSize: number = 20,
  chunkDelay: number = 4,
  streamIdRef: React.RefObject<number>
): void {
  const myStreamId = ++streamIdRef.current;
  let index = 0;

  function sendNextChunk() {
    if (streamIdRef.current !== myStreamId) return; // Abort if newer stream started
    if (index < fullText.length) {
      const chunk = fullText.slice(index, index + chunkSize);
      if (chunk) {
        addToStream(chunk);
      }
      index += chunkSize;
      setTimeout(sendNextChunk, chunkDelay);
    }
  }

  sendNextChunk();
}

export default function Home() {
  const [loading, setLoading] = useState(false);
  const { displayed, addToStream } = useStreamingBuffer(2);
  const streamIdRef = useRef(0);

  const handlePrompt = async (prompt: string): Promise<void> => {
    setLoading(true);
    addToStream('', { clear: true });
    streamIdRef.current += 1;

    try {
      const res = await fetch('/api/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });

      if (!res.ok) throw new Error('Failed to fetch');

      const data = await res.json();
      mockChunkedStream(data.text, addToStream, 20, 4, streamIdRef);
    } catch (e) {
      const errorMsg = 'Error: ' + (e instanceof Error ? e.message : String(e));
      addToStream(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        maxWidth: 800,
        margin: '0 auto',
        padding: 20,
        boxSizing: 'border-box',
      }}
    >
      <h1>AI Gemini Prompt</h1>
      <PromptInput onSubmit={handlePrompt} loading={loading} />
      <div style={{ flex: 1, overflow: 'hidden' }}>
        <ResponseOutput responseText={displayed} />
      </div>
    </div>
  );
}
