# UX Micro-Interactions Audit

## Audit Findings

### Current State
The app has **676 instances** of spring animations with inconsistent configurations:
- Button presses: `damping: 18, stiffness: 240`
- Snappy animations: `damping: 15, stiffness: 150`  
- Various hardcoded values: ranging from `stiffness: 60` to `stiffness: 450`

### Target State
All animations should use: **`damping: 18, stiffness: 150`**

## Areas to Fix

### 1. ✅ Button Press States
- [ ] Update theme `springs.button` to use stiffness: 150
- [ ] Verify `usePressAnimation` hook uses theme constant
- [ ] Audit hardcoded button press animations

### 2. ✅ Screen Transitions
- [ ] Standardize FadeIn/SlideIn/ZoomIn transitions
- [ ] Ensure consistent damping (18) on `.springify()` calls

### 3. ✅ Pull-to-Refresh
- [ ] Check RefreshControl animations in AnalyticsScreen
- [ ] Ensure smooth spring-based refresh animation

### 4. ✅ Toast Notifications
- [ ] CompletionToast enter/exit animations
- [ ] Standard Toast enter/exit animations
- [ ] Archive undo toast
- [ ] Reward celebration toast

### 5. ✅ Loading → Content Transitions
- [ ] Skeleton to content fade
- [ ] Loading spinner transitions
- [ ] Content reveal animations

### 6. ✅ Success Celebrations
- [ ] Completion checkmark animations
- [ ] Streak milestone celebrations
- [ ] Confetti particle animations
- [ ] Ensure delightful but not annoying

### 7. ✅ Error States
- [ ] Shake animations for errors
- [ ] Error highlight/flash
- [ ] Form validation feedback

### 8. ✅ Long-Press Interactions
- [ ] Habit card long-press
- [ ] Context menu triggers
- [ ] Consistent secondary action pattern

### 9. ✅ Spring Config Consistency
- [ ] Replace all hardcoded `{ damping: X, stiffness: Y }` with theme constant
- [ ] Update theme to export standard `STANDARD_SPRING = { damping: 18, stiffness: 150 }`

## Files to Update

### Theme/Constants
- `src/theme/animations.ts` - Update springs.button to stiffness: 150
- `src/constants/ui-values.ts` - Add ANIMATION_VALUES.springStiffness: 150

### Hooks
- `src/hooks/usePressAnimation.ts` - Verify using theme constant

### Components with Hardcoded Springs (Sample - need full scan)
- All files with `withSpring({ damping:` that don't use theme constants
- All files with `.springify().damping().stiffness()` 

## Implementation Strategy

1. **Update Theme** - Single source of truth
2. **Create Migration Helper** - Script to find/replace hardcoded values
3. **Systematic Replacement** - Work through each category
4. **Visual Testing** - Ensure animations feel smooth
5. **Regression Testing** - Check all micro-interactions still work
