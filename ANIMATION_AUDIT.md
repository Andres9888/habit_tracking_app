# Animation Performance Audit

**Date:** 2026-02-15  
**Audited by:** Claude Sonnet (subagent)

## Summary of Findings

### 🔴 Critical Issues

1. **Animated.Value usage (JS thread)** - 70+ files using legacy `Animated.Value` instead of Reanimated `useSharedValue`
   - This runs animations on the JavaScript thread instead of the UI thread
   - Performance impact: Frame drops during complex animations
   
2. **useNativeDriver: false** - 2 instances explicitly disabling native driver
   - `src/features/habits/components/HabitsList/MonetizationHero/useMonetizationAnimations.ts` (line 37)
   - `src/components/DailyMomentumMeter/useAnimations.ts` (line 29)
   - Both animate width/layout properties that can't use native driver
   - **Solution:** Convert to Reanimated which handles layout animations better

3. **Missing reduceMotion checks** - Several files don't respect accessibility preferences
   - `src/components/RewardCelebrationToast/useRewardToastAnimation.ts` - NO reduceMotion check
   - All ~40 `ConfettiParticle.tsx` files - Most don't check reduceMotion
   - Many old Animated.Value-based animations missing this check

### 🟡 Medium Priority Issues

4. **Inconsistent spring configs** - Not following design system (damping: 18, stiffness: 150)
   - `src/features/habits/components/HabitsHeader/useButtonHandler.ts` - uses stiffness: 240
   - `src/features/habits/components/HabitsList/LockedHabitCard.tsx` - uses Animated.spring with different config
   - Many files using custom spring values instead of `SPRING_CONFIGS.entrance`

5. **Animation cleanup** - Loop animations may not cleanup properly
   - Most `Animated.loop()` calls DO have cleanup in return statement (✓)
   - But some confetti/celebration animations don't check if component unmounted

### 🟢 Good Patterns Found

- ✓ 203 files reference reduceMotion (most new code respects it)
- ✓ Most Reanimated code uses proper spring configs
- ✓ Most loop animations have proper cleanup
- ✓ Design system exists in `src/utils/animations/helpers.ts`

## Files Requiring Fixes

### Priority 1: Convert to Reanimated (useNativeDriver: false)

1. `src/components/DailyMomentumMeter/useAnimations.ts` - Progress width animation
2. `src/features/habits/components/HabitsList/MonetizationHero/useMonetizationAnimations.ts` - Progress width animation

### Priority 2: Add reduceMotion Support

1. `src/components/RewardCelebrationToast/useRewardToastAnimation.ts`
2. All ConfettiParticle components (search for common pattern and fix)

### Priority 3: Standardize Spring Configs

1. `src/features/habits/components/HabitsHeader/useButtonHandler.ts`
2. `src/features/habits/components/HabitsList/LockedHabitCard.tsx`
3. Any file using custom damping/stiffness values

## Recommendations

1. **Gradual migration strategy:**
   - Fix critical performance issues first (useNativeDriver: false)
   - Add reduceMotion to commonly-used components
   - Convert Animated.Value to Reanimated opportunistically during feature work

2. **Lint rule suggestions:**
   - Warn on `new Animated.Value` usage
   - Require reduceMotion parameter in animation hooks
   - Enforce SPRING_CONFIGS usage instead of inline config objects

3. **Documentation:**
   - Add animation guidelines to CONTRIBUTING.md
   - Document when to use Animated vs Reanimated
   - Create migration guide for legacy animations

## Testing Plan

- [ ] Test on low-end Android device (animations should not drop frames)
- [ ] Test with "Reduce Motion" enabled (animations should be instant or very subtle)
- [ ] Profile JS thread usage during heavy animation sequences
- [ ] Verify no memory leaks from animation loops
