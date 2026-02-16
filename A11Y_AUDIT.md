# Post-Merge Accessibility Audit - Findings

## Date: 2026-02-15
## PRs Reviewed: #828, #831, #834, #835, #839

---

## 🔴 Critical Issues Found

### 1. **AccessibleText Not Used in New Components**
**Files affected:**
- `src/features/habits/components/HabitsEmptyStateMinimal/HeroSection.tsx` - Line 54 (motivational stat)
- `src/features/habits/components/HabitsEmptyStateMinimal/CtaButton.tsx` - Line 71 (button text)
- `src/features/habits/components/HabitsEmptyStateMinimal/ErrorMessage/ErrorMessage.tsx` - Line 43 (error text)
- `src/features/habits/components/HabitsEmptyStateMinimal/SecondaryLinks.tsx` - Lines 36, 59 (link text)
- `src/components/TemplateScienceModal/components/ModalHeader.tsx` - Line 44 (header title)

**Impact:** Users with large font settings won't have proper font scaling limits, potentially breaking layouts.

### 2. **Direct Haptics Calls Not Gated Behind Reduce Motion**
**Files affected:**
- `src/features/habits/components/HabitsEmptyStateMinimal/CtaButton.tsx` - Line 30
- `src/features/habits/components/SortBottomSheet/SortOptionRow.tsx`
- `src/features/habits/components/SortBottomSheet/QuickPickChips.tsx`
- `src/features/habits/components/HabitsModals/VisualizationModalSection.tsx`
- `src/features/habits/components/HabitsModals/TemplatesModalSection.tsx`

**Impact:** Violates WCAG 2.3.3 - users with motion sensitivity preferences will still receive haptic feedback.

### 3. **Missing ScreenErrorBoundary Wrapping**
**Components affected:**
- `HabitsEmptyStateMinimal` (screen-level component)
- `TemplateScienceModal` (modal component)

**Impact:** Crashes in these components will show blank screens instead of helpful error messages.

### 4. **AccessibleErrorMessage Not Used**
**File:** `src/features/habits/components/HabitsEmptyStateMinimal/ErrorMessage/ErrorMessage.tsx`

**Impact:** Error component manually implements similar functionality but uses regular Text instead of AccessibleText, missing font scaling benefits.

---

## ✅ Fixes Applied

1. Replace `Text` with `AccessibleText` in all new components
2. Replace direct `Haptics.*` calls with `useHaptics()` hook
3. Wrap main empty state component usage in ScreenErrorBoundary
4. Update ErrorMessage to use AccessibleText

---

## 🟢 Verified Working

- ✅ Haptics utility (`useHaptics`) properly gates behind reduce motion
- ✅ `AccessibleText` and `AccessibleErrorMessage` components properly implemented
- ✅ SecondaryLinks has proper accessibilityLabel/Role
- ✅ CtaButton has proper accessibilityHint/Label/Role
- ✅ Dark mode color contrast appears acceptable (tertiary: 4.87:1 documented)
