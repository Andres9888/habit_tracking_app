import { Plus } from 'lucide-react-native';
import { iconSizes } from '@/theme/iconSizes';
import { Animated, Pressable } from 'react-native';
import { colors } from '../../../../theme/colors';
import { shadows } from '../../../../theme/spacing';
import { useFocusRing } from '../../../../utils/accessibility';
import { useThemeColors } from '../../../../theme/ThemeContext';
import { useFABAnimations } from './useFABAnimations';
import { useFABHandlers } from './useFABHandlers';
import type { FloatingActionButtonProps } from './types';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
const RIPPLE_BG = `${colors.primary[600]}47`; // primary[600] at ~28% opacity

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
      testID='home-create-habit-fab'
      className='h-14 w-14 items-center justify-center rounded-full'
      {...focusHandlers}
      style={[{ backgroundColor: colors.primary[600] }, animatedStyle, focusStyle, shadows.floatingActionButton]}
      onPress={handlePress}
    >
      <Animated.View
        className='absolute h-14 w-14 rounded-full'
        pointerEvents='none'
        style={{
          backgroundColor: RIPPLE_BG,
          opacity: rippleOpacity,
          transform: [{ scale: rippleScale }],
        }}
      />
      <Plus color={themeColors.text.inverse} size={iconSizes.large} strokeWidth={2.5} />
    </AnimatedPressable>
  );
}

export default FloatingActionButton;
