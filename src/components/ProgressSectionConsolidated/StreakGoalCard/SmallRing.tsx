/**
 * SmallRing — 72px ring variant for the compact hero.
 */
import React, { useEffect, useMemo } from 'react';
import { Text, View } from 'react-native';
import Svg, { Circle, Defs, LinearGradient, Stop } from 'react-native-svg';
import Animated, {
  Easing,
  useAnimatedProps,
  useReducedMotion,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { colors as staticColors } from '@/theme';
import { durations } from '@/theme/animations';
import { useThemeColors } from '@/theme/ThemeContext';
import { createCompactStyles } from './styles/compact.styles';

interface SmallRingProps {
  percent: number;
}

const RADIUS = 30;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export const SmallRing = React.memo(function SmallRing({ percent }: SmallRingProps) {
  const { colors } = useThemeColors();
  const s = useMemo(() => createCompactStyles(colors), [colors]);
  const clamped = Math.max(0, Math.min(100, percent));
  const reduceMotion = useReducedMotion();
  const progress = useSharedValue(reduceMotion ? clamped : 0);

  useEffect(() => {
    progress.value = reduceMotion
      ? clamped
      : withTiming(clamped, {
          duration: durations.progress,
          easing: Easing.out(Easing.cubic),
        });
  }, [clamped, reduceMotion, progress]);

  const animatedProps = useAnimatedProps(() => ({
    strokeDashoffset: CIRCUMFERENCE - (progress.value / 100) * CIRCUMFERENCE,
  }));

  return (
    <View style={s.ringSmallWrap}>
      <Svg height={72} viewBox="0 0 72 72" width={72}>
        <Defs>
          <LinearGradient id="smallRingGrad" x1="0" x2="1" y1="0" y2="1">
            <Stop offset="0%" stopColor={staticColors.primary[600]} />
            <Stop offset="100%" stopColor={staticColors.streak[500]} />
          </LinearGradient>
        </Defs>
        <Circle
          cx={36}
          cy={36}
          fill="none"
          r={RADIUS}
          stroke={colors.border}
          strokeWidth={5}
        />
        <AnimatedCircle
          animatedProps={animatedProps}
          cx={36}
          cy={36}
          fill="none"
          origin="36,36"
          r={RADIUS}
          rotation={-90}
          stroke="url(#smallRingGrad)"
          strokeDasharray={`${CIRCUMFERENCE}`}
          strokeDashoffset={CIRCUMFERENCE}
          strokeLinecap="round"
          strokeWidth={5}
        />
      </Svg>
      <Text style={s.ringSmallText}>{clamped}%</Text>
    </View>
  );
});
