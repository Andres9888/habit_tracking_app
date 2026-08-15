import { useCallback, useEffect, useRef } from 'react';

export function useDismissCustomizeTimeout(onDismiss: () => void) {
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(
    () => () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    },
    []
  );
  return useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(onDismiss, 1000);
  }, [onDismiss]);
}
