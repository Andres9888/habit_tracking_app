/**
 * Performance Integration Module
 * Bridges the existing PerformanceProvider with Sentry reporting.
 */

import type { PerformanceReport } from '../../performance/types';
import type { PerformanceIssue } from '../../../contexts/PerformanceContext/types';
import { getSentryReporter } from '../reporter/index';

export { reportFrameIssue } from './frameReporter';
export { reportSlowRenders } from './renderReporter';
export { reportMemoryIssue, reportNetworkIssue } from './resourceReporter';

/** Send performance report summary to Sentry */
export function reportPerformanceSummary(report: PerformanceReport): void {
  const reporter = getSentryReporter();

  reporter.addBreadcrumb({
    category: 'performance',
    data: {
      baseline: report.baseline,
      frameDataPoints: report.frameData.length,
      memorySnapshots: report.memorySnapshots.length,
      networkRequests: report.networkTimings.length,
      sessionDuration: report.sessionDuration,
      trackedComponents: report.renderTimings.length,
    },
    level: 'info',
    message: 'Performance session summary',
  });
}

/** Create a callback for PerformanceProvider's onPerformanceIssue */
export function createSentryIssueHandler(): (issue: PerformanceIssue) => void {
  // eslint-disable-next-line unicorn/consistent-function-scoping -- factory pattern
  return (issue: PerformanceIssue) => {
    const reporter = getSentryReporter();
    reporter.capturePerformanceIssue(issue);
  };
}
