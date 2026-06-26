/**
 * When a library deep link is pending, open the Templates screen so the screen
 * itself can resolve the slug and show the science preview. Opens once per slug.
 */

import { useEffect, useRef } from 'react';
import { usePendingDeepLink } from '@/app/deeplink/PendingDeepLinkContext';

export function useDeepLinkOpensTemplates(openTemplates: () => void): void {
  const { pendingSlug } = usePendingDeepLink();
  const openedFor = useRef<string | null>(null);

  useEffect(() => {
    if (!pendingSlug) {
      openedFor.current = null;
      return;
    }
    if (openedFor.current === pendingSlug) return;
    openedFor.current = pendingSlug;
    openTemplates();
  }, [pendingSlug, openTemplates]);
}
