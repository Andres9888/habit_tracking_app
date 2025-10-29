# Haptic Feedback Diagnostics Guide

## Current Status

Haptics NOT working on physical device despite:

- Device settings confirmed ON
- `expo-haptics@15.0.7` installed
- `runOnJS()` implementation added
- Code compiles without errors

## Comprehensive Diagnostic Steps

### 1. Verify Installation ✅ COMPLETED

```bash
npm list expo-haptics
# Result: expo-haptics@15.0.7 ✓
```

### 2. Use Haptic Test Component

A red "H" button now appears in the top-right corner of your app (DEV mode only).

**Steps:**

1. Open the app on your physical device
2. Tap the red "H" button in the top-right corner
3. Try ALL test buttons systematically
4. Watch console logs carefully

**What to test:**

- Light Impact
- Medium Impact
- Heavy Impact
- Selection
- Success Notification
- Warning Notification
- Error Notification
- Rapid Fire (5x Light)

**Expected Results:**

- You should feel haptic feedback for each button press
- Console should show: `✅ [Type] - Success at [timestamp]`

**If haptics DON'T work:**

- Check console for: `❌ [Type] - FAILED: [error]`
- Note which specific error message appears

### 3. Check HabitCard Logs

Enhanced logging added to HabitCard.tsx tap gesture:

**When you tap a habit card, console should show:**

```
🔴 ========================================
🔴 TAP GESTURE FIRED!!!
🔴 Habit: [habit name]
🔴 isCompleted: [true/false/undefined]
🔴 disabled: [true/false]
🔴 isToggling: [true/false]
🔴 ✓ Passed disabled/toggling check
🔴 Haptic style selected: [Light/Medium]
🔴 About to call runOnJS for haptic...
🔴🔴🔴 INSIDE runOnJS - CALLING HAPTIC NOW
✅ Haptic SUCCESS! Duration: [X]ms
🔴 Starting mutation...
🔴 Mutation SUCCESS
```

**If you DON'T see these logs:**

- Gesture handler not firing at all
- Check if you're tapping the habit card correctly

**If you see logs but still no haptic:**

- Check for error after "CALLING HAPTIC NOW"
- Look for `❌ Haptic FAILED` message

### 4. Device-Specific Checks

**What device are you testing on?**

- iPhone model: ******\_******
- iOS version: ******\_******
- Taptic Engine support: ******\_******

**Very old devices (iPhone 6 and older):**

- May not support Taptic Engine
- Haptics will silently fail

**iOS Version:**

- iOS 10+ required for full haptic support
- Check Settings → General → About → Software Version

### 5. Build Type Check

**CRITICAL:** If you added `expo-haptics` AFTER building the app, you MUST rebuild!

**Are you using:**

- [ ] Expo Go app
- [ ] Development build
- [ ] Production build

**If Development/Production Build:**

```bash
# Rebuild required after adding expo-haptics
npx expo run:ios
# or
npx expo run:android
```

**If Expo Go:**

- Just restart the app (should work immediately)

### 6. Alternative Haptic API Test

If `impactAsync()` fails, try alternatives in the Haptic Test screen:

- `selectionAsync()` - Different API path
- `notificationAsync()` - Different feedback type

**If these work but impact doesn't:**

- Issue specific to Impact Feedback API
- May need to use alternatives in HabitCard

### 7. React Native Version Compatibility

Check your versions:

```bash
cat package.json | grep -E "(react-native|expo|expo-haptics)"
```

**Current versions:**

- React Native: ******\_******
- Expo: ******\_******
- expo-haptics: 15.0.7 ✓

**Known issues:**

- Some older RN versions have expo-haptics compatibility issues
- Check: https://github.com/expo/expo/issues (search: "haptics")

### 8. Permissions Check (iOS)

Haptics don't require explicit permissions, but check:

**Settings → [Your App] → Check for any blocked permissions**

Also check:
**Settings → Sounds & Haptics → System Haptics → ON**

### 9. Metro Bundler Cache Clear

Sometimes native modules need a cache clear:

```bash
# Clear all caches
npx expo start --clear

# OR

# Full nuclear option
rm -rf node_modules
npm install
npx expo start --clear
```

### 10. Debugging with Native Logs

**iOS:**

```bash
# View device logs while testing
npx react-native log-ios
```

**Android:**

```bash
npx react-native log-android
```

Look for any native errors related to haptics.

## Console Log Analysis

### Success Pattern

```
🔴 TAP GESTURE FIRED!!!
🔴🔴🔴 INSIDE runOnJS - CALLING HAPTIC NOW
✅ Haptic SUCCESS! Duration: 5ms
```

### Failure Patterns

**Pattern 1: Gesture not firing**

```
[No logs at all]
→ Gesture handler issue
→ Try tapping directly on habit card, not swipe area
```

**Pattern 2: Blocked by conditions**

```
🔴 TAP GESTURE FIRED!!!
🔴 ✗ BLOCKED - disabled: true isToggling: false
→ Card is disabled or toggling in progress
→ Wait 300ms between taps
```

**Pattern 3: runOnJS not reached**

```
🔴 TAP GESTURE FIRED!!!
🔴 About to call runOnJS for haptic...
[stops here]
→ runOnJS call failed
→ Check if react-native-reanimated is properly installed
```

**Pattern 4: Haptic call fails**

```
🔴🔴🔴 INSIDE runOnJS - CALLING HAPTIC NOW
❌ Haptic FAILED after 1ms: [error]
→ expo-haptics throwing error
→ Check error message for details
```

## Next Steps Based on Results

### If Haptic Test buttons work but HabitCard doesn't

→ Issue with gesture handler implementation
→ Check HabitCard logs for why gesture isn't firing

### If NO haptics work at all

→ Device doesn't support haptics (check device model)
→ OR app needs rebuild after installing expo-haptics
→ OR iOS/Android version too old

### If SOME haptic types work but not others

→ Use the working type (e.g., selectionAsync instead of impactAsync)
→ Update HabitCard to use alternative API

### If logs show success but no physical feedback

→ Device Haptic Engine may be damaged
→ Test with another app (e.g., iOS keyboard, home button)
→ If other apps work, very rare expo-haptics bug

### If rapid fire test shows intermittent failures

→ System throttling haptic requests
→ Add longer delays between haptics (currently 200ms)

## Reporting Findings

Please report back with:

1. **Device info**: Model, iOS version
2. **Build type**: Expo Go / Dev Build / Production
3. **Haptic Test results**: Which buttons worked/failed
4. **HabitCard logs**: Full console output when tapping
5. **Error messages**: Any `❌` errors from console
6. **Other haptic apps**: Do other apps with haptics work?

## Temporary Workarounds

While debugging, you can:

1. Disable haptics in HabitCard (comment out Haptics calls)
2. Use visual feedback only (already has scale animation)
3. Use sound feedback as alternative (would need audio library)

## Files Modified for Diagnostics

1. `src/components/HapticTest.tsx` - Isolated test component
2. `src/components/HabitCard.tsx` - Enhanced logging
3. `App.tsx` - Red "H" button to access test screen

## Cleanup After Resolution

Once haptics are working, remove:

1. Red "H" button from App.tsx
2. `showHapticTest` state and logic
3. Console logs from HabitCard.tsx (keep a few key ones)
4. HapticTest.tsx component (or keep for future debugging)

---

**Start testing now and report your findings!**
