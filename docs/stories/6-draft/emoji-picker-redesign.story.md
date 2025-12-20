# Story · Emoji Tap Affordance Fix

**Status:** Draft
**Epic:** 2 – Core Habit Management
**Story ID:** 2.7
**Related:** 2.8 (Emoji Picker Modal Redesign)

---

## User Story

**As a** habit tracker user,
**I want** the emoji icon to clearly show it's tappable,
**so that** I can change my habit icon without searching for a hidden button.

---

## Problem Statement

Users don't realize the emoji icon is tappable to change it. They must discover the separate "Browse Icons" button below the emoji preview, which is poor UX.

---

## Acceptance Criteria

### AC1 · Direct Tap Target

- [ ] Emoji preview container is directly tappable (opens picker on tap)
- [ ] Remove separate "Browse Icons" button
- [ ] Single clear tap target for emoji selection

### AC2 · Edit Badge

- [ ] Edit pencil badge (28x28px) appears on bottom-right corner of emoji container
- [ ] Badge has dark background (#1a1a1a) with white pencil icon
- [ ] Badge has white border and shadow for visibility

### AC3 · Helper Text

- [ ] "Tap to change icon" text displays below emoji
- [ ] Text has subtle pulse animation (opacity 0.5 → 1, 2s cycle)
- [ ] Text color: #6b7280

### AC4 · Press Feedback

- [ ] Press animation scales emoji container to 0.95 on touch
- [ ] Haptic feedback triggers on press
- [ ] Hover state shows subtle shadow (on web)

---

## Design Reference

**Interactive Mockup:**
- `.superdesign/design_iterations/emoji_picker_before_after_1.html`

### Before/After

**BEFORE (Current Problem)**
```
┌─────────────────────────────────────┐
│           Edit Habit            ✕   │
├─────────────────────────────────────┤
│                                     │
│         ┌──────────────┐            │
│         │     💪       │            │  ← Not obviously tappable
│         └──────────────┘            │
│           Choose Icon               │
│                                     │
│  ┌─────────────────────────────┐    │
│  │ Browse Icons         Change │    │  ← Hidden secondary button
│  └─────────────────────────────┘    │
│                                     │
└─────────────────────────────────────┘
```

**AFTER (Fixed)**
```
┌─────────────────────────────────────┐
│           Edit Habit            ✕   │
├─────────────────────────────────────┤
│                                     │
│         ┌──────────────┐            │
│         │     💪       │            │
│         │          ✏️  │            │  ← Edit badge overlay
│         └──────────────┘            │
│        Tap to change icon           │  ← Helper text (pulsing)
│                                     │
└─────────────────────────────────────┘
```

### Visual Specs

| Element | Spec |
|---------|------|
| Emoji container | 96x96px, rounded-2xl, bg from habit color |
| Edit badge | 28x28px, #1a1a1a background, white pencil icon |
| Badge position | bottom-right, offset -4px |
| Badge border | 2px white, shadow-lg |
| Helper text | 14px, #6b7280, margin-top 12px |
| Pulse animation | opacity 0.5→1→0.5, 2s ease-in-out infinite |
| Press scale | 0.95, 100ms duration |

### Animation Specs

```css
/* Press animation on emoji container */
@keyframes pressIn {
  0% { transform: scale(1); }
  100% { transform: scale(0.95); }
}

/* Pulse animation on helper text */
@keyframes pulse {
  0%, 100% { opacity: 0.5; }
  50% { opacity: 1; }
}

.tap-hint {
  animation: pulse 2s ease-in-out infinite;
}
```

---

## Technical Implementation

### File to Modify

`src/screens/HabitEditScreen.tsx`

### Current Code (lines 203-229)

```tsx
{/* Icon Section - CURRENT */}
<View className='mb-4 rounded-2xl bg-white p-6'>
  <View className='mb-6 items-center'>
    <View className='mb-3 h-20 w-20 items-center justify-center rounded-2xl'
          style={{ backgroundColor: selectedColor }}>
      <Text className='text-[36px]'>{selectedEmoji}</Text>
    </View>
    <Text className='text-[17px] font-semibold text-[#1a1a1a]'>
      Choose Icon
    </Text>
  </View>

  {/* Separate button - REMOVE THIS */}
  <TouchableOpacity
    className='flex-row items-center justify-between rounded-xl bg-gray-50 p-4'
    onPress={() => setIsEmojiPickerVisible(true)}>
    <Text>Browse Icons</Text>
    <Text>Change</Text>
  </TouchableOpacity>
</View>
```

### New Code

```tsx
{/* Icon Section - IMPROVED */}
<View className='mb-4 rounded-2xl bg-white p-6'>
  <View className='items-center'>
    {/* Tappable emoji with edit badge */}
    <Pressable
      onPress={() => setIsEmojiPickerVisible(true)}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={({ pressed }) => [
        { transform: [{ scale: pressed ? 0.95 : 1 }] }
      ]}
    >
      <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
        <View className='relative'>
          <View className='h-24 w-24 items-center justify-center rounded-2xl'
                style={{ backgroundColor: selectedColor }}>
            <Text className='text-[48px]'>{selectedEmoji}</Text>
          </View>
          {/* Edit badge */}
          <View className='absolute -bottom-1 -right-1 h-7 w-7 items-center justify-center rounded-full bg-[#1a1a1a] border-2 border-white shadow-lg'>
            <Pencil size={14} color='white' />
          </View>
        </View>
      </Animated.View>
    </Pressable>

    {/* Helper text with pulse */}
    <Animated.Text
      className='mt-3 text-sm text-gray-500'
      style={{ opacity: pulseAnim }}>
      Tap to change icon
    </Animated.Text>
  </View>
</View>
```

### Animation Hook

```typescript
const scaleAnim = useRef(new Animated.Value(1)).current;
const pulseAnim = useRef(new Animated.Value(0.5)).current;

useEffect(() => {
  Animated.loop(
    Animated.sequence([
      Animated.timing(pulseAnim, { toValue: 1, duration: 1000, useNativeDriver: true }),
      Animated.timing(pulseAnim, { toValue: 0.5, duration: 1000, useNativeDriver: true }),
    ])
  ).start();
}, []);

const handlePressIn = () => {
  triggerSelection(); // haptic
  Animated.timing(scaleAnim, {
    toValue: 0.95,
    duration: 100,
    useNativeDriver: true,
  }).start();
};

const handlePressOut = () => {
  Animated.timing(scaleAnim, {
    toValue: 1,
    duration: 150,
    useNativeDriver: true,
  }).start();
};
```

---

## Tasks

- [ ] **T1** Remove "Browse Icons" button from HabitEditScreen
- [ ] **T2** Make emoji preview container tappable (Pressable)
- [ ] **T3** Add edit badge overlay (Pencil icon from lucide)
- [ ] **T4** Add "Tap to change icon" helper text
- [ ] **T5** Implement pulse animation on helper text
- [ ] **T6** Add press animation (scale to 0.95)
- [ ] **T7** Add haptic feedback on press
- [ ] **T8** Test on iOS and Android

---

## Success Metrics

- Users can change emoji via direct tap (no "Browse" button needed)
- First-time users understand emoji is tappable (user testing)
- Reduced support questions about changing habit icons

---

## Dependencies

- lucide-react-native (Pencil icon) - already in project
- useHapticFeedback hook - already in project

---

## Change Log

| Date | Change | Author |
|------|--------|--------|
| 2025-12-19 | Initial draft | PM |
| 2025-12-19 | Split modal redesign to separate story (2.8) | PM |
