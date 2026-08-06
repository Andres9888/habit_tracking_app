/* eslint-disable max-lines */
/* eslint-disable @typescript-eslint/no-redundant-type-constituents -- RevenueCat types resolve to any at build time */
/**
 * usePremiumData Hook
 *
 * Handles SDK initialization, data fetching, and customer info listener.
 * Polls for SDK availability (handles race condition with PurchasesProvider),
 * then fetches customer info + offerings in parallel.
 */

import { useEffect, useState, useRef } from 'react';
import { isPurchasesAvailable, Purchases } from '../../lib/purchases';
import type {
  PurchasesPackage,
  CustomerInfo,
  CustomerInfoUpdateListener,
} from 'react-native-purchases';

const MAX_RETRIES = 10;
const RETRY_DELAY_MS = 500;

interface PremiumData {
  customerInfo: CustomerInfo | null;
  packages: PurchasesPackage[] | null;
  isLoading: boolean;
  isLoadingOfferings: boolean;
  error: string | null;
  setCustomerInfo: (info: CustomerInfo) => void;
  setError: (error: string | null) => void;
}

export function usePremiumData(): PremiumData {
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo | null>(null);
  const [packages, setPackages] = useState<PurchasesPackage[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingOfferings, setIsLoadingOfferings] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const listenerRef = useRef<CustomerInfoUpdateListener | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function waitForSdk(): Promise<boolean> {
      let retryCount = 0;
      while (!isPurchasesAvailable() && retryCount < MAX_RETRIES) {
        await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY_MS));
        retryCount++;
      }
      return isPurchasesAvailable();
    }

    async function fetchData() {
      const sdkAvailable = await waitForSdk();
      if (!sdkAvailable) {
        if (isMounted) {
          setIsLoading(false);
          setIsLoadingOfferings(false);
        }
        return;
      }

      try {
        const [info, offeringsResult] = await Promise.all([
          Purchases.getCustomerInfo(),
          Purchases.getOfferings(),
        ]);

        if (isMounted) {
          setCustomerInfo(info);
          setPackages(offeringsResult.current?.availablePackages ?? null);
        }
      } catch (error_) {
        if (__DEV__)
          console.error('[usePremium] Failed to fetch data:', error_);
        if (isMounted) {
          setError('Failed to load subscription info');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
          setIsLoadingOfferings(false);
        }
      }
    }

    function setupListener() {
      if (isPurchasesAvailable() && !listenerRef.current) {
        try {
          const listener: CustomerInfoUpdateListener = (info: CustomerInfo) => {
            if (isMounted) setCustomerInfo(info);
          };
          Purchases.addCustomerInfoUpdateListener(listener);
          listenerRef.current = listener;
        } catch {
          // Listener setup is best-effort
        }
      }
    }

    void fetchData()
      .then(() => {
        if (isMounted) setupListener();
      })
      .catch((error) => {
        if (__DEV__) console.warn('[usePremium] Unexpected error during setup:', error);
      });

    return () => {
      isMounted = false;
      if (listenerRef.current) {
        Purchases.removeCustomerInfoUpdateListener(listenerRef.current);
        listenerRef.current = null;
      }
    };
  }, []);

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
