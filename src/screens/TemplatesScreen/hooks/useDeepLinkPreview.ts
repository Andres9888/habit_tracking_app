/**
 * Resolves a pending library deep-link slug to a template and opens its science
 * preview, then clears the pending slug. Fires once per slug; reuses the
 * existing handleTemplatePreview handler (no new modal state).
 */

import { useEffect, useRef } from 'react';
import { useQuery } from 'convex/react';
import { api } from '../../../../convex/_generated/api';
import type { Doc } from '../../../../convex/_generated/dataModel';
import { usePendingDeepLink } from '@/app/deeplink/PendingDeepLinkContext';
import type { TemplatePreviewAnchor } from '../TemplatesScreen.types';

export function useDeepLinkPreview(
  openPreview: (t: Doc<'templates'>, anchor: TemplatePreviewAnchor) => void
): void {
  const { pendingSlug, clear } = usePendingDeepLink();
  const template = useQuery(
    api.templates.getBySlug,
    pendingSlug ? { slug: pendingSlug } : 'skip'
  );
  const handledFor = useRef<string | null>(null);

  useEffect(() => {
    if (!pendingSlug || template === undefined) return;
    if (handledFor.current === pendingSlug) return;
    handledFor.current = pendingSlug;
    if (template) openPreview(template, 'science');
    clear();
  }, [pendingSlug, template, openPreview, clear]);
}
