/**
 * Template preview and customize modals wrapper
 */

import type { Doc, Id } from '../../../../convex/_generated/dataModel';
import FullsizeTemplatePreview from '../../../components/FullsizeTemplatePreview';
import TemplatePreviewModal from '../../templates/TemplatePreviewModal';
import type { TemplateCustomizations } from '../TemplatesScreen.types';

interface TemplateModalsProps {
  importedTemplateIds: Set<string>;
  importingTemplateId: Id<'templates'> | null;
  onCloseCustomize: () => void;
  onCloseFullsize: () => void;
  onCloseLibrary?: () => void;
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
  onCloseLibrary,
  onCustomize,
  onDirectImport,
  onImport,
  previewTemplate,
  showCustomizeModal,
  showFullsizePreview,
}: TemplateModalsProps) {
  const handleDirectImport = (templateId: Id<'templates'>) => {
    void onDirectImport(templateId);
  };
  const handleImport = (
    templateId: Id<'templates'>,
    customizations?: TemplateCustomizations
  ) => {
    void onImport(templateId, customizations);
  };

  const handleCloseAll = onCloseLibrary
    ? () => {
        onCloseFullsize();
        onCloseLibrary();
      }
    : onCloseFullsize;

  return (
    <>
      <FullsizeTemplatePreview
        isImported={
          previewTemplate ? importedTemplateIds.has(previewTemplate._id) : false
        }
        isImporting={importingTemplateId === previewTemplate?._id}
        template={previewTemplate}
        visible={showFullsizePreview}
        onBack={onCloseLibrary ? onCloseFullsize : undefined}
        onClose={handleCloseAll}
        onCustomize={onCustomize}
        onImport={handleDirectImport}
      />

      <TemplatePreviewModal
        importingTemplateId={importingTemplateId}
        template={previewTemplate}
        visible={showCustomizeModal}
        onClose={onCloseCustomize}
        onImport={handleImport}
      />
    </>
  );
}
