# Haptic Feedback Audit

## Issues Found

### 🔴 Critical - Missing Haptics on Primary Interactions

1. **HabitDayToggle** (`src/components/HabitChainVisualizer/useHabitDayToggleHandlers.ts`)
   - ❌ NO haptics on toggle
   - Should use: `success` pattern when completing, `tap` when uncompleting

2. **HeaderCompleteToggle** (`src/components/HeaderCompleteToggle/useHeaderToggle.ts`)
   - ⚠️ Uses direct expo-haptics instead of centralized patterns
   - Should use: `celebration` or `celebrationMajor` for completions, `tap` for uncomplete

### 🟡 Medium - Inconsistent Patterns

3. **ActionItem** (`src/components/QuickActionsSheet/ActionItem.tsx`)
   - ⚠️ Uses generic `Light` haptic for all actions including destructive
   - Should use: `warning` pattern for destructive actions, `tap` for normal actions

4. **SwipeableActionButton** (`src/components/SwipeableActionButton/SwipeableActionButton.tsx`)
   - ⚠️ Only triggers haptic on full swipe open
   - Missing: Progressive impact haptics at swipe thresholds (50%, 80%)

### 🟢 Low Priority - Missing Enhancements

5. **Pull-to-Refresh** (`src/screens/AnalyticsScreen/AnalyticsScreen.tsx`)
   - ❌ No haptic on refresh trigger
   - Should add: Light impact when refresh activates

6. **Long Press Drag** (`src/features/habits/hooks/HabitRenderContent.tsx`)
   - ❌ No haptic on drag initiation
   - Should add: `heavy` pattern when long press activates drag

7. **Modal Open** (various modal components)
   - ❌ No haptic when modal opens
   - ModalCloseButton has haptic on close ✓
   - Should add: `tap` pattern on modal mount

## Reduce Motion Compliance

✅ All haptics properly gated by `useHapticFeedback` which checks `useReduceMotion`
✅ `HapticPatterns` is pure functions, consumers responsible for reduce motion checks

## Recommendations

1. Fix HabitDayToggle immediately - this is the most-used interaction
2. Migrate all direct expo-haptics calls to centralized patterns
3. Add progressive haptics to swipe gestures
4. Consider adding subtle haptics to modal lifecycle events
