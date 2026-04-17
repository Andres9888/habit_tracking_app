/**
 * SmallRing — 72px ring variant for the compact hero.
 */
import React from 'react';
import { Text, View } from 'react-native';
import Svg, { Circle, Defs, LinearGradient, Stop } from 'react-native-svg';
import { colors } from '@/theme';
import { compactStyles as s } from './styles/compact.styles';

interface SmallRingProps {
  percent: number;
}

const RADIUS = 30;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export const SmallRing = React.memo(function SmallRing({ percent }: SmallRingProps) {
  const clamped = Math.max(0, Math.min(100, percent));
  const offset = CIRCUMFERENCE - (clamped / 100) * CIRCUMFERENCE;

  return (
    <View style={s.ringSmallWrap}>
      <Svg height={72} viewBox="0 0 72 72" width={72}>
        <Defs>
          <LinearGradient id="smallRingGrad" x1="0" x2="1" y1="0" y2="1">
            <Stop offset="0%" stopColor={colors.primary[600]} />
            <Stop offset="100%" stopColor={colors.streak[500]} />
          </LinearGradient>
        </Defs>
        <Circle
          cx={36}
          cy={36}
          fill="none"
          r={RADIUS}
          stroke={colors.gray[200]}
          strokeWidth={5}
        />
        <Circle
          cx={36}
          cy={36}
          fill="none"
          origin="36,36"
          r={RADIUS}
          rotation={-90}
          stroke="url(#smallRingGrad)"
          strokeDasharray={`${CIRCUMFERENCE}`}
          strokeDashoffset={offset}
          strokeLinecap="round"
          strokeWidth={5}
        />
      </Svg>
      <Text style={s.ringSmallText}>{clamped}%</Text>
    </View>
  );
});
