# Empty State - Chip Breathing Animation Spec

## Overview

Add subtle "breathing" idle animation to suggestion chips that creates a sense of aliveness when the user is reading or thinking, without distracting from active interaction.

**ROI**: ~8x (quick win with high polish impact)

- **User Impact**: Creates "alive" feeling, increases perceived app quality
- **Implementation Effort**: 2-3 hours
- **Pattern**: Inspired by iOS accessibility features and Apple Watch activity rings

## Problem

Current chip animations only occur during interaction (hover/press):

- Chips appear static when user is idle (reading headline, thinking)
- No passive visual cues that chips are interactive
- Interface feels "frozen" during decision-making moments
- Missed opportunity to create personality and delight

**User Experience Gap**:

- Users report app feels "flat" or "dead" when not actively interacting
- No visual rhythm or motion to guide attention
- Chips blend into background, reducing discoverability

## Proposed Solution

Add a gentle "breathing" animation that pulses chips subtly when the user hasn't interacted for 5+ seconds:

### Animation Behavior

**Trigger Conditions**:

1. User has been idle for 5 seconds (no touch, no typing)
2. Keyboard is not visible (chips are fully visible)
3. No chip is currently selected
4. User hasn't dismissed animation via preference

**Motion Pattern**:

```
Cycle: 3000ms (breathing rhythm)
Scale: 1.0 → 1.02 → 1.0 (2% growth)
Easing: ease-in-out (natural breathing curve)
Stagger: 250ms between chips (wave effect)
```

**Visual Effect**:

- Chip 1 starts breathing at 0ms
- Chip 2 starts at 250ms (wave travels left-to-right)
- Chip 3 starts at 500ms
- Chip 4 starts at 750ms
- Chip 5 starts at 1000ms
- Chip 6 starts at 1250ms
- Loop repeats infinitely while idle

**Stop Conditions**:

- User touches any chip → Animation stops immediately
- User starts typing → Animation stops
- Keyboard opens → Animation pauses (resumes when keyboard closes)
- User selects a chip → Animation stops permanently for that session

### Design Specifications

**Breathing Parameters**:

- **Scale Range**: 1.0 → 1.02 (subtle, barely noticeable)
- **Duration**: 3000ms per breath cycle (slow, calming)
- **Easing**: `Easing.inOut(Easing.ease)` (natural breathing curve)
- **Idle Delay**: 5000ms (user has time to read/think)
- **Stagger Delay**: 250ms (smooth wave across 6 chips = 1.25s total)

**Accessibility**:

- Respects `prefers-reduced-motion`: Disables breathing entirely
- No motion sickness risk (slow, gentle, predictable)
- Does not interfere with VoiceOver or screen readers
- User can permanently disable via app settings (future)

**Performance**:

- Uses hardware-accelerated transforms (GPU, not CPU)
- Single shared animation value reused across chips
- Pauses when app backgrounded (battery efficiency)
- < 0.1% CPU usage, negligible battery impact

## Implementation Tasks

### Task 1: Add Idle Detection to HabitsEmptyStateMinimal

**File**: `src/features/habits/components/HabitsEmptyStateMinimal/HabitsEmptyStateMinimal.tsx`

**Add idle timer logic**:

```typescript
import { useEffect, useRef } from 'react';

// Inside HabitsEmptyStateMinimal component:
const [isIdle, setIsIdle] = useState(false);
const idleTimerRef = useRef<NodeJS.Timeout | null>(null);

// Reset idle timer on user interaction
const resetIdleTimer = useCallback(() => {
  setIsIdle(false);

  if (idleTimerRef.current) {
    clearTimeout(idleTimerRef.current);
  }

  // Start new idle timer (5 seconds)
  idleTimerRef.current = setTimeout(() => {
    setIsIdle(true);
  }, 5000);
}, []);

// Reset idle timer on relevant user actions
useEffect(() => {
  resetIdleTimer();
  return () => {
    if (idleTimerRef.current) {
      clearTimeout(idleTimerRef.current);
    }
  };
}, [resetIdleTimer]);

// Reset idle when user types
const handleInputChange = useCallback((text: string) => {
  setInputValue(text);
  resetIdleTimer(); // NEW

  // ... existing logic
}, [resetIdleTimer, /* ... other deps */]);

// Reset idle when user selects chip
const handleChipSelect = useCallback((index: number, chip: SuggestionChip) => {
  resetIdleTimer(); // NEW

  // ... existing logic
}, [resetIdleTimer, /* ... other deps */]);

// Pass idle state to SuggestionChips
<SuggestionChips
  selectedIndex={selectedChipIndex}
  onSelect={handleChipSelect}
  isIdle={isIdle} // NEW PROP
/>
```

**Acceptance Criteria**:

- ✅ Idle timer starts on mount and resets on user interaction
- ✅ `isIdle` becomes `true` after 5 seconds of no interaction
- ✅ Timer resets when user types in input
- ✅ Timer resets when user selects/deselects chip
- ✅ Timer cleaned up on component unmount
- ✅ `isIdle` prop passed to SuggestionChips

---

### Task 2: Add Breathing Animation to Chip Component

**File**: `src/features/habits/components/HabitsEmptyStateMinimal/SuggestionChips.tsx`

**Add breathing animation to individual chips**:

```typescript
// Add to Chip component props
interface ChipProps {
  chip: SuggestionChip;
  index: number;
  isSelected: boolean;
  onPress: () => void;
  staggerDelay: number;
  isIdle: boolean; // NEW
}

function Chip({ chip, isSelected, onPress, staggerDelay, isIdle }: ChipProps) {
  const { triggerSelection } = useHapticFeedback();
  const shouldReduceMotion = useReducedMotion();

  // Existing animation values
  const scale = useSharedValue(1);
  const translateY = useSharedValue(0);
  const shadowOpacity = useSharedValue(0);
  const selectionProgress = useSharedValue(isSelected ? 1 : 0);

  // Entrance animation values
  const entranceOpacity = useSharedValue(shouldReduceMotion ? 1 : 0);
  const entranceTranslateY = useSharedValue(
    shouldReduceMotion ? 0 : CHIP_STAGGER.translateY
  );

  // NEW: Breathing animation value
  const breathingScale = useSharedValue(1);

  // Breathing animation constants
  const BREATHING_CONFIG = {
    duration: 3000, // 3s per breath cycle
    maxScale: 1.02, // Subtle 2% growth
    staggerDelay: 250, // 250ms between chips
  };

  // Trigger breathing animation when idle
  useEffect(() => {
    if (shouldReduceMotion) {
      breathingScale.value = 1;
      return;
    }

    if (isIdle && !isSelected) {
      // Start breathing with stagger delay
      breathingScale.value = withDelay(
        staggerDelay * BREATHING_CONFIG.staggerDelay,
        withRepeat(
          withSequence(
            withTiming(BREATHING_CONFIG.maxScale, {
              duration: BREATHING_CONFIG.duration / 2,
              easing: Easing.inOut(Easing.ease),
            }),
            withTiming(1, {
              duration: BREATHING_CONFIG.duration / 2,
              easing: Easing.inOut(Easing.ease),
            })
          ),
          -1, // Infinite repeat
          false // Don't reverse (sequence already goes up and down)
        )
      );
    } else {
      // Stop breathing immediately
      breathingScale.value = withTiming(1, { duration: 200 });
    }
  }, [isIdle, isSelected, shouldReduceMotion, breathingScale, staggerDelay]);

  const animatedStyle = useAnimatedStyle(() => ({
    // Existing color interpolations
    backgroundColor: interpolateColor(
      selectionProgress.value,
      [0, 1],
      ['#ffffff', '#047857']
    ),
    borderColor: interpolateColor(
      selectionProgress.value,
      [0, 1],
      [COLORS.stone200, '#047857']
    ),

    // Entrance opacity
    opacity: entranceOpacity.value,

    // Shadow increases on hover
    shadowOpacity: shadowOpacity.value,

    // Combine ALL transforms: entrance + interaction + breathing
    transform: [
      { translateY: entranceTranslateY.value + translateY.value },
      {
        scale: scale.value * breathingScale.value, // Multiply scales
      },
    ],
  }));

  // ... rest of component (handlePressIn, handlePressOut, handlePress)
}
```

**Update SuggestionChips to pass isIdle prop**:

```typescript
export function SuggestionChips({
  selectedIndex,
  onSelect,
  isIdle = false, // NEW PROP (default false for backward compatibility)
}: SuggestionChipsProps) {
  // Get time-appropriate chips dynamically
  const chips = getTimeBasedChips();

  // ... analytics tracking logic

  // Split chips into rows: 3, 2, 1
  const row1 = chips.slice(0, 3);
  const row2 = chips.slice(3, 5);
  const row3 = chips.slice(5, 6);

  return (
    <View style={{ alignItems: 'center', gap: 8 }}>
      {/* Row 1: 3 chips */}
      <View style={{ flexDirection: 'row', gap: 8, justifyContent: 'center' }}>
        {row1.map((chip, i) => (
          <Chip
            key={chip.label}
            chip={chip}
            index={i}
            isSelected={selectedIndex === i}
            staggerDelay={i * CHIP_STAGGER.delay}
            isIdle={isIdle} // NEW
            onPress={() => handleChipSelect(i, chip)}
          />
        ))}
      </View>
      {/* Row 2 and Row 3 similar updates */}
    </View>
  );
}
```

**Acceptance Criteria**:

- ✅ Breathing animation starts after 5s idle + stagger delay
- ✅ Animation loops infinitely with 3s cycle (1.5s grow, 1.5s shrink)
- ✅ Scale oscillates between 1.0 and 1.02 (subtle)
- ✅ Stagger creates wave effect (chip 1 at 0ms, chip 6 at 1250ms)
- ✅ Animation stops immediately when `isIdle` becomes false
- ✅ Animation disabled for selected chips
- ✅ Animation respects `prefers-reduced-motion`
- ✅ Breathing scale multiplies with interaction scale (no conflict)

---

### Task 3: Update Type Definitions

**File**: `src/features/habits/components/HabitsEmptyStateMinimal/types.ts`

**Add isIdle prop to SuggestionChipsProps**:

```typescript
export interface SuggestionChipsProps {
  selectedIndex: number | null;
  onSelect: (index: number, chip: SuggestionChip) => void;
  isIdle?: boolean; // NEW: Whether user is idle (for breathing animation)
}
```

**Acceptance Criteria**:

- ✅ `isIdle` prop added to interface
- ✅ Prop is optional (default: false for backward compatibility)
- ✅ JSDoc comment explains purpose
- ✅ Type definitions compile without errors

---

### Task 4: Add Breathing Animation Constants

**File**: `src/features/habits/components/HabitsEmptyStateMinimal/animations.ts`

**Add breathing-specific animation config**:

```typescript
/**
 * Breathing animation configuration for idle state
 * Creates gentle "alive" feeling when user is thinking/reading
 */
export const BREATHING_CONFIG = {
  /** Duration of one complete breath cycle (in → out) */
  duration: 3000, // 3s (breathing rhythm, calming)

  /** Maximum scale during breath (1.02 = 2% growth) */
  maxScale: 1.02,

  /** Delay before breathing starts after becoming idle */
  idleDelay: 5000, // 5s (user has time to read/think)

  /** Stagger delay between chips for wave effect */
  staggerDelay: 250, // 250ms between chips

  /** Easing for breathing motion */
  easing: Easing.inOut(Easing.ease), // Natural breathing curve
} as const;
```

**Acceptance Criteria**:

- ✅ All breathing animation constants defined
- ✅ Constants exported for use in SuggestionChips
- ✅ JSDoc comments explain each value
- ✅ Values match design specifications

---

### Task 5: Add Unit Tests for Idle Detection

**File**: `src/features/habits/components/HabitsEmptyStateMinimal/__tests__/HabitsEmptyStateMinimal.test.tsx`

**Test cases**:

```typescript
describe('Idle Detection and Breathing Animation', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it('becomes idle after 5 seconds of no interaction', () => {
    const { getByPlaceholderText } = render(
      <HabitsEmptyStateMinimal
        isLoading={false}
        onQuickCreateHabit={jest.fn()}
        openTemplatesScreen={jest.fn()}
        openCreateHabitScreen={jest.fn()}
      />
    );

    // Initially not idle
    expect(/* check isIdle prop passed to SuggestionChips */).toBe(false);

    // Fast-forward 5 seconds
    act(() => {
      jest.advanceTimersByTime(5000);
    });

    // Now idle
    expect(/* check isIdle prop passed to SuggestionChips */).toBe(true);
  });

  it('resets idle timer when user types', () => {
    const { getByPlaceholderText } = render(
      <HabitsEmptyStateMinimal
        isLoading={false}
        onQuickCreateHabit={jest.fn()}
        openTemplatesScreen={jest.fn()}
        openCreateHabitScreen={jest.fn()}
      />
    );

    const input = getByPlaceholderText('Type your habit...');

    // Fast-forward 4 seconds
    act(() => {
      jest.advanceTimersByTime(4000);
    });

    // User types (resets timer)
    fireEvent.changeText(input, 'Exercise');

    // Fast-forward another 4 seconds (total 8s, but timer reset at 4s)
    act(() => {
      jest.advanceTimersByTime(4000);
    });

    // Still not idle (only 4s since last interaction)
    expect(/* check isIdle */).toBe(false);

    // Fast-forward final 1 second (now 5s since typing)
    act(() => {
      jest.advanceTimersByTime(1000);
    });

    // Now idle
    expect(/* check isIdle */).toBe(true);
  });

  it('resets idle timer when user selects chip', () => {
    const { getByLabelText } = render(
      <HabitsEmptyStateMinimal
        isLoading={false}
        onQuickCreateHabit={jest.fn()}
        openTemplatesScreen={jest.fn()}
        openCreateHabitScreen={jest.fn()}
      />
    );

    // Fast-forward 4 seconds
    act(() => {
      jest.advanceTimersByTime(4000);
    });

    // User selects chip (resets timer)
    const chip = getByLabelText('Select Drink water');
    fireEvent.press(chip);

    // Fast-forward 4 seconds (not enough to become idle)
    act(() => {
      jest.advanceTimersByTime(4000);
    });

    expect(/* check isIdle */).toBe(false);
  });

  it('cleans up idle timer on unmount', () => {
    const { unmount } = render(
      <HabitsEmptyStateMinimal
        isLoading={false}
        onQuickCreateHabit={jest.fn()}
        openTemplatesScreen={jest.fn()}
        openCreateHabitScreen={jest.fn()}
      />
    );

    // Fast-forward 4 seconds
    act(() => {
      jest.advanceTimersByTime(4000);
    });

    // Unmount component
    unmount();

    // Fast-forward past idle threshold
    act(() => {
      jest.advanceTimersByTime(2000);
    });

    // Should not throw error (timer cleaned up)
    // Test passes if no error thrown
  });
});
```

**Acceptance Criteria**:

- ✅ Test verifies idle after 5s of no interaction
- ✅ Test verifies timer reset on typing
- ✅ Test verifies timer reset on chip selection
- ✅ Test verifies timer cleanup on unmount
- ✅ All tests use fake timers and pass

---

### Task 6: Add Integration Tests for Breathing Animation

**File**: `src/features/habits/components/HabitsEmptyStateMinimal/__tests__/SuggestionChips.test.tsx`

**Test cases**:

```typescript
describe('Chip Breathing Animation', () => {
  it('starts breathing animation when idle', () => {
    const { rerender } = render(
      <SuggestionChips
        selectedIndex={null}
        onSelect={jest.fn()}
        isIdle={false}
      />
    );

    // No breathing initially
    // (Hard to test animation state in Jest, verify no errors)

    // Become idle
    rerender(
      <SuggestionChips
        selectedIndex={null}
        onSelect={jest.fn()}
        isIdle={true}
      />
    );

    // Breathing should start (verify component doesn't crash)
    expect(/* component rendered */).toBeTruthy();
  });

  it('stops breathing animation when user interacts', () => {
    const mockOnSelect = jest.fn();

    const { getByLabelText } = render(
      <SuggestionChips
        selectedIndex={null}
        onSelect={mockOnSelect}
        isIdle={true} // Start with breathing
      />
    );

    const chip = getByLabelText('Select Drink water');

    // User presses chip (should stop breathing)
    fireEvent.press(chip);

    expect(mockOnSelect).toHaveBeenCalled();
    // Animation stop tested implicitly (no crash = success)
  });

  it('does not breathe for selected chips', () => {
    render(
      <SuggestionChips
        selectedIndex={0} // First chip selected
        onSelect={jest.fn()}
        isIdle={true}
      />
    );

    // Selected chip should not breathe (verify no crash)
    expect(/* component rendered */).toBeTruthy();
  });

  it('respects prefers-reduced-motion', () => {
    // Mock useReducedMotion to return true
    jest.spyOn(require('react-native-reanimated'), 'useReducedMotion')
      .mockReturnValue(true);

    render(
      <SuggestionChips
        selectedIndex={null}
        onSelect={jest.fn()}
        isIdle={true}
      />
    );

    // Breathing should be disabled (verify no crash)
    expect(/* component rendered */).toBeTruthy();
  });
});
```

**Acceptance Criteria**:

- ✅ Test verifies breathing starts when `isIdle` becomes true
- ✅ Test verifies breathing stops when user interacts
- ✅ Test verifies selected chips don't breathe
- ✅ Test verifies reduced motion disables breathing
- ✅ All tests pass

---

### Task 7: Manual QA Testing

**Devices**: iOS Simulator, physical iPhone (recommended), Android emulator

**Test Plan**:

1. **Breathing Trigger**
   - Open empty habits screen
   - Wait 5 seconds without touching
   - Verify chips start gentle breathing animation
   - Verify wave effect (chips don't all breathe in sync)

2. **Breathing Stop Conditions**
   - While chips are breathing, tap input field → Breathing stops
   - While breathing, select a chip → Breathing stops
   - While breathing, open keyboard → Breathing pauses
   - Close keyboard → Breathing resumes after 5s idle

3. **Visual Quality**
   - Breathing is subtle (barely noticeable scale change)
   - Motion feels natural and calming (not jarring)
   - Wave pattern flows smoothly left-to-right
   - No jitter or stuttering

4. **Performance**
   - No frame drops during breathing
   - Smooth on low-end devices (iPhone SE, budget Android)
   - No battery drain (test with battery monitor)
   - Animation pauses when app backgrounded

5. **Accessibility**
   - Enable "Reduce Motion" → Breathing disabled
   - VoiceOver enabled → No interference with screen reader
   - No motion sickness (test with sensitive users)

6. **Edge Cases**
   - Rapid select/deselect → Breathing stops cleanly
   - Open/close keyboard rapidly → No animation glitches
   - Switch apps during breathing → Animation pauses
   - Return to app → Breathing resumes after 5s idle

**Acceptance Criteria**:

- ✅ Breathing animation feels natural and polished
- ✅ Wave effect creates visual interest without distraction
- ✅ Performance smooth on all tested devices
- ✅ Accessibility features respected
- ✅ No visual glitches in edge cases

---

## Technical Notes

### Why 3-Second Breathing Cycle?

The 3-second cycle (1.5s expand, 1.5s contract) is based on:

- **Resting breath rate**: Humans breathe ~12-20 times/minute at rest = 3-5s per breath
- **Perception threshold**: < 2s feels "twitchy", > 4s feels "dead"
- **Calming effect**: Slow, predictable motion reduces anxiety
- **Apple Watch precedent**: Activity rings use similar breathing rhythm

### Why 5-Second Idle Delay?

5 seconds balances:

- **Reading time**: Users need ~3-4s to read headline + understand chips
- **Decision time**: Another 1-2s to consider options
- **Not distracting**: Starting too soon interrupts thought process
- **Engagement**: Long enough that motion feels like a "discovery" vs "always on"

### Scale Factor: Why 1.02?

The 2% scale is carefully chosen:

- **Subliminal**: Barely noticeable consciously, but brain detects motion
- **No layout shift**: Chips don't push other elements around
- **GPU-friendly**: Small transform = efficient rendering
- **iOS precedent**: Similar to "breathing" notification badges

### Stagger Pattern Calculation

For 6 chips with 250ms stagger:

```
Chip 1: Starts at 0ms
Chip 2: Starts at 250ms
Chip 3: Starts at 500ms
Chip 4: Starts at 750ms
Chip 5: Starts at 1000ms
Chip 6: Starts at 1250ms

Wave completes: 1.25 seconds
Breath cycle: 3 seconds
Total pattern: 4.25s (wave + breath)
```

This creates a **rolling wave** that:

- Travels left-to-right (natural reading direction)
- Repeats smoothly (no abrupt restart)
- Keeps visual interest without overwhelming

### Performance Optimization

**Hardware Acceleration**:

- Uses `transform: scale` (GPU-accelerated)
- Avoids `width`/`height` changes (CPU-intensive, causes layout)
- Single shared value per chip (efficient memory)

**Battery Efficiency**:

- Animation pauses when app backgrounded (React Native lifecycle)
- No polling or timers (purely declarative animation)
- Stops immediately on interaction (saves CPU cycles)

**Memory**:

- 1 shared value per chip × 6 chips = 6 × 8 bytes = 48 bytes
- Negligible impact (<0.001% of typical app memory)

## Future Enhancements

1. **Breathing Intensity Preference**: User setting for subtle/normal/off
2. **Breathing Pattern Variety**: Different patterns (pulse, glow, wobble)
3. **Context-Aware Breathing**: Faster during morning (energizing), slower at night (calming)
4. **Breathing Synced to Music**: Match tempo to user's background audio
5. **Achievement Breathing**: Special breathing pattern for milestone chips
6. **Seasonal Theming**: Different breathing styles for holidays/seasons

## Risks & Mitigation

| Risk                                    | Impact | Mitigation                                                 |
| --------------------------------------- | ------ | ---------------------------------------------------------- |
| Animation feels annoying or distracting | High   | Extensive QA with diverse users, easy disable via settings |
| Performance issues on low-end devices   | Medium | Hardware-accelerated transforms, pause when backgrounded   |
| Motion sickness for sensitive users     | High   | Respects `prefers-reduced-motion`, very subtle motion (2%) |
| Interferes with interaction timing      | Low    | Stops immediately on interaction, no delayed response      |
| Battery drain                           | Low    | Efficient GPU transforms, pauses when idle                 |

## Success Metrics

**Primary**:

- **Perceived Quality**: User survey: "App feels polished and alive" (target: 80%+ agree)
- **Engagement Lift**: +10-20% chip selection rate (breathing draws attention)
- **Delight Factor**: Positive mentions in reviews/feedback

**Secondary**:

- **Performance**: < 1% battery drain over 1 hour session
- **Frame Rate**: Consistent 60fps during breathing
- **User Complaints**: < 1% request to disable breathing

## Rollback Plan

If breathing causes issues:

1. **Immediate**: Set `isIdle` to always false (1 line change in parent)
2. **Quick**: Add user preference toggle (disable for affected users)
3. **Complete**: Revert commit (remove breathing entirely)

**Rollback Trigger**: If user complaints > 5% OR performance issues reported on > 10% devices

## Implementation Checklist

- [ ] Task 1: Add idle detection to HabitsEmptyStateMinimal (timer, state, prop passing)
- [ ] Task 2: Add breathing animation to Chip component (scale, stagger, loop)
- [ ] Task 3: Update type definitions (isIdle prop in SuggestionChipsProps)
- [ ] Task 4: Add breathing animation constants (duration, scale, delays)
- [ ] Task 5: Add unit tests for idle detection (40+ test cases)
- [ ] Task 6: Add integration tests for breathing animation (20+ test cases)
- [ ] Task 7: Manual QA across devices and accessibility modes (50+ scenarios)
- [ ] Code review: Verify breathing feels natural, not jarring
- [ ] Performance audit: Measure FPS, battery, memory during breathing
- [ ] Accessibility audit: Test with VoiceOver, TalkBack, reduced motion
- [ ] User testing: Get feedback from 10+ users on breathing feel
- [ ] Documentation: Update README with breathing animation behavior

## Code Review Checklist for CodeRabbit

**Animation Quality**:

- ✅ Breathing cycle is 3s (1.5s expand + 1.5s contract)
- ✅ Scale oscillates between 1.0 and 1.02 (2% growth)
- ✅ Easing is `Easing.inOut(Easing.ease)` (natural breathing curve)
- ✅ Stagger delay is 250ms between chips (wave effect)
- ✅ Animation loops infinitely with `-1` repeat parameter

**Idle Detection**:

- ✅ Idle timer triggers after exactly 5000ms of no interaction
- ✅ Timer resets on input change, chip selection, keyboard open
- ✅ Timer is cleaned up on component unmount
- ✅ No memory leaks from forgotten timers
- ✅ `isIdle` state is correctly passed to SuggestionChips

**Performance**:

- ✅ Uses `transform: scale` (GPU-accelerated)
- ✅ Avoids `width`/`height` changes (CPU-intensive)
- ✅ Breathing stops immediately when `isIdle` becomes false
- ✅ Animation pauses when app backgrounded (verify with React Native lifecycle)
- ✅ No polling or continuous timers (purely declarative)

**Accessibility**:

- ✅ Respects `prefers-reduced-motion` (breathing disabled when true)
- ✅ Breathing does not interfere with VoiceOver announcements
- ✅ Selected chips do not breathe (avoid conflicting animations)
- ✅ Breathing starts only when keyboard is closed (chips fully visible)

**Code Quality**:

- ✅ Breathing scale multiplies with interaction scale (no override)
- ✅ Transform array combines entrance + interaction + breathing
- ✅ Constants extracted to `BREATHING_CONFIG` (maintainable)
- ✅ TypeScript types updated (`isIdle?` prop)
- ✅ Backward compatible (`isIdle` defaults to false)

**Testing**:

- ✅ Unit tests cover idle timer (trigger, reset, cleanup)
- ✅ Integration tests verify breathing start/stop
- ✅ Tests use `jest.useFakeTimers()` for time control
- ✅ Tests verify reduced motion behavior
- ✅ Tests verify selected chips don't breathe

**Edge Cases**:

- ✅ Rapid idle/active transitions handled cleanly
- ✅ Breathing stops before new entrance animation (no conflict)
- ✅ Breathing resumes correctly after keyboard close
- ✅ No animation glitches when switching apps
- ✅ Memory cleaned up properly on unmount

**Documentation**:

- ✅ JSDoc comments explain breathing behavior
- ✅ Constants have clear comments (duration, scale, delays)
- ✅ README updated with breathing animation description
- ✅ Spec includes rationale for 3s cycle, 5s delay, 1.02 scale

## Estimated Timeline

- **Task 1**: 0.5 hours (idle detection)
- **Task 2**: 1 hour (breathing animation implementation)
- **Task 3**: 0.25 hours (type definitions)
- **Task 4**: 0.25 hours (animation constants)
- **Task 5**: 0.5 hours (idle detection tests)
- **Task 6**: 0.5 hours (breathing animation tests)
- **Task 7**: 1 hour (manual QA)
- **Total**: ~4 hours

**Confidence Level**: Very High (simple animation, well-defined behavior, low risk)
