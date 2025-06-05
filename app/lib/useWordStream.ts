import { useEffect, useRef, useState } from 'react';

/**
 * useWordStream - Custom hook for streaming text character by character.
 * @param text The input text to stream.
 * @param delay Delay in ms between each character (default: 5ms).
 * @returns The streamed text as it appears character by character.
 */
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
