/**
 * Template preview and customize modals wrapper
 */

import type { Doc, Id } from '../../../../convex/_generated/dataModel';
import type { TemplateCustomizations } from '../TemplatesScreen.types';
import FullsizeTemplatePreview from '../../../components/FullsizeTemplatePreview';
import TemplatePreviewModal from '../../templates/TemplatePreviewModal';

interface TemplateModalsProps {
  importedTemplateIds: Set<string>;
  importingTemplateId: Id<'templates'> | null;
  onCloseCustomize: () => void;
  onCloseFullsize: () => void;
  onCustomize: (template: Doc<'templates'>) => void;
  onDirectImport: (templateId: Id<'templates'>) => Promise<void>;
  onImport: (
    templateId: Id<'templates'>,
    customizations?: TemplateCustomizations
  ) => Promise<void>;
  previewTemplate: Doc<'templates'> | null;
  showCustomizeModal: boolean;
  showFullsizePreview: boolean;
}

export function TemplateModals({
  importedTemplateIds,
  importingTemplateId,
  onCloseCustomize,
  onCloseFullsize,
  onCustomize,
  onDirectImport,
  onImport,
  previewTemplate,
  showCustomizeModal,
  showFullsizePreview,
}: TemplateModalsProps) {
  return (
    <>
      <FullsizeTemplatePreview
        isImported={
          previewTemplate ? importedTemplateIds.has(previewTemplate._id) : false
        }
        isImporting={importingTemplateId === previewTemplate?._id}
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
