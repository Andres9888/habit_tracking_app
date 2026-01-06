# Safe Area Fix - Testing Guide

## What Was Fixed

The "Browse templates • Create custom habit" links at the bottom of the empty habits screen were getting cut off by the home indicator zone on newer iPhones (X and later).

## Implementation Summary

### Changes Made:

1. **Added Safe Area Hook** (`HabitsEmptyStateMinimal.tsx:57`)

   ```typescript
   const insets = useSafeAreaInsets();
   const bottomInset = insets.bottom;
   ```

2. **Applied Bottom Padding** (`HabitsEmptyStateMinimal.tsx:75-78`)

   ```typescript
   paddingBottom: withTiming(
     isKeyboardVisible ? 0 : bottomInset + 20,
     timingConfig
   ),
   ```

3. **Added Min Height** (`HabitsEmptyStateMinimal.tsx:250`)

   ```typescript
   minHeight: '100%',
   ```

4. **Added Debug Logging** (`HabitsEmptyStateMinimal.tsx:63`)
   - Check your console/logs for: `[HabitsEmptyStateMinimal] Safe area bottom inset: X`

## How to Test

### 1. Check Console Logs

After opening the empty habits screen, look for this log:

```
[HabitsEmptyStateMinimal] Safe area bottom inset: 34 Keyboard visible: false
```

Expected values:

- iPhone SE (2nd gen): `bottomInset: 0`
- iPhone 11/12/13/14: `bottomInset: 34`
- iPhone 14 Pro: `bottomInset: 34`
- iPad: `bottomInset: 0-20` (varies)

### 2. Visual Inspection

**What to check:**

- ✅ Bottom links fully visible
- ✅ No cutoff by home indicator
- ✅ Comfortable spacing (~54px on iPhone 13)
- ✅ Links are tappable

**Expected bottom spacing:**

- iPhone SE: 20px (0 + 20)
- iPhone 13: 54px (34 + 20)
- iPhone 14 Pro: 54px (34 + 20)

### 3. Keyboard Interaction

1. Tap the input field to open keyboard
2. Check logs: `Keyboard visible: true`
3. Bottom padding should animate to `0` (keyboard provides safe boundary)
4. Dismiss keyboard
5. Bottom padding should animate back to `bottomInset + 20`

### 4. Device Matrix

Test on these devices (simulator or physical):

| Device              | Bottom Inset | Expected Padding |
| ------------------- | ------------ | ---------------- |
| iPhone SE (2nd gen) | 0px          | 20px             |
| iPhone 11           | 34px         | 54px             |
| iPhone 13           | 34px         | 54px             |
| iPhone 14 Pro       | 34px         | 54px             |
| iPad (various)      | 0-20px       | 20-40px          |

## Troubleshooting

### If bottom is still cut off:

1. **Check logs** - Is `bottomInset` showing the correct value?
   - If it's `0` on iPhone 13, SafeAreaProvider might not be wrapping the app
   - Check `App.tsx` has `<SafeAreaProvider>` at root level

2. **Check the component hierarchy** - Is the component getting `flex: 1`?
   - The `HabitsEmptyStateMinimal` is used as `ListEmptyComponent` in `DraggableFlatList`
   - The FlatList should have `flex: 1` on its parent

3. **Check for conflicting padding** - Is there padding from parent components?
   - The `DraggableFlatList` has `contentContainerStyle.paddingBottom`
   - This shouldn't affect `ListEmptyComponent`, but verify

4. **Try on physical device** - Simulators sometimes have different safe areas
   - Connect your iPhone via USB
   - Run: `npx expo run:ios --device`

### If padding is too much:

- Adjust the `+ 20` value in the implementation
- Current: `bottomInset + 20`
- Try: `bottomInset + 10` for less breathing room

### If animation is janky:

- Check `shouldReduceMotion` preference
- Try increasing `KEYBOARD_LAYOUT.transitionDuration` (currently 300ms)

## Debug Commands

```bash
# View logs in terminal
npx expo start
# Then press 'i' for iOS

# View device logs (physical device)
xcrun simctl spawn booted log stream --predicate 'processImagePath contains "Expo"'

# Clear Expo cache
npx expo start -c
```

## Expected Behavior Summary

### Normal State (Keyboard Closed):

- Bottom padding = `bottomInset + 20`
- Content centered vertically
- All links visible and tappable

### Keyboard Open:

- Bottom padding = `0`
- Content shifts to top with `paddingTop: 100`
- Hero and headline scale down
- Chips and links fade out

### Animation:

- Smooth 300ms ease-out transition
- All layout changes synchronized

## Removal Instructions

If you need to revert this fix:

1. Remove the safe area hook:

   ```typescript
   // Delete these lines
   const insets = useSafeAreaInsets();
   const bottomInset = insets.bottom;
   ```

2. Remove the import:

   ```typescript
   // Delete this line
   import { useSafeAreaInsets } from 'react-native-safe-area-context';
   ```

3. Remove the paddingBottom from animated style:

   ```typescript
   // Remove these lines from containerAnimatedStyle
   paddingBottom: withTiming(
     isKeyboardVisible ? 0 : bottomInset + 20,
     timingConfig
   ),
   ```

4. Remove the minHeight:

   ```typescript
   // Remove this line
   minHeight: '100%',
   ```

5. Remove debug log:
   ```typescript
   // Delete this line
   console.log(
     '[HabitsEmptyStateMinimal] Safe area bottom inset:',
     bottomInset,
     'Keyboard visible:',
     isKeyboardVisible
   );
   ```

## Files Modified

- `src/features/habits/components/HabitsEmptyStateMinimal/HabitsEmptyStateMinimal.tsx`
- `src/features/habits/components/HabitsEmptyStateMinimal/__tests__/HabitsEmptyStateMinimal.test.tsx`
- `docs/specs/empty-habit-screen/safe-area-fix-spec.md`
