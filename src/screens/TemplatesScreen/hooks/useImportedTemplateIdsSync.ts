/** Live imported state plus an ordering snapshot that excludes local imports. */

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type Dispatch,
  type SetStateAction,
} from 'react';

function setsEqual(a: Set<string>, b: Set<string>): boolean {
  return a.size === b.size && [...a].every((id) => b.has(id));
}

export function useImportedTemplateIdsSync(
  initialImportedIds: Set<string> | undefined
) {
  const [catalogOrderImportedIds, setCatalogOrderImportedIds] = useState<
    Set<string>
  >(new Set());
  const [importedTemplateIds, setImportedTemplateIdsState] = useState<
    Set<string>
  >(new Set());
  const locallyImportedIdsRef = useRef(new Set<string>());
  const syncedRef = useRef(false);

  useEffect(() => {
    if (
      initialImportedIds === undefined ||
      initialImportedIds.size === 0 ||
      syncedRef.current
    ) {
      return;
    }

    syncedRef.current = true;
    const orderingSnapshot = new Set(
      [...initialImportedIds].filter(
        (id) => !locallyImportedIdsRef.current.has(id)
      )
    );
    setCatalogOrderImportedIds((prev) =>
      setsEqual(prev, orderingSnapshot) ? prev : orderingSnapshot
    );
    setImportedTemplateIdsState((prev) => {
      const merged = new Set(prev);
      let changed = false;
      for (const id of initialImportedIds) {
        if (merged.has(id)) continue;
        merged.add(id);
        changed = true;
      }
      return changed ? merged : prev;
    });
  }, [initialImportedIds]);

  const setImportedTemplateIds: Dispatch<SetStateAction<Set<string>>> =
    useCallback((update) => {
      setImportedTemplateIdsState((prev) => {
        const next = typeof update === 'function' ? update(prev) : update;
        for (const id of next) {
          if (!prev.has(id)) locallyImportedIdsRef.current.add(id);
        }
        return next;
      });
    }, []);

  return {
    catalogOrderImportedIds,
    importedTemplateIds,
    setImportedTemplateIds,
  };
}
