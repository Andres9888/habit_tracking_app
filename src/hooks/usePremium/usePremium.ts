/**
 * Temporary premium bypass while the paywall is removed.
 *
 * Restore the RevenueCat-backed hook when monetization is re-enabled.
 */

import type { UsePremiumReturn, SubscriptionStatus } from './types';

const TEMPORARY_PREMIUM_BYPASS_STATUS: SubscriptionStatus = 'active';

export function usePremium(): UsePremiumReturn {
  return {
    customerInfo: null,
    error: null,
    expirationDate: null,
    isLoading: false,
    isLoadingOfferings: false,
    isPremium: true,
    isTrialActive: false,
    managementUrl: null,
    monthlyPackage: null,
    packages: null,
    priceString: null,
    purchasePackage: async () => true,
    refreshStatus: async () => {},
    restorePurchases: async () => true,
    status: TEMPORARY_PREMIUM_BYPASS_STATUS,
  };
}
