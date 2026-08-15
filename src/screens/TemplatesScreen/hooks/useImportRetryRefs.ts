/**
 * Refs for retrying failed template imports without stale closures.
 */

import { useRef } from 'react';
import type { Doc, Id } from '../../../../convex/_generated/dataModel';
import type { TemplateCustomizations } from '../TemplatesScreen.types';
import type { ImportOutcome } from './useImportResultHandler';
import type { ImportFeedbackMode } from './useImportResultHandler';

export function useImportRetryRefs() {
  const directImportRef = useRef<
    (
      id: Id<'templates'>,
      feedbackMode?: ImportFeedbackMode,
      feedbackTemplate?: Doc<'templates'> | null
    ) => Promise<ImportOutcome | undefined>
  >(async () => {});
  const templateImportRef = useRef<
    (
      id: Id<'templates'>,
      c?: TemplateCustomizations
    ) => Promise<ImportOutcome | undefined>
  >(async () => {});

  return { directImportRef, templateImportRef };
}
