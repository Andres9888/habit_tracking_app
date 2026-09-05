/**
 * Sentry Initialization
 * Initializes Sentry SDK for React Native/Expo.
 */

import * as Sentry from '@sentry/react-native';
import { buildSentryConfig } from '../config';
import type { SentryConfig } from '../types';
import { createBeforeSend, beforeBreadcrumb } from './sentryCallbacks';

let isInitialized = false;

/** Initialize Sentry with auto-detected configuration */
export function initSentry(): boolean {
  if (isInitialized) {
    return true;
  }

  const config = buildSentryConfig();
  if (!config) {
    return false;
  }

  return initSentryWithConfig(config);
}

/** Initialize Sentry with explicit configuration */
export function initSentryWithConfig(config: SentryConfig): boolean {
  if (isInitialized) {
    return true;
  }

  try {
    Sentry.init({
      attachStacktrace: true,
      beforeBreadcrumb,
       
      beforeSend: createBeforeSend(config),
      debug: config.debug,
      dsn: config.dsn,
      enableAutoSessionTracking: true,
      enableNativeCrashHandling: true,
      environment: config.environment,
      // Stall tracking runs a continuous JS-thread timer loop for the whole
      // app lifetime; tracing is enabled here for spans, not for stall metrics.
      enableStallTracking: false,
      normalizeDepth: 5,
      release: config.release,
      sampleRate: config.sampleRate,
      tracesSampleRate: config.tracesSampleRate,
    });

    isInitialized = true;
    return true;
  } catch {
    return false;
  }
}

/** Check if Sentry has been initialized */
export function isSentryInitialized(): boolean {
  return isInitialized;
}

/** Re-export for convenience */

export { isSentryEnabled } from '../config';
