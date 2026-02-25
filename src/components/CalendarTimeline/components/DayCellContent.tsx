import React from 'react';
import { View, Text } from 'react-native';

import type {
  CalendarColors,
  CompletionStatus,
} from '../CalendarTimeline.types';

import { CheckBadge } from './CheckBadge';
import { CompletionDot } from './CompletionDot';
import { getDayCellStyles } from './DayCellContent.helpers';

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
}) => {
  const isComplete = completionStatus === 'complete';
  const cellStyles = getDayCellStyles({
    colors,
    isComplete,
    isCurrentDay,
    isUpcoming,
  });

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
        className='h-10 w-10 items-center justify-center rounded-xl'
        style={{
          ...cellStyles.container,
          ...(pressed && !reduceMotion && { transform: [{ scale: 0.95 }] }),
          ...(pressed && { opacity: 0.7 }),
        }}
      >
        {isComplete && <CheckBadge reduceMotion={reduceMotion} />}
        <Text
          className='text-center text-[13px] leading-[18px]'
          style={{
            color: cellStyles.text,
            fontWeight: isComplete || isCurrentDay ? '700' : '600',
          }}
        >
          {dayNumber}
        </Text>
      </View>

      {/* Fixed-height spacer for completion indicator — prevents layout shift on week change */}
      <View className='mt-1 h-2 items-center justify-center'>
        {hasCompletionData && !isComplete && (
          <CompletionDot
            isToday={isCurrentDay}
            reduceMotion={reduceMotion}
            status={completionStatus}
          />
        )}
      </View>
    </>
  );
};
