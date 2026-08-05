/**
 * Sentry User Hook
 */

import { useEffect } from 'react';
import { getSentryReporter } from '../reporter/index';
import type { SentryUser } from '../types';

/**
 * Hook to set user context when authentication changes.
 * Call this in your auth provider or after login/logout.
 */
export function useSentryUser(user: SentryUser | null | undefined): void {
  useEffect(() => {
    const reporter = getSentryReporter();
    reporter.setUser(user ?? null);

    // Clear user on unmount or when user becomes null
    return () => {
      if (!user) {
        reporter.setUser(null);
      }
    };
  }, [user]);
}
