# Performance Game Plan

## Codebase Profile

- **Language/Framework:** TypeScript / React Native (Expo ~54.0) with Convex backend
- **Size:** ~556 TypeScript/TSX files in `/src`, ~48 Convex backend files (~154,500 LOC total)
- **Key Directories:**
  - `src/components/` - ~103 component directories/files (largest: TemplateScienceModal.tsx 41KB, FullsizeTemplatePreview.tsx 31KB)
  - `src/screens/` - Main screens (largest: HabitDetailScreen.tsx 127KB/3334 lines)
  - `src/hooks/` - Custom hooks (16 hooks)
  - `src/features/habits/` - Habit-specific feature code
  - `convex/` - Backend functions (largest: templates.ts 187KB/4981 lines)
- **Performance Libraries:**
  - React Native Reanimated (~4.1.1) - Used extensively (2013+ animation references)
  - React Native Skia - Canvas-based graphics
  - DraggableFlatList - Virtualized lists
  - Victory Native - Charts

## Key Findings Summary

| Area                                            | Count | Concern Level                     |
| ----------------------------------------------- | ----- | --------------------------------- |
| Convex query/mutation calls                     | 145   | Medium - real-time subscriptions  |
| Memoization patterns (useMemo/useCallback/memo) | 833   | Good - optimization exists        |
| Animation uses (Reanimated)                     | 2013+ | Medium - ensure worklets are used |
| Inline style objects (`style={{}}`)             | 438   | High - breaks memoization         |
| Date instantiations (new Date/Date.now)         | 355   | Medium - unnecessary re-renders   |
| List iterations (map/forEach/FlatList)          | 383   | Medium - check for optimization   |

---

## Investigation Tactics

Each tactic is a specific, actionable search pattern for finding performance issues.

---

### [EXECUTED] Tactic 1: Mega-Component Decomposition

- **Target:** Components too large to maintain and likely causing unnecessary re-renders
- **Search Pattern:** Files > 500 lines in `src/components/` and `src/screens/`
- **Files to Check:**
  - `src/screens/HabitDetailScreen.tsx` (3334 lines, 127KB) - **CRITICAL**
  - `src/components/TemplateScienceModal.tsx` (41KB)
  - `src/screens/TemplatesScreen.tsx` (39KB)
  - `src/screens/HabitEditScreen.tsx` (39KB)
  - `src/components/FullsizeTemplatePreview.tsx` (31KB)
  - `src/components/ShareCardGenerator.tsx` (20KB)
  - MotivationSystem/Workshop components (1,000-1,500 LOC each)
- **Why It Matters:** Large components often contain state that triggers full re-renders. Breaking them into smaller memoized components can dramatically reduce render times. The HabitDetailScreen alone is larger than many entire apps.

---

### [EXECUTED] Tactic 2: Inline Style Object Audit

- **Target:** Style objects created on every render, breaking React.memo effectiveness
- **Search Pattern:** `style=\{\{` (regex) or literal `style={{`
- **Files to Check:**
  - Found 438+ occurrences across 124 files
  - High concentration in: CharacterScreen, DraggableHabit, WeeklySummaryCard
- **Why It Matters:** Every inline style object like `style={{ width: 100 }}` creates a new object reference on each render, causing child components to re-render even if wrapped in `React.memo()`. Move to `StyleSheet.create()` or `useMemo()`.

---

### Tactic 3: Legacy Animated API Migration

- **Target:** Usage of `Animated` from react-native instead of Reanimated worklets
- **Search Pattern:**
  - `import.*Animated.*from 'react-native'`
  - `new Animated.Value`
  - `Animated.timing` without `useNativeDriver: true`
- **Files to Check:**
  - `src/features/habits/components/HabitsList.tsx` - Uses `Animated.Value` refs (lines 61-63, 280-281, 486-491)
  - `src/components/MonetizationHero` - Multiple Animated.Value refs
  - Any file using `useNativeDriver: false`
- **Why It Matters:** Legacy Animated API runs on the JS thread, causing jank during animations. Reanimated runs on the UI thread via worklets. Look for `useNativeDriver: false` as a red flag.

---

### Tactic 4: Convex Query Subscription Optimization

- **Target:** N+1 query patterns and excessive real-time subscriptions
- **Search Pattern:**
  - `useQuery\(api\.` (count per file)
  - Multiple `ctx.db.get` or `ctx.db.query` in loops within Convex functions
- **Files to Check:**
  - `convex/habits.ts` (53 db operations)
  - `convex/templates.ts` (100+ db references)
  - `convex/affirmations.ts` (25 db operations)
  - `convex/visionBoardImages.ts` (24 db operations)
  - `convex/voiceNotes.ts` (27 db operations)
  - `convex/letters.ts` (26 db operations)
- **Why It Matters:** Convex queries are real-time subscriptions. Multiple queries in the same component or fetching the same data multiple ways creates redundant network traffic and renders.

---

### Tactic 5: Date Object Recreation Hotspots

- **Target:** Unnecessary Date instantiation causing referential inequality
- **Search Pattern:** `new Date\(\)` or `Date\.now\(\)` inside render functions or useMemo/useCallback dependencies
- **Files to Check:**
  - `src/components/HabitCalendarView/HabitCalendarView.hooks.ts` (3 occurrences)
  - `src/hooks/useRescueTrigger.ts` (4 occurrences)
  - `src/components/InsightsSection/InsightsSection.tsx` (5 occurrences)
  - `src/screens/HabitDetailScreen.tsx` (10 occurrences)
  - `src/features/habits/hooks/useHabitsAppState.ts` (1 occurrence)
- **Why It Matters:** `new Date()` creates a new object each time, causing dependency arrays to always be "different" and hooks to re-run unnecessarily.

---

### Tactic 6: List Rendering Without Proper Keys or Memoization

- **Target:** `.map()` calls rendering components without stable keys or item memoization
- **Search Pattern:**
  - `.map\((` followed by JSX without `React.memo` wrapper
  - `key={index}` (anti-pattern for dynamic lists)
- **Files to Check:**
  - `src/components/ProgressSection/` - multiple map calls
  - `src/components/CalendarHeatmap/CalendarGrid.tsx` (4 map calls)
  - `src/components/InsightsSection/InsightsSection.tsx` (9 map calls)
  - Any component rendering arrays of habit data
- **Why It Matters:** Without proper keys and item memoization, React can't optimize list updates, re-rendering entire lists on any change.

---

### Tactic 7: Heavy Computation in Render Callbacks

- **Target:** Expensive calculations inside `renderHeader`, `renderItem`, or inline in JSX
- **Search Pattern:**
  - `.filter(` or `.reduce(` inside `render` functions or JSX
  - Calculations not wrapped in `useMemo`
- **Files to Check:**
  - `src/features/habits/components/HabitsList.tsx` (line 620-635: filter + loop in renderHeader)
  - `src/components/ProgressSectionConsolidated/ProgressSectionConsolidated.tsx`
  - `src/screens/TemplatesScreen.tsx` - template filtering
- **Why It Matters:** Calculations inside render callbacks run on every render frame during scrolling, causing jank.

---

### Tactic 8: Bundle Size - Giant Data Files

- **Target:** Large static data files that bloat the JavaScript bundle
- **Search Pattern:** Files > 50KB in `convex/` or `src/`
- **Files to Check:**
  - `convex/templates.ts` (187KB, 4981 lines) - **CRITICAL**
  - Check if this data could be lazy-loaded or stored in the database
- **Why It Matters:** Every byte of the JS bundle must be parsed at startup. A 187KB file adds measurable startup time, especially on low-end devices.

---

### Tactic 9: Missing FlatList Optimizations

- **Target:** FlatList usage without performance props
- **Search Pattern:**
  - `<FlatList` without `getItemLayout`
  - `<FlatList` without `windowSize` tuning
  - `<FlatList` without `removeClippedSubviews`
- **Files to Check:**
  - All files containing `FlatList` (10 files found)
  - `src/features/habits/components/HabitsList.tsx` - Uses DraggableFlatList
  - `src/components/EmojiPicker/EmojiPicker.tsx`
  - `src/components/EmojiPickerV2/EmojiGrid.tsx`
  - `src/screens/TemplatesScreen.tsx`
- **Why It Matters:** Without `getItemLayout`, FlatList can't optimize scroll positioning. Without proper `windowSize`, it may render too many off-screen items.

---

### Tactic 10: Unoptimized Event Handlers

- **Target:** Event handlers recreated on every render (anonymous functions in JSX)
- **Search Pattern:**
  - `onPress={() =>` (inline arrow functions)
  - `onChange={() =>`
  - Any `on[Event]={() =>` pattern
- **Files to Check:**
  - Large component files (HabitDetailScreen, etc.)
  - List item renderers
- **Why It Matters:** Inline handlers prevent `React.memo` from preventing re-renders and add GC pressure from constant function creation.

---

## Priority Matrix

| Tactic                          | Impact | Effort | Priority               |
| ------------------------------- | ------ | ------ | ---------------------- |
| 1. Mega-Component Decomposition | High   | High   | P1 - Start here        |
| 8. Bundle Size (templates.ts)   | High   | Medium | P1 - Quick win         |
| 2. Inline Style Objects         | High   | Medium | P1 - Systematic fix    |
| 3. Legacy Animated API          | High   | High   | P2 - Gradual migration |
| 7. Heavy Computation in Renders | High   | Low    | P2 - Quick fixes       |
| 4. Convex Query Optimization    | Medium | Medium | P2 - Architectural     |
| 9. FlatList Optimizations       | Medium | Low    | P2 - Easy wins         |
| 5. Date Object Recreation       | Medium | Low    | P3 - When found        |
| 6. List Key/Memoization         | Medium | Low    | P3 - Incremental       |
| 10. Event Handler Optimization  | Low    | Low    | P3 - Polish            |

---

## Next Steps

1. **Measure First**: Set up React Native Performance Monitor and/or Flashlight to establish baselines
2. **Profile HabitDetailScreen**: This 3334-line file is the most critical target
3. **Audit templates.ts**: Determine if 187KB of template data can be lazy-loaded
4. **Create component extraction plan** for the mega-components identified

---

## Success Metrics

- [ ] No screen component over 500 LOC
- [ ] No inline styles in performance-critical list items
- [ ] All animations using Reanimated worklets (not legacy Animated)
- [ ] FlatList components have getItemLayout where applicable
- [ ] Bundle size reduced by externalizing templates.ts data
- [ ] Render callback computations moved to useMemo

---

_Generated by code-refactor agent - Loop 00001_
_Updated with performance-specific tactics_
