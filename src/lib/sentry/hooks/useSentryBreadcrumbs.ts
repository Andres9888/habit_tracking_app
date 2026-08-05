/**
 * Sentry Breadcrumbs Hook
 * General-purpose breadcrumb tracking for user actions and navigation.
 */

import { useCallback, useMemo } from 'react';
import { getSentryReporter } from '../reporter/index';
import type { SentryBreadcrumb } from '../types';

/** Get level for HTTP status code */
function getLevelForStatus(statusCode?: number): 'info' | 'warning' | 'error' {
  if (!statusCode || statusCode < 400) return 'info';
  return statusCode >= 500 ? 'error' : 'warning';
}

/** Hook for tracking general user actions and navigation breadcrumbs. */
export function useSentryBreadcrumbs() {
  const reporter = useMemo(() => getSentryReporter(), []);

  const trackUserAction = useCallback(
    (action: string, data?: Record<string, unknown>) => {
      reporter.addBreadcrumb({
        category: 'user',
        data: { action, ...data },
        message: `User action: ${action}`,
      });
    },
    [reporter]
  );

  const trackNavigation = useCallback(
    (
      screenName: string,
      params?: Record<string, unknown>,
      fromScreen?: string
    ) => {
      reporter.addBreadcrumb({
        category: 'navigation',
        data: { from: fromScreen, params, to: screenName },
        message: `Navigate to ${screenName}`,
      });
    },
    [reporter]
  );

  const trackNetworkRequest = useCallback(
    (method: string, url: string, statusCode?: number) => {
      reporter.addBreadcrumb({
        category: 'network',
        data: {
          method,
          status_code: statusCode,
          url: url.replace(/\?.*$/, ''),
        },
        level: getLevelForStatus(statusCode),
        message: `${method} ${url.split('/').pop() ?? url}`,
      });
    },
    [reporter]
  );

  const track = useCallback(
    (breadcrumb: SentryBreadcrumb) => reporter.addBreadcrumb(breadcrumb),
    [reporter]
  );

  const trackModal = useCallback(
    (modalName: string, isOpen: boolean) => {
      reporter.addBreadcrumb({
        category: 'user',
        data: { modal: modalName, state: isOpen ? 'open' : 'close' },
        message: `Modal ${isOpen ? 'opened' : 'closed'}: ${modalName}`,
      });
    },
    [reporter]
  );

  const trackFormSubmit = useCallback(
    (formName: string, success: boolean) => {
      reporter.addBreadcrumb({
        category: 'user',
        data: { form: formName, success },
        level: success ? 'info' : 'warning',
        message: `Form ${success ? 'submitted' : 'failed'}: ${formName}`,
      });
    },
    [reporter]
  );

  return {
    track,
    trackFormSubmit,
    trackModal,
    trackNavigation,
    trackNetworkRequest,
    trackUserAction,
  };
}
