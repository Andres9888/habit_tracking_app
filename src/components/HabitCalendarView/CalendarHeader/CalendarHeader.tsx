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
    <View className='flex-row items-center justify-between px-2'>
      <Pressable className='rounded-xl bg-slate-50 p-2' onPress={onPrevious}>
        <ChevronLeft color='#64748b' size={20} />
      </Pressable>

      <Pressable className='px-4 py-2' onPress={onToday}>
        <Text className='text-base font-semibold tracking-tight text-slate-900'>
          {format(currentMonth, 'MMMM yyyy')}
        </Text>
      </Pressable>

      <Pressable className='rounded-xl bg-slate-50 p-2' onPress={onNext}>
        <ChevronRight color='#64748b' size={20} />
      </Pressable>
    </View>
  );
}
