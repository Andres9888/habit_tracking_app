# Refactoring Plan - Loop 00001

## Summary

- **Total Candidates:** 20 (18 original + 1 from Tactic 2 + 1 from Tactic 3)
- **IMPLEMENTED:** 6
- **PENDING (auto-implement):** 1
- **PENDING - MANUAL REVIEW:** 7 (includes #19 from Tactic 2)
- **WON'T DO:** 6

## Status Matrix

| #   | Candidate                                   | Risk   | Benefit   | Status                  |
| --- | ------------------------------------------- | ------ | --------- | ----------------------- |
| 1   | HabitDetailScreen Monolith Decomposition    | HIGH   | VERY HIGH | PENDING - MANUAL REVIEW |
| 2   | Workshop PulsingIcon Duplication            | LOW    | HIGH      | IMPLEMENTED             |
| 3   | Workshop CompletionCheckmark Duplication    | LOW    | HIGH      | IMPLEMENTED             |
| 4   | Workshop Animation Constants Duplication    | LOW    | MEDIUM    | IMPLEMENTED             |
| 5   | Backend Templates Externalization           | MEDIUM | HIGH      | PENDING - MANUAL REVIEW |
| 6   | Notification System Modularization          | MEDIUM | HIGH      | PENDING - MANUAL REVIEW |
| 7   | Large Audio Recording Hook                  | MEDIUM | MEDIUM    | PENDING - MANUAL REVIEW |
| 8   | Large Audio Playback Hook                   | MEDIUM | MEDIUM    | PENDING - MANUAL REVIEW |
| 9   | Dead Code - Duplicate Auth Directory        | LOW    | HIGH      | IMPLEMENTED             |
| 10  | Dead Code - Duplicate CodeRabbit Configs    | LOW    | MEDIUM    | IMPLEMENTED             |
| 11  | Dead Code - Duplicate Windsurfrules Configs | LOW    | MEDIUM    | IMPLEMENTED             |
| 12  | HabitEditScreen Size                        | HIGH   | MEDIUM    | WON'T DO                |
| 13  | TemplatesScreen Size                        | HIGH   | MEDIUM    | WON'T DO                |
| 14  | Large Offline Queue Hook                    | MEDIUM | LOW       | WON'T DO                |
| 15  | MotivationSystem Feature Module             | HIGH   | HIGH      | PENDING - MANUAL REVIEW |
| 16  | Context Provider Expansion                  | HIGH   | LOW       | WON'T DO                |
| 17  | Large Hook - useRescueTrigger               | MEDIUM | LOW       | WON'T DO                |
| 18  | Large Hook - useDraftStorage                | MEDIUM | LOW       | WON'T DO                |

---

## Detailed Evaluations

### 1. HabitDetailScreen Monolith Decomposition

- **Location:** `src/screens/HabitDetailScreen.tsx:1-3503`
- **Category:** File Size
- **Risk:** HIGH
- **Benefit:** VERY HIGH
- **Status:** PENDING - MANUAL REVIEW
- **Risk Rationale:**
  - 3,503 LOC is the largest file in the codebase (131KB)
  - Contains 12 internal components that may have implicit dependencies on parent scope closures
  - 30+ state variables creates complex interconnections between extracted components
  - Used in navigation via `HabitsModals.tsx` - affects core app navigation
  - Tests exist (`HabitDetailScreen.QuickStatsStrip.test.tsx`, `HabitDetailScreen.ManageActions.test.tsx`) but extraction may break test mocks
  - High probability of introducing subtle behavioral changes during extraction
- **Benefit Rationale:**
  - Massively improves maintainability - currently impossible to reason about entire file
  - Enables parallel development on different sections
  - Reusable components (HeroSection, SectionCard) can be used elsewhere
  - Reduces cognitive load for future developers
  - Enables better test isolation for each component
- **Refactoring Approach:**
  1. Start with leaf components that have minimal dependencies (ActionButton, SectionCard)
  2. Create a `src/screens/HabitDetailScreen/` folder structure
  3. Extract shared animation components to `src/components/animations/`
  4. Extract each modal editor to `src/components/modals/habit/`
  5. Create `useHabitDetailState` hook to manage shared state
  6. Extract tab contents last as they depend on shared state
  7. Run full test suite after each extraction step
  8. Ensure TypeScript strict mode catches any broken references

---

### 2. Workshop PulsingIcon Duplication

- **Location:**
  - `src/components/MotivationSystem/Workshop/LettersSection.tsx:118-169`
  - `src/components/MotivationSystem/Workshop/AffirmationsSection.tsx:182-213`
  - `src/components/MotivationSystem/Workshop/VoiceNotesSection.tsx:106-157`
  - `src/components/MotivationSystem/Workshop/VisionBoardSection.tsx:120-171`
  - Additional usages: `CueTriggerSection.tsx`, `DualVizSetup.tsx`, `WOOPSection.tsx`, `IdentitySection.tsx`, `YourWhySection.tsx`, `QuickReflection.tsx`
- **Category:** Duplication
- **Risk:** LOW
- **Benefit:** HIGH
- **Status:** PENDING
- **Risk Rationale:**
  - Internal-only component, not exported
  - Identical implementation across 10 files - pure code duplication
  - Animation behavior is self-contained with no external dependencies
  - Easy to verify - visual behavior should remain identical
  - No API changes, just a file move with import updates
- **Benefit Rationale:**
  - Removes ~500 LOC of duplicate code (10 files × ~50 LOC each)
  - Single source of truth for animation behavior
  - Bug fixes apply everywhere automatically
  - Easier to add accessibility options (reduceMotion) consistently
- **Refactoring Approach:**
  1. Create `src/components/animations/PulsingIcon.tsx` with the common implementation
  2. Export with proper TypeScript types
  3. Update imports in all 10 files
  4. Remove local implementations
  5. Run tests to verify animation behavior unchanged

---

### 3. Workshop CompletionCheckmark Duplication

- **Location:**
  - `src/components/MotivationSystem/Workshop/LettersSection.tsx:174-239`
  - `src/components/MotivationSystem/Workshop/VisionBoardSection.tsx:176-227`
  - `src/components/MotivationSystem/Workshop/VoiceNotesSection.tsx:162-213`
  - Additional usages: `CueTriggerSection.tsx`, `DualVizSetup.tsx`, `WOOPSection.tsx`, `IdentitySection.tsx`, `YourWhySection.tsx`, `QuickReflection.tsx`
- **Category:** Duplication
- **Risk:** LOW
- **Benefit:** HIGH
- **Status:** PENDING
- **Risk Rationale:**
  - Internal-only component, not exported
  - Identical implementation across 10 files
  - Tests exist in `IdentitySection.test.tsx` and `YourWhySection.test.tsx`
  - Animation-only component with no business logic
  - Easy to verify visually
- **Benefit Rationale:**
  - Removes ~600 LOC of duplicate code (10 files × ~60 LOC each)
  - Centralizes animation timing and behavior
  - Easier to tune animation parameters in one place
- **Refactoring Approach:**
  1. Create `src/components/animations/CompletionCheckmark.tsx`
  2. Export with proper TypeScript props interface
  3. Update imports in all affected files
  4. Remove local implementations
  5. Verify existing tests still pass

---

### 4. Workshop Animation Constants Duplication

- **Location:** All 10+ Workshop components
- **Category:** Duplication
- **Risk:** LOW
- **Benefit:** MEDIUM
- **Status:** IMPLEMENTED
- **Risk Rationale:**
  - Constants only, no functional code
  - Find-and-replace operation
  - No risk of behavioral changes
  - TypeScript will catch any typos
- **Benefit Rationale:**
  - Consistent animation timing across app
  - Single place to tune animation feel
  - Reduces cognitive load when reading components
  - Enables theme-based animation configuration in future
- **Refactoring Approach:**
  1. Create `src/theme/animations.ts` or `src/constants/animations.ts`
  2. Export `SPRING_BUTTON`, `SPRING_BOUNCY`, `SPRING_GENTLE`, `STAGGER_DELAY`, `BASE_CHECKMARK_DELAY`
  3. Update imports across all Workshop components
  4. Remove local constant declarations

---

### 5. Backend Templates Externalization

- **Location:** `convex/templates.ts:1-4981`
- **Category:** Organization
- **Risk:** MEDIUM
- **Benefit:** HIGH
- **Status:** PENDING - MANUAL REVIEW
- **Status Note:** Upgraded from PENDING on 2025-12-29 - Analysis revealed 5 separate seed functions with 228 templates. No specific before/after code available. Requires careful manual extraction and Convex dev environment testing.
- **Risk Rationale:**
  - Convex backend code - requires careful testing
  - Template data affects seeding and user-visible content
  - Need to ensure JSON parsing doesn't introduce encoding issues
  - Template data may have special characters in tips/descriptions
- **Benefit Rationale:**
  - Separates data from logic (4,800 LOC data vs 200 LOC logic)
  - Enables non-developers to edit template content
  - Faster file loads in IDE
  - Could enable i18n of templates in future
- **Refactoring Approach:**
  1. Create `convex/data/templates.json` with structured template data
  2. Import template data in `convex/templates.ts`
  3. Keep template insertion logic unchanged
  4. Verify all templates seed correctly in dev environment
  5. Consider category-specific files if JSON becomes too large

---

### 6. Notification System Modularization

- **Location:** `src/utils/notifications.ts:1-978`
- **Category:** Organization
- **Risk:** MEDIUM
- **Benefit:** HIGH
- **Status:** PENDING - MANUAL REVIEW
- **Status Note:** Upgraded from PENDING on 2025-12-29 - 16 files import from this module. No specific before/after code available. Requires folder restructuring, import updates, and platform-specific testing.
- **Risk Rationale:**
  - Notifications are critical for user engagement
  - 16 files import from this module
  - Tests exist (`notifications.test.ts`) - need to ensure they still work
  - Platform-specific behavior (Android channels vs iOS)
  - May affect scheduled notifications if not done carefully
- **Benefit Rationale:**
  - Clear separation of concerns (channels, permissions, scheduling)
  - Easier to maintain each notification type independently
  - Easier to add new notification types
  - Better testability per feature area
- **Refactoring Approach:**
  1. Create `src/utils/notifications/` folder
  2. Extract in order: channels → permissions → utilities → feature-specific
  3. Create `src/utils/notifications/index.ts` that re-exports everything
  4. Update 16 consumer files to use new imports
  5. Run full notification test suite after each extraction
  6. Manually test notification scheduling on both platforms

---

### 7. Large Audio Recording Hook

- **Location:** `src/hooks/useAudioRecording.ts:1-847`
- **Category:** File Size
- **Risk:** MEDIUM
- **Benefit:** MEDIUM
- **Status:** PENDING - MANUAL REVIEW
- **Risk Rationale:**
  - Audio recording involves native platform permissions
  - Used by `VoiceNotesSection.tsx` - critical user feature
  - Tests exist (`useAudioRecording.test.ts`)
  - Splitting may break timing-sensitive recording logic
- **Benefit Rationale:**
  - Cleaner separation of concerns
  - Easier to test permissions vs recording vs state
  - Better reusability if recording needed elsewhere
- **Refactoring Approach:**
  1. Analyze hook dependencies carefully before splitting
  2. Extract `useRecordingPermissions.ts` first (lowest coupling)
  3. Keep core recording logic together (timing-sensitive)
  4. Test on physical devices after changes

---

### 8. Large Audio Playback Hook

- **Location:** `src/hooks/useAudioPlayback.ts:1-727`
- **Category:** File Size
- **Risk:** MEDIUM
- **Benefit:** MEDIUM
- **Status:** PENDING - MANUAL REVIEW
- **Risk Rationale:**
  - Audio playback involves native APIs
  - Used by `VoiceNotePlaybackUI.tsx`
  - Tests exist (`useAudioPlayback.test.ts`)
  - Playback state management may be tightly coupled
- **Benefit Rationale:**
  - Cleaner separation of playback controls vs audio player
  - Better testability
  - May improve performance if state is isolated
- **Refactoring Approach:**
  1. Analyze coupling between playback state and player logic
  2. Consider if extraction actually improves code or just moves it
  3. Test on physical devices after changes

---

### 9. Dead Code - Duplicate Auth Directory

- **Location:** `src/screens/auth 2/` and `src/screens/examples 2/`
- **Category:** Dead Code
- **Risk:** LOW
- **Benefit:** HIGH
- **Status:** PENDING
- **Risk Rationale:**
  - Verified no imports reference `auth 2/` or `examples 2/`
  - Confirmed via grep search - zero usages
  - Removing unused code has no functional impact
- **Benefit Rationale:**
  - Removes confusion for developers
  - Reduces repo size
  - Prevents accidental edits to wrong directory
  - Cleans up file tree
- **Refactoring Approach:**
  1. Double-check with `grep -r "auth 2" src/` and `grep -r "examples 2" src/`
  2. Compare contents with original directories for any useful code
  3. Remove with `git rm -r "src/screens/auth 2" "src/screens/examples 2"`
  4. Commit with clear message

---

### 10. Dead Code - Duplicate CodeRabbit Configs

- **Location:** Root directory
- **Category:** Dead Code
- **Risk:** LOW
- **Benefit:** MEDIUM
- **Status:** IMPLEMENTED
- **Risk Rationale:**
  - Configuration files with space-numbered copies are clearly accidental duplicates
  - CodeRabbit only reads `.coderabbit.yaml` (no space)
  - No functional impact from removal
- **Benefit Rationale:**
  - Reduces repo clutter
  - Prevents confusion about which config is active
  - Saves ~1KB per duplicate
- **Refactoring Approach:**
  1. Verify `.coderabbit.yaml` is the intended config
  2. Remove: `.coderabbit 2.yaml`, `.coderabbit 3.yaml`, `.coderabbit 4.yaml`, `.coderabbitignore 2`
  3. Commit with clear message

---

### 11. Dead Code - Duplicate Windsurfrules Configs

- **Location:** Root directory
- **Category:** Dead Code
- **Risk:** LOW
- **Benefit:** MEDIUM
- **Status:** IMPLEMENTED
- **Risk Rationale:**
  - Identical 20KB files with space-numbered copies
  - Windsurf only reads `.windsurfrules` (no space)
  - No functional impact
- **Benefit Rationale:**
  - Saves ~60KB (3 × 20KB)
  - Reduces repo clutter
- **Refactoring Approach:**
  1. Remove: `.windsurfrules 2`, `.windsurfrules 3`, `.windsurfrules 4`
  2. Commit with clear message

---

### 12. HabitEditScreen Size

- **Location:** `src/screens/HabitEditScreen.tsx:1-1071`
- **Category:** File Size
- **Risk:** HIGH
- **Benefit:** MEDIUM
- **Status:** WON'T DO
- **Risk Rationale:**
  - Form logic with validation is tightly coupled
  - Affects habit editing - critical user journey
  - No clear separation points without significant redesign
  - 1,071 LOC is large but manageable compared to other priorities
- **Benefit Rationale:**
  - Would improve maintainability moderately
  - Not as impactful as HabitDetailScreen decomposition
- **Decision:** Lower priority than other candidates. Address after higher-impact items are complete.

---

### 13. TemplatesScreen Size

- **Location:** `src/screens/TemplatesScreen.tsx:1-1039`
- **Category:** File Size
- **Risk:** HIGH
- **Benefit:** MEDIUM
- **Status:** WON'T DO
- **Risk Rationale:**
  - Template browsing, filtering, and preview are interconnected
  - UI state management is complex
  - Risk of breaking template selection flow
- **Benefit Rationale:**
  - Moderate improvement to maintainability
  - Lower impact than core habit management screens
- **Decision:** Defer to later phase. Not urgent.

---

### 14. Large Offline Queue Hook

- **Location:** `src/hooks/useOfflineQueue.ts:1-626`
- **Category:** Complexity
- **Risk:** MEDIUM
- **Benefit:** LOW
- **Status:** WON'T DO
- **Risk Rationale:**
  - Offline queue logic is inherently complex
  - Queue operations and state are tightly coupled by design
  - Splitting may introduce race conditions
- **Benefit Rationale:**
  - Minor improvement at best
  - May make code harder to follow if split artificially
- **Decision:** Monitor for growth but don't refactor now. 626 LOC is acceptable for this complexity.

---

### 15. MotivationSystem Feature Module

- **Location:** `src/components/MotivationSystem/`
- **Category:** Organization
- **Risk:** HIGH
- **Benefit:** HIGH
- **Status:** PENDING - MANUAL REVIEW
- **Risk Rationale:**
  - 45+ files would be moved
  - Many import paths would change
  - Risk of breaking existing imports across codebase
  - Requires careful IDE refactoring tool usage
- **Benefit Rationale:**
  - Aligns with existing `features/habits/` pattern
  - Better encapsulation of motivation-related code
  - Enables feature-level exports and testing
- **Refactoring Approach:**
  1. Create `src/features/motivation/` structure
  2. Use IDE "Move" refactoring to update imports automatically
  3. Verify all imports updated correctly
  4. Update any manual path references
  5. Run full test suite

---

### 16. Context Provider Expansion

- **Location:** `src/contexts/`
- **Category:** Organization
- **Risk:** HIGH
- **Benefit:** LOW
- **Status:** WON'T DO
- **Risk Rationale:**
  - Moving from hooks to Context changes state ownership
  - May introduce unnecessary re-renders
  - Architectural decision that affects entire app
  - Requires careful performance analysis
- **Benefit Rationale:**
  - Theoretical improvement only
  - Current hook-based approach works well
  - No clear pain point being solved
- **Decision:** Not recommended. Current architecture is sound. Context isn't always better than hooks.

---

### 17. Large Hook - useRescueTrigger

- **Location:** `src/hooks/useRescueTrigger.ts:1-449`
- **Category:** Complexity
- **Risk:** MEDIUM
- **Benefit:** LOW
- **Status:** WON'T DO
- **Risk Rationale:**
  - 449 LOC is within acceptable range for a complex hook
  - Rescue trigger logic should stay together for coherence
- **Benefit Rationale:**
  - Splitting would provide minimal benefit
  - May make the feature harder to understand
- **Decision:** No action needed. Size is acceptable for functionality.

---

### 18. Large Hook - useDraftStorage

- **Location:** `src/hooks/useDraftStorage.ts:1-389`
- **Category:** Complexity
- **Risk:** MEDIUM
- **Benefit:** LOW
- **Status:** WON'T DO
- **Risk Rationale:**
  - 389 LOC is reasonable for a storage hook
  - Draft storage logic is inherently coupled
- **Benefit Rationale:**
  - Very minor improvement if any
  - Artificial splitting would hurt readability
- **Decision:** No action needed. Monitor for growth only.

---

## Implementation Order

### Phase 1: Zero-Risk Quick Wins (Candidates 9-11)

Priority: **Immediate**
Total LOC removed: ~80KB of duplicate files

1. ✅ Remove duplicate `auth 2/` and `examples 2/` directories
2. ✅ Remove duplicate CodeRabbit config files (IMPLEMENTED 2025-12-29)
3. ✅ Remove duplicate Windsurfrules config files (IMPLEMENTED 2025-12-29)

### Phase 2: Low-Risk High-Benefit (Candidates 2-4)

Priority: **High**
Total LOC removed: ~1,100

1. ✅ Extract shared `PulsingIcon` component
2. ✅ Extract shared `CompletionCheckmark` component
3. ✅ Extract shared animation constants (IMPLEMENTED 2025-12-29)

### Phase 3: Medium-Risk High-Benefit (Candidates 5-6)

Priority: **Medium**
Complexity reduction: Significant

1. Externalize backend template data
2. Modularize notification system

### Phase 4: Manual Review Required (Candidates 1, 7, 8, 15)

Priority: **Low - Requires Developer Review**

1. HabitDetailScreen decomposition (most complex)
2. Audio recording hook refactoring
3. Audio playback hook refactoring
4. MotivationSystem feature module migration

---

## Execution Notes

- Run `npm test` before and after each refactoring step
- Use IDE refactoring tools for import path updates
- Commit after each discrete change with message format: `refactor(scope): description`
- Dead code removal should be done first as it's zero-risk
- Animation component extraction can be done in parallel (no dependencies)

---

## Evaluation Status

**All 18 candidates have been evaluated as of 2025-12-29.**

| Status                  | Count | Candidates                   |
| ----------------------- | ----- | ---------------------------- |
| IMPLEMENTED             | 6     | #2, #3, #4, #9, #10, #11     |
| PENDING - MANUAL REVIEW | 6     | #1, #5, #6, #7, #8, #15      |
| WON'T DO                | 6     | #12, #13, #14, #16, #17, #18 |

**Loop 00001 Complete (2025-12-29):** All LOW risk items have been auto-implemented. Remaining MEDIUM/HIGH risk items require manual review and implementation.

---

## Tactic 2 Findings - Additional Candidates

The following candidates were identified through the Inline Style Object Audit (Tactic 2) and require evaluation:

### 19. DraggableHabit Inline Style Optimization

- **Location:** `src/components/DraggableHabit/DraggableHabit.tsx:386-928`
- **Category:** Performance / Organization
- **Risk:** MEDIUM
- **Benefit:** HIGH
- **Status:** PENDING - MANUAL REVIEW
- **Risk Rationale:**
  - 993 LOC component with 25+ inline style objects
  - Used by 8 files (including `useHabitRenderItem.tsx` which is the primary FlatList renderer)
  - Tests exist in two locations (`DraggableHabit.test.tsx` in both `__tests__` and `tests/` directories)
  - Dynamic styles depend on multiple props: `isWeekComplete`, `highContrastMode`, `accentColor`, `streak`
  - Animation values (`cardScale`, `archiveFlash`, `iconPulse`, etc.) are woven into style objects
  - Some styles use `StyleSheet.absoluteFillObject` spread which complicates extraction
  - Risk of subtle visual regressions if conditional logic isn't preserved exactly
- **Benefit Rationale:**
  - **CRITICAL performance impact**: This component renders for EVERY habit in the list
  - Each scroll or state update recreates 25+ style objects, defeating memoization
  - Fixing this would significantly reduce GC pressure and improve list scroll performance
  - Static properties (borderRadius, shadowOffset dimensions) could move to StyleSheet
  - Dynamic styles could use `useMemo` with proper dependency arrays
  - Would serve as a reference pattern for other list item components
  - Enables React.memo to work effectively on the component
- **Inline Style Count Analysis:**
  - Lines 386-399: Archive button container (8 properties)
  - Lines 401-407: Animated icon container (4 properties)
  - Lines 410-417: Archive text (5 properties)
  - Lines 646-668: Main card container (12 properties) - MOST CRITICAL
  - Lines 672-680: Color accent border (4 properties)
  - Lines 688-693: Archive flash overlay (4 properties)
  - Lines 698-704: Highlight glow (5 properties)
  - Lines 714-716: Icon pulse wrapper (1 property)
  - Lines 720-730: Icon container (8 properties)
  - Lines 744-754: Title overlay positioning (7 properties)
  - Lines 761-763: Title text (2 properties)
  - Lines 797-802: New record badge (5 properties)
  - Lines 847-854: Progress bar overlay (6 properties)
  - Lines 857-865: Progress bar track (8 properties)
  - Lines 869-874: Progress fill (4 properties)
  - Lines 877-916: 4x divider styles (6 properties each = 24 total)
  - Lines 957-959: Perfect week indicator (1 property)
- **Refactoring Approach:**
  1. Create `StyleSheet.create()` block at module level with all static styles
  2. Group styles by logical section: `archiveButton`, `card`, `iconContainer`, `progressBar`
  3. Create separate `selectedStyles` and `unselectedStyles` for conditional state
  4. Use `useMemo` for dynamic styles that compute from props:
     ```typescript
     const cardStyles = useMemo(
       () => ({
         backgroundColor:
           isWeekComplete && !highContrastMode
             ? 'rgba(220, 252, 231, 0.3)'
             : colors.cardBackground,
         borderColor:
           isWeekComplete && !highContrastMode ? '#86efac' : colors.border,
         shadowColor: isWeekComplete ? '#10b981' : '#78716c',
         shadowOpacity: isWeekComplete ? 0.12 : 0.06,
       }),
       [isWeekComplete, highContrastMode, colors.cardBackground, colors.border]
     );
     ```
  5. Extract repeated divider styles into a single constant (4 identical dividers)
  6. Run existing tests to verify no visual regressions
  7. Profile with React DevTools to verify reduced re-renders

---

| #   | Candidate                                | Risk   | Benefit | Status                  |
| --- | ---------------------------------------- | ------ | ------- | ----------------------- |
| 19  | DraggableHabit Inline Style Optimization | MEDIUM | HIGH    | PENDING - MANUAL REVIEW |
| 20  | DraggableHabit Legacy Animated Migration | LOW    | HIGH    | PENDING                 |

---

## 20. DraggableHabit Legacy Animated API Migration - Evaluated 2026-01-08 15:30

**Source:** Tactic 3: Legacy Animated API Migration - Finding 1
**File:** `src/components/DraggableHabit/DraggableHabit.tsx`
**Line(s):** 136-144, 215-238, 275-292, 432-444, 686-704

### Current Code

```typescript
// Lines 136-144: 9 Animated.Value refs
const fade = useRef(new Animated.Value(0)).current;
const translateY = useRef(new Animated.Value(12)).current;
const archiveFlash = useRef(new Animated.Value(0)).current;
const cardScale = useRef(new Animated.Value(1)).current;
const iconPulse = useRef(new Animated.Value(1)).current;
const highlightGlow = useRef(new Animated.Value(0)).current;
const streakBadgeGlow = useRef(new Animated.Value(0)).current;  // DEAD CODE!
const newRecordScale = useRef(new Animated.Value(0)).current;
const newRecordOpacity = useRef(new Animated.Value(0)).current;

// Lines 215-238: highlightGlow animations with useNativeDriver: false
Animated.sequence([
  Animated.timing(highlightGlow, {
    duration: 300,
    easing: Easing.out(Easing.ease),
    toValue: 1,
    useNativeDriver: false,  // UNNECESSARY - only animates opacity!
  }),
  // ... 3 more timing calls with useNativeDriver: false
]).start();

// Lines 275-292: streakBadgeGlow loop with useNativeDriver: false
Animated.loop(
  Animated.sequence([
    Animated.timing(streakBadgeGlow, {
      duration: 1500,
      toValue: 1,
      useNativeDriver: false,  // DEAD CODE - never used in render!
    }),
    Animated.timing(streakBadgeGlow, {
      duration: 1500,
      toValue: 0.3,
      useNativeDriver: false,
    }),
  ])
).start();

// Lines 432-444: archiveFlash with useNativeDriver: false
Animated.sequence([
  Animated.timing(archiveFlash, {
    duration: 120,
    toValue: 1,
    useNativeDriver: false,  // UNNECESSARY - only animates opacity!
  }),
  Animated.timing(archiveFlash, {
    duration: 220,
    toValue: 0,
    useNativeDriver: false,
  }),
]).start();

// Lines 686-704: Usage of these values (only opacity)
<Animated.View style={{ opacity: archiveFlash, ... }} />
<Animated.View style={{ opacity: highlightGlow, ... }} />
// streakBadgeGlow is NEVER used in render!
```

### Proposed Fix

```typescript
// OPTION A: Quick Fix - Switch to useNativeDriver: true (lowest risk)
// Since highlightGlow and archiveFlash only animate opacity (natively supported):

// Lines 215-238: Change all 4 to useNativeDriver: true
Animated.timing(highlightGlow, {
  duration: 300,
  easing: Easing.out(Easing.ease),
  toValue: 1,
  useNativeDriver: true,  // Fixed!
}),

// Lines 432-444: Change both to useNativeDriver: true
Animated.timing(archiveFlash, {
  duration: 120,
  toValue: 1,
  useNativeDriver: true,  // Fixed!
}),

// Lines 270-292: REMOVE streakBadgeGlow entirely (dead code)
// DELETE: const streakBadgeGlow = useRef(new Animated.Value(0)).current;
// DELETE: entire useEffect block for streakBadgeGlow (lines 270-292)

// OPTION B: Full Reanimated Migration (better long-term)
// Replace with Reanimated for consistency with existing entranceCardStyle usage:

import { useSharedValue, useAnimatedStyle, withTiming, withSequence } from 'react-native-reanimated';

// Replace refs with shared values
const highlightGlow = useSharedValue(0);
const archiveFlash = useSharedValue(0);

// Animated styles run on UI thread
const highlightGlowStyle = useAnimatedStyle(() => ({
  opacity: highlightGlow.value,
}));

const archiveFlashStyle = useAnimatedStyle(() => ({
  opacity: archiveFlash.value,
}));

// Animation triggers
highlightGlow.value = withSequence(
  withTiming(1, { duration: 300 }),
  withTiming(0.5, { duration: 400 }),
  withTiming(1, { duration: 300 }),
  withTiming(0, { duration: 500 })
);

// Usage with Reanimated.View (component already imports ReAnimated)
<ReAnimated.View style={[{ /* static styles */ }, archiveFlashStyle]} />
<ReAnimated.View style={[{ /* static styles */ }, highlightGlowStyle]} />
```

### Assessment

- **Complexity:** LOW - The simplest fix (Option A) is a 6-line change: flip 6 `useNativeDriver: false` to `true` and delete ~25 lines of dead code. The full migration (Option B) is more work but the component already uses Reanimated for entrance animations.
- **Gain:** HIGH - This component renders for EVERY habit in the list. The `streakBadgeGlow` dead code runs an infinite JS-thread loop for every habit with 7+ day streaks, competing for JS thread time during scrolling. The `highlightGlow` 4-stage animation runs on every newly created habit. Both cause unnecessary GC pressure and frame drops.
- **Dependencies:** None - changes are self-contained within this component

### Implementation Notes

1. **Dead Code Discovery:** The `streakBadgeGlow` animated value is defined on line 142, animated in an infinite loop (lines 270-292), but NEVER used anywhere in the render. This is pure performance drain with zero visual effect. Removing it provides immediate benefit with zero risk.

2. **Safe Native Driver Switch:** Both `highlightGlow` and `archiveFlash` only animate the `opacity` property (lines 691, 702). Opacity is fully supported by the native driver. The `useNativeDriver: false` was likely a mistake or copy-paste from somewhere else.

3. **Verification Steps:**
   - Search for `streakBadgeGlow` usage in render: None found - safe to delete
   - Check `highlightGlow` interpolation: None - only used directly as opacity value
   - Check `archiveFlash` interpolation: None - only used directly as opacity value

4. **Testing:**
   - Create a new habit (triggers highlightGlow animation) - verify glow effect still works
   - Swipe to archive a habit (triggers archiveFlash) - verify flash effect still works
   - Navigate to a habit with 7+ day streak - should see NO change (dead code removed)
   - Performance: Profile with 20+ habits during scroll - should see reduced JS thread activity

5. **Migration Path:** Option A (native driver fix) can be done immediately. Option B (full Reanimated migration) can be done later as part of the larger DraggableHabit refactoring effort.

### Status: PENDING
