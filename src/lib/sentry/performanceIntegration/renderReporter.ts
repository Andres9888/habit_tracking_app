/**
 * Render Issue Reporter
 */

import type { RenderTiming } from '../../performance/types';
import type { PerformanceIssue } from '../../../contexts/PerformanceContext/types';
import { getSentryReporter } from '../reporter/index';
import { DEFAULT_THRESHOLDS } from '../../performance/types';

/** Report slow component renders to Sentry */
export function reportSlowRenders(
  renders: RenderTiming[],
  thresholdMs: number = DEFAULT_THRESHOLDS.maxRenderTime
): void {
  const reporter = getSentryReporter();

  const slowRenders = renders.filter((r) => r.averageRenderTime > thresholdMs);

  for (const render of slowRenders) {
    const isCritical = render.averageRenderTime > thresholdMs * 2;

    const issue: PerformanceIssue = {
      data: {
        averageRenderTime: render.averageRenderTime,
        componentName: render.componentName,
        renderCount: render.renderCount,
        totalRenderTime: render.totalRenderTime,
      },
      message: `Slow render: ${render.componentName} (${render.averageRenderTime.toFixed(1)}ms avg)`,
      severity: isCritical ? 'critical' : 'warning',
      timestamp: render.timestamp,
      type: 'slow_render',
    };
    reporter.capturePerformanceIssue(issue);
  }
}
