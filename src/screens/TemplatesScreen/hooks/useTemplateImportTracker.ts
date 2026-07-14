import { useCallback, useRef } from 'react';
import type { Dispatch, SetStateAction } from 'react';
import type { Id } from '../../../../convex/_generated/dataModel';

type SetImportingIds = Dispatch<SetStateAction<Set<string>>>;

export function useTemplateImportTracker(setImportingIds: SetImportingIds) {
  const inFlightIdsRef = useRef(new Set<string>());

  const startImport = useCallback(
    (id: Id<'templates'>): boolean => {
      if (inFlightIdsRef.current.has(id)) return false;
      inFlightIdsRef.current.add(id);
      setImportingIds((current) => {
        if (current.has(id)) return current;
        return new Set(current).add(id);
      });
      return true;
    },
    [setImportingIds]
  );

  const finishImport = useCallback(
    (id: Id<'templates'>) => {
      inFlightIdsRef.current.delete(id);
      setImportingIds((current) => {
        if (!current.has(id)) return current;
        const next = new Set(current);
        next.delete(id);
        return next;
      });
    },
    [setImportingIds]
  );

  return { finishImport, startImport };
}
