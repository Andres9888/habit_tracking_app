import { Plus } from 'lucide-react-native';
import { Animated, Pressable } from 'react-native';
import { useFocusRing } from '../../../../utils/accessibility';
import { useThemeColors } from '../../../../theme/ThemeContext';
import { useFABAnimations } from './useFABAnimations';
import { useFABHandlers } from './useFABHandlers';
import type { FloatingActionButtonProps } from './types';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function FloatingActionButton({
  openCreateHabitScreen,
  celebrationsEnabled = true,
  reduceMotionPreference = false,
}: FloatingActionButtonProps) {
  const { colors: themeColors } = useThemeColors();
  const { bounce, pressScale, rippleOpacity, rippleScale } = useFABAnimations(
    celebrationsEnabled,
    reduceMotionPreference
  );
  const { focusStyle, focusHandlers } = useFocusRing();

  const { handlePress } = useFABHandlers({
    celebrationsEnabled,
    openCreateHabitScreen,
    pressScale,
    reduceMotionPreference,
    rippleOpacity,
    rippleScale,
  });

  const animatedStyle = {
    transform: [
      { scale: pressScale },
      {
        translateY: bounce.interpolate({
          inputRange: [0, 1],
          outputRange: [0, -6],
        }),
      },
    ],
  };

  return (
    <AnimatedPressable
      accessibilityHint='Open create habit modal'
      accessibilityLabel='Add habit'
      accessibilityRole='button'
      className='h-14 w-14 items-center justify-center rounded-full shadow-lg'
      // Use theme primary color instead of hardcoded #059669
      {...focusHandlers}
      style={[{ backgroundColor: themeColors.primary[600] }, animatedStyle, focusStyle]}
      onPress={handlePress}
    >
      <Animated.View
        className='absolute h-14 w-14 rounded-full'
        pointerEvents='none'
        style={{
          backgroundColor: 'rgba(59,130,246,0.28)',
          opacity: rippleOpacity,
          transform: [{ scale: rippleScale }],
        }}
      />
      <Plus color='#ffffff' size={24} strokeWidth={2.5} />
    </AnimatedPressable>
  );
}

export default FloatingActionButton;
