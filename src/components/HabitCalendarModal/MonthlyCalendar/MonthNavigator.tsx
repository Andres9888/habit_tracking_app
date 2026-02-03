import { View, Text, Pressable } from 'react-native';
import { ChevronLeft, ChevronRight } from 'lucide-react-native';
import { format } from 'date-fns';

interface MonthNavigatorProps {
  currentDate: Date;
  onPreviousMonth: () => void;
  onNextMonth: () => void;
}

export function MonthNavigator({
  currentDate,
  onPreviousMonth,
  onNextMonth,
}: MonthNavigatorProps) {
  return (
    <View className='mb-4 flex-row items-center justify-between'>
      <Text className='text-lg font-bold text-stone-900'>
        {format(currentDate, 'MMMM yyyy')}
      </Text>

      <View className='flex-row gap-2'>
        <Pressable
          accessibilityLabel='Previous month'
          accessibilityRole='button'
          className='h-8 w-8 items-center justify-center rounded-full active:bg-stone-100'
          onPress={onPreviousMonth}
        >
          <ChevronLeft color='#1c1917' size={20} />
        </Pressable>

        <Pressable
          accessibilityLabel='Next month'
          accessibilityRole='button'
          className='h-8 w-8 items-center justify-center rounded-full active:bg-stone-100'
          onPress={onNextMonth}
        >
          <ChevronRight color='#1c1917' size={20} />
        </Pressable>
      </View>
    </View>
  );
}
