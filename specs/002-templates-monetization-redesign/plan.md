# Implementation Plan: Templates Monetization Redesign

**Branch**: `002-templates-monetization-redesign` | **Date**: 2026-03-02 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/002-templates-monetization-redesign/spec.md`

## Summary

Redesign the Templates screen from a flat browse-and-import experience into a monetization-optimized discovery flow with usage tracking, tiered content access, and in-screen paywall conversion. The current screen uses a tab-based browse (Categories/All) with alert-based limit blocking; the redesign replaces this with a curated main screen (usage banner, featured collection, popular carousel, premium packs, category grid), slide-in sub-views (see-all, category drill-in), a light-themed preview modal, and a contextual paywall bottom sheet.

## Technical Context

**Language/Version**: TypeScript ~5.9.2, React Native 0.81.5
**Primary Dependencies**: Expo SDK 54, Convex v1.21.1-alpha.1 (backend), NativeWind/Tailwind (styling), React Native Reanimated ~4.1.1 (animations), React Native Gesture Handler ~2.28.0
**Storage**: Convex (real-time database with optimistic updates)
**Testing**: Jest ~29.7.0, @testing-library/react-native ^13.3.3, Maestro (E2E)
**Target Platform**: iOS 13+, Android 6.0+ (API 23)
**Project Type**: Mobile (React Native / Expo managed workflow)
**Performance Goals**: 60fps scrolling, <100ms interaction response, <1s initial content render
**Constraints**: 100-line max per file (ESLint enforced), 44x44pt minimum touch targets, offline-first for core features
**Scale/Scope**: ~15 existing screen files to refactor, ~8 new components, 14 template categories, 200+ templates

## Constitution Check

_GATE: Must pass before implementation._

| Principle | Status | Notes |
|-----------|--------|-------|
| I. Mobile-First | ✅ Pass | All designs target 393px phone frame, touch targets ≥44pt |
| II. TDD | ✅ Pass | Tasks include test phases before implementation |
| III. Real-Time Sync | ✅ Pass | All imports via existing Convex mutations, optimistic updates preserved |
| IV. Accessibility | ✅ Pass | testIDs defined in Maestro flow, semantic labels required per task |
| V. Performance Budget | ✅ Pass | FlatList for lists, Reanimated for animations, stagger delays match theme (60ms) |
| VI. User-Centric Design | ✅ Pass | Spec has 7 user stories with acceptance scenarios, mockup validated |
| VII. Code Quality | ✅ Pass | 100-line decomposition enforced, TypeScript strict mode |

## Project Structure

### Documentation (this feature)

```
specs/002-templates-monetization-redesign/
├── spec.md              # Feature specification (complete)
├── plan.md              # This file
├── tasks.md             # Implementation tasks (next step)
└── checklists/
    └── requirements.md  # Quality checklist (complete)
```

### Source Code (repository root)

```
src/screens/TemplatesScreen/
├── TemplatesScreen.tsx              # Main orchestration (MODIFY — add new view routing)
├── TemplatesScreen.types.ts         # Types (MODIFY — add new view state types)
├── TemplatesScreen.hooks.ts         # Hooks aggregation (MODIFY — add new hooks)
├── TemplatesScreen.animations.ts    # Animations (MODIFY — add stagger/entrance configs)
├── components/
│   ├── BrowseHeader.tsx             # (KEEP — minor styling updates)
│   ├── SearchBar.tsx                # (KEEP — add testID)
│   ├── UsageBanner/                 # NEW — free habit usage tracker
│   │   ├── index.ts
│   │   ├── UsageBanner.tsx
│   │   ├── UsageBanner.hooks.ts
│   │   └── UsageBanner.types.ts
│   ├── FeaturedCollection/          # NEW — curated featured section
│   │   ├── index.ts
│   │   └── FeaturedCollection.tsx
│   ├── PopularSection/              # NEW — section header + carousel wrapper
│   │   ├── index.ts
│   │   └── PopularSection.tsx
│   ├── PremiumPacksSection/         # NEW — premium packs carousel
│   │   ├── index.ts
│   │   ├── PremiumPacksSection.tsx
│   │   └── PremiumPackCard.tsx
│   ├── CategoryGrid/                # NEW — 2-column category tile grid
│   │   ├── index.ts
│   │   ├── CategoryGrid.tsx
│   │   └── CategoryTile.tsx
│   └── TemplateModals.tsx           # (KEEP)
├── views/
│   ├── MainBrowseView.tsx           # NEW — replaces BrowseView as curated main screen
│   ├── SeeAllView.tsx               # NEW — full list of popular templates
│   ├── CategoryDrillView.tsx        # NEW — single-category template list
│   ├── TemplatesList.tsx            # (KEEP — shared list renderer)
│   ├── FeedbackOverlays.tsx         # (MODIFY — update toast duration to 5s)
│   └── BrowseView.tsx               # REMOVE — replaced by MainBrowseView
├── hooks/
│   ├── useTemplateImportHandlers.ts # (MODIFY — replace alert with paywall trigger)
│   ├── useMainBrowseData.ts         # NEW — data aggregation for main view
│   └── useViewNavigation.ts         # NEW — slide-in view state machine

src/components/
├── MiniTemplateCard/                # (MODIFY — add testIDs, accent bar)
├── TemplateCard/                    # (MODIFY — add testIDs, accent bar, preview button)
├── FullsizeTemplatePreview/         # (MODIFY — light theme, testIDs, Quick Add)
├── TemplateAddedToast/              # (MODIFY — 5s duration, testIDs)
├── PaywallSheet/                    # NEW — in-screen paywall bottom sheet
│   ├── index.ts
│   ├── PaywallSheet.tsx
│   ├── PaywallSheet.hooks.ts
│   └── PaywallSheet.types.ts
└── PackConfirmSheet/                # NEW — pack import confirmation
    ├── index.ts
    ├── PackConfirmSheet.tsx
    └── PackConfirmSheet.types.ts
```

**Structure Decision**: Extends the existing decomposed `TemplatesScreen/` architecture. New components follow the established pattern of `ComponentName/index.ts` barrel exports with `*.hooks.ts`, `*.types.ts` splits when exceeding 100 lines. Views are co-located in `views/` following the existing `BrowseView.tsx` / `CategorySearchView.tsx` pattern.

## Key Architecture Decisions

### 1. View Navigation: Slide-in views vs. React Navigation screens

**Decision**: Slide-in views with transform-based transitions (matching the mockup).

**Rationale**: The current screen already uses `effectiveViewMode` state routing. Adding slide-in views with `Animated.View` + `translateX` keeps navigation self-contained within the screen, avoids new navigation stack complexity, and matches the 280ms spring transition in the design system.

### 2. Paywall: Custom bottom sheet vs. RevenueCat native paywall

**Decision**: Custom `PaywallSheet` component using the existing `Modal` (variant: `bottomSheet`).

**Rationale**: The existing `RevenueCatPaywall` component uses the native RevenueCat UI which doesn't match the app's design system. The redesign requires a branded paywall with specific perks, pricing display, and design tokens. The custom sheet triggers RevenueCat purchase programmatically on CTA tap (using `Purchases.purchasePackage()` directly).

### 3. Usage Banner: Local state vs. Convex query

**Decision**: Derive from existing `useTemplatesData` hook which already fetches `userHabitCount` and `isPremiumUser`.

**Rationale**: No new backend queries needed. The count is already available from the `habits` query used by the import guard logic.

### 4. Popular Templates: New query vs. sort existing

**Decision**: Sort existing templates by `popularityScore` field (already exists in schema).

**Rationale**: The `popularityScore` field exists on all templates. A client-side sort of the already-fetched template array avoids a new Convex query and maintains the existing data flow.

### 5. Premium Packs: Data source

**Decision**: Define pack configurations as a static data file (`src/screens/TemplatesScreen/data/premiumPacks.ts`), referencing existing template categories.

**Rationale**: Packs are curated editorial groupings that change infrequently. Static configuration avoids backend schema changes and keeps the feature self-contained. Future iteration could move to Convex if dynamic pack management is needed.

## Complexity Tracking

_No constitution violations. All principles satisfied._
