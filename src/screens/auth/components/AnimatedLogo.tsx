import { useEffect } from 'react';
import { View, Text } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
} from 'react-native-reanimated';

interface AnimatedLogoProps {
  size?: number;
}

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
        style={[animatedStyle]}
        className="items-center justify-center rounded-3xl bg-gradient-to-br from-slate-700 to-slate-900 shadow-lg"
        // Using inline styles for size since it's dynamic
        // @ts-ignore - style prop
        // eslint-disable-next-line react-native/no-inline-styles
        style={[
          animatedStyle,
          {
            width: size,
            height: size,
            borderRadius: 24,
            backgroundColor: '#334155', // slate-700 fallback
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
