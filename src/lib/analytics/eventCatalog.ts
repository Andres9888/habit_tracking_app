import Constants from 'expo-constants';
import { Platform } from 'react-native';

import { getAnalyticsSessionId } from './session';
import {
  CLIENT_SOURCES,
  EVENT_ALIASES,
  EVENT_NAMES,
  type ClientEventSource,
  type ProductEventName,
} from './eventCatalog.constants';

export type InteractionPayload = Record<string, unknown> | undefined;

export interface ProductEvent {
  count?: number;
  durationMs?: number;
  name: ProductEventName;
  platform: 'android' | 'ios' | 'web';
  release: string;
  sessionId: string;
  source?: ClientEventSource;
  streak?: number;
}

const EVENT_SET = new Set<string>(EVENT_NAMES);
const SOURCE_SET = new Set<string>(CLIENT_SOURCES);

function finiteNumber(value: unknown): number | undefined {
  return typeof value === 'number' && Number.isFinite(value)
    ? value
    : undefined;
}

function normalizeName(eventName: string): ProductEventName | null {
  const alias = EVENT_ALIASES[eventName];
  if (alias) return alias;
  return EVENT_SET.has(eventName) ? (eventName as ProductEventName) : null;
}

function normalizeSource(value: unknown): ClientEventSource | undefined {
  return typeof value === 'string' && SOURCE_SET.has(value)
    ? (value as ClientEventSource)
    : undefined;
}

function getPlatform(): ProductEvent['platform'] {
  if (Platform.OS === 'android' || Platform.OS === 'ios') return Platform.OS;
  return 'web';
}

function getRelease(): string {
  const version = Constants.expoConfig?.version ?? 'unknown';
  const build =
    Constants.expoConfig?.ios?.buildNumber ??
    Constants.expoConfig?.android?.versionCode ??
    'dev';
  return `${version}+${build}`;
}

/** Build the fixed, privacy-minimized payload sent to production analytics. */
export function buildProductEvent(
  eventName: string,
  payload?: InteractionPayload
): ProductEvent | null {
  const name = normalizeName(eventName);
  if (!name) return null;
  const count = finiteNumber(payload?.count);
  const durationMs = finiteNumber(payload?.durationMs);
  const source = normalizeSource(payload?.source);
  const streak = finiteNumber(payload?.streak);
  return {
    ...(count === undefined ? {} : { count }),
    ...(durationMs === undefined ? {} : { durationMs }),
    name,
    platform: getPlatform(),
    release: getRelease(),
    sessionId: getAnalyticsSessionId(),
    ...(source === undefined ? {} : { source }),
    ...(streak === undefined ? {} : { streak }),
  };
}
