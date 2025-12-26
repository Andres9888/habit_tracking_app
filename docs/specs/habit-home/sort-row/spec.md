# Sort Row UX Improvements

## Overview

Improve the habit list sort UI to increase discoverability, engagement, and user success—driving retention and indirect monetization through a better experience.

## Current State

- Small dropdown button in "My Habits" section header
- Opens full-screen centered modal with 8 sort options
- Amber highlight when non-default sort is active
- Low visual prominence, easy to miss
- "My Habits" label row wastes vertical space

## Goals

1. **Improve discoverability** — make sort feature more visible and inviting
2. **Enhance usability** — faster access, clearer options with descriptions
3. **Drive engagement** — help users find the right sort for their workflow
4. **Support habit success** — sorting by strength/streak helps users focus on what matters
5. **Save space** — eliminate wasteful section header row

---

## Design

### Sort Trigger: Dark Chip

Replace the "My Habits" section header row with a compact dark chip at the top of the habit list.

```
┌─────────────────────────────────────┐
│ [↕ Custom ▾]  7 habits              │
├─────────────────────────────────────┤
│ ○ Morning meditation          5 🔥  │
│ ○ Exercise                    8 🔥  │
└─────────────────────────────────────┘
```

**Specifications:**
- Dark pill button (`bg-stone-800`, white text)
- Contains: sort icon + current sort label + chevron
- Habit count displayed next to chip (`text-stone-400`, "7 habits")
- Height: ~32px (saves ~12px vs current row)
- Matches "Add Habit" button style for visual consistency

**Visual States:**
- Default: `bg-stone-800` with white text
- Pressed: scale 0.95, `bg-stone-700`
- Non-default sort active: optional amber accent or keep consistent dark

### Bottom Sheet Modal

Replace centered modal with iOS-style bottom sheet.

**Structure:**
1. **Drag handle** — 40px wide, centered, `bg-stone-300`
2. **Header** — "Sort Habits" title + "Done" button
3. **Quick pick chips** — horizontal scroll row
   - Chips: Custom, A-Z, Strength, Streak, Day Phase
   - Selected: `bg-stone-800` white text
   - Unselected: `bg-stone-100` dark text
4. **Detailed options list** — scrollable list with:
   - Icon in colored rounded container (40x40, gradient bg)
   - Title (15px, semibold)
   - Description (12px, muted)
   - Checkmark for selected option

**Animation:**
- Slide up with spring (damping: 20, stiffness: 300)
- Backdrop fade to 40% black
- Dismiss: drag down or tap backdrop

### Sort Options

| Value | Label | Description | Icon | Icon BG |
|-------|-------|-------------|------|---------|
| `manual` | Custom Order | Drag to reorder manually | `grip-vertical` | stone |
| `day_phase` | Day Phase | Push → Pivot → Pull | `sun` | amber→orange |
| `name_asc` | Name (A–Z) | Alphabetical order | `arrow-down-a-z` | stone |
| `name_desc` | Name (Z–A) | Reverse alphabetical | `arrow-up-a-z` | stone |
| `strength_asc` | Strength (Low → High) | Focus on habits that need attention | `zap` | emerald→teal |
| `strength_desc` | Strength (High → Low) | See your strongest habits first | `zap` | emerald→teal |
| `streak_asc` | Streaks (Low → High) | Protect habits at risk | `flame` | red→orange |
| `streak_desc` | Streaks (High → Low) | Celebrate your best streaks | `flame` | red→orange |

---

## UX Behaviors

### Trigger Chip
- Shows current sort mode label (abbreviated: "Custom", "A-Z", "Strength ↑", etc.)
- Shows habit count next to chip
- Press animation: scale 0.95 with 50ms timing
- Release animation: spring back (damping: 15, stiffness: 300)
- Haptic: light impact on press, selection on open

### Bottom Sheet
- Slides up from bottom with spring animation
- Backdrop dims (40% black)
- Tap outside or drag down to dismiss
- Quick chips provide one-tap access to common sorts
- Selection triggers:
  - Selection haptic feedback
  - Immediate sort change
  - Sheet dismisses automatically
  - List animates to new order

### Drag-to-Reorder
- Only enabled when sort mode is `manual`
- When other sort is active, drag is disabled
- Visual hint could show "Switch to Custom to reorder" (optional)

---

## Accessibility

- Trigger: `accessibilityRole="button"`
- Trigger: `accessibilityLabel="Sort habits, currently sorted by {mode}"`
- Trigger: `accessibilityHint="Opens sort options"`
- Bottom sheet: `accessibilityViewIsModal={true}`
- Focus trap within sheet when open
- Each option: `accessibilityRole="radio"`, `accessibilityState={{ checked }}`

---

## Tasks

### Phase 1: Sort Trigger Chip

#### 1.1 Create SortChip component
- [x] Create `src/features/habits/components/SortChip/SortChip.tsx`
- [x] Create `src/features/habits/components/SortChip/index.ts`
- [x] Dark pill button: `bg-stone-800`, `rounded-full`, white text
- [x] Layout: sort icon (`arrow-up-down`) + label + chevron (`chevron-down`)
- [x] Props: `sortMode`, `habitCount`, `onPress`
- [x] Display habit count next to chip: "7 habits" in `text-stone-400`

#### 1.2 Add animations
- [x] Use `react-native-reanimated` for press animation
- [x] Press: scale to 0.95 with 50ms timing
- [x] Release: spring back (damping: 15, stiffness: 300)
- [x] Add haptic feedback: light impact on press

#### 1.3 Sort label mapping
- [x] Create label map for abbreviated sort names:
  - `manual` → "Custom"
  - `day_phase` → "Day Phase"
  - `name_asc` → "A–Z"
  - `name_desc` → "Z–A"
  - `strength_asc` → "Strength ↑"
  - `strength_desc` → "Strength ↓"
  - `streak_asc` → "Streak ↑"
  - `streak_desc` → "Streak ↓"

#### 1.4 Accessibility
- [x] `accessibilityRole="button"`
- [x] `accessibilityLabel="Sort habits, currently sorted by {mode}"`
- [x] `accessibilityHint="Opens sort options"`

### Phase 2: Bottom Sheet Component

#### 2.1 Create SortBottomSheet component
- [x] Create `src/features/habits/components/SortBottomSheet/SortBottomSheet.tsx`
- [x] Create `src/features/habits/components/SortBottomSheet/index.ts`
- [x] Container with rounded top corners (`rounded-t-3xl`)
- [x] Drag handle: 40px wide, 4px tall, centered, `bg-stone-300`, `rounded-full`

#### 2.2 Sheet header
- [x] Title: "Sort Habits" (17px, bold)
- [x] "Done" button on right (14px, `text-amber-600`)
- [x] Tapping "Done" dismisses sheet

#### 2.3 Quick pick chips row
- [x] Horizontal `ScrollView` with chips
- [x] Chips: Custom, A-Z, Strength, Streak, Day Phase
- [x] Selected chip: `bg-stone-800`, white text, icon
- [x] Unselected: `bg-stone-100`, `text-stone-700`
- [x] Tap chip → select sort + dismiss sheet

#### 2.4 Detailed options list
- [x] Create `SortOptionRow` sub-component
- [x] Props: `icon`, `iconBg`, `title`, `description`, `selected`, `onPress`
- [x] Icon container: 40x40, rounded-xl, gradient background
- [x] Title: 15px, font-medium
- [x] Description: 12px, `text-stone-500`
- [x] Selected state: `bg-amber-50`, `border-amber-100`, checkmark icon
- [x] Map all 8 sort options with icons and descriptions

#### 2.5 Sheet animations
- [x] Slide up: spring animation (damping: 20, stiffness: 300)
- [x] Backdrop: fade to 40% black (`bg-black/40`)
- [x] Dismiss gestures:
  - [x] Tap backdrop to close
  - [x] Drag down gesture to close
- [x] Use `react-native-gesture-handler` for pan gesture

#### 2.6 Sheet accessibility
- [x] `accessibilityViewIsModal={true}`
- [x] Focus trap when open
- [x] Each option: `accessibilityRole="radio"`, `accessibilityState={{ checked }}`

### Phase 3: Integration

#### 3.1 Update HabitsSectionHeader
- [x] Remove "My Habits" label
- [x] Remove existing sort button and modal
- [x] Replace with `SortChip` component
- [x] Pass `habitCount` from parent

#### 3.2 Update HabitsList
- [x] Add `SortBottomSheet` component
- [x] Manage sheet open/close state
- [x] Pass `habitSortMode` and `onChangeHabitSortMode` to sheet
- [x] Calculate and pass `habitCount` to `SortChip`

#### 3.3 Wire up sort logic
- [x] Selection triggers `onChangeHabitSortMode`
- [x] Sheet auto-dismisses after selection
- [x] Haptic feedback: selection on sort change
- [x] Verify list re-sorts correctly

#### 3.4 Drag-to-reorder compatibility
- [x] Verify drag still works when sort is `manual`
- [x] Verify drag is disabled for other sort modes
- [x] `activationDistance` logic unchanged

### Phase 4: Polish & Testing

#### 4.1 Visual polish
- [x] Verify dark chip matches "Add Habit" button style
  - Updated SortChip to use LinearGradient (stone-800 to stone-900) with subtle shadow, matching Add Habit button's visual language
- [x] Smooth spring animations
  - SortChip: Press scale 0.95 (50ms), release spring (damping: 15, stiffness: 300)
  - SortBottomSheet: Slide spring (damping: 20, stiffness: 300), backdrop fade 200ms
- [x] Icon gradients render correctly
  - SortOptionRow uses expo-linear-gradient with diagonal gradient direction
- [x] Sheet shadow looks good on iOS/Android
  - iOS: shadowColor black, offset -4, opacity 0.1, radius 20
  - Android: elevation 20

#### 4.2 Haptic feedback
- [x] Light impact on chip press
  - SortChip: `triggerLightImpact()` in `handlePressIn` (line 91)
- [x] Selection feedback on sort change
  - SortBottomSheet: `triggerSelection()` in `handleSelectSort` (line 232)
  - SortChip: `triggerSelection()` when opening sheet (line 107)
- [ ] Test on iOS device *(Manual testing required - verify haptics work correctly on physical device)*

#### 4.3 Testing
- [x] All 8 sort options work correctly
  - Created comprehensive test suite in `SortBottomSheet.test.tsx`
  - Tests verify each sort option (manual, day_phase, name_asc, name_desc, strength_asc, strength_desc, streak_asc, streak_desc) renders with correct label and description
  - Tests verify `onSelectSortMode` is called with correct value when each option is selected
- [x] Quick chips match detailed options
  - Tests verify all 5 quick chips (Custom, Day Phase, A-Z, Strength, Streak) render and trigger correct sort mode
  - Tests verify selected state styling and sheet auto-close after selection
- [x] Dismiss gestures work (tap outside, drag down, Done button)
  - Tests verify Done button calls `onClose`
  - Tests verify backdrop press calls `onClose`
  - Pan gesture tested via mock (gesture handler mocked in jest.setup.js)
- [x] Accessibility: VoiceOver/TalkBack navigation
  - Tests verify `accessibilityViewIsModal` for modal behavior
  - Tests verify Done button has accessible role, label, and hint
  - Tests verify all options have `accessibilityRole="radio"` and `accessibilityState={{ checked }}`
  - Tests verify descriptive labels combine title + description for screen readers
- [x] Habit count updates correctly
  - SortChip tests cover habit count display (singular/plural forms)
  - Tests verify counts for 0, 1, and multiple habits

#### 4.4 Cleanup
- [x] Remove old `HabitsSectionHeader` modal code
  - Verified: HabitsSectionHeader.tsx has been fully simplified to only contain SortChip component
  - No old modal code, state management, or modal-related imports remain
  - Component is clean with minimal footprint (35 lines)
- [x] Remove unused imports
  - Verified: All files in the sort redesign have clean imports
  - HabitsSectionHeader.tsx: Only imports View, SortChip, and HabitSortMode type
  - HabitsList.tsx: Uses SortBottomSheet correctly, no unused imports
  - SortChip.tsx and SortBottomSheet.tsx: All imports are utilized
- [x] Update any tests
  - SortBottomSheet.test.tsx exists with comprehensive coverage (409 lines)
  - No existing HabitsSectionHeader tests to update (none existed previously)

---

## File Changes

| File | Action |
|------|--------|
| `src/features/habits/components/SortChip/SortChip.tsx` | Create |
| `src/features/habits/components/SortChip/index.ts` | Create |
| `src/features/habits/components/SortBottomSheet/SortBottomSheet.tsx` | Create |
| `src/features/habits/components/SortBottomSheet/SortOptionRow.tsx` | Create |
| `src/features/habits/components/SortBottomSheet/index.ts` | Create |
| `src/features/habits/components/HabitsSectionHeader.tsx` | Modify (simplify) |
| `src/features/habits/components/HabitsList.tsx` | Modify |

## Dependencies

- `react-native-reanimated` (already installed)
- `react-native-gesture-handler` (already installed)
- `lucide-react-native` (already installed)

---

## Design Assets

- Trigger mockup: `.superdesign/design_iterations/sort_first_card_1.html` (Option D)
- Bottom sheet mockup: `.superdesign/design_iterations/sort_monetization_2.html` (Option C)
- Previous explorations:
  - `.superdesign/design_iterations/sort_row_variations_1.html`
  - `.superdesign/design_iterations/sort_position_mock_2.html`

## Success Metrics

- Increase in sort feature usage (track sheet opens)
- Increase in non-default sort adoption
- Decrease in time-to-first-sort for new users
- User retention correlation with sort usage

## Out of Scope

- Paywall/premium gating of sort options
- New sort algorithms
- Sort persistence changes (already persists to settings)
- Smart/AI sort suggestions (future enhancement)
