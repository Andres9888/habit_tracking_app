# Habit Library Page — Layout Rethink + Visual Polish

## Context

The habit library (TemplatesScreen) has all the right pieces — hero card, trending carousel, category grid, premium packs, search — but the overall experience feels generic. Every section uses the same heading pattern (emoji + heading3), cards are uniformly sized, the hero card takes 40% of the viewport for a single static category, and the most differentiated content (packs) is buried 3-4 scrolls down. The user wants to rethink the flow and add visual personality.

## Layout Changes

### New section order and structure

```
┌──────────────────────────────────────┐
│  HEADER: "Habit Library"             │
│  Subtitle: time-aware greeting       │
├──────────────────────────────────────┤
│  🔍 Search bar (STICKY)             │
│  [✨ All] [🌅 Morning] [🧠 Mental]..│  ← QuickFilterChips (already built, not wired up)
├══════════════════════════════════════┤  ← scroll starts here
│                                      │
│  POPULAR THIS WEEK                   │
│  Vertical ranked list (#1, #2, #3)   │
│  Top 5 templates with rank numbers   │
│  [See all 47 templates →]            │
│                                      │
├──────────────────────────────────────┤
│                                      │
│  STARTER PACKS                       │
│  (moved UP from bottom)              │
│  Full-width gradient cards           │
│  "Start This Pack" CTA               │
│                                      │
├──────────────────────────────────────┤
│                                      │
│  BACKED BY RESEARCH                  │
│  Horizontal carousel of source cards │
│  Groups templates by scientific ref  │
│  (Huberman, Atomic Habits, etc.)     │
│                                      │
├──────────────────────────────────────┤
│                                      │
│  CATEGORIES                          │
│  Compact list rows (not 2-col grid)  │
│  Icon circle | Name | Count | →      │
│  Show 6, expandable                  │
│                                      │
├──────────────────────────────────────┤
│  Science credibility footer text     │
│  100px bottom padding                │
└──────────────────────────────────────┘
```

### What's removed
- **FeaturedCollection hero card** — replaced by the combination of QuickFilterChips (faster category access) and ranked popular list (better discovery). The hero consumed too much viewport for one static category.

### What's new
1. **QuickFilterChips** wired into MainBrowseView (component already exists at `src/screens/TemplatesScreen/components/QuickFilterChips/`)
2. **Ranked popular list** replacing horizontal carousel — vertical numbered list (#1-#5) with rank numbers in serif font, creating editorial authority
3. **"Backed by Research" section** — horizontal carousel grouping templates by their `scientificReference` source
4. **Science credibility footer** — small trust signal at the bottom

### What's restructured
- **Search + chips** pulled above ScrollView (sticky)
- **Packs moved up** from position 4 to position 2 (above categories)
- **Categories** converted from 2-column tile grid to compact list rows

---

## Visual Polish

### Typography hierarchy overhaul
| Element | Current | New |
|---------|---------|-----|
| Section headers | `typography.heading3` (20px) + emoji prefix | `typography.caption` (13px) uppercase, letter-spacing 1.5, no emoji |
| Rank numbers | N/A | `typography.displayLarge` (34px Literata serif), tertiary color at 30% opacity |
| Data points (counts, frequency) | Mixed sizes | `fontFamilies.monospace` (JetBrains Mono) consistently |
| "See all" links | `typography.bodySmall` | Same, but include count: "See all 47 templates" |

### Spacing standardization
- **Between sections:** `spacing['2xl']` (48px) — currently inconsistent `marginTop: spacing.lg`
- **Section label → content:** `spacing.base` (16px)
- **List item gaps:** `spacing.md` (12px)

### Card treatment
- Remove `borderWidth` on cards, rely on `shadows.card` for depth (softer, more premium)
- Category accent colors become thin left borders (4px) instead of full tile backgrounds
- Pack cards get `borderRadius.xl` (24px) to differentiate from regular cards

### Copy/tone changes
| Current | New | Why |
|---------|-----|-----|
| "Trending Now" | "POPULAR THIS WEEK" | Time-bounded, editorial |
| "Browse by Category" | "CATEGORIES" | Shorter, cleaner |
| "Curated Packs" | "STARTER PACKS" | Action-oriented |
| "Import Pack" button | "Start This Pack" | Lower friction |
| "Science" badge | Research icon (beaker) | Visual > text |

---

## Implementation Plan

### Phase 1: Layout restructure (no new components)

**1a. Make search + chips sticky**
- `MainBrowseView.tsx`: Move SearchBar above ScrollView, add QuickFilterChips below it
- `MainBrowseView.types.ts`: Add props for chip state (`activeChipCategory`, `onChipSelect`)
- `TemplatesScreen.tsx`: Wire chip state (useState for active category, filter popularTemplates accordingly)
- Add 1px `colors.border` bottom separator below chips

**1b. Replace PopularSection carousel with ranked list**
- Create `RankedTemplateRow` component (replaces TrendingCard for main view)
  - Layout: rank number (Literata 34px) | emoji icon | name + frequency | add button
  - Full-width rows separated by 1px dividers
- Modify `PopularSection.tsx`: Switch from horizontal FlatList to vertical list of 5 items
- Keep TrendingCard for SeeAllView (it works well in list contexts)

**1c. Reorder sections**
- `MainBrowseView.tsx`: Remove FeaturedCollection, reorder to: Popular → Packs → Categories
- Move PremiumPacksSection above CategoryGrid

**1d. Convert CategoryGrid to compact list**
- Rework `CategoryGrid.tsx`: Full-width rows instead of 2-column tiles
- Each row: 40px colored circle with emoji | category name | count (monospace) | chevron
- Keep "Show all" expand logic

### Phase 2: New "Backed by Research" section

**2a. Data layer**
- Extend `useMainBrowseData.ts`: Add `researchSources` computed property
  - Group templates by `scientificReference`, deduplicate, count per source
  - Return: `{ sourceName, templateCount, sourceType, templates[] }`

**2b. Component**
- Create `ResearchSection/` component directory
  - Horizontal FlatList of 200px-wide cards
  - Card shows: source name, template count, source type icon (Book/Beaker)
  - Tap card → navigate to filtered view showing templates from that source

### Phase 3: Visual polish pass

**3a. Section header typography**
- Create shared `SectionHeader` component: uppercase caption, letter-spacing, optional "See all" link
- Replace all inline section titles across PopularSection, CategoryGrid, PremiumPacksSection

**3b. Spacing + surfaces**
- Standardize inter-section spacing to 48px
- Remove card borders, rely on shadows
- Update pack card border radius to 24px

**3c. Science credibility footer**
- Small centered text block below categories
- "Every template links to peer-reviewed research. Tap any to see the study."

---

## Key Files

| File | Change |
|------|--------|
| `src/screens/TemplatesScreen/views/MainBrowseView.tsx` | Layout restructure: sticky search+chips, reorder sections, remove hero |
| `src/screens/TemplatesScreen/views/MainBrowseView.types.ts` | New props for chips, research section |
| `src/screens/TemplatesScreen/TemplatesScreen.tsx` | Wire chip state, research data |
| `src/screens/TemplatesScreen/hooks/useMainBrowseData.ts` | Add researchSources computation |
| `src/screens/TemplatesScreen/components/PopularSection/PopularSection.tsx` | Carousel → ranked list |
| `src/screens/TemplatesScreen/components/CategoryGrid/CategoryGrid.tsx` | 2-col grid → compact list |
| `src/screens/TemplatesScreen/components/CategoryGrid/CategoryTile.tsx` | Tile → list row |
| `src/screens/TemplatesScreen/components/PremiumPacksSection/PremiumPackCard.tsx` | Styling updates |
| `src/screens/TemplatesScreen/components/QuickFilterChips/QuickFilterChips.tsx` | Already built, just wire up |

### Existing code to reuse
- `QuickFilterChips` + `CHIP_CATEGORIES` — already implemented, just not rendered in MainBrowseView
- `getTimeAwareFeatured()` in `featuredCollections.ts` — reuse time-awareness for header subtitle
- `AddButton` component — reuse in ranked list rows
- `formatPopularity()` — reuse for popularity display
- `CATEGORY_META` — reuse for list row colors and icons
- `shadows.card`, `shadows.subtle` from theme — use instead of hardcoded borders
- `typography.caption`, `fontFamilies.monospace` from theme — for new typography hierarchy

### New components to create
- `RankedTemplateRow/` — full-width row for popular list (rank # + template info + add button)
- `ResearchSection/` — horizontal carousel of research source cards
- `SectionHeader` — shared uppercase caption header with optional "See all" link

---

## Verification

1. **Visual check**: Open the app on iOS simulator, navigate to Habit Library via bottom action bar
2. **Layout order**: Confirm sections appear as: Search+Chips (sticky) → Popular ranked list → Starter Packs → Research carousel → Categories list
3. **QuickFilterChips**: Tap chips, verify templates filter correctly
4. **Ranked list**: Verify #1-#5 display with serif rank numbers, add button works
5. **Category list**: Verify compact rows with icon circles, counts, chevrons, and expand/collapse
6. **Research section**: Verify cards group by scientific reference, show counts
7. **Dark mode**: Toggle dark mode, verify all new components use theme-aware colors
8. **Spacing**: Verify consistent 48px gaps between sections
9. **Typography**: Verify uppercase section headers, monospace data, serif rank numbers
