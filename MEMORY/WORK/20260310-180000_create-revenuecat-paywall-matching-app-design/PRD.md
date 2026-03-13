---
task: Create RevenueCat paywall matching app design
slug: 20260310-180000_create-revenuecat-paywall-matching-app-design
effort: extended
phase: verify
progress: 26/26
mode: interactive
started: 2026-03-10T18:00:00-08:00
updated: 2026-03-10T18:01:00-08:00
---

## Context

Andres wants a custom RevenueCat paywall that feels native to the habit tracking app's "Warm Minimal" design system. The existing paywall components (BenefitsVariant, BlurOverlayVariant) use hardcoded white/stone Tailwind classes and ad-hoc colors rather than the app's theme tokens (forest green primary, premium purple, Literata serif headings, DM Sans body, warm stone backgrounds, 8px grid). The new paywall should be a single, polished design that replaces the existing variants while reusing the `usePremiumPaywall` hook infrastructure for RevenueCat purchase logic.

### Risks
- RevenueCat SDK may not have offerings configured, need graceful loading/empty states
- Plan toggle (monthly/annual) needs real packages from RevenueCat — fallback needed
- File decomposition required to stay within 100-line limit per project rules
- Must not break existing premium feature lock triggers that show paywall
- Font loading race condition if Literata not ready when paywall opens
- Existing callers pass variant prop — new design must remain backward-compatible

## Criteria

- [x] ISC-1: Paywall renders inside React Native Modal component
- [x] ISC-2: Modal uses pageSheet presentation on iOS
- [x] ISC-3: Close button in header with 44px minimum hit target
- [x] ISC-4: Hero section displays premium crown/sparkle icon
- [x] ISC-5: Hero title uses Literata serif font family
- [x] ISC-6: Hero subtitle uses DM Sans font family
- [x] ISC-7: At least 4 premium feature items displayed in list
- [x] ISC-8: Each feature item shows icon, title, and description
- [x] ISC-9: Feature icons use premium purple (#7B52C4) accent color
- [x] ISC-10: Monthly plan option displayed with price from RevenueCat
- [x] ISC-11: Annual plan option displayed with price from RevenueCat
- [x] ISC-12: Selected plan visually highlighted with border accent
- [x] ISC-13: Annual plan shows savings badge relative to monthly
- [x] ISC-14: CTA button uses forest green gradient (#047857 → #059669)
- [x] ISC-15: CTA text reflects selected plan context
- [x] ISC-16: Button press triggers haptic feedback
- [x] ISC-17: Tapping CTA calls purchasePackage via usePremium hook
- [x] ISC-18: Loading/processing state shown during purchase
- [x] ISC-19: Restore purchases link visible and functional
- [x] ISC-20: Background uses warm stone palette from theme
- [x] ISC-21: Spacing follows 8px grid system throughout
- [x] ISC-22: Border radii match theme (16px cards, 12px buttons)
- [x] ISC-23: Text colors use theme text.primary/secondary/tertiary tokens
- [x] ISC-24: All component files ≤100 lines per project rules
- [x] ISC-A1: No hardcoded price strings displayed to user
- [x] ISC-A2: No blue/indigo colors used anywhere in paywall

## Decisions

- Create `src/components/RevenueCatPaywall/` (new folder) — component already wired in HabitsAppOverlays
- Props: `visible`, `onClose`, `onPurchaseSuccess`, `onRestoreSuccess` (per existing lazy import)
- Reuse `usePremium` hook for RevenueCat data, create local hook for paywall-specific logic
- All theme tokens from `src/theme/` (typography, spacing, colors/core, animations)

### Plan
```
src/components/RevenueCatPaywall/
├── index.ts                     # Barrel export
├── RevenueCatPaywall.tsx         # Modal + layout orchestrator
├── PaywallHeader.tsx             # Drag indicator + close button
├── PaywallHero.tsx               # Crown icon + title + subtitle
├── PaywallFeatureList.tsx        # Feature items container
├── PaywallFeatureItem.tsx        # Single feature row
├── PaywallPlanSelector.tsx       # Monthly/Annual cards
├── PaywallPlanCard.tsx           # Individual plan card
├── PaywallCTA.tsx                # Green gradient CTA + sub-text
├── PaywallRestoreLink.tsx        # Restore purchases link
├── useRevenueCatPaywall.ts       # Local paywall hook (purchase logic)
├── paywall.constants.ts          # Feature data
└── paywall.types.ts              # TypeScript interfaces
```

## Verification

- ISC-1: `RevenueCatPaywall.tsx:50` — `<Modal>` wraps entire paywall
- ISC-2: `RevenueCatPaywall.tsx:53` — `presentationStyle="pageSheet"`
- ISC-3: `PaywallHeader.tsx:42` — `hitSlop={8}` on 32px button = 48px total
- ISC-4: `PaywallHero.tsx:27` — Sparkle emoji (✨) in purple-tinted circle
- ISC-5: `PaywallHero.tsx:34` — `fontFamily: fontFamilies.primary.display` (Literata)
- ISC-6: `PaywallHero.tsx:50` — `fontFamily: fontFamilies.primary.text` (DM Sans)
- ISC-7: `paywall.constants.ts` — 6 features in PAYWALL_FEATURES array
- ISC-8: `PaywallFeatureItem.tsx` — emoji + title Text + description Text
- ISC-9: `PaywallFeatureItem.tsx:26` — `backgroundColor: ${colors.premium[400]}12`
- ISC-10: `PaywallPlanCard.tsx:15` — `pkg?.product.priceString` for monthly
- ISC-11: `PaywallPlanCard.tsx:15` — same for annual via PaywallPlanSelector
- ISC-12: `PaywallPlanCard.tsx:25` — `borderColor: colors.primary[600]` when selected
- ISC-13: `PaywallPlanCard.tsx:34-56` — savings badge with `Save {savingsPercent}%`
- ISC-14: `PaywallCTA.tsx:36` — `colors={[colors.primary[700], colors.primary[600]]}`
- ISC-15: `RevenueCatPaywall.tsx:47` — `Start Free Trial — Annual/Monthly`
- ISC-16: `useRevenueCatPaywall.ts` — `triggerSelection()` on plan change + purchase
- ISC-17: `usePaywallActions.ts:27` — `purchasePackage(selectedPackage)`
- ISC-18: `PaywallCTA.tsx:49` — `ActivityIndicator` when `isProcessing`
- ISC-19: `PaywallRestoreLink.tsx` — Pressable "Restore Purchases" with handler
- ISC-20: `RevenueCatPaywall.tsx:58` — `backgroundColor: colors.background` (#F5F1ED)
- ISC-21: All spacing values from `spacing` constant (8px grid multiples)
- ISC-22: `borderRadius.large` (16px) on cards, `borderRadius.button` (12px) on CTA
- ISC-23: `colors.text.primary/secondary/tertiary` used throughout all components
- ISC-24: All files ≤93 lines (verified via `wc -l`)
- ISC-A1: All prices from `pkg?.product.priceString` — '...' shown only when loading
- ISC-A2: grep confirmed zero blue/indigo colors in paywall files
