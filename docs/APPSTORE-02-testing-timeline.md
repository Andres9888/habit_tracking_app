# App Store Testing Timeline

**Created:** 2026-01-27
**Goal:** Ship to App Store
**Value Driver:** Revenue activation - can't monetize until live

---

## Quick Reference: Task Attributes

| Symbol | Meaning |
|--------|---------|
| ⏱️ | Time estimate |
| ⚡ | Energy level (L=Low, M=Medium, H=High) |
| 📍 | Context (where/what you need) |
| 💰 | Value type (Revenue/Growth/Maintenance) |
| 🎯 | Goal alignment |

---

## Phase 1: Pre-TestFlight Fixes (BLOCKING)

Must complete before any testing can begin.

### Day 1: Critical Code Fixes

- [ ] **C-001: Fix hardcoded pricing**
  - ⏱️ 15 min | ⚡ M | 📍 @computer | 💰 Revenue | 🎯 App Store compliance
  - Replace `$6.99` with `priceString` in PricingCard.tsx and CTAFooter.tsx
  - Test with loading state (show skeleton while fetching)

- [ ] **H-001: Implement Restore Purchases**
  - ⏱️ 30 min | ⚡ M | 📍 @computer | 💰 Revenue | 🎯 App Store requirement
  - Connect button to `usePremium().restorePurchases()`
  - Add Alert feedback for success/failure
  - Add haptic feedback

- [ ] **H-002: Subscription terms visibility**
  - ⏱️ 15 min | ⚡ L | 📍 @computer | 💰 Revenue | 🎯 App Store guideline 3.1.1
  - Increase font size, improve contrast
  - Add "then $X.XX/month" after trial text

### Day 1-2: Privacy & Legal

- [ ] **C-002: Create Privacy Policy page**
  - ⏱️ 2 hr | ⚡ H | 📍 @computer | 💰 Revenue | 🎯 App Store requirement
  - Draft privacy policy covering: data collected, Sentry, analytics, Clerk auth
  - Host on web (Notion public page works)
  - Add link in Settings screen

- [ ] **C-003: Create Terms of Service**
  - ⏱️ 1 hr | ⚡ M | 📍 @computer | 💰 Revenue | 🎯 App Store requirement
  - Include subscription terms, refund policy, usage restrictions
  - Host alongside privacy policy
  - Add link in Settings screen

---

## Phase 2: Local Testing (Before TestFlight)

### Day 2-3: Unit Test Coverage

- [ ] **Add usePremium hook tests** (copy from worktree if available)
  - ⏱️ 30 min | ⚡ M | 📍 @computer | 💰 Maintenance | 🎯 Stability
  - Test: loading states, error handling, package selection
  - Mock RevenueCat SDK responses

- [ ] **Add paywall component tests**
  - ⏱️ 30 min | ⚡ M | 📍 @computer | 💰 Maintenance | 🎯 Stability
  - Test: renders correctly, button states, accessibility
  - Test: displays dynamic price correctly

- [ ] **Run full test suite**
  - ⏱️ 5 min | ⚡ L | 📍 @computer | 💰 Maintenance | 🎯 Stability
  - `npm test` - verify no regressions
  - Fix any failing tests

### Day 3: Build Verification

- [ ] **Production build (iOS)**
  - ⏱️ 15 min | ⚡ L | 📍 @computer-mac | 💰 Revenue | 🎯 Submission
  - `eas build --platform ios --profile production`
  - Verify no build errors

- [ ] **Production build (Android)**
  - ⏱️ 15 min | ⚡ L | 📍 @computer | 💰 Growth | 🎯 Future Android launch
  - `eas build --platform android --profile production`
  - Optional but good to verify

---

## Phase 3: TestFlight Testing (Critical Path)

### Day 4-5: Internal Testing

- [ ] **Upload to TestFlight**
  - ⏱️ 30 min | ⚡ L | 📍 @computer-mac | 💰 Revenue | 🎯 Submission
  - Submit build via EAS or Xcode
  - Wait for processing (~15-30 min)

- [ ] **Sandbox purchase test - Happy path**
  - ⏱️ 30 min | ⚡ H | 📍 @iphone + sandbox-account | 💰 Revenue | 🎯 Critical
  - Create sandbox tester in App Store Connect
  - Complete full purchase flow
  - Verify premium unlocks immediately
  - Verify webhook fires (check Convex logs)

- [ ] **Sandbox purchase test - Restore flow**
  - ⏱️ 15 min | ⚡ M | 📍 @iphone + sandbox-account | 💰 Revenue | 🎯 Critical
  - Uninstall app, reinstall
  - Tap "Restore Purchases"
  - Verify premium status restored

- [ ] **Sandbox purchase test - Edge cases**
  - ⏱️ 30 min | ⚡ H | 📍 @iphone + sandbox-account | 💰 Revenue | 🎯 Critical
  - Cancel during purchase - app should handle gracefully
  - Network error simulation
  - Test with non-premium account (should show paywall)

### Day 5-6: Feature Testing on Device

- [ ] **Core habit tracking flow**
  - ⏱️ 15 min | ⚡ M | 📍 @iphone | 💰 Maintenance | 🎯 Quality
  - Create habit, complete it, view streak
  - Verify data syncs to Convex

- [ ] **Premium feature gating**
  - ⏱️ 15 min | ⚡ M | 📍 @iphone | 💰 Revenue | 🎯 Monetization
  - Without premium: verify paywall shows at limit
  - With premium: verify full access

- [ ] **Offline behavior**
  - ⏱️ 15 min | ⚡ M | 📍 @iphone-airplane-mode | 💰 Maintenance | 🎯 Quality
  - Complete habits offline
  - Reconnect - verify sync

- [ ] **Notifications**
  - ⏱️ 15 min | ⚡ L | 📍 @iphone | 💰 Growth | 🎯 Retention
  - Schedule reminder
  - Verify notification arrives
  - Tap notification - verify deep link

---

## Phase 4: Final Submission Prep

### Day 6-7: App Store Assets

- [ ] **App Store screenshots (6.5" iPhone)**
  - ⏱️ 1 hr | ⚡ M | 📍 @computer + simulator | 💰 Revenue | 🎯 Conversion
  - 5-10 screenshots showing key features
  - Use iPhone 14 Pro Max simulator

- [ ] **App Store screenshots (5.5" iPhone)**
  - ⏱️ 30 min | ⚡ L | 📍 @computer + simulator | 💰 Revenue | 🎯 Conversion
  - Same screenshots, smaller device
  - iPhone 8 Plus simulator

- [ ] **App description & keywords**
  - ⏱️ 30 min | ⚡ M | 📍 @computer | 💰 Revenue | 🎯 Discovery
  - Write compelling description
  - Research ASO keywords

- [ ] **App preview video (optional)**
  - ⏱️ 2 hr | ⚡ H | 📍 @computer + video-tools | 💰 Growth | 🎯 Conversion
  - 15-30 second demo video
  - Can skip for v1.0

### Day 7: Submission

- [ ] **Complete App Store Connect questionnaire**
  - ⏱️ 30 min | ⚡ M | 📍 @computer | 💰 Revenue | 🎯 Compliance
  - Export compliance (encryption)
  - Age rating
  - Content rights

- [ ] **Submit for review**
  - ⏱️ 15 min | ⚡ L | 📍 @computer | 💰 Revenue | 🎯 LAUNCH
  - Final review of all assets
  - Submit!

---

## Timeline Summary

| Phase | Duration | Energy Profile | Value |
|-------|----------|----------------|-------|
| **Phase 1: Fixes** | 1-2 days | Medium-High | 💰 Unblocks revenue |
| **Phase 2: Local Testing** | 1 day | Medium | 🛡️ Prevents rejection |
| **Phase 3: TestFlight** | 2-3 days | High (device testing) | 💰 Validates purchase flow |
| **Phase 4: Submission** | 1-2 days | Medium | 💰 Launch! |

**Total estimated: 5-8 days** (depending on review cycles and issues found)

---

## Daily Energy Planning

### High Energy Days (Morning Focus)
- Sandbox purchase testing
- Privacy policy drafting
- Bug fixing from test findings

### Low Energy Days (Afternoon/Evening)
- Build uploads
- Screenshot capture
- App Store Connect forms
- Test suite runs

### Context Requirements

| Context | Tasks |
|---------|-------|
| @computer-mac | iOS builds, Xcode, TestFlight |
| @iphone + sandbox | Purchase testing (CRITICAL) |
| @computer | Everything else |
| @anywhere | App Store description writing, policy review |

---

## Value Alignment Tracker

**Revenue-Driving Tasks (Do First):**
1. Fix pricing display → Users see real price
2. Implement restore → Required for approval
3. Sandbox testing → Validates money flow
4. Submit to App Store → Unlocks revenue

**Growth Tasks (Do After Launch):**
1. App preview video
2. ASO optimization
3. Android build

**Maintenance Tasks (Ongoing):**
1. Test coverage
2. Bug fixes from testing

---

## Blockers & Dependencies

```
Privacy Policy URL ──┐
                     ├──► TestFlight upload
Terms of Service URL ┘

Pricing fix ──────────┐
Restore purchases ────┼──► Sandbox testing
Subscription terms ───┘

Sandbox testing pass ───► App Store submission
```

---

## Quick Start Tomorrow

If you have **2 hours** and **medium energy**:
1. [ ] Fix hardcoded pricing (15 min)
2. [ ] Implement restore purchases (30 min)
3. [ ] Fix subscription terms visibility (15 min)
4. [ ] Start drafting privacy policy (60 min)

This unblocks TestFlight testing for Day 3.
