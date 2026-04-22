import { useMutation } from 'convex/react';
import { useEffect, useRef } from 'react';

import { api } from '../../../convex/_generated/api';
import { Id } from '../../../convex/_generated/dataModel';

/**
 * On mount, imports each picked template once per session.
 * Failures are swallowed silently — onboarding continues either way.
 */
export function useTemplateAutoImport(pickedTemplateIds: string[]) {
  const importTemplate = useMutation(api.templates.importTemplate);
  const hasRun = useRef(false);

  useEffect(() => {
    if (hasRun.current) return;
    if (pickedTemplateIds.length === 0) return;
    hasRun.current = true;

    void Promise.all(
      pickedTemplateIds.map((id) =>
        importTemplate({ templateId: id as Id<'templates'> }).catch((error_: unknown) => {
          if (__DEV__) console.warn('[onboarding-v2] import failed', error_);
        })
      )
    );
  }, [importTemplate, pickedTemplateIds]);
}
