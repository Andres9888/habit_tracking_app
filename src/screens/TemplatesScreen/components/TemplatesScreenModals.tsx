/**
 * Composition wrapper for all Templates screen modals
 * Renders TemplateModals and PackConfirmSheet together
 */

import type { Doc, Id } from '../../../../convex/_generated/dataModel';
import { PackConfirmSheet } from '../../../components/PackConfirmSheet';
import type { PremiumPack } from '../data/premiumPacks';
import type { TemplateCustomizations } from '../TemplatesScreen.types';
import { TemplateModals } from './TemplateModals';

interface TemplatesScreenModalsProps {
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
  packConfirmPack: PremiumPack | null;
  packConfirmVisible: boolean;
  onPackCancel: () => void;
  onPackConfirm: () => void;
  previewTemplate: Doc<'templates'> | null;
  showCustomizeModal: boolean;
  showFullsizePreview: boolean;
}

export function TemplatesScreenModals(p: TemplatesScreenModalsProps) {
  return (
    <>
      <TemplateModals
        importedTemplateIds={p.importedTemplateIds}
        importingTemplateId={p.importingTemplateId}
        previewTemplate={p.previewTemplate}
        showCustomizeModal={p.showCustomizeModal}
        showFullsizePreview={p.showFullsizePreview}
        onCloseCustomize={p.onCloseCustomize}
        onCloseFullsize={p.onCloseFullsize}
        onCustomize={p.onCustomize}
        onDirectImport={p.onDirectImport}
        onImport={p.onImport}
      />
      <PackConfirmSheet
        pack={p.packConfirmPack}
        visible={p.packConfirmVisible}
        onCancel={p.onPackCancel}
        onConfirm={p.onPackConfirm}
      />
    </>
  );
}
