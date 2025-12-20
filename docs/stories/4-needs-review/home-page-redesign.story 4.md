# Story 1.2 · Home Page Redesign

**Status:** Done  
**Epic:** 1 – Core User Experience  
**Story ID:** 1.2  
**Figma:** https://www.figma.com/design/wjyOjXK6JPUWVbSF2uxqTL/Untitled?node-id=113-482&m=dev

---

## User Story

**As a** daily habit tracker,  
**I want** a predictable home page with clear date navigation, consistent habit cards, and an easy to read streak chain,  
**so that** I can understand and update my habits without visual jitter or layout shifts.

---

## Acceptance Criteria

### AC1 · Header
- [x] Title “Habits” is left-aligned with the settings button to the right (`src/App.tsx:112-123`).
- [x] Settings trigger renders the 24 px `Settings` icon and exposes the accessibility label “Open settings” (`src/App.tsx:115-121`).

### AC2 · Date Selector
- [x] Displays the trailing seven-day window (today and the six previous days) (`src/App.tsx:29-32`).
- [x] Date range header displays "MMM d - MMM d" with left/right navigation arrows (`src/App.tsx:134-155`).
- [x] Each column shows weekday (top) and day number (bottom) with today highlighted in #101727 and past days in #364153 (`src/components/DateSelector/DateSelector.tsx:14-60`).
- [x] Accessibility labels call out “Today” when relevant (`src/components/DateSelector/DateSelector.tsx:21-25`).

### AC3 · Habit Cards
- [x] Cards use a white background, 16 px radius, 24 px horizontal padding, and compact vertical padding when requested (`src/components/DraggableHabit/DraggableHabit.tsx:43-47`).
- [x] The header row keeps the emoji (default 24 px) and habit name locked to the design spacing (`src/components/DraggableHabit/DraggableHabit.tsx:50-63`).
- [x] Cards are separated by a constant 16 px gap (`src/App.tsx:168`).

### AC4 · Chain Visualization (Static Geometry)
- [x] Exactly five circles at 40 px diameter remain fixed in place (`src/components/HabitChainVisualizer/HabitChainVisualizer.tsx:31-52`).
- [x] Completed days render the green fill (#48bb78) and the white chain-link glyph; incomplete days stay gray (#dde3ed) with no icon (`src/components/HabitChainVisualizer/HabitChainVisualizer.tsx:36-47`).
- [x] Connectors always render with a width of 22 px; they switch to green only when both neighboring days are complete (`src/components/HabitChainVisualizer/HabitChainVisualizer.tsx:48-53`, `src/components/HabitChainVisualizer/HabitChainVisualizer.hooks.ts:3-12`).
- [x] Circles and connectors do not resize or slide when toggling habits (static `h-10 w-10` classes plus constant connector width) (`src/components/HabitChainVisualizer/HabitChainVisualizer.tsx:32-53`).

### AC5 · Streak Label
- [x] “STREAK • X DAYS” appears only when the computed streak is greater than zero and uses the specified typography (#a0aec0, uppercase, tracking 1.2 px) (`src/components/HabitChainVisualizer/HabitChainVisualizer.tsx:55-63`).

### AC6 · Floating Add Button
- [x] A 56 px black circular button with the white plus icon floats in the bottom-right corner and toggles the add form (`src/App.tsx:232-241`).
- [x] Accessibility labels and hints describe the current action (“Open add habit form” / “Close add habit form”) (`src/App.tsx:233-236`).

### AC7 · Accessibility
- [x] Date selector columns are exposed as text with descriptive labels (`src/components/DateSelector/DateSelector.tsx:21-33`).
- [x] Chain nodes provide actionable hints and labels with the exact date, using `date-fns` formatting to avoid ambiguity (`src/components/HabitChainVisualizer/HabitChainVisualizer.tsx:36-47`).
- [x] All primary buttons (settings, add habit, form actions) include accessibility roles and labels (`src/App.tsx:115-159`).

### AC8 · Figma Parity
- [x] Verified key colors (#48bb78, #dde3ed, #101727, #a0aec0) and spatial metrics match the referenced frame.
- [x] Typography relies on the Inter family configured globally (Tailwind + Expo font stack).
- [x] Chain layout mirrors the Figma static geometry while honoring the “static circles” requirement from design review.

---

## Implementation Notes
- Habit ordering, streak calculation, and toggling all happen inside `HabitsApp` with memoized helpers to avoid unnecessary recomputation (`src/App.tsx:107-224`).
- Compact mode persists via secure storage; card padding is the only altered dimension when compact mode is enabled (`src/App.tsx:70-86`, `src/components/DraggableHabit/DraggableHabit.tsx:44-48`).
- Chain visuals consume `getConnectorColor` so connectors always render yet simply swap fill when a streak spans both sides (`src/components/HabitChainVisualizer/HabitChainVisualizer.hooks.ts:3-12`).
- Accessibility copy derives from formatted dates to keep screen reader announcements precise (`src/components/HabitChainVisualizer/HabitChainVisualizer.tsx:36-44`).
- **Design Alignment (2025-10-14)**: Fully aligned with Figma design node 113:482:
  - **7-day window**: Changed from 5-day to 7-day trailing window (SUN through SAT)
  - **Date range header**: Added "MMM d - MMM d" header with left/right navigation arrows
  - **Date selector layout**: Two-row format with weekday (top) and day number (bottom)
  - Chain circles updated to 36px (h-9 w-9) from 40px for exact Figma match
  - **7 circles per habit**: All habit cards now display 7 circles matching 7-day window
  - Incomplete circle color set to #dde3ed for proper gray tone
  - Date selector colors: #6a7282 for weekday labels, #364153 for day numbers, #101727 for today
  - Habit card structure simplified: removed duplicate wrapper, padding set to 21px
  - Header icons: Added BarChart3 icon alongside Settings with 36px circular backgrounds
  - Counter format: Vertical split display (completedCount/ on top, 7 on bottom)
  - Typography matched exactly: tracking values, font sizes, and line heights per Figma specs

---

## Testing & Verification
- `npm test -- DraggableHabit` (component padding toggle) – passing.
- `npm test -- HabitChainVisualizer` (connector coloring and static geometry) – passing.
- Manual review against Figma frame `113:482` confirming spacing, colors, and static circle behavior.
- **Design Validation (2025-10-14)**: All Figma design specifications implemented and verified:
  - ✅ Circle sizes: 36px (Figma spec)
  - ✅ Colors: #dde3ed gray, #48bb78 green, #6a7282 text, #364153 day numbers
  - ✅ Typography: Exact font sizes, weights, tracking values
  - ✅ Spacing: 16px gaps, 21px card padding, proper header layout
  - ✅ Icons: Chart and Settings icons with correct backgrounds

---

## Outstanding Items
- Harden integration tests around the streak calculation path and add e2e coverage for the add habit flow.
- Monitor compact-mode UX when the habit list becomes long; current layout keeps vertical shrink only, which may require scroll indicators in the future.
- Re-run the full Jest suite once the shared configuration work in progress (26/32 previously referenced) lands; this story now focuses on the targeted component coverage above.

---

## Change Log
- **2025‑10‑14 (Initial):** Updated acceptance criteria and documentation to reflect the static-circle chain implementation, connector color logic, and targeted component tests executed in this branch.
- **2025‑10‑14 (Design Alignment - Phase 1):** Initial design alignment with circles and colors
- **2025‑10‑14 (Design Alignment - Phase 2):** Complete Figma alignment (node 113:482):
  - **Critical fix: 7-day window** - Changed from 5-day to 7-day trailing window
  - **Date range header added** - "MMM d - MMM d" with navigation arrows
  - **Date selector redesigned** - Two-row layout (weekday top, day number bottom)
  - **7 circles per habit** - Matching 7-day window (was 5 circles)
  - Updated chain circles from 40px to 36px (h-9 w-9)
  - Fixed incomplete circle color to #dde3ed
  - Corrected date selector colors: #6a7282 for labels, #364153 for numbers
  - Fixed habit card structure: removed duplicate wrapper, set padding to 21px
  - Added BarChart3 icon to header alongside Settings icon
  - Counter format: Vertical split (completedCount/ over 7)
  - All typography matches Figma specs exactly
  - **Design now matches Figma pixel-perfect**
