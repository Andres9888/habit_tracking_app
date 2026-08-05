/* eslint-disable @typescript-eslint/no-redundant-type-constituents -- RevenueCat types resolve to any at build time */
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
  /** Annual subscription package, when the offering includes one */
  annualPackage: PurchasesPackage | null;
  /** Formatted annual price string (e.g., "$39.99") */
  annualPriceString: string | null;
  /** Percent saved paying yearly vs 12x monthly; null when not computable */
  annualSavingsPercent: number | null;
  /** Length of the free intro offer in days; null when there isn't one */
  trialDays: number | null;
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
  /** Product identifier backing the active entitlement */
  activeProductId: string | null;
  /** Whether the active plan is the annual one */
  isAnnualPlan: boolean;
  /** Raw customer info from RevenueCat */
  customerInfo: CustomerInfo | null;
}

export interface UsePremiumReturn
  extends PremiumState,
    PremiumOfferings,
    PremiumActions,
    PremiumSubscriptionInfo {}
