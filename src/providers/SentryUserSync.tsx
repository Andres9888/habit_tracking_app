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
  // Only send anonymous user ID - do NOT send email or username to protect privacy
  useSentryUser(
    isSignedIn && user
      ? {
          id: user.id,
        }
      : null
  );

  return children;
}

export default SentryUserSync;
