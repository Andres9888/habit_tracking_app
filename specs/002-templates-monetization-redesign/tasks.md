# Tasks: Templates Monetization Redesign

**Input**: Design documents from `/specs/002-templates-monetization-redesign/`
**Prerequisites**: plan.md (complete), spec.md (complete)
**Maestro Flow**: `.maestro/templates-monetization-redesign.yaml`

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1–US7)
- Exact file paths included in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: New shared components and data files that multiple user stories depend on.

- [ ] T001 [P] Create premium packs static data file at `src/screens/TemplatesScreen/data/premiumPacks.ts` — define 3–4 curated packs with name, description, emoji group, background gradient, and list of habit references (category + index)
- [ ] T002 [P] Create paywall perks static data file at `src/screens/TemplatesScreen/data/paywallPerks.ts` — define benefit items with emoji, label, and icon background color
- [ ] T003 [P] Create category colors/metadata map at `src/screens/TemplatesScreen/data/categoryMeta.ts` — consolidate existing `categoryColors.ts` dark-mode palette into a unified metadata map (icon, name, bg color, text color, premium flag) used by CategoryGrid and CategoryDrillView
- [ ] T004 [P] Create `useViewNavigation` hook at `src/screens/TemplatesScreen/hooks/useViewNavigation.ts` — manages view state machine: `main | seeAll | category | search` with `activeView`, `openSeeAll()`, `closeSeeAll()`, `openCategory(id)`, `closeCategory()`, and Reanimated shared transition values for 280ms slide animations
- [ ] T005 [P] Add testIDs to `SearchBar.tsx` at `src/screens/TemplatesScreen/components/SearchBar.tsx` — add `testID="templates-search-bar"` to wrapper and `testID="templates-search-clear"` to clear button

**Checkpoint**: Shared data and navigation infrastructure ready for view implementation.

---

## Phase 2: User Story 1 — Browse and Add a Free Template (P1) 🎯 MVP

**Goal**: Free user can see usage banner, popular carousel, and add a template with toast + confetti feedback.

**Independent Test**: Navigate to Templates → see usage banner → scroll popular → tap "+ Add" → verify toast and usage update.

### Implementation

- [ ] T006 [US1] Create `UsageBanner` component at `src/screens/TemplatesScreen/components/UsageBanner/UsageBanner.tsx` — displays "{N} of 3 free habits used" with dot indicators (filled/empty), derives count from existing `useTemplatesData` hook (`userHabitCount`, `isPremiumUser`). Add `testID="templates-usage-banner"`, `testID="templates-usage-dots"`, `testID="templates-usage-unlock-cta"`. Premium users see no banner.
- [ ] T007 [P] [US1] Create `UsageBanner.hooks.ts` at `src/screens/TemplatesScreen/components/UsageBanner/UsageBanner.hooks.ts` — `useUsageBanner(userHabitCount, isPremiumUser)` returns `{ used, limit, dots[], showBanner, showUnlockCta }`
- [ ] T008 [P] [US1] Create `UsageBanner.types.ts` and `index.ts` barrel at `src/screens/TemplatesScreen/components/UsageBanner/`
- [ ] T009 [US1] Create `FeaturedCollection` component at `src/screens/TemplatesScreen/components/FeaturedCollection/FeaturedCollection.tsx` — renders a featured card with shimmer animation, badge, title (Literata 17px/700), description, habit chips, user count, and CTA button. Add `testID="templates-featured-collection"`.
- [ ] T010 [US1] Create `PopularSection` component at `src/screens/TemplatesScreen/components/PopularSection/PopularSection.tsx` — renders section header ("Popular" + "See all" link) and horizontal FlatList of `MiniTemplateCard` items. Add `testID="templates-popular-section"`, `testID="templates-popular-see-all"`, `testID="templates-popular-scroll"`.
- [ ] T011 [US1] Modify `MiniTemplateCard` at `src/components/MiniTemplateCard/MiniTemplateCard.tsx` — add 3px accent bar at top, add testIDs `testID="templates-popular-card-{index}-add"` and `testID="templates-popular-card-{index}-added"` (accept `index` prop). Ensure "✓ Added" state is non-interactive.
- [ ] T012 [US1] Modify `TemplateAddedToast` at `src/components/TemplateAddedToast/TemplateAddedToast.tsx` — change toast duration to 5000ms (currently 3000ms in FeedbackOverlays). Add `testID="templates-toast"`, `testID="templates-toast-name"`, `testID="templates-toast-sub"`.
- [ ] T013 [US1] Create `MainBrowseView` at `src/screens/TemplatesScreen/views/MainBrowseView.tsx` — orchestrates: BrowseHeader → SearchBar → UsageBanner → FeaturedCollection → PopularSection → PremiumPacksSection → CategoryGrid. Uses staggered entrance animations (60ms per section via Reanimated `FadeInDown.delay(index * 60).duration(280)`).
- [ ] T014 [US1] Create `useMainBrowseData` hook at `src/screens/TemplatesScreen/hooks/useMainBrowseData.ts` — aggregates data for MainBrowseView: `popularTemplates` (sorted by popularityScore, top 10), `premiumPacks` (from static data), `categories` (from existing query), `userHabitCount`, `isPremiumUser`.
- [ ] T015 [US1] Modify `TemplatesScreen.tsx` at `src/screens/TemplatesScreen/TemplatesScreen.tsx` — replace `BrowseView` routing with `MainBrowseView` as default, integrate `useViewNavigation` for view switching.

**Checkpoint**: Main screen renders with usage banner, featured collection, and popular carousel. User can add a free template and see toast feedback.

---

## Phase 3: User Story 2 — Explore Categories and Preview a Template (P1)

**Goal**: User can tap a category tile, see filtered templates, preview a template in light-themed modal, and Quick Add from preview.

**Independent Test**: Tap category tile → see drill-in view → tap Preview → see light modal → tap Quick Add → verify import.

### Implementation

- [ ] T016 [US2] Create `CategoryGrid` component at `src/screens/TemplatesScreen/components/CategoryGrid/CategoryGrid.tsx` — renders 2-column grid of `CategoryTile` items. Add `testID="templates-category-grid"`.
- [ ] T017 [P] [US2] Create `CategoryTile` component at `src/screens/TemplatesScreen/components/CategoryGrid/CategoryTile.tsx` — renders tile with category bg color, icon, name, template count, optional "PRO" badge. Add `testID="templates-category-tile-{index}"`. Touch target ≥44pt.
- [ ] T018 [US2] Create `CategoryDrillView` at `src/screens/TemplatesScreen/views/CategoryDrillView.tsx` — slide-in view (translateX 100% → 0, 280ms) with sticky header (back button, category icon + name, template count + science count), and `TemplateCard` list. Add `testID="templates-category-view"`, `testID="templates-category-back"`, `testID="templates-category-view-title"`.
- [ ] T019 [US2] Modify `TemplateCard` at `src/components/TemplateCard/TemplateCardRender.tsx` — add 4px accent bar (left edge), "Preview" button, testIDs: `testID="templates-category-card-{index}-preview"`, `testID="templates-category-card-{index}-add"`. Ensure name renders at heading3 (20px/700).
- [ ] T020 [US2] Modify `FullsizeTemplatePreview` at `src/components/FullsizeTemplatePreview/FullsizeTemplatePreview.tsx` — switch to light theme (background #FAFAF9, dark text), add pull indicator (40px × 4px), hero icon 96×96 r24, template name 28px/800 DM Sans, frequency/duration pills, science box (green #f0fdf4 / #bbf7d0), tips box (yellow #fefce8 / #fef08a). Add "Quick Add" button (h56, r16, 17px/700). Add testIDs: `testID="templates-preview-modal"`, `testID="templates-preview-handle"`, `testID="templates-preview-close"`, `testID="templates-preview-icon"`, `testID="templates-preview-name"`, `testID="templates-preview-pills"`, `testID="templates-preview-quick-add"`, `testID="templates-preview-added"`, `testID="templates-preview-customize"`.
- [ ] T021 [US2] Wire category drill-in navigation — in `MainBrowseView`, `CategoryTile.onPress` calls `useViewNavigation.openCategory(categoryId)`. In `TemplatesScreen.tsx`, render `CategoryDrillView` as an overlay `Animated.View` controlled by view navigation state.

**Checkpoint**: Category grid → drill-in → preview → Quick Add flow is fully functional.

---

## Phase 4: User Story 4 — Hit Free Limit and See Paywall (P1)

**Goal**: When free user hits 3-habit limit, paywall bottom sheet appears instead of alert.

**Independent Test**: Simulate 3 habits → tap "+ Add" → verify paywall appears with pricing and perks.

### Implementation

- [ ] T022 [US4] Create `PaywallSheet` component at `src/components/PaywallSheet/PaywallSheet.tsx` — bottom sheet modal (borderTopRadius 24px) with: pull indicator, close button, emoji header, headline "Unlock Unlimited Habits", description, perks list (from paywallPerks.ts data), CTA button "Upgrade to Premium" (h56, r12, accent green), "$6.99/month · Cancel anytime" sub-text. Add testIDs: `testID="templates-paywall"`, `testID="templates-paywall-close"`, `testID="templates-paywall-cta"`.
- [ ] T023 [P] [US4] Create `PaywallSheet.hooks.ts` at `src/components/PaywallSheet/PaywallSheet.hooks.ts` — `usePaywallSheet()` manages open/close state, handles RevenueCat `Purchases.purchasePackage()` call on CTA tap, success/error callbacks.
- [ ] T024 [P] [US4] Create `PaywallSheet.types.ts` and `index.ts` barrel at `src/components/PaywallSheet/`
- [ ] T025 [US4] Modify `useTemplateImportHandlers.ts` at `src/screens/TemplatesScreen/hooks/useTemplateImportHandlers.ts` — replace `showLimitReachedAlert()` call with `onShowPaywall()` callback prop. The alert-based blocking is replaced by opening the PaywallSheet.
- [ ] T026 [US4] Wire paywall into `TemplatesScreen.tsx` — add `PaywallSheet` render with visibility state, pass `onShowPaywall` through to import handlers.

**Checkpoint**: Free users hitting the limit see a branded paywall instead of a system alert.

---

## Phase 5: User Story 3 — See All Popular Templates (P2)

**Goal**: User can tap "See all" to view full popular template list with persistent added states.

**Independent Test**: Add a template from carousel → tap "See all" → verify added state persists in list view.

### Implementation

- [ ] T027 [US3] Create `SeeAllView` at `src/screens/TemplatesScreen/views/SeeAllView.tsx` — slide-in view with sticky header (back button, "All Popular Templates", "{N} templates · sorted by popularity"), FlatList of `TemplateCard` items with staggered entrance (60ms). Add testIDs: `testID="templates-see-all-view"`, `testID="templates-see-all-back"`, `testID="templates-see-all-card-{index}-add"`, `testID="templates-see-all-card-{index}-added"`.
- [ ] T028 [US3] Wire "See all" navigation — `PopularSection` "See all" button calls `useViewNavigation.openSeeAll()`. In `TemplatesScreen.tsx`, render `SeeAllView` as overlay controlled by view navigation state. Ensure `importedTemplateIds` set is shared across all views for consistent added state.

**Checkpoint**: See all view functional with cross-view state persistence.

---

## Phase 6: User Story 5 — Premium Packs Section (P2)

**Goal**: Free users see aspirational premium pack cards that trigger the paywall on tap.

**Independent Test**: Scroll to Premium Packs → tap a pack → verify paywall opens.

### Implementation

- [ ] T029 [US5] Create `PremiumPackCard` component at `src/screens/TemplatesScreen/components/PremiumPacksSection/PremiumPackCard.tsx` — renders card with gradient background, lock icon, grouped emoji icons, pack name (17px/700), description (13px), "🔓 Unlock Pack" CTA (purple accent). Add `testID="templates-premium-pack-{index}"`.
- [ ] T030 [US5] Create `PremiumPacksSection` component at `src/screens/TemplatesScreen/components/PremiumPacksSection/PremiumPacksSection.tsx` — section header ("Premium Packs" + PRO badge) and horizontal FlatList of PremiumPackCard items. Add `testID="templates-premium-packs-section"`. On card tap, call `onShowPaywall()`.
- [ ] T031 [US5] Wire premium packs into `MainBrowseView` — insert PremiumPacksSection between PopularSection and CategoryGrid, pass paywall trigger.

**Checkpoint**: Premium packs section renders and triggers paywall on tap.

---

## Phase 7: User Story 6 — Pack Confirmation for Premium Users (P3)

**Goal**: Premium users can add entire packs with animated confirmation flow.

**Independent Test**: (Requires premium account) Tap premium pack → see pack confirmation → tap "Add All" → verify sequential checkmarks and bulk import.

### Implementation

- [ ] T032 [US6] Create `PackConfirmSheet` component at `src/components/PackConfirmSheet/PackConfirmSheet.tsx` — bottom sheet with: pull indicator, pack title, "{N} habits will be added" description, habit list (emoji + name + frequency per row with checkmark), "Cancel" / "Add All {N}" buttons. Animated sequential checkmarks (200ms stagger). Add testIDs: `testID="templates-pack-confirm"`, `testID="templates-pack-confirm-add-all"`, `testID="templates-pack-confirm-cancel"`, `testID="templates-pack-confirm-item-{index}"`, `testID="templates-pack-confirm-check-{index}"`.
- [ ] T033 [P] [US6] Create `PackConfirmSheet.types.ts` and `index.ts` barrel at `src/components/PackConfirmSheet/`
- [ ] T034 [US6] Wire pack confirmation — in PremiumPacksSection, premium users tap pack → `PackConfirmSheet` opens (instead of paywall). On "Add All" confirm, iterate pack habits, call import mutation for each, show animated checkmarks, then close and show summary toast.

**Checkpoint**: Premium pack confirmation flow works end-to-end.

---

## Phase 8: User Story 7 — Search Templates (P3)

**Goal**: User can search templates by name across all categories.

**Independent Test**: Tap search → type query → verify filtered results appear → clear search → verify main view restores.

### Implementation

- [ ] T035 [US7] Modify SearchBar to trigger view navigation — when search query is non-empty, call `useViewNavigation` to switch to search mode. When cleared, restore main view. Add `testID="templates-search-results"` to search results container in existing `CategorySearchView`.
- [ ] T036 [US7] Ensure search results use updated `TemplateCard` with accent bars and testIDs from T019.

**Checkpoint**: Search flow works with new card design.

---

## Phase 9: Polish & Cross-Cutting Concerns

**Purpose**: Animations, accessibility, cleanup.

- [ ] T037 [P] Add accessibility labels to all new components — ensure every Pressable has `accessibilityLabel`, `accessibilityRole`, and `accessibilityHint` per constitution requirement IV.
- [ ] T038 [P] Add staggered entrance animations to all list views — CategoryDrillView, SeeAllView, and MainBrowseView sections use `FadeInDown.delay(index * 60).duration(280)` from Reanimated entering animations.
- [ ] T039 [P] Remove old `BrowseView.tsx` and related files — delete `src/screens/TemplatesScreen/views/BrowseView.tsx`, `BrowseView.types.ts`, `BrowseCategoriesTab.tsx`, `BrowseAllTab.tsx` after MainBrowseView is verified working. Update imports.
- [ ] T040 [P] Update `FeedbackOverlays.tsx` toast duration — change error toast `duration={3000}` to match success toast behavior. Verify success toast uses 5000ms from T012.
- [ ] T041 Verify all new files are ≤100 lines — run `npm run lint:max-lines` and decompose any violations following patterns in `docs/DECOMPOSITION_PATTERNS.md`.
- [ ] T042 Run Maestro E2E flow — execute `.maestro/templates-monetization-redesign.yaml` against simulator and verify all 12 phases pass. Fix any testID mismatches.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Setup)**: No dependencies — start immediately
- **Phase 2 (US1 Browse+Add)**: Depends on T001–T005 from Phase 1
- **Phase 3 (US2 Categories+Preview)**: Depends on Phase 2 (MainBrowseView must exist)
- **Phase 4 (US4 Paywall)**: Depends on Phase 2 (import handlers must exist) — can run parallel with Phase 3
- **Phase 5 (US3 See All)**: Depends on Phase 2 (PopularSection must exist)
- **Phase 6 (US5 Premium Packs)**: Depends on Phase 4 (PaywallSheet must exist)
- **Phase 7 (US6 Pack Confirm)**: Depends on Phase 6 (PremiumPacksSection must exist)
- **Phase 8 (US7 Search)**: Depends on Phase 2 (MainBrowseView routing must exist)
- **Phase 9 (Polish)**: Depends on all prior phases

### Parallel Opportunities

```
Phase 1: T001 ─┬─ T002 ─┬─ T003 ─┬─ T004 ─┬─ T005  (all parallel)
               │        │        │        │
Phase 2: ──────┴────────┴────────┴────────┘
         T006 → T007+T008 (parallel) → T009+T010 (parallel) → T011+T012 (parallel) → T013 → T014 → T015

Phase 3: T016 → T017 (parallel) → T018 → T019 → T020 → T021
Phase 4: T022 → T023+T024 (parallel) → T025 → T026         ← can run parallel with Phase 3
Phase 5: T027 → T028
Phase 6: T029 → T030 → T031
Phase 7: T032 → T033 (parallel) → T034
Phase 8: T035 → T036
Phase 9: T037+T038+T039+T040 (all parallel) → T041 → T042
```

### Critical Path

T001–T005 → T006–T015 (MainBrowseView) → T022–T026 (Paywall) → T029–T031 (Premium Packs) → T042 (E2E)

---

## Implementation Strategy

### MVP First (User Story 1 Only — Phase 1 + Phase 2)

1. Complete Phase 1: Setup (data files, navigation hook, testIDs)
2. Complete Phase 2: UsageBanner + FeaturedCollection + PopularSection + MainBrowseView
3. **STOP and VALIDATE**: Free user can browse and add a template with toast feedback
4. Run Maestro phases 1–4 subset

### Incremental Delivery

1. Phase 1 + 2 → MVP: Browse + Add ✓
2. Phase 3 → Categories + Preview ✓
3. Phase 4 → Paywall (monetization live) ✓
4. Phase 5 → See All ✓
5. Phase 6 + 7 → Premium Packs ✓
6. Phase 8 → Search ✓
7. Phase 9 → Polish + E2E ✓

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- All new components must include testIDs from the Maestro inventory (`.maestro/templates-monetization-redesign.yaml`)
- All files must stay ≤100 lines (ESLint enforced)
- Touch targets ≥44pt per constitution requirement
- Animations use Reanimated entering/exiting modifiers, not manual `Animated.Value`
- The existing `TemplatePreviewModal` (customize flow) is preserved and launched from the preview modal's "Customize" button
