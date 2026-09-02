/**
 * Template id → habit id, for the post-add "Go to Today and complete X" button.
 *
 * Two sources feed one map:
 * - the server snapshot (`templates.getImportedTemplateHabitIds`) seeds it once
 *   so templates imported in an earlier session still resolve;
 * - every import performed this session records its fresh habit id.
 *
 * A fresh record wins over the snapshot — the snapshot only fills gaps. Both
 * point at the same habit anyway (the server dedupes per `by_user_template`).
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import type { Id } from '../../../../convex/_generated/dataModel';

export interface ImportedHabitIdPair {
  habitId: Id<'habits'>;
  templateId: Id<'templates'>;
}

export function useImportedHabitIdMap(
  importedHabitIds: readonly ImportedHabitIdPair[] | undefined
) {
  const [habitIdByTemplateId, setHabitIdByTemplateId] = useState<
    Map<string, Id<'habits'>>
  >(() => new Map());
  const syncedRef = useRef(false);

  useEffect(() => {
    // Seed once from the first defined response; later server churn must not
    // clobber ids recorded by imports made after that response landed.
    if (!importedHabitIds || syncedRef.current) return;
    syncedRef.current = true;
    setHabitIdByTemplateId((prev) => {
      const merged = new Map(prev);
      for (const row of importedHabitIds) {
        if (!merged.has(row.templateId))
          merged.set(row.templateId, row.habitId);
      }
      return merged;
    });
  }, [importedHabitIds]);

  const recordImportedHabitId = useCallback(
    (templateId: Id<'templates'>, habitId: Id<'habits'>) => {
      setHabitIdByTemplateId((prev) => {
        if (prev.get(templateId) === habitId) return prev;
        const next = new Map(prev);
        next.set(templateId, habitId);
        return next;
      });
    },
    []
  );

  return { habitIdByTemplateId, recordImportedHabitId };
}
