/**
 * Timing Utilities
 * Helper functions for timing operations.
 */

import { now } from './PerformanceTimer';
import type { PerformanceTimer } from './PerformanceTimer';

/** Utility to time an async function */
export async function timeAsync<T>(
  name: string,
  fn: () => Promise<T>,
  timer?: PerformanceTimer
): Promise<{ duration: number; result: T }> {
  const startTime = now();
  const result = await fn();
  const duration = now() - startTime;

  if (timer) {
    timer.mark(`${name}:start`, { timestamp: startTime });
    timer.mark(`${name}:end`);
    timer.measure(name, `${name}:start`, `${name}:end`);
  }

  return { duration, result };
}

/** Utility to time a sync function */
export function timeSync<T>(
  name: string,
  fn: () => T,
  timer?: PerformanceTimer
): { duration: number; result: T } {
  const startTime = now();
  const result = fn();
  const duration = now() - startTime;

  if (timer) {
    timer.mark(`${name}:start`, { timestamp: startTime });
    timer.mark(`${name}:end`);
    timer.measure(name, `${name}:start`, `${name}:end`);
  }

  return { duration, result };
}
