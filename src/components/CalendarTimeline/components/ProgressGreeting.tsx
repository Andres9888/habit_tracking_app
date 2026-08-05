import React from 'react';
import { View, Text } from 'react-native';
import { format } from 'date-fns';

import { colors as palette } from '../../../theme/colors';
import { useThemeColors } from '../../../theme/ThemeContext';
import { fontWeights, typography } from '../../../theme/typography';
import { useStreakGreeting } from '../hooks/useStreakGreeting';
import type { StreakGreetingResult } from '../hooks/useStreakGreeting';
import { ProgressDots } from './ProgressDots';
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

const HERO_STYLE = {
  ...typography.heading3,
  fontWeight: fontWeights.bold,
  letterSpacing: -0.5,
};

const ROW = {
  flexDirection: 'row' as const,
  justifyContent: 'space-between' as const,
  alignItems: 'flex-start' as const,
};

const RIGHT_COL = { alignItems: 'flex-end' as const, paddingTop: 2 };

function getGreetingColor(
  { variant, badge }: StreakGreetingResult,
  isDark: boolean,
  colors: ReturnType<typeof useThemeColors>['colors']
): string {
  if (variant === 'risk') return palette.error;
  if (variant === 'success' || variant === 'almostDone')
    return colors.primary[600];
  return badge ? palette.streak[isDark ? 300 : 700] : colors.text.primary;
}

/** Hero greeting (left) + progress counter & dots (right) · date row below */
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
  const result = useStreakGreeting(currentStreak, completedToday, totalHabits);
  const heroColor = getGreetingColor(result, isDark, colors);
  const monthName = format(currentDate, 'MMMM');
  const dateSuffix = isViewingPast
    ? dateRangeText
    : format(currentDate, 'yyyy');
  const todayDayNumber = isViewingPast ? undefined : format(currentDate, 'd');

  return (
    <View>
      <View style={ROW}>
        <Text style={[HERO_STYLE, { color: heroColor }]}>
          {result.greeting}
        </Text>
        <View style={RIGHT_COL}>
          <ProgressText completed={completedToday} total={totalHabits} />
          <ProgressDots
            completed={completedToday}
            total={totalHabits}
            variant={result.variant}
          />
        </View>
      </View>

      <WeekNavRow
        dateSuffix={dateSuffix}
        isViewingPast={isViewingPast}
        monthName={monthName}
        todayDayNumber={todayDayNumber}
        onDateRangePress={onDateRangePress}
        onJumpToToday={onJumpToToday}
      />
    </View>
  );
};
