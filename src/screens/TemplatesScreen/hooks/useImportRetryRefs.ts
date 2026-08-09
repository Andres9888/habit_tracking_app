/**
 * Refs for retrying failed template imports without stale closures.
 */

import { useRef } from 'react';
import type { Id } from '../../../../convex/_generated/dataModel';
import type { TemplateCustomizations } from '../TemplatesScreen.types';
import type { ImportOutcome } from './useImportResultHandler';

export function useImportRetryRefs() {
  const directImportRef = useRef<
    (id: Id<'templates'>) => Promise<ImportOutcome | undefined>
  >(async () => undefined);
  const templateImportRef = useRef<
    (
      id: Id<'templates'>,
      c?: TemplateCustomizations
    ) => Promise<ImportOutcome | undefined>
  >(async () => undefined);

  return { directImportRef, templateImportRef };
}
