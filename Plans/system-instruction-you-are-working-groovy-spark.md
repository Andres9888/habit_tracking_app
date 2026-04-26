# Templates Page Redesign — "Your Transformation"

## Context

**Why this change.** The Habit Library today reads as a catalog: "What do you want to work on?" → goal grid → popular → categories. It works, but it doesn't *pull* — users browse politely instead of feeling drawn to start. The user's intent for this redesign:

> "Make you want to do more habits and explore more, and make it easy to find the habits you want and the transformation you're looking for."

The product instinct is right and the bones are already there:

- **`GOAL_COLLECTIONS`** (5 outcome-framed transformations with `promise` text) — already exists, currently used as a 2×2 grid + featured tile.
- **`categoryMeta.subtitle`** (aspirational copy per category, e.g. "Regulate your nervous system with breathwork") — defined but not surfaced on the categories page.
- **`PremiumPacksSection`** (Huberman Essentials, Morning Mastery, Mindful Peak — multi-habit guided journeys) — **wired into `TemplatesScreen.tsx:172` as a prop but never rendered by `MainBrowseView`**. This is the primary monetization surface and it's dead code right now.
- **`suggestedWhy` / `suggestedIdentity`** on templates — outcome framing fields per template, only loosely surfaced.
- **`popularityScore`** — already on every template, currently displayed as a quiet "X.XK tracking" string.

The redesign promotes transformation/identity to the page's primary lens, makes the premium-pack monetization surface first-class, and personalizes via a new `primaryGoalId` captured in onboarding. Phased so each phase ships value standalone.

---

## North Star (the redesigned scroll)

```
┌─────────────────────────────────────────────────┐
│  Identity Header                                │   ← personalized to primaryGoalId
│  "Your path to {goal}" or "Choose your path"    │
├─────────────────────────────────────────────────┤
│  Search bar                                     │   ← stays sticky
├─────────────────────────────────────────────────┤
│  HERO TRANSFORMATION CARD                       │   ← featured goal: full-bleed,
│  emoji · big promise · 3 starter habits inline  │     promise prominent, CTA
│  [Start your path →]                            │
├─────────────────────────────────────────────────┤
│  GUIDED JOURNEYS (Premium Packs)                │   ← MONETIZATION,
│  horizontal carousel: Huberman / Morning / etc. │     currently dead code
├─────────────────────────────────────────────────┤
│  Other transformations                          │   ← remaining 4 goal cards as
│  horizontal scroll, promise visible             │     a horizontal rail
├─────────────────────────────────────────────────┤
│  Quick wins to build momentum                   │   ← reframed PopularSection,
│  (was: Popular)                                 │     stronger social proof
├─────────────────────────────────────────────────┤
│  Browse all categories                          │   ← CategoryRowsSection moves
│  (subtitled rows from categoryMeta.subtitle)    │     down + gets aspirational
└─────────────────────────────────────────────────┘                copy per row
```

Tap a transformation → drill-down is a true **transformation page** (hero, science, starter pack, premium upsell, full list) — not a generic filtered list.

---

## Phase 1 — Re-anchor the page on transformations *(no schema, no deps)*

Goal: every change in this phase is local UI surgery on the existing TemplatesScreen tree. Ships immediate "wow" with zero risk to data.

### 1a. Fix the dead-code Premium Packs render

`src/screens/TemplatesScreen/views/MainBrowseView.tsx` currently never reads `p.premiumPacksSection`. Add it to the scroll, between the Hero Transformation and the "Other transformations" rail (i.e., new stagger index 2).

`src/screens/TemplatesScreen/views/MainBrowseView.types.ts` — confirm the prop is already declared; if not, add it.

### 1b. Promote the featured goal into a true Hero Card

`src/screens/TemplatesScreen/components/GoalCollectionGrid/FeaturedGoalCard.tsx` (existing) → expand into a full-width hero:

- Emoji at scale (e.g., 56–64px), `goal.label` as headline, `goal.promise` as subhead at body-large size (currently buried).
- Inline preview of **3 starter habits** for that goal (top 3 from the goal's categories by `popularityScore`). Tappable cards.
- Primary CTA button: "Start your {label} path →" → opens goal drill-down.
- Background: subtle gradient using `goal.bgColor` / `darkBgColor` — feel premium, not flat.
- Light social-proof line if data supports it: `"{N} on this path"` derived from summed `popularityScore` of the goal's templates (purely local computation).

Keep `GoalCard.tsx` (the small ones) — but reformat into a horizontal rail, not a 2×2 grid (see 1c).

### 1c. Move the other 4 goals into a horizontal rail

Update `GoalCollectionGrid.tsx`: hero stays at top; remaining 4 goals render as a horizontal `ScrollView`/`FlatList` of `GoalCard`s wide enough that the user sees all 4 at once on most devices. Each card shows emoji, label, promise, count.

Rationale: a 2×2 grid signals "menu"; a horizontal rail signals "explore more" and matches the rest of the rails on the page.

### 1d. Aspirational subtitles on category rows

`src/screens/TemplatesScreen/components/CategoryRowsSection/CategoryRow.tsx`:

- Pull `categoryMeta[group.category].subtitle` and render under the existing icon+label header. (The data already exists; we're just plugging it in.)
- Section title for the whole block changes from generic to aspirational, e.g. `"Browse by what you want to feel"` (above the rows).

`src/screens/TemplatesScreen/components/CategoryRowsSection/CategoryRowsSection.tsx` — render the section title.

### 1e. Reframe PopularSection copy + stronger social proof

`src/screens/TemplatesScreen/components/PopularSection/PopularSection.tsx`:

- Title: `"Popular"` → `"Quick wins to build momentum"` (or `"Catching fire this week"` — see verification A/B option).
- Format `popularityScore` more magnetically. Existing `formatPopularity()` returns "1.2K tracking"; layer a heat indicator: top decile gets a 🔥, top 3 get an "📈 Surging" pill. Logic stays local; just compute once over the 10-template list.

`src/screens/TemplatesScreen/data/categoryPriority.ts` is already in place — no change.

### 1f. Identity header copy

`src/screens/TemplatesScreen/views/MainBrowseView.tsx` `HEADER_SUBTITLE`:

- Default (no primary goal yet): keep `"Pick a path — habits proven to work."` (slight tightening).
- Personalized (Phase 3, behind feature flag): `"Your path to {goal.label}."`

### Files touched in Phase 1

- `src/screens/TemplatesScreen/views/MainBrowseView.tsx` (insert PremiumPacksSection slot, reorder children, copy)
- `src/screens/TemplatesScreen/components/GoalCollectionGrid/GoalCollectionGrid.tsx` (rail layout)
- `src/screens/TemplatesScreen/components/GoalCollectionGrid/FeaturedGoalCard.tsx` (hero expansion + 3 starter previews + CTA)
- `src/screens/TemplatesScreen/components/GoalCollectionGrid/GoalCard.tsx` (rail-card visuals)
- `src/screens/TemplatesScreen/components/GoalCollectionGrid/GoalCollectionGrid.styles.ts`
- `src/screens/TemplatesScreen/components/CategoryRowsSection/CategoryRow.tsx` (subtitle line)
- `src/screens/TemplatesScreen/components/CategoryRowsSection/CategoryRowsSection.tsx` (section title)
- `src/screens/TemplatesScreen/components/PopularSection/PopularSection.tsx` (rename + heat indicator)
- Reuse `src/screens/TemplatesScreen/data/categoryMeta.ts` (existing — read subtitles)
- Reuse `src/screens/TemplatesScreen/components/PopularSection/formatPopularity()` (existing)

Per the project's 100-line rule, the FeaturedGoalCard expansion will likely cross the threshold — extract `FeaturedGoalCard.styles.ts` and a `FeaturedGoalStarterRow.tsx` sub-component preemptively (per `docs/DECOMPOSITION_PATTERNS.md`).

---

## Phase 2 — Goal Drill-Down becomes a Transformation Page

Today: tapping a goal opens a filtered list. Redesign: a guided experience.

`src/screens/TemplatesScreen/views/renderSubView.tsx` currently dispatches goal/category/see-all sub-views. Find the goal sub-view (likely `GoalDetailView.tsx` or similar) and replace its body with:

1. **Hero band**: goal emoji, label, expanded promise (longer copy — net-new field `goal.transformationCopy` on `GoalCollection`, or compose from existing data with hardcoded paragraphs initially), the "{N} on this path" social proof.
2. **Why this works** (collapsible): science narrative for the goal — author once per goal; map to existing template `scientificReference`s for proof.
3. **Starter pack of 3** — top 3 templates by `popularityScore` within the goal's categories, with a single **"Add all 3 to start"** button (one tap → fan-out import). This is the equivalent of a free mini-pack — a conversion ramp toward the paid packs.
4. **Premium pack tie-in** — if a `premiumPack` exists whose categories overlap the goal's categories, surface it inline ("Take it further → {pack name}") with the standard Premium badge. **Direct monetization hook.**
5. **Full template list** below — the existing filtered list, kept as a "browse all" footer.

Files to touch:
- `src/screens/TemplatesScreen/views/renderSubView.tsx` and the goal sub-view component it dispatches to (locate via grep on `openGoal`).
- New helper: `src/screens/TemplatesScreen/data/goalToPackMap.ts` (static mapping `goalId → premiumPackId`, ~5 lines).
- New action handler `handleAddStarterPack(templates: Template[])` co-located with existing import handlers (likely `useTemplatesScreenProps` / its handlers hook).

Reuse, don't recreate:
- Premium pack rendering: existing `PremiumPacksSection` card variant.
- Social proof formatting: existing `formatPopularity()`.
- Science: pattern from `ScienceEvidenceSection` in `FullsizeTemplatePreview`.

---

## Phase 3 — Capture transformation in onboarding *(schema change)*

Today no user-level "what are you here for?" is captured. Add it.

### Schema (Convex)

`convex/schema.ts` — add to `users` table:
```ts
primaryGoalId: v.optional(v.string()), // matches GoalCollection.id
primaryGoalSetAt: v.optional(v.number()),
```

Optional second field (Phase 4-ready): `secondaryGoalIds: v.optional(v.array(v.string()))`.

### Mutation

`convex/users.ts` (or wherever user mutations live) — `setPrimaryGoal({ goalId })`. Validates against the 5 known IDs.

### Onboarding screen

The existing `OnboardingScreen` runs 3 pages; insert a new page **after** "200+ Ready-Made Templates" (so user has context) titled `"What's your transformation?"` rendering the same 5 `GOAL_COLLECTIONS` as tappable cards. On select → call `setPrimaryGoal` → continue.

Reuse: `GoalCard` / `FeaturedGoalCard` components from Phase 1 (they're already designed for this exact display).

### Templates page personalization

`TemplatesScreen.tsx` — replace `getFeaturedGoalId()` (time-of-day) with: prefer `user.primaryGoalId`; fall back to time-of-day. The Hero Card now defaults to the user's chosen path. Header subtitle updates to `"Your path to {label}"`.

Files touched:
- `convex/schema.ts`
- `convex/users.ts` (new mutation)
- `src/screens/Onboarding*` — new page (locate the existing pager component)
- `src/screens/TemplatesScreen/TemplatesScreen.tsx` — read `user.primaryGoalId`
- `src/screens/TemplatesScreen/views/MainBrowseView.tsx` — header subtitle uses goal label

---

## Phase 4 — Light personalization & "complete your stack" *(no schema; query-only)*

Once Phase 3 ships, we know each user's primary goal. Phase 4 uses this + the user's existing habits to make discovery feel *for them*.

1. **"Continue your {primaryGoal} path"** — a pinned strip above the Quick Wins block listing 3 templates within the user's primary goal's categories that they *don't already have*.
2. **"Pairs with your habits"** — if user has habits in category X, surface 3 templates from the static `CATEGORY_PAIRINGS` complement, filtered to ones they don't already have.
3. **"Complete your stack" CTA on detail page** — `FullsizeTemplatePreview`'s existing static "Pairs well with" becomes user-aware: still static categories, but template selection within those categories prefers the user's primary goal.

All three use existing data; no schema change. Adds two new selectors in `useMainBrowseData` and one in `useTemplatePreviewProps`.

---

## Monetization map (explicit)

| Surface | Phase | Lever |
|---|---|---|
| Premium Packs visible at all on main page | 1a | Bug-fix + placement → first impression |
| Hero CTA "Start your path" funnels to drill-down | 1b → 2 | Engagement → pack upsell at drill-down step 4 |
| One-tap starter pack of 3 free habits | 2 | Hook for behavior; warms up to paid pack |
| Premium pack matched to goal | 2 | Direct upsell in context |
| Personalized "Continue your path" | 4 | Re-engagement → premium pack matching primary goal |

---

## What to *not* change

- `useEntranceAnimations.ts` and the calm staggered entrance (recent unification PR #1330) — keep as-is; new sections inherit it.
- `categoryPriority.ts` (just landed on this branch) — keep.
- `CategoryRowsSection`'s Netflix-rows pattern — **keep**, just demote position and add aspirational copy. The chip-rail Pattern A mockup stays a future option; not part of this plan.
- Do not delete the time-of-day `getFeaturedGoalId()` — it remains the fallback when `primaryGoalId` is absent.
- Search/filter/sort behavior — untouched.

---

## Verification

End-to-end checks per phase. Commit after each verifies green.

### Phase 1
1. `npm run lint:max-lines` — confirm no new violations (extract sub-components if FeaturedGoalCard crosses 100).
2. `npx tsc --noEmit` — type-clean (per `feedback_precommit_no_verify.md`).
3. **Visual UAT** (per `feedback_validate_against_mock.md`): run app, open Habit Library, screenshot the new scroll, compare against the layout in this plan section "North Star":
   - Hero Card visible above the fold with `promise` clearly readable
   - Premium Packs section actually renders (was dead code)
   - Category rows show subtitles
   - Popular section renamed and heat indicator visible on top 3
4. Tap each goal card → confirms drill-down still works (Phase 2 will replace the body).
5. Tap a Premium Pack → confirms existing pack-confirm flow fires.
6. Reduced Motion enabled → entrance still calm, no jarring layout shifts.

### Phase 2
1. Tap each of the 5 goal cards → drill-down opens with Hero band + Starter Pack + Premium tie-in (where mapped) + Full list.
2. Tap "Add all 3 to start" → 3 import calls fire, 3 toasts (or one batched toast — confirm with design before shipping), dest list shows 3 new habits.
3. If a goal has no mapped premium pack, the section gracefully hides (no empty card).
4. Back nav from drill-down returns to scroll position on main page.

### Phase 3
1. Fresh user signs up → onboarding shows the new transformation page → selection persists in `users.primaryGoalId` (verify via `mcp__convex__data`).
2. Existing user with no `primaryGoalId` → main page falls back to time-of-day featured goal (no regression).
3. Existing user with `primaryGoalId` set → Hero is their chosen goal regardless of time of day; header subtitle reads `"Your path to {label}"`.
4. Convex mutation rejects invalid `goalId`.

### Phase 4
1. User with no habits → "Continue your path" still shows 3 templates from primary goal.
2. User who has imported one of the 3 → that template no longer appears in the strip; a fresh one takes its place.
3. "Pairs with your habits" appears only when user has at least one habit; gracefully hidden otherwise.

### Cross-phase
- `npm run lint:max-lines` clean across all phases.
- Post-commit pre-commit hook is broken upstream — use `--no-verify` and `tsc --noEmit` manually (per memory).
- Run on iOS sim and one physical device — calm entrance must hold up on slower hardware.

---

## Critical files index

**Phase 1 (UI surgery):**
- `src/screens/TemplatesScreen/views/MainBrowseView.tsx`
- `src/screens/TemplatesScreen/components/GoalCollectionGrid/{GoalCollectionGrid,FeaturedGoalCard,GoalCard}.tsx`
- `src/screens/TemplatesScreen/components/CategoryRowsSection/{CategoryRowsSection,CategoryRow}.tsx`
- `src/screens/TemplatesScreen/components/PopularSection/PopularSection.tsx`
- `src/screens/TemplatesScreen/data/categoryMeta.ts` (read-only — source of subtitles)

**Phase 2 (drill-down):**
- `src/screens/TemplatesScreen/views/renderSubView.tsx` + the goal sub-view it dispatches to
- New: `src/screens/TemplatesScreen/data/goalToPackMap.ts`
- `src/screens/TemplatesScreen/hooks/useTemplatesScreenProps.ts` (or wherever import handlers live) — add `handleAddStarterPack`

**Phase 3 (onboarding capture):**
- `convex/schema.ts`, `convex/users.ts`
- Onboarding screen (locate via grep `OnboardingScreen`)
- `src/screens/TemplatesScreen/TemplatesScreen.tsx` — read user goal

**Phase 4 (personalization):**
- `src/screens/TemplatesScreen/hooks/useMainBrowseData.ts` — add selectors
- `src/screens/TemplatesScreen/components/FullsizeTemplatePreview/...` — pairings selector

---

## Recommended ship order

Phase 1 standalone PR → Phase 2 standalone PR → Phase 3 + 4 together (Phase 4 is small once Phase 3 lands). Each PR is independently shippable and adds compounding value.
