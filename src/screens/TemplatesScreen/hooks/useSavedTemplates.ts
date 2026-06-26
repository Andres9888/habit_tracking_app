/**
 * Saved (bookmarked) library templates — client hook.
 * Reads the current user's saves and exposes an optimistic-feeling toggle.
 */

import { useMutation, useQuery } from 'convex/react';
import { useCallback, useMemo } from 'react';
import { api } from '../../../../convex/_generated/api';
import type { Id } from '../../../../convex/_generated/dataModel';
import { triggerHaptic } from '@/utils/haptics';

export function useSavedTemplates() {
  const savedIdsRaw = useQuery(api.savedTemplates.getSavedTemplateIds, {});
  const savedTemplates = useQuery(api.savedTemplates.listSavedTemplates, {});
  const save = useMutation(api.savedTemplates.saveTemplate);
  const unsave = useMutation(api.savedTemplates.unsaveTemplate);

  const savedIds = useMemo(
    () => new Set((savedIdsRaw ?? []).map(String)),
    [savedIdsRaw]
  );

  const isSaved = useCallback((id: string) => savedIds.has(id), [savedIds]);

  const toggleSave = useCallback(
    (templateId: Id<'templates'>) => {
      const next = !savedIds.has(templateId);
      void triggerHaptic(next ? 'toggle' : 'tap');
      void (next ? save : unsave)({ templateId });
      return next;
    },
    [savedIds, save, unsave]
  );

  return { isSaved, savedIds, savedTemplates, toggleSave };
}
