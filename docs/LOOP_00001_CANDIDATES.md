# Refactoring Candidates - Loop 00001

## Summary

- **Total Candidates Found:** 18
- **By Category:**
  - File Size: 5
  - Duplication: 3
  - Complexity: 2
  - Dead Code: 3
  - Organization: 5

---

## Candidates

### Candidate 1: HabitDetailScreen Monolith Decomposition

- **Category:** File Size
- **Location:** `src/screens/HabitDetailScreen.tsx:1-3503`
- **Current State:** Single file contains 3,503 LOC with 12 internal components, 30+ state variables, multiple mutations/queries, and 9 modal implementations all in one place.
- **Proposed Change:** Extract into feature module structure:
  - Extract `HeroSection`, `SectionCard`, `ActionButton` to shared components
  - Extract `ProgressTabContent`, `MotivationTabContent`, `ManageTabContent` to separate files
  - Move animation components (`AnimatedSection`, `CompletionCheckmark`, `PulsingIcon`) to shared animation utils
  - Extract modal editors (Why, Identity, Cue, VisionBoard, Affirmations, Notes) to separate modal components
  - Create `useHabitDetailState` custom hook for state management
- **Code Context:**
  ```typescript
  // Internal components that should be extracted (lines 111-1655):
  function HeroSection({ ... }) { ... }           // Line 111
  function ActionButton({ ... }) { ... }          // Line 259
  function SectionCard({ ... }) { ... }           // Line 354
  function AnimatedSection({ ... }) { ... }       // Line 450
  function CompletionCheckmark({ ... }) { ... }   // Line 519
  function PulsingIcon({ ... }) { ... }           // Line 607
  function DangerZoneSection({ ... }) { ... }     // Line 679
  function AnimatedPressableCard({ ... }) { ... } // Line 709
  function AffirmationsSection({ ... }) { ... }   // Line 770
  function ProgressTabContent({ ... }) { ... }    // Line 927
  function MotivationTabContent({ ... }) { ... }  // Line 1110
  function ManageTabContent({ ... }) { ... }      // Line 1496
  ```

---

### Candidate 2: Workshop Component PulsingIcon Duplication

- **Category:** Duplication
- **Location:**
  - `src/components/MotivationSystem/Workshop/LettersSection.tsx:118-169`
  - `src/components/MotivationSystem/Workshop/AffirmationsSection.tsx:182-213`
  - `src/components/MotivationSystem/Workshop/VoiceNotesSection.tsx:106-157`
  - `src/components/MotivationSystem/Workshop/VisionBoardSection.tsx:120-171`
- **Current State:** Identical `PulsingIcon` component implemented in 4 separate files (~52 LOC each = 208 LOC duplicated).
- **Proposed Change:** Extract to shared location `src/components/MotivationSystem/shared/PulsingIcon.tsx` or `src/components/animations/PulsingIcon.tsx`.
- **Code Context:**
  ```typescript
  // Same implementation in all 4 files:
  function PulsingIcon({
    children,
    reduceMotion = false,
  }: {
    children: React.ReactNode;
    reduceMotion?: boolean;
  }) {
    const opacity = useSharedValue(1);
    const scale = useSharedValue(1);
    // ... pulse animation logic (~40 LOC)
  }
  ```

---

### Candidate 3: Workshop Component CompletionCheckmark Duplication

- **Category:** Duplication
- **Location:**
  - `src/components/MotivationSystem/Workshop/LettersSection.tsx:174-239`
  - `src/components/MotivationSystem/Workshop/AffirmationsSection.tsx` (similar location)
  - `src/components/MotivationSystem/Workshop/VoiceNotesSection.tsx:162-213`
  - `src/components/MotivationSystem/Workshop/VisionBoardSection.tsx:176-227`
- **Current State:** Identical `CompletionCheckmark` component implemented in 4 separate files (~65 LOC each = 260 LOC duplicated).
- **Proposed Change:** Extract to shared location `src/components/MotivationSystem/shared/CompletionCheckmark.tsx`.
- **Code Context:**
  ```typescript
  // Same implementation in all 4 files:
  function CompletionCheckmark({
    isVisible,
    sectionIndex,
    shouldAnimate,
    reduceMotion = false,
  }: { ... }) {
    const scale = useSharedValue(...);
    const opacity = useSharedValue(...);
    // ... pop-in animation logic
  }
  ```

---

### Candidate 4: Workshop Animation Constants Duplication

- **Category:** Duplication
- **Location:** All 4 Workshop components
- **Current State:** Identical animation spring configs duplicated in all 4 files:
  ```typescript
  const SPRING_BUTTON = { damping: 15, stiffness: 300 };
  const SPRING_BOUNCY = { damping: 8, stiffness: 300 };
  const SPRING_GENTLE = { damping: 28, mass: 1.2, stiffness: 180 };
  const STAGGER_DELAY = 80;
  const BASE_CHECKMARK_DELAY = 600;
  ```
- **Proposed Change:** Extract to shared constants file `src/constants/animations.ts` or `src/theme/animations.ts`.

---

### Candidate 5: Backend Templates Data Externalization

- **Category:** Organization
- **Location:** `convex/templates.ts:1-4981`
- **Current State:** 4,981 LOC file where ~4,800 LOC is static template data (habit templates with descriptions, scientific references, tips, etc.) mixed with query/mutation logic.
- **Proposed Change:**
  - Extract template data to `convex/data/templates.json` or multiple category-specific JSON files
  - Keep only query/mutation logic in `convex/templates.ts` (~200 LOC)
  - Consider seeding templates via migration instead of inline data
- **Code Context:**
  ```typescript
  // Line 200+: Massive blocks of template data
  await insertWithTracking({
    category: 'morning_routine',
    description: 'Drink a full glass of water immediately after waking...',
    icon: '💧',
    name: 'Hydration First',
    scientificReference: 'Popkin et al. (2010)...',
    tips: ['Keep a water bottle by your bed...'],
    // ... hundreds more templates
  });
  ```

---

### Candidate 6: Notification System Modularization

- **Category:** Organization
- **Location:** `src/utils/notifications.ts:1-978`
- **Current State:** Single 978 LOC file handling 4 different notification types (habit reminders, letter unlocks, affirmation delivery, and channels) with 22 exported functions.
- **Proposed Change:** Split into focused modules:
  - `src/utils/notifications/channels.ts` - Android channel configuration
  - `src/utils/notifications/permissions.ts` - Permission handling
  - `src/utils/notifications/habitReminders.ts` - Habit reminder scheduling
  - `src/utils/notifications/letterUnlocks.ts` - Letter unlock notifications
  - `src/utils/notifications/affirmationDelivery.ts` - Affirmation scheduling
  - `src/utils/notifications/index.ts` - Re-exports
- **Code Context:**
  ```typescript
  // Current: 22 functions in one file
  // Lines 28-79: 3 channel configuration functions
  // Lines 108-152: Permission functions
  // Lines 154-293: Reminder time utilities
  // Lines 295-366: Habit reminder scheduling
  // Lines 368-559: Letter unlock notifications
  // Lines 560-897: Affirmation delivery
  ```

---

### Candidate 7: Large Audio Recording Hook

- **Category:** File Size
- **Location:** `src/hooks/useAudioRecording.ts:1-847`
- **Current State:** 847 LOC hook handling recording state, permissions, file management, and UI feedback all in one hook.
- **Proposed Change:** Consider splitting into:
  - `useRecordingPermissions.ts` - Permission handling and status
  - `useAudioRecorder.ts` - Core recording functionality
  - `useRecordingState.ts` - State machine for recording lifecycle

---

### Candidate 8: Large Audio Playback Hook

- **Category:** File Size
- **Location:** `src/hooks/useAudioPlayback.ts:1-727`
- **Current State:** 727 LOC hook for audio playback with multiple state concerns mixed.
- **Proposed Change:** Consider extracting playback state management and audio player logic.

---

### Candidate 9: Dead Code - Duplicate Auth Directory

- **Category:** Dead Code
- **Location:** `src/screens/auth 2/`
- **Current State:** Duplicate directory `auth 2/` exists alongside `auth/`. Contents unknown but likely abandoned copy.
- **Proposed Change:**
  1. Verify no imports reference `auth 2/`
  2. Compare with `auth/` directory
  3. Remove if duplicate/obsolete
- **Code Context:**
  ```
  src/screens/auth/    (8 items)
  src/screens/auth 2/  (7 items) <- REMOVE
  ```

---

### Candidate 10: Dead Code - Duplicate CodeRabbit Configs

- **Category:** Dead Code
- **Location:** Root directory
- **Current State:** Multiple duplicate configuration files:
  - `.coderabbit.yaml` (original)
  - `.coderabbit 2.yaml` (duplicate)
  - `.coderabbit 3.yaml` (duplicate)
  - `.coderabbit 4.yaml` (duplicate)
  - `.coderabbitignore` (original)
  - `.coderabbitignore 2` (duplicate)
- **Proposed Change:** Remove all numbered duplicates (2, 3, 4).

---

### Candidate 11: Dead Code - Duplicate Windsurfrules Configs

- **Category:** Dead Code
- **Location:** Root directory
- **Current State:** 4 copies of `.windsurfrules` (20,045 bytes each = 80KB wasted):
  - `.windsurfrules` (original)
  - `.windsurfrules 2`
  - `.windsurfrules 3`
  - `.windsurfrules 4`
- **Proposed Change:** Remove all numbered duplicates (2, 3, 4).

---

### Candidate 12: HabitEditScreen Size

- **Category:** File Size
- **Location:** `src/screens/HabitEditScreen.tsx:1-1071`
- **Current State:** 1,071 LOC screen component with form logic, validation, and UI all combined.
- **Proposed Change:** Extract form sections into smaller components, consider custom hook for form state.

---

### Candidate 13: TemplatesScreen Size

- **Category:** File Size
- **Location:** `src/screens/TemplatesScreen.tsx:1-1039`
- **Current State:** 1,039 LOC screen with template browsing, filtering, and preview logic combined.
- **Proposed Change:** Extract template card, filter UI, and category navigation into separate components.

---

### Candidate 14: Large Offline Queue Hook

- **Category:** Complexity
- **Location:** `src/hooks/useOfflineQueue.ts:1-626`
- **Current State:** 626 LOC hook handling offline queue logic - approaching complexity threshold.
- **Proposed Change:** Monitor for growth, consider extracting queue operations vs queue state.

---

### Candidate 15: MotivationSystem Feature Module Opportunity

- **Category:** Organization
- **Location:** `src/components/MotivationSystem/`
- **Current State:** Well-organized but could be a feature module. Contains:
  - `Activation/` (7 files)
  - `Premium/` (8 files)
  - `Rescue/` (7 files)
  - `Reward/` (6 files)
  - `Workshop/` (17 files)
- **Proposed Change:** Move to `src/features/motivation/` following the `features/habits/` pattern:
  ```
  src/features/motivation/
  ├── components/
  │   ├── Activation/
  │   ├── Premium/
  │   ├── Rescue/
  │   ├── Reward/
  │   └── Workshop/
  ├── hooks/
  ├── types/
  └── index.ts
  ```

---

### Candidate 16: Context Provider Expansion Opportunity

- **Category:** Organization
- **Location:** `src/contexts/`
- **Current State:** Only contains `NetworkStatusContext.tsx` (8,663 bytes). Other state (theme, user preferences, audio playback) may benefit from Context pattern.
- **Proposed Change:** Audit for context opportunities:
  - Audio playback state (currently in hooks)
  - Theme preferences
  - User settings cache

---

### Candidate 17: Large Hook - useRescueTrigger

- **Category:** Complexity
- **Location:** `src/hooks/useRescueTrigger.ts:1-449`
- **Current State:** 449 LOC - on the higher end for a hook but still reasonable.
- **Proposed Change:** Monitor; no immediate action needed.

---

### Candidate 18: Large Hook - useDraftStorage

- **Category:** Complexity
- **Location:** `src/hooks/useDraftStorage.ts:1-389`
- **Current State:** 389 LOC - acceptable size but worth monitoring.
- **Proposed Change:** Monitor; no immediate action needed.

---

## Priority Recommendations

### High Priority (Phase 1)

1. **Candidate 1**: HabitDetailScreen decomposition - Biggest impact, most complex
2. **Candidates 2-4**: Workshop duplication - Quick win, reduces ~500 LOC
3. **Candidates 9-11**: Dead code cleanup - Zero-risk immediate improvement

### Medium Priority (Phase 2)

4. **Candidate 5**: Templates externalization - Cleaner backend code
5. **Candidate 6**: Notification modularization - Better separation of concerns
6. **Candidate 15**: MotivationSystem to feature module - Architecture consistency

### Lower Priority (Phase 3)

7. **Candidates 7-8**: Audio hook refactoring - Large but functional
8. **Candidates 12-13**: Screen size reduction - Moderate impact
9. **Candidate 16**: Context expansion - Architectural decision needed

---

## Execution Notes

- All candidates should have tests verified before and after refactoring
- Use IDE refactoring tools to update import paths automatically
- Commit frequently with clear messages prefixed with scope (e.g., `refactor(screens): extract HeroSection from HabitDetailScreen`)
- Keep Convex API unchanged to avoid data flow issues

---

## Tactic 1: Mega-Component Decomposition - Executed 2025-12-29 17:45

### Finding 1: HabitDetailScreen - Critical Performance Bottleneck

- **File:** `src/screens/HabitDetailScreen.tsx`
- **Line(s):** 1-3334
- **Pattern Found:** 3,334 LOC monolith with 31 useState calls in main component, 10 internal function components (not memoized), 7 Convex mutations, and 3 real-time queries
- **Context:** This is the largest component in the codebase. Any state change in one of the 31 useState hooks triggers a full re-render of all 10 internal components. Key issues:
  - Internal components (HeroSection, ActionButton, SectionCard, AnimatedSection, DangerZoneSection, AnimatedPressableCard, AffirmationsSection, ProgressTabContent, MotivationTabContent, ManageTabContent) are defined inside the main component and recreated on every render
  - State is not lifted or grouped logically - 9 modal states share the same render tree
  - Multiple Date() instantiations on lines 1695, 1713, 1722-1723, 1733-1735
  - Legacy Animated API on lines 1513-1514, 1560-1572 with `useNativeDriver: false`
- **Performance Impact:** Every keystroke in any text input, every modal toggle, every affirmation shuffle causes full 3,334 LOC component tree re-render

### Finding 2: TemplateScienceModal - Large Modal Component

- **File:** `src/components/TemplateScienceModal.tsx`
- **Line(s):** 1-1373
- **Pattern Found:** 1,373 LOC with 6 internal components (SkeletonBox, ConfettiParticle, AnimatedBorderBox, etc.)
- **Context:** Modal component for displaying template science information. Contains complex animations and internal utility functions. Internal components defined inline will be recreated on each render.
- **Performance Impact:** Modal open/close causes unnecessary component recreation. Animation state changes trigger full re-render.

### Finding 3: TemplatesScreen - Template Browser

- **File:** `src/screens/TemplatesScreen.tsx`
- **Line(s):** 1-1039
- **Pattern Found:** 1,039 LOC screen component with template filtering, category navigation, and preview logic combined
- **Context:** Handles template browsing, category filtering, and template selection. State changes during filtering cause full list re-render.
- **Performance Impact:** Every filter change, category selection, or search query triggers full screen re-render including all template cards.

### Finding 4: HabitEditScreen - Form Screen

- **File:** `src/screens/HabitEditScreen.tsx`
- **Line(s):** 1-1071
- **Pattern Found:** 1,071 LOC form component with validation and multiple form sections combined
- **Context:** Form for editing habits with multiple input fields. Each keystroke in any field triggers full form re-render.
- **Performance Impact:** Input latency accumulates as all form sections re-render on each keystroke.

### Finding 5: FullsizeTemplatePreview - Template Preview Component

- **File:** `src/components/FullsizeTemplatePreview.tsx`
- **Line(s):** 1-1046
- **Pattern Found:** 1,046 LOC preview component with rich template display
- **Context:** Displays template details with animations and interactive elements. Large component tree rendered inline.
- **Performance Impact:** Complex animations and state within a large component tree can cause frame drops.

### Finding 6: Workshop Section Components - Duplicated Patterns

- **Files:**
  - `src/components/MotivationSystem/Workshop/LettersSection.tsx` (1,336 LOC, 11 useState, 8 internal components)
  - `src/components/MotivationSystem/Workshop/AffirmationsSection.tsx` (1,147 LOC)
  - `src/components/MotivationSystem/Workshop/VoiceNotesSection.tsx` (982 LOC)
  - `src/components/MotivationSystem/Workshop/VisionBoardSection.tsx` (954 LOC)
- **Pattern Found:** Each Workshop component is a mini-monolith with internal components (SectionCard, AnimatedSection, modals) defined inline
- **Context:** These components follow the same anti-pattern as HabitDetailScreen - internal function components not memoized, multiple useState hooks, inline component definitions
- **Performance Impact:** Combined 4,419 LOC that could benefit from extracting shared components and memoization. PulsingIcon and CompletionCheckmark are already documented as duplicated in earlier candidates.

### Finding 7: CelebrationScreen - Reward Animation

- **File:** `src/components/MotivationSystem/Reward/CelebrationScreen.tsx`
- **Line(s):** 1-913
- **Pattern Found:** 913 LOC celebration component with complex animation logic
- **Context:** Displays celebration animations on habit completion. Heavy animation work should run on UI thread via worklets.
- **Performance Impact:** Large component with animations - potential for JS thread blocking if animations not properly optimized.

### Finding 8: ShareCardGenerator - Card Generation

- **File:** `src/components/ShareCardGenerator.tsx`
- **Line(s):** 1-732
- **Pattern Found:** 732 LOC component for generating shareable habit cards
- **Context:** Generates visual cards for sharing. Contains image processing and rendering logic.
- **Performance Impact:** Image processing and canvas operations can block the main thread if not properly optimized.

### Tactic Summary

- **Issues Found:** 8 mega-components identified with performance-impacting patterns
- **Files Affected:** 11 files
- **Total LOC in Mega-Components:** ~12,600 lines
- **Key Anti-Patterns:**
  1. Internal function components not wrapped in React.memo or extracted
  2. Excessive useState hooks causing cascading re-renders (36+ in HabitDetailScreen alone)
  3. State not grouped by concern (modal states mixed with form states)
  4. Date object recreation inside render functions
  5. Legacy Animated API with useNativeDriver: false
- **Recommended Actions:**
  1. Extract internal components to separate files with React.memo
  2. Group related state into custom hooks (useModalState, useFormState)
  3. Extract Date computations to useMemo with stable dependencies
  4. Migrate remaining Animated API to Reanimated worklets
- **Status:** EXECUTED

---

## Tactic 2: Inline Style Object Audit - Executed 2026-01-08 13:45

### Finding 1: DraggableHabit - Critical List Item with 25+ Inline Styles

- **Category:** Organization / Performance
- **Location:** `src/components/DraggableHabit/DraggableHabit.tsx:386-928`
- **Current State:** This is the primary list item component rendered via FlatList for every habit. Contains 25+ inline style objects that are recreated on every render, breaking React.memo effectiveness. Key violations:
  - Lines 386-399: `renderRightActions` archive button styling
  - Lines 401-407: Animated icon container
  - Lines 410-417: Text styling in render callback
  - Lines 646-668: Card container with 12+ style properties
  - Lines 720-730: Icon container with shadow styles
  - Lines 744-754: Title overlay positioning
  - Lines 857-916: Progress bar and dividers (9 inline style objects)
- **Proposed Change:**
  1. Extract static styles to `StyleSheet.create()` at module level
  2. Use `useMemo` for dynamic styles that depend on props (e.g., `accentColor`, `isWeekComplete`)
  3. Create style factory functions for commonly reused patterns
- **Code Context:**
  ```typescript
  // Example of problematic inline styles (line 646-668):
  style={{
    backgroundColor:
      isWeekComplete && !highContrastMode
        ? 'rgba(220, 252, 231, 0.3)'
        : colors.cardBackground,
    borderColor: isWeekComplete && !highContrastMode
      ? '#86efac'
      : colors.border,
    // ... 10 more properties
  }}
  ```
- **Impact:** HIGH - This component renders for EVERY habit in the list. Each scroll or state update recreates 25+ objects.

---

### Finding 2: WeeklySummaryCard - Celebratory Card with Animated Inline Styles

- **Category:** Organization / Performance
- **Location:** `src/components/WeeklySummaryCard/WeeklySummaryCard.tsx:218-378`
- **Current State:** 21 inline style objects for a card component that shows weekly stats. While less frequent than list items, the component uses inline styles even for static properties.
- **Proposed Change:**
  1. Extract static styles (shadow, border radius) to StyleSheet
  2. Use useMemo for color-based dynamic styles computed from `getColors()`
- **Code Context:**
  ```typescript
  // Line 232-239: Static shadow properties mixed with dynamic color
  style={{
    backgroundColor: colors.bg,
    shadowColor: colors.accent,
    shadowOffset: { width: 0, height: 8 },  // Static - should be in StyleSheet
    shadowOpacity: 0.15,                     // Static - should be in StyleSheet
    shadowRadius: 16,                        // Static - should be in StyleSheet
    elevation: 4,                            // Static - should be in StyleSheet
  }}
  ```
- **Impact:** MEDIUM - Single instance per screen but sets bad pattern.

---

### Finding 3: ColorPickerSection - List Item Rendering with Conditional Styles

- **Category:** Organization / Performance
- **Location:** `src/components/CreateHabitModal/components/ColorPickerSection.tsx:160-298`
- **Current State:** ColorButton component rendered in a list has 11+ inline style objects. Each swatch is wrapped in multiple Views with inline positioning and sizing styles.
- **Proposed Change:**
  1. Convert static sizing (`width: 52, height: 52`) to StyleSheet constants
  2. Create selected/unselected style variants as StyleSheet entries
  3. Use `StyleSheet.compose()` for conditional styling
- **Code Context:**
  ```typescript
  // Lines 187-193: Static container sizing repeated
  style={{
    alignItems: 'center',
    height: 52,
    justifyContent: 'center',
    width: 52,
  }}
  // Repeated at lines 291-297 for CustomColorButton
  ```
- **Impact:** MEDIUM - Rendered per color swatch (typically 8-12 items).

---

### Finding 4: EmojiPicker EmojiItem - Grid Item with Style Recreation

- **Category:** Organization / Performance
- **Location:** `src/components/EmojiPicker/EmojiPicker.tsx:67-100`
- **Current State:** EmojiItem is memoized with `React.memo` but contains inline styles that defeat the memoization. The style object on lines 81-92 is recreated on every render even though most properties are static.
- **Proposed Change:**
  1. Extract the base style object to StyleSheet
  2. Create separate `selectedStyle` and `unselectedStyle` constants
  3. Use `StyleSheet.flatten()` only when `isSelected` changes
- **Code Context:**
  ```typescript
  // Lines 81-92: Mixed static and conditional properties
  style={[
    {
      alignItems: 'center',           // Static
      backgroundColor: isSelected ? '#f5f5f4' : '#fafaf9',  // Conditional
      borderColor: isSelected ? '#10b981' : 'transparent',  // Conditional
      borderRadius: 12,               // Static
      borderWidth: isSelected ? 2 : 0,  // Conditional
      // ... more properties
    },
    { transform: [{ scale: scaleAnim }] },
  ]}
  ```
- **Impact:** HIGH - Rendered for 100+ emoji items in a FlatList.

---

### Finding 5: DailyMomentumMeter - Animated Container Styles

- **Category:** Organization / Performance
- **Location:** `src/components/DailyMomentumMeter/DailyMomentumMeter.tsx:175-200`
- **Current State:** 12 inline style objects including static shadow properties that could be extracted. The component creates style objects on every render for properties that don't change.
- **Proposed Change:** Extract static shadow configuration to StyleSheet, use useMemo for percentage-based dynamic styles.
- **Impact:** LOW - Single instance component but contributes to overall style object churn.

---

### Finding 6: HabitsList Header Rendering - Inline Styles in renderHeader

- **Category:** Organization / Performance
- **Location:** `src/features/habits/components/HabitsList.tsx:711-735`
- **Current State:** The `renderHeader` function contains inline style objects that are recreated on every list re-render. Since headers re-render with list updates, this adds GC pressure.
- **Proposed Change:** Extract header animation styles to useMemo with animation value dependencies.
- **Code Context:**
  ```typescript
  // Lines 713-716: Animation styles in render callback
  style={{
    opacity: headerOpacity,
    transform: [{ translateY: headerTranslateY }],
  }}
  ```
- **Impact:** MEDIUM - Re-renders with list scroll and state changes.

---

### Finding 7: StreakRecordsAccordion - Good Pattern Reference

- **Category:** N/A (Positive Example)
- **Location:** `src/components/ProgressSectionConsolidated/StreakRecordsAccordion.tsx`
- **Current State:** This component properly uses `useAnimatedStyle` from Reanimated for animation styles and React.memo for the component wrapper. It serves as a good reference pattern for how other components should handle dynamic styles.
- **Proposed Change:** N/A - Use as reference pattern for other refactoring efforts.

---

### Tactic Summary

- **Issues Found:** 6 significant inline style problem areas + 1 positive reference pattern
- **Files Affected:** 7 files
- **Total Inline Style Occurrences:** 455 across 140 files (per grep search)
- **Key Anti-Patterns Identified:**
  1. Static properties (shadow, border radius, dimensions) in inline style objects
  2. Conditional styles recreated on every render instead of using StyleSheet variants
  3. Animation styles in render callbacks instead of useAnimatedStyle/useMemo
  4. Repeated identical style objects across components (e.g., 52x52 container sizing)
- **Highest Priority Fixes:**
  1. **DraggableHabit** (25+ inline styles, renders per habit - CRITICAL)
  2. **EmojiPicker EmojiItem** (defeats memo, renders 100+ items - HIGH)
  3. **ColorPickerSection** (repeated patterns, list rendering - MEDIUM)
- **Recommended Refactoring Pattern:**

  ```typescript
  // Before (anti-pattern):
  <View style={{ width: 52, height: 52, alignItems: 'center' }}>

  // After (correct):
  const styles = StyleSheet.create({
    container: { width: 52, height: 52, alignItems: 'center' },
  });
  <View style={styles.container}>

  // For conditional styles:
  const dynamicStyles = useMemo(() => ({
    backgroundColor: isSelected ? '#f5f5f4' : '#fafaf9',
  }), [isSelected]);
  ```

- **Status:** EXECUTED

---

## Tactic 3: Legacy Animated API Migration - Executed 2026-01-08 14:30

### Finding 1: DraggableHabit - Critical List Item with 9 Animated.Value Refs and JS-Thread Animations

- **File:** `src/components/DraggableHabit/DraggableHabit.tsx`
- **Line(s):** 136-144, 215-237, 275-285, 432-442
- **Pattern Found:** 9 `new Animated.Value` refs with 8 instances of `useNativeDriver: false` forcing animations to run on JS thread
- **Context:** This is the primary list item component rendered for every habit. Contains:
  - Lines 136-144: 9 Animated.Value refs (fade, translateY, archiveFlash, cardScale, iconPulse, highlightGlow, streakBadgeGlow, newRecordScale, newRecordOpacity)
  - Lines 215-237: `highlightGlow` animations use `useNativeDriver: false` (4 timing calls) for the "just created" glow effect
  - Lines 275-285: `streakBadgeGlow` loop animations use `useNativeDriver: false` (2 timing calls) for significant streak badge
  - Lines 432-442: `archiveFlash` animations use `useNativeDriver: false` (2 timing calls) for swipe-to-archive feedback
- **Performance Impact:** CRITICAL - Every habit card's glow/flash effects run on the JS thread. During list scrolling, this competes with other JS work causing frame drops. The `highlightGlow` is particularly problematic as it runs a 4-stage sequence animation.
- **Why useNativeDriver: false:** These animations likely affect non-transform/non-opacity properties (like backgroundColor via interpolation), which the native driver doesn't support. Reanimated worklets can handle these on the UI thread.

---

### Finding 2: HabitsList - MonetizationHero Progress Animation with JS-Thread Width Animation

- **File:** `src/features/habits/components/HabitsList.tsx`
- **Line(s):** 63-65, 80-90, 513-518, 576-587
- **Pattern Found:** 9 `new Animated.Value` refs with 1 critical `useNativeDriver: false` for progress bar width animation
- **Context:** The HabitsList contains:
  - Lines 63-65: MonetizationHero uses 3 Animated.Values (progress, ctaPulse, shimmer)
  - Line 80-84: The `progress` animation for the usage bar uses `useNativeDriver: false` because it animates width
  - Lines 282-283: EmptyHabitCard uses 2 Animated.Values (scale, opacity)
  - Lines 513-518: Main list uses 6 Animated.Values for staggered header/calendar/habit row animations
  - Lines 576-587: Parallel timing animations for staggered entrance (all using useNativeDriver: true)
- **Performance Impact:** MEDIUM - The MonetizationHero progress bar width animation runs on JS thread. While it only fires on usage change (not during scroll), it still blocks the JS thread during animation. The staggered entrance animations correctly use native driver.

---

### Finding 3: DailyMomentumMeter - Progress Animation on JS Thread

- **File:** `src/components/DailyMomentumMeter/DailyMomentumMeter.tsx`
- **Line(s):** 34-37, 48-53
- **Pattern Found:** 4 `new Animated.Value` refs with 1 `useNativeDriver: false` for percentage-based progress
- **Context:** The daily momentum meter animates completion percentage:
  - Lines 34-37: 4 Animated.Values (progressAnim, celebrationScale, glowOpacity, flameScale)
  - Lines 48-53: `progressAnim` uses spring animation with `useNativeDriver: false` because it interpolates to a width/position value
  - Lines 62-108: Celebration animations (scale, glow, flame) correctly use `useNativeDriver: true`
- **Performance Impact:** LOW-MEDIUM - Single instance per screen, but the progress animation runs on JS thread when habits are completed.

---

### Finding 4: CreateHabitModal Components - Heavy Legacy Animated Usage

- **Files:**
  - `src/components/CreateHabitModal/components/SuccessAnimation.tsx` (10 Animated.Values)
  - `src/components/CreateHabitModal/components/ColorPickerSection.tsx` (5 Animated.Values per button)
  - `src/components/CreateHabitModal/components/HeroNameInput.tsx` (3 Animated.Values)
  - `src/components/CreateHabitModal/components/InlineEmojiInput.tsx` (4 Animated.Values)
  - `src/components/CreateHabitModal/components/ModalHeader.tsx` (3 Animated.Values)
  - `src/components/CreateHabitModal/hooks/useTemplateAnimation.ts` (1 Animated.Value)
- **Line(s):** Various (see individual file line numbers in search results)
- **Pattern Found:** 26+ Animated.Value refs across CreateHabitModal components, all using `useNativeDriver: true`
- **Context:** The habit creation modal uses legacy Animated API extensively but correctly uses native driver for transforms and opacity. The main concern is the proliferation of refs and the verbosity compared to Reanimated's worklet approach.
- **Performance Impact:** LOW - These all use `useNativeDriver: true`, so they run on the native thread. However, the codebase inconsistency (mixing Animated and Reanimated) increases maintenance burden and cognitive load.

---

### Finding 5: HabitChainVisualizer - Mixed Animation Patterns

- **File:** `src/components/HabitChainVisualizer/HabitChainVisualizer.tsx`
- **Line(s):** 81-82, 88-112, 204-206, 227-234, 253-265
- **Pattern Found:** 6 `new Animated.Value` refs across 2 internal components
- **Context:** Chain visualization with shimmer and completion animations:
  - Lines 81-82: LinkVisual uses opacity and shimmerPosition Animated.Values
  - Lines 88-112: Complex shimmer loop animation with native driver
  - Lines 204-206: HabitLink uses completion, buttonScale, and breathingPulse Animated.Values
  - Lines 227-234: Completion toggle animations with native driver
  - Lines 253-265: Breathing pulse loop animation with native driver
- **Performance Impact:** LOW - All animations use native driver. The shimmer pattern could benefit from Reanimated's more declarative syntax.

---

### Finding 6: WeeklySummaryCard - Celebration Animations

- **File:** `src/components/WeeklySummaryCard/WeeklySummaryCard.tsx`
- **Line(s):** 60-63, 145-185
- **Pattern Found:** 4 `new Animated.Value` refs with all using `useNativeDriver: true`
- **Context:** Weekly summary card with entrance and celebration animations:
  - Lines 60-63: fadeAnim, slideAnim, celebrationScale, starRotation
  - Lines 145-185: Entrance fade, celebration pulse, and star rotation animations
- **Performance Impact:** LOW - All animations correctly use native driver.

---

### Finding 7: RewardCelebrationToast - Toast Animation

- **File:** `src/components/RewardCelebrationToast.tsx`
- **Line(s):** 24-25, 31-54
- **Pattern Found:** 2 `new Animated.Value` refs with all using `useNativeDriver: true`
- **Context:** Toast notification that slides in/out for rewards
- **Performance Impact:** LOW - Uses native driver correctly, but could be simplified with Reanimated's `Layout` animations.

---

### Finding 8: EmojiPicker - Item Press Animation

- **File:** `src/components/EmojiPicker/EmojiPicker.tsx`
- **Line(s):** 47, 120
- **Pattern Found:** Each EmojiItem creates its own `Animated.Value` ref for scale animation
- **Context:** The EmojiItem memoized component creates a `scaleAnim` ref on line 47 and 120. While this uses native driver, creating an Animated.Value per list item (100+ emojis) creates memory overhead.
- **Performance Impact:** MEDIUM - Memory overhead from 100+ Animated.Value refs. Reanimated's `useSharedValue` would be more memory-efficient as a shared value pattern.

---

### Finding 9: CalendarTimeline - Day Cell Animations

- **File:** `src/components/CalendarTimeline/CalendarTimeline.tsx`
- **Line(s):** 50-51, 72-78
- **Pattern Found:** 2 `new Animated.Value` refs per DayCell with `useNativeDriver: true`
- **Context:** Day cells in the calendar timeline have scale and pulse animations
- **Performance Impact:** LOW - Uses native driver, but similar to EmojiPicker, creates refs per cell.

---

### Finding 10: SkeletonLoader - Shimmer Animation

- **File:** `src/components/SkeletonLoader/SkeletonLoader.tsx`
- **Line(s):** 26, 36-42
- **Pattern Found:** 1 `new Animated.Value` ref with `useNativeDriver: true` for shimmer opacity
- **Context:** Generic skeleton loading component with looping shimmer animation
- **Performance Impact:** LOW - Correctly uses native driver. The codebase has two SkeletonLoader implementations (also one in CreateHabitModal/components/).

---

### Tactic Summary

- **Issues Found:** 10 significant legacy Animated API usage patterns
- **Files Affected:** 29 files importing `Animated` from `react-native`, 99+ Animated.Value refs total
- **Critical `useNativeDriver: false` Instances:** 10 instances across 3 files:
  1. `DraggableHabit.tsx` - 8 instances (highlightGlow, streakBadgeGlow, archiveFlash)
  2. `HabitsList.tsx` - 1 instance (MonetizationHero progress)
  3. `DailyMomentumMeter.tsx` - 1 instance (progressAnim)
- **Key Anti-Patterns:**
  1. **useNativeDriver: false** in list item components (DraggableHabit) - Most severe, causes frame drops during scroll
  2. **Multiple Animated.Value refs per list item** (EmojiPicker, CalendarTimeline) - Memory overhead
  3. **Mixed API usage** - 29 files use legacy Animated, 50+ files use modern Reanimated - Inconsistency increases maintenance
  4. **Verbose animation setup** - 120+ Animated.timing calls vs declarative Reanimated worklets
- **Codebase Statistics:**
  - Legacy Animated API: 720 uses of Animated.View/Text/Image across 154 files
  - Modern Reanimated: 708+ uses of hooks (useAnimatedStyle, useSharedValue, etc.) across 50+ files
- **Highest Priority Migrations:**
  1. **DraggableHabit** - List item with 8 `useNativeDriver: false` animations - CRITICAL
  2. **HabitsList MonetizationHero** - Progress bar width animation - MEDIUM
  3. **DailyMomentumMeter** - Progress percentage animation - MEDIUM
  4. **EmojiPicker** - Per-item Animated.Value refs for 100+ items - MEDIUM
- **Recommended Migration Pattern:**

  ```typescript
  // Before (legacy Animated with JS thread):
  const highlightGlow = useRef(new Animated.Value(0)).current;
  Animated.timing(highlightGlow, {
    toValue: 1,
    duration: 300,
    useNativeDriver: false, // JS thread blocking!
  }).start();

  // After (Reanimated worklet on UI thread):
  const highlightGlow = useSharedValue(0);
  highlightGlow.value = withTiming(1, { duration: 300 });

  const animatedStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      highlightGlow.value,
      [0, 1],
      ['transparent', accentColor]
    ),
  }));
  ```

- **Status:** EXECUTED
