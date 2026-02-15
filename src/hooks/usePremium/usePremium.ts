/**
 * usePremium Hook
 *
 * Core hook for managing premium subscriptions via RevenueCat.
 * Orchestrates data fetching and purchase actions via sub-hooks.
 *
 * Uses RevenueCat SDK as the primary source of truth, with a server-side
 * fallback from Convex `subscriptions` table when the SDK is unavailable.
 * Also exposes billing issue status from the server for UI warnings.
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

/** Server statuses that mean the user has active premium access */
const SERVER_ACTIVE_STATUSES = new Set(['active', 'trialing', 'past_due']);

export function usePremium(): UsePremiumReturn {
  const {
    customerInfo,
    error,
    isLoading,
    isLoadingOfferings,
    packages,
    serverSubscription,
    setCustomerInfo,
    setError,
  } = usePremiumData();

  const { purchasePackage, refreshStatus, restorePurchases } =
    usePremiumActions({ setCustomerInfo, setError });

  // Derive premium status from RevenueCat entitlements
  const premiumEntitlement =
    customerInfo?.entitlements.active[PREMIUM_ENTITLEMENT_ID];
  const sdkIsPremium = premiumEntitlement !== undefined;

  // Server-side fallback: if SDK didn't load but server says premium, trust server
  const serverIsPremium =
    serverSubscription != null &&
    SERVER_ACTIVE_STATUSES.has(serverSubscription.status);

  const isPremium = sdkIsPremium || serverIsPremium;

  const isTrialPeriod =
    premiumEntitlement?.periodType?.toString() === 'TRIAL' ||
    serverSubscription?.status === 'trialing';

  // Billing issue detection from server (RevenueCat SDK doesn't expose this clearly)
  const hasBillingIssue = serverSubscription?.hasBillingIssue === true;

  // Derive subscription status — now includes expired and past_due
  const status: SubscriptionStatus = (() => {
    if (isLoading && serverSubscription === undefined) return 'loading';
    if (error && !isPremium) return 'error';
    if (hasBillingIssue && isPremium) return 'past_due';
    if (isTrialPeriod) return 'trialing';
    if (isPremium) return 'active';
    // Check if subscription exists but expired
    if (serverSubscription?.status === 'expired') return 'expired';
    return 'free';
  })();

  // Find monthly package and price
  const monthlyPackage =
    packages?.find((p) => p.packageType?.toString() === 'MONTHLY') ?? null;
  const priceString = monthlyPackage?.product.priceString ?? null;

  // Subscription info — merge SDK and server data
  const expirationDate = premiumEntitlement?.expirationDate
    ? new Date(premiumEntitlement.expirationDate)
    : serverSubscription?.expiresAt
      ? new Date(serverSubscription.expiresAt)
      : null;

  return {
    customerInfo,
    error,
    expirationDate,
    hasBillingIssue,
    isLoading: isLoading && serverSubscription === undefined,
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
