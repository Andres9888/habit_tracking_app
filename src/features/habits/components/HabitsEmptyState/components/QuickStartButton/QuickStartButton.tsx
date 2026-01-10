import { Pressable, View } from 'react-native';
import Animated, {
  FadeInDown,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

import { useHapticFeedback } from '../../../../../../hooks/useHapticFeedback';
import type { QuickStartButtonProps } from '../../HabitsEmptyState.types';
import { QuickStartButtonContent } from './QuickStartButtonContent';
import { useQuickStartAnimations } from './useQuickStartAnimations';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function QuickStartButton({
  habit,
  isCreating,
  isSuccess,
  onPress,
  containerStyle,
  index,
}: QuickStartButtonProps) {
  const { triggerLightImpact, triggerSelection } = useHapticFeedback();
  const {
    scale,
    rotation,
    bgProgress,
    animatedStyle,
    pulseRingStyle,
    checkmarkStyle,
    contentStyle,
  } = useQuickStartAnimations(index, isSuccess);

  const handlePress = async () => {
    triggerSelection();
    rotation.value = withSequence(
      withSpring(-3, { damping: 8, stiffness: 400 }),
      withSpring(3, { damping: 8, stiffness: 400 }),
      withSpring(0, { damping: 10, stiffness: 300 })
    );
    await onPress();
  };

  return (
    <View style={containerStyle}>
      <Animated.View
        className='absolute inset-[-2px] rounded-2xl border-2 border-emerald-500'
        pointerEvents='none'
        style={pulseRingStyle}
      />
      <AnimatedPressable
        accessibilityLabel={`Add ${habit.name} habit`}
        accessibilityRole='button'
        className='items-center justify-center gap-2 rounded-2xl border px-3 py-4 shadow-sm'
        disabled={isCreating || isSuccess}
        entering={FadeInDown.delay(200 + index * 100)
          .springify()
          .damping(12)
          .mass(0.8)
          .stiffness(100)}
        style={animatedStyle}
        onPress={handlePress}
        onPressIn={() => {
          triggerLightImpact();
          scale.value = withSpring(0.92, { damping: 12, stiffness: 400 });
          bgProgress.value = withTiming(1, { duration: 100 });
        }}
        onPressOut={() => {
          scale.value = withSpring(1, { damping: 12, stiffness: 300 });
          if (!isCreating) {
            bgProgress.value = withTiming(0, { duration: 150 });
          }
        }}
      >
        <QuickStartButtonContent
          checkmarkStyle={checkmarkStyle}
          contentStyle={contentStyle}
          habit={habit}
          isCreating={isCreating}
          isSuccess={isSuccess}
        />
      </AnimatedPressable>
    </View>
  );
}
