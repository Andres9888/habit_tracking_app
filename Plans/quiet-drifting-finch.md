# QuickStatsRow Redesign: Pills -> Stats Card

## Context

The 3 stat pills (streak, best streak, completions) on the Habit Detail screen clip on iPhone 16 Pro Max. The horizontal pill layout with emoji+number+label in each pill exceeds the ~398px available width. Beyond fixing the overflow, we want the stats to be visually consistent with the rest of the detail page, which uses a card-based visual language (rounded-2xl containers, card backgrounds, warm shadows).

## Approach: Full-Width Card with 3 Equal Columns

Replace the 3 separate pill badges with a single card container holding 3 equal-width columns separated by thin vertical dividers.

**Why this approach:**
- `flex: 1` columns guarantee no clipping on any screen size (iPhone SE through Pro Max)
- Matches the visual language of the page: Hero -> **Stats Card** -> Tabs Card -> Content Cards
- The app already uses this pattern in `QuickStatsStrip/StatCard` and `StatsGrid/StatCard`
- Simpler implementation than the current per-pill color system

**Visual flow after change:**
```
[Hero: 80px emoji icon + habit name + schedule]
                    |
[Stats Card: streak | best streak | completions]  <-- NEW
                    |
[Tabs Card: Calendar | Strength]
                    |
[Content: heatmap / strength]
```

## Implementation

### File: `QuickStatsRow.tsx` (rewrite, ~85 lines)

**Layout:**
```
Animated.View (card: card bg, borderRadius 16, card shadow)
  View (flexDirection: row, alignItems: center)
    StatColumn (flex:1, centered — emoji on top, value, label below)
    View (separator: 1px wide, 32px tall, border color)
    StatColumn
    View (separator)
    StatColumn
```

**StatColumn contents (stacked vertically, centered):**
1. Emoji — fontSize 18 (up from 12, breathing room in card)
2. Value — JetBrains Mono, fontSize 20, bold, `colors.text.primary`
3. Label — DM Sans, fontSize 11, medium weight, `colors.text.tertiary`

**Active streak state:**
- Value text: `colors.status.successText` (green) instead of primary
- Small tinted circle behind emoji: `colors.status.successLight` background
- (Subtler than current full-pill green flood, more refined for card context)

**Token usage:**

| Property | Token | Value |
|----------|-------|-------|
| Card bg | `colors.card` | #EDEAE5 / dark equivalent |
| Card radius | `borderRadius.card` | 16 |
| Card shadow | `shadows.card` | warm #2D2A26 |
| Column padding | `spacing.md` | 12px vertical |
| Separator | `colors.border` | 1px wide, 32px tall |
| Value font | `fontFamilies.monospace` | JetBrains Mono |
| Label font | `fontFamilies.primary.text` | DM Sans |
| Animation | `FadeInUp.duration(280).delay(120).springify().damping(18)` | Same as current |

### File: `HabitDetailContent.tsx` — No changes needed

Props interface stays identical (`bestStreak`, `currentStreak`, `totalCompletions`). The card styling is self-contained in QuickStatsRow.

## Width Budget Verification

| Device | Screen | Available | Per Column | Widest Content | Fits? |
|--------|--------|-----------|------------|----------------|-------|
| iPhone SE | 375px | 343px | ~113px | "completions" ~55px | Yes |
| iPhone 16 Pro | 393px | 361px | ~120px | "completions" ~55px | Yes |
| iPhone 16 Pro Max | 430px | 398px | ~132px | "completions" ~55px | Yes |

## Verification

1. Run `npx expo start` and check on iPhone SE, 16 Pro, and 16 Pro Max simulators
2. Verify no horizontal clipping on any device
3. Verify active streak state (green text + emoji circle) is visible
4. Verify dark mode renders correctly (separator visibility, card bg contrast)
5. Run `npm run lint:max-lines` to confirm file stays under 100 lines

## Critical Files
- `src/screens/HabitDetailScreen/components/QuickStatsRow.tsx` — primary change
- `src/screens/HabitDetailScreen/components/HabitDetailContent.tsx` — verify no changes needed
- `src/theme/spacing.ts` — reference for tokens
- `src/theme/typography.ts` — reference for font families
