import { useMemo, type PropsWithChildren } from 'react';

import { PremiumContext } from './PremiumContext';
import type { SubscriptionStatus, UsePremiumReturn } from './types';
import { usePremiumActions } from './usePremiumActions';
import { usePremiumData } from './usePremiumData';

const PREMIUM_ENTITLEMENT_ID = 'premium';

interface PremiumProviderProps extends PropsWithChildren {
  enabled: boolean;
  identityKey: string | null;
}

// eslint-disable-next-line max-lines-per-function
export function PremiumProvider({
  children,
  enabled,
  identityKey,
}: PremiumProviderProps) {
  const data = usePremiumData({ enabled, identityKey });
  const { purchasePackage, refreshStatus, restorePurchases } =
    usePremiumActions({
      setCustomerInfo: data.setCustomerInfo,
      setError: data.setError,
    });
  const premiumEntitlement =
    data.customerInfo?.entitlements.active[PREMIUM_ENTITLEMENT_ID];
  const isPremium = premiumEntitlement !== undefined;
  const isTrialActive = premiumEntitlement?.periodType?.toString() === 'TRIAL';
  const isLoading = !enabled || data.isLoading;
  const status: SubscriptionStatus = isLoading
    ? 'loading'
    : data.error
      ? 'error'
      : isTrialActive
        ? 'trialing'
        : isPremium
          ? 'active'
          : 'free';

  const value = useMemo<UsePremiumReturn>(
    // eslint-disable-next-line complexity
    () => ({
      customerInfo: data.customerInfo,
      entitlementReady: enabled && !data.isLoading,
      error: data.error,
      expirationDate: premiumEntitlement?.expirationDate
        ? new Date(premiumEntitlement.expirationDate)
        : null,
      isLoading,
      isLoadingOfferings: !enabled || data.isLoadingOfferings,
      isPremium,
      isTrialActive,
      managementUrl: data.customerInfo?.managementURL ?? null,
      monthlyPackage:
        data.packages?.find(
          (pkg) => pkg.packageType?.toString() === 'MONTHLY'
        ) ?? null,
      packages: data.packages,
      priceString:
        data.packages?.find((pkg) => pkg.packageType?.toString() === 'MONTHLY')
          ?.product.priceString ?? null,
      purchasePackage,
      refreshStatus,
      restorePurchases,
      status,
    }),
    [
      data.customerInfo,
      data.error,
      data.isLoading,
      data.isLoadingOfferings,
      data.packages,
      enabled,
      isPremium,
      isTrialActive,
      isLoading,
      premiumEntitlement?.expirationDate,
      purchasePackage,
      refreshStatus,
      restorePurchases,
      status,
    ]
  );

  return (
    <PremiumContext.Provider value={value}>{children}</PremiumContext.Provider>
  );
}
