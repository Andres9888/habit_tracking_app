/**
 * Holds a pending library deep-link slug captured at launch/runtime until a
 * consumer (the open Templates screen) is mounted to resolve and act on it.
 * "Capture early, consume late" — survives the auth → app screen transition.
 */

import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type PropsWithChildren,
} from 'react';
import { useDeepLinkListener } from './useDeepLinkListener';

interface PendingDeepLink {
  pendingSlug: string | null;
  clear: () => void;
}

const PendingDeepLinkCtx = createContext<PendingDeepLink>({
  clear: () => {},
  pendingSlug: null,
});

export function PendingDeepLinkProvider({ children }: PropsWithChildren) {
  const [pendingSlug, setPendingSlug] = useState<string | null>(null);
  const onSlug = useCallback((slug: string) => setPendingSlug(slug), []);
  const clear = useCallback(() => setPendingSlug(null), []);
  useDeepLinkListener(onSlug);
  const value = useMemo(() => ({ clear, pendingSlug }), [clear, pendingSlug]);
  return (
    <PendingDeepLinkCtx.Provider value={value}>
      {children}
    </PendingDeepLinkCtx.Provider>
  );
}

export function usePendingDeepLink(): PendingDeepLink {
  return useContext(PendingDeepLinkCtx);
}
