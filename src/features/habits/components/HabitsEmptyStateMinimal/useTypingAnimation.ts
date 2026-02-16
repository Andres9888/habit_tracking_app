/**
 * useTypingAnimation - Simulates typing text character by character
 *
 * Provides a typing effect for filling input fields with chip selections
 */

import { useCallback, useEffect, useRef } from 'react';

interface UseTypingAnimationParams {
  onTextUpdate: (text: string) => void;
  characterDelay?: number; // ms delay between each character
}

export function useTypingAnimation({
  onTextUpdate,
  characterDelay = 30,
}: UseTypingAnimationParams) {
  const timeoutRefs = useRef<NodeJS.Timeout[]>([]);

  const clearTimeouts = useCallback(() => {
    timeoutRefs.current.forEach(timeout => clearTimeout(timeout));
    timeoutRefs.current = [];
  }, []);

  const typeText = useCallback(
    (targetText: string) => {
      clearTimeouts();

      if (!targetText) {
        onTextUpdate('');
        return;
      }

      // Start with empty text
      onTextUpdate('');

      // Type each character with delay
      for (let i = 1; i <= targetText.length; i++) {
        const timeout = setTimeout(() => {
          onTextUpdate(targetText.slice(0, i));
        }, i * characterDelay);

        timeoutRefs.current.push(timeout);
      }
    },
    [characterDelay, clearTimeouts, onTextUpdate]
  );

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      clearTimeouts();
    };
  }, [clearTimeouts]);

  return {
    clearTimeouts,
    typeText,
  };
}
