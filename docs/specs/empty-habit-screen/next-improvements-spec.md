# Empty State - Next Improvements Spec

## Overview

This spec defines 3 additional UI/UX improvements for the empty habits page: character counter, keyboard-aware layout, and error state animation.

**Design Mock**: `.superdesign/design_iterations/empty_state_next_improvements_1.html`

## Current State

Already implemented:
- Loading skeleton with shimmer
- Chip stagger animation
- Input focus haptic
- Hero glow pulse
- CTA shimmer on enable
- Progress ring, particle burst, pulsing tap hint (success state)

---

## Proposed Improvements

### 1. Character Counter

**Problem**: Users have no visibility into habit name length limits until they hit a validation error.

**Solution**: Show live character count near input field with color warnings.

**Behavior**:
- Display `X/50` counter inside input field (right side)
- Default color: `#A8A29E` (stone-400)
- Warning at 35+ chars: `#F59E0B` (amber-500)
- Error at 45+ chars: `#EF4444` (red-500)
- Counter fades in/out with input focus (optional polish)
- Max length enforced at 50 characters

**Accessibility**:
- Counter is decorative (input already has maxLength)
- Screen readers announce character limit in input hint

**Files**:
- Modify `HabitInput.tsx`
- Add `CHARACTER_LIMIT` to `constants.ts`

---

### 2. Keyboard-Aware Layout

**Problem**: When keyboard opens, the input may be obscured or layout feels cramped.

**Solution**: Compact layout when keyboard is visible - smaller hero, hidden chips.

**Behavior**:
- Detect keyboard open via `useKeyboardHeight` or `Keyboard` API
- When keyboard opens:
  - Hero icon: 80px → 60px, font 36 → 28
  - Headline: 24px → 20px, margins reduced
  - Chips container: hidden (fade out)
  - Secondary links: hidden
  - Layout shifts to `justifyContent: 'flex-start'` with top padding
- Animate transitions smoothly (300ms ease-out)
- When keyboard closes, restore full layout

**Accessibility**:
- Hidden elements still accessible via screen reader
- Focus remains on input during transition

**Files**:
- Modify `HabitsEmptyStateMinimal.tsx`
- Modify `HeroIcon.tsx` (accept size prop)
- Create `useKeyboardVisible` hook or use existing
- Add `KEYBOARD_LAYOUT` constants to `animations.ts`

---

### 3. Error State Animation

**Problem**: Error message appears as plain text with no visual emphasis.

**Solution**: Animated error card with shake effect and dismiss button.

**Behavior**:
- Error container:
  - Background: `#FEF2F2` (red-50)
  - Border: 1px `#FECACA` (red-200)
  - Border radius: 12px
  - Padding: 12px 16px
- Layout: icon + message + dismiss button (row)
- Error icon: 20px red circle with white "!"
- Entrance animation:
  - Fade in (opacity 0 → 1)
  - Slide down (translateY -10 → 0)
  - Shake effect: translateX ±8px, 3 oscillations, 500ms
- Dismiss button: "✕" that fades out the error
- Auto-dismiss after 5 seconds (optional)

**Accessibility**:
- `accessibilityRole="alert"`
- `accessibilityLiveRegion="polite"`
- Dismiss button has clear label

**Files**:
- Create `ErrorMessage.tsx` component
- Modify `HabitsEmptyStateMinimal.tsx`
- Add `ERROR_ANIMATION` constants to `animations.ts`

---

## Animation Constants

Add to `animations.ts`:

```typescript
// Character counter
export const CHARACTER_LIMIT = {
  max: 50,
  warningThreshold: 35,
  errorThreshold: 45,
};

// Keyboard-aware layout
export const KEYBOARD_LAYOUT = {
  transitionDuration: 300,
  compactHeroSize: 60,
  compactHeroFontSize: 28,
  compactHeadlineFontSize: 20,
  topPadding: 100,
};

// Error animation
export const ERROR_ANIMATION = {
  entranceDuration: 300,
  shakeDuration: 500,
  shakeDistance: 8,
  shakeOscillations: 3,
  autoDismissDelay: 5000, // optional
};
```

---

## Component Changes Summary

| Component | Changes |
|-----------|---------|
| `HabitInput.tsx` | Add character counter with color states |
| `HabitsEmptyStateMinimal.tsx` | Keyboard detection, layout mode, error component |
| `HeroIcon.tsx` | Accept optional `size` prop for compact mode |
| `ErrorMessage.tsx` | New component - animated error card |
| `animations.ts` | Add new constants |
| `constants.ts` | Add `CHARACTER_LIMIT` |

---

## Implementation Tasks

### Task 1: Add Constants
**Priority**: High | **Effort**: 5 min | **Dependencies**: None

Add `CHARACTER_LIMIT`, `KEYBOARD_LAYOUT`, and `ERROR_ANIMATION` constants.

**Acceptance Criteria**:
- [ ] `CHARACTER_LIMIT` with max, warningThreshold, errorThreshold
- [ ] `KEYBOARD_LAYOUT` with transition and size values
- [ ] `ERROR_ANIMATION` with timing and distance values

**Files**: `animations.ts`, `constants.ts`

---

### Task 2: Add Character Counter
**Priority**: High | **Effort**: 20 min | **Dependencies**: Task 1

Add live character count to HabitInput with color warnings.

**Acceptance Criteria**:
- [ ] Shows `X/50` inside input (right-aligned)
- [ ] Default color: stone-400
- [ ] Warning color at 35+: amber-500
- [ ] Error color at 45+: red-500
- [ ] Input has maxLength={50}
- [ ] Counter visible when input has focus or has text

**Files**: `HabitInput.tsx`

---

### Task 3: Create ErrorMessage Component
**Priority**: High | **Effort**: 25 min | **Dependencies**: Task 1

Create animated error card with shake effect.

**Acceptance Criteria**:
- [ ] Styled container (red-50 bg, red-200 border, 12px radius)
- [ ] Error icon (red circle with "!")
- [ ] Error text
- [ ] Dismiss button ("✕")
- [ ] Entrance: fade + slide + shake
- [ ] Calls `onDismiss` callback
- [ ] Proper accessibility attributes

**Files**: Create `ErrorMessage.tsx`, export from `index.ts`

---

### Task 4: Integrate ErrorMessage
**Priority**: High | **Effort**: 10 min | **Dependencies**: Task 3

Replace plain text error with ErrorMessage component.

**Acceptance Criteria**:
- [ ] ErrorMessage renders when `errorMessage` state is set
- [ ] Dismiss clears error state
- [ ] Error clears on successful habit creation

**Files**: `HabitsEmptyStateMinimal.tsx`

---

### Task 5: Add Keyboard Detection Hook
**Priority**: Medium | **Effort**: 15 min | **Dependencies**: None

Create or use existing keyboard visibility hook.

**Acceptance Criteria**:
- [ ] Returns `isKeyboardVisible` boolean
- [ ] Returns `keyboardHeight` number
- [ ] Works on iOS and Android
- [ ] Cleans up listeners on unmount

**Files**: Create `useKeyboardVisible.ts` or use existing hook

---

### Task 6: Add Keyboard-Aware Layout
**Priority**: Medium | **Effort**: 30 min | **Dependencies**: Tasks 1, 5

Implement compact layout when keyboard opens.

**Acceptance Criteria**:
- [ ] Hero shrinks to 60px when keyboard open
- [ ] Headline font shrinks to 20px
- [ ] Chips fade out and hide
- [ ] Secondary links hide
- [ ] Layout shifts to top with padding
- [ ] Smooth 300ms transitions
- [ ] Restores on keyboard close
- [ ] Reduced motion: instant transitions

**Files**: `HabitsEmptyStateMinimal.tsx`, `HeroIcon.tsx`

---

### Task 7: Add Unit Tests
**Priority**: Medium | **Effort**: 30 min | **Dependencies**: Tasks 2, 3, 6

Add tests for new functionality.

**Acceptance Criteria**:
- [ ] Character counter shows correct count
- [ ] Counter color changes at thresholds
- [ ] ErrorMessage renders with correct content
- [ ] ErrorMessage shake animation triggers
- [ ] Dismiss callback works
- [ ] Keyboard layout changes apply correctly

**Files**: Modify existing test files, create `ErrorMessage.test.tsx`

---

### Task 8: Manual QA
**Priority**: High | **Effort**: 20 min | **Dependencies**: Tasks 4, 6

Manual testing on devices.

**Acceptance Criteria**:
- [ ] Character counter visible and updates live
- [ ] Color changes feel natural (not jarring)
- [ ] Keyboard layout transition is smooth
- [ ] Error shake is noticeable but not annoying
- [ ] Works on iOS and Android
- [ ] Test with different keyboard sizes

---

## Task Dependencies Graph

```text
Task 1 (Constants)
    ├── Task 2 (Character Counter)
    ├── Task 3 (ErrorMessage)
    │       └── Task 4 (Integrate Error)
    └── Task 6 (Keyboard Layout)
            └── Task 5 (Keyboard Hook)

Tasks 2, 3, 6 → Task 7 (Tests)
Tasks 4, 6 → Task 8 (QA)
```

---

## Estimated Total Effort

| Task | Effort |
|------|--------|
| Task 1 | 5 min |
| Task 2 | 20 min |
| Task 3 | 25 min |
| Task 4 | 10 min |
| Task 5 | 15 min |
| Task 6 | 30 min |
| Task 7 | 30 min |
| Task 8 | 20 min |
| **Total** | **~2.5 hours** |

---

## Testing Strategy

### Unit Tests
- Character counter displays correct value
- Counter color changes at 35 and 45 characters
- ErrorMessage shake animation plays on mount
- Keyboard layout mode switches correctly

### Manual QA
- Test character counter with rapid typing
- Test error shake on slow/fast devices
- Test keyboard layout on different device sizes
- Verify animations are 60fps

---

## Performance Considerations

- Character counter updates on every keystroke (lightweight)
- Keyboard listener uses native events (no polling)
- Error shake uses transform (GPU-accelerated)
- Layout changes use LayoutAnimation or Reanimated

---

## Accessibility

- Character counter: decorative, limit enforced by maxLength
- Error message: role="alert", liveRegion="polite"
- Keyboard layout: hidden elements still in accessibility tree
- Shake animation: reduced motion skips shake, keeps fade

---

## Success Metrics

- No increase in input lag during typing
- Error visibility improved (user studies)
- Keyboard experience feels native
