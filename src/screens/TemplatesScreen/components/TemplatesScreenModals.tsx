/**
 * Composition wrapper for all Templates screen modals
 */

import type { Doc, Id } from '../../../../convex/_generated/dataModel';
import { PackConfirmSheet } from '../../../components/PackConfirmSheet';
import { PaywallSheet } from '../../../components/PaywallSheet';
import type { PremiumPack } from '../data/premiumPacks';
import type { TemplateCustomizations } from '../TemplatesScreen.types';
import { TemplateModals } from './TemplateModals';

interface TemplatesScreenModalsProps {
  importingTemplateId: Id<'templates'> | null;
  onCloseCustomize: () => void;
  onClosePaywall: () => void;
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
  showPaywall: boolean;
}

export function TemplatesScreenModals(p: TemplatesScreenModalsProps) {
  return (
    <>
      <TemplateModals
        importingTemplateId={p.importingTemplateId}
        previewTemplate={p.previewTemplate}
        showCustomizeModal={p.showCustomizeModal}
        onCloseCustomize={p.onCloseCustomize}
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
