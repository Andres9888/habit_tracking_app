/* eslint-disable max-lines */
import React, { useEffect, useRef } from 'react';
import { View, Text } from 'react-native';
import Animated, {
  interpolate,
  interpolateColor,
  useAnimatedProps,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import Svg, { Circle, Line } from 'react-native-svg';
import { Check, Link2 } from 'lucide-react-native';
import { iconSizes } from '@/theme/iconSizes';
import {
  useAnimatedTier,
  resolveTierColor,
  resolveTierShadowColor,
} from '@/hooks/useAnimatedTier';

import { springs, durations } from '../../../theme/animations';
import { getMaterialTier } from '../../HabitChainVisualizer/materialTier';
import type { CompletionStatus } from '../CalendarTimeline.types';
import {
  CIRCUMFERENCE,
  MONTH_PREFIX_COLORS,
  RADIUS,
  RING_SIZE,
  STROKE_WIDTH,
  getAccentFill,
  getAccentStroke,
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
  /** Overall habit-strength percent (0–100). Drives the material tier. */
  strengthPercent?: number;
}

const DayCellRingComponent: React.FC<DayCellRingProps> = ({
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
  strengthPercent,
}) => {
  const isComplete = completionStatus === 'complete';
  const progress = total > 0 ? completed / total : 0;
  const strength = strengthPercent ?? 0;
  const currentTier = getMaterialTier(strength);
  const rc = getRingColors(isDark, isCurrentDay, completionStatus, currentTier);
  const accentStroke = getAccentStroke(isDark);
  const accentFill = getAccentFill(isDark);
  const tierAnim = useAnimatedTier(strength);
  const isAmber =
    isCurrentDay &&
    completionStatus !== 'complete' &&
    completionStatus !== 'future';
  const fillScale = useSharedValue(isComplete ? 1 : 0);
  const arcProgress = useSharedValue(progress);
  const isFirstRenderRef = useRef(true);

  useEffect(() => {
    if (reduceMotion) {
      fillScale.value = 1;
      arcProgress.value = progress;
      isFirstRenderRef.current = false;
      return;
    }

    if (isFirstRenderRef.current) {
      // First render paints the final value instantly — animating from 0
      // reads as a second style pass on cold start. Later changes animate.
      isFirstRenderRef.current = false;
      fillScale.value = isComplete ? 1 : 0;
      arcProgress.value = progress;
      return;
    }

    fillScale.value = isComplete ? withSpring(1, springs.gentle) : 0;
    arcProgress.value = withTiming(progress, { duration: durations.progress });
  }, [isComplete, progress, reduceMotion, fillScale, arcProgress]);

  const animatedArcProps = useAnimatedProps(() => {
    const base = {
      strokeDashoffset: CIRCUMFERENCE * (1 - arcProgress.value),
    };
    if (isAmber || completionStatus !== 'partial') {
      return { ...base, stroke: rc.progress };
    }
    const fromColor = resolveTierColor(tierAnim.from, accentStroke);
    const toColor = resolveTierColor(tierAnim.to, accentStroke);
    return {
      ...base,
      stroke: interpolateColor(
        tierAnim.progress.value,
        [0, 1],
        [fromColor, toColor]
      ),
    };
  });
  const outerGlowStyle = useAnimatedStyle(() => {
    const fromShadow = resolveTierShadowColor(tierAnim.from, accentStroke);
    const toShadow = resolveTierShadowColor(tierAnim.to, accentStroke);
    return {
      transform: [{ scale: fillScale.value }],
      shadowColor: interpolateColor(
        tierAnim.progress.value,
        [0, 1],
        [fromShadow, toShadow]
      ),
      shadowOpacity: interpolate(
        tierAnim.progress.value,
        [0, 1],
        [tierAnim.from.cellShadowOpacity, tierAnim.to.cellShadowOpacity]
      ),
      shadowRadius: interpolate(
        tierAnim.progress.value,
        [0, 1],
        [tierAnim.from.cellShadowRadius + 4, tierAnim.to.cellShadowRadius + 4]
      ),
    };
  });
  const innerFillStyle = useAnimatedStyle(() => {
    const fromColor = resolveTierColor(tierAnim.from, accentFill);
    const toColor = resolveTierColor(tierAnim.to, accentFill);
    return {
      backgroundColor: interpolateColor(
        tierAnim.progress.value,
        [0, 1],
        [fromColor, toColor]
      ),
    };
  });

  if (isComplete) {
    return (
      <Animated.View style={[styles.container, styles.completeGlowBase, outerGlowStyle]}>
        <Animated.View style={[styles.solidFill, innerFillStyle]}>
          {completionIcon === 'chain' ? (
            <Link2
              color={currentTier.iconColor}
              size={iconSizes.medium}
              strokeWidth={2.5}
            />
          ) : (
            <Check
              color={currentTier.iconColor}
              size={iconSizes.medium}
              strokeWidth={2.5}
            />
          )}
        </Animated.View>
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
            strokeDasharray={CIRCUMFERENCE}
            strokeLinecap='round'
            strokeWidth={STROKE_WIDTH}
          /> : null}
        {isMissed ? <Line
            stroke={rc.track}
            strokeLinecap='round'
            strokeWidth={1.5}
            x1={HALF - 5}
            x2={HALF + 5}
            y1={HALF}
            y2={HALF}
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

export const DayCellRing = React.memo(DayCellRingComponent);
