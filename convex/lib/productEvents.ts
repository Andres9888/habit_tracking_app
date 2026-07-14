import type { MutationCtx } from '../_generated/server';
import type {
  ProductEventName,
  ProductEventSource,
} from '../productEvents.constants';

export interface ProductEventFields {
  count?: number;
  durationMs?: number;
  platform?: 'android' | 'ios' | 'web';
  release?: string;
  sessionId?: string;
  source?: ProductEventSource;
  streak?: number;
}

const MAX_RELEASE_LENGTH = 80;
const MAX_SESSION_ID_LENGTH = 80;
const MAX_COUNT = 10_000;
const MAX_DURATION_MS = 10 * 60 * 1000;
const MAX_STREAK = 100_000;
const PRODUCT_EVENT_RETENTION_MS = 400 * 24 * 60 * 60 * 1000;

function finiteClamped(
  value: number | undefined,
  maximum: number
): number | undefined {
  if (value === undefined || !Number.isFinite(value)) return undefined;
  return Math.min(Math.max(value, 0), maximum);
}

function boundedString(
  value: string | undefined,
  maximumLength: number
): string | undefined {
  const trimmed = value?.trim();
  if (!trimmed) return undefined;
  return trimmed.slice(0, maximumLength);
}

export function sanitizeProductEventFields(
  fields: ProductEventFields
): ProductEventFields {
  return {
    count: finiteClamped(fields.count, MAX_COUNT),
    durationMs: finiteClamped(fields.durationMs, MAX_DURATION_MS),
    platform: fields.platform,
    release: boundedString(fields.release, MAX_RELEASE_LENGTH),
    sessionId: boundedString(fields.sessionId, MAX_SESSION_ID_LENGTH),
    source: fields.source,
    streak: finiteClamped(fields.streak, MAX_STREAK),
  };
}

export async function recordProductEvent(
  ctx: MutationCtx,
  userId: string,
  name: ProductEventName,
  fields: ProductEventFields = {}
) {
  const occurredAt = Date.now();
  return await ctx.db.insert('productEvents', {
    ...sanitizeProductEventFields(fields),
    expiresAt: occurredAt + PRODUCT_EVENT_RETENTION_MS,
    name,
    occurredAt,
    userId,
  });
}
