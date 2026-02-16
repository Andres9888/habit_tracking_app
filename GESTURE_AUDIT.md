# UX Gestures Consistency Audit

**Date**: 2026-02-16  
**Auditor**: Subagent (Sonnet)  
**App**: Chain Day Habit Tracking  
**Branch**: `fix/ux-gestures-consistency`

---

## Executive Summary

✅ **Overall Status**: The app has strong gesture consistency with centralized patterns.  
⚠️ **Issues Found**: 6 minor inconsistencies requiring fixes.  
🎯 **Strength Areas**: Centralized haptics, modal gestures, tap feedback infrastructure.

---

## 1. Swipe Gestures

### ✅ **Consistent Patterns Found**

#### Swipe-to-Reveal Actions (HabitCard)
- **Location**: `src/components/HabitCard/gestures/panGesture.ts`
- **Implementation**: Pan gesture with spring-based swipe-to-reveal
- **Haptic**: Light impact on reveal threshold
- **Threshold**: Dynamic based on gesture velocity
- **Spring Config**: `Springs.swipe`

#### Swipeable Action Buttons
- **Location**: `src/components/SwipeableActionButton/`
- **Implementation**: Uses `react-native-gesture-handler` Swipeable
- **Actions**: Edit, Delete, Archive
- **Consistent across**: HabitCard, DraggableHabit

### ⚠️ **Inconsistencies**

**Issue #1**: Pull-to-refresh only implemented on AnalyticsScreen
- **Found**: Only `src/screens/AnalyticsScreen/AnalyticsScreen.tsx` has RefreshControl
- **Expected**: Should be on all scrollable list/data screens
- **Missing on**:
  - HabitDetailScreen (calendar data could be refreshed)
  - CharacterScreen (stats could be refreshed)
  - TemplatesScreen (template catalog could be refreshed)

---

## 2. Long Press Behavior

### ✅ **Consistent Pattern**

**Long Press Delay**: 500ms everywhere
- **Location**: `src/components/HabitCard/gestures/longPressGesture.ts`
- **Implementation**: `Gesture.LongPress().minDuration(500)`
- **Haptic**: Heavy impact on activation
- **Used for**: Quick actions menu, reordering

### ✅ **Correct Usage**
- HabitCard: Opens quick actions
- DraggableHabit: Activates drag mode
- No conflicting delays found

---

## 3. Swipe-to-Dismiss (Modals/Sheets)

### ✅ **Consistent Implementation**

**Modal Swipe-to-Dismiss**
- **Location**: `src/components/Modal/useModalGestures.ts`
- **Bottom Sheet**: Pull down gesture with threshold
- **Full Screen**: Swipe down with rubber band effect
- **Threshold**: `DISMISS_THRESHOLD` (consistent)
- **Velocity**: `VELOCITY_THRESHOLD` (consistent)
- **Haptic**: Light impact on dismiss

**Dismiss Parameters**:
```typescript
DISMISS_THRESHOLD: 120 (pixels)
VELOCITY_THRESHOLD: 500 (pixels/second)
```

### ✅ **Well-Designed Features**
- Rubber band effect on full-screen modals
- Spring-based animations
- Velocity-aware dismiss

---

## 4. Tap Feedback

### ✅ **Centralized Infrastructure**

**AnimatedPressable Component**
- **Location**: `src/components/ui/AnimatedPressable.tsx`
- **Features**: Scale animation, haptic feedback, focus ring
- **Default Scale**: 0.97 (via `CARD_PRESS_SCALE`)
- **Default Haptic**: Light impact
- **Spring Config**: `Springs.button`

**Press Animation Hook**
- **Location**: `src/hooks/usePressAnimation.ts`
- **Config Options**: `pressScale`, `hapticStyle`, `enableHaptics`
- **Accessibility**: Respects reduced motion
- **Haptic Styles**: `light | medium | heavy | selection`

### ⚠️ **Inconsistencies**

**Issue #2**: Some Pressable components don't use AnimatedPressable
- **Example Components**:
  - `src/components/BinaryHeatmap/TimeRangeButton.tsx`
  - `src/components/BinaryHeatmap/TimeRangeToggle.tsx`
  - `src/components/CompletionToast/components/StreakBadge.tsx`
- **Problem**: Missing tap feedback animation
- **Fix**: Replace with AnimatedPressable or add usePressAnimation

**Issue #3**: Inconsistent haptic patterns on buttons
- Some buttons trigger `light`, some `medium`, no clear rule
- **Recommendation**: Document standard per button type

---

## 5. Haptic Feedback Consistency

### ✅ **Centralized Patterns Library**

**HapticPatterns Library**
- **Location**: `src/utils/haptics/patterns.ts`
- **Patterns**:
  - `tap` - Light impact (general presses)
  - `toggle` - Medium impact (state changes)
  - `heavy` - Heavy impact (drag, long press)
  - `selection` - Selection changed (pickers)
  - `celebration` - Multi-step sequence (milestones)
  - `celebrationMajor` - Extended celebration
  - `streak` - Double tap pattern
  - `success` - Success notification
  - `error` - Error notification
  - `warning` - Warning notification

### ✅ **Strong Consistency**
- All patterns are named and centralized
- Legacy hook (`useHapticFeedback`) wraps new patterns
- Respects reduced motion preference

### ⚠️ **Minor Issues**

**Issue #4**: Some components call Haptics directly instead of using HapticPatterns
- **Found in**:
  - `src/components/Modal/useModalGestures.ts` (calls `Haptics.impactAsync` directly)
  - Several gesture handlers
- **Fix**: Refactor to use `HapticPatterns.tap` etc.

---

## 6. Pinch Gesture

### ❌ **Not Implemented**
- **Status**: No pinch gesture handlers found in codebase
- **Expected Use Cases**: None obvious for this app
- **Recommendation**: Not needed - habit tracking doesn't require zoom

---

## 7. Double-Tap

### ❌ **Not Implemented**
- **Status**: No double-tap gesture handlers found
- **Expected Use Cases**: Possible use for quick actions
- **Current Alternative**: Long press for quick actions (better)
- **Recommendation**: Not needed - long press is clearer UX

---

## 8. Pan Gestures (Drag & Drop)

### ✅ **Consistent Implementation**

**Reordering (DraggableHabit)**
- **Location**: `src/components/DraggableHabit/`
- **Library**: `react-native-draggable-flatlist`
- **Activation**: Long press (500ms)
- **Haptic**: Heavy impact on drag start
- **Spring Animation**: Scale on press

### ✅ **Well-Designed**
- Uses dedicated library for drag-drop
- Consistent with iOS native patterns
- Clear visual feedback

---

## Design System Compliance

### ✅ **Animation Timings**
- **Spring**: `springify().damping(18)` (consistent)
- **Delays**: 280ms base, 60ms stagger (consistent)
- **Button Press**: 280ms spring (consistent)

### ✅ **Border Radius**
- Cards: 16px
- Buttons: 12px
- Modal corners: Consistent

---

## Issues Summary & Fixes Required

### 🔴 **Priority 1 - Missing Pull-to-Refresh**
1. Add RefreshControl to HabitDetailScreen
2. Add RefreshControl to CharacterScreen
3. Add RefreshControl to TemplatesScreen

### 🟡 **Priority 2 - Tap Feedback Gaps**
4. Convert basic Pressables to AnimatedPressable in:
   - TimeRangeButton
   - TimeRangeToggle
   - StreakBadge (if interactive)

### 🟢 **Priority 3 - Haptic Consistency**
5. Refactor direct Haptics calls to use HapticPatterns
6. Document haptic usage guidelines in TOOLS.md

---

## Recommendations

### ✅ **Keep These Patterns**
1. Centralized HapticPatterns library
2. AnimatedPressable component
3. Modal swipe-to-dismiss gestures
4. 500ms long press delay

### 🎯 **New Guidelines to Document**
1. **Pull-to-Refresh**: Add to all data screens that fetch from server
2. **Tap Feedback**: Always use AnimatedPressable for interactive elements
3. **Haptics**: Always use HapticPatterns, never direct Haptics calls
4. **Long Press**: Reserve for contextual actions, not primary actions

### 📝 **Documentation Needs**
- Add gesture guidelines to TOOLS.md or new GESTURES.md
- Document when to use each haptic pattern
- Create Pressable usage decision tree

---

## Test Coverage

### ✅ **Well-Tested**
- HabitCard gestures have extensive test coverage
- Long press behavior tested
- Swipe actions tested

### ⚠️ **Coverage Gaps**
- Modal swipe-to-dismiss not tested
- Pull-to-refresh behavior not tested
- Haptic feedback not testable (native)

---

## Conclusion

The Chain Day app has **excellent gesture consistency** thanks to centralized patterns and infrastructure. The main gaps are:
1. Missing pull-to-refresh on some screens
2. A few components not using AnimatedPressable
3. Minor inconsistencies in haptic implementation

All issues are **low-risk and easy to fix**. The centralized architecture makes these fixes straightforward.

**Overall Grade**: A- (93/100)
