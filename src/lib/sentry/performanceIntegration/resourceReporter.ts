/**
 * Memory and Network Issue Reporter
 */

import type { PerformanceIssue } from '../../../contexts/PerformanceContext/types';
import { getSentryReporter } from '../reporter/index';
import { DEFAULT_THRESHOLDS } from '../../performance/types';

/** Report memory issues to Sentry */
export function reportMemoryIssue(
  currentUsage: number,
  threshold: number = DEFAULT_THRESHOLDS.maxMemoryUsage
): void {
  if (currentUsage <= threshold) return;

  const reporter = getSentryReporter();
  const usageMB = (currentUsage / (1024 * 1024)).toFixed(1);
  const thresholdMB = (threshold / (1024 * 1024)).toFixed(1);
  const isCritical = currentUsage > threshold * 1.5;

  const issue: PerformanceIssue = {
    data: {
      currentUsageMB: Number.parseFloat(usageMB),
      percentOverThreshold: (
        ((currentUsage - threshold) / threshold) *
        100
      ).toFixed(1),
      thresholdMB: Number.parseFloat(thresholdMB),
    },
    message: `Memory usage high: ${usageMB}MB (threshold: ${thresholdMB}MB)`,
    severity: isCritical ? 'critical' : 'warning',
    timestamp: Date.now(),
    type: 'memory_leak',
  };
  reporter.capturePerformanceIssue(issue);
}

/** Report network latency issues to Sentry */
export function reportNetworkIssue(
  latencyMs: number,
  url: string,
  threshold: number = DEFAULT_THRESHOLDS.maxNetworkLatency
): void {
  if (latencyMs <= threshold) return;

  const reporter = getSentryReporter();
  const isCritical = latencyMs > threshold * 3;

  // Extract path for grouping (remove query params and sensitive data)
  const urlPath = url.split('?')[0].replaceAll(/\/[a-f0-9-]{36}/gi, '/:id');

  const issue: PerformanceIssue = {
    data: {
      latencyMs,
      thresholdMs: threshold,
      url: urlPath,
    },
    message: `Slow network request: ${latencyMs.toFixed(0)}ms to ${urlPath}`,
    severity: isCritical ? 'critical' : 'warning',
    timestamp: Date.now(),
    type: 'slow_network',
  };
  reporter.capturePerformanceIssue(issue);
}
