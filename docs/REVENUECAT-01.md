# RevenueCat Integration - Phase 1: SDK Setup & Core Hook

## Overview
Install RevenueCat SDK and create the core `usePremium` hook that encapsulates all subscription logic.

## Prerequisites
- RevenueCat account created at https://app.revenuecat.com
- iOS app configured in App Store Connect with bundle ID: `com.andres9888.daily-habits`
- RevenueCat project created with API keys ready

---

## Tasks

### 1. Install Dependencies

- [ ] Install react-native-purchases SDK
```bash
npx expo install react-native-purchases
```

- [ ] Verify installation in package.json - should see `react-native-purchases` in dependencies

---

### 2. Create Environment Variables

- [ ] Add RevenueCat API keys to `.env.local` (create if doesn't exist)
```bash
# RevenueCat API Keys
# Get these from RevenueCat Dashboard > Project Settings > API Keys
EXPO_PUBLIC_REVENUECAT_IOS_KEY=appl_PLACEHOLDER_REPLACE_ME
EXPO_PUBLIC_REVENUECAT_ANDROID_KEY=goog_PLACEHOLDER_REPLACE_ME
```

- [ ] Add to `.env.example` for documentation
```bash
# RevenueCat (In-App Purchases)
EXPO_PUBLIC_REVENUECAT_IOS_KEY=your_ios_api_key
EXPO_PUBLIC_REVENUECAT_ANDROID_KEY=your_android_api_key
```

---

### 3. Create Purchases Service

- [ ] Create `src/lib/purchases.ts` - SDK initialization wrapper
```typescript
/**
 * RevenueCat SDK initialization and configuration
 *
 * This module handles:
 * - SDK initialization with platform-specific API keys
 * - User identification for cross-device sync
 * - Debug logging in development
 *
 * @see https://docs.revenuecat.com/docs/reactnative
 */

import { Platform } from 'react-native';
import Purchases, { LOG_LEVEL } from 'react-native-purchases';

const API_KEYS = {
  ios: process.env.EXPO_PUBLIC_REVENUECAT_IOS_KEY || '',
  android: process.env.EXPO_PUBLIC_REVENUECAT_ANDROID_KEY || '',
};

let isInitialized = false;

/**
 * Initialize RevenueCat SDK
 * Should be called once on app startup, after auth is ready
 *
 * @param userId - Clerk user ID for cross-device subscription sync
 */
export async function initializePurchases(userId?: string): Promise<void> {
  if (isInitialized) {
    console.log('[Purchases] Already initialized, skipping');
    return;
  }

  // Skip on web - RevenueCat doesn't support web
  if (Platform.OS === 'web') {
    console.log('[Purchases] Web platform not supported, skipping initialization');
    return;
  }

  const apiKey = Platform.OS === 'ios' ? API_KEYS.ios : API_KEYS.android;

  if (!apiKey) {
    console.warn('[Purchases] No API key configured for platform:', Platform.OS);
    return;
  }

  // Enable verbose logging in development
  if (__DEV__) {
    Purchases.setLogLevel(LOG_LEVEL.VERBOSE);
  }

  try {
    await Purchases.configure({
      apiKey,
      appUserID: userId, // Links to Clerk user for cross-device sync
    });

    isInitialized = true;
    console.log('[Purchases] SDK initialized successfully');

    if (userId) {
      console.log('[Purchases] User identified:', userId);
    }
  } catch (error) {
    console.error('[Purchases] Failed to initialize:', error);
    throw error;
  }
}

/**
 * Update the user ID after authentication
 * Call this when user signs in/out
 */
export async function identifyUser(userId: string): Promise<void> {
  if (Platform.OS === 'web') return;

  try {
    await Purchases.logIn(userId);
    console.log('[Purchases] User logged in:', userId);
  } catch (error) {
    console.error('[Purchases] Failed to identify user:', error);
  }
}

/**
 * Clear user identification on logout
 */
export async function logoutPurchases(): Promise<void> {
  if (Platform.OS === 'web') return;

  try {
    await Purchases.logOut();
    console.log('[Purchases] User logged out');
  } catch (error) {
    console.error('[Purchases] Failed to logout:', error);
  }
}

/**
 * Check if SDK is ready for purchases
 */
export function isPurchasesAvailable(): boolean {
  return isInitialized && Platform.OS !== 'web';
}

export { Purchases };
```

---

### 4. Create Premium Types

- [ ] Create `src/hooks/usePremium/types.ts`
```typescript
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
  extends PremiumState,
    PremiumOfferings,
    PremiumActions,
    PremiumSubscriptionInfo {}
```

---

### 5. Create usePremium Hook

- [ ] Create `src/hooks/usePremium/usePremium.ts`
```typescript
/**
 * usePremium Hook
 *
 * Core hook for managing premium subscriptions via RevenueCat.
 * Handles:
 * - Fetching subscription status
 * - Loading available offerings/packages
 * - Processing purchases
 * - Restoring purchases
 * - Syncing premium status to Convex
 *
 * @example
 * const { isPremium, monthlyPackage, purchasePackage, priceString } = usePremium();
 *
 * if (!isPremium && monthlyPackage) {
 *   await purchasePackage(monthlyPackage);
 * }
 */

import { useEffect, useState, useCallback, useRef } from 'react';
import { Platform } from 'react-native';
import Purchases, {
  PurchasesPackage,
  CustomerInfo,
  PurchasesError,
  PACKAGE_TYPE,
} from 'react-native-purchases';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { isPurchasesAvailable } from '../../lib/purchases';
import type { UsePremiumReturn, SubscriptionStatus } from './types';

const PREMIUM_ENTITLEMENT_ID = 'premium';

export function usePremium(): UsePremiumReturn {
  // State
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo | null>(null);
  const [packages, setPackages] = useState<PurchasesPackage[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingOfferings, setIsLoadingOfferings] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const listenerRef = useRef<{ remove: () => void } | null>(null);

  // Convex queries and mutations
  const settings = useQuery(api.settings.get);
  const updateSettings = useMutation(api.settings.update);

  // Derive premium status from RevenueCat entitlements
  const premiumEntitlement = customerInfo?.entitlements.active[PREMIUM_ENTITLEMENT_ID];
  const isPremium = premiumEntitlement !== undefined;

  // Derive subscription status
  const status: SubscriptionStatus = (() => {
    if (isLoading) return 'loading';
    if (error) return 'error';
    if (!customerInfo) return 'free';
    if (premiumEntitlement?.periodType === 'TRIAL') return 'trialing';
    if (isPremium) return 'active';
    return 'free';
  })();

  // Sync premium status to Convex when it changes
  useEffect(() => {
    if (settings && settings.hasPremium !== isPremium && !isLoading) {
      updateSettings({ ...settings, hasPremium: isPremium });
    }
  }, [isPremium, settings, updateSettings, isLoading]);

  // Fetch customer info and offerings on mount
  useEffect(() => {
    if (!isPurchasesAvailable()) {
      setIsLoading(false);
      setIsLoadingOfferings(false);
      return;
    }

    async function fetchData() {
      try {
        // Fetch customer info and offerings in parallel
        const [info, offeringsResult] = await Promise.all([
          Purchases.getCustomerInfo(),
          Purchases.getOfferings(),
        ]);

        setCustomerInfo(info);
        setPackages(offeringsResult.current?.availablePackages ?? null);
      } catch (e) {
        console.error('[usePremium] Failed to fetch data:', e);
        setError('Failed to load subscription info');
      } finally {
        setIsLoading(false);
        setIsLoadingOfferings(false);
      }
    }

    fetchData();

    // Listen for customer info updates (purchases, restores, subscription changes)
    listenerRef.current = Purchases.addCustomerInfoUpdateListener((info) => {
      console.log('[usePremium] Customer info updated');
      setCustomerInfo(info);
    });

    return () => {
      listenerRef.current?.remove();
    };
  }, []);

  // Purchase a package
  const purchasePackage = useCallback(
    async (pkg: PurchasesPackage): Promise<boolean> => {
      if (!isPurchasesAvailable()) {
        setError('Purchases not available on this platform');
        return false;
      }

      try {
        setError(null);
        const { customerInfo: newInfo } = await Purchases.purchasePackage(pkg);
        setCustomerInfo(newInfo);

        const success = newInfo.entitlements.active[PREMIUM_ENTITLEMENT_ID] !== undefined;
        console.log('[usePremium] Purchase result:', success ? 'SUCCESS' : 'NO ENTITLEMENT');
        return success;
      } catch (e) {
        const purchaseError = e as PurchasesError;

        // Don't show error if user cancelled
        if (purchaseError.userCancelled) {
          console.log('[usePremium] Purchase cancelled by user');
          return false;
        }

        console.error('[usePremium] Purchase failed:', purchaseError);
        setError(purchaseError.message || 'Purchase failed');
        return false;
      }
    },
    []
  );

  // Restore purchases
  const restorePurchases = useCallback(async (): Promise<boolean> => {
    if (!isPurchasesAvailable()) {
      setError('Purchases not available on this platform');
      return false;
    }

    try {
      setError(null);
      const info = await Purchases.restorePurchases();
      setCustomerInfo(info);

      const success = info.entitlements.active[PREMIUM_ENTITLEMENT_ID] !== undefined;
      console.log('[usePremium] Restore result:', success ? 'FOUND' : 'NONE');
      return success;
    } catch (e) {
      console.error('[usePremium] Restore failed:', e);
      setError('Failed to restore purchases');
      return false;
    }
  }, []);

  // Refresh subscription status
  const refreshStatus = useCallback(async (): Promise<void> => {
    if (!isPurchasesAvailable()) return;

    try {
      const info = await Purchases.getCustomerInfo();
      setCustomerInfo(info);
    } catch (e) {
      console.error('[usePremium] Refresh failed:', e);
    }
  }, []);

  // Find monthly package
  const monthlyPackage =
    packages?.find((p) => p.packageType === PACKAGE_TYPE.MONTHLY) ?? null;

  // Get formatted price string
  const priceString = monthlyPackage?.product.priceString ?? null;

  // Subscription info
  const expirationDate = premiumEntitlement?.expirationDate
    ? new Date(premiumEntitlement.expirationDate)
    : null;
  const isTrialActive = premiumEntitlement?.periodType === 'TRIAL';
  const managementUrl = customerInfo?.managementURL ?? null;

  return {
    // State
    isPremium,
    status,
    isLoading,
    error,

    // Offerings
    packages,
    monthlyPackage,
    priceString,
    isLoadingOfferings,

    // Actions
    purchasePackage,
    restorePurchases,
    refreshStatus,

    // Subscription info
    expirationDate,
    isTrialActive,
    managementUrl,
    customerInfo,
  };
}
```

---

### 6. Create Hook Index

- [ ] Create `src/hooks/usePremium/index.ts`
```typescript
export { usePremium } from './usePremium';
export type {
  UsePremiumReturn,
  PremiumState,
  PremiumOfferings,
  PremiumActions,
  PremiumSubscriptionInfo,
  SubscriptionStatus,
} from './types';
```

---

### 7. Initialize SDK in App

- [ ] Update `src/App.tsx` to initialize RevenueCat after auth is ready
```typescript
// Add import at top
import { initializePurchases, identifyUser } from './lib/purchases';

// Inside ConvexClerkProvider, add initialization effect:
// After the existing useEffect for setAuth, add:

useEffect(() => {
  // Initialize RevenueCat when user signs in
  if (isSignedIn) {
    // Get Clerk user ID for RevenueCat user identification
    getToken({ template: 'convex' }).then(() => {
      // We'll use Clerk's user ID from the auth context
      // This requires adding userId to the hook
    });
  }
}, [isSignedIn]);
```

- [ ] Create a new `PurchasesProvider` component in `src/components/providers/PurchasesProvider.tsx`:
```typescript
/**
 * PurchasesProvider
 *
 * Initializes RevenueCat SDK when user is authenticated.
 * Must be placed inside ClerkProvider and ConvexClerkProvider.
 */

import { useEffect } from 'react';
import { useUser } from '@clerk/clerk-expo';
import { initializePurchases, identifyUser, logoutPurchases } from '../../lib/purchases';

interface PurchasesProviderProps {
  children: React.ReactNode;
}

export function PurchasesProvider({ children }: PurchasesProviderProps) {
  const { isSignedIn, user } = useUser();

  useEffect(() => {
    if (isSignedIn && user?.id) {
      // Initialize with Clerk user ID for cross-device sync
      initializePurchases(user.id).then(() => {
        identifyUser(user.id);
      });
    } else if (!isSignedIn) {
      // Clear user on logout
      logoutPurchases();
    }
  }, [isSignedIn, user?.id]);

  return <>{children}</>;
}
```

- [ ] Wrap the app with PurchasesProvider in `src/App.tsx`:
```typescript
// Update Providers function to include PurchasesProvider:
function Providers({ children }: PropsWithChildren) {
  return (
    <SafeAreaProvider>
      <PaperProvider theme={theme}>
        <ClerkProvider publishableKey={CLERK_PUBLISHABLE_KEY}>
          <ConvexClerkProvider>
            <PurchasesProvider>
              {children}
            </PurchasesProvider>
          </ConvexClerkProvider>
        </ClerkProvider>
      </PaperProvider>
    </SafeAreaProvider>
  );
}
```

---

### 8. Create Basic Test

- [ ] Create `src/hooks/usePremium/__tests__/usePremium.test.ts`
```typescript
/**
 * Tests for usePremium hook
 *
 * Note: Full integration tests require a development build.
 * These tests verify the hook's interface and mock behavior.
 */

import { renderHook } from '@testing-library/react-native';

// Mock react-native-purchases
jest.mock('react-native-purchases', () => ({
  configure: jest.fn(),
  getCustomerInfo: jest.fn().mockResolvedValue({
    entitlements: { active: {} },
    managementURL: null,
  }),
  getOfferings: jest.fn().mockResolvedValue({
    current: { availablePackages: [] },
  }),
  purchasePackage: jest.fn(),
  restorePurchases: jest.fn(),
  addCustomerInfoUpdateListener: jest.fn(() => ({ remove: jest.fn() })),
  setLogLevel: jest.fn(),
  LOG_LEVEL: { VERBOSE: 'VERBOSE' },
  PACKAGE_TYPE: { MONTHLY: 'MONTHLY' },
}));

// Mock Convex
jest.mock('convex/react', () => ({
  useQuery: jest.fn(() => ({ hasPremium: false })),
  useMutation: jest.fn(() => jest.fn()),
}));

// Mock purchases lib
jest.mock('../../../lib/purchases', () => ({
  isPurchasesAvailable: jest.fn(() => true),
}));

describe('usePremium', () => {
  it('should export the hook', async () => {
    const { usePremium } = await import('../usePremium');
    expect(usePremium).toBeDefined();
  });

  // Add more tests as needed
});
```

---

## Verification

After completing all tasks:

1. **Build check**: Run `npm run lint` to ensure no TypeScript errors
2. **SDK verification**: The app should log `[Purchases] SDK initialized successfully` on startup
3. **Hook test**: Import `usePremium` in a component and verify it returns expected shape

---

## Next Steps

Once Phase 1 is complete, proceed to:
- **REVENUECAT-02.md**: Convex backend integration (subscriptions table, webhook handler)
