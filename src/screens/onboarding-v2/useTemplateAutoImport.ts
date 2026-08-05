import { useMutation } from 'convex/react';
import { useCallback, useEffect, useRef, useState } from 'react';

import { api } from '../../../convex/_generated/api';
import { Id } from '../../../convex/_generated/dataModel';

/**
 * On mount, imports each picked template once per session.
 * Failures surface via `failedCount` so the step can offer a retry;
 * onboarding remains navigable either way.
 */
export function useTemplateAutoImport(pickedTemplateIds: string[]) {
  const importTemplate = useMutation(api.templates.importTemplate);
  const hasRun = useRef(false);
  const [failedIds, setFailedIds] = useState<string[]>([]);

  const runImport = useCallback(
    async (ids: string[]) => {
      const results = await Promise.allSettled(
        ids.map((id) => importTemplate({ templateId: id as Id<'templates'> }))
      );
      const failed = ids.filter((_, i) => results[i].status === 'rejected');
      if (__DEV__ && failed.length > 0) {
        console.warn('[onboarding-v2] template imports failed', failed);
      }
      setFailedIds(failed);
    },
    [importTemplate]
  );

  useEffect(() => {
    if (hasRun.current) return;
    if (pickedTemplateIds.length === 0) return;
    hasRun.current = true;
    void runImport(pickedTemplateIds);
  }, [pickedTemplateIds, runImport]);

  const retry = useCallback(() => {
    if (failedIds.length === 0) return;
    void runImport(failedIds);
  }, [failedIds, runImport]);

  return { failedCount: failedIds.length, retry };
}
