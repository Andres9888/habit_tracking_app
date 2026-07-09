import React from 'react';
import { View, Text } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useDerivedValue,
  withTiming,
} from 'react-native-reanimated';
import { Calendar, ChevronDown } from 'lucide-react-native';
import { iconSizes } from '@/theme/iconSizes';
import { shadows } from '@/theme/spacing';

import { AnimatedPressable } from '../../ui/AnimatedPressable';
import { fontWeights } from '../../../theme/typography';
import { useThemeColors } from '../../../theme/ThemeContext';
import { getDatePillColors } from '../theme';
import { PRESS } from './WeekNavRow.constants';
import { s } from './WeekNavRow.styles';

const CHEVRON_TIMING = { duration: 200 };

interface DatePillProps {
  monthName: string;
  dateSuffix: string;
  isCalendarOpen?: boolean;
  onDateRangePress?: () => void;
}

/**
 * Centered date pill that opens the calendar popup.
 *
 * Quiet-emphasis toggle styling: neutral hairline chip at rest; while the
 * calendar is open it earns the green (card fill, primary border, bold
 * month, flipped chevron) so open/closed states never read alike.
 */
export const DatePill: React.FC<DatePillProps> = ({
  monthName,
  dateSuffix,
  isCalendarOpen = false,
  onDateRangePress,
}) => {
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
        isCalendarOpen ? 'Tap to close calendar' : 'Tap to open calendar'
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
          isCalendarOpen ? shadows.subtle : null,
        ]}
      >
        <Calendar
          color={pillColors.icon}
          size={iconSizes.small}
          strokeWidth={2}
        />
        <Text
          style={[
            s.monthText,
            {
              color: pillColors.month,
              fontWeight: isCalendarOpen
                ? fontWeights.bold
                : fontWeights.medium,
            },
          ]}
        >
          {monthName}
        </Text>
        <Text style={[s.dateText, { color: pillColors.date }]}>
          {dateSuffix}
        </Text>
        <Animated.View style={chevronStyle}>
          <ChevronDown
            color={pillColors.chevron}
            size={iconSizes.micro}
            strokeWidth={2}
          />
        </Animated.View>
      </View>
    </AnimatedPressable>
  );
};
