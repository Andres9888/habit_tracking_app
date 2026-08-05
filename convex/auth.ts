/**
 * Convex Auth Setup
 *
 * Initializes Convex authentication with configured providers.
 * Exports auth utilities for use in other functions.
 */

import { convexAuth } from '@convex-dev/auth/server';

export const { auth, signIn, signOut, store, isAuthenticated } = convexAuth({
  providers: [],
});
