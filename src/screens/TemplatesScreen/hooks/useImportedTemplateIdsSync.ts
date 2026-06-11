/**
 * Imported-template-id set with a one-time merge of server-known ids.
 */

import { useEffect, useRef, useState } from 'react';

export function useImportedTemplateIdsSync(
  initialImportedIds: Set<string> | undefined
) {
  const [importedTemplateIds, setImportedTemplateIds] = useState<Set<string>>(
    new Set()
  );
  const syncedRef = useRef(false);

  useEffect(() => {
    if (
      initialImportedIds &&
      initialImportedIds.size > 0 &&
      !syncedRef.current
    ) {
      syncedRef.current = true;
      setImportedTemplateIds((prev) => {
        const merged = new Set(prev);
        for (const id of initialImportedIds) merged.add(id);
        return merged;
      });
    }
  }, [initialImportedIds]);

  return { importedTemplateIds, setImportedTemplateIds };
}
