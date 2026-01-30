/**
 * Error Context Builders
 */

import type { ClassifiedError } from '../../../offline/types';
import type { ErrorContext, ErrorSeverity } from '../types';
import { CATEGORY_SEVERITY_MAP } from '../types';

/** Get severity for classified error */
export function getSeverity(classified: ClassifiedError): ErrorSeverity {
  return CATEGORY_SEVERITY_MAP[classified.category];
}

/** Build Sentry tags from classified error */
export function buildTags(
  classified: ClassifiedError,
  context?: ErrorContext
): Record<string, string> {
  const tags: Record<string, string> = {
    error_category: classified.category,
    is_retryable: String(classified.isRetryable),
    ...context?.tags,
  };

  if (classified.statusCode) {
    tags.http_status = String(classified.statusCode);
  }

  return tags;
}

/** Build extra data from classified error */
export function buildExtra(
  classified: ClassifiedError,
  context?: ErrorContext
): Record<string, unknown> {
  return {
    classified_category: classified.category,
    is_retryable: classified.isRetryable,
    original_message: classified.message,
    status_code: classified.statusCode,
    suggested_delay: classified.suggestedDelay,
    ...context?.extra,
  };
}
