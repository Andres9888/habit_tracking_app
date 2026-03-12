# Fix: Slow Habit Edit Screen Close + Lingering Beige Background

## Context

When closing the habit edit screen, the dismiss animation feels sluggish and a beige background (#F5F1ED) lingers visually. This happens because:

1. **React Native's built-in `animationType='slide'`** runs a fixed ~400ms UIKit animation that can't be tuned
2. **The `bg-black/50` backdrop** doesn't animate out — it snaps away when the Modal unmounts
3. **No exit animations** on the content (only enter: `FadeIn`, `FadeInUp`)

## Solution

Adopt the same spring-based animation pattern already used by `CreateHabitModalCentered` — reuse the existing `useSwipeDismiss` hook.

**Only 1 file changes:** `src/screens/HabitEditScreen/HabitEditScreen.tsx`

## Changes

### `HabitEditScreen.tsx`

1. **Switch** `animationType='slide'` → `animationType='none'`
2. **Import** `useSwipeDismiss` from `@/components/CreateHabitModal/hooks/useSwipeDismiss`
3. **Import** `GestureDetector` from `react-native-gesture-handler`, `StyleSheet` from `react-native`
4. **Call** `useSwipeDismiss({ visible, onClose })` to get `{ animateOut, backdropStyle, panGesture, sheetStyle }`
5. **Pass** `animateOut` as `onClose` to `useHabitEditScreen` so save/delete/archive all animate out
6. **Replace** the static `bg-black/50` wrapper with an animated backdrop + gesture-wrapped sheet

### Resulting JSX structure (mirrors `CreateHabitModalCentered`):

```tsx
<Modal accessibilityViewIsModal transparent animationType='none' visible={visible} onRequestClose={animateOut}>
  <View className='flex-1'>
    {/* Animated backdrop - fades in/out */}
    <Pressable style={StyleSheet.absoluteFill} onPress={animateOut}>
      <Animated.View className='flex-1 bg-black' style={backdropStyle} />
    </Pressable>

    {/* Swipeable sheet - spring slide up/down */}
    <GestureDetector gesture={panGesture}>
      <Animated.View
        className='overflow-hidden rounded-t-3xl shadow-2xl'
        style={[styles.sheet, sheetStyle, { backgroundColor: themeColors.background }]}
      >
        <KeyboardAvoidingView ...>
          {loading ? <Skeleton /> : <EditHeader + ScrollView content />}
        </KeyboardAvoidingView>
      </Animated.View>
    </GestureDetector>
  </View>
</Modal>
```

### Key wiring details

- `EditHeader.onCancel` changes from `onClose()` to `animateOut()`
- `useHabitEditScreen({ habitId, onClose: animateOut })` — all internal close paths (save success, delete, archive) now animate out before unmounting
- The `useSwipeDismiss` exit flow: `animateOut()` → spring slides sheet down + fades backdrop → spring callback calls `onClose()` → parent sets `visible=false` → component unmounts cleanly

### Reused existing code

- `useSwipeDismiss` hook: `src/components/CreateHabitModal/hooks/useSwipeDismiss.ts`
- Spring configs: `@/theme/animations` (`springs.bottomSheet`, `springs.exit`)
- Constants: `@/components/Modal/Modal.constants` (`SCREEN_HEIGHT`, `DISMISS_THRESHOLD`, `VELOCITY_THRESHOLD`)

### Bonus: swipe-to-dismiss gesture

By adopting `useSwipeDismiss`, the edit screen also gains swipe-down-to-dismiss — matching the create modal behavior.

## Verification

1. Open a habit → tap Edit → cancel → sheet should spring down smoothly with backdrop fade
2. Edit a habit → save → sheet should animate out after save succeeds
3. Swipe down on the edit sheet → should dismiss with spring physics + haptic
4. Android back button → should animate out (via `onRequestClose={animateOut}`)
5. Tap backdrop → should animate out
6. No lingering beige background after any close path
7. Keyboard open → close → keyboard and sheet should dismiss together without conflict
