import { format } from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react-native';
import { Pressable, Text, View } from 'react-native';

interface CalendarHeaderProps {
  currentMonth: Date;
  onPrevious: () => void;
  onNext: () => void;
  onToday: () => void;
}

export function CalendarHeader({
  currentMonth,
  onPrevious,
  onNext,
  onToday,
}: CalendarHeaderProps) {
  return (
    <View className='flex-row items-center justify-between'>
      <Text className='text-lg font-bold text-stone-900'>
        {format(currentMonth, 'MMMM yyyy')}
      </Text>

      <View className='flex-row items-center gap-1.5'>
        <Pressable
          accessibilityLabel='Jump to the current month'
          accessibilityRole='button'
          className='rounded-full border border-stone-200 px-3 py-1'
          onPress={onToday}
        >
          <Text className='text-xs font-semibold uppercase tracking-wide text-stone-600'>
            Today
          </Text>
        </Pressable>

        <Pressable
          accessibilityLabel='View previous month'
          accessibilityRole='button'
          className='h-11 w-11 items-center justify-center rounded-full'
          onPress={onPrevious}
        >
          <ChevronLeft color='#57534e' size={22} />
        </Pressable>

        <Pressable
          accessibilityLabel='View next month'
          accessibilityRole='button'
          className='h-11 w-11 items-center justify-center rounded-full'
          onPress={onNext}
        >
          <ChevronRight color='#57534e' size={22} />
        </Pressable>
      </View>
    </View>
  );
}
