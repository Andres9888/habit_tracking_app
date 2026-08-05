/**
 * Component Error Handler Hook
 */

import { useCallback } from 'react';
import { trackError } from '../tracker/index';

/** Hook for component-level error boundary integration */
export function useComponentErrorHandler(componentName: string) {
  const handleError = useCallback(
    (error: unknown, errorInfo?: { componentStack?: string }) => {
      trackError(error, {
        extra: { component_stack: errorInfo?.componentStack },
        fingerprint: ['component_error', componentName],
        tags: { component: componentName, error_source: 'component' },
      });
    },
    [componentName]
  );

  return handleError;
}
