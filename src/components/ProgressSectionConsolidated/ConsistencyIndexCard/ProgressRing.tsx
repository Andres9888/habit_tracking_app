/**
 * ProgressRing Component
 *
 * Circular progress ring using SVG.
 */

import React from 'react';

import Svg, { Circle } from 'react-native-svg';

interface ProgressRingProps {
  progress: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
}

export function ProgressRing({
  progress,
  size = 80,
  strokeWidth = 8,
  color = '#8b5cf6',
}: ProgressRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <Svg
      height={size}
      style={{ transform: [{ rotate: '-90deg' }] }}
      width={size}
    >
      {/* Background circle */}
      <Circle
        cx={size / 2}
        cy={size / 2}
        fill='transparent'
        r={radius}
        stroke='#e7e5e4'
        strokeWidth={strokeWidth}
      />
      {/* Progress circle */}
      <Circle
        cx={size / 2}
        cy={size / 2}
        fill='transparent'
        r={radius}
        stroke={color}
        strokeDasharray={circumference}
        strokeDashoffset={strokeDashoffset}
        strokeLinecap='round'
        strokeWidth={strokeWidth}
      />
    </Svg>
  );
}
