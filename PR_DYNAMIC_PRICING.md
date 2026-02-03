# PR: Fix Dynamic Pricing with RevenueCat

## Summary

Fixed hardcoded `$6.99` pricing to use dynamic prices fetched from RevenueCat. This enables proper price localization and allows price changes to be managed through RevenueCat dashboard without app updates.

## Problem

The app was showing hardcoded pricing in two places:

- `PricingCard.tsx` (Motivation Paywall)
- `CTAFooter.tsx` (Premium Benefits Modal)

This caused issues with:

- ❌ No price localization (always showed $6.99 USD)
- ❌ Price changes required app updates
- ❌ No visibility into when prices were loading

## Solution

Integrated the existing `usePremium` hook which already provides `priceString` from RevenueCat:

### Files Changed

#### 1. **PricingCard.tsx**

- Added `priceString` and `isLoadingPrice` props
- Shows `ActivityIndicator` while loading
- Falls back to `$6.99` if price unavailable

#### 2. **CTAFooter.tsx**

- Added `priceString` and `isLoadingPrice` props
- Shows `ActivityIndicator` while loading
- Falls back to `$6.99` if price unavailable

#### 3. **MotivationPaywall.tsx**

- Added `usePremium()` hook
- Passes `priceString` and `isLoadingOfferings` to `PricingCard`

#### 4. **PremiumBenefitsModal.tsx**

- Added `usePremium()` hook (was imported but not used)
- Passes `priceString` and `isLoadingOfferings` to `CTAFooter`

#### 5. **Test Files**

- Added mock for `usePremium` hook returning test price data

## Benefits

✅ **Localization** - Users see prices in their local currency (e.g., €6.99, £5.99)  
✅ **Dynamic Updates** - Price changes in RevenueCat reflect immediately  
✅ **Loading States** - Better UX with spinners while fetching prices  
✅ **Fallback** - Gracefully handles edge cases with default price  
✅ **Type Safety** - Proper TypeScript types throughout

## Testing

### Manual Testing

1. Open the app and navigate to Premium features
2. Trigger the paywall (try Voice Notes or Letters to Self)
3. Verify:
   - Price displays correctly (should match RevenueCat offering)
   - Loading indicator shows briefly while fetching
   - Price is localized to your region

### Automated Testing

- Updated test mocks to include `usePremium` hook
- Tests verify fallback behavior when price is null
- Note: Some pre-existing test failures unrelated to this PR

## Screenshots

_[Add screenshots showing dynamic pricing in both components]_

## Rollout Plan

1. Merge this PR
2. Deploy to TestFlight
3. Verify pricing shows correctly in different regions
4. Monitor for any issues with price loading
5. Full release to production

## Related Issues

- Fixes #[issue number if available]
- Part of monetization improvements

## Notes

- The `usePremium` hook already handles RevenueCat SDK initialization and retries
- Fallback price ($6.99) ensures users can always see a price even if fetch fails
- Loading states prevent confusion during price fetch

---

**Branch:** `fix/restore-purchases`  
**Status:** Ready for review
