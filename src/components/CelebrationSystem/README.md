# Enhanced Celebration System

A physics-based confetti celebration system with multiple burst types, haptic feedback, and sound effects.

## Features

- **Multiple Burst Types**: Different celebrations for different achievements
  - `default`: Regular habit completion
  - `chainCompletion`: Completing habits in sequence (3+ in a row)
  - `streakMilestone`: Reaching streak milestones (7, 14, 30, 100 days)
  - `levelUp`: Habit strength level increases (20%, 40%, 60%, 80%)
  - `perfectWeek`: All habits completed for a full week

- **Physics Simulation**: Gravity, wind, drag, and rotation for realistic particle motion

- **Haptic Feedback**: Unique haptic patterns for each burst type

- **Sound Effects**: Chime, pop, and success sounds

- **Dark Mode Support**: Color palettes optimized for light and dark modes

- **Accessibility**: Respects reduced motion preferences

## Usage

### Basic Usage

```tsx
import { ConfettiSystem, useCelebration } from '@/components/CelebrationSystem';

function MyComponent() {
  const { triggerCelebration, activeBurst, config } = useCelebration({
    soundEnabled: true,
    hapticsEnabled: true,
  });

  const handleHabitComplete = () => {
    triggerCelebration('streakMilestone');
  };

  return (
    <>
      {activeBurst && (
        <ConfettiSystem
          burstType={activeBurst}
          shouldReduceMotion={false}
          isDarkMode={useThemeColors().isDark}
          {...config}
        />
      )}
      <Button onPress={handleHabitComplete}>Complete Habit</Button>
    </>
  );
}
```

### Auto-Determine Burst Type

```tsx
import { useCelebration, determineBurstType } from '@/components/CelebrationSystem';

function HabitCard({ habit, streak, strength }) {
  const { triggerCelebration, activeBurst, config } = useCelebration({
    soundEnabled: true,
    hapticsEnabled: true,
  });

  const handleComplete = () => {
    const burstType = determineBurstType({
      streak,
      strength,
      chainCount: 5,
    });
    triggerCelebration(burstType);
  };

  return (
    <>
      {activeBurst && (
        <ConfettiSystem
          burstType={activeBurst}
          shouldReduceMotion={false}
          isDarkMode={useThemeColors().isDark}
          {...config}
        />
      )}
      <Button onPress={handleComplete}>Complete</Button>
    </>
  );
}
```

### Integrating with Existing Habit Cards

Use the enhanced celebration animation to integrate with existing habit card animations:

```tsx
import { createEnhancedCelebrationTrigger } from '@/components/HabitCard/animations/celebrationAnimationEnhanced';
import { useCelebration } from '@/components/CelebrationSystem';

function HabitCard() {
  const { triggerCelebration } = useCelebration();

  const celebrationTrigger = createEnhancedCelebrationTrigger({
    cardScale,
    checkmarkScale,
    checkmarkRotate,
    rippleScale,
    rippleOpacity,
    reduceMotion,
    setShowFloatingXP,
    setXPPosition,
    setShowConfetti,
    timeoutRef,
    burstType: 'streakMilestone',
    triggerEnhancedCelebration: triggerCelebration,
  });

  // Use celebrationTrigger in your gesture handler
}
```

## API Reference

### ConfettiSystem Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `burstType` | `BurstType` | required | Type of celebration burst |
| `shouldReduceMotion` | `boolean` | required | Whether reduced motion is preferred |
| `isDarkMode` | `boolean` | required | Whether dark mode is active |
| `dimensions` | `{ width, height }` | Screen dimensions | Screen dimensions for particle positioning |
| `soundEnabled` | `boolean` | `false` | Whether sound effects are enabled |
| `hapticsEnabled` | `boolean` | `true` | Whether haptic feedback is enabled |
| `origin` | `{ x, y }` | Center of screen | Origin point for burst |

### useCelebration Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `shouldReduceMotion` | `boolean` | `false` | Whether reduced motion is preferred |
| `isDarkMode` | `boolean` | `false` | Whether dark mode is active |
| `soundEnabled` | `boolean` | `false` | Whether sound effects are enabled |
| `hapticsEnabled` | `boolean` | `true` | Whether haptic feedback is enabled |
| `origin` | `{ x, y }` | undefined | Origin point for celebrations |

### useCelebration Return Values

| Property | Type | Description |
|----------|------|-------------|
| `activeBurst` | `BurstType \| null` | Currently active burst type |
| `celebrationKey` | `number` | Unique key for forcing re-renders |
| `triggerCelebration` | `(type: BurstType) => void` | Trigger a celebration |
| `clearCelebration` | `() => void` | Clear the active celebration |
| `triggerAutoClear` | `(duration?: number) => void` | Trigger celebration and auto-clear |
| `config` | `object` | Config object for ConfettiSystem |

## Burst Types

### default

- **Particles**: 15
- **Duration**: 1500ms
- **Colors**: Green tones
- **Haptic**: Light tap
- **Sound**: Pop

### chainCompletion

- **Particles**: 25
- **Duration**: 2000ms
- **Colors**: Green with upward emphasis
- **Physics**: Lighter gravity, slight upward wind
- **Haptic**: Success
- **Sound**: Pop

### streakMilestone

- **Particles**: 40
- **Duration**: 2500ms
- **Colors**: Gold/amber tones
- **Physics**: Higher gravity, noticeable wind
- **Haptic**: Double medium tap
- **Sound**: Chime

### levelUp

- **Particles**: 35
- **Duration**: 2200ms
- **Colors**: Purple/violet tones
- **Physics**: Explosive velocity, rotation
- **Haptic**: Celebration sequence
- **Sound**: Success

### perfectWeek

- **Particles**: 50
- **Duration**: 3000ms
- **Colors**: Full rainbow
- **Physics**: Gentle float, minimal wind
- **Haptic**: Major celebration sequence
- **Sound**: Success

## Milestone Thresholds

### Streak Milestones

7, 14, 21, 30, 50, 60, 90, 100, 365 days

### Strength Levels

20%, 40%, 60%, 80% completion rate

## Design System Integration

The celebration system follows the app's design system:

- **Spring physics**: Damping 15-32, Stiffness 150-300
- **Animation duration**: 1500-3000ms (varies by burst type)
- **Colors**: Uses theme-aware palettes from `src/theme/colors/`
- **Typography**: Confetti is visual only (no text)

## Accessibility

- Reduced motion support: Returns null when `shouldReduceMotion` is true
- Haptic feedback respects user preferences
- Sound effects are opt-in (disabled by default)
- Colors maintain WCAG AA contrast ratios in both light and dark modes

## Performance

- Uses `requestAnimationFrame` for smooth 60fps animations
- Particles are automatically removed when they expire
- Uses `memo` for individual particle components to prevent unnecessary re-renders
- Physics calculations run on the JavaScript thread (optimized with delta time)

## Migration Guide

### From Old Confetti System

If you're migrating from the old confetti system:

1. Replace imports:
   ```tsx
   - import { Confetti } from './HabitsEmptyStateMinimal/Confetti';
   + import { ConfettiSystem } from '@/components/CelebrationSystem';
   ```

2. Update props:
   ```tsx
   - <Confetti shouldReduceMotion={false} />
   + <ConfettiSystem
   +   burstType="default"
   +   shouldReduceMotion={false}
   +   isDarkMode={isDark}
   +   soundEnabled={true}
   +   hapticsEnabled={true}
   + />
   ```

3. Add celebration hook:
   ```tsx
   + const { triggerCelebration, activeBurst, config } = useCelebration({
   +   soundEnabled: true,
   +   hapticsEnabled: true,
   + });
   +
   + const handleComplete = () => {
   +   triggerCelebration('default');
   + };
   ```

The old confetti system remains in `src/features/habits/components/HabitsEmptyStateMinimal/` and can be used for backward compatibility.
