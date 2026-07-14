/**
 * Sentry Initialization
 * Initializes Sentry SDK for React Native/Expo.
 */

import * as Sentry from '@sentry/react-native';
import { buildSentryConfig } from '../config';
import type { SentryConfig } from '../types';
import { createBeforeSend, beforeBreadcrumb } from './sentryCallbacks';

let isInitialized = false;

type SentryInitOptions = Parameters<typeof Sentry.init>[0] & {
  enableAutoConsoleLogs?: boolean;
  enableLogs?: boolean;
};

function buildSentryIntegrations(
  config: SentryConfig
): SentryInitOptions['integrations'] {
  const integrations: SentryInitOptions['integrations'] = [
    Sentry.reactNavigationIntegration(),
  ];
  if (
    (config.replaysSessionSampleRate ?? 0) > 0 ||
    (config.replaysOnErrorSampleRate ?? 0) > 0
  ) {
    integrations.push(Sentry.mobileReplayIntegration());
  }
  return integrations;
}

function buildSentryInitOptions(config: SentryConfig): SentryInitOptions {
  return {
    attachScreenshot: false,
    attachStacktrace: true,
    attachViewHierarchy: false,
    beforeBreadcrumb,
    beforeSend: createBeforeSend(config),
    debug: config.debug,
    dsn: config.dsn,
    enableAutoConsoleLogs: false,
    enableAutoSessionTracking: true,
    enableCaptureFailedRequests: false,
    enableLogs: config.enableLogs,
    enableNativeCrashHandling: true,
    environment: config.environment,
    integrations: buildSentryIntegrations(config),
    normalizeDepth: 5,
    profilesSampleRate: config.profilesSampleRate,
    release: config.release,
    replaysOnErrorSampleRate: config.replaysOnErrorSampleRate,
    replaysSessionQuality: 'low',
    replaysSessionSampleRate: config.replaysSessionSampleRate,
    sampleRate: config.sampleRate,
    sendDefaultPii: false,
    tracesSampleRate: config.tracesSampleRate,
  };
}

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
    Sentry.init(buildSentryInitOptions(config));

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
