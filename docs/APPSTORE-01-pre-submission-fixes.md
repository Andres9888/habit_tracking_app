# App Store Pre-Submission Fixes - Phase 01

**Created:** 2026-01-27
**Updated:** 2026-02-01
**Priority:** CRITICAL - Blocking App Store submission
**Audit Source:** Production readiness audit

---

## Critical Issues (Must Fix)

### RevenueCat & IAP

- [x] **C-001: Fix hardcoded $6.99 pricing** - ✅ PR #203 - Now uses dynamic `priceString` from `usePremium()` hook with loading state and fallback.

- [x] **H-001: Implement Restore Purchases** - ✅ PR #201 - Connected to `usePremium().restorePurchases()` with loading state, success/error alerts, and haptic feedback.

- [x] **H-002: Improve subscription terms visibility** - ✅ PR #203 - Increased to `text-sm`, improved contrast to `text-white/80`, added explicit renewal price after trial.

### Privacy & Compliance

- [x] **C-002: Add Privacy Policy link** - ✅ Already implemented in SettingsModal/AccountSection.tsx with link to GitHub Pages hosted policy.

- [x] **C-003: Add Terms of Service link** - ✅ Already implemented in SettingsModal alongside Privacy Policy link.

- [ ] **H-004: Disclose Sentry tracking in privacy policy** - Ensure external privacy policy document mentions error tracking via Sentry, what data is collected (crash reports, device info), and retention period.

---

## High Priority Issues

### Build Configuration

- [ ] **M-006: Update iOS bundle identifier** - Change `org.name.DailyHabits` in `app.json:21` to proper company domain format (e.g., `com.chainday.app`). Coordinate with App Store Connect app record.

- [ ] **M-007: Update Android package name** - Change `com.andres9888.dailyhabits` in `app.json:35` to match iOS bundle ID scheme for consistency.

### Code Quality

- [x] **M-001/M-002: Wrap console.log in **DEV** guards** - ✅ PRs #202, #204 - Wrapped console statements in `purchases.ts`, `usePremium.ts`, and many other files.

### Security

- [x] **H-006: Add input validation for habit names** - ✅ Already implemented - 50 char max length enforced in CreateHabitModal components.

---

## Verification Checklist

After fixes are complete:

- [ ] Test purchase flow on TestFlight with sandbox account
- [ ] Verify restore purchases works on fresh install
- [ ] Confirm dynamic pricing displays correctly in all locales
- [x] Check privacy policy link opens correctly
- [x] Verify terms of service link opens correctly
- [ ] Run production build and verify no console.log output
- [x] Test habit creation with edge cases (long names, special chars)

---

## Notes

- Bundle ID changes require coordination with App Store Connect - cannot change after first submission
- Privacy policy URL must be publicly accessible (no auth required)
- RevenueCat webhook is already configured in Convex backend
- Sentry is properly guarded with `__DEV__` for verbose logging

---

## Progress Summary

**Completed:** 8/10 issues
**Remaining:**

- H-004: Sentry disclosure in privacy policy (external doc update)
- M-006/M-007: Bundle ID updates (requires App Store Connect coordination)
