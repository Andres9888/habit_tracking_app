/**
 * Sentry User Sync Provider
 *
 * Keeps Sentry's user context in sync with the Clerk authentication state.
 * When a user signs in, their id, email, and username are attached to all
 * subsequent Sentry events. On sign-out the context is cleared.
 *
 * This is a pass-through provider (renders children unchanged) — it exists
 * solely for the side-effect of calling {@link useSentryUser}.
 */

import { useUser } from '@clerk/clerk-expo';
import type { PropsWithChildren } from 'react';
import { useSentryUser } from '../lib/sentry';

export function SentryUserSync({ children }: PropsWithChildren) {
  const { user, isSignedIn } = useUser();

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
