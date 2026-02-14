import { Plus } from 'lucide-react-native';
import { Pressable, View } from 'react-native';
import Animated from 'react-native-reanimated';
import { useFocusRing } from '../../../../utils/accessibility';
import { useFABAnimations } from './useFABAnimations';
import { useFABHandlers } from './useFABHandlers';
import type { FloatingActionButtonProps } from './types';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function FloatingActionButton({
  openCreateHabitScreen,
  celebrationsEnabled = true,
  reduceMotionPreference = false,
}: FloatingActionButtonProps) {
  const {
    pressScale,
    rippleOpacity,
    rippleScale,
    fabAnimatedStyle,
    rippleAnimatedStyle,
  } = useFABAnimations(celebrationsEnabled, reduceMotionPreference);
  const { focusStyle, focusHandlers } = useFocusRing();

  const { handlePress } = useFABHandlers({
    celebrationsEnabled,
    openCreateHabitScreen,
    pressScale,
    reduceMotionPreference,
    rippleOpacity,
    rippleScale,
  });

  return (
    <AnimatedPressable
      accessibilityHint='Open create habit modal'
      accessibilityLabel='Add habit'
      accessibilityRole='button'
      className='h-14 w-14 items-center justify-center rounded-full bg-[#059669] shadow-lg'
      {...focusHandlers}
      style={[fabAnimatedStyle, focusStyle]}
      onPress={handlePress}
    >
      <Animated.View
        className='absolute h-14 w-14 rounded-full'
        pointerEvents='none'
        style={[
          { backgroundColor: 'rgba(5,150,105,0.28)' },
          rippleAnimatedStyle,
        ]}
      />
      <Plus color='#ffffff' size={24} strokeWidth={2.5} />
    </AnimatedPressable>
  );
}

export default FloatingActionButton;
