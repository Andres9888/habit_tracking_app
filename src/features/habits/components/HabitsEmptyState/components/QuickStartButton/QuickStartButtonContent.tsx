import { Check } from 'lucide-react-native';
import { ActivityIndicator, Text, View } from 'react-native';
import Animated from 'react-native-reanimated';

import type { HabitSuggestion } from '../../HabitsEmptyState.types';

interface QuickStartButtonContentProps {
  habit: HabitSuggestion;
  isCreating: boolean;
  isSuccess: boolean;
  checkmarkStyle: object;
  contentStyle: object;
}

export function QuickStartButtonContent({
  habit,
  isCreating,
  isSuccess,
  checkmarkStyle,
  contentStyle,
}: QuickStartButtonContentProps) {
  if (isSuccess) {
    return (
      <Animated.View
        className='items-center justify-center'
        style={checkmarkStyle}
      >
        <View className='mb-1.5 h-9 w-9 items-center justify-center rounded-full bg-[#16a34a]'>
          <Check color='#ffffff' size={22} strokeWidth={2.8} />
        </View>
        <Text className='text-[10px] font-semibold text-[#15803d]'>Added!</Text>
      </Animated.View>
    );
  }

  if (isCreating) {
    return (
      <View className='items-center justify-center gap-1.5'>
        <ActivityIndicator color='#6d28d9' size='small' />
        <Text className='text-[10px] font-medium text-[#6d28d9]'>
          Creating...
        </Text>
      </View>
    );
  }

  return (
    <Animated.View className='items-center gap-2' style={contentStyle}>
      <Text className='text-[28px]'>{habit.emoji}</Text>
      <View className='items-center gap-0.5'>
        <Text className='text-center text-[13px] font-semibold text-stone-800'>
          {habit.name}
        </Text>
        <Text className='text-[10px] font-medium text-stone-500'>
          {habit.duration}
        </Text>
        {habit.timeHint && (
          <Text className='mt-0.5 text-[10px] font-medium text-amber-600'>
            {habit.timeHint}
          </Text>
        )}
      </View>
    </Animated.View>
  );
}
