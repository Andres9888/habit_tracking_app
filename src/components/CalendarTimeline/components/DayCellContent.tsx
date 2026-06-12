/* eslint-disable max-lines */
import React, { useEffect } from 'react';
import { Text } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';

import type {
  CalendarColors,
  CompletionStatus,
} from '../CalendarTimeline.types';
import { useThemeColors } from '../../../theme/ThemeContext';
import { durations } from '../../../theme/animations';
import { fontFamilies } from '../../../theme/typography';
import { useTodayGlow } from '../hooks/useTodayGlow';

import { DayCellRing } from './DayCellRing';

const ENTRANCE_DURATION = durations.enter;
const STAGGER_DELAY = durations.stagger;
const ENTRANCE_TRANSLATE_Y = 12;

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
export const DayCellContent: React.FC<DayCellContentProps> = ({
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

  const entranceOpacity = useSharedValue(reduceMotion ? 1 : 0);
  const entranceY = useSharedValue(reduceMotion ? 0 : ENTRANCE_TRANSLATE_Y);

  useEffect(() => {
    if (reduceMotion) return;
    const delay = index * STAGGER_DELAY;
    const timing = { duration: ENTRANCE_DURATION };
    entranceOpacity.value = withDelay(delay, withTiming(1, timing));
    entranceY.value = withDelay(delay, withTiming(0, timing));
  }, [index, reduceMotion, entranceOpacity, entranceY]);

  const entranceStyle = useAnimatedStyle(() => ({
    opacity: entranceOpacity.value,
    transform: [{ translateY: entranceY.value }],
  }));

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
