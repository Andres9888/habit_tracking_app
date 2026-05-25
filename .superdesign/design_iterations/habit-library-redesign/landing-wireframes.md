# Habit Library Landing Wireframes (mocks_landing)

Scope: `TemplatesScreen` landing variants only (`MainBrowseView` + `BrowseSections` composition), aligned to existing component names in `src/screens/TemplatesScreen`.

## Shared shell (all segments)

1. `ScreenHeader`
   - Title: segment-specific
   - Subtitle: segment-specific
   - Right action: `SessionProgressPill` when `sessionImportCount > 0`
2. `SearchBar`
   - Hint baseline: `Try: morning walk · journaling · cold shower`
3. `QuickFilterChips`
   - Includes `✨ All`, `⚡ Quick`, `🔥 High ROI`, plus curated category chips
4. `BrowseSections` body
   - Varies by segment branch
5. `BrowseCategoriesLink`
   - Label: `Browse all categories`
6. `HelpMeChoosePill` (new wrapper around existing navigation)
   - Fixed bottom-right CTA into future `GuidedPickerView`

---

## Segment A: First-time user (new / empty)

### Intent
- Reduce paralysis and bias toward one-tap wins.

### Section mapping
- Hero section: `StarterHabitList` (preferred when starter templates exist)
- Fallback hero: `StartHereCard` (when starter templates unavailable)
- Secondary content: `GoalCollectionGrid` and `PopularSection` hidden until user leaves starter path
- Footer: `BrowseCategoriesLink` + `HelpMeChoosePill`

### Exact copy
- `ScreenHeader.title`: `What do you want to work on?`
- `ScreenHeader.subtitle`: `Pick a path — habits proven to work.`
- `StarterHabitList.banner.eyebrow`: `NEW HERE?`
- `StarterHabitList.banner.title`: `Start with these 5`
- `StarterHabitList.banner.subtitle`: `A simple starter pack — proven, easy to stick with.`
- `StarterHabitList.escape`: `Or browse by goal →`
- `HelpMeChoosePill`: `Not sure? 30-sec guide`

### ASCII wireframe
```text
┌──────────────── ScreenHeader + SessionProgressPill ────────────────┐
│ What do you want to work on?                                       │
│ Pick a path — habits proven to work.                               │
├──────────────────────────── SearchBar ──────────────────────────────┤
├────────────────────────── QuickFilterChips ─────────────────────────┤
├────────────────────── StarterHabitList / StartHereCard ─────────────┤
│ NEW HERE?  Start with these 5                                      │
│ [habit row][+add] x5                                                │
│ Or browse by goal →                                                 │
├────────────────────── BrowseCategoriesLink ──────────────────────────┤
│ Browse all categories                                             → │
└──────────────────────────────────────────────────────────────────────┘
                                  [ Help me choose pill ]
```

---

## Segment B: Returning user (building momentum)

### Intent
- Emphasize transformation paths and trending confidence signals.

### Section mapping
- Hero section: `GoalCollectionGrid` with `FeaturedGoalCard`
- Secondary section: `PopularSection` carousel
- Footer: `BrowseCategoriesLink` + `HelpMeChoosePill`

### Exact copy
- `ScreenHeader.title`: `What do you want to work on?`
- `ScreenHeader.subtitle`: `Pick a path — habits proven to work.`
- `GoalCollectionGrid.featuredBadgeLabel`: `Today’s pick`
- `PopularSection.title`: `Quick wins to build momentum`
- `PopularSection.subtitle`: `What people are starting this week`
- `PopularSection.seeAll`: `See all`
- `HelpMeChoosePill`: `Help me choose`

### ASCII wireframe
```text
┌──────────────── ScreenHeader + SessionProgressPill ────────────────┐
├──────────────────────────── SearchBar ──────────────────────────────┤
├────────────────────────── QuickFilterChips ─────────────────────────┤
├──────────────── GoalCollectionGrid (FeaturedGoalCard) ──────────────┤
│ [Today’s pick][goal promise][3 starter previews]                    │
│ [GoalCard rail ...]                                                  │
├──────────────────────── PopularSection ──────────────────────────────┤
│ Quick wins to build momentum                             See all     │
│ [TrendingCard rail ...]                                              │
├────────────────────── BrowseCategoriesLink ──────────────────────────┤
└──────────────────────────────────────────────────────────────────────┘
                                  [ Help me choose pill ]
```

---

## Segment C: Power user (speed + depth)

### Intent
- Maximize speed-to-add and advanced exploration shortcuts.

### Section mapping
- Hero utility row: `SearchBar` + `QuickFilterChips` remains top priority
- Progress/status: `SessionProgressPill` always surfaced when count > 0
- Packs rail: `PremiumPacksSection` (if premium or promoted)
- Goal exploration: `GoalCollectionGrid` compact row
- Trends: `PopularSection` reduced height
- Footer: `BrowseCategoriesLink` + `HelpMeChoosePill`

### Exact copy
- `ScreenHeader.title`: `Find your next upgrade`
- `ScreenHeader.subtitle`: `Search, filter, and add in seconds.`
- `PremiumPacksSection.title`: `Curated bundles`
- `PremiumPacksSection.badge`: `Premium`
- `PopularSection.title`: `Quick wins to build momentum`
- `HelpMeChoosePill`: `Need inspiration?`

### ASCII wireframe
```text
┌──────────────── ScreenHeader + SessionProgressPill ────────────────┐
│ Find your next upgrade                                              │
│ Search, filter, and add in seconds.                                │
├──────────────────────────── SearchBar ──────────────────────────────┤
├────────────────────────── QuickFilterChips ─────────────────────────┤
├────────────────────── PremiumPacksSection ──────────────────────────┤
│ Curated bundles                                        Premium       │
│ [PremiumPackCard stack]                                              │
├────────────────── GoalCollectionGrid (compact) ─────────────────────┤
├──────────────── PopularSection (reduced rail) ───────────────────────┤
├────────────────────── BrowseCategoriesLink ──────────────────────────┤
└──────────────────────────────────────────────────────────────────────┘
                                  [ Help me choose pill ]
```
