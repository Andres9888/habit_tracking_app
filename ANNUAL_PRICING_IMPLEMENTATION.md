# Annual Pricing Implementation Guide

## Overview
This document describes the implementation of annual subscription pricing alongside the existing monthly option, providing users with a 25% savings incentive.

## Changes Made

### 1. Updated `usePremium` Hook (`src/hooks/usePremium/`)

#### `types.ts`
- Added `annualPackage: PurchasesPackage | null` to `PremiumOfferings` interface
- Added `annualPriceString: string | null` to `PremiumOfferings` interface

#### `usePremium.ts`
- Now fetches and exposes both `PACKAGE_TYPE.MONTHLY` and `PACKAGE_TYPE.ANNUAL` packages
- Returns `annualPackage` and `annualPriceString` alongside existing monthly equivalents

### 2. Updated Paywall Components

#### MotivationPaywall (`src/components/MotivationSystem/Premium/MotivationPaywall/`)

**PricingCard.tsx**
- Completely rewritten to support monthly/annual toggle
- Features:
  - Side-by-side plan selection with visual feedback
  - "Save X%" badge on annual option (dynamically calculated)
  - Monthly cost equivalent display for annual plan (e.g., "$3.75/mo")
  - Updates parent component when plan selection changes via `onPackageChange` callback
  - Defaults to annual plan to promote higher-value option
  - Uses actual prices from RevenueCat packages when available
  - Fallback to hardcoded prices if packages not loaded

**MotivationPaywall.tsx**
- Integrated with `usePremium` hook to access both packages
- Tracks selected package in local state (defaults to annual)
- Passes selected package to purchase handler
- Self-contained purchase logic using `purchasePackage` from hook

#### PremiumAnalyticsPaywall (`src/components/PremiumAnalyticsPaywall/`)

**components/PricingCard.tsx**
- Same dual-pricing UI as MotivationPaywall but using StyleSheet instead of Tailwind
- Maintains consistent UX across both paywalls
- Responsive to theme colors and spacing

**PremiumAnalyticsPaywall.tsx**
- Integrated with `usePremium` hook
- Handles package selection and purchase flow
- Added loading states and error handling
- Restore purchases functionality included

**components/PaywallFooter.tsx**
- Added `isProcessing?: boolean` prop
- Disables button and shows "Processing..." during purchase
- Visual feedback with disabled state styling

## RevenueCat Configuration Required

### 1. Create Annual Product

**iOS (App Store Connect):**
1. Go to App Store Connect → Your App → Subscriptions
2. Create a new subscription with product ID: `premium_annual` (or similar)
3. Set pricing to **$44.99/year**
4. Configure free trial: **7 days**
5. Enable auto-renewable subscription

**Android (Google Play Console):**
1. Go to Google Play Console → Your App → Subscriptions
2. Create a new subscription with product ID: `premium_annual`
3. Set base plan pricing to **$44.99/year**
4. Configure free trial: **7 days**
5. Activate the subscription

### 2. Configure RevenueCat Dashboard

1. Go to RevenueCat Dashboard → Products
2. Add the annual product:
   - Product Identifier: `premium_annual` (must match store product ID)
   - Store: iOS App Store and/or Google Play Store
   - Type: Subscription

3. Go to Offerings → Current Offering (or create new one)
4. Add both packages:
   - **Monthly Package:**
     - Identifier: `monthly`
     - Product: `premium_monthly` (existing)
     - Package Type: `MONTHLY`
   
   - **Annual Package:**
     - Identifier: `annual`
     - Product: `premium_annual` (new)
     - Package Type: `ANNUAL`

5. Save and publish the offering

### 3. Environment Variables

Ensure your `.env` file has:
```
EXPO_PUBLIC_REVENUECAT_IOS_KEY=your_ios_key
EXPO_PUBLIC_REVENUECAT_ANDROID_KEY=your_android_key
```

## Pricing Strategy

- **Monthly:** $6.99/month ($83.88/year)
- **Annual:** $44.99/year ($3.75/month equivalent)
- **Savings:** ~46% off ($38.89 savings vs 12 months of monthly)
- **Actual percentage shown:** Dynamically calculated from actual package prices

This creates a strong incentive for users to choose annual while still offering monthly flexibility.

## User Experience

### Paywall Flow
1. User hits premium feature/analytics
2. Paywall displays with **annual plan pre-selected** (default)
3. User can toggle between monthly and annual
4. Annual plan shows:
   - "Save X%" badge
   - Total annual price
   - Monthly equivalent cost
5. Single "Start 7-Day Free Trial" button works for both
6. After trial, charges selected plan amount

### Visual Indicators
- Selected plan: highlighted border, tinted background
- Annual plan: green "Save X%" badge
- Monthly equivalent cost shown beneath annual price
- Clear pricing breakdown at bottom

## Testing

### Test Purchase Flow
```bash
# Run app in development build (not Expo Go)
npx expo run:ios
# or
npx expo run:android
```

### Verify in Code
```typescript
import { usePremium } from './hooks/usePremium';

function TestComponent() {
  const { monthlyPackage, annualPackage, priceString, annualPriceString } = usePremium();
  
  console.log('Monthly:', priceString); // "$6.99"
  console.log('Annual:', annualPriceString); // "$44.99"
  console.log('Packages:', { monthlyPackage, annualPackage });
  
  // Both should be defined if RevenueCat is configured correctly
}
```

### StoreKit Configuration (iOS Testing)
Create `.storekit` configuration file for local testing:
```json
{
  "identifier": "chainday",
  "nonRenewingSubscriptions": [],
  "products": [],
  "settings": {},
  "subscriptions": [
    {
      "adHocOffers": [],
      "codeOffers": [],
      "displayPrice": "6.99",
      "familyShareable": false,
      "groupNumber": 1,
      "internalID": "premium_monthly",
      "introductoryOffer": {
        "internalID": "monthly_trial",
        "numberOfPeriods": 1,
        "paymentMode": "free",
        "subscriptionPeriod": "P1W"
      },
      "localizations": [],
      "productID": "premium_monthly",
      "recurringSubscriptionPeriod": "P1M",
      "referenceName": "Premium Monthly",
      "subscriptionGroupID": "premium",
      "type": "RecurringSubscription"
    },
    {
      "adHocOffers": [],
      "codeOffers": [],
      "displayPrice": "44.99",
      "familyShareable": false,
      "groupNumber": 1,
      "internalID": "premium_annual",
      "introductoryOffer": {
        "internalID": "annual_trial",
        "numberOfPeriods": 1,
        "paymentMode": "free",
        "subscriptionPeriod": "P1W"
      },
      "localizations": [],
      "productID": "premium_annual",
      "recurringSubscriptionPeriod": "P1Y",
      "referenceName": "Premium Annual",
      "subscriptionGroupID": "premium",
      "type": "RecurringSubscription"
    }
  ],
  "version": {
    "major": 2,
    "minor": 0
  }
}
```

## Rollout Plan

1. **Stage 1 - RevenueCat Setup:** Configure annual product in stores and RevenueCat
2. **Stage 2 - Deploy Code:** Merge this PR and deploy app update
3. **Stage 3 - Monitor:** Track conversion rates and user preference
4. **Stage 4 - Optimize:** A/B test default selection (annual vs monthly)

## Analytics Tracking

Consider tracking these metrics:
- Annual vs monthly selection rate
- Conversion rate by plan type
- Trial-to-paid conversion by plan
- Churn rate comparison
- Revenue per user by plan type

## Backwards Compatibility

- Existing monthly subscribers: **No impact**
- Code gracefully handles missing packages (shows fallback prices)
- If RevenueCat returns only monthly package, annual option still displays but uses fallback
- No breaking changes to existing purchase flow

## Files Modified

### Core Changes
- ✅ `src/hooks/usePremium/types.ts` - Type definitions
- ✅ `src/hooks/usePremium/usePremium.ts` - Hook logic
- ✅ `src/components/MotivationSystem/Premium/MotivationPaywall/PricingCard.tsx` - Dual pricing UI
- ✅ `src/components/MotivationSystem/Premium/MotivationPaywall/MotivationPaywall.tsx` - Integration
- ✅ `src/components/PremiumAnalyticsPaywall/components/PricingCard.tsx` - Dual pricing UI
- ✅ `src/components/PremiumAnalyticsPaywall/PremiumAnalyticsPaywall.tsx` - Integration
- ✅ `src/components/PremiumAnalyticsPaywall/components/PaywallFooter.tsx` - Processing state

### Backup Files Created
- `*.old.tsx` - Original implementations preserved for reference

## Next Steps

1. ✅ **Code Review:** Get team approval on PR
2. **RevenueCat Setup:** Configure products and offerings
3. **Testing:** Verify on iOS and Android test builds
4. **Deploy:** Merge to main and release app update
5. **Monitor:** Track metrics and user feedback
6. **Iterate:** Adjust pricing/UI based on data

## Support

If users report issues:
1. Verify RevenueCat configuration
2. Check SDK initialization logs
3. Confirm product IDs match between stores and RevenueCat
4. Test restore purchases flow
5. Review Sentry error tracking for purchase failures

---

**Implementation Date:** February 3, 2026
**Author:** AI Assistant (OpenClaw)
**Status:** ✅ Code Complete - Awaiting RevenueCat Configuration
