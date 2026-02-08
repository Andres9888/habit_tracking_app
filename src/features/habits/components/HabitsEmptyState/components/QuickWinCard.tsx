import clsx from 'clsx';
import { useState } from 'react';
import { Text, View } from 'react-native';
import Animated, {
  FadeInDown,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

import { AnimatedPressable } from '@/components/ui/AnimatedPressable';
import { useHapticFeedback } from '../../../../../hooks/useHapticFeedback';
import { ALL_HABITS, BASE_CARD_CLASS } from '../HabitsEmptyState.constants';
import { getPeriodLabel } from '../HabitsEmptyState.utils';
import type { QuickWinCardProps } from '../HabitsEmptyState.types';
import { QuickStartButton } from './QuickStartButton';

export function QuickWinCard({
  creatingHabit,
  successHabit,
  onQuickCreateHabit,
  timeContext,
}: QuickWinCardProps) {
  const [suggestions, setSuggestions] = useState(() => timeContext.habits);
  const [shuffleCount, setShuffleCount] = useState(0);
  const [isShuffled, setIsShuffled] = useState(false);
  const shuffleScale = useSharedValue(1);
  const { triggerSelection } = useHapticFeedback();

  const shuffleButtonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: shuffleScale.value }],
  }));

  const shuffleSuggestions = () => {
    triggerSelection();
    shuffleScale.value = withSequence(
      withTiming(0.85, { duration: 100 }),
      withSpring(1, { damping: 12 })
    );
    const shuffled = [...ALL_HABITS].sort(() => Math.random() - 0.5);
    setSuggestions(shuffled.slice(0, 4));
    setShuffleCount((c) => c + 1);
    setIsShuffled(true);
  };

  const periodLabel = getPeriodLabel(timeContext.period);

  return (
    <Animated.View
      className={clsx(BASE_CARD_CLASS)}
      entering={FadeInDown.delay(80).springify().damping(18)}
      style={{
        elevation: 4,
        shadowColor: '#1c1917',
        shadowOffset: { height: 4, width: 0 },
        shadowOpacity: 0.08,
        shadowRadius: 16,
      }}
    >
      <View className='mb-1 gap-2'>
        <Text className='text-[17px] font-semibold leading-[22px] text-stone-800'>
          Tap one you can do now
        </Text>
        <Text className='text-[17px] leading-[22px] text-stone-600'>
          Start small—you can always customize later.
        </Text>
        {!isShuffled && (
          <View className='mt-1 self-center rounded-full bg-amber-100/80 px-3 py-1.5'>
            <Text className='text-[13px] font-medium text-amber-700'>
              {periodLabel}
            </Text>
          </View>
        )}
      </View>
      <View className='mt-4 flex-row flex-wrap justify-between gap-y-3'>
        {suggestions.map((habit, index) => (
          <QuickStartButton
            key={`${shuffleCount}-${index}`}
            containerStyle={{ width: '48%' }}
            habit={habit}
            index={shuffleCount === 0 ? index : 0}
            isCreating={creatingHabit === habit.fullName}
            isSuccess={successHabit === habit.fullName}
            onPress={async () => onQuickCreateHabit(habit.fullName)}
          />
        ))}
      </View>
      <AnimatedPressable
        accessibilityLabel='Show different habit suggestions'
        className='mt-3 self-center rounded-full px-4 py-1.5 active:bg-amber-100/60'
        onPress={shuffleSuggestions}
      >
        <Animated.Text
          className='text-[13px] font-semibold text-amber-700'
          style={shuffleButtonStyle}
        >
          Show me different ideas ↻
        </Animated.Text>
      </AnimatedPressable>
    </Animated.View>
  );
}
