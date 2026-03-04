import React from 'react';
import { Text, View } from 'react-native';

import type {
  CalendarColors,
  CompletionStatus,
} from '../CalendarTimeline.types';
import { useThemeColors } from '../../../theme/ThemeContext';

import { DayCellRing } from './DayCellRing';

interface DayCellContentProps {
  weekday: string;
  dayNumber: string;
  isCurrentDay: boolean;
  isUpcoming: boolean;
  completionStatus: CompletionStatus;
  completed: number;
  total: number;
  hasCompletionData: boolean;
  colors: CalendarColors & {
    borderWidth?: number;
    highContrastBorder?: string;
  };
  reduceMotion: boolean;
  pressed?: boolean;
}

/** The visual content of a day cell — weekday label + SVG progress ring */
export const DayCellContent: React.FC<DayCellContentProps> = ({
  weekday,
  dayNumber,
  isCurrentDay,
  isUpcoming,
  completionStatus,
  completed,
  total,
  colors,
  reduceMotion,
  pressed = false,
}) => {
  const { isDark } = useThemeColors();

  return (
    <>
      <Text
        className='text-center text-[10px] leading-[14px]'
        style={{
          color: colors.secondaryText,
          fontWeight: isCurrentDay ? '700' : '400',
        }}
      >
        {weekday}
      </Text>

      <View
        style={[
          pressed && !reduceMotion && { transform: [{ scale: 0.95 }] },
          pressed && { opacity: reduceMotion ? 0.85 : 0.7 },
        ]}
      >
        <DayCellRing
          completed={completed}
          completionStatus={completionStatus}
          dayNumber={dayNumber}
          isCurrentDay={isCurrentDay}
          isDark={isDark}
          isUpcoming={isUpcoming}
          reduceMotion={reduceMotion}
          total={total}
        />
      </View>
    </>
  );
};
