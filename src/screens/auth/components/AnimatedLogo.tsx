import { useEffect } from 'react';
import { View, Text } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
} from 'react-native-reanimated';

/**
 * Props for the AnimatedLogo component
 */
interface AnimatedLogoProps {
  /** Size of the logo in pixels (width and height) */
  size?: number;
}

/**
 * AnimatedLogo - Breathing logo animation for auth screens
 *
 * Features:
 * - Breathing animation (scale 1.0 → 1.05 → 1.0)
 * - 3-second infinite animation loop with ease-in-out timing
 * - Slate-700 background with shadow
 * - Checkmark icon centered
 * - Full accessibility support
 *
 * @example
 * <AnimatedLogo size={80} />
 */
export function AnimatedLogo({ size = 80 }: AnimatedLogoProps) {
  const scale = useSharedValue(1);

  useEffect(() => {
    // Start the breathing animation (3s duration, infinite loop)
    scale.value = withRepeat(
      withTiming(1.05, {
        duration: 1500,
        easing: Easing.inOut(Easing.ease),
      }),
      -1, // Infinite repeats
      true // Reverse animation (yoyo effect)
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  return (
    <View
      className="mb-4"
      accessible={true}
      accessibilityLabel="Habit Tracker Logo"
      accessibilityRole="image"
    >
      <Animated.View
        className="items-center justify-center rounded-3xl shadow-lg"
        style={[
          animatedStyle,
          {
            width: size,
            height: size,
            borderRadius: 24,
            backgroundColor: '#44403c', // stone-700
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 8,
            elevation: 8,
          },
        ]}
      >
        <Text className="text-5xl">✓</Text>
      </Animated.View>
    </View>
  );
}
