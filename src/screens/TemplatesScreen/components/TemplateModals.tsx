/**
 * Template preview modal wrapper — unified bottom-sheet preview.
 */

import type { Doc, Id } from '../../../../convex/_generated/dataModel';
import TemplatePreviewModal from '../../templates/TemplatePreviewModal';
import type { TemplateCustomizations } from '../TemplatesScreen.types';

interface TemplateModalsProps {
  importedTemplateIds: Set<string>;
  importingTemplateId: Id<'templates'> | null;
  onCloseCustomize: () => void;
  onDirectImport: (templateId: Id<'templates'>) => Promise<void>;
  onImport: (
    templateId: Id<'templates'>,
    customizations?: TemplateCustomizations
  ) => Promise<void>;
  previewTemplate: Doc<'templates'> | null;
  showCustomizeModal: boolean;
}

export function TemplateModals({
  importingTemplateId,
  onCloseCustomize,
  onImport,
  previewTemplate,
  showCustomizeModal,
}: TemplateModalsProps) {
  const handleImport = (
    templateId: Id<'templates'>,
    customizations?: TemplateCustomizations
  ) => {
    void onImport(templateId, customizations);
  };

  return (
    <TemplatePreviewModal
      importingTemplateId={importingTemplateId}
      template={previewTemplate}
      visible={showCustomizeModal}
      onClose={onCloseCustomize}
      onImport={handleImport}
    />
  );
}
