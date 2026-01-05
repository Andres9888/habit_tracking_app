# Manual QA Testing Guide: Time-Based Suggestion Chips

## Overview
This document provides a comprehensive manual QA testing checklist for the time-based suggestion chips feature in the HabitsEmptyStateMinimal component.

**Feature**: Dynamic chip suggestions that change based on time of day (Morning, Afternoon, Evening, Night)

**Files Modified**:
- `src/features/habits/components/HabitsEmptyStateMinimal/constants.ts`
- `src/features/habits/components/HabitsEmptyStateMinimal/utils.ts`
- `src/features/habits/components/HabitsEmptyStateMinimal/SuggestionChips.tsx`
- `src/features/habits/components/HabitsEmptyStateMinimal/__tests__/utils.test.ts`
- `src/features/habits/components/HabitsEmptyStateMinimal/__tests__/SuggestionChips.test.tsx`

---

## Pre-Testing Checklist

### ✅ Automated Tests
Before manual testing, ensure all automated tests pass:

```bash
# Run all HabitsEmptyStateMinimal tests
npm test -- HabitsEmptyStateMinimal

# Run specific time-based tests
npm test -- utils.test.ts
npm test -- SuggestionChips.test.tsx
```

**Expected Result**: All tests should pass with 100% coverage for utils.ts

---

## Manual QA Test Plan

### Test Section 1: Time Window Verification

#### Test 1.1: Morning Chips (5am - 11am)
**Steps**:
1. Set device time to **8:30 AM**
2. Navigate to empty habits screen
3. Observe suggestion chips

**Expected Chips**:
- ☕ Coffee
- 🏃 Run
- 🧘 Meditate
- 📝 Journal
- 💧 Water
- 📚 Read

**Pass Criteria**:
- [ ] All 6 morning chips displayed
- [ ] Chips match expected list
- [ ] Pyramid layout maintained (3-2-1)
- [ ] No console errors

---

#### Test 1.2: Afternoon Chips (11am - 5pm)
**Steps**:
1. Set device time to **2:15 PM**
2. Navigate to empty habits screen
3. Observe suggestion chips

**Expected Chips**:
- 💧 Water
- 🚶 Walk
- 🥗 Lunch
- 🧘 Breathe
- 👀 Eye rest
- 🧠 Learn

**Pass Criteria**:
- [ ] All 6 afternoon chips displayed
- [ ] Chips match expected list
- [ ] Pyramid layout maintained (3-2-1)
- [ ] No console errors

---

#### Test 1.3: Evening Chips (5pm - 10pm)
**Steps**:
1. Set device time to **7:45 PM**
2. Navigate to empty habits screen
3. Observe suggestion chips

**Expected Chips**:
- 📚 Read
- 🌙 Wind down
- 🧘 Stretch
- 📝 Write
- 🎨 Create
- 🤸 Move

**Pass Criteria**:
- [ ] All 6 evening chips displayed
- [ ] Chips match expected list
- [ ] Pyramid layout maintained (3-2-1)
- [ ] No console errors

---

#### Test 1.4: Night Chips (10pm - 5am)
**Steps**:
1. Set device time to **11:30 PM**
2. Navigate to empty habits screen
3. Observe suggestion chips

**Expected Chips**:
- 📝 Journal
- 🌙 Sleep prep
- 📱 Phone off
- 🧘 Breathe
- 📖 Gratitude
- 🛌 Bedtime

**Pass Criteria**:
- [ ] All 6 night chips displayed
- [ ] Chips match expected list
- [ ] Pyramid layout maintained (3-2-1)
- [ ] No console errors

---

#### Test 1.5: Midnight Wrap-Around
**Steps**:
1. Set device time to **2:00 AM**
2. Navigate to empty habits screen
3. Observe suggestion chips

**Expected Result**: Should display NIGHT chips (same as Test 1.4)

**Pass Criteria**:
- [ ] Night chips displayed (not morning chips)
- [ ] Midnight boundary handled correctly
- [ ] No console errors

---

### Test Section 2: Boundary Testing

#### Test 2.1: Morning Start Boundary (5:00 AM exactly)
**Steps**:
1. Set device time to **5:00 AM**
2. Navigate to empty habits screen

**Expected**: Morning chips (☕ Coffee, 🏃 Run, etc.)

**Pass Criteria**:
- [ ] Morning chips displayed (not night chips)

---

#### Test 2.2: Morning End Boundary (10:59 AM)
**Steps**:
1. Set device time to **10:59 AM**
2. Navigate to empty habits screen

**Expected**: Morning chips

**Pass Criteria**:
- [ ] Morning chips still displayed

---

#### Test 2.3: Afternoon Start Boundary (11:00 AM exactly)
**Steps**:
1. Set device time to **11:00 AM**
2. Navigate to empty habits screen

**Expected**: Afternoon chips (💧 Water, 🚶 Walk, etc.)

**Pass Criteria**:
- [ ] Afternoon chips displayed (not morning chips)

---

#### Test 2.4: Afternoon End Boundary (4:59 PM)
**Steps**:
1. Set device time to **4:59 PM**
2. Navigate to empty habits screen

**Expected**: Afternoon chips

**Pass Criteria**:
- [ ] Afternoon chips still displayed

---

#### Test 2.5: Evening Start Boundary (5:00 PM exactly)
**Steps**:
1. Set device time to **5:00 PM**
2. Navigate to empty habits screen

**Expected**: Evening chips (📚 Read, 🌙 Wind down, etc.)

**Pass Criteria**:
- [ ] Evening chips displayed (not afternoon chips)

---

#### Test 2.6: Evening End Boundary (9:59 PM)
**Steps**:
1. Set device time to **9:59 PM**
2. Navigate to empty habits screen

**Expected**: Evening chips

**Pass Criteria**:
- [ ] Evening chips still displayed

---

#### Test 2.7: Night Start Boundary (10:00 PM exactly)
**Steps**:
1. Set device time to **10:00 PM**
2. Navigate to empty habits screen

**Expected**: Night chips (📝 Journal, 🌙 Sleep prep, etc.)

**Pass Criteria**:
- [ ] Night chips displayed (not evening chips)

---

#### Test 2.8: Night End Boundary (4:59 AM)
**Steps**:
1. Set device time to **4:59 AM**
2. Navigate to empty habits screen

**Expected**: Night chips

**Pass Criteria**:
- [ ] Night chips still displayed (morning starts at 5:00 AM)

---

### Test Section 3: Interaction Testing

#### Test 3.1: Chip Selection
**Steps**:
1. Set device time to any time (e.g., 2:00 PM)
2. Navigate to empty habits screen
3. Tap on first chip (💧 Water)
4. Observe input field

**Expected**:
- Input field populates with "Drink water" (fullName)
- Chip shows selected state (emerald background, white text)
- Haptic feedback triggered

**Pass Criteria**:
- [ ] Input field shows correct full name
- [ ] Chip visual state changes (emerald highlight)
- [ ] Haptic feedback felt (on physical device)
- [ ] Selection animation smooth

---

#### Test 3.2: Chip Deselection
**Steps**:
1. With a chip selected (from Test 3.1)
2. Tap the same chip again

**Expected**:
- Input field clears
- Chip returns to unselected state (white background)

**Pass Criteria**:
- [ ] Input field clears
- [ ] Chip visual state resets
- [ ] Deselection animation smooth

---

#### Test 3.3: Multiple Chip Selection
**Steps**:
1. Select first chip (💧 Water)
2. Select second chip (🚶 Walk)

**Expected**:
- First chip deselects
- Second chip selects
- Input field updates to "Walk 10 minutes"

**Pass Criteria**:
- [ ] Only one chip selected at a time
- [ ] Previous selection clears
- [ ] Input field updates correctly

---

#### Test 3.4: Manual Typing Clears Selection
**Steps**:
1. Select a chip (💧 Water)
2. Manually type in input field

**Expected**:
- Chip selection clears when typing starts
- Manual input preserved

**Pass Criteria**:
- [ ] Chip deselects when typing
- [ ] Manual input works correctly

---

#### Test 3.5: Stagger Animation
**Steps**:
1. Navigate to empty habits screen
2. Watch chips appear

**Expected**:
- Chips fade in and slide up
- 50ms delay between each chip
- Pyramid order: Row 1 (0, 50, 100ms), Row 2 (150, 200ms), Row 3 (250ms)

**Pass Criteria**:
- [ ] Stagger animation visible
- [ ] Chips appear in sequence (not all at once)
- [ ] Animation smooth (no jank)
- [ ] Total animation completes in ~600ms

---

### Test Section 4: Visual Testing

#### Test 4.1: Emoji Rendering (iOS)
**Device**: iPhone (physical or simulator)

**Steps**:
1. Test all 4 time windows
2. Verify each emoji renders correctly

**Expected**: All emojis display as color emojis (not black/white)

**Emoji Checklist**:
- [ ] ☕ Coffee (morning)
- [ ] 🏃 Run (morning)
- [ ] 🧘 Meditate (morning/afternoon/evening/night)
- [ ] 📝 Journal (morning/evening/night)
- [ ] 💧 Water (morning/afternoon)
- [ ] 📚 Read (morning/evening)
- [ ] 🚶 Walk (afternoon)
- [ ] 🥗 Lunch (afternoon)
- [ ] 👀 Eye rest (afternoon)
- [ ] 🧠 Learn (afternoon)
- [ ] 🌙 Wind down/Sleep prep (evening/night)
- [ ] 🎨 Create (evening)
- [ ] 🤸 Move (evening)
- [ ] 📱 Phone off (night)
- [ ] 📖 Gratitude (night)
- [ ] 🛌 Bedtime (night)

---

#### Test 4.2: Emoji Rendering (Android)
**Device**: Android phone (physical or emulator)

**Steps**: Same as Test 4.1

**Pass Criteria**: Same emoji checklist

---

#### Test 4.3: Label Truncation
**Steps**:
1. Test all time windows on smallest supported screen size
2. Verify no chip labels are truncated

**Labels to Check**:
- "Coffee" (6 chars)
- "Meditate" (8 chars)
- "Gratitude" (9 chars)
- "Sleep prep" (10 chars)

**Pass Criteria**:
- [ ] All labels fit within chips
- [ ] No ellipsis (...) shown
- [ ] No text wrapping to second line

---

#### Test 4.4: Pyramid Layout Consistency
**Steps**:
1. Test all 4 time windows
2. Verify pyramid formation maintained

**Expected**:
- Row 1: 3 chips (centered)
- Row 2: 2 chips (centered)
- Row 3: 1 chip (centered)

**Pass Criteria**:
- [ ] Morning chips: 3-2-1 pyramid
- [ ] Afternoon chips: 3-2-1 pyramid
- [ ] Evening chips: 3-2-1 pyramid
- [ ] Night chips: 3-2-1 pyramid
- [ ] No layout shift when switching times

---

#### Test 4.5: Touch Target Size
**Steps**:
1. Tap each chip
2. Verify easy tappability

**Expected**: Minimum 44pt touch target (per iOS HIG)

**Pass Criteria**:
- [ ] All chips easy to tap
- [ ] No accidental multi-taps
- [ ] Touch targets don't overlap

---

### Test Section 5: Accessibility Testing

#### Test 5.1: VoiceOver (iOS)
**Steps**:
1. Enable VoiceOver (Settings > Accessibility > VoiceOver)
2. Navigate to empty habits screen
3. Swipe through chips

**Expected Announcements**:
- "Select [Habit Name]" (e.g., "Select Drink water")
- "Button"
- "Selected" or "Not selected" state

**Pass Criteria**:
- [ ] Each chip announces correctly
- [ ] Full habit name announced (not just label)
- [ ] Selection state announced
- [ ] Double-tap to activate works

---

#### Test 5.2: TalkBack (Android)
**Steps**: Same as VoiceOver test

**Pass Criteria**: Same as VoiceOver

---

#### Test 5.3: Reduced Motion
**Steps**:
1. Enable Reduce Motion (iOS: Settings > Accessibility > Motion > Reduce Motion)
2. Navigate to empty habits screen

**Expected**:
- Chips appear instantly (no stagger animation)
- Selection changes instant (no spring animation)

**Pass Criteria**:
- [ ] Animations disabled
- [ ] Functionality still works
- [ ] No visual glitches

---

### Test Section 6: Edge Cases & Regressions

#### Test 6.1: Rapid Time Changes
**Steps**:
1. Set time to 10:50 AM (morning chips)
2. Wait for chips to render
3. Change time to 11:10 AM (afternoon chips)
4. Navigate back to empty habits screen

**Expected**: Afternoon chips display (no cached morning chips)

**Pass Criteria**:
- [ ] Correct chips for new time
- [ ] No stale chip data

---

#### Test 6.2: App Backgrounding
**Steps**:
1. Open app at 10:50 AM (morning chips)
2. Background app
3. Change device time to 2:00 PM
4. Foreground app

**Expected**: Afternoon chips display (refreshes on foreground)

**Pass Criteria**:
- [ ] Chips update when app returns to foreground

---

#### Test 6.3: Screen Rotation
**Steps**:
1. Navigate to empty habits screen (portrait)
2. Rotate to landscape
3. Rotate back to portrait

**Expected**: Layout adapts, chips remain visible

**Pass Criteria**:
- [ ] Chips visible in both orientations
- [ ] Pyramid layout maintained
- [ ] No layout overflow

---

#### Test 6.4: Long Habit Name Input
**Steps**:
1. Select chip
2. Edit input to add very long text (50 characters)

**Expected**: Character counter shows warning/error

**Pass Criteria**:
- [ ] Character limit enforced
- [ ] Warning shown at 35 chars
- [ ] Error shown at 45 chars

---

### Test Section 7: Performance Testing

#### Test 7.1: Initial Render Performance
**Steps**:
1. Profile app with React DevTools
2. Navigate to empty habits screen
3. Measure render time

**Expected**: < 16ms initial render (60fps)

**Pass Criteria**:
- [ ] No jank/stutter on chip entrance
- [ ] Smooth animations

---

#### Test 7.2: Memory Usage
**Steps**:
1. Monitor memory usage (Xcode Instruments / Android Profiler)
2. Navigate to/from empty habits screen 10 times

**Expected**: No memory leaks

**Pass Criteria**:
- [ ] Memory usage stable
- [ ] No retained chips after navigation away

---

## Success Criteria Summary

### Must Pass (Blocking Issues)
- [ ] All 4 time windows display correct chips
- [ ] All boundary conditions work correctly (5am, 11am, 5pm, 10pm)
- [ ] Midnight wrap-around works (2am = night chips)
- [ ] Chip selection/deselection works
- [ ] No console errors or warnings
- [ ] Automated tests pass 100%

### Should Pass (Important)
- [ ] Haptic feedback works on physical devices
- [ ] Stagger animation visible and smooth
- [ ] All emojis render correctly on iOS and Android
- [ ] VoiceOver/TalkBack announce correctly
- [ ] Reduced motion respected

### Nice to Have (Non-Blocking)
- [ ] Performance < 16ms render time
- [ ] No memory leaks
- [ ] Graceful handling of edge cases

---

## Testing Environments

### Minimum Required
- [ ] **iOS Simulator** (latest iOS version)
- [ ] **Android Emulator** (latest Android version)
- [ ] **iPhone (physical)** - for haptic feedback verification

### Comprehensive Coverage
- [ ] iPhone 12/13/14/15 (physical)
- [ ] iPhone SE (smaller screen)
- [ ] iPad (tablet layout)
- [ ] Android Pixel (physical)
- [ ] Android Samsung (different emoji rendering)

---

## Rollback Plan

If critical issues found:

1. **Immediate Rollback** (< 5 minutes):
   ```typescript
   // In SuggestionChips.tsx, change line 247:
   const chips = getTimeBasedChips();
   // To:
   const chips = getTimeBasedChips(new Date(), false); // Use static chips
   ```

2. **Full Revert** (if needed):
   ```bash
   git revert <commit-hash>
   ```

---

## Test Results Template

**Tester**: _______________
**Date**: _______________
**Device**: _______________
**OS Version**: _______________

### Overall Result
- [ ] PASS - All tests passed
- [ ] PASS WITH NOTES - Minor issues documented
- [ ] FAIL - Critical issues found (document below)

### Critical Issues Found
1. _____________________
2. _____________________

### Minor Issues Found
1. _____________________
2. _____________________

### Notes
_____________________
_____________________

---

## Next Steps After Testing

1. If all tests pass:
   - [ ] Mark Task 6 as complete in spec
   - [ ] Add analytics tracking (separate task)
   - [ ] Update documentation
   - [ ] Merge to main branch

2. If tests fail:
   - [ ] Document issues in GitHub/Linear
   - [ ] Fix blocking issues
   - [ ] Re-test failed scenarios
   - [ ] Do NOT mark Task 6 complete

---

**Note**: This manual QA must be completed before marking the time-based chips feature as production-ready. Automated tests verify logic, but only manual testing can verify real-world UX, emoji rendering, and haptic feedback.
