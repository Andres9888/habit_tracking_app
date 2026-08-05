import { initSentry } from '../lib/sentry';
import { scheduleWhenIdle } from '../lib/timing/scheduleWhenIdle';

export function initializeAppMonitoring(): void {
  scheduleWhenIdle(initSentry, { fallbackDelayMs: 0 });
}
