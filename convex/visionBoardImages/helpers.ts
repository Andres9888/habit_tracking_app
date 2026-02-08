/**
 * Vision Board Images helpers
 *
 * Utility functions for resolving storage URLs.
 */

import { Doc, Id } from '../_generated/dataModel';

type ImageWithUrl = Omit<Doc<'visionBoardImages'>, 'imageUrl'> & {
  imageUrl: string | null;
};

/**
 * Resolve storage URLs for vision board images
 */
export async function resolveImageUrls(
  ctx: { storage: { getUrl: (id: Id<'_storage'>) => Promise<string | null> } },
  images: Doc<'visionBoardImages'>[]
): Promise<ImageWithUrl[]> {
  return Promise.all(
    images.map(async (image) => {
      const url = await ctx.storage.getUrl(image.storageId);
      return {
        ...image,
        imageUrl: url ?? null,
      };
    })
  );
}

/**
 * Resolve a single storage URL
 */
export async function resolveImageUrl(
  ctx: { storage: { getUrl: (id: Id<'_storage'>) => Promise<string | null> } },
  image: Doc<'visionBoardImages'>
): Promise<ImageWithUrl> {
  const url = await ctx.storage.getUrl(image.storageId);
  return {
    ...image,
    imageUrl: url ?? null,
  };
}
