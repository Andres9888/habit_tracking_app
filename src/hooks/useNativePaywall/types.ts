export interface PresentPaywallOptions {
  /** Analytics source identifier, e.g. 'habit_limit', 'templates_import' */
  source: string;
  /** Called after a successful purchase or restore */
  onSuccess?: () => void;
}

export type PaywallOutcome = 'purchased' | 'restored' | 'cancelled' | 'error';

export interface UseNativePaywallReturn {
  /** Present the RevenueCat native paywall (web shows fallback modal) */
  presentPaywall: (options: PresentPaywallOptions) => Promise<PaywallOutcome>;
  /** Whether the web fallback modal is visible */
  webFallbackVisible: boolean;
  /** Dismiss the web fallback modal */
  dismissWebFallback: () => void;
}
