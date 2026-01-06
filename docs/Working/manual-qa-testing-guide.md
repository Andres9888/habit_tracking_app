# Manual QA Testing Guide - Centered Habit Creation Modal

**Document Version**: 1.0
**Date**: 2026-01-05
**Component**: CreateHabitModalCentered
**Feature Flag**: `USE_CENTERED_HABIT_MODAL` in `src/features/habits/components/HabitsModals.tsx`

---

## Prerequisites

### 1. Enable the Feature

Before testing, enable the centered modal by setting the feature flag to `true`:

**File**: `src/features/habits/components/HabitsModals.tsx`
**Line**: 35

```typescript
const USE_CENTERED_HABIT_MODAL = true; // Change from false to true
```

### 2. Build and Run the Application

```bash
# Install dependencies (if not already done)
npm install

# Run on iOS Simulator
npx expo start --ios

# Run on Android Emulator
npx expo start --android

# Run on physical device
npx expo start
# Then scan QR code with Expo Go app
```

### 3. Testing Tools Required

- **iOS Testing**: Xcode Simulator (macOS) + VoiceOver
- **Android Testing**: Android Studio Emulator + TalkBack
- **Physical Device**: iOS/Android device (optional but recommended)
- **Screen Reader**: VoiceOver (iOS) or TalkBack (Android)

---

## Test Execution Instructions

### How to Access the Modal

1. Launch the app
2. Navigate to the Habits screen (should be the main screen)
3. Tap the "+" or "Create Habit" button
4. The centered habit creation modal should appear

---

## Manual QA Checklist

Complete each test below and mark with ✅ (pass) or ❌ (fail). Document any failures in the Notes section.

### Visual & Animation Tests

#### Test 1: Modal Opens with Smooth Animation

- **Steps**:
  1. Tap the create habit button
  2. Observe the modal animation
- **Expected**: Modal slides up smoothly from bottom with no jank or stutter
- **Status**: [ ]
- **Notes**: **********************\_**********************

#### Test 2: Focus Immediately on Name Input

- **Steps**:
  1. Open the modal
  2. Check if keyboard appears automatically
  3. Check if cursor is in the name input field
- **Expected**: Keyboard appears, cursor blinks in name input, ready to type
- **Status**: [ ]
- **Notes**: **********************\_**********************

#### Test 3: Typing Updates Emoji Suggestions in Real-Time

- **Steps**:
  1. Type "read" in the name field
  2. Observe emoji picker
  3. Type "run" and observe again
  4. Type "meditate" and observe
- **Expected**: Emoji suggestions update to relevant emojis (📚 for "read", 🏃 for "run", 🧘 for "meditate")
- **Status**: [ ]
- **Notes**: **********************\_**********************

---

### Layout & Visual Hierarchy Tests

#### Test 4: "CUSTOMIZE (OPTIONAL)" Label Clearly Visible

- **Steps**:
  1. Open modal
  2. Scroll down to see the optional section
- **Expected**:
  - Label is uppercase, small font, stone-500 color
  - Clear visual separation between name input and customization options
  - Label communicates that fields below are optional
- **Status**: [ ]
- **Notes**: **********************\_**********************

#### Test 5: "More" Label Visible and Understandable

- **Steps**:
  1. Open modal
  2. Look at the emoji picker section
  3. Find the "+" button
- **Expected**:
  - "More" label appears below the "+" button
  - Label is small (10px), uppercase, stone-500
  - Clear that tapping "+" opens full emoji picker
- **Status**: [ ]
- **Notes**: **********************\_**********************

---

### Interaction & Selection Tests

#### Test 6: Emoji Selection Has Green Ring Indicator

- **Steps**:
  1. Open modal
  2. Tap any emoji chip
  3. Observe visual feedback
- **Expected**:
  - Selected emoji has green ring around it
  - Only one emoji can be selected at a time
  - Previous selection is deselected
- **Status**: [ ]
- **Notes**: **********************\_**********************

#### Test 7: Color Selection Has Outer Ring Shadow

- **Steps**:
  1. Open modal
  2. Tap any color chip
  3. Observe visual feedback
- **Expected**:
  - Selected color has subtle outer shadow/ring
  - Only one color can be selected at a time
  - Previous selection is deselected
- **Status**: [ ]
- **Notes**: **********************\_**********************

#### Test 8: Reminder Toggle Animates Smoothly

- **Steps**:
  1. Scroll to reminder section
  2. Tap a reminder option (Morning, Afternoon, Evening, Custom)
  3. Tap another option
  4. Tap to deselect
- **Expected**:
  - Options respond immediately to touch
  - Visual feedback (scale animation) on press
  - Smooth transitions between states
  - Selection state is clear
- **Status**: [ ]
- **Notes**: **********************\_**********************

---

### Modal Interaction Tests

#### Test 9: Time Picker Opens on Time Press (When Enabled)

- **Steps**:
  1. Select "Custom" reminder option
  2. If time display appears, tap it
- **Expected**:
  - Time picker interface appears
  - User can select custom time
  - Selected time displays correctly
- **Status**: [ ] or N/A (if unified reminder selector doesn't show separate time picker)
- **Notes**: **********************\_**********************

#### Test 10: Custom Color Picker Opens on "+" Press

- **Steps**:
  1. Scroll to color section
  2. Tap the "+" button (last chip in color row)
- **Expected**:
  - Color picker modal/sheet appears
  - Full color spectrum is available
  - Selected color updates when chosen
  - Modal can be dismissed
- **Status**: [ ]
- **Notes**: **********************\_**********************

---

### Gesture Tests

#### Test 11: Swipe Down Dismisses Modal

- **Steps**:
  1. Open modal
  2. Swipe down from anywhere on the modal (not within scrollable area)
  3. Swipe down more than 100px
- **Expected**:
  - Modal dismisses smoothly
  - Returns to previous screen
  - No errors or crashes
- **Status**: [ ]
- **Notes**: **********************\_**********************

#### Test 12: Small Swipe Bounces Back

- **Steps**:
  1. Open modal
  2. Swipe down ~50px (less than dismiss threshold)
  3. Release
- **Expected**:
  - Modal springs back to original position
  - Smooth spring animation
  - Modal remains open
- **Status**: [ ]
- **Notes**: **********************\_**********************

---

### Form Submission Tests

#### Test 13: Enter Key Creates Habit (When Valid)

- **Steps**:
  1. Type valid habit name (≥2 chars)
  2. Press Enter/Return on keyboard
- **Expected**:
  - Habit is created immediately
  - Modal dismisses
  - New habit appears in list
  - Form resets for next use
- **Status**: [ ]
- **Notes**: **********************\_**********************

#### Test 14: Button Disabled State Clear

- **Steps**:
  1. Open modal
  2. Leave name empty or enter 1 character
  3. Observe Create button
- **Expected**:
  - Button is visually disabled (stone-200 background)
  - Tapping does nothing
  - Clear that it cannot be pressed
- **Status**: [ ]
- **Notes**: **********************\_**********************

#### Test 15: Button Enabled State Clear

- **Steps**:
  1. Type valid habit name (≥2 chars)
  2. Observe Create button
- **Expected**:
  - Button is visually enabled (stone-900 background)
  - Obvious that it can be pressed
  - Tapping creates habit
- **Status**: [ ]
- **Notes**: **********************\_**********************

#### Test 16: Created Habit Has Correct Data

- **Steps**:
  1. Create habit with custom emoji, color, and reminder
  2. Find the habit in the list
  3. Open habit details
- **Expected**:
  - Name matches what was typed
  - Selected emoji displays
  - Selected color is applied
  - Reminder is set correctly
  - Default values applied for unset fields
- **Status**: [ ]
- **Notes**: **********************\_**********************

#### Test 17: Modal Resets After Creation

- **Steps**:
  1. Create a habit
  2. Open modal again
  3. Check all fields
- **Expected**:
  - Name input is empty
  - Emoji suggestions show defaults
  - Color resets to first in palette (#EF4444)
  - Reminder resets to default
  - No data from previous habit
- **Status**: [ ]
- **Notes**: **********************\_**********************

---

### Keyboard & Scrolling Tests

#### Test 18: Keyboard Avoidance Works Correctly

- **Steps**:
  1. Open modal on iOS and Android
  2. Tap name input (keyboard appears)
  3. Tap reminder section (keyboard may stay or dismiss)
  4. Observe layout
- **Expected**:
  - Input field not obscured by keyboard
  - Form content shifts up on iOS (padding behavior)
  - Form resizes on Android (height behavior)
  - Create button always visible
  - Smooth transitions
- **Status**: [ ] iOS [ ] Android
- **Notes**: **********************\_**********************

#### Test 19: Scrolling Works with Long Content

- **Steps**:
  1. Open modal
  2. Scroll up and down through all sections
  3. Try scrolling while keyboard is open
- **Expected**:
  - All content is reachable
  - Scrolling is smooth
  - Swipe gesture doesn't interfere with scroll
  - Can see heading, all emojis, colors, reminder
- **Status**: [ ]
- **Notes**: **********************\_**********************

---

### Platform & Device Tests

#### Test 20: Safe Area Insets Respected

- **Steps**:
  1. Test on device with notch (iPhone X+) or rounded corners
  2. Open modal
  3. Check top and bottom areas
- **Expected**:
  - Header not obscured by notch/status bar
  - Create button not cut off at bottom
  - Content respects safe areas
- **Status**: [ ] iOS [ ] Android
- **Notes**: **********************\_**********************

#### Test 21: Reduced Motion Respected

- **Steps**:
  1. Enable "Reduce Motion" in device accessibility settings
     - iOS: Settings → Accessibility → Motion → Reduce Motion
     - Android: Settings → Accessibility → Remove animations
  2. Open modal
  3. Interact with all elements
- **Expected**:
  - Animations are disabled or minimal
  - Functionality remains intact
  - No jarring transitions
  - All features still work
- **Status**: [ ] iOS [ ] Android
- **Notes**: **********************\_**********************

#### Test 22: Tested on iOS Simulator

- **Steps**: Run through all tests on iOS Simulator
- **Expected**: All tests pass
- **Status**: [ ]
- **Notes**: **********************\_**********************

#### Test 23: Tested on Android Emulator

- **Steps**: Run through all tests on Android Emulator
- **Expected**: All tests pass
- **Status**: [ ]
- **Notes**: **********************\_**********************

#### Test 24: Tested on Physical Device (If Available)

- **Steps**: Run through all tests on physical device
- **Expected**: All tests pass
- **Status**: [ ] iOS [ ] Android [ ] N/A
- **Notes**: **********************\_**********************

---

### Accessibility Tests

#### Test 25: Accessibility Tested with Screen Reader

- **Steps**:
  1. Enable VoiceOver (iOS) or TalkBack (Android)
  2. Navigate through entire modal using gestures
  3. Try to create a habit using only screen reader
- **Expected**:
  - All elements have clear labels
  - State changes announced (selected, disabled)
  - Logical focus order (top to bottom)
  - Can complete full creation flow
  - Character counter announced
  - Emoji descriptions clear
  - Color names announced (not just "color")
- **Status**: [ ] iOS VoiceOver [ ] Android TalkBack
- **Notes**: **********************\_**********************

---

## Common Issues & Solutions

### Issue: Emoji suggestions not updating

**Cause**: Debounce delay (300ms)
**Solution**: Wait a moment after typing, suggestions update after 300ms

### Issue: Swipe gesture dismisses while scrolling

**Cause**: Gesture conflict
**Solution**: This should not happen - swipe only works on downward gesture from top area. File a bug if it occurs.

### Issue: Keyboard covers input on Android

**Cause**: Incorrect KeyboardAvoidingView behavior
**Solution**: Check that `behavior='height'` is used on Android

### Issue: Modal doesn't reset after creation

**Cause**: useEffect dependency issue
**Solution**: Check that `useEffect` in CreateHabitModalCentered.tsx runs on `visible` change

### Issue: Create button stays disabled

**Cause**: Name validation not working
**Solution**: Check that name has ≥2 characters and isn't just whitespace

---

## Test Results Summary

**Date Tested**: ******\_\_\_******
**Tester Name**: ******\_\_\_******
**Device/Simulator**: ******\_\_\_******
**OS Version**: ******\_\_\_******

**Total Tests**: 25
**Passed**: **_
**Failed**: _**
**N/A**: \_\_\_

### Critical Failures (Blockers)

List any failures that prevent release:

1. ***
2. ***
3. ***

### Minor Issues (Can Fix Later)

List non-critical issues:

1. ***
2. ***
3. ***

### Recommendations

Overall assessment and suggestions:

---

---

---

---

## Sign-Off

Once all critical tests pass, the feature is ready for:

- [ ] Beta testing
- [ ] Gradual rollout (10% → 50% → 100%)
- [ ] Full production release

**QA Approved By**: ******\_\_\_******
**Date**: ******\_\_\_******
**Signature**: ******\_\_\_******

---

## Additional Resources

- **Specification**: `/docs/specs/create-habit-modal/centered-optional-fields.md`
- **Integration Guide**: `/docs/specs/create-habit-modal/INTEGRATION_GUIDE.md`
- **Quick Start**: `/docs/specs/create-habit-modal/QUICK_START.md`
- **Styling Guide**: `/docs/specs/create-habit-modal/STYLING_GUIDE.md`
- **Component Files**:
  - `src/components/CreateHabitModal/CreateHabitModalCentered.tsx`
  - `src/components/CreateHabitModal/components/CreateHabitFormCentered.tsx`
  - `src/components/CreateHabitModal/components/EmojiPicker.tsx`
- **Test Files**:
  - `src/components/CreateHabitModal/__tests__/CreateHabitModalCentered.test.tsx`
  - `src/components/CreateHabitModal/components/__tests__/CreateHabitFormCentered.test.tsx`
  - `src/components/CreateHabitModal/components/__tests__/EmojiPicker.test.tsx`

---

## Appendix: VoiceOver Testing Quick Guide (iOS)

### Enable VoiceOver

1. Settings → Accessibility → VoiceOver → Toggle ON
2. Or triple-click home/side button (if configured)

### Basic Gestures

- **Swipe right**: Next element
- **Swipe left**: Previous element
- **Double tap**: Activate element
- **Two-finger swipe up**: Read all from current position
- **Three-finger swipe up/down**: Scroll

### Expected Announcements

- Modal opens: "Create Habit, heading"
- Name input: "What habit do you want to build? Text field, e.g., Read for 20 minutes"
- Emoji chip: "Selected emoji [emoji]" or "Emoji [emoji], button"
- Color chip: "[Color name] color, button" + "selected" state
- Reminder: "[Label] reminder, button" + time if set
- Create button: "Create Habit, button" + "dimmed" if disabled

---

## Appendix: TalkBack Testing Quick Guide (Android)

### Enable TalkBack

1. Settings → Accessibility → TalkBack → Toggle ON
2. Or hold volume keys for 3 seconds

### Basic Gestures

- **Swipe right**: Next element
- **Swipe left**: Previous element
- **Double tap**: Activate element
- **Swipe down then up**: Read all
- **Two-finger swipe up/down**: Scroll

### Expected Announcements

Similar to VoiceOver but with Android-specific phrasing:

- "Create Habit, heading"
- "Edit box for habit name, e.g., Read for 20 minutes"
- "Emoji [emoji], button, not selected" or "selected"
- "[Color] color, button, not selected" or "selected"
