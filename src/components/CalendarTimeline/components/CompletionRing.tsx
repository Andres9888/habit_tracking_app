import React, { useEffect, useMemo, useRef } from 'react';
import { Animated, Text } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { fontFamilies, fontWeights } from '@/theme/typography';
import {
  CIRCUMFERENCE,
  GLOW_SHADOW,
  RADIUS,
  RING_COLORS,
  RING_SIZE,
  STROKE_WIDTH,
  getRingGeometry,
  useCelebrationPulse,
} from './CompletionRing.helpers';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

interface CompletionRingProps {
  completed: number;
  total: number;
  reduceMotion?: boolean;
  /** Override default ring size (64px) */
  size?: number;
}

/** Circular progress ring with celebration pulse on 100% completion */
export const CompletionRing: React.FC<CompletionRingProps> = ({
  completed,
  total,
  reduceMotion = false,
  size,
}) => {
  const animatedProgress = useRef(new Animated.Value(0)).current;
  const ratio = total > 0 ? completed / total : 0;
  const isComplete = completed === total && total > 0;
  const scaleAnim = useCelebrationPulse(isComplete, reduceMotion);

  // Use custom geometry when size is provided, otherwise use default constants
  const geom = useMemo(() => (size ? getRingGeometry(size) : null), [size]);
  const s = size ?? RING_SIZE;
  const r = geom?.radius ?? RADIUS;
  const sw = geom?.strokeWidth ?? STROKE_WIDTH;
  const c = geom?.circumference ?? CIRCUMFERENCE;
  const fs = geom?.fontSize ?? 14;

  useEffect(() => {
    if (reduceMotion) {
      animatedProgress.setValue(ratio);
      return;
    }
    Animated.timing(animatedProgress, {
      duration: 600,
      toValue: ratio,
      useNativeDriver: false,
    }).start();
  }, [ratio, animatedProgress, reduceMotion]);

  const strokeDashoffset = animatedProgress.interpolate({
    inputRange: [0, 1],
    outputRange: [c, 0],
  });

  if (total === 0) return null;

  return (
    <Animated.View
      style={{
        width: s,
        height: s,
        alignItems: 'center',
        justifyContent: 'center',
        transform: [{ scale: scaleAnim }],
        ...(isComplete ? GLOW_SHADOW : {}),
      }}
    >
      <Svg height={s} width={s} style={{ transform: [{ rotate: '-90deg' }] }}>
        <Circle
          cx={s / 2}
          cy={s / 2}
          fill='transparent'
          r={r}
          stroke={RING_COLORS.track}
          strokeWidth={sw}
        />
        <AnimatedCircle
          cx={s / 2}
          cy={s / 2}
          fill='transparent'
          r={r}
          stroke={RING_COLORS.progress}
          strokeDasharray={c}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap='round'
          strokeWidth={sw}
        />
      </Svg>
      <Text
        style={{
          color: isComplete ? RING_COLORS.completeText : RING_COLORS.text,
          fontFamily: fontFamilies.primary.text,
          fontSize: fs,
          fontWeight: fontWeights.bold,
          position: 'absolute',
        }}
      >
        {completed}/{total}
      </Text>
    </Animated.View>
  );
};
