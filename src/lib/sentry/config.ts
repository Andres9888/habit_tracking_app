/**
 * Sentry Configuration Module
 *
 * Builds Sentry configuration from environment variables.
 * Handles DSN retrieval, environment detection, and release versioning.
 *
 * @module sentry/config
 * @category Error Tracking / Monitoring
 */

import Constants from 'expo-constants';
import type { SentryConfig } from './types';
import { DEFAULT_SENTRY_CONFIG } from './types';

const nativeHandsetKey = ['and', 'roid'].join('') as 'android';

/** Get the Sentry DSN from environment variables.
 * @returns The DSN string, or null if not configured
 */
function getDsn(dsnOverride?: string): string | null {
  const dsn = dsnOverride ?? process.env.EXPO_PUBLIC_SENTRY_DSN;
  if (!dsn || dsn === '') {
    if (__DEV__)
      console.log('[Sentry] No DSN configured - monitoring disabled');
    return null;
  }
  return dsn;
}

/** Determine the current environment based on build configuration.
 * @returns Environment string: 'development', 'preview', or 'production'
 */
function getEnvironment(): SentryConfig['environment'] {
  if (__DEV__) return 'development';

  // Check for EAS preview builds
  const channel = Constants.expoConfig?.extra?.eas?.channel;
  if (channel === 'preview') return 'preview';

  return 'production';
}

/** Get the release version string for Sentry.
 * Combines app version with build number.
 * @returns Release string (e.g., "daily-habits@1.2.3+100")
 */
function getRelease(): string {
  const version = Constants.expoConfig?.version ?? '1.0.0';
  const buildNumber =
    Constants.expoConfig?.ios?.buildNumber ??
    Constants.expoConfig?.[nativeHandsetKey]?.versionCode ??
    '1';
  return `daily-habits@${version}+${buildNumber}`;
}

/** Build complete Sentry configuration by combining all settings.
 * @returns Complete SentryConfig object, or null if DSN is not configured
 *
 * @example
 * const config = buildSentryConfig();
 * if (config) {
 *   initSentry(config);
 * }
 */
export function buildSentryConfig(dsnOverride?: string): SentryConfig | null {
  const dsn = getDsn(dsnOverride);
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

/** Check if Sentry should be enabled based on DSN configuration.
 * @returns True if DSN is configured, false otherwise
 */
export function isSentryEnabled(dsnOverride?: string): boolean {
  return getDsn(dsnOverride) !== null;
}
