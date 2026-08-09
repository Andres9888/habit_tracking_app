/**
 * Composition wrapper for all Templates screen modals
 */

import type { ImportOutcome } from '../hooks/useImportResultHandler';
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
  importingTemplateId: Id<'templates'> | null;
  previewInitialAnchor: TemplatePreviewAnchor;
  previewTemplate: Doc<'templates'> | null;
  showCustomizeModal: boolean;
  showFullsizePreview: boolean;
  showPaywall: boolean;
  /** Detail modal back — returns to the catalog with its state intact. */
  onBackToLibrary: () => void;
  onCloseCustomize: () => void;
  onClosePaywall: () => void;
  /** Detail modal X — dismisses the whole flow onto the home screen. */
  onExitToHome: () => void;
  onCustomize: (template: Doc<'templates'>) => void;
  onDirectImport: (
    templateId: Id<'templates'>
  ) => Promise<ImportOutcome | undefined>;
  onImport: (
    templateId: Id<'templates'>,
    customizations?: TemplateCustomizations
  ) => Promise<ImportOutcome | undefined>;
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
        importingTemplateId={p.importingTemplateId}
        previewInitialAnchor={p.previewInitialAnchor}
        previewTemplate={p.previewTemplate}
        showCustomizeModal={p.showCustomizeModal}
        showFullsizePreview={p.showFullsizePreview}
        onBackToLibrary={p.onBackToLibrary}
        onCloseCustomize={p.onCloseCustomize}
        onCustomize={p.onCustomize}
        onExitToHome={p.onExitToHome}
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
