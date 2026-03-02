import React from 'react';
import { View, Text } from 'react-native';
import Animated from 'react-native-reanimated';

import type {
  CalendarColors,
  CompletionStatus,
} from '../CalendarTimeline.types';
import { useThemeColors } from '../../../theme/ThemeContext';

import { CheckBadge } from './CheckBadge';
import { CompletionDot } from './CompletionDot';
import { getDayCellStyles } from './DayCellContent.helpers';
import { useTodayGlow } from '../hooks/useTodayGlow';

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
  const { isDark } = useThemeColors();
  const isComplete = completionStatus === 'complete';
  const cellStyles = getDayCellStyles({
    colors,
    isComplete,
    isCurrentDay,
    isDark,
    isUpcoming,
  });
  const glowStyle = useTodayGlow({ isCurrentDay, isComplete, reduceMotion, isDark });

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

      <Animated.View
        className='h-11 w-11 items-center justify-center rounded-xl'
        style={[
          cellStyles.container,
          glowStyle,
          pressed && !reduceMotion && { transform: [{ scale: 0.95 }] },
          pressed && { opacity: reduceMotion ? 0.85 : 0.7 },
        ]}
      >
        {isComplete && <CheckBadge reduceMotion={reduceMotion} />}
        <Text
          className='text-center text-[14px] leading-[18px]'
          style={{
            color: cellStyles.text,
            fontWeight: isComplete || isCurrentDay ? '700' : '600',
          }}
        >
          {dayNumber}
        </Text>
      </Animated.View>

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
