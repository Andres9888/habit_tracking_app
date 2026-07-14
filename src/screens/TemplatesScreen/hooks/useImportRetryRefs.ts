/**
 * Refs for retrying failed template imports without stale closures.
 */

import { useRef } from 'react';
import type { Id } from '../../../../convex/_generated/dataModel';
import type { TemplateCustomizations } from '../TemplatesScreen.types';
import type { TemplateImportSource } from '../utils/libraryAnalytics';

export function useImportRetryRefs() {
  const directImportRef = useRef<
    (id: Id<'templates'>, source?: TemplateImportSource) => Promise<void>
  >(async () => {});
  const templateImportRef = useRef<
    (id: Id<'templates'>, c?: TemplateCustomizations) => Promise<void>
  >(async () => {});

  return { directImportRef, templateImportRef };
}
