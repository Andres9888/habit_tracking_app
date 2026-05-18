/**
 * ChartMilestones — small flag markers on the curve at the first day
 * the strength crossed each MILESTONE_THRESHOLD value.
 */

import React, { useMemo } from 'react';
import { Circle, G } from 'react-native-svg';
import { useThemeColors } from '@/theme/ThemeContext';

import { MILESTONE_THRESHOLDS } from '../constants';
import type { ChartPoint } from './StrengthChart.types';

interface Props {
  points: ChartPoint[];
  color: string;
}

function findFirstCrossing(
  points: ChartPoint[],
  threshold: number
): ChartPoint | null {
  for (const point of points) {
    if (point && (point.strength ?? 0) >= threshold) return point;
  }
  return null;
}

export function ChartMilestones({ points, color }: Props) {
  const { colors } = useThemeColors();
  const markers = useMemo(
    () =>
      MILESTONE_THRESHOLDS.map((threshold) => ({
        threshold,
        point: findFirstCrossing(points, threshold),
      })).filter((m) => m.point != null),
    [points]
  );

  if (markers.length === 0) return null;

  return (
    <G>
      {markers.map(({ threshold, point }) =>
        point ? (
          <Circle
            key={threshold}
            cx={point.x}
            cy={point.y}
            fill={colors.card}
            r={3.5}
            stroke={color}
            strokeWidth={1.6}
          />
        ) : null
      )}
    </G>
  );
}
