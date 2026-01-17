# Refactoring Plan - Loop 00001

## Summary

- **Total Candidates:** 20 (18 original + 1 from Tactic 2 + 1 from Tactic 3)
- **IMPLEMENTED:** 7
- **PENDING (auto-implement):** 0
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
| 20  | DraggableHabit Legacy Animated Migration | LOW    | HIGH    | IMPLEMENTED             |

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

### Status: IMPLEMENTED

**Implemented:** 2026-01-08 by refactor-performance-security-testing agent

**Changes Made:**

1. Switched 6 `useNativeDriver: false` to `useNativeDriver: true` for `highlightGlow` (4 calls) and `archiveFlash` (2 calls)
2. Removed dead `streakBadgeGlow` animated value and its infinite loop useEffect
3. Removed unused `hasSignificantStreak` variable

**Files Modified:** `src/components/DraggableHabit/DraggableHabit.tsx`

**Verification:** Code compiles without errors, changes match proposed fix exactly

---

# Security Remediation Plan - Loop 00001

## Security Summary

- **Total Findings:** 16
- **IMPLEMENTED:** 7
- **Auto-Remediate (PENDING):** 1
- **Manual Review:** 0
- **Won't Do / False Positive:** 0
- **Not Yet Evaluated:** 8

## Security Risk Summary

| Severity | Count | Implemented | Auto-Fix | Manual | Won't Do | Pending Eval |
| -------- | ----- | ----------- | -------- | ------ | -------- | ------------ |
| CRITICAL | 2     | 2           | 0        | 0      | 0        | 0            |
| HIGH     | 6     | 5           | 0        | 0      | 0        | 1            |
| MEDIUM   | 6     | 0           | 1        | 0      | 0        | 5            |
| LOW/INFO | 2     | 0           | 0        | 0      | 0        | 2            |

---

## IMPLEMENTED - Security Fixes

### SEC-001: Hardcoded Figma Access Token in Version Control

- **Status:** `IMPLEMENTED`
- **Implemented In:** Loop 00001
- **Fix Applied:** Removed `.env.mcp` from git tracking, added to `.gitignore`, created `.env.mcp.example` template
- **Files Modified:** `.gitignore`, `.env.mcp.example` (created)
- **Verified:**
  - [x] `.env.mcp` is in `.gitignore` (line 17)
  - [x] `.env.mcp` is not tracked by git (`git ls-files` shows only `.env.mcp.example`)
  - [x] `.env.mcp.example` exists with placeholder value
  - [ ] Token rotation required by repository owner (manual action)
- **Vuln ID:** VULN-001
- **Severity:** CRITICAL
- **Remediability:** EASY
- **File:** `.env.mcp`
- **Line:** 1
- **Issue:** Figma access token (`figd_YODDpEJ3FG6Znes3MhFwp3ok5-BRop5YX_fCUn1J`) was hardcoded in a file tracked by git, exposing the credential to anyone with repository access.
- **Original Fix Strategy:**
  1. **Immediately revoke the exposed Figma token** via Figma account settings (cannot be done by agent - requires human action)
  2. Add `.env.mcp` to `.gitignore` to prevent future commits
  3. Remove `.env.mcp` from git tracking with `git rm --cached .env.mcp`
  4. Create `.env.mcp.example` with placeholder value for documentation
  5. Generate a new Figma token and store it outside version control (environment variable or secrets manager)
- **Implementation Notes:**
  - Fix was applied in commit `dfd74d6` (2025-12-29)
  - **REMINDER:** Token rotation by repository owner still required
  - History contains the exposed token - consider using BFG or `git filter-branch` for production repos

**Evaluated:** 2026-01-08 by refactor-performance-security-testing agent
**Implemented:** 2025-12-29 via commit dfd74d6

---

## PENDING - Ready for Auto-Remediation

### SEC-002: Unauthenticated File Storage Upload

- **Status:** `IMPLEMENTED`
- **Implemented In:** Loop 00001
- **Fix Applied:** Added authentication checks to `generateUploadUrl` and `deleteFile` mutations using `ctx.auth.getUserIdentity()`
- **Files Modified:** `convex/storage.ts`
- **Verified:**
  - [x] Code review passed - authentication check at start of handler
  - [x] Functionality preserved - authenticated users can still upload/delete
  - [x] Vulnerability fixed - unauthenticated requests now throw error
  - [x] No breaking changes - all app uploads come from authenticated users
- **Vuln ID:** VULN-002
- **Severity:** CRITICAL
- **Remediability:** EASY
- **File:** `convex/storage.ts`
- **Line:** 24-35 (generateUploadUrl), 55-68 (deleteFile)
- **Issue:** The `generateUploadUrl` mutation had no authentication check. Any client (authenticated or not) could request an upload URL and upload files to the storage bucket. Additionally, `deleteFile` had the same vulnerability.
- **Fix Applied:**

  ```typescript
  export const generateUploadUrl = mutation({
    args: {},
    handler: async (ctx) => {
      const identity = await ctx.auth.getUserIdentity();
      if (!identity) {
        throw new Error('Unauthenticated: Must be logged in to upload files');
      }
      return await ctx.storage.generateUploadUrl();
    },
    returns: v.string(),
  });

  export const deleteFile = mutation({
    args: {
      storageId: v.id('_storage'),
    },
    handler: async (ctx, args) => {
      const identity = await ctx.auth.getUserIdentity();
      if (!identity) {
        throw new Error('Unauthenticated: Must be logged in to delete files');
      }
      await ctx.storage.delete(args.storageId);
      return null;
    },
    returns: v.null(),
  });
  ```

- **Breaking Change Risk:** LOW - All legitimate uploads/deletions come from authenticated users (Vision Board images, Voice Notes). No public upload/delete functionality exists in the app.

**Evaluated:** 2026-01-10 by secruity agent
**Implemented:** 2026-01-10 by secruity agent
**Loop:** 00001

---

### SEC-003: Missing Ownership Validation in habits:update

- **Status:** `IMPLEMENTED`
- **Implemented In:** Loop 00001
- **Fix Applied:** Added authentication and ownership verification to both `update` and `updateNotes` mutations
- **Files Modified:** `convex/habits/update.ts`
- **Verified:**
  - [x] Code review passed - authentication and ownership checks at start of each handler
  - [x] Functionality preserved - authenticated users can still update their own habits
  - [x] Vulnerability fixed - unauthenticated requests throw "Unauthenticated" error
  - [x] Vulnerability fixed - attempts to modify other users' habits throw "Not authorized" error
  - [x] No breaking changes - all legitimate app updates come from users modifying their own habits
- **Vuln ID:** VULN-003
- **Severity:** HIGH
- **Remediability:** EASY
- **File:** `convex/habits/update.ts`
- **Line:** 9-38 (update), 40-67 (updateNotes)
- **Issue:** The `update` and `updateNotes` mutations accepted a `habitId` argument and directly patched the habit record without verifying that the authenticated user owns the habit. Any authenticated user could modify any habit by simply providing its ID.
- **Attack Scenario (now mitigated):** An attacker who is an authenticated user could:
  1. Enumerate habit IDs (Convex IDs are sequential or discoverable)
  2. Call `habits.update` with another user's habitId
  3. Modify that user's habit name, notes, or settings
  4. Corrupt other users' habit tracking data
- **Fix Applied:**

  ```typescript
  // Both update and updateNotes now include:
  // SEC-003: Authentication check
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) {
    throw new Error('Unauthenticated: Must be logged in to update habits');
  }

  // SEC-003: Ownership verification
  const habit = await ctx.db.get(habitId);
  if (!habit) {
    throw new Error('Habit not found');
  }
  if (habit.userId !== identity.subject) {
    throw new Error('Not authorized to modify this habit');
  }
  ```

- **Breaking Change Risk:** LOW - The app always passes the current user's habits to the update function. No legitimate cross-user updates exist.
- **Dependencies:** None - this fix is self-contained

**Evaluated:** 2026-01-17 by security agent
**Implemented:** 2026-01-17 by security agent
**Loop:** 00001

---

### SEC-004: Missing Ownership Validation in habits:remove

- **Status:** `IMPLEMENTED`
- **Implemented In:** Loop 00001
- **Fix Applied:** Added authentication and ownership verification to both `remove` and `restore` mutations
- **Files Modified:** `convex/habits/remove.ts`
- **Verified:**
  - [x] Code review passed - authentication and ownership checks at start of handler
  - [x] Functionality preserved - authenticated users can still delete their own habits
  - [x] Vulnerability fixed - unauthenticated requests throw "Unauthenticated" error
  - [x] Vulnerability fixed - attempts to delete other users' habits throw "Not authorized" error
  - [x] Restore mutation now properly associates restored habit with authenticated user
  - [x] No breaking changes - all legitimate app deletions come from users deleting their own habits
- **Vuln ID:** VULN-004
- **Severity:** HIGH
- **Remediability:** EASY
- **File:** `convex/habits/remove.ts`
- **Line:** 9-70 (remove), 72-119 (restore)
- **Issue:** The `remove` mutation accepted a `habitId` argument and directly deleted the habit record without verifying that the authenticated user owns the habit. Any authenticated user could delete any habit by simply providing its ID. The `restore` mutation also lacked authentication.
- **Attack Scenario (now mitigated):** An attacker who is an authenticated user could:
  1. Enumerate habit IDs (Convex IDs are sequential or discoverable)
  2. Call `habits.remove` with another user's habitId
  3. Permanently delete that user's habit and all its tracking data
  4. Cause data loss for other users
- **Fix Applied:**

  ```typescript
  // remove mutation now includes:
  // SEC-004: Authentication check
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) {
    throw new Error('Unauthenticated: Must be logged in to delete habits');
  }

  const habit = await ctx.db.get(args.habitId);
  if (!habit) {
    throw new Error('Habit not found');
  }

  // SEC-004: Ownership verification
  if (habit.userId !== identity.subject) {
    throw new Error('Not authorized to delete this habit');
  }

  // restore mutation now includes:
  // SEC-004: Authentication check - restored habit will belong to authenticated user
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) {
    throw new Error('Unauthenticated: Must be logged in to restore habits');
  }
  // ... and inserts habit with userId: identity.subject
  ```

- **Breaking Change Risk:** LOW - The app always passes the current user's habits to the remove function. No legitimate cross-user deletions exist.
- **Dependencies:** None - this fix is self-contained

**Evaluated:** 2026-01-17 by security agent
**Implemented:** 2026-01-17 by security agent
**Loop:** 00001

---

### SEC-005: Cross-User Data Exposure in visionBoardImages:listRecent

- **Status:** `IMPLEMENTED`
- **Implemented In:** Loop 00001
- **Fix Applied:** Added authentication check and user filtering using `by_user` index
- **Files Modified:** `convex/visionBoardImagesQueries.ts`
- **Verified:**
  - [x] Code review passed - authentication check at start of handler
  - [x] User filtering applied - queries only return authenticated user's images
  - [x] Uses existing `by_user` index for efficient filtering
  - [x] Vulnerability fixed - unauthenticated requests throw "Unauthenticated" error
  - [x] No breaking changes - all app queries come from authenticated users
- **Vuln ID:** VULN-006
- **Severity:** HIGH
- **Remediability:** EASY
- **File:** `convex/visionBoardImagesQueries.ts`
- **Line:** 86-98
- **Issue:** The `listRecent` query returned all users' vision board images without any authentication or user filtering. Any client (authenticated or not) could call this query and see all users' private images.
- **Attack Scenario (now mitigated):** An attacker could:
  1. Call `visionBoardImages.listRecent` without authentication
  2. View all users' private vision board images
  3. Potentially access sensitive personal motivational content
- **Fix Applied:**

  ```typescript
  export const listRecent = query({
    args: { limit: v.optional(v.number()) },
    handler: async (ctx, args) => {
      // SEC-005: Authentication check
      const identity = await ctx.auth.getUserIdentity();
      if (!identity) {
        throw new Error(
          'Unauthenticated: Must be logged in to view recent images'
        );
      }

      const limit = args.limit ?? 10;

      // SEC-005: Filter by authenticated user's ID to prevent cross-user data exposure
      const images = await ctx.db
        .query('visionBoardImages')
        .withIndex('by_user', (q) => q.eq('userId', identity.subject))
        .order('desc')
        .take(limit);

      return resolveImageUrls(ctx, images);
    },
    returns: v.array(visionBoardImageObjectValidator),
  });
  ```

- **Breaking Change Risk:** LOW - The app always uses this query for the current authenticated user's dashboard. No legitimate cross-user access exists.
- **Dependencies:** None - this fix is self-contained

**Evaluated:** 2026-01-17 by security agent
**Implemented:** 2026-01-17 by security agent
**Loop:** 00001

---

### SEC-006: Cross-User Data Exposure in voiceNotes:listRecent

- **Status:** `IMPLEMENTED`
- **Implemented In:** Loop 00001
- **Fix Applied:** Added authentication check and removed optional userId parameter; now always filters by authenticated user
- **Files Modified:** `convex/voiceNotesQueries.ts`
- **Verified:**
  - [x] Code review passed - authentication check at start of handler
  - [x] User filtering applied - queries only return authenticated user's voice notes
  - [x] Uses existing `by_user` index for efficient filtering
  - [x] Vulnerability fixed - unauthenticated requests throw "Unauthenticated" error
  - [x] Removed bypass path - optional userId parameter removed
  - [x] No breaking changes - all app queries come from authenticated users
- **Vuln ID:** VULN-007
- **Severity:** HIGH
- **Remediability:** EASY
- **File:** `convex/voiceNotesQueries.ts`
- **Line:** 77-99
- **Issue:** The `listRecent` query had an optional `userId` parameter. When not provided, it returned ALL users' voice notes without any authentication or filtering.
- **Attack Scenario (now mitigated):** An attacker could:
  1. Call `voiceNotes.listRecent` without providing a userId
  2. View all users' private voice recordings
  3. Potentially access sensitive audio content
- **Fix Applied:**

  ```typescript
  export const listRecent = query({
    args: { limit: v.optional(v.number()) },
    handler: async (ctx, args) => {
      // SEC-006: Authentication check
      const identity = await ctx.auth.getUserIdentity();
      if (!identity) {
        throw new Error(
          'Unauthenticated: Must be logged in to view recent voice notes'
        );
      }

      const limit = args.limit ?? 10;

      // SEC-006: Always filter by authenticated user's ID
      return await ctx.db
        .query('voiceNotes')
        .withIndex('by_user', (q) => q.eq('userId', identity.subject))
        .order('desc')
        .take(limit);
    },
    returns: v.array(voiceNoteObjectValidator),
  });
  ```

- **Breaking Change Risk:** LOW - The app always uses this query for the current authenticated user's dashboard. No legitimate cross-user access exists.
- **Dependencies:** None - this fix is self-contained

**Evaluated:** 2026-01-17 by security agent
**Implemented:** 2026-01-17 by security agent
**Loop:** 00001

---

### SEC-007: Missing Ownership Validation in visionBoardImages:remove

- **Status:** `IMPLEMENTED`
- **Implemented In:** Loop 00001
- **Fix Applied:** Added authentication and ownership verification before allowing image deletion
- **Files Modified:** `convex/visionBoardImagesDelete.ts`
- **Verified:**
  - [x] Code review passed - authentication and ownership checks at start of handler
  - [x] Functionality preserved - authenticated users can still delete their own images
  - [x] Vulnerability fixed - unauthenticated requests throw "Unauthenticated" error
  - [x] Vulnerability fixed - attempts to delete other users' images throw "Not authorized" error
  - [x] No breaking changes - all legitimate app deletions come from users deleting their own images
- **Vuln ID:** VULN-008
- **Severity:** HIGH
- **Remediability:** EASY
- **File:** `convex/visionBoardImagesDelete.ts`
- **Line:** 13-66
- **Issue:** The `remove` mutation accepted an `imageId` argument and directly deleted the image and storage file without verifying that the authenticated user owns the image. Any authenticated user could delete any image by simply providing its ID.
- **Attack Scenario (now mitigated):** An attacker who is an authenticated user could:
  1. Enumerate visionBoardImages IDs (Convex IDs are sequential or discoverable)
  2. Call `visionBoardImages.remove` with another user's imageId
  3. Permanently delete that user's vision board image
  4. Cause data loss for other users
- **Fix Applied:**

  ```typescript
  // remove mutation now includes:
  // SEC-007: Authentication check
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) {
    throw new Error('Unauthenticated: Must be logged in to delete images');
  }

  const image = await ctx.db.get(args.imageId);
  if (!image) {
    throw new Error('Image not found');
  }

  // SEC-007: Ownership validation
  if (image.userId !== identity.subject) {
    throw new Error('Not authorized to delete this image');
  }
  ```

- **Breaking Change Risk:** LOW - The app always passes the current user's images to the remove function. No legitimate cross-user deletions exist.
- **Dependencies:** None - this fix is self-contained

**Evaluated:** 2026-01-17 by security agent
**Implemented:** 2026-01-17 by security agent
**Loop:** 00001

---

## PENDING - Ready for Auto-Remediation

### SEC-008: Missing Ownership Validation in voiceNotes Mutations

- **Status:** `PENDING`
- **Vuln ID:** VULN-009
- **Severity:** MEDIUM
- **Remediability:** EASY
- **File:** `convex/voiceNotesMutations.ts`
- **Line:** 62-99 (update), 104-113 (remove)
- **Issue:** The `update` and `remove` mutations for voice notes accept a `voiceNoteId` argument and directly modify/delete the record without verifying authentication or that the caller owns the voice note. Any user (authenticated or not) can modify or delete any voice note.
- **Attack Scenario:** An attacker could:
  1. Enumerate voiceNote IDs (Convex IDs are sequential or discoverable)
  2. Call `voiceNotes.update` to modify labels or Day 1 flags on other users' recordings
  3. Call `voiceNotes.remove` to delete other users' private voice recordings
  4. Corrupt or destroy users' motivational audio content
- **Fix Strategy:**
  1. Add authentication check at the start of both handlers using `ctx.auth.getUserIdentity()`
  2. Throw "Unauthenticated" error if no identity
  3. Retrieve the voice note and verify it exists
  4. Verify ownership by checking `voiceNote.userId === identity.subject`
  5. Throw "Not authorized" error if ownership check fails
  6. Proceed with the update/delete only after both checks pass
- **Proposed Fix:**

  ```typescript
  // For both update and remove mutations:
  // SEC-008: Authentication check
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) {
    throw new Error('Unauthenticated: Must be logged in to modify voice notes');
  }

  const voiceNote = await ctx.db.get(args.voiceNoteId);
  if (!voiceNote) {
    throw new Error('Voice note not found');
  }

  // SEC-008: Ownership validation
  if (voiceNote.userId !== identity.subject) {
    throw new Error('Not authorized to modify this voice note');
  }
  ```

- **Verification:**
  1. Unit test: Call update/remove without authentication → expect "Unauthenticated" error
  2. Unit test: Call update/remove as user A on user B's voice note → expect "Not authorized" error
  3. Unit test: Call update/remove as user A on user A's voice note → expect success
  4. Manual test: Verify voice notes can still be edited/deleted normally in the app
- **Breaking Change Risk:** LOW - The app always passes the current user's voice notes to these mutations. No legitimate cross-user modifications exist.
- **Dependencies:** None - this fix is self-contained

**Evaluated:** 2026-01-17 by security agent
**Loop:** 00001

---

## PENDING - MANUAL REVIEW

_No findings requiring manual review at this time._

---

## WON'T DO / FALSE POSITIVE

_No findings marked as won't do or false positive at this time._

---

## Remediation Order (Security)

Recommended sequence based on severity and dependencies:

1. **SEC-001** - Hardcoded Figma Token (CRITICAL - IMPLEMENTED, token revocation pending)
2. **SEC-002** - Unauthenticated File Storage Upload (CRITICAL, EASY - IMPLEMENTED)
3. **SEC-003** - Missing Ownership Validation in habits:update (HIGH, EASY - IMPLEMENTED)
4. **SEC-004** - Missing Ownership Validation in habits:remove (HIGH, EASY - IMPLEMENTED)
5. **SEC-005** - Cross-User Data Exposure in visionBoardImages:listRecent (HIGH, EASY - IMPLEMENTED)
6. **SEC-006** - Cross-User Data Exposure in voiceNotes:listRecent (HIGH, EASY - IMPLEMENTED)
7. **SEC-007** - Missing Ownership Validation in visionBoardImages:remove (HIGH, EASY - IMPLEMENTED)
8. **SEC-008** - Missing Ownership Validation in voiceNotes Mutations (MEDIUM, EASY - PENDING)

_All CRITICAL and HIGH severity items with EASY/MEDIUM remediability have been implemented. MEDIUM severity items are now being addressed._

---

## Dependencies (Security)

_None identified yet. Will be updated as more findings are evaluated._

---

# Test Implementation Plan - Loop 00001

## Test Summary

- **Total Test Candidates:** 24
- **IMPLEMENTED:** 2 (TEST-001, TEST-002 - tests already existed)
- **Auto-Implement (PENDING):** 8 - Est. coverage gain: +13.5%
- **Manual Review:** 5
- **Won't Do:** 9

## Current Coverage: 39.72%

## Target Coverage: 80%

## Estimated Post-Loop Coverage: 58.2% (Phase 1 & 2 only)

---

## PENDING - Ready for Auto-Implementation

### TEST-001: calculateNewStrength (v2.0 Momentum Formula)

- **Status:** `IMPLEMENTED`
- **Implemented In:** Loop 00001
- **File:** `convex/habitStrength.ts`
- **Test File:** `convex/habitStrength.test.ts`
- **Gap ID:** GAP-004
- **Importance:** CRITICAL
- **Testability:** EASY
- **Est. Coverage Gain:** +2.0%
- **Test Type:** Unit
- **Test Cases Added:** 18 (already existed)
- **Test Strategy:**
  - Test growth on completion (3% of remaining gap to 100)
  - Test decay on miss with varying streak shield levels (0-7 completions)
  - Test boundary conditions (0% strength, 100% strength, edge of caps)
  - Verify `GROWTH_RATE`, `BASE_DECAY`, `SHIELD_EFFECTIVENESS` constants are applied correctly
- **Mocks Needed:** None - pure function
- **Implementation Notes:**
  - Comprehensive tests already exist in `convex/habitStrength.test.ts` (lines 22-304)
  - Tests cover: AC1 (growth), AC2 (decay), AC3 (streak shield), AC4 (66-day target), edge cases, recovery scenarios
  - Coverage report shows 0% likely due to Jest config not collecting coverage from `convex/` directory
  - **Action Required:** Verify Jest `collectCoverageFrom` includes `convex/**/*.ts` in coverage run

### TEST-002: calculateMomentumStrengthSnapshot

- **Status:** `IMPLEMENTED`
- **Implemented In:** Loop 00001
- **File:** `convex/habitStrength.ts`
- **Test File:** `convex/habitStrength.test.ts`
- **Gap ID:** GAP-005
- **Importance:** CRITICAL
- **Testability:** EASY
- **Est. Coverage Gain:** +3.0%
- **Test Type:** Unit
- **Test Cases Added:** 2 (already existed)
- **Test Strategy:**
  - Test with empty tracking history (returns baseline only)
  - Test with all completions (strength grows smoothly)
  - Test with all misses (strength decays with shield protection)
  - Test with mixed patterns (realistic user behavior)
  - Test with backfilled dates (out-of-order tracking)
- **Mocks Needed:** None - pure function, takes tracking data as parameter
- **Implementation Notes:**
  - Tests exist in `convex/habitStrength.test.ts` (lines 347-384)
  - Covers decay on missed days and backfilled tracking dates
  - Could benefit from additional test cases for empty history and mixed patterns
  - Same coverage reporting issue as TEST-001

### TEST-003: parseDateKeyToLocalDate Validation

- **Status:** `PENDING`
- **File:** `convex/habitStrength.ts`
- **Gap ID:** GAP-006
- **Importance:** MEDIUM
- **Testability:** EASY
- **Est. Coverage Gain:** +0.5%
- **Test Type:** Unit
- **Test Strategy:**
  - Test valid date keys: "2025-01-15", "2024-12-31"
  - Test invalid month: "2025-13-15" (month 13)
  - Test invalid day: "2025-01-32" (day 32)
  - Test malformed strings: "2025/01/15", "01-15-2025", "invalid"
- **Mocks Needed:** None - pure function

### TEST-004: logisticBaseline Edge Cases

- **Status:** `PENDING`
- **File:** `convex/habitStrength.ts`
- **Gap ID:** GAP-016
- **Importance:** MEDIUM
- **Testability:** EASY
- **Est. Coverage Gain:** +0.5%
- **Test Type:** Unit
- **Test Strategy:**
  - Test day 0 (habit creation day)
  - Test day 7 (calibration point - should be ~18.3%)
  - Test day 90 (target - should be LOGISTIC_TARGET_VALUE)
  - Test day 365 (long-term - should be close to but not exceed target)
  - Test `LOGISTIC_TARGET_VALUE === 0` edge case
- **Mocks Needed:** None - pure function

### TEST-005: computeCompliance Zero Days

- **Status:** `PENDING`
- **File:** `convex/habitStrength.ts`
- **Gap ID:** GAP-017
- **Importance:** MEDIUM
- **Testability:** EASY
- **Est. Coverage Gain:** +0.5%
- **Test Type:** Unit
- **Test Strategy:**
  - Test with empty tracking map (daysConsidered = 0, should return 0%)
  - Test with evaluation date before habit creation
  - Test with single day of tracking data
  - Test with full week of data (7 days)
- **Mocks Needed:** None - pure function

### TEST-006: getStreaksForHabit Helper

- **Status:** `PENDING`
- **File:** `convex/analytics.ts`
- **Gap ID:** GAP-010
- **Importance:** HIGH
- **Testability:** EASY
- **Est. Coverage Gain:** +2.0%
- **Test Type:** Unit
- **Test Strategy:**
  - Test consecutive days streak (5 days in a row)
  - Test broken streak with gap (3 days, miss, 2 days)
  - Test current streak detection (completed today vs not)
  - Test longest streak separate from current streak
  - Test empty tracking history
- **Mocks Needed:** None - pure function (takes tracking data as parameter)

### TEST-007: calculateStreakFromHistory

- **Status:** `PENDING`
- **File:** `convex/streakUtils.ts`
- **Gap ID:** GAP-024
- **Importance:** HIGH
- **Testability:** EASY
- **Est. Coverage Gain:** +2.0%
- **Test Type:** Unit
- **Test Strategy:**
  - Test consecutive completions (7 day streak)
  - Test gaps in streak (3 completed, 1 miss, 2 completed = 2 streak)
  - Test backfill scenarios (dates added out of order)
  - Test timezone edge cases (midnight boundary)
  - Test empty history (0 streak)
- **Mocks Needed:** None - pure function

### TEST-008: EmptyState Component

- **Status:** `PENDING`
- **File:** `src/components/EmptyState.tsx`
- **Gap ID:** GAP-013
- **Importance:** MEDIUM
- **Testability:** EASY
- **Est. Coverage Gain:** +0.5%
- **Test Type:** Unit
- **Test Strategy:**
  - Test renders without crashing
  - Test CTA button is visible
  - Test onPress callback is called when button pressed
  - Test with different props (title, message, buttonText)
- **Mocks Needed:** None - simple presentational component

### TEST-009: ChainLinkIcon Render Branches

- **Status:** `PENDING`
- **File:** `src/components/ChainLinkIcon.tsx`
- **Gap ID:** GAP-023
- **Importance:** LOW
- **Testability:** EASY
- **Est. Coverage Gain:** +0.5%
- **Test Type:** Unit
- **Test Strategy:**
  - Test with isLinked=true (renders connected chain)
  - Test with isLinked=false (renders broken chain)
  - Test with different sizes (small, medium, large)
  - Test with different colors
- **Mocks Needed:** None - presentational component
- **Note:** Already has 83% branch coverage, just need to cover remaining 17%

### TEST-010: toggleHabit Future Date Validation

- **Status:** `PENDING`
- **File:** `convex/habits.ts`
- **Gap ID:** GAP-002
- **Importance:** HIGH
- **Testability:** MEDIUM
- **Est. Coverage Gain:** +1.0%
- **Test Type:** Edge Case
- **Test Strategy:**
  - Test with valid date format (YYYY-MM-DD) returns success
  - Test with invalid date format throws validation error
  - Test with future date (tomorrow) throws "Cannot track future dates" error
  - Test with today's date succeeds
  - Test with yesterday's date succeeds (backfill allowed)
- **Mocks Needed:** Mock Convex context (ctx.db, ctx.auth) - basic mock pattern needed

---

## PENDING - MANUAL REVIEW

### TEST-011: habits.ts - All CRUD Operations

- **Status:** `PENDING - MANUAL REVIEW`
- **File:** `convex/habits.ts`
- **Gap ID:** GAP-001
- **Importance:** CRITICAL
- **Testability:** HARD
- **Reason for Review:** Requires Convex context mocking infrastructure that doesn't exist yet. 217 LOC file with 15+ mutations/queries. Testing all of them needs a reusable mock pattern.
- **Recommended Approach:**
  1. Create `convex/__tests__/helpers/mockConvexContext.ts` with factory for mock ctx
  2. Start with simplest mutation (`get`) to establish pattern
  3. Build up to complex mutations (`create`, `update`, `toggleHabit`)
  4. Share mock patterns across all Convex tests

### TEST-012: Toast Component

- **Status:** `PENDING - MANUAL REVIEW`
- **File:** `src/components/Toast.tsx`
- **Gap ID:** GAP-011
- **Importance:** HIGH
- **Testability:** HARD
- **Reason for Review:** Requires mocking Reanimated and Gesture Handler. 328 LOC with complex animation and gesture logic. Jest setup changes needed.
- **Recommended Approach:**
  1. Add Reanimated mock to jest.setup.js (`jest/setup.js` from reanimated package)
  2. Mock GestureDetector and Gesture.Pan()
  3. Test variant rendering first (success, error, info, undo)
  4. Test onDismiss callback
  5. Skip animation timing tests (flaky)

### TEST-013: SettingsModal

- **Status:** `PENDING - MANUAL REVIEW`
- **File:** `src/components/SettingsModal/SettingsModal.tsx`
- **Gap ID:** GAP-012
- **Importance:** HIGH
- **Testability:** HARD
- **Reason for Review:** Known blocker - requires SafeAreaProvider wrapper in test utils. Also needs lucide-react-native mocks.
- **Recommended Approach:**
  1. Update test-utils.tsx to include SafeAreaProvider wrapper
  2. Mock lucide-react-native icons as simple View components
  3. Test toggle handlers fire correctly
  4. Test navigation to ArchivedHabitsModal view

### TEST-014: App.tsx Entry Point

- **Status:** `PENDING - MANUAL REVIEW`
- **File:** `App.tsx`
- **Gap ID:** GAP-014
- **Importance:** CRITICAL
- **Testability:** VERY HARD
- **Reason for Review:** Needs extensive mocking of ConvexProvider, ClerkProvider, navigation, and all app-level providers. Integration test that may be better suited for E2E testing.
- **Recommended Approach:**
  1. Consider if unit testing is even the right approach here
  2. If unit testing: mock all providers, just verify app renders
  3. If E2E: use Detox or Maestro for full integration
  4. May be better as a Storybook integration test

### TEST-015: analytics.ts - All Queries

- **Status:** `PENDING - MANUAL REVIEW`
- **File:** `convex/analytics.ts`
- **Gap ID:** GAP-009
- **Importance:** HIGH
- **Testability:** MEDIUM
- **Reason for Review:** 6 analytics queries need Convex context mocking. Could be tested as pure functions if data is passed as parameters, but need to verify query handlers extract data correctly.
- **Recommended Approach:**
  1. Reuse Convex mock pattern from TEST-011
  2. Test aggregation logic with known fixture data
  3. Verify correct calculations for `getOverviewStats`, `get30DayTrend`, etc.

---

## WON'T DO

### TEST-016: habits.ts Error Handlers (Habit Not Found)

- **Status:** `WON'T DO`
- **File:** `convex/habits.ts`
- **Gap ID:** GAP-003
- **Importance:** MEDIUM
- **Testability:** HARD
- **Reason:** Error paths in Convex mutations require full mutation execution with mock context. Low value relative to effort since error handling is straightforward ("throw new Error()"). Should be covered implicitly when testing happy paths with proper edge cases.

### TEST-017: updateHabitStrength Mutation

- **Status:** `WON'T DO`
- **File:** `convex/habitStrength.ts`
- **Gap ID:** GAP-007
- **Importance:** HIGH
- **Testability:** HARD
- **Reason:** Convex mutation requiring full ctx mock. The core logic (`calculateNewStrength`) is tested separately. This mutation is mostly glue code (date validation + DB upsert) that's better verified through integration tests.

### TEST-018: recalculateHabitStrength Mutation

- **Status:** `WON'T DO`
- **File:** `convex/habitStrength.ts`
- **Gap ID:** GAP-008
- **Importance:** MEDIUM
- **Testability:** HARD
- **Reason:** Rarely used (migrations/data recovery only). Core calculation logic is tested via `calculateMomentumStrengthSnapshot`. Mutation is mostly DB operations.

### TEST-019: templates.ts

- **Status:** `WON'T DO`
- **File:** `convex/templates.ts`
- **Gap ID:** GAP-015
- **Importance:** LOW
- **Testability:** MEDIUM
- **Reason:** 465 LOC of mostly static template definitions. CRUD operations are straightforward. Risk of bugs is low. Testing effort not justified by value.

### TEST-020: reorderHabits Empty Array

- **Status:** `WON'T DO`
- **File:** `convex/habits.ts`
- **Gap ID:** GAP-018
- **Importance:** MEDIUM
- **Testability:** HARD
- **Reason:** Single edge case (empty array early return) in a Convex mutation. Requires full mutation mocking for one trivial branch. Not worth the setup cost.

### TEST-021: list Query Authentication

- **Status:** `WON'T DO`
- **File:** `convex/habits.ts`
- **Gap ID:** GAP-019
- **Importance:** HIGH
- **Testability:** HARD
- **Reason:** Auth branch testing requires mocking `ctx.auth.getUserIdentity()`. This is better tested as part of integration/E2E tests that verify auth works across the full stack.

### TEST-022: BinaryHeatmap StatsRow Branches

- **Status:** `WON'T DO`
- **File:** `src/components/BinaryHeatmap/StatsRow.tsx`
- **Gap ID:** GAP-020
- **Importance:** MEDIUM
- **Testability:** MEDIUM
- **Reason:** Already has 85% line coverage. The untested 15% are likely edge case branches that rarely execute. Diminishing returns for testing effort.

### TEST-023: BinaryHeatmap BinaryCell Branches

- **Status:** `WON'T DO`
- **File:** `src/components/BinaryHeatmap/BinaryCell.tsx`
- **Gap ID:** GAP-021
- **Importance:** MEDIUM
- **Testability:** MEDIUM
- **Reason:** Has 79% line coverage. The 50% function coverage gap is likely event handlers. These are better tested via integration tests. Existing tests are sufficient.

### TEST-024: RewardCelebrationToast

- **Status:** `WON'T DO`
- **File:** `src/components/RewardCelebrationToast.tsx`
- **Gap ID:** GAP-022
- **Importance:** MEDIUM
- **Testability:** HARD
- **Reason:** Animation-heavy component with 55% coverage already. Reanimated mocking required. Animation timing tests are inherently flaky. Current coverage is acceptable for a celebration UI component.

---

## Implementation Order

Recommended sequence based on coverage impact and dependencies:

### Phase 1: Pure Functions (No Mocks Needed) - Target +10% coverage

1. **TEST-001** - calculateNewStrength (+2.0%)
2. **TEST-002** - calculateMomentumStrengthSnapshot (+3.0%)
3. **TEST-006** - getStreaksForHabit (+2.0%)
4. **TEST-007** - calculateStreakFromHistory (+2.0%)
5. **TEST-003** - parseDateKeyToLocalDate (+0.5%)
6. **TEST-004** - logisticBaseline edge cases (+0.5%)
7. **TEST-005** - computeCompliance zero days (+0.5%)

### Phase 2: Simple UI Components (No Complex Mocks) - Target +1.5% coverage

8. **TEST-008** - EmptyState (+0.5%)
9. **TEST-009** - ChainLinkIcon (+0.5%)

### Phase 3: Moderate Complexity (Basic Mocks) - Target +1% coverage

10. **TEST-010** - toggleHabit date validation (+1.0%)

### Phase 4: Manual Review (Infrastructure Needed)

_Requires manual developer setup:_

- TEST-011 through TEST-015 need Convex mock infrastructure
- TEST-012 and TEST-013 need animation/gesture mocking
- TEST-014 needs decision on unit vs E2E approach

---

## Dependencies

Tests that share setup or mocking infrastructure:

- **Group A (Pure Convex Functions):** TEST-001, TEST-002, TEST-003, TEST-004, TEST-005
  - All test pure functions from `convex/habitStrength.ts`
  - Can be implemented in a single test file
  - No mocking required

- **Group B (Analytics):** TEST-006 (from analytics.ts), TEST-007 (from streakUtils.ts)
  - Both deal with streak/analytics calculations
  - Both are pure functions with similar input patterns (tracking history)

- **Group C (Convex Mutations):** TEST-010, TEST-011, TEST-015, TEST-017, TEST-018
  - All need Convex context mocking
  - Once mock infrastructure exists, all become testable

- **Group D (UI with Animation):** TEST-012, TEST-013, TEST-024
  - All need Reanimated/Gesture Handler mocking
  - All need SafeAreaProvider wrapper

---

## Blockers & Recommendations

### Before Starting Auto-Implementation

1. **Verify Test Runner Includes Convex Files**
   - Coverage report shows 0% for `convex/habitStrength.ts` but tests exist
   - Check Jest config includes `convex/**/*.ts` in coverage collection

2. **Update Test Utils with SafeAreaProvider**
   - Create enhanced render function in `__tests__/utils/test-utils.tsx`
   - Wrap with SafeAreaProvider, ThemeProvider, and other required providers

3. **Create Convex Mock Factory (for Phase 4)**
   - `convex/__tests__/helpers/mockConvexContext.ts`
   - Factory pattern for creating mock `ctx` with configurable db state
   - Include mock auth identity generator

---

_Evaluated: 2026-01-08_
_Agent: refactor-performance-security-testing_
_Loop: 00001_
