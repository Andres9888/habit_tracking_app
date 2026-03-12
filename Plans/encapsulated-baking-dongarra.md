# Plan: Handle Long Habit Names

## Context

All habit name displays currently truncate to a single line (`numberOfLines={1}`). When users create habits with longer descriptive names (e.g., "Practice mindfulness meditation for 10 minutes"), the name gets cut off and becomes unreadable. The max allowed length is 100 characters, so there's a real chance of truncation on most screen widths.

## Recommendation: Allow 2-Line Wrapping

**Why this over alternatives:**
- **2-line wrapping** is the standard mobile pattern (Apple Reminders, Todoist, Things all do this)
- **Dynamic font sizing** creates visual inconsistency across cards
- **Long-press to reveal** is not discoverable
- **Marquee/scrolling** is distracting and hard to read
- 2 lines with ellipsis is the simplest change and covers ~95% of realistic habit names

## Changes

### 1. HabitCardContent (Home Screen Cards)
**File:** `src/components/HabitCard/components/HabitCardContent.tsx:45-46`

- Change `numberOfLines={1}` to `numberOfLines={2}`
- Add `ellipsizeMode='tail'` for consistent "..." on overflow
- Layout uses flexbox (`habitInfo` has `flex: 1`), so wrapping should work naturally
- The card has `minHeight: 76` and `justifyContent: 'center'`, so a second line fits

### 2. CardHeader (Draggable Habit List)
**File:** `src/components/DraggableHabit/CardHeader.tsx:82-84`

- Change `numberOfLines={1}` to `numberOfLines={2}`
- **Issue:** Title uses absolute positioning (`TITLE_OVERLAY_STYLE` in `CardHeader.styles.ts`) spanning `top:0, bottom:0` within a parent whose height is set by the 36px icon. Two lines at 22px line-height = 44px, which overflows the ~36px container.
- **Fix:** Increase icon container from `h-9 w-9` (36px) to `h-11 w-11` (44px) to accommodate 2-line text, OR remove the 5-column absolute positioning grid and switch to a simpler flexbox row layout.
- Preferred: Bump icon to `h-11 w-11` — minimal change, keeps existing grid logic.

### 3. HabitDayToggleRow (Bottom Sheet)
**File:** `src/components/DayHabitsBottomSheet/HabitDayToggleRow/HabitDayToggleRow.tsx:65-67`

- Change `numberOfLines={1}` to `numberOfLines={2}`
- Add `ellipsizeMode='tail'`
- Layout is simple flex row with `flex-1` on the text — wrapping works naturally

## Files to Modify

1. `src/components/HabitCard/components/HabitCardContent.tsx` — numberOfLines + ellipsizeMode
2. `src/components/DraggableHabit/CardHeader.tsx` — numberOfLines + icon size bump
3. `src/components/DayHabitsBottomSheet/HabitDayToggleRow/HabitDayToggleRow.tsx` — numberOfLines + ellipsizeMode

## Verification

1. Create a test habit with a long name (e.g., "Practice mindfulness meditation for at least ten minutes every morning")
2. Verify it wraps to 2 lines on all three surfaces:
   - Home screen HabitCard
   - Main draggable habit list
   - Day habits bottom sheet
3. Verify short names still display on 1 line with no extra spacing
4. Verify extremely long names (near 100 chars) truncate with "..." on the second line
5. Check card alignment — icons, checkmarks, chevrons should still be vertically centered
