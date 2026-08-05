/**
 * Error Tracking Hook
 */

import { useCallback } from 'react';
import { trackError, getSeverity } from '../tracker/index';
import type { ErrorContext, TrackedError } from '../types';

/** Hook for tracking errors with classification */
export function useErrorTracking() {
  const track = useCallback(
    (error: unknown, context?: ErrorContext): TrackedError => {
      return trackError(error, context);
    },
    []
  );

  const trackWithComponent = useCallback(
    (
      error: unknown,
      componentName: string,
      context?: ErrorContext
    ): TrackedError => {
      return trackError(error, {
        ...context,
        tags: { ...context?.tags, component: componentName },
      });
    },
    []
  );

  return { getSeverity, track, trackWithComponent };
}
