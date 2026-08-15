# RevenueCat Integration Specification

## Overview

This specification defines the integration of RevenueCat for in-app subscription management in the Daily Habits app. RevenueCat will handle purchase processing, receipt validation, and subscription state management across iOS and Android.

**Current State:** Premium UI exists, `hasPremium` flag in Convex is manually set
**Target State:** Full subscription lifecycle managed by RevenueCat with real-time sync to Convex
**Pricing:** $6.99/month with 7-day free trial

---

## Architecture Decision

### Why RevenueCat (Not Direct StoreKit/Play Billing)

| Approach            | Pros                                                    | Cons                  | Our Choice |
| ------------------- | ------------------------------------------------------- | --------------------- | ---------- |
| **RevenueCat**      | Cross-platform, webhooks, analytics, receipt validation | Monthly fee at scale  | **Yes**    |
| Direct StoreKit 2   | No fees, Apple-native                                   | iOS only, complex     | No         |
| Direct Play Billing | No fees, Google-native                                  | Android only, complex | No         |
| Stripe              | Web-native, familiar                                    | Not for mobile IAP    | No         |

`★ Insight ─────────────────────────────────────`
**Why RevenueCat wins for mobile apps:**

1. **Single SDK** - One codebase handles both App Store and Play Store
2. **Server-side receipt validation** - Critical for security; client-side validation is easily bypassed
3. **Webhook events** - Sync subscription state to your backend (Convex) in real-time
4. **Analytics dashboard** - MRR, churn, trial conversion out of the box
   `─────────────────────────────────────────────────`

---

## Current State Analysis

### Existing Premium UI Components

| Component              | Location                                                           | Status                                     |
| ---------------------- | ------------------------------------------------------------------ | ------------------------------------------ |
| `MotivationPaywall`    | `src/components/MotivationSystem/Premium/MotivationPaywall.tsx`    | ✅ UI complete, purchase logic placeholder |
| `PremiumFeatureLock`   | `src/components/MotivationSystem/Premium/PremiumFeatureLock.tsx`   | ✅ UI complete                             |
| `PremiumBenefitsModal` | `src/components/MotivationSystem/Premium/PremiumBenefitsModal.tsx` | ✅ UI complete                             |

### Existing Backend Support

| Item                | Location                 | Status                    |
| ------------------- | ------------------------ | ------------------------- |
| `hasPremium` field  | `convex/schema.ts:410`   | ✅ Exists in userSettings |
| `settings.get()`    | `convex/settings.ts:109` | ✅ Returns hasPremium     |
| `settings.update()` | `convex/settings.ts:176` | ✅ Can update hasPremium  |

### Current Flow (Broken)

```
User taps "Start Trial" → onStartTrial() → ??? → hasPremium stays false
```

**Problem:** `onStartTrial()` is a placeholder that doesn't connect to any payment processor.

---

## Target Architecture

### Data Flow

```
┌─────────────────────────────────────────────────────────────────────────┐
│                              PURCHASE FLOW                               │
└─────────────────────────────────────────────────────────────────────────┘

┌──────────────┐    ┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│   Paywall    │───▶│  RevenueCat  │───▶│  App Store   │───▶│   Apple/     │
│   Component  │    │     SDK      │    │  Play Store  │    │   Google     │
└──────────────┘    └──────────────┘    └──────────────┘    └──────────────┘
                           │                                        │
                           │ (SDK callback)                         │
                           ▼                                        │
                    ┌──────────────┐                                │
                    │  usePremium  │                                │
                    │    Hook      │                                │
                    └──────────────┘                                │
                           │                                        │
                           │ (update local state)                   │ (webhook)
                           ▼                                        ▼
                    ┌──────────────┐                         ┌──────────────┐
                    │   App UI     │◀────────────────────────│   Convex     │
                    │   Updates    │   (subscription sync)   │   Backend    │
                    └──────────────┘                         └──────────────┘

┌─────────────────────────────────────────────────────────────────────────┐
│                           SUBSCRIPTION SYNC                              │
└─────────────────────────────────────────────────────────────────────────┘

RevenueCat Webhook ──▶ Convex HTTP Action ──▶ Update userSettings.hasPremium
                                             Update subscriptions table
```

---

## UI Mockups: Before & After

### Before: Current Paywall (No RevenueCat)

```
┌─────────────────────────────────────────────┐
│                              [X]            │
│                                             │
│              👑                             │
│                                             │
│     Unlock Premium Motivation               │
│  Science-backed tools to help you build     │
│           lasting habits                    │
│                                             │
│  ┌─────────────────────────────────────┐    │
│  │ 🎤 Unlimited Voice Notes         ✓ │    │
│  │    40% higher emotional recall      │    │
│  └─────────────────────────────────────┘    │
│  ┌─────────────────────────────────────┐    │
│  │ ✉️  Letters to Self               ✓ │    │
│  │    Time-locked motivation           │    │
│  └─────────────────────────────────────┘    │
│  ... (4 more features)                      │
│                                             │
│  ┌─────────────────────────────────────┐    │
│  │      PREMIUM SUBSCRIPTION           │    │
│  │         $6.99 /month                │    │  ← HARDCODED PRICE
│  │   7-day free trial • Cancel anytime │    │
│  └─────────────────────────────────────┘    │
│                                             │
│  ┌─────────────────────────────────────┐    │
│  │    ✨ Start 7-Day Free Trial    ▶  │    │  ← DOES NOTHING
│  └─────────────────────────────────────┘    │
│                                             │
│     Already premium? Restore purchases      │  ← DOES NOTHING
│                                             │
└─────────────────────────────────────────────┘
```

**Problems:**

1. Price is hardcoded ("$6.99") - won't adapt to regional pricing
2. "Start Trial" button doesn't trigger any purchase flow
3. "Restore purchases" doesn't work
4. No loading states for purchase processing

---

### After: RevenueCat-Powered Paywall

```
┌─────────────────────────────────────────────┐
│                              [X]            │
│                                             │
│              👑                             │
│                                             │
│     Unlock Premium Motivation               │
│  Science-backed tools to help you build     │
│           lasting habits                    │
│                                             │
│  ┌─────────────────────────────────────┐    │
│  │ 🎤 Unlimited Voice Notes         ✓ │    │
│  │    40% higher emotional recall      │    │
│  └─────────────────────────────────────┘    │
│  ... (features unchanged)                   │
│                                             │
│  ┌─────────────────────────────────────┐    │
│  │      PREMIUM SUBSCRIPTION           │    │
│  │         $6.99 /month                │    │  ← FROM REVENUECAT
│  │   7-day free trial • Cancel anytime │    │     (localized price)
│  └─────────────────────────────────────┘    │
│                                             │
│  ╔═════════════════════════════════════╗    │
│  ║   ◌ Loading offerings...            ║    │  ← LOADING STATE (new)
│  ╚═════════════════════════════════════╝    │
│                                             │
│  ┌─────────────────────────────────────┐    │
│  │    ✨ Start 7-Day Free Trial    ▶  │    │  ← TRIGGERS PURCHASE
│  └─────────────────────────────────────┘    │
│                                             │
│     Already premium? Restore purchases      │  ← WORKS NOW
│                                             │
│  ┌─────────────────────────────────────┐    │
│  │ ⚠️ Purchase failed: Card declined  │    │  ← ERROR STATE (new)
│  │                         [Retry]     │    │
│  └─────────────────────────────────────┘    │
│                                             │
└─────────────────────────────────────────────┘
```

**Improvements:**

1. Price fetched from RevenueCat (supports regional pricing)
2. Loading state while fetching offerings
3. Purchase flow triggers native App Store/Play Store sheet
4. Restore purchases actually restores
5. Error handling with retry option

---

### After: Premium User State

```
┌─────────────────────────────────────────────┐
│  Settings                                   │
├─────────────────────────────────────────────┤
│                                             │
│  Account                                    │
│  ┌─────────────────────────────────────┐    │
│  │ 👑 Premium                          │    │
│  │    Active until Feb 9, 2026         │    │  ← NEW: Subscription info
│  │                    [Manage]    ▶    │    │  ← Opens management URL
│  └─────────────────────────────────────┘    │
│                                             │
│  Subscription                               │
│  ┌─────────────────────────────────────┐    │
│  │ Plan: Monthly ($6.99/mo)            │    │
│  │ Status: Active                      │    │
│  │ Renews: Feb 9, 2026                 │    │
│  │ Trial: Completed                    │    │
│  └─────────────────────────────────────┘    │
│                                             │
└─────────────────────────────────────────────┘
```

---

### After: Subscription Management Screen (New)

```
┌─────────────────────────────────────────────┐
│  ←  Subscription                            │
├─────────────────────────────────────────────┤
│                                             │
│              👑                             │
│        Premium Member                       │
│                                             │
│  ┌─────────────────────────────────────┐    │
│  │  Current Plan                       │    │
│  │  ─────────────────────────────────  │    │
│  │  Monthly Premium         $6.99/mo   │    │
│  │  Status                    Active   │    │
│  │  Next billing          Feb 9, 2026  │    │
│  └─────────────────────────────────────┘    │
│                                             │
│  ┌─────────────────────────────────────┐    │
│  │     Manage Subscription         ▶   │    │  ← Opens App Store/Play Store
│  └─────────────────────────────────────┘    │
│                                             │
│  ┌─────────────────────────────────────┐    │
│  │     Restore Purchases               │    │
│  └─────────────────────────────────────┘    │
│                                             │
│  ─────────────────────────────────────────  │
│                                             │
│  Need help? Contact support                 │
│                                             │
└─────────────────────────────────────────────┘
```

---

## Technical Implementation

### 1. Dependencies

**Install:**

```bash
npx expo install react-native-purchases
```

**Package:** `react-native-purchases` (RevenueCat's React Native SDK)

### 2. RevenueCat Configuration

**RevenueCat Dashboard Setup:**

1. Create project in RevenueCat
2. Add iOS app (bundle ID: `com.andres9888.daily-habits`)
3. Add Android app (package name: `com.andres9888.daily-habits`)
4. Create "Entitlement": `premium`
5. Create "Offering": `default`
6. Create "Package": `$rc_monthly` with $6.99/month product
7. Configure webhook URL: `https://<convex-url>/revenuecat-webhook`

**App Store Connect Setup:**

1. Create subscription group: "Premium"
2. Create subscription: "Monthly Premium" at $6.99/month
3. Configure free trial: 7 days
4. Link to RevenueCat

**Google Play Console Setup:**

1. Create subscription: "premium_monthly" at $6.99/month
2. Configure free trial: 7 days
3. Link service account to RevenueCat

### 3. SDK Initialization

```typescript
// src/lib/purchases.ts
import Purchases, { LOG_LEVEL } from 'react-native-purchases';
import { Platform } from 'react-native';

const API_KEYS = {
  ios: 'appl_xxxxxxxxxxxxxxxxxxxxxx',
  android: 'goog_xxxxxxxxxxxxxxxxxxxxxx',
};

export async function initializePurchases(userId?: string) {
  Purchases.setLogLevel(LOG_LEVEL.DEBUG); // Remove in production

  const apiKey = Platform.OS === 'ios' ? API_KEYS.ios : API_KEYS.android;

  await Purchases.configure({
    apiKey,
    appUserID: userId, // Clerk user ID for cross-device sync
  });
}

export { Purchases };
```

### 4. Premium Hook

```typescript
// src/hooks/usePremium.ts
import { useEffect, useState, useCallback } from 'react';
import Purchases, {
  PurchasesPackage,
  CustomerInfo,
  PurchasesError,
} from 'react-native-purchases';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';

interface UsePremiumReturn {
  // State
  isPremium: boolean;
  isLoading: boolean;
  error: string | null;

  // Offerings
  offerings: PurchasesPackage[] | null;
  monthlyPackage: PurchasesPackage | null;

  // Actions
  purchasePackage: (pkg: PurchasesPackage) => Promise<boolean>;
  restorePurchases: () => Promise<boolean>;

  // Subscription info
  expirationDate: Date | null;
  isTrialActive: boolean;
  managementUrl: string | null;
}

export function usePremium(): UsePremiumReturn {
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo | null>(null);
  const [offerings, setOfferings] = useState<PurchasesPackage[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Convex sync
  const settings = useQuery(api.settings.get);
  const updateSettings = useMutation(api.settings.update);

  // Check premium status from RevenueCat entitlements
  const isPremium = customerInfo?.entitlements.active['premium'] !== undefined;

  // Sync premium status to Convex
  useEffect(() => {
    if (settings && settings.hasPremium !== isPremium) {
      updateSettings({ ...settings, hasPremium: isPremium });
    }
  }, [isPremium, settings, updateSettings]);

  // Fetch offerings and customer info on mount
  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true);

        const [info, offerings] = await Promise.all([
          Purchases.getCustomerInfo(),
          Purchases.getOfferings(),
        ]);

        setCustomerInfo(info);
        setOfferings(offerings.current?.availablePackages ?? null);
      } catch (e) {
        setError('Failed to load subscription info');
        console.error('RevenueCat error:', e);
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();

    // Listen for customer info updates
    const listener = Purchases.addCustomerInfoUpdateListener(setCustomerInfo);
    return () => listener.remove();
  }, []);

  // Purchase a package
  const purchasePackage = useCallback(async (pkg: PurchasesPackage) => {
    try {
      setError(null);
      const { customerInfo } = await Purchases.purchasePackage(pkg);
      setCustomerInfo(customerInfo);
      return customerInfo.entitlements.active['premium'] !== undefined;
    } catch (e) {
      const purchaseError = e as PurchasesError;
      if (!purchaseError.userCancelled) {
        setError(purchaseError.message);
      }
      return false;
    }
  }, []);

  // Restore purchases
  const restorePurchases = useCallback(async () => {
    try {
      setError(null);
      const info = await Purchases.restorePurchases();
      setCustomerInfo(info);
      return info.entitlements.active['premium'] !== undefined;
    } catch (e) {
      setError('Failed to restore purchases');
      return false;
    }
  }, []);

  // Monthly package helper
  const monthlyPackage =
    offerings?.find((p) => p.packageType === 'MONTHLY') ?? null;

  // Subscription info
  const premiumEntitlement = customerInfo?.entitlements.active['premium'];
  const expirationDate = premiumEntitlement?.expirationDate
    ? new Date(premiumEntitlement.expirationDate)
    : null;
  const isTrialActive = premiumEntitlement?.periodType === 'TRIAL';
  const managementUrl = customerInfo?.managementURL ?? null;

  return {
    isPremium,
    isLoading,
    error,
    offerings,
    monthlyPackage,
    purchasePackage,
    restorePurchases,
    expirationDate,
    isTrialActive,
    managementUrl,
  };
}
```

### 5. Convex Webhook Handler

```typescript
// convex/http.ts
import { httpRouter } from 'convex/server';
import { httpAction } from './_generated/server';
import { api } from './_generated/api';

const http = httpRouter();

// RevenueCat webhook endpoint
http.route({
  path: '/revenuecat-webhook',
  method: 'POST',
  handler: httpAction(async (ctx, request) => {
    // Verify the timestamped HMAC before parsing the raw request body.
    const rawBody = await request.text();
    const signature =
      request.headers.get('X-RevenueCat-Webhook-Signature') ?? '';
    const isValid = await verifyRevenueCatSignature(rawBody, signature);
    if (!isValid) return new Response('Invalid signature', { status: 401 });

    const body = JSON.parse(rawBody);
    const { event, app_user_id } = body;

    // Handle subscription events
    switch (event.type) {
      case 'INITIAL_PURCHASE':
      case 'RENEWAL':
      case 'PRODUCT_CHANGE':
        // Grant premium access
        await ctx.runMutation(api.subscriptions.grantPremium, {
          userId: app_user_id,
          expiresAt: new Date(event.expiration_at_ms).getTime(),
          productId: event.product_id,
        });
        break;

      case 'CANCELLATION':
      case 'EXPIRATION':
        // Revoke premium access
        await ctx.runMutation(api.subscriptions.revokePremium, {
          userId: app_user_id,
        });
        break;

      case 'BILLING_ISSUE':
        // Grace period - don't revoke yet
        await ctx.runMutation(api.subscriptions.setBillingIssue, {
          userId: app_user_id,
        });
        break;
    }

    return new Response('OK', { status: 200 });
  }),
});

export default http;
```

### 6. Convex Subscriptions Table

```typescript
// convex/schema.ts (additions)
subscriptions: defineTable({
  userId: v.string(),
  clerkId: v.optional(v.string()),
  revenueCatId: v.optional(v.string()),

  // Subscription state
  status: v.union(
    v.literal('active'),
    v.literal('trialing'),
    v.literal('past_due'),
    v.literal('cancelled'),
    v.literal('expired')
  ),

  // Product info
  productId: v.optional(v.string()),
  planType: v.optional(v.union(v.literal('monthly'), v.literal('yearly'))),

  // Dates
  startedAt: v.number(),
  expiresAt: v.optional(v.number()),
  trialEndsAt: v.optional(v.number()),
  cancelledAt: v.optional(v.number()),

  // Billing
  hasBillingIssue: v.optional(v.boolean()),

  createdAt: v.number(),
  updatedAt: v.number(),
})
  .index('by_user', ['userId'])
  .index('by_clerk', ['clerkId'])
  .index('by_revenuecat', ['revenueCatId'])
  .index('by_status', ['status']),
```

---

## Code Review Checklist

### Security Review

| Item                           | Status  | Notes                                             |
| ------------------------------ | ------- | ------------------------------------------------- |
| Webhook signature verification | ✅      | Timestamped HMAC over the raw body, with replay tolerance |
| Server-side entitlement check  | ✅      | RevenueCat validates receipts server-side         |
| No client-side premium logic   | ✅      | All premium checks go through `usePremium` hook   |
| User ID validation             | ⚠️ TODO | Ensure webhook user ID matches authenticated user |
| Rate limiting on webhook       | ⚠️ TODO | Add rate limiting to prevent abuse                |

### Performance Review

| Item                   | Status  | Notes                                      |
| ---------------------- | ------- | ------------------------------------------ |
| Offerings cached       | ✅      | RevenueCat SDK caches offerings            |
| Customer info listener | ✅      | Real-time updates via listener             |
| Convex sync debounced  | ⚠️ TODO | Consider debouncing premium sync           |
| Lazy load purchase SDK | ⚠️ TODO | Consider lazy loading for faster app start |

### UX Review

| Item                    | Status  | Notes                             |
| ----------------------- | ------- | --------------------------------- |
| Loading state           | ✅      | `isLoading` flag in hook          |
| Error messages          | ✅      | User-friendly error messages      |
| Restore purchases       | ✅      | Available in paywall and settings |
| Subscription management | ✅      | Opens native App Store/Play Store |
| Offline handling        | ⚠️ TODO | Cache last known premium state    |

### App Store Compliance

| Item                     | Status  | Notes                                  |
| ------------------------ | ------- | -------------------------------------- |
| Restore purchases button | ✅      | Required by Apple - present in paywall |
| Subscription terms       | ✅      | Fine print in paywall shows terms      |
| Privacy policy link      | ⚠️ TODO | Add to paywall footer                  |
| Terms of service link    | ⚠️ TODO | Add to paywall footer                  |
| Price display            | ✅      | Fetched from store (localized)         |

### Testing Checklist

| Scenario                 | Platform | Priority |
| ------------------------ | -------- | -------- |
| New purchase (trial)     | iOS      | P0       |
| New purchase (trial)     | Android  | P0       |
| Purchase after trial     | Both     | P0       |
| Restore on new device    | Both     | P0       |
| Cancel subscription      | Both     | P1       |
| Subscription expires     | Both     | P1       |
| Billing issue (grace)    | Both     | P2       |
| Refund received          | Both     | P2       |
| Offline purchase attempt | Both     | P2       |

---

## Implementation Tasks

### Phase 1: SDK Setup & Core Hook

| ID  | Task                             | Description                               | Priority | Dependencies | Status    |
| --- | -------------------------------- | ----------------------------------------- | -------- | ------------ | --------- |
| 1.1 | Install `react-native-purchases` | Add RevenueCat SDK to project             | P0       | None         | `pending` |
| 1.2 | Create RevenueCat project        | Set up project in RevenueCat dashboard    | P0       | None         | `pending` |
| 1.3 | Create `src/lib/purchases.ts`    | SDK initialization with API keys          | P0       | 1.1, 1.2     | `pending` |
| 1.4 | Initialize SDK in `App.tsx`      | Call `initializePurchases()` on app start | P0       | 1.3          | `pending` |
| 1.5 | Create `usePremium` hook         | Core hook with purchase/restore logic     | P0       | 1.3          | `pending` |
| 1.6 | Test SDK initialization          | Verify SDK connects and fetches offerings | P0       | 1.4, 1.5     | `pending` |

### Phase 2: App Store Configuration

| ID  | Task                                         | Description                               | Priority | Dependencies | Status    |
| --- | -------------------------------------------- | ----------------------------------------- | -------- | ------------ | --------- |
| 2.1 | Create iOS subscription in App Store Connect | $6.99/month with 7-day trial              | P0       | None         | `pending` |
| 2.2 | Create Android subscription in Play Console  | $6.99/month with 7-day trial              | P0       | None         | `pending` |
| 2.3 | Link iOS product to RevenueCat               | Connect App Store product to entitlement  | P0       | 1.2, 2.1     | `pending` |
| 2.4 | Link Android product to RevenueCat           | Connect Play Store product to entitlement | P0       | 1.2, 2.2     | `pending` |
| 2.5 | Configure entitlement "premium"              | Map products to premium entitlement       | P0       | 2.3, 2.4     | `pending` |
| 2.6 | Test sandbox purchase (iOS)                  | Complete purchase in sandbox              | P0       | 2.3          | `pending` |

### Phase 3: Connect Paywall UI

| ID  | Task                                           | Description                            | Priority | Dependencies | Status    |
| --- | ---------------------------------------------- | -------------------------------------- | -------- | ------------ | --------- |
| 3.1 | Update `MotivationPaywall` to use `usePremium` | Replace placeholder with real purchase | P0       | 1.5          | `pending` |
| 3.2 | Display dynamic price from offerings           | Replace hardcoded "$6.99"              | P0       | 3.1          | `pending` |
| 3.3 | Add loading state for offerings                | Show spinner while fetching            | P1       | 3.1          | `pending` |
| 3.4 | Add purchase error handling                    | Display errors with retry              | P1       | 3.1          | `pending` |
| 3.5 | Implement restore purchases                    | Connect restore button to SDK          | P0       | 3.1          | `pending` |
| 3.6 | Test complete purchase flow                    | End-to-end on iOS simulator            | P0       | 3.1-3.5      | `pending` |

### Phase 4: Backend Webhook Integration

| ID  | Task                                | Description                           | Priority | Dependencies | Status    |
| --- | ----------------------------------- | ------------------------------------- | -------- | ------------ | --------- |
| 4.1 | Add `subscriptions` table to schema | Store subscription state in Convex    | P0       | None         | `pending` |
| 4.2 | Create Convex HTTP router           | Set up `convex/http.ts` for webhooks  | P0       | None         | `pending` |
| 4.3 | Implement webhook handler           | Process RevenueCat events             | P0       | 4.1, 4.2     | `pending` |
| 4.4 | Create subscription mutations       | `grantPremium`, `revokePremium`, etc. | P0       | 4.1          | `pending` |
| 4.5 | Configure webhook in RevenueCat     | Point to Convex HTTP endpoint         | P0       | 4.3          | `pending` |
| 4.6 | Test webhook delivery               | Verify events sync to Convex          | P0       | 4.5          | `pending` |

### Phase 5: Subscription Management UI

| ID  | Task                                | Description                             | Priority | Dependencies | Status    |
| --- | ----------------------------------- | --------------------------------------- | -------- | ------------ | --------- |
| 5.1 | Create `SubscriptionScreen`         | Show subscription status and management | P1       | 1.5          | `pending` |
| 5.2 | Add subscription info to Settings   | Show premium badge and manage link      | P1       | 1.5          | `pending` |
| 5.3 | Implement management URL navigation | Open App Store/Play Store subscriptions | P1       | 5.1          | `pending` |
| 5.4 | Add expiration date display         | Show when subscription renews/expires   | P2       | 5.1          | `pending` |
| 5.5 | Add trial status indicator          | Show "X days left in trial"             | P2       | 5.1          | `pending` |

### Phase 6: Polish & Production

| ID  | Task                                 | Description                         | Priority | Dependencies | Status    |
| --- | ------------------------------------ | ----------------------------------- | -------- | ------------ | --------- |
| 6.1 | Add webhook signature verification   | Secure webhook endpoint             | P0       | 4.3          | `pending` |
| 6.2 | Add privacy policy link to paywall   | App Store compliance                | P0       | 3.1          | `pending` |
| 6.3 | Add terms of service link to paywall | App Store compliance                | P0       | 3.1          | `pending` |
| 6.4 | Test on physical iOS device          | Real purchase with sandbox          | P0       | Phase 3      | `pending` |
| 6.5 | Test on physical Android device      | Real purchase with test account     | P0       | Phase 3      | `pending` |
| 6.6 | Production API key rotation          | Switch from test to production keys | P0       | 6.4, 6.5     | `pending` |

### Phase 7: QA & Launch

| ID  | Task                         | Description                                 | Priority | Dependencies | Status    |
| --- | ---------------------------- | ------------------------------------------- | -------- | ------------ | --------- |
| 7.1 | Full regression testing      | All premium features work                   | P0       | Phase 6      | `pending` |
| 7.2 | Test subscription lifecycle  | Purchase → Trial → Active → Cancel → Expire | P0       | 7.1          | `pending` |
| 7.3 | Test cross-device sync       | Premium on device A shows on device B       | P1       | 7.1          | `pending` |
| 7.4 | Test offline scenarios       | App handles offline gracefully              | P1       | 7.1          | `pending` |
| 7.5 | Monitor RevenueCat dashboard | Verify analytics tracking                   | P2       | 7.1          | `pending` |

---

## Task Summary

| Phase                  | Tasks        | Focus                           |
| ---------------------- | ------------ | ------------------------------- |
| Phase 1: SDK Setup     | 6 tasks      | RevenueCat SDK + core hook      |
| Phase 2: Store Config  | 6 tasks      | App Store + Play Store products |
| Phase 3: Paywall UI    | 6 tasks      | Connect UI to SDK               |
| Phase 4: Webhooks      | 6 tasks      | Convex backend sync             |
| Phase 5: Management UI | 5 tasks      | Subscription screens            |
| Phase 6: Polish        | 6 tasks      | Security + compliance           |
| Phase 7: QA            | 5 tasks      | Testing + launch                |
| **Total**              | **40 tasks** |                                 |

---

## Quick Reference: Files to Create/Modify

### New Files

```
src/lib/purchases.ts                          # Task 1.3 - SDK init
src/hooks/usePremium.ts                       # Task 1.5 - Core hook
src/screens/SubscriptionScreen.tsx            # Task 5.1 - Management UI
convex/http.ts                                # Task 4.2 - Webhook router
convex/subscriptions.ts                       # Task 4.4 - Subscription mutations
```

### Modified Files

```
src/App.tsx                                   # Task 1.4 - SDK init
src/components/MotivationSystem/Premium/MotivationPaywall.tsx  # Task 3.1
src/screens/SettingsScreen.tsx                # Task 5.2 - Premium badge
convex/schema.ts                              # Task 4.1 - Subscriptions table
```

### External Configuration

```
RevenueCat Dashboard                          # Tasks 1.2, 2.3-2.5, 4.5
App Store Connect                             # Task 2.1
Google Play Console                           # Task 2.2
Environment Variables (.env)                  # API keys
```

---

## Environment Variables

```bash
# .env.local (development)
EXPO_PUBLIC_REVENUECAT_IOS_KEY=appl_xxxxxxxxxxxxxxxxxxxxxx
EXPO_PUBLIC_REVENUECAT_ANDROID_KEY=goog_xxxxxxxxxxxxxxxxxxxxxx

# .env.production
EXPO_PUBLIC_REVENUECAT_IOS_KEY=appl_yyyyyyyyyyyyyyyyyyyyyy
EXPO_PUBLIC_REVENUECAT_ANDROID_KEY=goog_yyyyyyyyyyyyyyyyyyyyyy

# Convex environment variables (for webhook verification)
REVENUECAT_WEBHOOK_SECRET=<YOUR_REVENUECAT_WEBHOOK_SECRET>
```

---

## Risk Assessment

| Risk                     | Likelihood | Impact | Mitigation                                              |
| ------------------------ | ---------- | ------ | ------------------------------------------------------- |
| App Store rejection      | Medium     | High   | Follow Apple guidelines exactly; add all required links |
| Webhook delivery failure | Low        | Medium | Implement retry logic; monitor webhook health           |
| User purchase not synced | Low        | High   | Dual-check: SDK listener + webhook backup               |
| Revenue leakage (piracy) | Low        | Medium | Server-side validation only; no client-side bypass      |
| Trial abuse              | Medium     | Low    | RevenueCat handles device fingerprinting                |

---

_Specification Version: 1.0_
_Created: January 2026_
_Last Updated: January 2026_
