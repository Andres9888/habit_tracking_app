/**
 * Types for PackConfirmSheet
 */

import type { PremiumPack } from '../../screens/TemplatesScreen/data/premiumPacks';

export interface PackConfirmSheetProps {
  onCancel: () => void;
  onConfirm: () => void;
  pack: PremiumPack | null;
  visible: boolean;
}
