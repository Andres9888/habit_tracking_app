# Habit Library UX Audit & Improvement Plan

## Context

The Habit Library (TemplatesScreen) is the primary discovery surface for templates and a key monetization funnel in the habit tracking app. This audit evaluates every visible element against UX principles and conversion science, recommending changes to improve design consistency, user experience, and premium conversion.

---

## Current Section Order (MainBrowseView.tsx)

1. Header ("Habit Library")
2. Search Bar
3. Featured Hero (time-aware gradient card)
4. Trending Now (horizontal carousel)
5. Browse by Category (2-column grid)
6. Curated Packs (premium monetization) -- **buried at scroll bottom**

---

## Recommendations (Priority Order: Best Effort-to-Impact First)

### Sprint 1: Quick Wins (LOW effort)

#### R1. Activate the UsageBanner (HIGH impact)

**Problem:** A fully-built `UsageBanner` component exists at `src/screens/TemplatesScreen/components/UsageBanner/` but is **dead code** -- never imported by any view. It shows "X of 3 free habits used" with dot indicators and an "Unlock All" CTA.

**Why it matters:** The Goal Gradient Effect (Hull, 1932) shows users accelerate behavior as they approach a limit. "2 of 3 used" frames remaining slots as scarce, driving either careful selection (engagement) or upgrade (conversion). Kahneman's Loss Aversion makes "losing" your last free slot feel worse than "gaining" premium.

**Change:** Import `UsageBanner` into `MainBrowseView.tsx` and render it between the SearchBar and Featured Hero. Pass `isPremiumUser`, `userHabitCount`, and `onShowPaywall` from the existing data hooks.

**Files:** `MainBrowseView.tsx`, `MainBrowseView.types.ts`, `useTemplatesScreenProps.ts`

---

#### R2. Move Premium Packs Above Category Grid (HIGH impact)

**Problem:** Premium packs are section 4 of 4 in the scroll. Chartbeat data shows ~50-60% of mobile users don't scroll past 2 screens. The primary monetization surface has the worst visibility.

**Principle:** Serial Position Effect (Murdock, 1962) -- items in the middle of a list are forgotten. AIDA conversion model says the premium offer should appear at peak desire, right after social proof (Trending section), not after taxonomic browsing has already satisfied the user's itch.

**Change:** In `MainBrowseView.tsx`, swap lines 56-58: render `premiumPacksSection` at stagger index 2, `categoryGrid` at stagger index 3.

**New order:** Header -> Search -> UsageBanner -> Hero -> Trending -> **Packs** -> Categories

**Files:** `MainBrowseView.tsx` (single line swap)

---

#### R3. Remove Decorative Circles from Hero Card (LOW impact)

**Problem:** Two absolute-positioned semi-transparent circles (`circleOne`: 180px, `circleTwo`: 200px) in `FeaturedCollection.tsx:33-34` serve zero informational purpose and contradict the "Warm Minimal" aesthetic.

**Principle:** Hick's Law -- fewer visual elements = faster processing. Nielsen's "Aesthetic and Minimalist Design" (Heuristic #8). The gradient itself already creates visual distinction via the Von Restorff Effect.

**Change:** Remove `circleOne` and `circleTwo` Views and their styles.

**Files:** `FeaturedCollection.tsx`, `FeaturedCollection.styles.ts`

---

#### R4. Improve Category Grid "Show All" Discoverability (MEDIUM impact)

**Problem:** The expand button uses `rgba(255,255,255,0.04)` background -- nearly invisible on the warm `#F5F1ED` background. Users may not know 8 more categories exist beyond the initial 6.

**Principle:** Norman's "Signifiers" -- interactive elements must look interactive. "Visibility of System Status" (Nielsen Heuristic #1).

**Change:** Use `colors.primary[600]` for text, add `ChevronDown` icon, use `colors.light.surfaceMuted` background with `borderColor: colors.border`.

**Files:** `CategoryGrid.tsx` (style-only changes)

---

#### R5. Increase TrendingCard Add Button Touch Target (LOW impact)

**Problem:** The AddButton is 32px + 4px hitSlop = 40px effective. Below Apple HIG 44pt minimum.

**Principle:** Fitts's Law -- smaller targets = higher error rate.

**Change:** Button 32px -> 36px, hitSlop 4 -> 8 (52px effective).

**Files:** `TrendingCard.styles.ts`, `AddButton.tsx`

---

#### R6. Fix Hardcoded Color Tokens (LOW impact)

**Problem:** `TemplateCardContent.tsx` uses hardcoded `#4b5563` and `#1c1917` instead of theme tokens. These break dark mode and are slightly off from the design system values (`#6B6560` and `#2D2A26`).

**Principle:** Nielsen's "Consistency and Standards" (Heuristic #4).

**Change:** Replace with `colors.text.secondary` and `colors.text.primary`.

**Files:** `TemplateCardContent.tsx`

---

### Sprint 2: Conversion Optimization (MEDIUM effort)

#### R7. Add Premium Badges to Templates & Categories (HIGH impact)

**Problem:** Users have zero visual indication of what's free vs. paid until they hit the paywall at habit #4. The `isPremium` flag exists in `categoryMeta.ts` for `andrew_huberman` but `CategoryTile` never displays it. No individual template shows a lock icon.

**Why it matters:** Two effects in tension:
- Cialdini's **Scarcity Principle**: PRO badges signal exclusivity, increasing desire
- Nielsen's **"Match Between System and Real World"**: Users expect marketplace-style free/paid indicators. Surprise paywalls create frustration (Norman's "Gulf of Execution")

**Change:**
- Add `isPremium` prop to `CategoryTile`, show a "PRO" pill badge using `colors.premium[400]` (#7B52C4)
- Add subtle lock icon on `TrendingCard` for templates in premium categories
- Create shared `ProBadge` component (reusable across screen)

**Files:** `CategoryTile.tsx`, `CategoryGrid.tsx`, `TrendingCard.tsx`, new `ProBadge` component, `useMainBrowseData.ts`

---

#### R8. Fix Hardcoded "2.4k users" Social Proof (HIGH impact)

**Problem:** `HeroFooter.tsx:12` contains the literal string `"2.4k users"`. This never updates. If discovered, it destroys trust.

**Principle:** Cialdini's Social Proof works only when perceived as authentic. Detected manipulation triggers Brehm's Reactance Theory (boomerang effect). Early adopters seeing "2.4k" when the app has fewer users is especially damaging.

**Change:** Either:
- (a) Create a Convex query aggregating `templateUsage` count for the featured category -> display real number
- (b) Replace with non-falsifiable copy: "Popular collection" or "Staff pick"

Option (b) is safer and lower effort.

**Files:** `HeroFooter.tsx`, optionally `convex/templates/queries.ts`

---

#### R9. Surface Trial Availability on Browse Screen (HIGH impact)

**Problem:** The 7-day free trial (RevenueCat) is only discoverable inside the PaywallSheet. Users who browse but never exceed the habit limit never learn about it.

**Principle:** RevenueCat 2024 benchmarks show surfacing trial availability before the paywall increases conversion 20-40%. Cialdini's "Commitment and Consistency" -- low-risk trial framing reduces resistance. Thaler's Nudge Theory -- the browse screen should include trial awareness as a default path element.

**Change:** Update `PremiumPackCard` CTA from "Import Pack" to "Try Free" or "Start Free Trial" for users without premium. Add a small "7-day free trial" label on the pack section header.

**Files:** `PremiumPackCard.tsx`, `PremiumPacksSection.tsx`, props from `useTemplatesScreenProps.ts`

---

### Sprint 3: Polish (MEDIUM-HIGH effort)

#### R10. Unify Science Badge Component (MEDIUM impact)

**Problem:** Three different visual treatments for "science-backed":
- Yellow pill in `TrendingCard` (hardcoded `#FEF3C7`/`#92400E`)
- `ScienceBox` in `TemplateCardContent`
- Sort chip in `CategoryDrillView`

**Principle:** Nielsen's "Consistency and Standards" -- one concept = one visual language.

**Change:** Create a single `ScienceBadge` component using design system tokens (`colors.warningLight`/`colors.warning`). Replace all three implementations.

**Files:** New `ScienceBadge` component, `TrendingCard.tsx`, `TemplateCardContent.tsx`, `CategoryDrillView.tsx`

---

#### R11. Rename "Trending Now" to "Most Popular" (MEDIUM impact)

**Problem:** The section is labeled "Trending Now" but the data is just `popularityScore` descending -- a static lifetime metric. "Trending" implies recency + velocity. The "See All" view is titled "All Popular Templates", creating an inconsistency.

**Principle:** "Match Between System and Real World" (Nielsen Heuristic #2). Honest labeling builds trust.

**Change:** Rename header to "Most Popular" and "See all" link text accordingly. If we later implement time-windowed trending (imports in last 7 days), we can revert to "Trending."

**Files:** `PopularSection.tsx` (text change only)

---

#### R12. First-Visit Progressive Disclosure (MEDIUM impact, HIGH effort)

**Problem:** Zero onboarding for the templates screen. New users discover interaction patterns entirely through exploration. Users may miss the add button, pack imports, or category drill-down.

**Principle:** Keller's ARCS Model (Attention, Relevance, Confidence, Satisfaction). Progressive Disclosure (Lidwell et al.) reduces cognitive load while guiding discovery.

**Change:** Detect first visit (AsyncStorage flag). Show brief coach marks: (a) "Browse templates by category or search", (b) "Tap + to add a habit", (c) "Curated packs for quick setup". Auto-dismiss after interaction.

**Files:** New `TemplatesOnboardingOverlay` component, `MainBrowseView.tsx`, storage utility

---

## Design Consistency Fixes (Bundled with above changes)

| Issue | Location | Fix |
|-------|----------|-----|
| Font 24px/800 not in type scale | `FeaturedCollection.styles.ts:84` | Use `typography.heading2` (22px/600) |
| Font 11px not in type scale | `FeaturedCollection.styles.ts:19`, `TrendingCard.styles.ts:44` | Use 10px (tabBar) or 13px (caption) |
| Font 16px not in type scale | `PremiumPackCard.tsx:81` | Use 14px (bodySmall) or 17px (body) |
| Border radius 20 not in tokens | `CategoryDrillView.tsx:117` | Use `borderRadius.full` for pills |
| Green shadow on AddButton | `TrendingCard.styles.ts` | Use warm `#2D2A26` shadow per design system |
| `paddingHorizontal: 10` off 4px grid | `FeaturedCollection.styles.ts:15` | Use 8 or 12 |

---

## Monetization Funnel (Current vs Proposed)

**Current flow:**
```
Browse -> Scroll (maybe) -> See packs (maybe) -> Import habits -> Hit limit -> Paywall
```
Problems: No premium awareness, packs buried, trial hidden, no urgency signals.

**Proposed flow:**
```
Enter -> See UsageBanner ("2 of 3 used") -> Browse Hero -> See Trending ->
See Packs with PRO badges + trial CTA -> Import -> See updated usage dots ->
Approaching limit triggers upgrade nudge -> Paywall with trial emphasis
```
Improvements: Premium awareness at every stage, trial surfaced early, usage progress creates urgency.

---

## Verification Plan

1. **Visual regression**: Screenshot before/after for each sprint
2. **Section order**: Confirm MainBrowseView renders UsageBanner -> Hero -> Popular -> Packs -> Categories
3. **UsageBanner**: Verify it appears for free users (count < 3), hides for premium
4. **Touch targets**: Measure AddButton effective area >= 44pt
5. **Dark mode**: Verify all fixed color tokens render correctly in both themes
6. **Conversion tracking**: Monitor paywall open rate + trial start rate pre/post changes
