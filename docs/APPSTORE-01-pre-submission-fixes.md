# App Store Pre-Submission Fixes - Phase 01

**Created:** 2026-01-27
**Priority:** CRITICAL - Blocking App Store submission
**Audit Source:** Production readiness audit

---

## Critical Issues (Must Fix)

### RevenueCat & IAP

- [ ] **C-001: Fix hardcoded $6.99 pricing** - Replace hardcoded price in `src/components/MotivationSystem/Premium/MotivationPaywall/PricingCard.tsx:16` and `src/components/MotivationSystem/Premium/PremiumBenefitsModal/CTAFooter.tsx:32` with dynamic `priceString` from `usePremium()` hook. Must handle loading state and null package gracefully.

- [ ] **H-001: Implement Restore Purchases** - Connect the restore purchases button in `src/components/MotivationSystem/Premium/PremiumBenefitsModal/PremiumBenefitsModal.tsx:47` to `usePremium().restorePurchases()`. Add loading state, success/error alerts, and haptic feedback.

- [ ] **H-002: Improve subscription terms visibility** - In `src/components/MotivationSystem/Premium/MotivationPaywall/PricingCard.tsx:19-20`, increase font size from `text-xs` to `text-sm`, improve contrast from `text-white/60` to `text-white/80`, and add explicit renewal price after trial ends.

### Privacy & Compliance

- [ ] **C-002: Add Privacy Policy link** - Create a Settings screen entry or modal that links to the privacy policy. Add URL constant and implement in-app WebView or external browser link. Required by App Store Review Guideline 5.1.

- [ ] **C-003: Add Terms of Service link** - Add Terms of Service link alongside Privacy Policy in settings. Both are required for subscription apps.

- [ ] **H-004: Disclose Sentry tracking in privacy policy** - Ensure external privacy policy document mentions error tracking via Sentry, what data is collected (crash reports, device info), and retention period.

---

## High Priority Issues

### Build Configuration

- [ ] **M-006: Update iOS bundle identifier** - Change `org.name.DailyHabits` in `app.json:21` to proper company domain format (e.g., `com.chainday.app`). Coordinate with App Store Connect app record.

- [ ] **M-007: Update Android package name** - Change `com.andres9888.dailyhabits` in `app.json:35` to match iOS bundle ID scheme for consistency.

### Code Quality

- [ ] **M-001/M-002: Wrap console.log in __DEV__ guards** - In `src/lib/purchases.ts` and `src/hooks/usePremium/usePremium.ts`, wrap all console.log statements in `if (__DEV__)` blocks to prevent production logging.

### Security

- [ ] **H-006: Add input validation for habit names** - In `src/components/CreateHabitModal/utils.ts`, add max length validation (e.g., 100 chars), character whitelist, and sanitization for habit names.

---

## Verification Checklist

After fixes are complete:

- [ ] Test purchase flow on TestFlight with sandbox account
- [ ] Verify restore purchases works on fresh install
- [ ] Confirm dynamic pricing displays correctly in all locales
- [ ] Check privacy policy link opens correctly
- [ ] Verify terms of service link opens correctly
- [ ] Run production build and verify no console.log output
- [ ] Test habit creation with edge cases (long names, special chars)

---

## Notes

- Bundle ID changes require coordination with App Store Connect - cannot change after first submission
- Privacy policy URL must be publicly accessible (no auth required)
- RevenueCat webhook is already configured in Convex backend
- Sentry is properly guarded with `__DEV__` for verbose logging
