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
  /**
   * Whether the user can dismiss the paywall without subscribing.
   * Defaults to true. When false, the close button is hidden, the modal
   * uses fullScreen presentation, and Android back/iOS swipe-down are
   * suppressed — used for hard-gate placement (e.g. AuthGate).
   */
  dismissible?: boolean;
}
