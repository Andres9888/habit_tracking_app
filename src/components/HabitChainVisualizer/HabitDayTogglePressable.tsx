import type { ReactNode } from 'react';
import { Animated, Pressable } from 'react-native';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface HabitDayTogglePressableProps {
  accessibilityHint: string | undefined;
  accessibilityLabel: string;
  borderRadius: number;
  children: ReactNode;
  combinedScale: ReturnType<typeof Animated.multiply>;
  disabled: boolean;
  onPress: () => void;
  onPressIn: () => void;
  onPressOut: () => void;
}

export function HabitDayTogglePressable({
  accessibilityHint,
  accessibilityLabel,
  borderRadius,
  children,
  combinedScale,
  disabled,
  onPress,
  onPressIn,
  onPressOut,
}: HabitDayTogglePressableProps) {
  return (
    <AnimatedPressable
      accessibilityHint={accessibilityHint}
      accessibilityLabel={accessibilityLabel}
      accessibilityRole='button'
      accessibilityState={{ disabled }}
      className='flex-1 items-center justify-center overflow-hidden'
      disabled={disabled}
      style={{
        borderRadius,
        opacity: disabled ? 0.5 : 1,
        transform: [{ scale: combinedScale }],
      }}
      onPress={onPress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
    >
      {children}
    </AnimatedPressable>
  );
}
