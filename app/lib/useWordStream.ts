import { useEffect, useRef, useState, useCallback } from 'react';

export function useStreamingBuffer(delay = 100, batchSize = 1) {
  const [displayed, setDisplayed] = useState('');
  const bufferRef = useRef<string[]>([]);
  const chunksRef = useRef<string[]>([]);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isStreamingRef = useRef(false);
  const lastUpdateRef = useRef(0);
  const pendingUpdateRef = useRef(false);

  const clearCurrentTimeout = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    isStreamingRef.current = false;
  }, []);

  const processBatch = useCallback(() => {
    if (bufferRef.current.length === 0) {
      clearCurrentTimeout();
      return;
    }

    const batch = bufferRef.current.splice(0, batchSize);
    const nextChunk = batch.join('');

    setDisplayed(prev => {
      const newValue = prev + nextChunk;
      pendingUpdateRef.current = false;
      return newValue;
    });

    if (bufferRef.current.length > 0) {
      timeoutRef.current = setTimeout(processBatch, delay);
    } else {
      clearCurrentTimeout();
    }
  }, [batchSize, delay, clearCurrentTimeout]);

  const startStreaming = useCallback(() => {
    if (isStreamingRef.current || bufferRef.current.length === 0) {
      return;
    }
    isStreamingRef.current = true;
    processBatch();
  }, [processBatch]);

  const flushChunks = useCallback(() => {
    if (chunksRef.current.length > 0) {
      bufferRef.current.push(...chunksRef.current);
      chunksRef.current = [];
      if (!isStreamingRef.current) {
        startStreaming();
      }
    }
  }, [startStreaming]);

  const addToStream = useCallback(
    (newChunk: string, options?: { clear?: boolean }) => {
      if (options?.clear) {
        clearCurrentTimeout();
        bufferRef.current = [];
        chunksRef.current = [];
        setDisplayed('');
        pendingUpdateRef.current = false;
        return;
      }

      if (!newChunk) return;

      // ✅ Updated here: split by word, keep spaces and preserve markdown tokens
      const words = newChunk.split(/(\s+)/); // keep spaces as separate tokens
      chunksRef.current.push(...words);

      const now = Date.now();
      if (!isStreamingRef.current || now - lastUpdateRef.current > delay) {
        flushChunks();
        lastUpdateRef.current = now;
      } else if (!timeoutRef.current) {
        timeoutRef.current = setTimeout(() => {
          flushChunks();
          lastUpdateRef.current = Date.now();
        }, delay);
      }
    },
    [clearCurrentTimeout, delay, flushChunks]
  );

  useEffect(() => {
    return () => {
      clearCurrentTimeout();
    };
  }, [clearCurrentTimeout]);

  return { displayed, addToStream };
}
