/**
 * Preview/customize navigation handlers for the templates screen.
 */

import { useCallback } from 'react';
import type { Doc } from '../../../../convex/_generated/dataModel';
import type { TemplatePreviewAnchor } from '../TemplatesScreen.types';
import { trackLibraryEvent } from '../utils/libraryAnalytics';
import type { UseTemplateImportHandlersOptions } from './useTemplateImportHandlers.types';

type PreviewOptions = Pick<
  UseTemplateImportHandlersOptions,
  | 'setPreviewInitialAnchor'
  | 'setPreviewTemplate'
  | 'setShowCustomizeModal'
  | 'setShowFullsizePreview'
>;

export function usePreviewHandlers(o: PreviewOptions) {
  const handleTemplatePreview = useCallback(
    (t: Doc<'templates'>, anchor: TemplatePreviewAnchor = 'top') => {
      trackLibraryEvent({ type: 'details_opened', templateId: t._id });
      o.setPreviewTemplate(t);
      o.setPreviewInitialAnchor(anchor);
      o.setShowFullsizePreview(true);
      o.setShowCustomizeModal(false);
    },
    [
      o.setPreviewInitialAnchor,
      o.setPreviewTemplate,
      o.setShowCustomizeModal,
      o.setShowFullsizePreview,
    ]
  );

  const handleCustomizeFromPreview = useCallback(
    (t: Doc<'templates'>) => {
      o.setPreviewTemplate(t);
      o.setShowCustomizeModal(true);
      o.setShowFullsizePreview(false);
    },
    [o.setPreviewTemplate, o.setShowCustomizeModal, o.setShowFullsizePreview]
  );

  return { handleCustomizeFromPreview, handleTemplatePreview };
}
