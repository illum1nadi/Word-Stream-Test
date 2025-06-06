import { useEffect, useRef, useState } from 'react';

// For response by API as a complete string.
export function useWordStream(text: string, delay: number = 100) {
  const [displayed, setDisplayed] = useState('');
  const indexRef = useRef(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setDisplayed('');
    indexRef.current = 0;
    if (!text) return;
    function showNext() {
      if (indexRef.current < text.length) {
        setDisplayed((prev) => prev + (text[indexRef.current] ?? ''));
        indexRef.current++;
        timeoutRef.current = setTimeout(showNext, delay);
      }
    }
    showNext();
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [text, delay]);

  return displayed.replace(/undefined+$/, '');
}

// For response by API in chunks.
export function useStreamingBuffer(delay: number = 100) {
  const [displayed, setDisplayed] = useState('');
  const bufferRef = useRef('');
  const indexRef = useRef(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isStreamingRef = useRef(false); // <-- Track if we're already streaming

  const showNext = () => {
    if (indexRef.current < bufferRef.current.length) {
      const char = bufferRef.current[indexRef.current];
      if (typeof char === 'string') {
        setDisplayed((prev) => prev + char);
      }
      indexRef.current++;
      timeoutRef.current = setTimeout(showNext, delay);
    } else {
      timeoutRef.current = null;
      isStreamingRef.current = false; // Done streaming
    }
  };

  const addToStream = (newChunk: string, options?: { clear?: boolean }) => {
    if (options?.clear) {
      bufferRef.current = '';
      indexRef.current = 0;
      setDisplayed('');
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      isStreamingRef.current = false;
      return;
    }

    bufferRef.current += newChunk;

    if (!isStreamingRef.current) {
      isStreamingRef.current = true;
      showNext();
    }
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return { displayed, addToStream };
}
