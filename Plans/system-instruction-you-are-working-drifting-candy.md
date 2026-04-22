# Habit Library — "Browse by area" Accordion Redesign (v4)

## Context

The habit library page (`TemplatesScreen` → `MainBrowseView` → `ExploreAllSection`) currently renders "Browse by area" as an always-visible top-3 preview per category with a "Show all" expand. With 6+ categories × 3 habit rows each = a long, low-signal scroll that flattens the taxonomy and pushes every category's first habits into direct competition.

The existing mockup `.superdesign/design_iterations/habit_library_redesign_4.html` proposes a targeted fix: convert this section to a **per-category accordion, collapsed by default**. Users see the full taxonomy as a scannable stack of slim category cards, expand only the ones they care about. The mockup is explicitly scoped to this one section — goal hero, search, Popular, and Packs stay identical.

**Why this improves the page:**
- Scan first, commit second — users see all categories at a glance before reading any habit
- Cuts vertical length of the section from ~30 scroll-screens to ~7
- Gives each category a real visual identity (icon + label + subtitle + count in a card), not just a header line
- Adds clear "open/closed" state (bg tint + chevron rotation) so the section reads like a proper list control

---

## Approach

**Primary: implement the v4 accordion pattern.**

### 1. Collapse default → header-only

File: `src/screens/TemplatesScreen/components/ExploreAllSection/ExploreAllSection.tsx:19-57`

Current `CategoryGroupSection` (inline):
```ts
const [expanded, setExpanded] = useState(defaultExpanded);     // false
// always renders:
(expanded ? group.templates : group.templates.slice(0, 3)).map(...)
```

Change: when `!expanded`, render **no habit rows** (remove the slice-3 preview entirely). When `expanded`, render **all** habits.

### 2. Card wrapper per category (accordion row)

Each category becomes a self-contained card:
- Default: `backgroundColor: colors.card`, `borderColor: colors.border`, `borderWidth: 1`, `borderRadius: 12`
- Open: warm off-white tint (use semantic token — propose `colors.surfaceHighlight` or inline `#FFFBF4` matching mockup; fall back to `colors.card` + `borderColor: colors.primary[200]` for dark mode)
- `overflow: hidden` so habit rows clip to the radius
- Body (habit rows) gets a top `borderTopWidth: 1, borderTopColor: colors.border` divider

### 3. Chevron-in-circle with rotation

File: `src/screens/TemplatesScreen/components/ExploreAllSection/CategoryGroupHeader.tsx:29-40`

Replace the current `ChevronDown`/`ChevronRight` swap with a single `ChevronDown` in a circular container that rotates with Reanimated (already a project dep):
- 20×20 circle, `backgroundColor: rgba(0,0,0,0.05)` default
- Open: `backgroundColor: colors.primary[100]` (green tint), rotated 180°
- Use `useAnimatedStyle` + `withTiming(rotation, { duration: 200 })`

### 4. Copy update to match mockup

File: `src/screens/TemplatesScreen/components/ExploreAllSection/ExploreAllSection.tsx:79-83`

- Section title: `"Browse by area"` → `"Discover more habits"`
- Intro/subtitle: `"Every strong habit fits into a larger part of your life."` → `"Tap a category to explore"`
  - Note: the current intro renders as a separate `Text` below the `SectionHeader`; moving to `SectionHeader.subtitle` prop keeps one header rhythm (the `SectionHeader` already supports `subtitle`).
- Remove the dedicated `intro` Text — use `SectionHeader subtitle` instead.

### 5. Line-count hygiene

Project enforces `max-lines: 100` (skip blanks+comments). Current:
- `ExploreAllSection.tsx` = 101 lines
- `CategoryGroupHeader.tsx` = 83 lines

After adding card wrapper + animated chevron, both will exceed. Decompose per `docs/DECOMPOSITION_PATTERNS.md`:

**New files:**
- `ExploreAllSection/AccordionCategoryCard.tsx` — card-wrapped `CategoryGroupSection` (the accordion row: card + header + conditional body)
- `ExploreAllSection/CategoryChevron.tsx` — animated chevron-in-circle
- `ExploreAllSection/CategoryGroupHeader.styles.ts` — extract styles if header grows past 100 lines

**Refactored files:**
- `ExploreAllSection.tsx` becomes a clean map over `AccordionCategoryCard` components (~50 lines)
- `CategoryGroupHeader.tsx` uses `CategoryChevron` instead of the swap (~60 lines)

### 6. Remove redundant "Show all" inner link

Previously: expanded showed all habits + a "Show all N" link acted as the expand toggle. Now the header IS the toggle and expanded shows all habits — the inner link is redundant. Remove from `CategoryGroupSection` (currently absent in code, but the Explore list hint text `s.intro` at line 100-101 should remain removed per step 4).

---

## Files to modify

| File | Change |
|---|---|
| `src/screens/TemplatesScreen/components/ExploreAllSection/ExploreAllSection.tsx` | Use new `AccordionCategoryCard`, update section copy, remove intro Text |
| `src/screens/TemplatesScreen/components/ExploreAllSection/CategoryGroupHeader.tsx` | Replace icon swap with `CategoryChevron`, tighten label/subtitle stack for card context |
| `src/screens/TemplatesScreen/components/ExploreAllSection/AccordionCategoryCard.tsx` | **New** — card wrapper + conditional habit list rendering |
| `src/screens/TemplatesScreen/components/ExploreAllSection/CategoryChevron.tsx` | **New** — 20×20 animated chevron-in-circle |
| `src/screens/TemplatesScreen/components/ExploreAllSection/index.ts` | Export new components if consumed elsewhere |

No changes needed to:
- `ExploreHabitRow.tsx` — row layout unchanged; it just renders inside the accordion body now
- `useGroupedTemplates.ts` — data shape unchanged
- `MainBrowseView.tsx` — still renders `ExploreAllSection` as the third stagger section

## Reuse opportunities (found during exploration)

- `useAddAnimation` (`ExploreHabitRow.hooks.ts`) — pattern for Reanimated style hook; model `CategoryChevron`'s rotation hook after it
- `SectionHeader` (`src/screens/TemplatesScreen/components/SectionHeader/SectionHeader.tsx`) already supports `subtitle` prop — use it instead of custom intro Text
- `triggerHaptic('selection')` (from `@/utils/haptics`) — call on toggle for parity with `ExploreHabitRow`'s add button
- Spacing/radius tokens: `spacing.md`, `borderRadius.medium` (12) — match mockup values, no magic numbers

---

## Verification

### Code-level
1. `npm run lint:max-lines` — confirm all new/modified files ≤100 lines
2. `npx tsc --noEmit` — type check
3. Pre-commit: run lint --fix + prettier manually (pre-commit hooks broken upstream per memory)

### Visual parity vs mockup
Render on iOS simulator (`bunx expo start`), open the habit library (HabitsScreen → templates modal), scroll past hero/search/popular to "Discover more habits":

| Check | Expected |
|---|---|
| Initial state | All 6+ category rows visible as closed cards (header only), no habit rows |
| Tap a closed card | Card bg tints warm off-white, chevron rotates 180°, habits render below divider |
| Tap an open card | Card reverts to default bg, chevron rotates back, habits unmount |
| Multiple open | More than one can be open simultaneously (per mockup decision) |
| Section header copy | Reads "Discover more habits" · "Tap a category to explore" · "N habits" on right |
| Dark mode | Card bg shifts to `colors.card` dark variant; open tint stays subtle |
| Accessibility | VoiceOver announces "collapsed/expanded"; `accessibilityState={{ expanded }}` wired |

### Screenshot diff
Capture before/after of the "Browse by area" section, overlay or side-by-side against `.superdesign/design_iterations/habit_library_redesign_4.html` Variant B. Feedback memory requires mockup validation before claiming done.

### Follow-ups (explicitly out of scope)
These surfaced during audit but are NOT part of this plan — would each need their own mockup pass:
- Hero featured-card CTA pill visual weight
- `TrendingCard` (Popular section) visual language vs goal cards
- Science-backed badge consistency across card types
