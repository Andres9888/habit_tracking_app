/* eslint-disable max-lines */
/**
 * usePremiumData Hook
 *
 * Owns the single customer-info listener and shared RevenueCat requests.
 * Entitlement and offerings loading are intentionally independent so pricing
 * cannot keep the app startup gate waiting.
 */

import { useEffect, useState } from 'react';
import { Purchases } from '../../lib/purchases';
import type {
  PurchasesPackage,
  CustomerInfo,
  CustomerInfoUpdateListener,
} from 'react-native-purchases';

interface PremiumData {
  customerInfo: CustomerInfo | null;
  packages: PurchasesPackage[] | null;
  isLoading: boolean;
  isLoadingOfferings: boolean;
  error: string | null;
  setCustomerInfo: (info: CustomerInfo) => void;
  setError: (error: string | null) => void;
}

interface PremiumDataOptions {
  enabled: boolean;
  identityKey: string | null;
}

// eslint-disable-next-line max-lines-per-function
export function usePremiumData({
  enabled,
  identityKey,
}: PremiumDataOptions): PremiumData {
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo | null>(null);
  const [packages, setPackages] = useState<PurchasesPackage[] | null>(null);
  const [entitlementResolvedFor, setEntitlementResolvedFor] = useState<
    string | null
  >(null);
  const [offeringsResolvedFor, setOfferingsResolvedFor] = useState<
    string | null
  >(null);
  const [error, setError] = useState<string | null>(null);
  const isLoading = enabled && entitlementResolvedFor !== identityKey;
  const isLoadingOfferings = enabled && offeringsResolvedFor !== identityKey;

  // eslint-disable-next-line max-lines-per-function
  useEffect(() => {
    if (!enabled) {
      setCustomerInfo(null);
      setPackages(null);
      setError(null);
      setEntitlementResolvedFor(null);
      setOfferingsResolvedFor(null);
      return;
    }

    let isMounted = true;
    let listener: CustomerInfoUpdateListener | null = null;
    setCustomerInfo(null);
    setPackages(null);
    setError(null);
    setEntitlementResolvedFor(null);
    setOfferingsResolvedFor(null);

    async function fetchEntitlement(): Promise<void> {
      try {
        const info = await Purchases.getCustomerInfo();
        if (isMounted) setCustomerInfo(info);
      } catch (error_) {
        if (__DEV__)
          console.error('[usePremium] Failed to load customer info:', error_);
        if (isMounted) setError('Failed to load subscription info');
      } finally {
        if (isMounted) setEntitlementResolvedFor(identityKey);
      }
    }

    async function fetchOfferings(): Promise<void> {
      try {
        const offerings = await Purchases.getOfferings();
        if (isMounted) {
          setPackages(offerings.current?.availablePackages ?? null);
        }
      } catch (error_) {
        if (__DEV__)
          console.error('[usePremium] Failed to load offerings:', error_);
      } finally {
        if (isMounted) setOfferingsResolvedFor(identityKey);
      }
    }

    try {
      listener = (info: CustomerInfo) => {
        if (isMounted) setCustomerInfo(info);
      };
      Purchases.addCustomerInfoUpdateListener(listener);
    } catch {
      listener = null;
    }

    void fetchEntitlement();
    void fetchOfferings();

    return () => {
      isMounted = false;
      if (listener) Purchases.removeCustomerInfoUpdateListener(listener);
    };
  }, [enabled, identityKey]);

  return {
    customerInfo,
    error,
    isLoading,
    isLoadingOfferings,
    packages,
    setCustomerInfo,
    setError,
  };
}
