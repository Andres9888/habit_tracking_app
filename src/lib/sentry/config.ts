/**
 * Sentry Configuration
 * Builds Sentry config from environment variables.
 */

import Constants from 'expo-constants';
import type { SentryConfig } from './types';
import { DEFAULT_SENTRY_CONFIG } from './types';

/** Get the Sentry DSN from environment */
function getDsn(): string | null {
  const dsn = process.env.EXPO_PUBLIC_SENTRY_DSN;
  if (!dsn || dsn === '') {
    if (__DEV__) console.log('[Sentry] No DSN configured - monitoring disabled');
    return null;
  }
  return dsn;
}

/** Determine the current environment */
function getEnvironment(): SentryConfig['environment'] {
  if (__DEV__) return 'development';

  // Check for EAS preview builds
  const channel = Constants.expoConfig?.extra?.eas?.channel;
  if (channel === 'preview') return 'preview';

  return 'production';
}

/** Get the release version string */
function getRelease(): string {
  const version = Constants.expoConfig?.version ?? '1.0.0';
  const buildNumber =
    Constants.expoConfig?.ios?.buildNumber ??
    Constants.expoConfig?.android?.versionCode ??
    '1';
  return `daily-habits@${version}+${buildNumber}`;
}

/** Build complete Sentry configuration */
export function buildSentryConfig(): SentryConfig | null {
  const dsn = getDsn();
  if (!dsn) return null;

  const environment = getEnvironment();

  return {
    ...DEFAULT_SENTRY_CONFIG,
    dsn,
    environment,
    release: getRelease(),
    // Adjust sample rates by environment
    sampleRate: environment === 'production' ? 1 : 1,
    tracesSampleRate: environment === 'production' ? 0.2 : 1,
  };
}

/** Check if Sentry should be enabled */
export function isSentryEnabled(): boolean {
  return getDsn() !== null;
}
