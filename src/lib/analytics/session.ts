import { now } from '../performance/PerformanceTimer';

let appStartedAt = now();
let startupMarked = false;
const analyticsSessionId = `${Date.now().toString(36)}-${Math.random()
  .toString(36)
  .slice(2, 12)}`;

/** Called by the native entrypoint as early as the JS bundle permits. */
export function markAppStarted(): void {
  if (startupMarked) return;
  appStartedAt = now();
  startupMarked = true;
}

export function getAppStartupDurationMs(): number {
  return Math.max(now() - appStartedAt, 0);
}

export function getAnalyticsSessionId(): string {
  return analyticsSessionId;
}
