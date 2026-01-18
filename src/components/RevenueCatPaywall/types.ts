/**
 * RevenueCatPaywall Types
 */

export interface RevenueCatPaywallProps {
  /** Whether the paywall should be visible */
  visible: boolean;
  /** Called when paywall is dismissed (cancelled, error, or after purchase) */
  onClose: () => void;
  /** Called when a purchase is successful */
  onPurchaseSuccess?: () => void;
  /** Called when a restore is successful */
  onRestoreSuccess?: () => void;
}
