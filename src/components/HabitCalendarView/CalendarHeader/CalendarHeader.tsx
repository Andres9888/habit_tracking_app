import { format } from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react-native';
import { Pressable, Text, View } from 'react-native';
import { iconSizes } from '@/theme/iconSizes';
import { useThemeColors } from '../../../theme/ThemeContext';

interface CalendarHeaderProps {
  currentMonth: Date;
  onPrevious: () => void;
  onNext: () => void;
  onToday: () => void;
}

/**
 * CalendarHeader - Month navigation header for HabitCalendarView
 *
 * Features:
 * - Dark mode support via ThemeContext
 * - "Today" quick jump button
 * - Previous/Next month navigation
 * - Semantic color system for accessibility
 */
export function CalendarHeader({
  currentMonth,
  onPrevious,
  onNext,
  onToday,
}: CalendarHeaderProps) {
  const { colors } = useThemeColors();

  return (
    <View className='flex-row items-center justify-between'>
      <Text className='text-lg font-bold' style={{ color: colors.gray[900] }}>
        {format(currentMonth, 'MMMM yyyy')}
      </Text>

      <View className='flex-row items-center gap-1.5'>
        <Pressable
          accessibilityLabel='Jump to the current month'
          accessibilityRole='button'
          className='rounded-full border px-3 py-2'
          style={{ borderColor: colors.border }}
          hitSlop={{ bottom: 8, left: 8, right: 8, top: 8 }}
          onPress={onToday}
        >
          <Text
            className='text-xs font-semibold uppercase tracking-wide'
            style={{ color: colors.gray[600] }}
          >
            Today
          </Text>
        </Pressable>

        <Pressable
          accessibilityLabel='View previous month'
          accessibilityRole='button'
          className='h-11 w-11 items-center justify-center rounded-full'
          hitSlop={{ bottom: 8, left: 8, right: 8, top: 8 }}
          onPress={onPrevious}
        >
          <ChevronLeft color={colors.gray[600]} size={iconSizes.medium} />
        </Pressable>

        <Pressable
          accessibilityLabel='View next month'
          accessibilityRole='button'
          className='h-11 w-11 items-center justify-center rounded-full'
          hitSlop={{ bottom: 8, left: 8, right: 8, top: 8 }}
          onPress={onNext}
        >
          <ChevronRight color={colors.gray[600]} size={iconSizes.medium} />
        </Pressable>
      </View>
    </View>
  );
}
