# Subtle Archive Modal Polish

## Context

The ArchivedHabitsModal was recently redesigned with card-based layout, selection mode, and batch actions. This plan addresses 4 small visual inconsistencies to bring the modal in line with the rest of the app's design language.

## Changes

### 1. Delete button shape: `rounded-lg` -> `rounded-full` (HIGH impact)
**File:** `src/components/ArchivedHabitsModal/components/CompactHabitRow.tsx:188`

The Resume button is a `rounded-full` pill, but the Delete button next to it is `rounded-lg` (square-ish). For a 32x32 icon button, `rounded-full` produces a circle matching every other action button in the app (close buttons, selection bar buttons, etc).

```diff
- className='h-8 w-8 items-center justify-center rounded-lg'
+ className='h-8 w-8 items-center justify-center rounded-full'
```

### 2. "Select" text -> tappable pill (HIGH impact)
**File:** `src/components/ArchivedHabitsModal/components/StatsSummaryBar.tsx:60-66`

The "Select" / "Select All" text is bare -- no background, reads as a label not a button. Every other interactive element in the modal has a fill. Add a subtle pill background:

```diff
  <Text
-   className='text-[13px] font-semibold'
-   style={{ color: colors.primary[600] }}
+   className='text-[13px] font-semibold'
+   style={{
+     color: colors.primary[600],
+     backgroundColor: `${colors.primary[600]}15`,
+     paddingHorizontal: 10,
+     paddingVertical: 4,
+     borderRadius: 9999,
+     overflow: 'hidden',
+   }}
  >
```

Uses the primary color at ~8% opacity for a very subtle tint that signals "this is tappable."

### 3. Card spacing: 10 -> 12 (MEDIUM impact)
**File:** `src/components/ArchivedHabitsModal/components/CompactHabitRow.tsx:204`

The only off-grid spacing in the modal. The app uses a 4px grid (`xs=4, sm=8, md=12, base=16`). Snap to grid:

```diff
- style={{ marginBottom: isLast ? 0 : 10 }}
+ style={{ marginBottom: isLast ? 0 : 12 }}
```

### 4. DangerZoneFooter button border (MEDIUM impact)
**File:** `src/components/ArchivedHabitsModal/components/DangerZoneFooter.tsx:51-56`

The "Delete All" button floats inside the danger container with no visual distinction from the surrounding text. Add a subtle border (matching the HabitEditScreen's DangerZone pattern):

```diff
  <AnimatedPressable
    ...
    className='flex-row items-center justify-center gap-2 rounded-xl px-4 py-3'
-   style={{ width: '100%' }}
+   style={{
+     width: '100%',
+     borderWidth: 1,
+     borderColor: danger.border,
+     opacity: 0.85,
+   }}
    onPress={onDeleteAll}
  >
```

## What I'm NOT changing
- Icon background opacity (`${accentColor}15`) -- diverging from WeekCompleteIndicator for barely-visible gain isn't worth it
- Emoji font size (26 is proportionally correct for the 44x44 container)
- hitSlop format differences (cosmetic code style only)

## Verification
1. Run `npx expo start` and navigate to Settings -> Archived Habits
2. Verify delete button is now a circle (not rounded-square)
3. Verify "Select" has a subtle pill background
4. Verify card spacing feels slightly more spacious
5. Verify DangerZoneFooter button has a subtle border
6. Check both light and dark mode
7. Enter selection mode and verify no regressions
