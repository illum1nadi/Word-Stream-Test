'use client';

import { useState, useRef } from 'react';
import PromptInput from './components/PromptInput';
import ResponseOutput from './components/ResponseOutput';
import { useStreamingBuffer } from './lib/useWordStream';

//mimic a chunked stream from Gemini API as gemini does not support streaming in this example.
const streamIdRef = { current: 0 };
function mockChunkedStream(
  fullText: string,
  addToStream: (chunk: string) => void,
  chunkSize: number = 20,
  chunkDelay: number = 4,
  streamIdObj = streamIdRef
) {
  const myStreamId = ++streamIdObj.current;
  let index = 0;
  function sendNextChunk() {
    if (streamIdObj.current !== myStreamId) return; // Stop if a new stream started
    if (index < fullText.length) {
      const chunk = fullText.slice(index, index + chunkSize);
      // Only add non-empty chunks
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
  const [responseText, setResponseText] = useState('');
  const [loading, setLoading] = useState(false);
  const { displayed, addToStream } = useStreamingBuffer(5);
  const streamIdRef = useRef(0);

  async function handlePrompt(prompt: string) {
    setLoading(true);
    setResponseText('');
    addToStream('', { clear: true }); // Explicitly clear and stop stream on new prompt
    streamIdRef.current += 1; // Invalidate any previous stream
    try {
      const res = await fetch('/api/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });

      if (!res.ok) throw new Error('Failed to fetch');

      const data = await res.json();
      setResponseText(data.text);
      // Simulate chunked streaming from Gemini
      mockChunkedStream(data.text, addToStream, 20, 4, streamIdRef);
    } catch (e) {
      setResponseText('Error: ' + (e as Error).message);
      addToStream('Error: ' + (e as Error).message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ padding: 20, maxWidth: 600, margin: 'auto' }}>
      <h1>AI Gemini Prompt</h1>
      <PromptInput onSubmit={handlePrompt} loading={loading} />
      <ResponseOutput responseText={displayed} />
    </div>
  );
}
