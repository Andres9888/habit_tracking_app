# Header Redesign Spec

## Overview

Simplify the Habit Homepage header by:

1. Replacing the lightbulb icon with **Book Open** icon for templates (better conveys "education + import habits")
2. Moving the **sort control** from header to a section label above the habit list

## Related Artifacts

- **Design Mocks:**
  - `.superdesign/design_iterations/header_redesign_3.html`
  - `.superdesign/design_iterations/header_redesign_2.html`

---

## Changes

### 1. Replace Templates Icon (Lightbulb → Book Open)

**Current:**

- Icon: `Lightbulb` from lucide-react-native
- Color: `text-amber-500` (`#f59e0b`)
- Meaning: Vague "ideas" — doesn't clearly convey education or import

**New:**

- Icon: `BookOpen` from lucide-react-native
- Color: `text-violet-600` (`#7c3aed`) with `bg-violet-50/70` and `border-violet-200`
- Meaning: Clear "learn & discover" + "browse collection"

**Files to Update:**

- `src/features/habits/components/HabitsHeader.tsx`
  - Import `BookOpen` instead of `Lightbulb`
  - Update icon component and colors

---

### 2. Move Sort to Section Header Above List

**Current:**

- Sort button in header row (4 buttons total: Add, Templates, Sort, Settings)
- Takes ~70px width when showing label like "A-Z"

**New:**

- Remove sort button from header (now 3 buttons: Add, Templates, Settings)
- Add section header row above habit list: "MY HABITS" label on left, sort control on right
- Sort shows current mode (e.g., "A–Z", "Custom", "Strength")

**Layout:**

```
┌─────────────────────────────────────────────┐
│ [+ Add Habit]              [📖] [⚙]        │  ← Header (3 buttons)
├─────────────────────────────────────────────┤
│ [Momentum Meter - 4 of 7 done]              │
├─────────────────────────────────────────────┤
│ MY HABITS                        [↕ A–Z ▼] │  ← NEW: Section header with sort
├─────────────────────────────────────────────┤
│ [Habit Card 1]                              │
│ [Habit Card 2]                              │
│ ...                                         │
└─────────────────────────────────────────────┘
```

**Files to Update:**

- `src/features/habits/components/HabitsHeader.tsx`
  - Remove sort button, sort modal, and related state/handlers
  - Remove `ArrowUpDown` and `Check` imports if no longer needed
  - Remove `habitSortMode`, `onChangeHabitSortMode` props usage from header

- `src/features/habits/components/HabitsList.tsx` (or parent component)
  - Add new `HabitsSectionHeader` component above the list
  - Pass sort props to the section header instead

- **New Component:** `src/features/habits/components/HabitsSectionHeader.tsx`
  - Renders "MY HABITS" label + sort dropdown trigger
  - Contains sort modal (moved from HabitsHeader)
  - Props: `habitSortMode`, `onChangeHabitSortMode`, `habitCount`

---

## Visual Specifications

### Book Open Button

```tsx
<Pressable className='h-9 w-9 items-center justify-center rounded-full border border-violet-200 bg-violet-50/70'>
  <BookOpen color='#7c3aed' size={18} strokeWidth={2.25} />
</Pressable>
```

### Section Header

```tsx
<View className='mb-3 flex-row items-center justify-between px-1'>
  {/* Label */}
  <Text className='text-[11px] font-semibold uppercase tracking-wider text-stone-400'>
    My Habits
  </Text>

  {/* Sort Control */}
  <Pressable className='flex-row items-center gap-1.5 rounded-lg bg-stone-100 px-2 py-1'>
    <ArrowUpDown color='#78716c' size={14} />
    <Text className='text-[12px] font-medium text-stone-600'>{sortLabel}</Text>
    <ChevronDown color='#a8a29e' size={12} />
  </Pressable>
</View>
```

### Sort Control States

- **Default (Manual):** Gray background (`bg-stone-100`), gray text
- **Active (Any other sort):** Amber background (`bg-amber-50`), amber text/icon

---

## Out of Scope

- Changing the Add Habit button design
- Changing the Settings (cog) button design
- Modifying the Momentum Meter
- Changing sort options or logic (just moving the UI)

---

## Success Criteria

1. Header has only 3 buttons: Add Habit, Book Open (templates), Settings
2. Book Open icon clearly suggests "learn & browse habits"
3. Sort control appears above the habit list with "MY HABITS" label
4. Sort functionality works exactly as before (same options, same modal)
5. No extra vertical space wasted (section header is compact)

---

## Tasks

**Priority:** Medium
**Estimated Effort:** 1-2 hours

### Phase 1: Update Templates Icon

- [x] **Task 1.1: Replace Lightbulb with BookOpen** ✅ Completed
  - File: `src/features/habits/components/HabitsHeader.tsx`
  - Change import: `Lightbulb` → `BookOpen`
  - Update icon colors: amber → violet (`#7c3aed`, `border-violet-200`, `bg-violet-50/70`)
  - Update accessibility label to reflect "Browse habit templates" or similar
  - **Implementation notes:** Changed import from `Lightbulb` to `BookOpen`, updated button styling to violet theme, and updated accessibility hints/labels.

---

### Phase 2: Move Sort to Section Header

- [x] **Task 2.1: Create HabitsSectionHeader component** ✅ Completed
  - File: `src/features/habits/components/HabitsSectionHeader.tsx`
  - Create new component with "MY HABITS" label and sort control
  - Move sort modal JSX from HabitsHeader to this component
  - Props: `habitSortMode`, `onChangeHabitSortMode`, `habitCount?`
  - **Implementation notes:** Created new component with animated sort button, "MY HABITS" section label, sort control with ChevronDown indicator, and full sort modal. Sort control changes to amber styling when a non-manual sort is active.

- [x] **Task 2.2: Remove sort from HabitsHeader** ✅ Completed
  - File: `src/features/habits/components/HabitsHeader.tsx`
  - Remove sort button JSX
  - Remove sort modal JSX
  - Remove `isSortDropdownOpen` state
  - Remove sort-related handlers (`handleSortPress`, `handleSelectSortMode`, etc.)
  - Remove unused imports (`ArrowUpDown`, `Check` if not used elsewhere)
  - Remove `habitSortMode`, `onChangeHabitSortMode` from props interface
  - **Implementation notes:** Removed all sort-related code including SORT_OPTIONS constant, useState for dropdown, sortButtonScale animated value, sortButtonAnimatedStyle, all sort handlers, habitSortLabel computation, sort button JSX, and sort modal JSX. Also removed ArrowUpDown and Check icon imports. Header now has only 3 buttons: Add Habit, BookOpen templates, and Settings.

- [x] **Task 2.3: Integrate HabitsSectionHeader into list** ✅ Completed
  - File: `src/features/habits/components/HabitsList.tsx`
  - Add `HabitsSectionHeader` component above the habit list
  - Pass sort props through to the section header
  - Ensure proper spacing between momentum meter and section header
  - **Implementation notes:** Added HabitsSectionHeader import and placed it in renderHeader after CalendarTimeline but before the habit list. Component is conditionally rendered when totalHabits > 0. Sort props (habitSortMode, onChangeHabitSortMode) are now passed to HabitsSectionHeader instead of HabitsHeader.

---

## Verification Checklist

- [x] Header shows only 3 buttons (Add, Book, Settings) ✅ Verified: HabitsHeader.tsx contains only Plus, BookOpen, and Settings buttons
- [x] Book Open icon is violet colored and tappable ✅ Verified: Uses `border-violet-200 bg-violet-50/70` and `color='#7c3aed'`
- [x] Tapping Book Open still opens templates screen ✅ Verified: `onPress={handleTemplatesPress}` calls `openTemplatesScreen()`
- [x] "MY HABITS" label appears above habit list ✅ Verified: HabitsSectionHeader renders "My Habits" label
- [x] Sort control is visible next to the label ✅ Verified: Sort button rendered with `justify-between` layout
- [x] Tapping sort opens the sort modal with all options ✅ Verified: Modal contains all 8 SORT_OPTIONS
- [x] Selecting a sort option works correctly ✅ Verified: `handleSelectSortMode` updates state via `onChangeHabitSortMode`
- [x] Sort indicator shows current mode (amber when non-default) ✅ Verified: `isNonDefaultSort` triggers amber styling (`bg-amber-50`, `text-amber-800`)
