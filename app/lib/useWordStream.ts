import { useEffect, useRef, useState } from 'react';

/**
 * useWordStream - Custom hook for streaming text character by character.
 * @param text The input text to stream.
 * @param delay Delay in ms between each character (default: 5ms).
 * @returns The streamed text as it appears character by character.
 */
//for response by api as a complete string.
export function useWordStream(text: string, delay: number = 5) {
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

//for response by api in chunks.
export function useStreamingBuffer(delay: number = 5) {
  const [displayed, setDisplayed] = useState('');
  const bufferRef = useRef(''); // All tokens added so far
  const indexRef = useRef(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const showNext = () => {
    if (indexRef.current < bufferRef.current.length) {
      setDisplayed((prev) => prev + bufferRef.current[indexRef.current]);
      indexRef.current++;
      timeoutRef.current = setTimeout(showNext, delay);
    } else {
      timeoutRef.current = null;
    }
  };

  const addToStream = (newChunk: string) => {
    bufferRef.current += newChunk;
    // Start streaming if not already
    if (!timeoutRef.current) {
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
