/**
 * CTA Button - Primary action button for onboarding screens
 */

import { Pressable, Text, type ViewStyle } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { ONBOARDING_COLORS } from '../constants';

interface CTAButtonProps {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  style?: ViewStyle;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function CTAButton({ title, onPress, disabled, style }: CTAButtonProps) {
  const scale = useSharedValue(1);
  const translateY = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: scale.value },
      { translateY: translateY.value },
    ],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.98, { damping: 15, stiffness: 400 });
    translateY.value = withSpring(1, { damping: 15, stiffness: 400 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 400 });
    translateY.value = withSpring(0, { damping: 15, stiffness: 400 });
  };

  return (
    <AnimatedPressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled}
      style={[
        {
          paddingVertical: 18,
          paddingHorizontal: 32,
          borderRadius: 16,
          opacity: disabled ? 0.4 : 1,
        },
        animatedStyle,
        style,
      ]}
      className="items-center justify-center"
      accessibilityRole="button"
    >
      {/* Gradient background */}
      <Animated.View
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          borderRadius: 16,
          backgroundColor: ONBOARDING_COLORS.accent.primary,
        }}
      />
      {/* Secondary gradient overlay */}
      <Animated.View
        style={{
          position: 'absolute',
          top: 0,
          right: 0,
          width: '50%',
          bottom: 0,
          borderTopRightRadius: 16,
          borderBottomRightRadius: 16,
          backgroundColor: ONBOARDING_COLORS.accent.secondary,
          opacity: 0.6,
        }}
      />
      <Text
        className="text-[17px] font-semibold"
        style={{ color: ONBOARDING_COLORS.text.primary }}
      >
        {title}
      </Text>
    </AnimatedPressable>
  );
}
