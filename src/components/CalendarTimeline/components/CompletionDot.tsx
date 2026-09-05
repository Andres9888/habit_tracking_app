import React, { useEffect } from 'react';
import Animated, {
  Easing,
  cancelAnimation,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

import {
  getCompleteDotGlow,
  getCompletionDotColors,
  COMPLETION_DOT_SIZES,
} from '../CalendarTimeline.styles';
import type { CompletionDotProps } from '../CalendarTimeline.types';
import { useThemeColors } from '../../../theme/ThemeContext';
import { durations, springs } from '@/theme/animations';

/** Animated completion indicator dot */
export const CompletionDot: React.FC<CompletionDotProps> = ({
  status,
  reduceMotion = false,
  isToday = false,
}) => {
  const { isDark } = useThemeColors();
  const scale = useSharedValue(0);
  const pulse = useSharedValue(1);

  useEffect(() => {
    if (reduceMotion) {
      cancelAnimation(scale);
      scale.value = 1;
      cancelAnimation(pulse);
      pulse.value = 1;
      return;
    }

    scale.value = withSpring(1, springs.celebration);

    if (isToday && status !== 'complete' && status !== 'future') {
      pulse.value = withRepeat(
        withSequence(
          withTiming(1.15, {
            duration: durations.loop,
            easing: Easing.inOut(Easing.ease),
          }),
          withTiming(1, {
            duration: durations.loop,
            easing: Easing.inOut(Easing.ease),
          })
        ),
        -1,
        false
      );
    } else {
      cancelAnimation(pulse);
      pulse.value = 1;
    }

    return () => {
      cancelAnimation(scale);
      cancelAnimation(pulse);
      pulse.value = 1;
    };
  }, [status, reduceMotion, isToday, scale, pulse]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: scale.value },
      { scale: isToday && status !== 'complete' ? pulse.value : 1 },
    ],
  }));

  const dotColors = getCompletionDotColors(isDark);
  const color = dotColors[status];
  const size = COMPLETION_DOT_SIZES[status];

  return (
    <Animated.View
      style={[
        {
          backgroundColor: color,
          borderRadius: size / 2,
          height: size,
          width: size,
          ...(status === 'complete' && getCompleteDotGlow(isDark)),
        },
        animatedStyle,
      ]}
    />
  );
};
