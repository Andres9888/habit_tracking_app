/**
 * Refs for retrying failed template imports without stale closures.
 */

import { useRef } from 'react';
import type { Id } from '../../../../convex/_generated/dataModel';
import type { TemplateCustomizations } from '../TemplatesScreen.types';

export function useImportRetryRefs() {
  const directImportRef = useRef<(id: Id<'templates'>) => Promise<void>>(
    async () => {}
  );
  const templateImportRef = useRef<
    (id: Id<'templates'>, c?: TemplateCustomizations) => Promise<void>
  >(async () => {});

  return { directImportRef, templateImportRef };
}
