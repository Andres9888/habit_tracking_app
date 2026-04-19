# Habit Library Main Page — Design Improvements Plan

## Context

The habit library (TemplatesScreen) serves as the primary discovery surface for 200+ habits across 14 categories. The current page is content-rich but suffers from **excessive scroll depth** (~7 sections stacked vertically), **visual monotony** (every section header looks identical), and **buried high-value content** (trending habits hidden in a horizontal carousel, categories pushed below editorial content).

The goal is to tighten the page so users find habits faster with less scrolling, while preserving the curated editorial feel.

---

## Current Page Order

```
ScreenHeader ("Habit Library")
SearchBar
QuickFilterChips (7 categories)
StartHereCard (new users — green gradient, 5 starter habits)
GoalCollectionGrid ("What's your goal?" — 5 colored cards)
FeaturedCollection (time-aware hero gradient card)
PopularSection ("Trending right now" — horizontal carousel)
CategoryGrid ("Browse by Category" — 2-col tiles, 6 visible)
PremiumPacksSection ("Starter Sets / Premium" — vertical stack)
ExploreAllSection ("Discover more" — collapsed category groups)
```

---

## Proposed Improvements (Prioritized)

### 1. Consolidate Guidance Sections — HIGH impact, MEDIUM effort

**Problem:** New users see 3 guidance blocks (StartHere + Goals + Featured = ~650px) before any actionable habit content.

**Change:**
- Replace StartHereCard with a compact **QuickStartRow** — horizontal pill buttons for the 5 starter habits, directly tappable
- Move GoalCollectionGrid into a **bottom sheet** triggered by a "More goals..." trailing button
- Keep FeaturedCollection as the sole prominent hero

**Saves:** ~300px vertical for new users, ~200px for returning users

**Files:** `MainBrowseView.tsx`, `StartHereCard.tsx` (replace), `GoalCollectionGrid.tsx` (wrap in sheet)

---

### 2. Promote Trending Habits — HIGH impact, MEDIUM effort

**Problem:** Horizontal carousels have poor discoverability. The most socially-validated content (trending habits with popularity scores) requires a horizontal swipe that many users won't perform.

**Change:** Convert top 3-4 trending habits from horizontal carousel to **compact vertical inline cards** — immediately visible without horizontal scrolling. Keep "See all" link for the full list.

**Files:** `PopularSection.tsx`, `TrendingCard.tsx` (create compact variant), `TrendingCard.styles.ts`

---

### 3. Elevate Category Grid — MEDIUM-HIGH impact, SMALL effort

**Problem:** Categories are the primary navigation mechanism for 14 categories but are buried as the 5th-6th section. Tiles are visually plain.

**Change:**
- **Move CategoryGrid above PopularSection** in the page order
- **Polish CategoryTile:** remove faded preview emojis (noise), add subtle border accent from category `borderColor`, increase count font weight, reduce tile minHeight from 120px to ~92px
- Consider bumping `INITIAL_VISIBLE` from 6 to 8

**Files:** `MainBrowseView.tsx` (reorder), `CategoryTile.tsx` (styles), `CategoryGrid.tsx` (`INITIAL_VISIBLE`)

---

### 4. Rebrand & Compact Premium Packs — MEDIUM impact, SMALL effort

**Problem:** "Premium" badge creates paywall anxiety. Vertical stack of 3 pack cards takes ~300px.

**Change:**
- Rename to **"Curated Packs"** with descriptive subtitle
- Convert from vertical stack to **horizontal scroll** (~120px total height)
- Remove "Premium" badge unless content actually requires subscription

**Files:** `PremiumPacksSection.tsx`, `PremiumPackCard.tsx`

---

### 5. Section Header Visual Hierarchy — MEDIUM impact, SMALL effort

**Problem:** Every section uses `typography.heading3` — no visual differentiation between primary and secondary sections.

**Change:**
- Primary sections (Categories, Trending): use `typography.heading2`
- Secondary sections (Packs): use overline label + heading3
- Standardize top margins: primary = `spacing.xl` (32px), secondary = `spacing.lg` (24px)

**Files:** `PopularSection.tsx`, `CategoryGrid.tsx`, `PremiumPacksSection.tsx`, `ExploreAllSection.tsx`

---

### 6. Compact Header for Returning Users — LOW impact, SMALL effort

**Problem:** Subtitle "Start with a goal, a category, or a quick add" is redundant for returning users.

**Change:** Hide subtitle for users with 2+ habits. Reduce subtitle to `typography.bodySmall` (14px) when shown.

**Files:** `MainBrowseView.tsx`

---

## Proposed New Page Order

**New users:**
```
ScreenHeader (compact subtitle)
SearchBar + QuickFilterChips
QuickStartRow (inline pills — replaces StartHereCard)
FeaturedCollection (hero card)
CategoryGrid (moved up, polished tiles)
PopularSection (vertical inline cards)
Curated Packs (horizontal scroll)
ExploreAllSection
```

**Returning users:**
```
ScreenHeader (no subtitle)
SearchBar + QuickFilterChips
FeaturedCollection (hero card)
CategoryGrid (moved up)
PopularSection (vertical inline)
Curated Packs (horizontal)
ExploreAllSection
```

Estimated scroll reduction: **350-500px for new users**, **250-350px for returning users**.

---

## Implementation Order

| Order | Change | Impact | Effort |
|-------|--------|--------|--------|
| 1 | Compact header (returning users) | LOW | SMALL |
| 2 | Category Grid: move up + visual polish | MED-HIGH | SMALL |
| 3 | Section header differentiation | MED | SMALL |
| 4 | Consolidate guidance sections | HIGH | MED |
| 5 | Trending: horizontal to vertical | HIGH | MED |
| 6 | Premium Packs: rebrand + horizontal | MED | SMALL |

Start with quick wins (1-3), then tackle the structural changes (4-5-6).

---

## Critical Files

- `src/screens/TemplatesScreen/views/MainBrowseView.tsx` — main orchestrator
- `src/screens/TemplatesScreen/components/PopularSection/PopularSection.tsx`
- `src/screens/TemplatesScreen/components/CategoryGrid/CategoryTile.tsx`
- `src/screens/TemplatesScreen/components/CategoryGrid/CategoryGrid.tsx`
- `src/screens/TemplatesScreen/components/PremiumPacksSection/PremiumPacksSection.tsx`
- `src/screens/TemplatesScreen/components/StartHereCard/StartHereCard.tsx`
- `src/screens/TemplatesScreen/components/GoalCollectionGrid/GoalCollectionGrid.tsx`
- `src/screens/TemplatesScreen/components/TrendingCard/TrendingCard.tsx`

## Verification

- Run the app on iOS simulator and scroll through the habit library
- Compare scroll depth before/after (count total viewport scrolls needed to reach bottom)
- Verify all sections still render correctly with test data
- Test new user flow (0 habits) and returning user flow (2+ habits)
- Run `npm run lint` to check file length compliance
