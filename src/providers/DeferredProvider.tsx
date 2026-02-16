/**
 * DeferredProvider
 *
 * Wrapper that defers rendering of a provider until the app is interactive.
 * Useful for non-critical providers that can be initialized after first paint.
 *
 * @example
 * ```tsx
 * <DeferredProvider fallback={<></>}>
 *   <StreakMilestoneProvider>
 *     {children}
 *   </StreakMilestoneProvider>
 * </DeferredProvider>
 * ```
 */

import { useEffect, useState, type ReactNode } from 'react';

interface DeferredProviderProps {
  children: ReactNode;
  fallback?: ReactNode;
  timeoutMs?: number;
}

export function DeferredProvider({
  children,
  fallback = null,
  timeoutMs = 1000,
}: DeferredProviderProps) {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Use requestIdleCallback if available, with timeout fallback
    if (typeof requestIdleCallback === 'function') {
      const id = requestIdleCallback(
        () => setIsReady(true),
        { timeout: timeoutMs }
      );
      return () => cancelIdleCallback(id);
    } else {
      const timer = setTimeout(() => setIsReady(true), timeoutMs);
      return () => clearTimeout(timer);
    }
  }, [timeoutMs]);

  return isReady ? children : fallback;
}
