/**
 * usePremium Hook
 *
 * Core hook for managing premium subscriptions via RevenueCat.
 * Orchestrates data fetching and purchase actions via sub-hooks.
 *
 * @example
 * const { isPremium, monthlyPackage, purchasePackage, priceString } = usePremium();
 *
 * if (!isPremium && monthlyPackage) {
 *   await purchasePackage(monthlyPackage);
 * }
 */

import type { UsePremiumReturn, SubscriptionStatus } from './types';
import { usePremiumData } from './usePremiumData';
import { usePremiumActions } from './usePremiumActions';

const PREMIUM_ENTITLEMENT_ID = 'premium';

export function usePremium(): UsePremiumReturn {
  const {
    customerInfo,
    error,
    isLoading,
    isLoadingOfferings,
    packages,
    setCustomerInfo,
    setError,
  } = usePremiumData();

  const { purchasePackage, refreshStatus, restorePurchases } =
    usePremiumActions({ setCustomerInfo, setError });

  // Derive premium status from RevenueCat entitlements
  const premiumEntitlement =
    customerInfo?.entitlements.active[PREMIUM_ENTITLEMENT_ID];
  const isPremium = premiumEntitlement !== undefined;

  const isTrialPeriod = premiumEntitlement?.periodType?.toString() === 'TRIAL';

  // Derive subscription status
  const status: SubscriptionStatus = (() => {
    if (isLoading) return 'loading';
    if (error) return 'error';
    if (!customerInfo) return 'free';
    if (isTrialPeriod) return 'trialing';
    if (isPremium) return 'active';
    return 'free';
  })();

  // Find monthly package and price
  const monthlyPackage =
    packages?.find((p) => p.packageType?.toString() === 'MONTHLY') ?? null;
  const priceString = monthlyPackage?.product.priceString ?? null;

  // Subscription info
  const expirationDate = premiumEntitlement?.expirationDate
    ? new Date(premiumEntitlement.expirationDate)
    : null;

  return {
    customerInfo,
    error,
    expirationDate,
    isLoading,
    isLoadingOfferings,
    isPremium,
    isTrialActive: isTrialPeriod,
    managementUrl: customerInfo?.managementURL ?? null,
    monthlyPackage,
    packages,
    priceString,
    purchasePackage,
    refreshStatus,
    restorePurchases,
    status,
  };
}
