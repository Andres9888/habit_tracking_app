import React from 'react';
import { View, Text } from 'react-native';
import { format } from 'date-fns';

import { colors as palette } from '../../../theme/colors';
import { useThemeColors } from '../../../theme/ThemeContext';
import { fontFamilies } from '../../../theme/typography';
import { useStreakGreeting } from '../hooks/useStreakGreeting';
import { ProgressText } from './ProgressText';
import { WeekNavRow } from './WeekNavRow';

interface ProgressGreetingProps {
  completedToday: number;
  totalHabits: number;
  currentStreak?: number;
  currentDate: Date;
  dateRangeText: string;
  isViewingPast: boolean;
  onJumpToToday?: () => void;
  onDateRangePress?: () => void;
}

const GREETING_BASE = {
  fontFamily: fontFamilies.primary.text,
  fontSize: 16,
  fontWeight: '600' as const,
  letterSpacing: -0.3,
};

const ROW_STYLE = {
  flexDirection: 'row' as const,
  justifyContent: 'space-between' as const,
  alignItems: 'baseline' as const,
};

const GREETING_ROW = {
  flexDirection: 'row' as const,
  alignItems: 'center' as const,
};

/** Greeting row: streak-aware greeting left + badge · "3 of 5" right · date chip below */
export const ProgressGreeting: React.FC<ProgressGreetingProps> = ({
  completedToday,
  totalHabits,
  currentStreak = 0,
  currentDate,
  dateRangeText,
  isViewingPast,
  onJumpToToday,
  onDateRangePress,
}) => {
  const { colors, isDark } = useThemeColors();
  const { greeting } = useStreakGreeting(
    currentStreak,
    completedToday,
    totalHabits
  );
  const dateText = format(currentDate, 'EEE, MMMM d');
  const isAllDone = completedToday >= totalHabits && totalHabits > 0;

  const greetingColor = isAllDone
    ? colors.primary[600]
    : currentStreak > 0
      ? palette.streak[isDark ? 300 : 700]
      : colors.text.primary;

  return (
    <View>
      <View style={ROW_STYLE}>
        <View style={GREETING_ROW}>
          {greeting !== '' && (
            <Text style={[GREETING_BASE, { color: greetingColor }]}>
              {greeting}
            </Text>
          )}
        </View>
        <ProgressText completed={completedToday} total={totalHabits} />
      </View>

      <WeekNavRow
        dateLabel={isViewingPast ? dateRangeText : dateText}
        isViewingPast={isViewingPast}
        onDateRangePress={onDateRangePress}
        onJumpToToday={onJumpToToday}
      />
    </View>
  );
};
