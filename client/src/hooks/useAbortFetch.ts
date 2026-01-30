import { useRef } from 'react';

/**
 * Custom hook for managing abort controller lifecycle during async operations
 * Useful for canceling current requests when component unmounts or a new request starts
 */
export function useAbortFetch() {
  const abortControllerRef = useRef<AbortController | null>(null);
  const cleanupPromiseRef = useRef<Promise<void> | null>(null);

  const begin = async () => {
    // Cancel any ongoing operation
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Wait for previous cleanup to complete
    if (cleanupPromiseRef.current) {
      await cleanupPromiseRef.current;
    }

    // Create new abort controller for this operation
    abortControllerRef.current = new AbortController();
    const signal = abortControllerRef.current.signal;

    let resolveCleanup: () => void;
    cleanupPromiseRef.current = new Promise<void>(resolve => {
      resolveCleanup = resolve;
    });

    // Cleanup function to ensure controller is reset
    const cleanup = () => {
      if (abortControllerRef.current) {
        abortControllerRef.current = null;
      }
      resolveCleanup!();
    };

    return { signal, cleanup };
  };

  return { begin };
}
