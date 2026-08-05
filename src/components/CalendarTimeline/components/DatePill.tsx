import React from 'react';
import { View, Text } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useDerivedValue,
  withTiming,
} from 'react-native-reanimated';
import { ChevronDown } from 'lucide-react-native';
import { iconSizes } from '@/theme/iconSizes';
import { shadows } from '@/theme/spacing';

import { AnimatedPressable } from '../../ui/AnimatedPressable';
import { colors as palette } from '../../../theme/colors';
import { useThemeColors } from '../../../theme/ThemeContext';
import { getDatePillColors } from '../theme';
import { CalendarGlyph } from './CalendarGlyph';
import { PRESS } from './WeekNavRow.constants';
import { s } from './WeekNavRow.styles';

const CHEVRON_TIMING = { duration: 200 };

/** Soft green glow while the mini-calendar is open. */
const OPEN_SHADOW = {
  elevation: 3,
  shadowColor: palette.primary[600],
  shadowOffset: { height: 2, width: 0 },
  shadowOpacity: 0.3,
  shadowRadius: 8,
} as const;

interface DatePillProps {
  monthName: string;
  dateSuffix: string;
  isCalendarOpen?: boolean;
  todayDayNumber?: string;
  onDateRangePress?: () => void;
}

/**
 * Date-navigator pill — calendar glyph (today's day number inside it when
 * today is in view), "Month Year" label (or the past-week range), and a
 * green caret. Rest keeps the warm tint; while the mini-calendar is open
 * the pill floods solid green with a flipped caret.
 */
export function DatePill({
  monthName,
  dateSuffix,
  isCalendarOpen = false,
  todayDayNumber,
  onDateRangePress,
}: DatePillProps) {
  const { isDark } = useThemeColors();
  const pillColors = getDatePillColors(isDark, isCalendarOpen);
  const dateLabel = `${monthName} ${dateSuffix}`;

  const chevronProgress = useDerivedValue(
    () => withTiming(isCalendarOpen ? 1 : 0, CHEVRON_TIMING),
    [isCalendarOpen]
  );
  const chevronStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${chevronProgress.value * 180}deg` }],
  }));

  return (
    <AnimatedPressable
      accessibilityHint={
        isCalendarOpen
          ? 'Tap to close the calendar'
          : 'Opens a calendar to jump to any date'
      }
      accessibilityLabel={dateLabel}
      accessibilityRole='button'
      accessibilityState={{ expanded: isCalendarOpen }}
      animationConfig={PRESS.date}
      onPress={onDateRangePress}
    >
      <View
        style={[
          s.pill,
          {
            backgroundColor: pillColors.background,
            borderColor: pillColors.border,
          },
          isCalendarOpen ? OPEN_SHADOW : shadows.subtle,
        ]}
      >
        <CalendarGlyph
          color={pillColors.icon}
          dayNumber={todayDayNumber}
          size={iconSizes.small}
        />
        <Text style={[s.monthText, { color: pillColors.month }]}>
          {monthName}
        </Text>
        <Text style={[s.dateText, { color: pillColors.date }]}>
          {dateSuffix}
        </Text>
        <Animated.View style={chevronStyle}>
          <ChevronDown
            color={pillColors.chevron}
            size={iconSizes.micro}
            strokeWidth={2.4}
          />
        </Animated.View>
      </View>
    </AnimatedPressable>
  );
}
