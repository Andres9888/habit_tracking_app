/**
 * Mutation Error Tracking
 */

import { getSentryReporter } from '../../reporter/index';
import { trackError } from '../tracker/index';
import type { MutationErrorContext, TrackedError } from '../types';
import { sanitizeArgs } from './sanitize';
import {
  addMutationBreadcrumb,
  addMutationSuccessBreadcrumb,
} from './breadcrumbs';

/** Track a mutation error with full context */
export function trackMutationError(
  error: unknown,
  context: MutationErrorContext
): TrackedError {
  const reporter = getSentryReporter();

  reporter.addBreadcrumb({
    category: 'habit',
    data: {
      duration_ms: context.durationMs,
      mutation: context.mutationName,
      status: 'error',
    },
    level: 'error',
    message: `Mutation failed: ${context.mutationName}`,
  });

  return trackError(error, {
    extra: {
      ...context.extra,
      args: context.args ? sanitizeArgs(context.args) : undefined,
      duration_ms: context.durationMs,
      mutation_name: context.mutationName,
    },
    fingerprint: context.fingerprint ?? ['{{ default }}', context.mutationName],
    tags: {
      ...context.tags,
      error_source: 'mutation',
      mutation_name: context.mutationName,
    },
  });
}

/** Create a tracked mutation wrapper */
export function createTrackedMutation<TArgs extends Record<string, unknown>>(
  mutationName: string,
  mutationFn: (args: TArgs) => Promise<void>
): (args: TArgs) => Promise<void> {
  return async (args: TArgs) => {
    const startTime = Date.now();
    addMutationBreadcrumb(mutationName, args);

    try {
      await mutationFn(args);
      addMutationSuccessBreadcrumb(mutationName, Date.now() - startTime);
    } catch (error) {
      trackMutationError(error, {
        args,
        durationMs: Date.now() - startTime,
        mutationName,
      });
      throw error;
    }
  };
}
