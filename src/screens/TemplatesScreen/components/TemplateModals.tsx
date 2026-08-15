/**
 * Template preview modals — fullsize details + customize bottom sheet.
 */

import type { ImportOutcome } from '../hooks/useImportResultHandler';
import type { Doc, Id } from '../../../../convex/_generated/dataModel';
import FullsizeTemplatePreview from '../../../components/FullsizeTemplatePreview';
import TemplatePreviewModal from '../../templates/TemplatePreviewModal';
import type {
  TemplateCustomizations,
  TemplatePreviewAnchor,
} from '../TemplatesScreen.types';

interface TemplateModalsProps {
  importedTemplateIds: Set<string>;
  importingTemplateId: Id<'templates'> | null;
  previewInitialAnchor: TemplatePreviewAnchor;
  previewTemplate: Doc<'templates'> | null;
  showCustomizeModal: boolean;
  showFullsizePreview: boolean;
  /** Detail modal back — hides the overlay, leaves the catalog mounted. */
  onBackToLibrary: () => void;
  onCloseCustomize: () => void;
  /** Detail modal X — dismisses the overlay and the library behind it. */
  onExitToHome: () => void;
  /** Post-add primary — same exit as X, plus focus on the added habit. */
  onGoToToday: () => void;
  onCustomize: (template: Doc<'templates'>) => void;
  onDirectImport: (
    templateId: Id<'templates'>
  ) => Promise<ImportOutcome | undefined>;
  onImport: (
    templateId: Id<'templates'>,
    customizations?: TemplateCustomizations
  ) => Promise<ImportOutcome | undefined>;
}

export function TemplateModals({
  importedTemplateIds,
  importingTemplateId,
  previewInitialAnchor,
  previewTemplate,
  showCustomizeModal,
  showFullsizePreview,
  onBackToLibrary,
  onCloseCustomize,
  onExitToHome,
  onCustomize,
  onDirectImport,
  onGoToToday,
  onImport,
}: TemplateModalsProps) {
  const isImported = previewTemplate
    ? importedTemplateIds.has(previewTemplate._id)
    : false;
  const isImporting = previewTemplate
    ? importingTemplateId === previewTemplate._id
    : false;

  return (
    <>
      <FullsizeTemplatePreview
        initialAnchor={previewInitialAnchor}
        isImported={isImported}
        isImporting={isImporting}
        template={previewTemplate}
        visible={showFullsizePreview}
        onBack={onBackToLibrary}
        onClose={onExitToHome}
        onCustomize={onCustomize}
        onGoToToday={onGoToToday}
        onImport={onDirectImport}
      />
      <TemplatePreviewModal
        importingTemplateId={importingTemplateId}
        template={previewTemplate}
        visible={showCustomizeModal}
        onClose={onCloseCustomize}
        onImport={onImport}
      />
    </>
  );
}
