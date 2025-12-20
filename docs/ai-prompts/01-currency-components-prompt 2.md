# AI Frontend Prompt: Currency & Progress Components

## Context
Building gamification currency system for a React Native habit tracking app using NativeWind (Tailwind), React Native Reanimated v4, and expo-haptics. Duolingo-inspired engagement mechanics.

## Components to Build

### 1. CoinCounter Component

**Visual Design:**
- Coin icon (🪙 or custom SVG) + number display
- Gold color (#F59E0B - Amber 500)
- Compact size for top bar: 20px icon, 14px text
- Large size for shop header: 32px icon, 20px text
- Tabular-nums font for smooth counting animation

**Behavior:**
- Animates number with odometer-style flip when value changes
- Coin icon bounces on increment (scale 1 → 1.2 → 1.0, 300ms)
- Green pulse on increment, red pulse on decrement
- Tappable: navigates to Shop screen

**Code Interface:**
```typescript
interface CoinCounterProps {
  balance: number;
  animated?: boolean; // default: true
  size?: 'small' | 'medium' | 'large'; // default: 'small'
  onPress?: () => void;
}
```

**Animation Requirements:**
- Use React Native Reanimated useSharedValue and withSpring
- Spring config: damping 15, stiffness 150
- Number increment duration: 800ms
- Icon bounce: 300ms

---

### 2. StreakSaveIndicator Component

**Visual Design:**
- Heart icon (❤️) + fraction display (e.g., "2/3")
- Color coding:
  - Full (3/3): Red #EF4444
  - Low (1/3): Amber #F59E0B (warning)
  - Empty (0/3): Gray #9CA3AF
  - Premium (∞): Gold #FFD700 with shimmer
- Compact size: 18px icon, 12px text
- Detailed size: 24px icon, 16px text

**Behavior:**
- Pulse animation when low (1 save remaining)
- Shimmer effect for Premium unlimited (∞)
- Tappable: shows info modal about Streak Saves

**Code Interface:**
```typescript
interface StreakSaveIndicatorProps {
  current: number; // 0-3 or Infinity for premium
  max: number; // 3 for free users
  isPremium: boolean;
  onPress?: () => void;
}
```

**Animation Requirements:**
- Pulse: scale 1 → 1.1 → 1.0, repeat every 2s when low
- Shimmer: horizontal gradient sweep, 2s duration, infinite loop
- Color transitions: 300ms ease-in-out

---

### 3. XPProgressBar Component

**Visual Design:**
- Horizontal progress bar with gradient fill
- Gradient: #AD46FF (purple) → #F6339A (pink)
- Background: #F3F4F6 (gray 100)
- Height: 12px (compact), 16px (full)
- Border radius: 9999px (fully rounded)
- Optional glow effect during fill

**Content Display:**
- Shows current/total XP: "69/100 XP"
- Shows XP to next level: "31 XP to Level 2"
- Level badge: circle with level number

**Behavior:**
- Smooth fill animation on XP gain (800ms cubic-bezier)
- Glow effect appears during fill (fade in → fade out)
- Explosion particle effect when reaching 100%
- Haptic: Medium impact when XP gained

**Code Interface:**
```typescript
interface XPProgressBarProps {
  current: number; // 0-100
  total: number; // 100 per level
  level: number;
  showRemaining?: boolean; // show "X to next level"
  onLevelUp?: () => void; // callback when bar fills
}
```

**Animation Requirements:**
- Fill: withTiming, 800ms, Easing.out(Easing.cubic)
- Glow opacity: 0 → 1 (200ms) → 0 (600ms)
- Explosion: particles scatter radially, 500ms

---

## Design System

**Colors:**
```typescript
export const COLORS = {
  coin: '#F59E0B', // Amber 500
  heart: '#EF4444', // Red 500
  heartLow: '#F59E0B', // Amber 500
  heartEmpty: '#9CA3AF', // Gray 400
  premium: '#FFD700', // Gold
  xpGradient: ['#AD46FF', '#F6339A'], // Purple to Pink
  background: '#F3F4F6', // Gray 100
  success: '#10B981', // Green 500
  warning: '#F59E0B', // Amber 500
};
```

**Animation Configs:**
```typescript
export const SPRING_CONFIG = {
  damping: 15,
  stiffness: 150,
};

export const DURATIONS = {
  instant: 100,
  fast: 300,
  normal: 800,
};
```

---

## Example Usage

```tsx
// Top bar implementation
<View className="flex-row items-center gap-4 px-4 py-3 bg-[#F7F5F2]">
  <CoinCounter balance={240} size="small" onPress={() => navigate('Shop')} />
  <StreakSaveIndicator current={2} max={3} isPremium={false} />
  <View className="flex-1" />
  <Pressable onPress={() => navigate('Character')}>
    <CharacterAvatar level={1} size="small" />
  </Pressable>
</View>

// Character screen XP bar
<View className="p-4 bg-white rounded-3xl">
  <XPProgressBar
    current={69}
    total={100}
    level={1}
    showRemaining
    onLevelUp={() => showLevelUpModal()}
  />
</View>
```

---

## Technical Requirements

**Dependencies:**
```json
{
  "react-native-reanimated": "~4.1.1",
  "expo-haptics": "~15.0.7",
  "nativewind": "^4.1.23"
}
```

**Performance:**
- Use `useNativeDriver: true` for all animations
- Maintain 60 FPS during animations
- Debounce rapid value changes (100ms)

**Accessibility:**
- All components have descriptive `accessibilityLabel`
- Announce balance changes to screen readers
- Support reduced motion (instant updates instead of animations)

---

## Success Criteria

1. ✅ Smooth, delightful animations (no jank)
2. ✅ Clear visual hierarchy and readability
3. ✅ Haptic feedback enhances interactions
4. ✅ Premium states are visually distinct
5. ✅ Components are reusable and composable

---

**AI Tool Instructions:**
- Use React Native + NativeWind syntax
- Include TypeScript types
- Implement all animations with Reanimated v4
- Follow iOS Human Interface Guidelines for touch targets (44x44px minimum)
- Add inline comments for complex logic
