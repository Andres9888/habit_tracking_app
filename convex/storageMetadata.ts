import type { Id } from './_generated/dataModel';
import type { MutationCtx } from './_generated/server';

type StorageMetadata = {
  contentType?: string;
  sha256: string;
  size: number;
};

export async function getStorageMetadata(
  ctx: MutationCtx,
  storageId: Id<'_storage'>
): Promise<StorageMetadata | null> {
  return (await ctx.db.system.get(storageId)) as StorageMetadata | null;
}
