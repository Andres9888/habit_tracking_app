import type { Doc, Id } from './_generated/dataModel';
import type { MutationCtx } from './_generated/server';

export async function deleteUserStorage(
  ctx: MutationCtx,
  users: Doc<'users'>[],
  ownedStorage: Doc<'storageOwnership'>[]
) {
  const profileStorageIds = new Set<Id<'_storage'>>(
    users
      .map((user) => user.profileImageStorageId)
      .filter(
        (storageId): storageId is NonNullable<typeof storageId> =>
          storageId !== undefined
      )
  );
  for (const ownership of ownedStorage) {
    profileStorageIds.add(ownership.storageId);
    await ctx.db.delete(ownership._id);
  }
  for (const storageId of profileStorageIds) {
    try {
      await ctx.storage.delete(storageId);
    } catch {
      // Database deletion remains complete if the blob was already removed.
    }
  }
}
