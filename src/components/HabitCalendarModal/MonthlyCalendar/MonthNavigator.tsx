import { View, Text, Pressable } from 'react-native';
import { ChevronLeft, ChevronRight } from 'lucide-react-native';
import { format } from 'date-fns';
import { useThemeColors } from '../../../theme/ThemeContext';
import { iconSizes } from '@/theme/iconSizes';

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
  const { colors } = useThemeColors();

  return (
    <View className='mb-4 flex-row items-center justify-between'>
      <Text className='text-lg font-bold' style={{ color: colors.text.primary }}>
        {format(currentDate, 'MMMM yyyy')}
      </Text>

      <View className='flex-row gap-2'>
        <Pressable
          accessibilityLabel='Previous month'
          accessibilityRole='button'
          className='h-11 w-11 items-center justify-center rounded-full'
          hitSlop={{ bottom: 8, left: 8, right: 8, top: 8 }}
          onPress={onPreviousMonth}
        >
          <ChevronLeft color={colors.text.primary} size={iconSizes.medium} />
        </Pressable>

        <Pressable
          accessibilityLabel='Next month'
          accessibilityRole='button'
          className='h-11 w-11 items-center justify-center rounded-full'
          hitSlop={{ bottom: 8, left: 8, right: 8, top: 8 }}
          onPress={onNextMonth}
        >
          <ChevronRight color={colors.text.primary} size={iconSizes.medium} />
        </Pressable>
      </View>
    </View>
  );
}
