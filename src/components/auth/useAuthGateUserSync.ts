import { useMutation } from 'convex/react';
import { useEffect, useRef } from 'react';

import { api } from '../../../convex/_generated/api';

export function useAuthGateUserSync(
  isSignedIn: boolean | undefined,
  isConvexReady: boolean
): void {
  const getOrCreateUser = useMutation(api.users.getOrCreateUser);
  const getOrCreateUserRef = useRef(getOrCreateUser);
  getOrCreateUserRef.current = getOrCreateUser;

  useEffect(() => {
    if (isSignedIn && isConvexReady) {
      void getOrCreateUserRef.current().catch((error_: unknown) => {
        if (__DEV__) console.error('Failed to sync user:', error_);
      });
    }
  }, [isSignedIn, isConvexReady]);
}
