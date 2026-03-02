/**
 * Types for PaywallSheet
 */

export interface PaywallSheetProps {
  onClose: () => void;
  onPurchaseSuccess?: () => void;
  visible: boolean;
}
