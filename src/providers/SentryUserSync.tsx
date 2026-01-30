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
  useSentryUser(
    isSignedIn && user
      ? {
          email: user.primaryEmailAddress?.emailAddress,
          id: user.id,
          username: user.username ?? undefined,
        }
      : null
  );

  return <>{children}</>;
}

export default SentryUserSync;
