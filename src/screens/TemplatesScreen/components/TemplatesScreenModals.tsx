/**
 * Composition wrapper for all Templates screen modals
 */

import type { Doc, Id } from '../../../../convex/_generated/dataModel';
import { PackConfirmSheet } from '../../../components/PackConfirmSheet';
import { PaywallSheet } from '../../../components/PaywallSheet';
import type { PremiumPack } from '../data/premiumPacks';
import type {
  TemplateCustomizations,
  TemplatePreviewAnchor,
} from '../TemplatesScreen.types';
import { TemplateModals } from './TemplateModals';

interface TemplatesScreenModalsProps {
  importedTemplateIds: Set<string>;
  importingTemplateIds: Set<string>;
  previewInitialAnchor: TemplatePreviewAnchor;
  previewTemplate: Doc<'templates'> | null;
  showCustomizeModal: boolean;
  showFullsizePreview: boolean;
  showPaywall: boolean;
  onCloseCustomize: () => void;
  onCloseFullsize: () => void;
  onClosePaywall: () => void;
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
}

export function TemplatesScreenModals(p: TemplatesScreenModalsProps) {
  return (
    <>
      <TemplateModals
        importedTemplateIds={p.importedTemplateIds}
        importingTemplateIds={p.importingTemplateIds}
        previewInitialAnchor={p.previewInitialAnchor}
        previewTemplate={p.previewTemplate}
        showCustomizeModal={p.showCustomizeModal}
        showFullsizePreview={p.showFullsizePreview}
        onCloseCustomize={p.onCloseCustomize}
        onCloseFullsize={p.onCloseFullsize}
        onCustomize={p.onCustomize}
        onDirectImport={p.onDirectImport}
        onImport={p.onImport}
      />
      <PaywallSheet visible={p.showPaywall} onClose={p.onClosePaywall} />
      <PackConfirmSheet
        pack={p.packConfirmPack}
        visible={p.packConfirmVisible}
        onCancel={p.onPackCancel}
        onConfirm={p.onPackConfirm}
      />
    </>
  );
}
