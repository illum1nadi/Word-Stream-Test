import { useEffect, useRef, useState, useCallback } from 'react'

export function useStreamingBuffer(delay = 100, batchSize = 1) {
  const [displayed, setDisplayed] = useState('')
  const bufferRef = useRef<string[]>([]) // Using array instead of string for buffer
  const chunksRef = useRef<string[]>([]) // Temporary chunks storage
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const isStreamingRef = useRef(false)
  const lastUpdateRef = useRef(0) // For debouncing
  const pendingUpdateRef = useRef(false) // Flag for pending state update

  // Clear any existing timeout and mark streaming as stopped
  const clearCurrentTimeout = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
    isStreamingRef.current = false
  }, [])

  // Process one batch of characters, then schedule the next
  const processBatch = useCallback(() => {
    if (bufferRef.current.length === 0) {
      // Done streaming
      clearCurrentTimeout()
      return
    }

    // Take up to batchSize characters from the buffer
    const batch = bufferRef.current.splice(0, batchSize)
    const nextChunk = batch.join('')

    // Use functional update to ensure we get the latest state
    setDisplayed(prev => {
      const newValue = prev + nextChunk
      pendingUpdateRef.current = false
      return newValue
    })

    // Schedule next batch if there's more content
    if (bufferRef.current.length > 0) {
      timeoutRef.current = setTimeout(processBatch, delay)
    } else {
      clearCurrentTimeout()
    }
  }, [batchSize, delay, clearCurrentTimeout])

  // Kick off streaming if not already streaming
  const startStreaming = useCallback(() => {
    if (isStreamingRef.current || bufferRef.current.length === 0) {
      return
    }
    isStreamingRef.current = true
    processBatch()
  }, [processBatch])

  // Debounced flush of chunks to buffer
  const flushChunks = useCallback(() => {
    if (chunksRef.current.length > 0) {
      bufferRef.current.push(...chunksRef.current)
      chunksRef.current = []
      if (!isStreamingRef.current) {
        startStreaming()
      }
    }
  }, [startStreaming])

  // Public API: add new text, or clear everything
  const addToStream = useCallback(
    (newChunk: string, options?: { clear?: boolean }) => {
      if (options?.clear) {
        clearCurrentTimeout()
        bufferRef.current = []
        chunksRef.current = []
        setDisplayed('')
        pendingUpdateRef.current = false
        return
      }

      if (!newChunk) return

      // Add to chunks buffer instead of directly to main buffer
      chunksRef.current.push(newChunk)

      // Throttle updates - only flush if we're not already streaming
      // or if it's been a while since last update
      const now = Date.now()
      if (!isStreamingRef.current || now - lastUpdateRef.current > delay) {
        flushChunks()
        lastUpdateRef.current = now
      } else if (!timeoutRef.current) {
        // Schedule a delayed flush if we're in the middle of streaming
        timeoutRef.current = setTimeout(() => {
          flushChunks()
          lastUpdateRef.current = Date.now()
        }, delay)
      }
    },
    [clearCurrentTimeout, delay, flushChunks]
  )

  // Clean up on unmount
  useEffect(() => {
    return () => {
      clearCurrentTimeout()
    }
  }, [clearCurrentTimeout])

  return { displayed, addToStream }
}