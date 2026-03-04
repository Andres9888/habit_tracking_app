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
import { Check } from 'lucide-react-native';

import { springs, durations } from '../../../theme/animations';
import type { CompletionStatus } from '../CalendarTimeline.types';
import {
  CIRCUMFERENCE,
  COMPLETE_GLOW,
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
  isCurrentDay: boolean;
  isUpcoming: boolean;
  reduceMotion: boolean;
  isDark: boolean;
}

export const DayCellRing: React.FC<DayCellRingProps> = ({
  dayNumber,
  completed,
  total,
  completionStatus,
  isCurrentDay,
  isUpcoming,
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
    if (isComplete) fillScale.value = withSpring(1, springs.celebration);
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
          <Check color={rc.checkIcon} size={18} strokeWidth={2.5} />
        </View>
      </Animated.View>
    );
  }

  return (
    <View style={[styles.container, isUpcoming && styles.future]}>
      <Svg height={RING_SIZE} width={RING_SIZE} style={styles.svg}>
        <Circle
          cx={HALF}
          cy={HALF}
          fill='transparent'
          r={RADIUS}
          stroke={rc.track}
          strokeWidth={STROKE_WIDTH}
        />
        {progress > 0 && (
          <AnimatedCircle
            animatedProps={animatedArcProps}
            cx={HALF}
            cy={HALF}
            fill='transparent'
            r={RADIUS}
            stroke={rc.progress}
            strokeDasharray={CIRCUMFERENCE}
            strokeLinecap='round'
            strokeWidth={STROKE_WIDTH}
          />
        )}
      </Svg>
      <View style={styles.centerLabel}>
        <Text style={[styles.dayText, { color: rc.text }]}>{dayNumber}</Text>
      </View>
    </View>
  );
};
