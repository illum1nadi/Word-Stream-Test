import { useEffect, useRef, useState, useCallback } from 'react'
export function useStreamingBuffer(delay = 100, batchSize = 1) {
  const [displayed, setDisplayed] = useState('')
  const bufferRef = useRef('')
  const indexRef = useRef(0)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const isStreamingRef = useRef(false)
  // --- Clear any existing timeout and mark streaming as stopped ---
  const clearCurrentTimeout = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
    isStreamingRef.current = false
  }, [])
  // --- Process one batch of characters, then schedule the next ---
  const processBatch = useCallback(() => {
    const remaining = bufferRef.current.length - indexRef.current
    if (remaining <= 0) {
      // Done streaming
      clearCurrentTimeout()
      bufferRef.current = ''
      indexRef.current = 0
      return
    }
    // Take up to batchSize characters
    const take = Math.min(batchSize, remaining)
    const nextChunk = bufferRef.current.substr(indexRef.current, take)
    setDisplayed((prev) => prev + nextChunk)
    indexRef.current += take
    if (indexRef.current < bufferRef.current.length) {
      timeoutRef.current = setTimeout(processBatch, delay)
    } else {
      // Finished exactly on this batch
      clearCurrentTimeout()
      bufferRef.current = ''
      indexRef.current = 0
    }
  }, [batchSize, delay, clearCurrentTimeout])
  // --- Kick off streaming if not already streaming ---
  const startStreaming = useCallback(() => {
    if (isStreamingRef.current || indexRef.current >= bufferRef.current.length) {
      return
    }
    isStreamingRef.current = true
    processBatch()
  }, [processBatch])
  // --- Public API: add new text, or clear everything ---
  const addToStream = useCallback(
    (newChunk: string, options?: { clear?: boolean }) => {
      if (options?.clear) {
        clearCurrentTimeout()
        bufferRef.current = ''
        indexRef.current = 0
        setDisplayed('')
        return
      }
      if (!newChunk) return
      bufferRef.current += newChunk
      if (!isStreamingRef.current) {
        startStreaming()
      }
    },
    [startStreaming, clearCurrentTimeout]
  )
  // --- Clean up on unmount ---
  useEffect(() => {
    return () => {
      clearCurrentTimeout()
    }
  }, [clearCurrentTimeout])
  // ONLY return displayed & addToStream:
  return { displayed, addToStream }
}
