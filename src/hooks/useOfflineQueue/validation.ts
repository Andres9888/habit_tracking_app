/**
 * Validation helpers for offline queue items
 */

import type { OfflineSubmissionType, QueuedSubmission } from './types';

const SUBMISSION_TYPES = new Set<OfflineSubmissionType>(['habitUpdate']);

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function isValidSubmissionType(value: unknown): value is OfflineSubmissionType {
  return (
    typeof value === 'string' &&
    SUBMISSION_TYPES.has(value as OfflineSubmissionType)
  );
}

export function isValidQueuedSubmission(
  value: unknown
): value is QueuedSubmission {
  if (!isObject(value)) return false;

  return (
    typeof value.id === 'string' &&
    isValidSubmissionType(value.type) &&
    'payload' in value &&
    typeof value.queuedAt === 'number' &&
    Number.isFinite(value.queuedAt) &&
    typeof value.retryCount === 'number' &&
    Number.isFinite(value.retryCount)
  );
}
