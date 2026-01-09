import clsx from 'clsx';
import { Plus } from 'lucide-react-native';
import { Pressable, Text, View } from 'react-native';
import Animated, { FadeInDown, withSpring } from 'react-native-reanimated';

import { useHapticFeedback } from '../../../../../../hooks/useHapticFeedback';
import { BASE_CARD_CLASS } from '../../HabitsEmptyState.constants';
import type { CustomHabitCardProps } from '../../HabitsEmptyState.types';
import { useCustomHabitCardAnimations } from './useCustomHabitCardAnimations';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function CustomHabitCard({ onPress }: CustomHabitCardProps) {
  const { triggerSelection, triggerLightImpact } = useHapticFeedback();
  const { pressScale, animatedStyle, pulseStyle, glowStyle } =
    useCustomHabitCardAnimations();

  return (
    <AnimatedPressable
      accessibilityHint='Create a habit from scratch'
      accessibilityLabel='Create custom habit'
      accessibilityRole='button'
      className={clsx(
        BASE_CARD_CLASS,
        'flex-row items-center gap-4 border-violet-200 bg-white'
      )}
      entering={FadeInDown.delay(280).springify().damping(18)}
      style={[
        animatedStyle,
        {
          elevation: 4,
          shadowColor: '#7c3aed',
          shadowOffset: { height: 4, width: 0 },
          shadowOpacity: 0.12,
          shadowRadius: 12,
        },
      ]}
      onPress={() => {
        triggerSelection();
        onPress();
      }}
      onPressIn={() => {
        triggerLightImpact();
        pressScale.value = withSpring(0.97, { damping: 16, stiffness: 260 });
      }}
      onPressOut={() => {
        pressScale.value = withSpring(1, { damping: 16, stiffness: 260 });
      }}
    >
      <Animated.View
        className='h-14 w-14 items-center justify-center rounded-2xl'
        style={[
          pulseStyle,
          glowStyle,
          {
            backgroundColor: '#7c3aed',
            elevation: 8,
            shadowColor: '#7c3aed',
            shadowOffset: { height: 6, width: 0 },
            shadowOpacity: 0.4,
            shadowRadius: 12,
          },
        ]}
      >
        <Plus color='#ffffff' size={28} strokeWidth={2.8} />
      </Animated.View>
      <View className='flex-1 gap-1.5'>
        <Text className='text-[17px] font-semibold text-stone-800'>
          Build something just for you
        </Text>
        <Text className='text-[15px] leading-[20px] text-stone-600'>
          Name it, schedule it, make it yours.
        </Text>
        <View className='mt-0.5 flex-row items-center gap-2'>
          <Text className='text-[13px] font-semibold text-violet-600'>
            Start from scratch →
          </Text>
          <View className='rounded-full bg-violet-100 px-2 py-0.5'>
            <Text className='text-[10px] font-semibold text-violet-600'>
              ~30s
            </Text>
          </View>
        </View>
      </View>
    </AnimatedPressable>
  );
}
