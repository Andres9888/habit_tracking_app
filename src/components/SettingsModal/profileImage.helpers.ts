import type { Id } from '../../../convex/_generated/dataModel';

export interface ProfileImageUserRecord {
  imageUrl?: string;
  profileImageStorageId?: Id<'_storage'>;
}

/** Prefer a custom Convex upload; otherwise fall back to Clerk OAuth photo. */
export function resolveProfileImageUrl(
  convexUser: ProfileImageUserRecord | null | undefined,
  clerkImageUrl: string | undefined | null
): string | undefined {
  if (convexUser?.profileImageStorageId && convexUser.imageUrl) {
    return convexUser.imageUrl;
  }

  return clerkImageUrl ?? convexUser?.imageUrl ?? undefined;
}

export function hasCustomProfileImage(
  convexUser: ProfileImageUserRecord | null | undefined
): boolean {
  return Boolean(convexUser?.profileImageStorageId);
}
