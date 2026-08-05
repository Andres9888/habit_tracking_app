/**
 * Error Rate Limiting
 */

import { getConfig } from './config';

/** Rate limiting state */
let errorCount = 0;
let windowStart = Date.now();

/** Check if we're rate limited */
export function isRateLimited(): boolean {
  const now = Date.now();
  const windowMs = 60_000;

  if (now - windowStart > windowMs) {
    windowStart = now;
    errorCount = 0;
  }

  const config = getConfig();
  if (errorCount >= (config.rateLimitPerMinute ?? 30)) {
    return true;
  }

  errorCount++;
  return false;
}

/** Determine if error should be reported based on sampling */
export function shouldSample(): boolean {
  const config = getConfig();
  const sampleRate = config.sampleRate ?? 1;
  return Math.random() < sampleRate;
}

/** Reset rate limiting (for testing) */
export function resetRateLimit(): void {
  errorCount = 0;
  windowStart = Date.now();
}
