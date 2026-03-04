# CalendarTimeline Visual Polish Plan

## Context

The CalendarTimeline on the home page works correctly but feels visually flat compared to the rest of the app. Day states (complete/today/empty/partial/future) lack clear differentiation, the header area feels cluttered, animations are stiff, and the overall color/shadow harmony could be tighter. This plan addresses all four areas with surgical edits to existing files using existing design system tokens.

---

## Changes (ordered by impact)

### 1. Better Day Cell State Differentiation

**File: `src/components/CalendarTimeline/components/DayCellContent.helpers.ts`**

- Add `isPartial` param to `getDayCellStyles`
- **Past empty cells**: Add subtle 1px border using theme border token (`#DDD8D2` light / `#374151` dark) — gives definition vs. the transparent look today
- **Partial cells** (some habits done): Add 1.5px amber border (`streak[300]`) to the cell itself, not just the dot below — makes partial progress visible at cell level
- **Future cells**: Add `opacity: 0.4` to container — clearly "ghosted" vs past empty

**File: `src/components/CalendarTimeline/components/DayCellContent.tsx`**

- Pass `completionStatus === 'partial'` as `isPartial` to `getDayCellStyles`

**File: `src/components/CalendarTimeline/CalendarTimeline.styles.ts`**

- `getCompleteDayCell`: Use `primary[600]` (`#059669`) bg instead of `primary[500]` — deeper, more saturated green. Bump `shadowRadius` to 10/14 and `shadowOpacity` to 0.4/0.55 for more lift
- `COMPLETION_DOT_SIZES.partial`: 6 -> 7, `streak[300]` -> `streak[500]` (`#8B6208`) for better contrast
- `STREAK_CONNECTOR`: height 3 -> 3.5, opacity 0.25 -> 0.35 (light), 0.20 -> 0.30 (dark)

**File: `src/components/CalendarTimeline/components/CheckBadge.tsx`**

- `BADGE_SIZE`: 16 -> 18, add `primary[100]` bg tint, `borderWidth: 1.5` with `colors.card` border
- Check icon size: 9 -> 10
- Spring: `springs.bouncy` -> `springs.celebration` (snappier pop)

### 2. Header/Greeting Cleanup

**File: `src/components/CalendarTimeline/components/ProgressGreeting.tsx`**

- Add `marginTop: 4` wrapper around WeekNavRow in expanded layout
- Add `gap: 8` to `COLLAPSED_ROW` for breathing room when greeting is collapsed

**File: `src/components/CalendarTimeline/components/WeekNavRow.tsx`**

- Glass chip border: `rgba(255,255,255,0.6)` -> `rgba(45,42,38,0.12)` (warm-toned, visible on parchment)
- Glass chip bg: opacity 0.5 -> 0.65 (light), 0.6 -> 0.7 (dark)
- Dark border: `rgba(55,65,81,0.35)` -> `rgba(255,255,255,0.10)`
- BlurView intensity: 40 -> 50 (light), 30 -> 40 (dark)

**File: `src/components/CalendarTimeline/components/ProgressText.tsx`**

- Use `fontFamilies.monospace` for the numeric values (`{completed}` and `{total}`) — gives numbers a data-display quality

### 3. Animation Refinement

**File: `src/components/CalendarTimeline/CalendarTimeline.hooks.ts`**

- `useWeekTransition`: opacity start 0.3 -> 0, slide 24px -> 16px (less jarring), fade duration 200ms -> 280ms with `Easing.out(Easing.cubic)` — smoother reveal

**File: `src/components/CalendarTimeline/components/StripNav.tsx`**

- Remove `useBreathe()` hook entirely (violates design system rule: "No decorative loops, idle animations, or novelty motion")
- Replace with static `opacity: 0.35` on chevrons
- Reduces file from 86 to ~55 lines and removes 2 shared values + 1 useEffect from the render tree

### 4. Spacing, Shadows & Color Harmony

**File: `src/components/CalendarTimeline/CalendarTimeline.styles.ts`** (continued)

- `getShelfBackgroundColor` light: `colors.light.gradientMid` (`#F0EDE8`) -> `colors.light.surfaceMuted` (`#FAF8F5`) — clearer visual separation from app background
- `getTodayHighlight` dark: Replace hardcoded `#3D2F0A` bg with `rgba(232,185,77,0.12)` (translucent streak gold, modern dark mode feel)
- `getCompleteDayCell`: elevation 3 -> 4 for more depth

---

## Files Modified (10 total)

| File                         | Lines Now | Changes                                                       |
| ---------------------------- | --------- | ------------------------------------------------------------- |
| `DayCellContent.helpers.ts`  | 80        | Add isPartial, border for empty/partial/future                |
| `DayCellContent.tsx`         | 99        | Pass isPartial prop                                           |
| `CalendarTimeline.styles.ts` | 112       | Complete cell color, dot sizes, connectors, shelf, today dark |
| `CheckBadge.tsx`             | 69        | Size/style/spring upgrade                                     |
| `ProgressGreeting.tsx`       | 92        | Spacing between rows                                          |
| `WeekNavRow.tsx`             | 91        | Glass chip contrast                                           |
| `ProgressText.tsx`           | 53        | Monospace numbers                                             |
| `CalendarTimeline.hooks.ts`  | 99        | Week transition smoothing                                     |
| `StripNav.tsx`               | 86        | Remove breathing animation                                    |
| `useTodayGlow.ts`            | 74        | No changes (kept as-is)                                       |

No new files. All files stay under 100 lines.

---

## Verification

1. `npx expo start` — launch the app
2. Check light mode home screen:
   - Past complete days: deeper green (#059669), bigger check badge with green tint, stronger glow
   - Today (incomplete): amber border + breathing glow (unchanged)
   - Past empty: subtle warm border visible
   - Partial: amber border on cell + larger amber dot below
   - Future: clearly faded (0.4 opacity)
   - Streak connectors: slightly thicker and more visible
   - Shelf: warmer white background, clear contrast with app canvas
   - Glass chip: warm-toned border visible on parchment
   - Header: greeting and nav row have breathing room
3. Check dark mode: translucent amber today highlight, all borders visible
4. Swipe weeks: smoother transition (opacity 0 -> 1, smaller slide)
5. Chevrons: static, no breathing animation
6. High contrast mode: verify borders and badges still work
7. Run `npm run lint:max-lines` — no violations
