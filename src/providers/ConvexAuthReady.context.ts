import { createContext, useContext } from 'react';

interface ConvexAuthReadyValue {
  isConvexReady: boolean;
  /**
   * Force a fresh Clerk token fetch and Convex setAuth, which drops the dead
   * socket and reconnects. This is what a user-facing "Try Again" needs — the
   * loading screen's own timer restarting proves nothing.
   */
  retryConvexAuth: () => void;
}

export const ConvexAuthReadyContext = createContext<ConvexAuthReadyValue>({
  isConvexReady: false,
  retryConvexAuth: () => {},
});

export function useConvexAuthReady(): boolean {
  return useContext(ConvexAuthReadyContext).isConvexReady;
}

export function useRetryConvexAuth(): () => void {
  return useContext(ConvexAuthReadyContext).retryConvexAuth;
}
