# Type-Ahead Autocomplete - Manual QA Test Plan

**Feature**: Inline autocomplete with keyboard navigation for habit input
**Date**: 2026-01-05
**Tester**: [To be filled during testing]
**Build**: type-ahead-autocomplete branch

---

## Pre-Testing Checklist

- [ ] Code reviewed and matches specification
- [ ] Unit tests passing (60+ test cases)
- [ ] Integration tests passing (50+ test cases)
- [ ] Build successful on both iOS and Android
- [ ] App launches without errors

---

## Test Environment Setup

### Required Devices

**iOS Testing**:

- [ ] iPhone 14 Pro Simulator (iOS 17+)
- [ ] Physical iPhone (recommended: iPhone 11 or SE for low-end testing)
- [ ] iPad Simulator (for tablet layout testing)

**Android Testing**:

- [ ] Android Emulator (Pixel 6, Android 13+)
- [ ] Physical Android device (recommended: budget device for performance testing)

### Accessibility Tools

- [ ] iOS VoiceOver enabled (Settings → Accessibility → VoiceOver)
- [ ] Android TalkBack enabled (Settings → Accessibility → TalkBack)
- [ ] Reduce Motion enabled (Settings → Accessibility → Motion)

---

## Test Scenarios

## 1. Basic Autocomplete Functionality

### 1.1 Suggestion Triggering

**Test**: Suggestions appear after 3 characters

| Input           | Expected Behavior                      | Pass/Fail | Notes |
| --------------- | -------------------------------------- | --------- | ----- |
| "ex" (2 chars)  | No preview shown                       |           |       |
| "exe" (3 chars) | Shows "Exercise 10 minutes" preview    |           |       |
| "read"          | Shows "Read 5 pages" preview           |           |       |
| "med"           | Shows "Meditate for 5 minutes" preview |           |       |
| "walk"          | Shows "Walk 5 minutes" preview         |           |       |

**Acceptance**: Preview appears within 100ms of typing 3rd character

### 1.2 No Match Scenarios

**Test**: No suggestions for unmatched input

| Input    | Expected Behavior | Pass/Fail | Notes |
| -------- | ----------------- | --------- | ----- |
| "zzz"    | No preview shown  |           |       |
| "xyz123" | No preview shown  |           |       |
| "qwerty" | No preview shown  |           |       |

**Acceptance**: No preview text visible, no errors in console

### 1.3 Case Insensitivity

**Test**: Matching works regardless of case

| Input  | Expected Behavior      | Pass/Fail | Notes |
| ------ | ---------------------- | --------- | ----- |
| "WALK" | Shows "Walk 5 minutes" |           |       |
| "WaLk" | Shows "Walk 5 minutes" |           |       |
| "walk" | Shows "Walk 5 minutes" |           |       |

**Acceptance**: All three inputs produce identical suggestions

---

## 2. Keyboard Navigation

### 2.1 Tab Key Acceptance

**Test**: Tab key accepts suggestion

| Steps                 | Expected Behavior                   | Pass/Fail | Notes |
| --------------------- | ----------------------------------- | --------- | ----- |
| 1. Type "exe"         | Preview: "rcise 10 minutes"         |           |       |
| 2. Press Tab          | Input filled: "Exercise 10 minutes" |           |       |
| 3. Preview disappears | No gray text visible                |           |       |

**Acceptance**: Input updated instantly, no flicker

### 2.2 Arrow Right Acceptance

**Test**: Right arrow accepts suggestion (alternative to Tab)

| Steps          | Expected Behavior            | Pass/Fail | Notes |
| -------------- | ---------------------------- | --------- | ----- |
| 1. Type "read" | Preview: " 5 pages"          |           |       |
| 2. Press →     | Input filled: "Read 5 pages" |           |       |

**Acceptance**: Same behavior as Tab key

### 2.3 Escape Key Dismissal

**Test**: Escape clears suggestion

| Steps                      | Expected Behavior              | Pass/Fail | Notes |
| -------------------------- | ------------------------------ | --------- | ----- |
| 1. Type "med"              | Preview: "itate for 5 minutes" |           |       |
| 2. Press Escape            | Preview disappears             |           |       |
| 3. Input still shows "med" | User input preserved           |           |       |

**Acceptance**: Preview removed without changing input

### 2.4 Normal Typing Preserved

**Test**: Typing continues normally when suggestion present

| Steps                     | Expected Behavior           | Pass/Fail | Notes |
| ------------------------- | --------------------------- | --------- | ----- |
| 1. Type "exe"             | Preview: "rcise 10 minutes" |           |       |
| 2. Type "c" (now "exec")  | Preview updates accordingly |           |       |
| 3. Type "u" (now "execu") | Preview continues updating  |           |       |

**Acceptance**: All keyboard shortcuts don't interfere with typing

---

## 3. Visual Alignment & Design

### 3.1 Preview Text Alignment

**Test**: Gray preview aligns with cursor position

| Scenario                | Expected Behavior                 | Pass/Fail | Notes |
| ----------------------- | --------------------------------- | --------- | ----- |
| Type "exe"              | Preview starts exactly after "e"  |           |       |
| Type "Exercise "        | Preview starts after space        |           |       |
| Multi-word: "morning c" | Preview: "offee" aligns correctly |           |       |

**Visual Check**: Use screenshot or screen recording to verify alignment

**Acceptance**: Zero pixel offset, perfect alignment

### 3.2 Color & Contrast

**Test**: Preview text clearly distinguishable but subtle

| Element      | Color            | Contrast Ratio | Pass/Fail | Notes |
| ------------ | ---------------- | -------------- | --------- | ----- |
| User input   | stone-800 (dark) | ≥ 4.5:1        |           |       |
| Preview text | stone-400 (gray) | ≥ 3:1          |           |       |
| Placeholder  | stone-400 (gray) | ≥ 3:1          |           |       |

**Visual Check**: Compare preview to placeholder text (should be identical)

**Acceptance**: WCAG AA contrast requirements met

### 3.3 No Text Overlap

**Test**: Preview never overlaps or conflicts with input

| Scenario           | Expected Behavior        | Pass/Fail | Notes |
| ------------------ | ------------------------ | --------- | ----- |
| Fast typing        | No flickering or overlap |           |       |
| Backspace          | Preview adjusts smoothly |           |       |
| Clear button click | Preview disappears       |           |       |

**Acceptance**: Smooth transitions, no visual glitches

---

## 4. Performance Testing

### 4.1 Typing Lag

**Test**: No perceptible lag when typing

**Method**: Type rapidly (5-10 chars/second) and observe

| Device          | Typing Speed | Lag Observed? | Pass/Fail | Notes |
| --------------- | ------------ | ------------- | --------- | ----- |
| iPhone 14 Pro   | Fast         |               |           |       |
| iPhone SE (old) | Fast         |               |           |       |
| Pixel 6         | Fast         |               |           |       |
| Budget Android  | Fast         |               |           |       |

**Acceptance**: < 50ms perceived latency on all devices

### 4.2 Debounce Effectiveness

**Test**: Suggestion updates are debounced

**Method**: Type very rapidly and count suggestion updates

| Input Sequence                        | Expected Updates | Actual Updates | Pass/Fail | Notes |
| ------------------------------------- | ---------------- | -------------- | --------- | ----- |
| "e" → "x" → "e" → "r" (< 200ms total) | 1-2 updates      |                |           |       |
| "r" → "e" → "a" → "d" (fast)          | 1-2 updates      |                |           |       |

**Acceptance**: Far fewer updates than keystrokes (debouncing working)

### 4.3 Memory Leaks

**Test**: No memory leaks from repeated input changes

**Method**:

1. Open app
2. Type and clear input 100 times
3. Check memory usage (Xcode Instruments or Android Profiler)

**Acceptance**: Memory usage stable, no continuous growth

---

## 5. Accessibility Testing

### 5.1 VoiceOver (iOS)

**Test**: Screen reader announces suggestions correctly

| Action       | Expected Announcement                                             | Pass/Fail | Notes |
| ------------ | ----------------------------------------------------------------- | --------- | ----- |
| Type "exe"   | "Suggestion available: Exercise 10 minutes. Press Tab to accept." |           |       |
| Press Tab    | "Exercise 10 minutes" (input value)                               |           |       |
| Preview text | Should NOT be announced separately                                |           |       |

**Acceptance**: Clear instructions, preview hidden from screen reader

### 5.2 TalkBack (Android)

**Test**: Same as VoiceOver but on Android

| Action             | Expected Announcement                                      | Pass/Fail | Notes |
| ------------------ | ---------------------------------------------------------- | --------- | ----- |
| Type "read"        | "Suggestion available: Read 5 pages. Press Tab to accept." |           |       |
| Suggestion updates | Announces new suggestion                                   |           |       |

**Acceptance**: Identical behavior to iOS VoiceOver

### 5.3 Keyboard-Only Navigation

**Test**: All features work without mouse/touch

| Action             | Method  | Works? | Pass/Fail | Notes |
| ------------------ | ------- | ------ | --------- | ----- |
| Accept suggestion  | Tab key |        |           |       |
| Accept suggestion  | → key   |        |           |       |
| Dismiss suggestion | Escape  |        |           |       |
| Submit habit       | Enter   |        |           |       |

**Acceptance**: 100% keyboard accessible

### 5.4 Reduce Motion

**Test**: Respects reduce motion preference

**Method**: Enable Settings → Accessibility → Reduce Motion

| Element            | Expected Behavior             | Pass/Fail | Notes |
| ------------------ | ----------------------------- | --------- | ----- |
| Preview appearance | No fade-in animation          |           |       |
| Preview update     | Instant change, no transition |           |       |

**Acceptance**: Zero animations when reduce motion enabled

---

## 6. Edge Cases

### 6.1 Input Clearing

**Test**: Preview disappears when input cleared

| Action                          | Expected Behavior  | Pass/Fail | Notes |
| ------------------------------- | ------------------ | --------- | ----- |
| Type "exe" + press clear button | Preview disappears |           |       |
| Type "exe" + delete all chars   | Preview disappears |           |       |

**Acceptance**: Preview removed immediately

### 6.2 Rapid Tab Presses

**Test**: Multiple Tab presses don't cause issues

| Action                       | Expected Behavior                     | Pass/Fail | Notes |
| ---------------------------- | ------------------------------------- | --------- | ----- |
| Type "exe" + Tab + Tab + Tab | First Tab accepts, subsequent ignored |           |       |

**Acceptance**: No crashes, no duplicate inputs

### 6.3 Special Characters

**Test**: Special characters don't break matching

| Input       | Expected Behavior         | Pass/Fail | Notes |
| ----------- | ------------------------- | --------- | ----- |
| "ex!"       | No suggestions (no match) |           |       |
| "walk@home" | No suggestions (no match) |           |       |

**Acceptance**: No errors, graceful no-match handling

### 6.4 Very Long Input

**Test**: Long input doesn't break preview

| Input                 | Expected Behavior                  | Pass/Fail | Notes |
| --------------------- | ---------------------------------- | --------- | ----- |
| 50 chars (max length) | Preview still works if match found |           |       |

**Acceptance**: Preview visible until max length reached

### 6.5 Multi-Word Queries

**Test**: Multi-word matching works correctly

| Input         | Expected Preview      | Pass/Fail | Notes |
| ------------- | --------------------- | --------- | ----- |
| "morning cof" | "Morning coffee"      |           |       |
| "no phone"    | "No phone for 1 hour" |           |       |

**Acceptance**: Matches across word boundaries

---

## 7. Integration with Existing Features

### 7.1 Clear Button

**Test**: Clear button clears suggestion

| Steps             | Expected Behavior              | Pass/Fail | Notes |
| ----------------- | ------------------------------ | --------- | ----- |
| 1. Type "exe"     | Preview appears                |           |       |
| 2. Click X button | Input cleared, preview cleared |           |       |

**Acceptance**: Both input and preview cleared

### 7.2 Character Counter

**Test**: Counter updates correctly with suggestions

| Steps                       | Expected Behavior | Pass/Fail | Notes |
| --------------------------- | ----------------- | --------- | ----- |
| 1. Type "exe" (3 chars)     | Counter: "3/50"   |           |       |
| 2. Press Tab (now 20 chars) | Counter: "20/50"  |           |       |

**Acceptance**: Counter reflects actual input length

### 7.3 Focus States

**Test**: Preview appears/disappears with focus

| Action                      | Expected Behavior                      | Pass/Fail | Notes |
| --------------------------- | -------------------------------------- | --------- | ----- |
| Type "exe" in focused input | Preview appears                        |           |       |
| Blur input                  | Preview persists (until input changes) |           |       |

**Acceptance**: Preview behavior consistent with focus state

---

## 8. Real-World Usage Patterns

### 8.1 Common Habits

**Test**: Most common habits are easily accessible

| User Types | Expected Top Suggestion    | Pass/Fail | Notes |
| ---------- | -------------------------- | --------- | ----- |
| "ex"       | "Exercise..."              |           |       |
| "read"     | "Read..."                  |           |       |
| "med"      | "Meditate..."              |           |       |
| "walk"     | "Walk..."                  |           |       |
| "drink"    | "Drink 8 glasses of water" |           |       |

**Acceptance**: Prefix matches prioritized

### 8.2 Progressive Typing

**Test**: Suggestions update as user types more

| Typing Sequence             | Suggestion Progression                       | Pass/Fail | Notes |
| --------------------------- | -------------------------------------------- | --------- | ----- |
| "e" → "ex" → "exe"          | (none) → (none) → "Exercise 10 minutes"      |           |       |
| "r" → "re" → "rea" → "read" | (none) → (none) → "Read..." → "Read 5 pages" |           |       |

**Acceptance**: Smooth progression, no jumpy changes

---

## Defect Tracking

### Critical Issues (Blocking Release)

| ID  | Description | Severity | Status | Notes |
| --- | ----------- | -------- | ------ | ----- |
|     |             |          |        |       |

### Major Issues (Should Fix)

| ID  | Description | Severity | Status | Notes |
| --- | ----------- | -------- | ------ | ----- |
|     |             |          |        |       |

### Minor Issues (Nice to Have)

| ID  | Description | Severity | Status | Notes |
| --- | ----------- | -------- | ------ | ----- |
|     |             |          |        |       |

---

## Sign-Off

### Test Summary

**Total Test Cases**: 50+
**Passed**: **_
**Failed**: _**
**Blocked**: \_\_\_

**Overall Status**: ⬜ PASS ⬜ FAIL ⬜ BLOCKED

### Tester Notes

_[Add any observations, concerns, or recommendations here]_

---

### Approval

**Tested By**: ******\_\_\_\_******
**Date**: ******\_\_\_\_******
**Signature**: ******\_\_\_\_******

**Approved By**: ******\_\_\_\_******
**Date**: ******\_\_\_\_******
**Signature**: ******\_\_\_\_******

---

## Appendix: Test Data

### Habit Suggestions Database (Sample)

Total suggestions in database: **75 habits**

**Categories**:

- Physical Health: 20 habits
- Mental Wellness: 15 habits
- Productivity: 15 habits
- Nutrition: 10 habits
- Social/Personal: 15 habits

**Example Suggestions**:

- "Exercise 10 minutes" (physical, emoji: 🏃, keywords: workout, gym, fitness)
- "Meditate for 5 minutes" (mental, emoji: 🧘, keywords: mindfulness, breathe)
- "Read 5 pages" (mental, emoji: 📚, keywords: book, reading)
- "Walk 5 minutes" (physical, emoji: 🚶)
- "Drink 8 glasses of water" (physical, emoji: 💧, keywords: hydrate, water)

---

## Testing Tips

### How to Test Keyboard Navigation on Mobile

**iOS Simulator**:

1. Hardware → Keyboard → Connect Hardware Keyboard
2. Use Mac keyboard for Tab, Escape, Arrow keys

**Android Emulator**:

1. Ensure "Show keyboard" enabled in settings
2. Use PC keyboard for testing

### How to Enable Accessibility Testing

**iOS**:

1. Settings → Accessibility → VoiceOver → ON
2. Triple-click home button to toggle

**Android**:

1. Settings → Accessibility → TalkBack → ON
2. Use volume keys to navigate

### Performance Monitoring Tools

**iOS**: Xcode Instruments (Time Profiler, Leaks)
**Android**: Android Studio Profiler (CPU, Memory)

---

**Document Version**: 1.0
**Last Updated**: 2026-01-05
