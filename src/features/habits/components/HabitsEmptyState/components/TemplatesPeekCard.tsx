import clsx from 'clsx';
import { Pressable, Text, View } from 'react-native';
import Animated, {
  FadeInDown,
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

import { useHapticFeedback } from '../../../../../hooks/useHapticFeedback';
import { BASE_CARD_CLASS } from '../HabitsEmptyState.constants';
import type { TemplatesPeekCardProps } from '../HabitsEmptyState.types';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function TemplatesPeekCard({ onPress }: TemplatesPeekCardProps) {
  const pressScale = useSharedValue(1);
  const bgProgress = useSharedValue(0);
  const { triggerLightImpact, triggerSelection } = useHapticFeedback();

  const animatedStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      bgProgress.value,
      [0, 1],
      ['#ffffff', '#fafaf9']
    ),
    transform: [{ scale: pressScale.value }],
  }));

  return (
    <AnimatedPressable
      accessibilityHint='Preview expert-designed habit journeys'
      accessibilityLabel='Import habits'
      accessibilityRole='button'
      className={clsx(BASE_CARD_CLASS, 'gap-4')}
      entering={FadeInDown.delay(80).springify().damping(18)}
      style={[
        animatedStyle,
        {
          elevation: 4,
          shadowColor: '#10b981',
          shadowOffset: { height: 6, width: 0 },
          shadowOpacity: 0.15,
          shadowRadius: 16,
        },
      ]}
      onPress={() => {
        triggerSelection();
        onPress();
      }}
      onPressIn={() => {
        triggerLightImpact();
        pressScale.value = withSpring(0.97, { damping: 18, stiffness: 260 });
        bgProgress.value = withTiming(1, { duration: 100 });
      }}
      onPressOut={() => {
        pressScale.value = withSpring(1, { damping: 18, stiffness: 260 });
        bgProgress.value = withTiming(0, { duration: 150 });
      }}
    >
      <View className='self-start rounded-full bg-emerald-100 px-3 py-1'>
        <View className='flex-row items-center gap-1'>
          <Text className='text-[13px] font-bold tracking-wide text-emerald-700'>
            ⭐ POPULAR
          </Text>
        </View>
      </View>
      <View className='gap-1.5'>
        <View className='flex-row items-center gap-2'>
          <Text className='text-lg'>🧪</Text>
          <Text className='text-lg font-bold text-stone-800'>
            Import science-backed habits
          </Text>
        </View>
        <Text className='text-sm leading-5 text-stone-500'>
          Ready-made routines designed by habit researchers
        </Text>
      </View>
      <View
        className='rounded-xl px-6 py-3.5'
        style={{
          backgroundColor: '#10b981',
          elevation: 4,
          shadowColor: '#1c1917',
          shadowOffset: { height: 4, width: 0 },
          shadowOpacity: 0.08,
          shadowRadius: 16,
        }}
      >
        <Text className='text-center text-[17px] font-semibold tracking-wide text-white'>
          Get started →
        </Text>
      </View>
    </AnimatedPressable>
  );
}
