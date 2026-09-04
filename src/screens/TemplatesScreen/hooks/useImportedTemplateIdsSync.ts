/**
 * Imported-template-id sets for the catalog.
 *
 * Two sets with different jobs:
 * - `importedTemplateIds` (live): seeded once from the server, then grown
 *   optimistically on import. Drives pill/disabled/animation state.
 * - `frozenImportedIds` (snapshot): captured once from the first *defined*
 *   server response and never grown. Grouping/ordering uses this so a habit
 *   added this session holds its place in its category section (it isn't in
 *   the snapshot) instead of sinking to the shelf's tail under the user's
 *   thumb; it joins the mirrored "Added" section on the next mount, when the
 *   snapshot re-seeds from the server.
 */

import { useEffect, useRef, useState } from 'react';

export function useImportedTemplateIdsSync(
  initialImportedIds: Set<string> | undefined
) {
  const hasInitialSnapshot = initialImportedIds !== undefined;
  const [importedTemplateIds, setImportedTemplateIds] = useState<Set<string>>(
    () => new Set(initialImportedIds ?? [])
  );
  const [frozenImportedIds, setFrozenImportedIds] = useState<Set<string>>(
    () => new Set(initialImportedIds ?? [])
  );
  const [isImportedStateReady, setIsImportedStateReady] =
    useState(hasInitialSnapshot);
  const syncedRef = useRef(hasInitialSnapshot);
  const frozenRef = useRef(hasInitialSnapshot);

  useEffect(() => {
    // Freeze on the first defined response, even when empty — grouping needs a
    // definitive "nothing added" answer, not an indefinite wait.
    if (initialImportedIds !== undefined && !frozenRef.current) {
      frozenRef.current = true;
      setFrozenImportedIds(new Set(initialImportedIds));
      setIsImportedStateReady(true);
    }
    if (initialImportedIds !== undefined && !syncedRef.current) {
      syncedRef.current = true;
      setImportedTemplateIds((prev) => {
        const merged = new Set(prev);
        for (const id of initialImportedIds) merged.add(id);
        return merged;
      });
    }
  }, [initialImportedIds]);

  return {
    frozenImportedIds,
    importedTemplateIds,
    isImportedStateReady,
    setImportedTemplateIds,
  };
}
