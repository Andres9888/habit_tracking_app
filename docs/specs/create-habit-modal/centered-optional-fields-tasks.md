# Centered Habit Creation Form - Implementation Tasks

## Task Breakdown

### Phase 1: Core Form Component

#### Task 1.1: Create CreateHabitFormCentered Component

**File**: `src/components/CreateHabitModal/components/CreateHabitFormCentered.tsx`

**Acceptance Criteria**:

- [ ] Component accepts all required props (interface defined)
- [ ] Centered layout with heading split across 2 lines
- [ ] Name input with placeholder and character counter
- [ ] "CUSTOMIZE (OPTIONAL)" section label renders
- [ ] EmojiPicker component integrated
- [ ] ColorPickerSection component integrated
- [ ] ReminderSelector component integrated
- [ ] Keyboard submit (Enter key) triggers onSubmit
- [ ] Submit enabled only when name ≥ 2 chars

**Estimated Effort**: 2 hours

**Dependencies**: None

**Test Coverage**:

- Unit test: Component renders correctly
- Unit test: Name input updates state
- Unit test: Character counter shows correct count
- Unit test: Submit validation works

---

#### Task 1.2: Create CreateHabitModalCentered Component

**File**: `src/components/CreateHabitModal/CreateHabitModalCentered.tsx`

**Acceptance Criteria**:

- [ ] Modal presentation with pageSheet style
- [ ] Header with title and close button
- [ ] Form component integrated
- [ ] Footer with Create button
- [ ] KeyboardAvoidingView for iOS/Android
- [ ] useCreateHabitForm hook integrated
- [ ] Smart defaults applied on submit
- [ ] Custom color picker modal integration
- [ ] Time picker modal integration
- [ ] Modal resets on open

**Estimated Effort**: 3 hours

**Dependencies**: Task 1.1

**Test Coverage**:

- Unit test: Modal opens/closes
- Unit test: Form resets on open
- Unit test: onCreate called with correct data
- Unit test: Smart defaults applied

---

### Phase 2: Emoji Picker Enhancement

#### Task 2.1: Add "More" Label to EmojiPicker

**File**: `src/components/CreateHabitModal/components/EmojiPicker.tsx`

**Acceptance Criteria**:

- [ ] Plus button wrapped in View with vertical layout
- [ ] "More" text label added below plus icon
- [ ] Label: 10px, semibold, uppercase, stone-500
- [ ] 4px gap between icon and label
- [ ] Accessibility labels updated
- [ ] Existing functionality preserved
- [ ] Animation/hover states work correctly

**Estimated Effort**: 1 hour

**Dependencies**: None

**Test Coverage**:

- Unit test: More label renders
- Unit test: Accessibility labels correct
- Snapshot test: Visual regression

---

### Phase 3: Gesture & Animation

#### Task 3.1: Implement Swipe-to-Dismiss Gesture

**File**: `src/components/CreateHabitModal/CreateHabitModalCentered.tsx`

**Acceptance Criteria**:

- [ ] Pan gesture detects downward swipe
- [ ] translateY tracks finger position
- [ ] Swipe > 100px dismisses modal
- [ ] Swipe < 100px springs back to 0
- [ ] Animated.View applies transform
- [ ] No interference with scrolling

**Estimated Effort**: 2 hours

**Dependencies**: Task 1.2

**Test Coverage**:

- Unit test: Gesture handler registered
- Manual QA: Swipe behavior correct

---

### Phase 4: Integration & Testing

#### Task 4.1: Integrate into HabitsScreen

**File**: `src/screens/HabitsScreen.tsx`

**Acceptance Criteria**:

- [ ] Import CreateHabitModalCentered
- [ ] Replace/conditional render with feature flag
- [ ] handleCreateHabit works with new modal
- [ ] No breaking changes to existing flow
- [ ] TypeScript types compatible

**Estimated Effort**: 1 hour

**Dependencies**: Tasks 1.1, 1.2, 2.1

**Test Coverage**:

- Integration test: Full creation flow
- Integration test: Modal lifecycle

---

#### Task 4.2: Write Unit Tests

**Files**:

- `src/components/CreateHabitModal/components/CreateHabitFormCentered.test.tsx`
- `src/components/CreateHabitModal/CreateHabitModalCentered.test.tsx`
- `src/components/CreateHabitModal/components/EmojiPicker.test.tsx`

**Acceptance Criteria**:

- [ ] All test cases from spec passing
- [ ] Code coverage > 80%
- [ ] Edge cases covered
- [ ] Snapshot tests for visual components
- [ ] Accessibility tests pass

**Estimated Effort**: 3 hours

**Dependencies**: Tasks 1.1, 1.2, 2.1

**Test Coverage**: N/A (this is test creation)

---

#### Task 4.3: Manual QA Testing

**Checklist**: See `/docs/Working/manual-qa-testing-guide.md` for comprehensive testing guide

**Acceptance Criteria**:

- [ ] All QA checklist items pass (25 test cases)
- [ ] Tested on iOS simulator
- [ ] Tested on Android emulator
- [ ] Tested on physical device (if available)
- [ ] Accessibility tested with screen reader
- [ ] Reduced motion tested

**Estimated Effort**: 2 hours

**Dependencies**: Task 4.1

**Test Coverage**: N/A (manual QA)

**Implementation Notes**:

- ✅ **Documentation Complete**: Created comprehensive manual QA testing guide at `/docs/Working/manual-qa-testing-guide.md`
- **Guide Contents**:
  - 25 detailed test cases with step-by-step instructions
  - Platform-specific testing procedures for iOS and Android
  - VoiceOver and TalkBack accessibility testing guides
  - Common issues troubleshooting section
  - Test results summary template for formal QA sign-off
- **Note**: Manual tests require human tester with device/simulator access - cannot be executed by AI agent
- **Status**: Ready for manual execution by QA team or developer
- **To Enable Feature**: Set `USE_CENTERED_HABIT_MODAL = true` in `src/features/habits/components/HabitsModals.tsx:35`
- **To Run**:
  - iOS: `npx expo start --ios`
  - Android: `npx expo start --android`

---

### Phase 5: Documentation & Polish

#### Task 5.1: Update Documentation

**Files**:

- `docs/specs/create-habit-modal/INTEGRATION_GUIDE.md`
- `docs/specs/create-habit-modal/QUICK_START.md`
- `docs/specs/create-habit-modal/STYLING_GUIDE.md`

**Acceptance Criteria**:

- [ ] Integration guide includes centered layout option
- [ ] Quick start updated with new component
- [ ] Styling guide has centered layout section
- [ ] Code examples accurate
- [ ] Screenshots updated (if applicable)

**Estimated Effort**: 2 hours

**Dependencies**: Task 4.1

---

#### Task 5.2: Performance Optimization Review

**File**: All components

**Acceptance Criteria**:

- [ ] Emoji debouncing working (300ms)
- [ ] Memoization effective (no unnecessary re-renders)
- [ ] Animations run at 60fps
- [ ] No memory leaks (cleanup functions)
- [ ] React DevTools Profiler shows good performance

**Estimated Effort**: 1 hour

**Dependencies**: All previous tasks

---

#### Task 5.3: Accessibility Audit

**Files**: All components

**Acceptance Criteria**:

- [ ] All interactive elements have accessibility labels
- [ ] Screen reader announces state changes
- [ ] Focus order logical
- [ ] Color contrast meets WCAG AA
- [ ] Reduced motion preference respected
- [ ] Keyboard navigation works

**Estimated Effort**: 1.5 hours

**Dependencies**: All previous tasks

---

## Summary

**Total Estimated Effort**: 18.5 hours (~2.5 days)

### Phase Breakdown

- Phase 1 (Core): 5 hours
- Phase 2 (Enhancement): 1 hour
- Phase 3 (Gestures): 2 hours
- Phase 4 (Integration): 6 hours
- Phase 5 (Polish): 4.5 hours

### Critical Path

1. Task 1.1 → Task 1.2 → Task 4.1 → Task 4.3
2. Task 2.1 (parallel with Phase 1)
3. Task 3.1 (depends on Task 1.2)
4. Task 4.2 (parallel with Task 4.3)
5. Phase 5 (after all features complete)

### Risk Assessment

**High Risk**:

- Task 3.1 (Swipe gesture conflicts with scroll)
- Task 4.1 (Integration breaking changes)

**Medium Risk**:

- Task 1.2 (Smart defaults complexity)
- Task 4.3 (Manual QA finding issues)

**Low Risk**:

- Task 1.1 (Straightforward component)
- Task 2.1 (Minor UI change)

### Dependencies Graph

```
Task 1.1 ──┬─→ Task 1.2 ──┬─→ Task 3.1
           │              │
           │              ├─→ Task 4.1 ──┬─→ Task 4.3 ──→ Phase 5
           │              │               │
           └──────────────┴─→ Task 4.2 ───┘

Task 2.1 ────────────────────┘
```

## Testing Strategy

### Unit Tests (Jest + React Native Testing Library)

```typescript
// Example: CreateHabitFormCentered.test.tsx
describe('CreateHabitFormCentered', () => {
  it('renders centered heading', () => {
    const { getByText } = render(<CreateHabitFormCentered {...defaultProps} />);
    expect(getByText(/What habit do you/i)).toBeTruthy();
  });

  it('enables submit when name is valid', () => {
    const { getByPlaceholderText, getByText } = render(<CreateHabitFormCentered {...defaultProps} />);
    const input = getByPlaceholderText(/e.g., Read/i);

    fireEvent.changeText(input, 'Re'); // 2 chars

    const button = getByText('Create Habit');
    expect(button).not.toBeDisabled();
  });

  it('calls onSubmit when Enter pressed', () => {
    const onSubmit = jest.fn();
    const { getByPlaceholderText } = render(
      <CreateHabitFormCentered {...defaultProps} habitName="Read" onSubmit={onSubmit} />
    );

    const input = getByPlaceholderText(/e.g., Read/i);
    fireEvent(input, 'onSubmitEditing');

    expect(onSubmit).toHaveBeenCalled();
  });
});
```

### Integration Tests (Detox)

```typescript
// Example: CreateHabitFlow.e2e.ts
describe('Create Habit - Centered Layout', () => {
  it('should create habit with minimal input', async () => {
    await element(by.id('create-habit-button')).tap();
    await element(by.id('habit-name-input')).typeText('Read for 20 minutes');
    await element(by.text('Create Habit')).tap();

    await expect(element(by.text('Read for 20 minutes'))).toBeVisible();
  });

  it('should create habit with custom options', async () => {
    await element(by.id('create-habit-button')).tap();
    await element(by.id('habit-name-input')).typeText('Meditate');
    await element(by.id('emoji-picker-🧘')).tap();
    await element(by.id('color-picker-#8B5CF6')).tap();
    await element(by.id('reminder-switch')).tap();
    await element(by.text('Create Habit')).tap();

    await expect(element(by.text('Meditate'))).toBeVisible();
  });
});
```

## Code Review Checklist

### Before Submitting PR

- [ ] All tasks marked complete
- [ ] All tests passing (`npm test`)
- [ ] No TypeScript errors (`npm run type-check`)
- [ ] No linting errors (`npm run lint`)
- [ ] Code formatted (`npm run format`)
- [ ] No console.log statements
- [ ] All TODOs resolved or documented
- [ ] Accessibility labels present
- [ ] Performance profiling done
- [ ] Documentation updated

### Reviewer Focus Areas

1. **Accessibility**: Screen reader support, keyboard navigation
2. **Performance**: Memoization, animation performance
3. **Edge Cases**: Empty states, validation, error handling
4. **Design Consistency**: Spacing, colors, typography
5. **Code Quality**: Reusability, maintainability, clarity

## Deployment Plan

### Step 1: Feature Flag Setup

```typescript
// src/config/featureFlags.ts
export const FEATURE_FLAGS = {
  USE_CENTERED_HABIT_CREATION: false, // Start disabled
} as const;
```

### Step 2: Gradual Rollout

1. **Week 1**: Internal testing (flag enabled for team)
2. **Week 2**: Beta users (10% of users)
3. **Week 3**: Expand to 50% of users
4. **Week 4**: Full rollout (100% of users)

### Step 3: Monitoring

Track metrics:

- Modal open rate
- Completion rate (created / opened)
- Average creation time
- Customization rate (% who change defaults)
- Error rate
- Crash rate

### Step 4: Rollback Criteria

Rollback if any of:

- Completion rate drops > 10%
- Crash rate increases > 5%
- Major accessibility issues reported
- Critical bugs found

## Success Criteria

**Must Have** (Blockers):

- ✅ All unit tests passing
- ✅ No TypeScript errors
- ✅ Accessibility labels complete
- ✅ Manual QA checklist 100% pass
- ✅ No performance regressions

**Should Have** (Nice to Have):

- ✅ Integration tests passing
- ✅ Code coverage > 80%
- ✅ Documentation complete
- ✅ Performance optimizations applied

**Could Have** (Future):

- Performance improvements over baseline
- Higher completion rates in A/B test
- Positive user feedback
- Reduced support tickets

## Notes

- Keep original `CreateHabitModal` until centered version is stable
- Add feature flag for easy rollback
- Monitor analytics closely during rollout
- Gather user feedback through in-app surveys
- Consider A/B testing if possible

## Questions & Decisions

1. **Q**: Should we A/B test vs original?
   **A**: TBD - Discuss with product team

2. **Q**: Default reminder state?
   **A**: TBD - Analyze current user behavior

3. **Q**: Remove old modal when?
   **A**: After 2 weeks of stable rollout

4. **Q**: Custom emoji picker needed?
   **A**: No - existing EmojiPickerSheet sufficient

5. **Q**: Analytics events to track?
   **A**:
   - `habit_creation_modal_opened`
   - `habit_creation_modal_closed`
   - `habit_created`
   - `habit_creation_customized` (if any optional field changed)
   - `habit_creation_emoji_browsed` (if More button tapped)
