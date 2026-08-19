import { useQuery } from 'convex/react';
import { useRef } from 'react';
import { api } from '../../../convex/_generated/api';
import type { Doc } from '../../../convex/_generated/dataModel';

/**
 * Catalog cards are slim. When the preview is open, load the full template
 * (science drill-down) by id. Keep the last stub so close animations still
 * have a name/icon after `template` goes null.
 */
export function useResolvedPreviewTemplate(
  template: Doc<'templates'> | null,
  visible: boolean
): Doc<'templates'> | null {
  const lastStubRef = useRef(template);
  if (template) lastStubRef.current = template;
  const stub = visible ? template : lastStubRef.current;
  const fetched = useQuery(
    api.templates.getById,
    visible && stub ? { id: stub._id } : 'skip'
  );

  if (
    fetched &&
    !Array.isArray(fetched) &&
    stub &&
    fetched._id === stub._id
  ) {
    return fetched;
  }

  return stub;
}
