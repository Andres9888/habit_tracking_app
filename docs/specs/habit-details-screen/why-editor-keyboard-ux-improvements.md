# Why Editor Keyboard UX Improvements

## Overview

Improve the Why Editor Modal in `HabitDetailScreen.tsx` to properly handle keyboard interactions, preventing the keyboard from blocking the input field and providing a better editing experience.

## Problem Statement

The current Why Editor Modal has several UX issues:

1. **Keyboard blocks input** - The TextInput is positioned in the middle of the screen, causing the keyboard to cover it when opened
2. **No "Done" button** - Users must tap outside the input to dismiss the keyboard
3. **No auto-scroll** - Content doesn't scroll up when keyboard appears
4. **Character counter overlays input** - The 0/200 counter is positioned inside the input area, blocking text
5. **Intro text wastes space** - When keyboard is visible, the intro paragraph takes up valuable screen real estate

## Design Reference

**Mockup:** `.superdesign/design_iterations/why_editor_improved_1.html`

## Comparison: CreateHabitModalV2 (Working) vs Why Editor (Broken)

| Feature | CreateHabitModalV2 ✅ | Why Editor ❌ |
|---------|----------------------|---------------|
| Keyboard State Hook | `useKeyboardState()` | None |
| Auto-scroll on focus | Yes | No |
| Done button in header | Yes (keyboard-aware) | No |
| Input position | Top of screen | Middle (blocked) |
| Character counter | Right side of input | Overlay inside input |

## Solution

Refactor the Why Editor Modal to match the patterns used in `CreateHabitModalV2`:

### T1: Add Keyboard State Management

- Import and use `useKeyboardState` hook from `src/components/CreateHabitModal/hooks/useKeyboardState.ts`
- Track `isKeyboardVisible` and `keyboardHeight` states

**Files to modify:**
- `src/screens/HabitDetailScreen.tsx`

**Acceptance Criteria:**
- [x] `useKeyboardState` hook imported and used
- [x] `isKeyboardVisible` state available in component

**Implementation Notes:** Added `useKeyboardState` hook import at line 74. Hook is used at line 1602-1603 providing both `isKeyboardVisible` and `keyboardHeight` states.

### T2: Add "Done" Button to Header (Keyboard-Aware)

- Add a "Done" button next to the close button in the header
- Button only visible when keyboard is open
- Tapping "Done" dismisses keyboard and keeps focus on content

**Files to modify:**
- `src/screens/HabitDetailScreen.tsx` (Why Editor Modal header section, lines ~2303-2318)

**Acceptance Criteria:**
- [x] "Done" button appears when keyboard is visible
- [x] "Done" button hidden when keyboard is dismissed
- [x] Tapping "Done" calls `Keyboard.dismiss()`
- [x] Smooth opacity/scale animation for button appearance

**Implementation Notes:** Done button implemented at lines 2530-2540. Conditionally rendered when `isKeyboardVisible` is true. Rose-500 background with white text, proper accessibility label. Button calls `Keyboard.dismiss()` on press.

### T3: Move Character Counter Outside Input

- Relocate the character counter from inside the TextInput to below it
- Position: right-aligned, below the input with small margin

**Current (lines ~2343-2347):**
```tsx
<View className="absolute bottom-4 right-4">
  <View className="rounded-full bg-stone-100 px-2 py-1">
    <Text className="text-[10px] font-bold text-stone-400">{whyDraft.length} / 200</Text>
  </View>
</View>
```

**Target:**
```tsx
{/* After TextInput closing tag */}
<View className="flex-row justify-end mt-2 px-1">
  <Text className={`text-xs font-semibold ${whyDraft.length >= 180 ? 'text-amber-500' : 'text-stone-400'}`}>
    {whyDraft.length} / 200
  </Text>
</View>
```

**Acceptance Criteria:**
- [x] Counter positioned below input, right-aligned
- [x] Counter changes color at 180+ characters (warning)
- [x] Counter changes color at 200 characters (limit)
- [x] No overlay on input text area

**Implementation Notes:** Character counter moved outside TextInput at lines 2585-2590. Uses conditional styling: stone-400 default, amber-500 at 180+ chars, rose-500 at 200 chars.

### T4: Collapse Intro Text When Keyboard Visible

- Animate the intro paragraph to collapse/hide when keyboard is open
- Use `Animated.View` with height/opacity animation
- Restore when keyboard dismissed

**Target intro text (line ~2325-2327):**
```tsx
<Animated.View style={{ opacity: introOpacity, maxHeight: introHeight }}>
  <Text className="mb-6 text-center text-sm text-stone-500">
    Your why is the deeper reason that keeps you going when motivation fades.
  </Text>
</Animated.View>
```

**Acceptance Criteria:**
- [x] Intro text animates out when keyboard appears
- [x] Intro text animates back when keyboard dismissed
- [x] Animation duration ~200ms with ease-out timing

**Implementation Notes:** Intro text wrapped in RNAnimated.View at lines 2558-2563. Animated values defined at lines 1605-1607, animation triggered via useEffect at lines 1647-1663 with 200ms duration.

### T5: Add Auto-Scroll on Input Focus

- When TextInput receives focus, scroll content to keep input visible above keyboard
- Use ScrollView ref and `scrollTo()` method

**Files to modify:**
- `src/screens/HabitDetailScreen.tsx`

**Acceptance Criteria:**
- [x] ScrollView ref added to Why Editor modal
- [x] Input scrolls into view when focused
- [x] Smooth scroll animation (animated: true)

**Implementation Notes:** ScrollView ref added at line 1609-1610 (`whyEditorScrollRef`). Ref attached to ScrollView at line 2552. TextInput onFocus handler at lines 2578-2583 scrolls to y=60 with 100ms delay for keyboard animation.

### T6: Adjust Footer Position with Keyboard

- The sticky "Save My Why" button should move up when keyboard appears
- Use `keyboardHeight` to offset the footer position

**Files to modify:**
- `src/screens/HabitDetailScreen.tsx` (footer section, lines ~2377-2389)

**Acceptance Criteria:**
- [x] Footer animates up when keyboard appears
- [x] Footer returns to original position when keyboard dismissed
- [x] No overlap between footer and keyboard

**Implementation Notes:** Footer View changed to RNAnimated.View at lines 2620-2636. Uses marginBottom with keyboardHeight when keyboard is visible to push footer above keyboard.

## Technical Implementation Notes

### Hook Usage
```tsx
import { useKeyboardState } from '../components/CreateHabitModal/hooks/useKeyboardState';

// Inside component
const { isKeyboardVisible, keyboardHeight } = useKeyboardState();
```

### Animation Pattern (from CreateHabitModalV2)
```tsx
// Animated values for intro collapse
const introOpacity = useRef(new Animated.Value(1)).current;
const introHeight = useRef(new Animated.Value(60)).current;

useEffect(() => {
  Animated.parallel([
    Animated.timing(introOpacity, {
      toValue: isKeyboardVisible ? 0 : 1,
      duration: 200,
      useNativeDriver: false, // height can't use native driver
    }),
    Animated.timing(introHeight, {
      toValue: isKeyboardVisible ? 0 : 60,
      duration: 200,
      useNativeDriver: false,
    }),
  ]).start();
}, [isKeyboardVisible]);
```

## Out of Scope

- Changes to the Vision Board modal
- Changes to the Identity Editor modal (though same patterns could be applied later)
- Changes to template content or styling

## Success Metrics

- Input field remains visible when keyboard is open
- User can easily dismiss keyboard via "Done" button
- Character count visible without blocking input text
- Smooth, polished animations matching app's motion design

## Testing Checklist

- [ ] Test on iOS simulator (keyboard behavior)
- [ ] Test on Android emulator (keyboard behavior differs)
- [ ] Test with physical keyboard connected
- [ ] Test rapid keyboard open/close
- [ ] Test with long text (near 200 char limit)
- [ ] Verify accessibility labels on new Done button
