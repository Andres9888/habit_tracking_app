import { Pressable, Text, View } from 'react-native';
import { X } from 'lucide-react-native';

interface SheetHeaderProps {
  displayDate: string;
  isToday: boolean;
  completedCount: number;
  totalCount: number;
  onDonePress: () => void;
}

/**
 * Header component for DayHabitsBottomSheet
 * Shows date, completion count, and close button (top-right)
 */
export function SheetHeader({
  displayDate,
  isToday,
  completedCount,
  totalCount,
  onDonePress,
}: SheetHeaderProps) {
  return (
    <View className='flex-row items-center justify-between px-5 pb-4'>
      <View className='flex-1'>
        <Text className='text-[17px] font-bold text-stone-900'>
          {displayDate}
        </Text>
        {isToday && (
          <Text className='text-[13px] font-medium text-amber-600'>Today</Text>
        )}
        {totalCount > 0 && (
          <Text className='mt-0.5 text-[13px] font-normal text-stone-500'>
            {completedCount} of {totalCount} completed
          </Text>
        )}
      </View>
      <Pressable
        accessibilityHint='Close habit list'
        accessibilityLabel='Close'
        accessibilityRole='button'
        className='h-10 w-10 items-center justify-center rounded-full bg-stone-100 active:bg-stone-200'
        onPress={onDonePress}
      >
        <X className='text-stone-600' size={24} />
      </Pressable>
    </View>
  );
}
