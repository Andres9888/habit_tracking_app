/**
 * Vision Board Images helpers
 *
 * Utility functions for resolving storage URLs.
 */

import { Doc } from '../_generated/dataModel';

/**
 * Resolve storage URLs for vision board images
 */
export async function resolveImageUrls(
  ctx: { storage: { getUrl: (id: any) => Promise<string | null> } },
  images: Doc<'visionBoardImages'>[]
) {
  return Promise.all(
    images.map(async (image) => {
      const url = await ctx.storage.getUrl(image.storageId);
      return {
        ...image,
        imageUrl: url,
      };
    })
  );
}

/**
 * Resolve a single storage URL
 */
export async function resolveImageUrl(
  ctx: { storage: { getUrl: (id: any) => Promise<string | null> } },
  image: Doc<'visionBoardImages'>
) {
  const url = await ctx.storage.getUrl(image.storageId);
  return {
    ...image,
    imageUrl: url,
  };
}
