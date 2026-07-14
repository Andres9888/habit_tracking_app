/**
 * Types for premium subscription management
 */

import type { PurchasesPackage, CustomerInfo } from 'react-native-purchases';

export type SubscriptionStatus =
  | 'loading'
  | 'free'
  | 'trialing'
  | 'active'
  | 'expired'
  | 'error';

export interface PremiumState {
  /** Whether user has active premium access */
  isPremium: boolean;
  /** Whether RevenueCat has resolved the current customer's entitlement */
  entitlementReady: boolean;
  /** Current subscription status */
  status: SubscriptionStatus;
  /** Loading state for SDK operations */
  isLoading: boolean;
  /** Error message if any */
  error: string | null;
}

export interface PremiumOfferings {
  /** All available packages */
  packages: PurchasesPackage[] | null;
  /** Monthly subscription package */
  monthlyPackage: PurchasesPackage | null;
  /** Formatted price string (e.g., "$6.99") */
  priceString: string | null;
  /** Whether offerings are still loading */
  isLoadingOfferings: boolean;
}

export interface PremiumActions {
  /** Purchase a subscription package */
  purchasePackage: (pkg: PurchasesPackage) => Promise<boolean>;
  /** Restore previous purchases */
  restorePurchases: () => Promise<boolean>;
  /** Refresh subscription status */
  refreshStatus: () => Promise<void>;
}

export interface PremiumSubscriptionInfo {
  /** When subscription expires/renews */
  expirationDate: Date | null;
  /** Whether currently in trial period */
  isTrialActive: boolean;
  /** URL to manage subscription in App Store/Play Store */
  managementUrl: string | null;
  /** Raw customer info from RevenueCat */
  customerInfo: CustomerInfo | null;
}

export interface UsePremiumReturn
  extends
    PremiumState,
    PremiumOfferings,
    PremiumActions,
    PremiumSubscriptionInfo {}
