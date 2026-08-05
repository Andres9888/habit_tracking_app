import React, { useEffect, useRef } from 'react';
import { Animated, Easing } from 'react-native';

import {
  getCompleteDotGlow,
  getCompletionDotColors,
  COMPLETION_DOT_SIZES,
} from '../CalendarTimeline.styles';
import type { CompletionDotProps } from '../CalendarTimeline.types';
import { useThemeColors } from '../../../theme/ThemeContext';

/** Animated completion indicator dot */
export const CompletionDot: React.FC<CompletionDotProps> = ({
  status,
  reduceMotion = false,
  isToday = false,
}) => {
  const { isDark } = useThemeColors();
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (reduceMotion) {
      scaleAnim.setValue(1);
      return;
    }

    const springAnim = Animated.spring(scaleAnim, {
      friction: 5, tension: 200, toValue: 1, useNativeDriver: true,
    });
    springAnim.start();

    let pulseAnimation: Animated.CompositeAnimation | null = null;
    if (isToday && status !== 'complete' && status !== 'future') {
      pulseAnimation = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            duration: 1000, easing: Easing.inOut(Easing.ease),
            toValue: 1.15, useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            duration: 1000, easing: Easing.inOut(Easing.ease),
            toValue: 1, useNativeDriver: true,
          }),
        ])
      );
      pulseAnimation.start();
    }

    return () => {
      springAnim.stop();
      if (pulseAnimation) pulseAnimation.stop();
      pulseAnim.setValue(1);
    };
  }, [status, reduceMotion, isToday, scaleAnim, pulseAnim]);

  const dotColors = getCompletionDotColors(isDark);
  const color = dotColors[status];
  const size = COMPLETION_DOT_SIZES[status];

  return (
    <Animated.View
      style={{
        backgroundColor: color,
        borderRadius: size / 2,
        height: size,
        transform: [
          { scale: scaleAnim },
          { scale: isToday && status !== 'complete' ? pulseAnim : 1 },
        ],
        width: size,
        ...(status === 'complete' && getCompleteDotGlow(isDark)),
      }}
    />
  );
};
