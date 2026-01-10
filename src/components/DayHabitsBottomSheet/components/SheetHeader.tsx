import { Pressable, Text, View } from 'react-native';

interface SheetHeaderProps {
  displayDate: string;
  isToday: boolean;
  completedCount: number;
  totalCount: number;
  onDonePress: () => void;
}

/**
 * Header component for DayHabitsBottomSheet
 * Shows date, completion count, and Done button
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
        accessibilityLabel='Done'
        accessibilityRole='button'
        className='rounded-lg px-3 py-1.5 active:bg-stone-100'
        onPress={onDonePress}
      >
        <Text className='text-[14px] font-semibold text-amber-600'>Done</Text>
      </Pressable>
    </View>
  );
}
