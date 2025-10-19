import { format } from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react-native';
import { View, Text, Pressable } from 'react-native';

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
      <Text className='text-lg font-bold text-slate-900'>
        {format(currentMonth, 'MMMM yyyy')}
      </Text>

      <View className='flex-row gap-2'>
        <Pressable className='h-8 w-8 items-center justify-center rounded-full' onPress={onPrevious}>
          <ChevronLeft color='#64748b' size={20} />
        </Pressable>

        <Pressable className='h-8 w-8 items-center justify-center rounded-full' onPress={onNext}>
          <ChevronRight color='#64748b' size={20} />
        </Pressable>
      </View>
    </View>
  );
}
