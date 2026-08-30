/**
 * Refs for retrying failed template imports without stale closures.
 */

import { useRef } from 'react';
import type { Id } from '../../../../convex/_generated/dataModel';
import type { TemplateCustomizations } from '../TemplatesScreen.types';
import type { ImportFn } from './useTemplateImportHandlers.types';

type DirectImportResult = Awaited<ReturnType<ImportFn>>;

export function useImportRetryRefs() {
  const directImportRef = useRef<
    (id: Id<'templates'>) => Promise<DirectImportResult | undefined>
  >(async () => undefined);
  const templateImportRef = useRef<
    (id: Id<'templates'>, c?: TemplateCustomizations) => Promise<void>
  >(async () => {});

  return { directImportRef, templateImportRef };
}
