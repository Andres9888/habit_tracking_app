/**
 * Frame Issue Reporter
 */

import type { FrameTimingData } from '../../performance/types';
import type { PerformanceIssue } from '../../../contexts/PerformanceContext/types';
import { getSentryReporter } from '../reporter/index';

/** Threshold for FPS drop detection */
const FPS_WARNING_THRESHOLD = 45;
const FPS_CRITICAL_THRESHOLD = 30;

/** Report frame timing issues to Sentry */
export function reportFrameIssue(data: FrameTimingData): void {
  const reporter = getSentryReporter();

  if (data.fps < FPS_CRITICAL_THRESHOLD) {
    const issue: PerformanceIssue = {
      data: {
        fps: data.fps,
        jankFrames: data.jankFrames,
        totalFrames: data.totalFrames,
      },
      message: `Critical FPS drop: ${data.fps.toFixed(1)} FPS`,
      severity: 'critical',
      timestamp: data.timestamp,
      type: 'fps_drop',
    };
    reporter.capturePerformanceIssue(issue);
  } else if (data.fps < FPS_WARNING_THRESHOLD) {
    const issue: PerformanceIssue = {
      data: {
        fps: data.fps,
        jankFrames: data.jankFrames,
        totalFrames: data.totalFrames,
      },
      message: `FPS drop detected: ${data.fps.toFixed(1)} FPS`,
      severity: 'warning',
      timestamp: data.timestamp,
      type: 'fps_drop',
    };
    reporter.capturePerformanceIssue(issue);
  }
}
