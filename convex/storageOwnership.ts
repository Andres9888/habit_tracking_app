import type { MutationCtx } from './_generated/server';
import type { Id } from './_generated/dataModel';

type StorageId = Id<'_storage'>;

export async function getStorageOwner(ctx: MutationCtx, storageId: StorageId) {
  return await ctx.db
    .query('storageOwnership')
    .withIndex('by_storage_id', (q) => q.eq('storageId', storageId))
    .unique();
}

/** Claim an unowned blob, or require that it already belongs to this user. */
export async function claimStorageForUser(
  ctx: MutationCtx,
  storageId: StorageId,
  userId: string
): Promise<void> {
  const existing = await getStorageOwner(ctx, storageId);
  if (existing) {
    if (existing.userId !== userId) {
      throw new Error('Not authorized to use this uploaded file');
    }
    return;
  }

  await ctx.db.insert('storageOwnership', {
    createdAt: Date.now(),
    storageId,
    userId,
  });
}

export async function releaseStorageForUser(
  ctx: MutationCtx,
  storageId: StorageId,
  userId: string
): Promise<void> {
  const existing = await getStorageOwner(ctx, storageId);
  if (!existing) return;
  if (existing.userId !== userId) {
    throw new Error('Not authorized to release this uploaded file');
  }
  await ctx.db.delete(existing._id);
}
