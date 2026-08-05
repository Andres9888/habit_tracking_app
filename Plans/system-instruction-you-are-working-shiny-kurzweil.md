# Month Calendar — Chain Toggle (Implementation)

## Context

The habit-details page month calendar (`MonthlyCalendarGrid`) shows each completed day as a standalone filled cell. The user wants an optional **chain mode** that draws thin habit-colored connectors between consecutive completed days within the same week row, toggleable from a control in the calendar header.

This is the production implementation of the toggle direction prototyped in `.superdesign/design_iterations/month_chain_toggle_1.html`.

**Known design tradeoff (already discussed):** A month grid breaks every 7 cells, so a 30-day streak shows as 4–5 disconnected within-week chains rather than one continuous bar. The user is shipping this anyway as a first pass on the month surface; the heatmap chain treatment will be a separate later decision.

## Scope

- **In scope (v1):** local component-state toggle, within-week horizontal connectors, fade-in animation, accessibility label on the toggle.
- **Out of scope (v1):** persistence (no AsyncStorage), cross-week connectors, vertical/diagonal jumps, chain treatment on the year heatmap.

## Recommended Approach

A new `ChainConnectors` overlay component is rendered inside each week row, on top of the row's relative container but behind the day cells. It computes "draw a bar between cell i and cell i+1" for every adjacent pair where both days are completed within the current month.

Toggle UI is a small icon-only button in `MonthNavigation` (next to the month name pressable). Active state = habit color; inactive = muted gray.

### Files & Changes

| File | Action | Notes |
|---|---|---|
| `src/components/BinaryHeatmap/MonthlyCalendarGrid/ChainConnectors.tsx` | **NEW** | ~60–80 lines. Pure presentational. Accepts `week`, `habitColor`, `visible`. Renders a `<View>` overlay with absolutely-positioned connector `<Animated.View>`s for each adjacent completed pair within the week. Fades in/out with `useSharedValue` + `useAnimatedStyle` based on `visible`. |
| `src/components/BinaryHeatmap/MonthlyCalendarGrid/MonthlyCalendarGrid.tsx` | **MODIFIED** | Add `const [showChain, setShowChain] = useState(false);` plus `toggleChain = useCallback(...)` with haptic. Pass `showChain` to `AnimatedWeeksGrid`. Pass `showChain` + `toggleChain` to `MonthNavigation`. |
| `src/components/BinaryHeatmap/MonthlyCalendarGrid/MonthNavigation.tsx` | **MODIFIED** | Add `showChain: boolean` and `onToggleChain: () => void` props. Add a `<Pressable>` with `Link2` icon (lucide-react-native) between the month-name button and the prev/next nav buttons. Active state inline-styled with habit color is **not** available here — pass `habitColor` through too. |
| `src/components/BinaryHeatmap/MonthlyCalendarGrid/AnimatedWeeksGrid.tsx` | **MODIFIED** | Accept `showChain: boolean` and pass it down. Wrap each week's row `<View>` so it is `position: 'relative'`. Render `<ChainConnectors week={week} habitColor={habitColor} visible={showChain} />` as a sibling overlay (zIndex behind day cells, or before them in render order so day cells naturally cover any overlap). |
| `src/components/BinaryHeatmap/MonthlyCalendarGrid/styles.ts` | **MODIFIED** | Add `position: 'relative'` to `row` (or new `weekRowRelative` style). Add a small `chainToggle` style for the header button. |
| `src/components/BinaryHeatmap/MonthlyCalendarGrid/types.ts` | **MODIFIED** | Add optional `habitColor` to `MonthNavigationProps` if not already there. |

### Connector Geometry

Each day cell is in a `flex: 1` wrapper of height 40px. The cell itself is 36×36 centered. The connector should:

- Span horizontally from roughly the right edge of cell `i` to the left edge of cell `i+1`
- Vertical center of the cell wrapper (~y=20)
- Height: 4px, border-radius 2px, background `habitColor`, opacity 0.85
- Position via absolute layout with `left: (i + 0.5) * cellWidth + halfCell` style math, OR by measuring the row width with `onLayout` and computing in JS

Implementation choice: use **percentage-based** positioning (`left: ${(i + 0.5) / 7 * 100}%`) and **fixed pixel** width `(rowWidth/7 - 36)` measured via `onLayout` on the row container. This avoids hardcoding the cell pitch.

### Toggle Button Spec

- Icon: `Link2` from `lucide-react-native` at `iconSizes.small`
- Size: 34×34 pressable (matches existing nav buttons)
- Border + radius matches existing nav buttons
- When `showChain` is true: icon color = `habitColor`, border color = `habitColor`
- When false: icon color = `colors.text.secondary`, border = `colors.border`
- `accessibilityLabel`: `"Toggle chain connectors. Currently {on|off}."`
- Haptic: `triggerHaptic('selection')` on toggle

### Animation

`ChainConnectors` accepts `visible` and uses Reanimated:

```ts
const opacity = useSharedValue(visible ? 1 : 0);
useEffect(() => { opacity.value = withTiming(visible ? 1 : 0, { duration: 220 }); }, [visible]);
```

Each connector segment shares the same opacity. No stagger in v1 (keep it simple).

## Critical Existing Functions to Reuse

- `useThemeColors()` — `src/theme/index.ts` — colors + isDark
- `triggerHaptic('selection')` — `src/utils/haptics.ts` — feedback on toggle
- `iconSizes.small` / `iconSizes.medium` — `src/theme/iconSizes.ts`
- `useCalendarDays()` — already produces `weeks: DayData[][]` with `isCompleted` per day, no changes needed

`DayData.isCompleted` and `DayData.isCurrentMonth` already exist — those are the only fields `ChainConnectors` needs to read.

## File Size Discipline (per CLAUDE.md ≤100 lines rule)

- `MonthlyCalendarGrid.tsx`: 79 → ~86 lines ✓
- `MonthNavigation.tsx`: 82 → ~95 lines ✓ (close — keep added code tight)
- `AnimatedWeeksGrid.tsx`: 43 → ~50 lines ✓
- `ChainConnectors.tsx`: new, target ~70 lines ✓
- `styles.ts`: 111 → ~118 lines ⚠️ (already over 100; adding 2 small entries pushes further but file is theme tokens not logic — acceptable; flag for follow-up cleanup)

## Verification

1. `bun run typecheck` (or project's `tsc --noEmit`) — must pass clean
2. `npm run lint:max-lines` — confirm no new violations beyond the existing `styles.ts` debt
3. Manual: open Habit Detail screen → Calendar tab → toggle chain on/off, navigate months, confirm:
   - Connectors only appear between consecutive completed days within the same week row
   - Missed days break the chain (no connector touches them)
   - Toggle persists during the session but resets on remount (expected — no persistence yet)
   - Cross-week boundaries don't render connectors
   - Today's ring stays visible
4. Try on at least one habit with a long visible streak so the within-week chains actually appear.

## Follow-Up (Not This Change)

- Persistence via AsyncStorage (`@habit-tracker/calendar.showChain`)
- Settings-screen entry exposing it globally
- Halo-outline variant on the year heatmap (decided in a separate session)
