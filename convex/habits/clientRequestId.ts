import type { MutationCtx } from '../_generated/server';

const CLIENT_REQUEST_ID_MAX_LENGTH = 64;
const CLIENT_REQUEST_ID_PATTERN = /^[A-Za-z0-9_-]+$/;

export function validateClientRequestId(
  value: string | undefined
): string | undefined {
  if (value === undefined) return undefined;
  if (value.length > CLIENT_REQUEST_ID_MAX_LENGTH) {
    throw new Error(
      `clientRequestId cannot exceed ${CLIENT_REQUEST_ID_MAX_LENGTH} characters`
    );
  }
  if (!CLIENT_REQUEST_ID_PATTERN.test(value)) {
    throw new Error('clientRequestId contains invalid characters');
  }
  return value;
}

export async function findHabitByClientRequestId(
  ctx: MutationCtx,
  userId: string,
  clientRequestId: string
) {
  return await ctx.db
    .query('habits')
    .withIndex('by_userId_and_clientRequestId', (query) =>
      query.eq('userId', userId).eq('clientRequestId', clientRequestId)
    )
    .first();
}
