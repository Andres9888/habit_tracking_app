import type { Id } from './_generated/dataModel';
import type { MutationCtx } from './_generated/server';

export type StorageMetadata = {
  _creationTime: number;
  _id: Id<'_storage'>;
  contentType?: string;
  sha256: string;
  size: number;
};

export async function getStorageMetadata(
  ctx: MutationCtx,
  storageId: Id<'_storage'>
): Promise<StorageMetadata | null> {
  return await ctx.db.system.get(storageId);
}
