import React from 'react';
import { View, Text } from 'react-native';

import {
  FUTURE_DATE_TEXT_COLOR,
  TODAY_HIGHLIGHT,
  TODAY_SHADOW,
} from '../CalendarTimeline.styles';
import type {
  CalendarColors,
  CompletionStatus,
} from '../CalendarTimeline.types';

import { CompletionDot } from './CompletionDot';

interface DayCellContentProps {
  weekday: string;
  dayNumber: string;
  isCurrentDay: boolean;
  isUpcoming: boolean;
  completionStatus: CompletionStatus;
  hasCompletionData: boolean;
  colors: CalendarColors & {
    borderWidth?: number;
    highContrastBorder?: string;
  };
  reduceMotion: boolean;
  pressed?: boolean;
}

/** The visual content of a day cell (weekday, number, completion dot) */
export const DayCellContent: React.FC<DayCellContentProps> = ({
  weekday,
  dayNumber,
  isCurrentDay,
  isUpcoming,
  completionStatus,
  hasCompletionData,
  colors,
  reduceMotion,
  pressed = false,
}) => (
  <>
    <Text
      className='text-center text-[13px] font-normal leading-[18px]'
      style={{ color: colors.secondaryText }}
    >
      {weekday}
    </Text>

    <View
      className='h-9 w-9 items-center justify-center rounded-xl'
      style={{
        backgroundColor: isCurrentDay
          ? TODAY_HIGHLIGHT.background
          : colors.dayBackground,
        borderColor: isCurrentDay
          ? TODAY_HIGHLIGHT.border
          : (colors.highContrastBorder ?? 'transparent'),
        borderWidth: isCurrentDay ? 2 : (colors.borderWidth ?? 0),
        ...(isCurrentDay && TODAY_SHADOW),
        ...(pressed && !reduceMotion && { transform: [{ scale: 0.95 }] }),
        ...(pressed && { opacity: 0.7 }),
      }}
    >
      <Text
        className='text-center text-[17px] leading-[22px]'
        style={{
          color: isCurrentDay
            ? TODAY_HIGHLIGHT.text
            : isUpcoming
              ? FUTURE_DATE_TEXT_COLOR
              : colors.dayText,
          fontWeight: isCurrentDay ? '700' : '600',
        }}
      >
        {dayNumber}
      </Text>
    </View>

    {hasCompletionData && (
      <View className='mt-1 h-2 items-center justify-center'>
        <CompletionDot
          isToday={isCurrentDay}
          reduceMotion={reduceMotion}
          status={completionStatus}
        />
      </View>
    )}
  </>
);
