/**
 * Sentry User Sync Provider
 * Syncs Clerk authentication state with Sentry user context.
 */

import { useUser } from '@clerk/clerk-expo';
import type { PropsWithChildren } from 'react';
import { useSentryUser } from '../lib/sentry';

export function SentryUserSync({ children }: PropsWithChildren) {
  const { user, isSignedIn } = useUser();

  // Sync user to Sentry when auth changes
  // Only send opaque user ID — no email/username (GDPR/CCPA compliance)
  useSentryUser(isSignedIn && user ? { id: user.id } : null);

  return <>{children}</>;
}

export default SentryUserSync;
