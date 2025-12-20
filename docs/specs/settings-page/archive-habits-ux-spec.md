# Archive Habits Page UX Specification

_Generated on 2025-12-20 by Jane_

## Executive Summary

This specification addresses two UX issues in the habit tracking app:

1. **Archive Habits Page Design** — The current archive page feels mechanical; needs to feel more organic and aligned with app aesthetics
2. **Safe Area Compliance (CRITICAL)** — Back button overlaps iPhone Dynamic Island/notch; recurring issue across screens

**Scope:** Level 0-1 (Small focused improvement)
**Platform:** iOS (React Native with Expo)

---

## 1. Problem Analysis

### 1.1 Safe Area Issue (CRITICAL - Recurring)

**Current State:**
- `ArchivedHabitsModal.tsx` has NO `useSafeAreaInsets` import
- Header uses `mt-4` (16pt) which is insufficient for Dynamic Island (~59pt needed)
- Back button appears at top, overlapping the notch/island
- This pattern has been a recurring issue across multiple screens

**Root Cause:**
- Modal renders as fragment (`<>...</>`) without safe area wrapper
- Fixed `mt-4` margin doesn't account for device-specific insets

**Impact:**
- Unusable on iPhone X and later (back button hidden/overlapping)
- Accessibility failure (can't reach navigation)

### 1.2 Archive Page Design

**Current State:**
- Functional but feels "utilitarian" rather than polished
- Empty state is good (has illustration, pro tip)
- Habit cards work but could feel more organic
- Stats summary bar is minimal

**Desired Feel:**
- More organic, natural transitions
- Warmer, more inviting for a "graveyard" of habits
- Encourage restoration rather than deletion

---

## 2. Design Principles

1. **Safety First** — All interactive elements must respect safe areas
2. **Organic Feel** — Soft animations, warm colors, natural metaphors
3. **Encourage Restoration** — Design should make restoring habits feel positive
4. **Consistency** — Match existing app patterns (`ArchiveUndoToast` is a good reference)

---

## 3. Technical Specifications

### 3.1 Safe Area Fix

```typescript
// Required import
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Inside component
const insets = useSafeAreaInsets();

// Header wrapper with dynamic padding
<View style={{ paddingTop: insets.top + 8 }}>
  {/* Header content */}
</View>
```

**Pattern to follow:** See `ArchiveUndoToast.tsx:51` which correctly uses `useSafeAreaInsets()`

### 3.2 Header Redesign

**Current:** Back button (←) + Title + Close button (✕)

**Proposed:**
- Add proper safe area padding (dynamic based on device)
- Soften back button appearance (use icon from lucide-react-native)
- Consider adding subtle header background blur

### 3.3 Card Animation Improvements

- Add staggered entrance animation for habit cards
- Subtle scale/opacity on card press
- Smooth restore/delete transitions

---

## 4. Implementation Tasks

### Epic: Archive Habits Page UX Improvements

---

#### Task 1: Fix Safe Area Compliance (CRITICAL)
**Priority:** P0 - Blocker
**Estimate:** 15 min
**File:** `src/components/ArchivedHabitsModal/ArchivedHabitsModal.tsx`
**Status:** ✅ COMPLETED (2025-12-20)

**Acceptance Criteria:**
- [x] Import `useSafeAreaInsets` from `react-native-safe-area-context`
- [x] Apply `insets.top` padding to header container
- [ ] Back button sits comfortably below Dynamic Island on all iPhone models
- [ ] Test on iPhone 14 Pro (Dynamic Island) and iPhone SE (no notch)

**Implementation Notes (Completed):**
- Added import for `useSafeAreaInsets` from `react-native-safe-area-context` (line 3)
- Added `const insets = useSafeAreaInsets();` inside component (line 50)
- Wrapped header in `<View style={{ paddingTop: insets.top + 8 }}>` for dynamic safe area padding
- Follows the same pattern as `ArchiveUndoToast.tsx` which uses `insets.bottom + 16`
- Manual device testing pending (iPhone 14 Pro for Dynamic Island, iPhone SE for no notch)

**Implementation Notes:**
```tsx
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// In component:
const insets = useSafeAreaInsets();

// Wrap header:
<View style={{ paddingTop: insets.top + 8 }}>
  <View className='mb-4 flex-row items-center justify-between'>
    {/* existing header content */}
  </View>
</View>
```

---

#### Task 2: Audit Other Screens for Safe Area Issues
**Priority:** P1 - High
**Estimate:** 30 min

**Acceptance Criteria:**
- [ ] Grep codebase for screens/modals without safe area handling
- [ ] Document all affected files
- [ ] Create follow-up tasks for each affected screen
- [ ] Consider creating a reusable `<SafeHeader>` component

**Files to check:**
- All files in `src/screens/`
- All modal components
- Any component with a back/close button at top

---

#### Task 3: Improve Header Visual Design
**Priority:** P2 - Medium
**Estimate:** 20 min
**File:** `src/components/ArchivedHabitsModal/ArchivedHabitsModal.tsx`

**Acceptance Criteria:**
- [ ] Replace text arrow (←) with `ChevronLeft` from lucide-react-native
- [ ] Replace text close (✕) with `X` from lucide-react-native
- [ ] Soften button backgrounds (slightly more rounded, subtle shadow)
- [ ] Optional: Add subtle blur/gradient header background

---

#### Task 4: Add Card Entrance Animations
**Priority:** P2 - Medium
**Estimate:** 30 min
**File:** `src/components/ArchivedHabitsModal/ArchivedHabitsModal.tsx`

**Acceptance Criteria:**
- [ ] Cards animate in with staggered fade + slide up
- [ ] Use `react-native-reanimated` (already in project)
- [ ] Animation timing: 300ms per card, 50ms stagger
- [ ] Respect `reduceMotion` accessibility setting

---

#### Task 5: Improve Empty State Warmth
**Priority:** P3 - Low
**Estimate:** 15 min
**File:** `src/components/ArchivedHabitsModal/ArchivedHabitsModal.tsx`

**Acceptance Criteria:**
- [ ] Update copy to feel warmer ("Your habits are all active!" vs "All Clear!")
- [ ] Consider changing box emoji (📦) to something friendlier
- [ ] Ensure empty state also respects safe area

---

#### Task 6: Enhance Restore Action Feedback
**Priority:** P3 - Low
**Estimate:** 20 min

**Acceptance Criteria:**
- [ ] Add haptic feedback on restore tap
- [ ] Card animates out smoothly when restored
- [ ] Success feedback (brief toast or animation)

---

## 5. Task Summary Table

| # | Task | Priority | Est. | Status |
|---|------|----------|------|--------|
| 1 | Fix Safe Area Compliance | P0 | 15m | ✅ DONE |
| 2 | Audit Other Screens | P1 | 30m | TODO |
| 3 | Header Visual Design | P2 | 20m | TODO |
| 4 | Card Entrance Animations | P2 | 30m | TODO |
| 5 | Empty State Warmth | P3 | 15m | TODO |
| 6 | Restore Action Feedback | P3 | 20m | TODO |

**Total Estimated Time:** ~2 hours

---

## 6. Design References

### Good Pattern (to follow):
- `ArchiveUndoToast.tsx` — Correctly uses safe area insets, warm amber colors, smooth animations

### Components to Update:
- `ArchivedHabitsModal.tsx` — Primary target
- `DraggableHabit.tsx` — Related archive interaction (currently modified per git status)

---

## 7. Validation Checklist

Before marking complete:

- [ ] Back button visible below Dynamic Island on iPhone 14 Pro
- [ ] Back button visible on iPhone SE (no notch)
- [ ] All animations smooth at 60fps
- [ ] Accessibility: VoiceOver can reach all buttons
- [ ] No layout shifts on page load
- [ ] Restore/delete actions provide clear feedback

---

## Appendix

### Related Files
- `src/components/ArchivedHabitsModal/ArchivedHabitsModal.tsx`
- `src/components/ArchivedHabitsModal/ArchivedHabitsModal.hooks.ts`
- `src/components/ArchiveUndoToast/ArchiveUndoToast.tsx`
- `src/components/DraggableHabit/DraggableHabit.tsx`
- `src/theme/spacing.ts`

### Version History

| Date | Version | Changes | Author |
|------|---------|---------|--------|
| 2025-12-20 | 1.0 | Initial specification | Jane |
