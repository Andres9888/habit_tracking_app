/* eslint-disable max-lines */
import React, { useEffect } from 'react';
import { View, Text } from 'react-native';
import Animated, {
  useAnimatedProps,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import Svg, { Circle } from 'react-native-svg';
import { Check, Link2 } from 'lucide-react-native';
import { iconSizes } from '@/theme/iconSizes';

import { springs, durations } from '../../../theme/animations';
import type { CompletionStatus } from '../CalendarTimeline.types';
import {
  CIRCUMFERENCE,
  COMPLETE_GLOW,
  MONTH_PREFIX_COLORS,
  RADIUS,
  RING_SIZE,
  STROKE_WIDTH,
  getRingColors,
  ringStyles as styles,
} from './DayCellRing.styles';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);
const HALF = RING_SIZE / 2;

interface DayCellRingProps {
  dayNumber: string;
  completed: number;
  total: number;
  completionStatus: CompletionStatus;
  hasCompletionData: boolean;
  isCurrentDay: boolean;
  isUpcoming: boolean;
  completionIcon?: 'chain' | 'checkbox';
  monthPrefix?: string;
  reduceMotion: boolean;
  isDark: boolean;
}

export const DayCellRing: React.FC<DayCellRingProps> = ({
  dayNumber,
  completed,
  total,
  completionStatus,
  completionIcon,
  hasCompletionData,
  isCurrentDay,
  isUpcoming,
  monthPrefix,
  reduceMotion,
  isDark,
}) => {
  const isComplete = completionStatus === 'complete';
  const progress = total > 0 ? completed / total : 0;
  const rc = getRingColors(isDark, isCurrentDay, completionStatus);
  const fillScale = useSharedValue(isComplete && !reduceMotion ? 0 : 1);
  const arcProgress = useSharedValue(reduceMotion ? progress : 0);

  useEffect(() => {
    if (reduceMotion) {
      fillScale.value = 1;
      arcProgress.value = progress;
      return;
    }
    if (isComplete) fillScale.value = withSpring(1, springs.gentle);
    arcProgress.value = withTiming(progress, { duration: durations.progress });
  }, [isComplete, progress, reduceMotion, fillScale, arcProgress]);

  const animatedArcProps = useAnimatedProps(() => ({
    strokeDashoffset: CIRCUMFERENCE * (1 - arcProgress.value),
  }));
  const fillStyle = useAnimatedStyle(() => ({
    transform: [{ scale: fillScale.value }],
  }));

  if (isComplete) {
    return (
      <Animated.View style={[styles.container, COMPLETE_GLOW, fillStyle]}>
        <View style={[styles.solidFill, { backgroundColor: rc.fill }]}>
          {completionIcon === 'chain' ? (
            <Link2 color={rc.checkIcon} size={iconSizes.medium} strokeWidth={2.5} />
          ) : (
            <Check color={rc.checkIcon} size={iconSizes.medium} strokeWidth={2.5} />
          )}
        </View>
      </Animated.View>
    );
  }

  const isMissed =
    !isUpcoming &&
    completionStatus === 'none' &&
    !isCurrentDay &&
    hasCompletionData;
  const opacityStyle = isUpcoming
    ? styles.future
    : isMissed
      ? styles.missed
      : undefined;
  const textStyle = monthPrefix
    ? isCurrentDay
      ? styles.dayTextTodayWithPrefix
      : styles.dayTextWithPrefix
    : isCurrentDay
      ? styles.dayTextToday
      : styles.dayText;

  return (
    <View style={[styles.container, opacityStyle]}>
      <Svg height={RING_SIZE} width={RING_SIZE} style={styles.svg}>
        {rc.todayBorder ? <Circle
            cx={HALF}
            cy={HALF}
            fill='transparent'
            r={RADIUS + STROKE_WIDTH / 2}
            stroke={rc.todayBorder}
            strokeWidth={1}
          /> : null}
        <Circle
          cx={HALF}
          cy={HALF}
          fill={rc.todayBg ?? 'transparent'}
          r={RADIUS}
          stroke={rc.track}
          strokeDasharray={isUpcoming ? '4 4' : undefined}
          strokeWidth={STROKE_WIDTH}
        />
        {progress > 0 ? <AnimatedCircle
            animatedProps={animatedArcProps}
            cx={HALF}
            cy={HALF}
            fill='transparent'
            r={RADIUS}
            stroke={rc.progress}
            strokeDasharray={CIRCUMFERENCE}
            strokeLinecap='round'
            strokeWidth={STROKE_WIDTH}
          /> : null}
      </Svg>
      <View style={styles.centerLabel}>
        {monthPrefix ? <Text
            style={[
              styles.monthPrefixText,
              { color: MONTH_PREFIX_COLORS[isDark ? 'dark' : 'light'] },
            ]}
          >
            {monthPrefix}
          </Text> : null}
        <Text style={[textStyle, { color: rc.text }]}>{dayNumber}</Text>
      </View>
    </View>
  );
};
