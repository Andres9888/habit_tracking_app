import React from 'react';
import { View, Text } from 'react-native';
import { Calendar, ChevronDown } from 'lucide-react-native';
import { iconSizes } from '@/theme/iconSizes';

import { AnimatedPressable } from '../../ui/AnimatedPressable';
import { colors as palette } from '../../../theme/colors';
import { useThemeColors } from '../../../theme/ThemeContext';
import { getDatePillColors } from '../theme';
import { PRESS } from './WeekNavRow.constants';
import { s } from './WeekNavRow.styles';

interface DatePillProps {
  monthName: string;
  dateSuffix: string;
  onDateRangePress?: () => void;
}

/** Centered date pill that opens the calendar. */
export const DatePill: React.FC<DatePillProps> = ({
  monthName,
  dateSuffix,
  onDateRangePress,
}) => {
  const { colors, isDark } = useThemeColors();
  const dateLabel = `${monthName} ${dateSuffix}`;

  return (
    <AnimatedPressable
      accessibilityHint='Tap to open calendar'
      accessibilityLabel={dateLabel}
      accessibilityRole='button'
      animationConfig={PRESS.date}
      onPress={onDateRangePress}
    >
      <View style={[s.pill, getDatePillColors(isDark)]}>
        <Calendar
          color={isDark ? palette.primary[500] : palette.primary[600]}
          size={iconSizes.small}
          strokeWidth={2}
        />
        <Text
          style={[
            s.monthText,
            { color: isDark ? palette.primary[500] : palette.primary[700] },
          ]}
        >
          {monthName}
        </Text>
        <Text style={[s.dateText, { color: colors.text.secondary }]}>
          {dateSuffix}
        </Text>
        <ChevronDown
          color={colors.gray[300]}
          size={iconSizes.micro}
          strokeWidth={2}
        />
      </View>
    </AnimatedPressable>
  );
};
