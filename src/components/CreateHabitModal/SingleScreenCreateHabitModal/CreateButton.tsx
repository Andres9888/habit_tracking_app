/* eslint-disable max-lines-per-function */
import { memo, useCallback } from 'react';
import { Pressable, Text } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import useHapticFeedback from '../../../hooks/useHapticFeedback';
import { COLORS, DIMENSIONS, TYPOGRAPHY } from './constants';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface CreateButtonProps {
  disabled: boolean;
  onPress: () => void;
}

function CreateButtonComponent({ disabled, onPress }: CreateButtonProps) {
  const { triggerSuccess } = useHapticFeedback();
  const scale = useSharedValue(1);
  const backgroundColor = useSharedValue<string>(
    disabled ? COLORS.neutralBase : COLORS.accent
  );

  backgroundColor.value = withTiming(
    disabled ? COLORS.neutralBase : COLORS.accent,
    { duration: 200, easing: Easing.out(Easing.ease) }
  );

  const animatedStyle = useAnimatedStyle(() => ({
    backgroundColor: backgroundColor.value,
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = useCallback(() => {
    if (!disabled) {
      scale.value = withSpring(0.98, { damping: 15, stiffness: 300 });
    }
  }, [disabled, scale]);

  const handlePressOut = useCallback(() => {
    scale.value = withSpring(1, { damping: 15, stiffness: 300 });
  }, [scale]);

  const handlePress = useCallback(() => {
    if (!disabled) {
      triggerSuccess();
      scale.value = withSpring(0.95, { damping: 10, stiffness: 400 }, () => {
        scale.value = withSpring(1, { damping: 10, stiffness: 400 });
      });
      onPress();
    }
  }, [disabled, onPress, scale, triggerSuccess]);

  return (
    <AnimatedPressable
      accessibilityHint={
        disabled ? 'Enter a habit name first' : 'Creates the habit'
      }
      accessibilityLabel='Create Habit'
      accessibilityRole='button'
      accessibilityState={{ disabled }}
      className='items-center justify-center'
      style={[
        animatedStyle,
        {
          borderRadius: DIMENSIONS.borderRadius.button,
          height: DIMENSIONS.buttonHeight,
          marginHorizontal: 24,
        },
      ]}
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
    >
      <Text
        style={{
          color: disabled ? COLORS.mutedText : '#FFFFFF',
          fontSize: TYPOGRAPHY.body.fontSize,
          fontWeight: '500',
        }}
      >
        Create Habit
      </Text>
    </AnimatedPressable>
  );
}

export const CreateButton = memo(CreateButtonComponent);
