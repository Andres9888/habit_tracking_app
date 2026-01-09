import { useMemo, useRef } from 'react';

/**
 * Simple throttle hook for color picker updates
 * Limits how often the callback fires during continuous drag
 *
 * @param callback - Function to throttle
 * @param delay - Minimum time between calls in milliseconds
 * @returns Throttled version of the callback
 */
export function useThrottle(
  callback: (hex: string) => void,
  delay: number
): (hex: string) => void {
  const lastCall = useRef(0);
  const lastArg = useRef<string | null>(null);
  const timeoutId = useRef<NodeJS.Timeout | null>(null);

  return useMemo(() => {
    return (hex: string) => {
      const now = Date.now();
      lastArg.current = hex;

      // If enough time has passed, call immediately
      if (now - lastCall.current >= delay) {
        lastCall.current = now;
        callback(hex);
      } else if (!timeoutId.current) {
        // Schedule trailing call
        const remaining = delay - (now - lastCall.current);
        timeoutId.current = setTimeout(() => {
          lastCall.current = Date.now();
          if (lastArg.current !== null) {
            callback(lastArg.current);
          }
          timeoutId.current = null;
        }, remaining);
      }
    };
  }, [callback, delay]);
}
