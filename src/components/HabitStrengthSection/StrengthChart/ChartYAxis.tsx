/**
 * ChartYAxis — renders the Y-axis labels (0/50/85/100) and the dashed
 * 85% "habit-formed" target threshold line.
 */

import React from 'react';
import { G, Line, Text as SvgText } from 'react-native-svg';
import { useThemeColors } from '@/theme/ThemeContext';

import {
  CHART_HEIGHT,
  CHART_PADDING_BOTTOM,
  CHART_PADDING_LEFT,
  CHART_PADDING_TOP,
  CHART_PADDING_X,
  HABIT_FORMED_THRESHOLD,
  getStrengthColors,
} from '../constants';

interface Props {
  chartWidth: number;
}

const Y_LABELS = [
  { value: 100, label: '100' },
  { value: HABIT_FORMED_THRESHOLD, label: '85%' },
  { value: 50, label: '50' },
  { value: 0, label: '0' },
];

function yForStrength(strength: number): number {
  const chartAreaHeight = CHART_HEIGHT - CHART_PADDING_TOP - CHART_PADDING_BOTTOM;
  return CHART_PADDING_TOP + chartAreaHeight * (1 - strength / 100);
}

export function ChartYAxis({ chartWidth }: Props) {
  const { colors } = useThemeColors();
  const strengthColors = getStrengthColors(colors);
  const formedColor = strengthColors.strong.primary;
  const tickColor = colors.text.tertiary;
  const lineRight = chartWidth - CHART_PADDING_X;
  const targetY = yForStrength(HABIT_FORMED_THRESHOLD);

  return (
    <G>
      {Y_LABELS.map(({ value, label }) => (
        <SvgText
          key={value}
          fill={value === HABIT_FORMED_THRESHOLD ? formedColor : tickColor}
          fontSize={9}
          fontWeight={value === HABIT_FORMED_THRESHOLD ? '600' : '400'}
          textAnchor='end'
          x={CHART_PADDING_LEFT - 6}
          y={yForStrength(value) + 3}
        >
          {label}
        </SvgText>
      ))}
      <Line
        opacity={0.55}
        stroke={formedColor}
        strokeDasharray='3,3'
        strokeWidth={1.2}
        x1={CHART_PADDING_LEFT}
        x2={lineRight}
        y1={targetY}
        y2={targetY}
      />
      <SvgText
        fill={formedColor}
        fontSize={8.5}
        fontWeight='600'
        x={CHART_PADDING_LEFT + 4}
        y={targetY - 4}
      >
        habit-formed
      </SvgText>
    </G>
  );
}
