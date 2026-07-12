import React from 'react';
import { Text } from 'react-native';
import Animated from 'react-native-reanimated';

import type {
  CalendarColors,
  CompletionStatus,
} from '../CalendarTimeline.types';
import { useThemeColors } from '../../../theme/ThemeContext';
import { fontFamilies } from '../../../theme/typography';
import { useTodayGlow } from '../hooks/useTodayGlow';

import { DayCellRing } from './DayCellRing';
import { useDayCellEntrance } from './useDayCellEntrance';

interface DayCellContentProps {
  weekday: string;
  dayNumber: string;
  index: number;
  isCurrentDay: boolean;
  isUpcoming: boolean;
  completionStatus: CompletionStatus;
  completed: number;
  total: number;
  hasCompletionData: boolean;
  colors: CalendarColors;
  completionIcon?: 'chain' | 'checkbox';
  monthPrefix?: string;
  reduceMotion: boolean;
  pressed?: boolean;
  strengthPercent?: number;
}

/** The visual content of a day cell — weekday label + SVG progress ring */
const DayCellContentComponent: React.FC<DayCellContentProps> = ({
  weekday,
  dayNumber,
  index,
  isCurrentDay,
  isUpcoming,
  completionStatus,
  completed,
  total,
  hasCompletionData,
  colors,
  completionIcon,
  monthPrefix,
  reduceMotion,
  pressed = false,
  strengthPercent,
}) => {
  const { isDark } = useThemeColors();
  const todayGlowStyle = useTodayGlow({
    isCurrentDay,
    isComplete: completionStatus === 'complete',
    reduceMotion,
    isDark,
  });
  const entranceStyle = useDayCellEntrance(index, reduceMotion);

  return (
    <Animated.View style={entranceStyle}>
      <Text
        className='text-center text-[10px] leading-[14px]'
        style={{
          color: colors.secondaryText,
          fontFamily: fontFamilies.primary.text,
          fontWeight: isCurrentDay ? '700' : '500',
          letterSpacing: 0.5,
        }}
      >
        {isCurrentDay ? 'Today' : weekday.toUpperCase()}
      </Text>

      <Animated.View
        style={[
          todayGlowStyle,
          pressed && !reduceMotion && { transform: [{ scale: 0.95 }] },
          pressed && { opacity: reduceMotion ? 0.85 : 0.7 },
        ]}
      >
        <DayCellRing
          completed={completed}
          completionIcon={completionIcon}
          completionStatus={completionStatus}
          dayNumber={dayNumber}
          hasCompletionData={hasCompletionData}
          isCurrentDay={isCurrentDay}
          isDark={isDark}
          isUpcoming={isUpcoming}
          monthPrefix={monthPrefix}
          reduceMotion={reduceMotion}
          strengthPercent={strengthPercent}
          total={total}
        />
      </Animated.View>
    </Animated.View>
  );
};

export const DayCellContent = React.memo(DayCellContentComponent);
