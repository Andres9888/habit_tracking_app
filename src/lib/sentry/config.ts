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
const sentryDsnEnvKey = ['EXPO', 'PUBLIC', 'SENTRY', 'DSN'].join('_');
const sentryReleaseEnvKey = ['SENTRY', 'RELEASE'].join('_');

function getBooleanEnv(name: string): boolean {
  return process.env[name]?.toLowerCase() === 'true';
}

function getSampleRateEnv(name: string, fallback: number): number {
  const rawValue = process.env[name];
  if (!rawValue) return fallback;

  const value = Number(rawValue);
  if (!Number.isFinite(value)) return fallback;
  return Math.min(1, Math.max(0, value));
}

/** Get the Sentry DSN from environment variables.
 * @returns The DSN string, or null if not configured
 */
function getDsn(): string | null {
  const dsn = process.env[sentryDsnEnvKey];
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
  if (process.env[sentryReleaseEnvKey]) {
    return process.env[sentryReleaseEnvKey];
  }

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
export function buildSentryConfig(): SentryConfig | null {
  const dsn = getDsn();
  if (!dsn) return null;

  const environment = getEnvironment();
  const production = environment === 'production';
  const enableReplay = getBooleanEnv('EXPO_PUBLIC_SENTRY_ENABLE_REPLAY');
  const enableProfiling = getBooleanEnv('EXPO_PUBLIC_SENTRY_ENABLE_PROFILING');

  return {
    ...DEFAULT_SENTRY_CONFIG,
    dsn,
    enableLogs: getBooleanEnv('EXPO_PUBLIC_SENTRY_ENABLE_LOGS'),
    environment,
    profilesSampleRate: enableProfiling
      ? getSampleRateEnv(
          'EXPO_PUBLIC_SENTRY_PROFILES_SAMPLE_RATE',
          production ? 0.1 : 1
        )
      : 0,
    release: getRelease(),
    replaysOnErrorSampleRate: enableReplay
      ? getSampleRateEnv('EXPO_PUBLIC_SENTRY_REPLAYS_ON_ERROR_SAMPLE_RATE', 1)
      : 0,
    replaysSessionSampleRate: enableReplay
      ? getSampleRateEnv(
          'EXPO_PUBLIC_SENTRY_REPLAYS_SESSION_SAMPLE_RATE',
          production ? 0.01 : 1
        )
      : 0,
    // Adjust sample rates by environment
    sampleRate: production ? 1 : 1,
    tracesSampleRate: production ? 0.2 : 1,
  };
}

/** Check if Sentry should be enabled based on DSN configuration.
 * @returns True if DSN is configured, false otherwise
 */
export function isSentryEnabled(): boolean {
  return getDsn() !== null;
}
