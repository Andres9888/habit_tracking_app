import { Pressable, Text, View } from 'react-native';
import { X } from 'lucide-react-native';
import { iconSizes } from '@/theme/iconSizes';
import { useThemeColors } from '@/theme/ThemeContext';

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
  const { colors } = useThemeColors();

  return (
    <View className='flex-row items-center justify-between px-5 pb-4'>
      <View className='flex-1'>
        <Text className='text-base font-bold' style={{ color: colors.text.primary }}>
          {displayDate}
        </Text>
        {isToday ? <Text className='text-sm font-medium' style={{ color: colors.status.warning }}>Today</Text> : null}
        {totalCount > 0 ? <Text className='mt-0.5 text-sm font-normal' style={{ color: colors.text.secondary }}>
            {completedCount} of {totalCount} completed
          </Text> : null}
      </View>
      <Pressable
        accessibilityHint='Close habit list'
        accessibilityLabel='Close'
        accessibilityRole='button'
        className='h-10 w-10 items-center justify-center rounded-full'
        style={{ backgroundColor: colors.background }}
        onPress={onDonePress}
      >
        <X color={colors.text.secondary} size={iconSizes.large} />
      </Pressable>
    </View>
  );
}
