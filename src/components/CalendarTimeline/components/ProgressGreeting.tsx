import React from 'react';
import { View, Text } from 'react-native';
import { format } from 'date-fns';

import { colors } from '../../../theme/colors';
import { fontFamilies } from '../../../theme/typography';
import { WeekNavRow } from './WeekNavRow';

interface ProgressGreetingProps {
  completedToday: number;
  totalHabits: number;
  currentDate: Date;
  dateRangeText: string;
  isViewingPast: boolean;
  canNavigateForward: boolean;
  onPreviousWeek?: () => void;
  onNextWeek?: () => void;
  onJumpToToday?: () => void;
  onDateRangePress?: () => void;
}

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

function getProgressText(completed: number, total: number) {
  if (total === 0) return null;
  if (completed >= total)
    return { text: 'All done!', color: colors.primary[600] };
  if (completed === 0)
    return { text: `${total} today`, color: colors.text.tertiary };
  return { text: `${completed} of ${total}`, color: colors.primary[600] };
}

const GREETING_STYLE = {
  fontFamily: fontFamilies.primary.text,
  fontSize: 16,
  fontWeight: '600' as const,
  color: colors.text.primary,
  letterSpacing: -0.3,
};
const PROGRESS_STYLE = {
  fontFamily: fontFamilies.primary.text,
  fontSize: 14,
  fontWeight: '600' as const,
  letterSpacing: -0.2,
};

/** Balanced greeting row: "Good morning" left · "3 of 5" right + nav row below */
export const ProgressGreeting: React.FC<ProgressGreetingProps> = ({
  completedToday,
  totalHabits,
  currentDate,
  dateRangeText,
  isViewingPast,
  canNavigateForward,
  onPreviousWeek,
  onNextWeek,
  onJumpToToday,
  onDateRangePress,
}) => {
  const progress = getProgressText(completedToday, totalHabits);
  const dateText = format(currentDate, 'EEE, MMMM d');

  return (
    <View>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'baseline',
        }}
      >
        <Text style={GREETING_STYLE}>{getGreeting()}</Text>
        {progress && (
          <Text style={{ ...PROGRESS_STYLE, color: progress.color }}>
            {progress.text}
          </Text>
        )}
      </View>

      <WeekNavRow
        canNavigateForward={canNavigateForward}
        dateLabel={isViewingPast ? dateRangeText : dateText}
        isViewingPast={isViewingPast}
        onDateRangePress={onDateRangePress}
        onJumpToToday={onJumpToToday}
        onNextWeek={onNextWeek}
        onPreviousWeek={onPreviousWeek}
      />
    </View>
  );
};
