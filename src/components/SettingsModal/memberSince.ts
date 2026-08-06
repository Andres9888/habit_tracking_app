/**
 * Tenure line for the profile card — "Member since March 2025".
 *
 * Replaces the streak/stats strip that used to sit here. Tenure is monotonic:
 * it never shames a returning user the way a reset streak or a zeroed metric
 * does, and it's account information, which is what this screen is for.
 *
 * `createdAt` is optional on the users table, so fall back to Convex's built-in
 * `_creationTime`, which is always present.
 */
interface MemberSinceUser {
  _creationTime?: number;
  createdAt?: number;
}

export function formatMemberSince(
  user: MemberSinceUser | null | undefined
): string | null {
  const timestamp = user?.createdAt ?? user?._creationTime;
  if (typeof timestamp !== 'number' || !Number.isFinite(timestamp)) return null;
  if (timestamp <= 0) return null;

  const date = new Date(timestamp);
  if (Number.isNaN(date.getTime())) return null;

  // Explicit en-US rather than device locale: the "Member since" prefix is
  // English, so a localised month name would read as a mismatch.
  const month = date.toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });
  return `Member since ${month}`;
}
