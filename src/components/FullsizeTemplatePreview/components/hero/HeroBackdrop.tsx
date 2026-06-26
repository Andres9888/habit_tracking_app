/**
 * Premium hero backdrop — a category-themed domed radial wash plus a soft accent
 * halo behind the icon, drawn with react-native-svg (RN has no radial primitive).
 * Static layer; absolutely fills the hero. Sized in pixels from the hero's layout.
 */

import React from 'react';
import { StyleSheet } from 'react-native';
import Svg, { Defs, RadialGradient, Stop, Rect } from 'react-native-svg';
import { colors } from '@/theme';

interface HeroBackdropProps {
  accent: string;
  gradientStart: string;
  gradientEnd: string;
  width: number;
  height: number;
}

export function HeroBackdrop({
  accent,
  gradientStart,
  gradientEnd,
  width,
  height,
}: HeroBackdropProps) {
  if (width <= 0 || height <= 0) return null;
  const cx = width / 2;
  const haloCy = Math.min(150, height * 0.42);
  return (
    <Svg
      width={width}
      height={height}
      pointerEvents='none'
      style={StyleSheet.absoluteFill}
    >
      <Defs>
        <RadialGradient
          id='heroDome'
          cx={cx}
          cy={-height * 0.1}
          r={width}
          gradientUnits='userSpaceOnUse'
        >
          <Stop offset='0' stopColor={gradientStart} />
          <Stop offset='0.45' stopColor={gradientEnd} />
          <Stop offset='0.86' stopColor={colors.gray[50]} />
        </RadialGradient>
        <RadialGradient
          id='heroHighlight'
          cx={cx}
          cy={-height * 0.04}
          r={width * 0.58}
          gradientUnits='userSpaceOnUse'
        >
          <Stop offset='0' stopColor='#FFFFFF' stopOpacity={0.65} />
          <Stop offset='1' stopColor='#FFFFFF' stopOpacity={0} />
        </RadialGradient>
        <RadialGradient
          id='heroHalo'
          cx={cx}
          cy={haloCy}
          r={170}
          gradientUnits='userSpaceOnUse'
        >
          <Stop offset='0' stopColor={accent} stopOpacity={0.22} />
          <Stop offset='0.55' stopColor={accent} stopOpacity={0.08} />
          <Stop offset='1' stopColor={accent} stopOpacity={0} />
        </RadialGradient>
      </Defs>
      <Rect x={0} y={0} width={width} height={height} fill='url(#heroDome)' />
      <Rect x={0} y={0} width={width} height={height} fill='url(#heroHalo)' />
      <Rect x={0} y={0} width={width} height={height} fill='url(#heroHighlight)' />
    </Svg>
  );
}
