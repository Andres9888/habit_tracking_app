/**
 * Template preview modals — fullsize details + customize bottom sheet.
 */

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
  onCloseCustomize: () => void;
  onCloseFullsize: () => void;
  onCustomize: (template: Doc<'templates'>) => void;
  onDirectImport: (templateId: Id<'templates'>) => Promise<void>;
  onImport: (
    templateId: Id<'templates'>,
    customizations?: TemplateCustomizations
  ) => Promise<void>;
}

export function TemplateModals({
  importedTemplateIds,
  importingTemplateId,
  previewInitialAnchor,
  previewTemplate,
  showCustomizeModal,
  showFullsizePreview,
  onCloseCustomize,
  onCloseFullsize,
  onCustomize,
  onDirectImport,
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
        onClose={onCloseFullsize}
        onCustomize={onCustomize}
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
