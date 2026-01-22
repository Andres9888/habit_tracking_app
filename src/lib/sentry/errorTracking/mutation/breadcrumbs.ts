/**
 * Mutation Breadcrumbs
 */

import { getSentryReporter } from '../../reporter/index';
import { sanitizeArgs } from './sanitize';

/** Add breadcrumb for mutation start */
export function addMutationBreadcrumb(
  mutationName: string,
  args?: Record<string, unknown>
): void {
  const reporter = getSentryReporter();
  reporter.addBreadcrumb({
    category: 'habit',
    data: {
      args: args ? sanitizeArgs(args) : undefined,
      mutation: mutationName,
    },
    level: 'info',
    message: `Mutation: ${mutationName}`,
  });
}

/** Add breadcrumb for mutation success */
export function addMutationSuccessBreadcrumb(
  mutationName: string,
  durationMs: number
): void {
  const reporter = getSentryReporter();
  reporter.addBreadcrumb({
    category: 'habit',
    data: {
      duration_ms: durationMs,
      mutation: mutationName,
      status: 'success',
    },
    level: 'info',
    message: `Mutation success: ${mutationName} (${durationMs}ms)`,
  });
}
