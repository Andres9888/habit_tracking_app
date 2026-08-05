import { useEffect } from 'react';
import { View } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
  useReducedMotion,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Link } from 'lucide-react-native';
import { durations } from '@/theme/animations';
import { colors } from '@/theme/colors';
import { borderRadius } from '@/theme/spacing';

/**
 * Props for the AnimatedLogo component
 */
interface AnimatedLogoProps {
  /** Size of the logo in pixels (width and height) */
  size?: number;
}

/**
 * AnimatedLogo - Breathing and floating logo animation for auth screens
 *
 * Features:
 * - Breathing animation (scale 1.0 → 1.05 → 1.0)
 * - Floating animation (translateY 0 → -6 → 0)
 * - 3-second infinite animation loop with ease-in-out timing
 * - Emerald gradient background (#059669 → #10b981 → #34d399)
 * - SVG checkmark icon centered
 * - Full accessibility support with reduceMotion
 *
 * @example
 * <AnimatedLogo size={80} />
 */
export function AnimatedLogo({ size = 80 }: AnimatedLogoProps) {
  const scale = useSharedValue(1);
  const translateY = useSharedValue(0);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    // Skip animations if user prefers reduced motion
    if (reduceMotion) {
      return;
    }

    // Start the breathing animation (3s duration, infinite loop)
    scale.value = withRepeat(
      withTiming(1.05, {
        duration: durations.breathing,
        easing: Easing.inOut(Easing.ease),
      }),
      -1, // Infinite repeats
      true // Reverse animation (yoyo effect)
    );

    // Start the floating animation (slightly offset from breathing)
    translateY.value = withRepeat(
      withTiming(-6, {
        duration: durations.drift,
        easing: Easing.inOut(Easing.ease),
      }),
      -1, // Infinite repeats
      true // Reverse animation (yoyo effect)
    );
  }, [reduceMotion, scale, translateY]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }, { translateY: translateY.value }],
    };
  });

  const iconSize = size * 0.5;

  return (
    <View
      accessible
      accessibilityLabel='Chain Day Logo'
      accessibilityRole='image'
      className='mb-4'
    >
      <Animated.View
        style={[
          animatedStyle,
          {
            borderRadius: borderRadius.card,
            elevation: 4,
            height: size,
            shadowColor: colors.gray[900],
            shadowOffset: { height: 4, width: 0 },
            shadowOpacity: 0.08,
            shadowRadius: 16,
            width: size,
          },
        ]}
      >
        <LinearGradient
          colors={[
            colors.primary[600],
            colors.primary[500],
            colors.primary[400],
          ]}
          end={{ x: 1, y: 1 }}
          start={{ x: 0, y: 0 }}
          style={{
            alignItems: 'center',
            borderRadius: borderRadius.card,
            height: size,
            justifyContent: 'center',
            width: size,
          }}
        >
          <Link color='white' size={iconSize} strokeWidth={2} />
        </LinearGradient>
      </Animated.View>
    </View>
  );
}
