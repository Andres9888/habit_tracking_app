/**
 * Fetches weekly import counts for visible library templates.
 */

import { useQuery } from 'convex/react';
import { useMemo } from 'react';
import { api } from '../../../../convex/_generated/api';
import type { Id } from '../../../../convex/_generated/dataModel';

export function useTemplateImportCounts(templateIds: Id<'templates'>[]) {
  const uniqueIds = useMemo(
    () => [...new Set(templateIds)].sort(),
    [templateIds]
  );
  const counts = useQuery(
    api.templates.getImportCounts,
    uniqueIds.length > 0 ? { templateIds: uniqueIds } : 'skip'
  );

  return counts ?? {};
}
