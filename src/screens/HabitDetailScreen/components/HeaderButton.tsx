/** HeaderButton - Animated button with scale + haptic feedback */
import { triggerHaptic } from '@/utils/haptics';
import React from 'react';
import { Pressable } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { buttonShadow } from './DetailHeader.constants';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface HeaderButtonProps {
  onPress: () => void;
  icon: React.ReactNode;
  label: string;
}

export function HeaderButton({ onPress, icon, label }: HeaderButtonProps) {
  const scale = useSharedValue(1);
  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePress = () => {
    triggerHaptic('tap');
    onPress();
  };

  return (
    <AnimatedPressable
      accessibilityLabel={label}
      accessibilityRole='button'
      className='h-11 w-11 items-center justify-center rounded-full bg-white/90 active:bg-stone-100'
      style={[buttonShadow, animStyle]}
      onPress={handlePress}
      onPressIn={() => {
        scale.value = withSpring(0.92, { damping: 18, stiffness: 240 });
      }}
      onPressOut={() => {
        scale.value = withSpring(1, { damping: 18, stiffness: 240 });
      }}
    >
      {icon}
    </AnimatedPressable>
  );
}
