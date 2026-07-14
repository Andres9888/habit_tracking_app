import { useEffect, useRef } from 'react';
import { AppState, type AppStateStatus } from 'react-native';

import { logInteraction } from './interactions';
import { getAppStartupDurationMs } from './session';

const SLOW_APP_READY_MS = 3000;

function reportAppReady(durationMs: number): void {
  if (durationMs > SLOW_APP_READY_MS) {
    // Keep native Sentry out of the normal home-screen import graph. It is
    // loaded only for an actionable slow-start report.
    void import('../sentry/reporter')
      .then(({ getSentryReporter }) => {
        const reporter = getSentryReporter();
        reporter.capturePerformanceIssue({
          data: { durationMs, thresholdMs: SLOW_APP_READY_MS },
          message: `Authenticated home took ${Math.round(durationMs)}ms to become ready`,
          severity: 'warning',
          timestamp: Date.now(),
          type: 'slow_render',
        });
      })
      .catch(() => {
        // Monitoring must never affect the user path.
      });
  }
}

/** Records cold/warm app opens only after real authenticated content is ready. */
export function useAppAnalytics(isHomeReady: boolean): void {
  const homeReadyRef = useRef(isHomeReady);
  const initialOpenRecordedRef = useRef(false);
  const appStateRef = useRef<AppStateStatus>(AppState.currentState);
  homeReadyRef.current = isHomeReady;

  useEffect(() => {
    if (!isHomeReady || initialOpenRecordedRef.current) return;
    initialOpenRecordedRef.current = true;

    const frame = requestAnimationFrame(() => {
      const durationMs = getAppStartupDurationMs();
      logInteraction('app_opened', { durationMs, source: 'cold_start' });
      reportAppReady(durationMs);
    });
    return () => cancelAnimationFrame(frame);
  }, [isHomeReady]);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextState) => {
      const previousState = appStateRef.current;
      appStateRef.current = nextState;
      if (
        nextState === 'active' &&
        previousState !== 'active' &&
        homeReadyRef.current &&
        initialOpenRecordedRef.current
      ) {
        logInteraction('app_opened', { source: 'warm_start' });
      }
    });
    return () => subscription.remove();
  }, []);
}
