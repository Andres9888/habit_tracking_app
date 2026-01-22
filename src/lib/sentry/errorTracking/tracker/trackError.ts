/**
 * Track Error Function
 */

import { classifyError } from '../../../offline/errorClassifier/classify';
import { getSentryReporter } from '../../reporter/index';
import { isSentryInitialized } from '../../init/index';
import type { ErrorContext, TrackedError } from '../types';
import { SILENT_ERROR_CATEGORIES } from '../types';
import { getConfig } from './config';
import { isRateLimited, shouldSample } from './rateLimit';
import { buildTags, buildExtra } from './builders';

/**
 * Track an error with classification and Sentry reporting
 */
export function trackError(
  error: unknown,
  context?: ErrorContext
): TrackedError {
  const classified = classifyError(error);
  const reporter = getSentryReporter();
  const config = getConfig();

  // Check if Sentry is enabled
  if (!isSentryInitialized()) {
    return {
      classified,
      eventId: null,
      reported: false,
      skipReason: 'sentry_disabled',
    };
  }

  // Check if category is silent
  const isSilent = SILENT_ERROR_CATEGORIES.has(classified.category);
  if (isSilent && !config.reportSilentCategories) {
    reporter.addBreadcrumb({
      category: 'network',
      data: { error_category: classified.category },
      level: 'info',
      message: `Silent error: ${classified.message.slice(0, 100)}`,
    });
    return {
      classified,
      eventId: null,
      reported: false,
      skipReason: 'silent_category',
    };
  }

  // Check sampling
  if (!shouldSample()) {
    return {
      classified,
      eventId: null,
      reported: false,
      skipReason: 'sampling',
    };
  }

  // Check rate limit
  if (isRateLimited()) {
    reporter.addBreadcrumb({
      category: 'performance',
      level: 'warning',
      message: 'Error rate limit exceeded',
    });
    return {
      classified,
      eventId: null,
      reported: false,
      skipReason: 'sampling',
    };
  }

  // Report to Sentry
  const eventId = reporter.captureError(classified.original, {
    ...buildExtra(classified, context),
    fingerprint: context?.fingerprint,
    tags: buildTags(classified, context),
  });

  return { classified, eventId, reported: true };
}
